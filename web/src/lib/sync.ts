import { db } from './dexie'

export type CreateNotePayload = {
  athleteId?: string | null
  text?: string
  noteCreatedAt?: number
  attachmentId?: number
  mediaPath?: string
}

export type PendingActionShape = {
  id?: number
  type: string
  payload: CreateNotePayload | Record<string, unknown>
  createdAt: number
}

export async function drainPendingActions(batchSize = 20) {
  const rawActions = await db.pendingActions.orderBy('createdAt').limit(batchSize).toArray()
  const actions: PendingActionShape[] = rawActions.map((r: unknown) => r as PendingActionShape)
  if (!actions.length) return { sent: 0, actions: [] }

  // Before sending, look for any attachments referenced by actions and upload them
  const actionsToSend = JSON.parse(JSON.stringify(actions)) as PendingActionShape[]
  for (const a of actionsToSend) {
    try {
      const payload = (a.payload || {}) as CreateNotePayload
      if (payload?.attachmentId) {
        // fetch attachment from IndexedDB
        const att = await db.mediaAttachments.get(payload.attachmentId)
        if (att && att.blob && !att.uploaded) {
          try {
            const form = new FormData()
            form.append('file', att.blob as Blob, att.name || 'upload.jpg')
            // upload to server
            const up = await fetch('/api/uploads', { method: 'POST', body: form })
            if (up.ok) {
              const j = await up.json()
              // expect { mediaPath: '/uploads/...' }
              if (j?.mediaPath) {
                // mark attachment uploaded and store mediaPath
                await db.mediaAttachments.update(att.id!, { uploaded: true, mediaPath: j.mediaPath })
                payload.mediaPath = j.mediaPath
                // remove attachmentId from payload to avoid re-upload
                delete payload.attachmentId
              }
            }
          } catch (err) {
            // leave it for next sync
            console.error('upload failed', err)
          }
        } else if (att?.uploaded && att?.mediaPath) {
          // already uploaded: attach the mediaPath
          payload.mediaPath = att.mediaPath
          delete payload.attachmentId
        }
      }
    } catch (err) {
      console.error('preparing action failed', err)
    }
  }

  // send to server
  const res = await fetch('/api/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actions: actionsToSend })
  })

  if (!res.ok) throw new Error('sync failed')

  const result = await res.json()

  // remove successfully applied action ids
  if (result?.applied && Array.isArray(result.applied) && result.applied.length) {
    await db.pendingActions.where('id').anyOf(result.applied).delete()
  }

  return { sent: actions.length, applied: result?.applied || [], actions }
}

export async function markNotesSyncedByActionCreatedAt(actionCreatedAtList: number[]) {
  if (!actionCreatedAtList?.length) return
  for (const createdAt of actionCreatedAtList) {
    const note = await db.notes.where('createdAt').equals(createdAt).first()
    if (note?.id) {
      await db.notes.update(note.id, { synced: true })
    }
  }
}

export async function registerBgSync() {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return false
  try {
    const reg = await navigator.serviceWorker.ready
    if ('sync' in reg) {
      try {
        // @ts-expect-error: background sync typings may be missing in older libs
        await reg.sync.register('sync-pending-actions')
        return true
      } catch {
        // registration failed (maybe already registered)
        return false
      }
    }
  } catch {
    return false
  }
  return false
}
