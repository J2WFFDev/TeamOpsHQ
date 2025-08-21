# prd\_elements\_workspace.md (inline)

```markdown
# PRD — Elements Workspace (Tasks, Decisions, Events, Journals, Notes, Coach Notes, Habits, Bucket List)

## 1. Mission & Problem Statement
Provide a single, flexible workspace where individuals and teams can **capture, plan, and review** work and learning—spanning tasks, decisions, calendar events, coaching, habits, and journals—without switching tools or losing context.

## 2. Objectives & Success Metrics
- **Fewer tool switches**: 30% reduction in context switches (self-reported + telemetry).
- **Decision throughput**: 25% increase in active decisions closed per month.
- **Habit adherence**: 50% of users maintain 4+ week streaks on ≥1 habit.
- **Task lead time**: 20% reduction in planned→completed cycle time.
- **Adoption**: 60% WAU by week 6 for pilot orgs.

## 3. Personas
- **PM/Coach (power user)**: plans programs, tracks progress, leaves coach notes to squads.
- **Individual contributor/athlete**: executes tasks, logs habits, journals, views quick refs.
- **Team lead**: reviews decisions, schedules events, monitors squad progress.

## 4. Scope (v1)
**In:** Element model (types: task, decision, event, journal, note, coach_note, habit, bucket_list), lists, quick-reference view, calendar index, prompts, squads, progress logging, version history, activity feed, notifications (basic), OKR linking.  
**Out:** Advanced Gantt, complex resource leveling, external calendar sync write-back, SSO, deep analytics (phase 2).

## 5. Use Cases & User Stories
- Capture a quick note with code and mark as Quick Reference; retrieve it during a call.
- Create a decision, pin it to header for stakeholders, attach options and KRs, later mark implemented.
- Schedule a practice event tied to a program plan step; attendees RSVP.
- Track a habit (water plants every Wednesday); missed weeks auto-skip, no double-up next week.
- Create an epic task with shared profile; children inherit defaults; progress rolls up via logs.
- Coach issues a note to a receivers squad; athletes see action items and linked tasks.

## 6. Functional Requirements
### 6.1 Elements CRUD
- Create/edit/archive/soft-delete; status includes `completed` and `deleted`.
- Quick Reference toggle + optional `quick_code` for fast search.
- Version every change (append-only revisions); restore from any revision.

### 6.2 Lists & Views
- Custom lists per org/program/team; optional multi-list membership.
- Dedicated Bucket List list type and element type.
- Saved views (filters) by type/status/date/tags/list/squad.

### 6.3 Decisions
- Fields: status (`active|on_hold|approved|rejected|implemented|retired`), `pin_header`, options, rationale, owners/stakeholders, OKR ties.
- Header surfaces active or pinned decisions per user.

### 6.4 Events
- Subtypes: meeting, game/match (series-aware), practice (program-step-aware).
- Attendees (users/contacts), reminders, resources; calendar index for fast queries.

### 6.5 Journals
- Modes: freestyle, morning prompts, weekly reflections, custom prompts.
- Prompt sets scoped to org/program/team/user; link entries to prompts used.

### 6.6 Coach Notes
- Subjects: athlete/team/squad; audiences: users/squads/teams; confidentiality controls.
- Action items generate/link tasks; progress optionally logged.

### 6.7 Habits
- Cadence + RRULE schedule; miss policy (`ignore|ask|auto_skip`) and `skip_behavior` (`skip_forward|catch_up`).
- Streaks and logs; optional auto-complete when target met.

### 6.8 Progress
- Neutral `ProgressLog` with unit/value/target; rollups per element; chart sparklines.
- KR progress via OKR tables; decisions show linked KRs.

### 6.9 Identity & Roles
- Org→Program→Team→Squad; many-to-many user membership; role checks at each layer.

### 6.10 Activity Feed & Notifications
- Feed verbs include created/updated/status_changed/completed/deleted/restored/commented/linked.
- Basic notifications: reminders, mentions, assignments, decision reviews.

## 7. Non-Functional Requirements
- **Performance**: P95 < 150ms on common reads (list, calendar, quick ref).
- **Reliability**: zero data loss on revisions; soft delete + restore.
- **Security**: RBAC scoped by org/program/team/squad; PII minimal in logs.
- **Portability**: dev on SQLite; prod on MySQL/Postgres via adapters.
- **Search**: text index on Element.title/body + tags; optional external search later.

## 8. Data Model Summary
- See `element_model_v2.md` for full outline.
- Core table: **Element** with `details_json` typed payload; support tables for lists/tags/links, squads, progress, prompts, calendar, feed, OKR, versioning.

## 9. Versioning Strategy
- Append-only **ElementRevision** per change; optional JSON Patch storage; restore by writing a new revision as a copy of the old snapshot; optimistic locking via `rev_num`.

## 10. Permissions & Visibility
- Element visibility derives from owning org/program/team/squad and list membership; feed & calendar respect visibility; coach_note honors confidentiality.

## 11. Open Questions
- Exact reminder channels in v1 (app, email, SMS)?
- External calendar sync (iCal/Google) timing—v1 or v2?
- Do we allow cross-org shared squads?
- Do we need custom units in Progress beyond count/minutes/percent in v1?

## 12. Rollout Plan
- Phase 1: Notes/Tasks/Decisions/Habits + Quick Ref + Lists + Feed + Versioning.
- Phase 2: Events (series), Prompts, Coach Notes to squads, OKR views, richer analytics.
- Phase 3: External integrations (calendar write-back, email ingestion), SSO.

## 13. Appendix — PRD Composition Guidance
- **Should mission & use cases be in the PRD?** Yes. A PRD typically includes **mission/problem**, **goals**, **personas**, **use cases**, **requirements**, **NFRs**, and **success metrics**. If you maintain a separate Mission/Strategy doc, reference it; don’t duplicate detailed strategy.
- **Is the elements model in DDL or “DTL”?** The current model is an **outline/spec**, not DDL. “DTL” isn’t a standard term; you likely mean **DML** (data manipulation) or a **type language** (TypeScript/JSON Schema). For implementation you’ll want:
  - **DDL**: SQL schema for your chosen DB (MySQL/Postgres/SQLite).
  - **Type Definitions**: TypeScript interfaces and/or JSON Schema for validation.
  - **Migrations**: evolvable scripts (Prisma/Knex/Flyway, etc.).
- **Do we need DDL now?** Not for the PRD itself. For v1 implementation readiness, yes. After you sign off on this PRD + model, we can generate DDL for MySQL and a Prisma schema, plus TS types and JSON Schemas.
```

If you want me to also generate **real TypeScript `interface` files** and **SQL DDL** (MySQL or Postgres) right now, say which DB you’re targeting and I’ll output runnable files you can paste into VS Code.
