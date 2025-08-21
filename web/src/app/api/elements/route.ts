import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
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
    const text = body.text ?? null
    const startsAt = body.startsAt ? new Date(body.startsAt) : null
    const endsAt = body.endsAt ? new Date(body.endsAt) : null
    const location = body.location ?? null

  const element = await prisma.element.create({ data: {
      type,
      title: title ? String(title).slice(0, 240) : null,
      detailsJson: { $type: type, $v: 1, body_md: text ?? null },
      createdBy: 1,
    } })

    // If this is an event with times provided, create a CalendarEvent
    if (type === 'event' && startsAt && endsAt) {
      await prisma.calendarEvent.create({ data: {
        elementId: element.id,
        startAt: startsAt,
        endAt: endsAt,
        locationName: location ?? null,
        visibility: 'team'
      } })
    }

    return NextResponse.json({ element })
  } catch (err) {
    console.error('create element failed', err)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
