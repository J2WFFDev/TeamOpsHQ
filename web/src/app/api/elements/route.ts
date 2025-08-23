import { NextResponse } from 'next/server'
import { getPrisma } from '@/lib/getPrisma'

export async function GET(req: Request) {
  try {
  const prisma = getPrisma()
    const url = new URL(req.url)
    const type = url.searchParams.get('type')
    const allowed = ['task','decision','event','journal','note','coach_note','habit','bucket_list']
    const where = type && allowed.includes(type.toLowerCase()) ? { type: type.toLowerCase() as any } : undefined
  const elements = await prisma.element.findMany({ where, orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ elements })
  } catch (err) {
    console.error('elements list failed', err)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const type = (body.type || 'note').toString().toLowerCase()
    const title = body.title ?? null

    // Accept a full detailsJson payload from the client when present
    const detailsJson = body.detailsJson ?? { $type: type, $v: 1, body_md: (body.text ?? null) }

  const prisma = getPrisma()

  const element = await prisma.element.create({ data: {
      type,
      title: title ? String(title).slice(0, 240) : null,
      detailsJson,
      createdBy: 1,
    } })

    // If this is an event and detailsJson contains start/end, create a CalendarEvent
    try {
      if (type === 'event' && detailsJson) {
        const s = detailsJson.startsAt ? new Date(detailsJson.startsAt) : null
        const e = detailsJson.endsAt ? new Date(detailsJson.endsAt) : null
        const loc = detailsJson.locationName ?? detailsJson.location ?? null
        if (s && e) {
          await prisma.calendarEvent.create({ data: {
            elementId: element.id,
            startAt: s,
            endAt: e,
            locationName: loc,
            visibility: 'team'
          } })
        }
      }
    } catch (err) {
      // Non-fatal: log and continue
      console.error('calendar event create failed', err)
    }

    return NextResponse.json({ element })
  } catch (err) {
    console.error('create element failed', err)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const prisma = getPrisma()
    const id = body.id
    if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 })
    const data: any = {}
    if ('title' in body) data.title = body.title
    if ('detailsJson' in body) data.detailsJson = body.detailsJson

    const element = await prisma.element.update({ where: { id: Number(id) }, data })
    return NextResponse.json({ element })
  } catch (err) {
    console.error('patch element failed', err)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
