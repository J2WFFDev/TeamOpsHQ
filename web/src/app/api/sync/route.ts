import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const actions = body.actions || []
    const applied: number[] = []

    for (const a of actions) {
      // simple action shape: { id, type, payload, createdAt }
      if (a.type === 'create_note' || a.type === 'create_item') {
        try {
          const payload = a.payload || {}
      const athleteId = payload.athleteId || null
      const text = payload.text || ''
      const mediaPath = payload.mediaPath || null
      const attachmentIds = payload.attachmentIds || payload.attachmentId ? (Array.isArray(payload.attachmentIds) ? payload.attachmentIds : [payload.attachmentId]) : []
      const itemType = payload.itemType || 'NOTE'
      const dueDate = payload.dueDate ? new Date(payload.dueDate) : null
      const assignedTo = payload.assignedTo || null
      const tags = payload.tags ? (Array.isArray(payload.tags) ? payload.tags.join(',') : String(payload.tags)) : null
      const decisionRationale = payload.decisionRationale || null
      const decisionOutcome = payload.decisionOutcome || null
      // Persist into the new Note model
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const note = await prisma.note.create({ data: { athleteId, text, createdAt: new Date(a.createdAt), mediaPath, type: itemType as any, status: 'NEW', tags, dueDate: dueDate as any, assignedTo, decisionRationale, decisionOutcome } as any })

      // If there are attachment IDs recorded from the upload step, link them to this note
      if (attachmentIds && attachmentIds.length) {
        // prisma client may not have typed property for mediaAttachment in generated types here; use any to be safe
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const p = prisma as any
        await p.mediaAttachment.updateMany({ where: { id: { in: attachmentIds } }, data: { itemId: note.id } })
      }
      applied.push(a.id)
        } catch (err) {
          console.error('failed to apply action', err)
        }
      } else {
        // unknown type: mark as applied to avoid blocking the queue
        applied.push(a.id)
      }
    }

    return NextResponse.json({ applied })
  } catch (err) {
    console.error(err)
    return new NextResponse('error', { status: 500 })
  }
}
