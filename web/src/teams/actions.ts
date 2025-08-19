'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const createTeamSchema = z.object({
  programId: z.string().min(1),
  name: z.string().min(2).max(80),
})

export async function createTeam(prevState: unknown, formData: FormData) {
  const programId = String(formData.get('programId') || '')
  const name = String(formData.get('name') || '')
  const parsed = createTeamSchema.safeParse({ programId, name })
  if (!parsed.success) return { error: 'Invalid input' }
  try {
    await prisma.team.create({ data: { programId, name } })
    revalidatePath('/teams')
    return { ok: true }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e)
    return { error: message || 'Failed to create team' }
  }
}