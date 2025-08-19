'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createEvent(prev: unknown, form: FormData) {
  const teamId = String(form.get('teamId') || '')
  const title = String(form.get('title') || '')
  const startsAt = new Date(String(form.get('startsAt') || ''))
  const endsAt = new Date(String(form.get('endsAt') || ''))
  const location = String(form.get('location') || '')
  if (!teamId || !title || isNaN(startsAt.getTime()) || isNaN(endsAt.getTime())) {
    return { error: 'Missing or invalid fields' }
  }
  await prisma.event.create({ data: { teamId, title, startsAt, endsAt, location } })
  revalidatePath('/events')
  return { ok: true }
}