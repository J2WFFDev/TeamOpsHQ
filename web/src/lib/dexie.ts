import Dexie from 'dexie'

export interface PendingAction {
  id?: number
  type: string
  payload: unknown
  createdAt: number
}

// Local representation of an Element in IndexedDB (client-side)
export interface ElementRecord {
  id?: number
  athleteId?: string | null
  title?: string | null
  text?: string | null
  createdAt: number
  synced?: boolean
  mediaPath?: string | null
  // keep legacy uppercase values for UI, server sync will normalize
  type?: 'NOTE' | 'TASK' | 'JOURNAL' | 'DECISION' | string
  status?: 'NEW' | 'REVIEWED' | 'DONE' | string
  version?: number
  tags?: string[]
  dueDate?: number | null
  assignedTo?: string | null
  decisionRationale?: string | null
  decisionOutcome?: string | null
}

export interface AttachmentRecord {
  id?: number
  // client-side temporary key linking to the element: createdAt timestamp
  noteCreatedAt?: number | null
  // local element id (numeric) if available
  elementLocalId?: number | null
  name?: string
  type?: string
  blob?: Blob | null
  createdAt: number
  uploaded?: boolean
  mediaPath?: string | null
  size?: number | null
  uploadedAt?: number | null
}

class AppDB extends Dexie {
  pendingActions!: Dexie.Table<PendingAction, number>
  elements!: Dexie.Table<ElementRecord, number>
  attachments!: Dexie.Table<AttachmentRecord, number>

  constructor() {
    super('TeamOpsHQDB')
    // Existing history: versions 1 and 2 used notes/mediaAttachments
    this.version(1).stores({
      pendingActions: '++id, type, createdAt',
      // legacy stores (created previously)
      notes: '++id, athleteId, createdAt, synced',
      mediaAttachments: '++id, noteCreatedAt, createdAt, uploaded'
    })

    this.version(2).stores({
      pendingActions: '++id, type, createdAt',
      notes: '++id, athleteId, createdAt, synced, type, status, version',
      mediaAttachments: '++id, noteCreatedAt, createdAt, uploaded, mediaPath'
    })

    // Version 3 migrates legacy notes/mediaAttachments -> elements/attachments
    this.version(3).stores({
      pendingActions: '++id, type, createdAt',
      elements: '++id, createdAt, type, createdAt, athleteId',
      attachments: '++id, noteCreatedAt, elementLocalId, createdAt, uploaded'
    }).upgrade(async (trans) => {
      // Gracefully handle if legacy tables don't exist
      try {
        const legacyNotes = await trans.table('notes').toArray().catch(() => [])
        const noteMap = new Map<number, number>()
        for (const n of legacyNotes) {
          try {
            const newId = await trans.table('elements').add({
              athleteId: n.athleteId,
              text: n.text,
              createdAt: n.createdAt,
              synced: n.synced ?? false,
              mediaPath: n.mediaPath ?? null,
              type: n.type ?? 'NOTE',
              status: n.status ?? 'NEW',
              version: n.version ?? 1,
              tags: n.tags ?? [],
              dueDate: n.dueDate ?? null,
              assignedTo: n.assignedTo ?? null,
              decisionRationale: n.decisionRationale ?? null,
              decisionOutcome: n.decisionOutcome ?? null
            })
            if (typeof newId === 'number') noteMap.set(n.createdAt, newId)
          } catch (err) {
            // ignore single-record failures
          }
        }

        const legacyAttachments = await trans.table('mediaAttachments').toArray().catch(() => [])
        for (const a of legacyAttachments) {
          try {
            const elementLocalId = noteMap.get(a.noteCreatedAt ?? 0) ?? null
            await trans.table('attachments').add({
              noteCreatedAt: a.noteCreatedAt ?? null,
              elementLocalId,
              name: a.name,
              type: a.type,
              blob: a.blob,
              createdAt: a.createdAt,
              uploaded: a.uploaded ?? false,
              mediaPath: a.mediaPath ?? null,
              size: a.size ?? null,
              uploadedAt: a.uploadedAt ?? null
            })
          } catch (err) {
            // ignore
          }
        }
      } catch (err) {
        // If legacy tables are missing, nothing to migrate
      }
    })
  }
}

export const db = new AppDB()
