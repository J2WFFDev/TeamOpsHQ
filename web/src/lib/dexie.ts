import Dexie from 'dexie'

export interface PendingAction {
  id?: number
  type: string
  payload: unknown
  createdAt: number
}

export interface NoteRecord {
  id?: number
  athleteId: string
  text: string
  createdAt: number
  synced?: boolean
  mediaPath?: string | null
  type?: 'NOTE' | 'TASK' | 'JOURNAL' | 'DECISION'
  status?: 'NEW' | 'REVIEWED' | 'DONE'
  version?: number
  tags?: string[]
  dueDate?: number | null
  assignedTo?: string | null
  decisionRationale?: string | null
  decisionOutcome?: string | null
}

export interface MediaAttachmentRecord {
  id?: number
  noteCreatedAt?: number | null // tie to the note's createdAt (client-side temporary key)
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
  notes!: Dexie.Table<NoteRecord, number>
  mediaAttachments!: Dexie.Table<MediaAttachmentRecord, number>

  constructor() {
    super('TeamOpsHQDB')
    // bumping to version 2 to add fields and new stores
    this.version(1).stores({
      pendingActions: '++id, type, createdAt',
      notes: '++id, athleteId, createdAt, synced',
      mediaAttachments: '++id, noteCreatedAt, createdAt, uploaded'
    })
    this.version(2).stores({
      pendingActions: '++id, type, createdAt',
      notes: '++id, athleteId, createdAt, synced, type, status, version',
      mediaAttachments: '++id, noteCreatedAt, createdAt, uploaded, mediaPath'
    })
  }
}

export const db = new AppDB()
