# TeamOpsHQ — Data Model and Sync Plan

This document describes the current data model decisions, the offline-first sync contract, identified issues, and the recommended migration plan and next steps.

## Overview
- Database: SQLite for local development (`prisma/dev.db`). Prisma is used as the ORM. Production should use Postgres or another managed relational DB.
- Primary server model (current): `Note` — used as a generic item container for notes, tasks, decisions, and journals.
- Client offline store: IndexedDB via Dexie with stores: `pendingActions`, `notes` and `mediaAttachments`.

## Current server schema (high level)
- `Note` table (now extended): fields include id, athleteId, text, createdAt, mediaPath, type, status, tags, dueDate, assignedTo, decisionRationale, decisionOutcome, updatedAt

## Identified problems
- Overloaded `Note` table mixes multiple concerns (notes, tasks, decisions).
- `tags` stored as comma-separated string — poor for querying and indexing.
- `mediaPath` is only a string on Note — no metadata for attachments (mime, size, uploadedAt).
- No optimistic concurrency/versioning for updates.
- Limited indexing for common queries (type/status, athleteId, dueDate, assignedTo).

## Goals for improved model
1. Make attachments first-class: `MediaAttachment` with metadata and an `itemId` FK.
2. Use explicit `Item` model (or rename `Note` → `Item`) with a typed enum: NOTE | TASK | DECISION | JOURNAL.
3. Add `version` (Int) for optimistic concurrency and use `updatedAt` for LWW fallback where appropriate.
4. Normalize tags (Tag + ItemTag) or, as a lower-effort step, store tags as JSON for easier transition to Postgres JSONB.
5. Add indexes for common queries.

## Sync & conflict resolution strategy
Because this is offline-first, the sync contract must be explicit:

Client responsibilities
- Create items with a temporary client-generated id (cid).
- Save locally (Dexie) and queue an action { id: cid, type: 'create_item', createdAt, payload }.
- For updates, client includes the last-known server version (or updatedAt) in the payload: { cid, type: 'update_item', payload: { ... }, baseVersion }.

Server responsibilities
- For create actions:
  - Create server Item row and return mapping { clientId: cid, serverId: sid, createdAt, updatedAt, version }.
  - If attachments are included as ids referencing Dexie media records, server first receives multipart uploads, writes attachments, then creates Item referencing attachments.
- For update actions:
  - Use optimistic concurrency: if client baseVersion !== server.version, return a 409/merge response with server copy and suggested merge strategy (client may re-apply changes). Simpler: last-writer-wins based on updatedAt + server truth.
- For delete actions:
  - Soft-delete with `deletedAt` and `deletedBy` to preserve audit info.

Conflict resolution policies (pick one per project)
- Simple (fast): Last-writer-wins (based on authoritative server timestamp). Low overhead but may overwrite client edits.
- Safer (recommended for collaborative features): Optimistic concurrency with version numbers + merge UI — server rejects conflicting updates and returns server state for client to resolve.
- Advanced: CRDTs or operational transforms — high implementation cost; only if you need multi-client real-time merges.

## Tags & searching
- Normalize tags if you want query/index benefits and consistent tag names (Tag + ItemTag join).
- If simple tagging is enough, keep JSON array field in the Item (Postgres JSONB) or comma string for SQLite dev, but this prevents indexing on tags.
- Full-text search: use FTS5 in SQLite for dev, and a Postgres tsvector or an external index (Elastic/Algolia) for production.

## Attachments
- Keep attachments as first-class objects (MediaAttachment) not just a path string.
- Save metadata (mime/size/origin filename). Avoid saving user-uploaded file names directly to public path — sanitize filenames and use random file names or signed URLs.
- Consider storing attachments on S3 (or similar) in production and using a CDN. Save provider metadata in the MediaAttachment row.

## Migration plan and practical steps (what I can do now)
Short-term (low risk)
- Add `MediaAttachment` model in Prisma and migration (new table only).
- Add `version Int @default(1)` to `Note` (Item) and keep `updatedAt` (we already added updatedAt).
- Add indexes on `athleteId`, `(type, status)`, and `dueDate`.

Medium-term
- Introduce `Tag` and `ItemTag` (or `tagsJson`) and migrate existing comma-separated tags into normalized rows or JSON.
- Update `/api/sync` to return client→server ID mappings for create actions and add `update_item` handling using `version`.

Long-term
- Consider Postgres in production; move to JSONB (for tags or flexible fields) and full-text search for content.
- S3 or object storage for attachments and signed URLs.

## API contract summary (`/api/sync`)
- POST body: { actions: [ { id, type, createdAt, payload } ] }
- Response: { applied: [ <clientId> ], mapping?: [ { clientId, serverId, version } ] }

## Migration safety notes
- Always backup `prisma/dev.db` before running migrations. Example:
  ```powershell
  Copy-Item .\prisma\dev.db .\prisma\dev.db.bak -Force
  ```
- For non-nullable column additions, prefer create-only migrations, edit SQL to backfill existing rows, then apply (this repo followed that pattern for `updatedAt`).

## Next actionable tasks I can implement now
1. Implement the `MediaAttachment` model + migration and update `/api/uploads` to persist metadata.
2. Add `version Int` to `Note` with migration and implement optimistic-update support in `/api/sync`.
3. Normalize tags or add `tagsJson` column as an intermediate step.

If you want I can open a PR with these docs and the code changes (migrations + server updates) on `feature/prisma-add-item-fields` branch. Let me know which of the next tasks (1/2/3 or “all”) to start.

---
Created by the developer workflow during the PWA/offline implementation iteration. If anything should be corrected or expanded, tell me which sections to elaborate.
