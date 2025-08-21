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
  // Persist as an Element (note/item) and attach attachments
  const { getPrisma } = await import('@/lib/getPrisma')
  const p = getPrisma()
  const element = await p.element.create({ data: {
        type: (itemType || 'note').toLowerCase(),
        title: text?.slice(0, 120) || null,
        detailsJson: { $type: (itemType || 'note').toLowerCase(), $v: 1, body_md: text },
        createdBy: 1,
        createdAt: new Date(a.createdAt)
      } })

      // Link attachments to the element
      if (attachmentIds && attachmentIds.length) {
        await p.attachment.updateMany({ where: { id: { in: attachmentIds } }, data: { elementId: element.id } })
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
