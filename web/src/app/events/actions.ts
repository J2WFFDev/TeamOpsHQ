'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createEvent(prev: unknown, form: FormData) {
  const teamId = parseInt(String(form.get('teamId') || '0') || '0')
  const title = String(form.get('title') || '')
  const startsAt = new Date(String(form.get('startsAt') || ''))
  const endsAt = new Date(String(form.get('endsAt') || ''))
  const location = String(form.get('location') || '')
  if (!teamId || !title || isNaN(startsAt.getTime()) || isNaN(endsAt.getTime())) {
    return { error: 'Missing or invalid fields' }
  }
  // Create an Element of type event, then attach a CalendarEvent
  const { getPrisma } = await import('@/lib/getPrisma')
  const p = getPrisma()
  const element = await p.element.create({ data: {
    type: 'event',
    title,
    status: 'open',
    createdBy: 1, // seed user id; replace with auth lookup later
    detailsJson: { $type: 'event', $v: 1 },
  }})
  await p.calendarEvent.create({ data: {
    elementId: element.id,
    startAt: startsAt,
    endAt: endsAt,
    locationName: location,
    recurrence: null,
    visibility: 'team'
  } })
  revalidatePath('/events')
  return { ok: true }
}