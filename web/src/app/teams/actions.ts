'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const createTeamSchema = z.object({
  programId: z.string().optional(),
  name: z.string().min(2).max(80),
})

export async function createTeam(prevState: unknown, formData: FormData) {
  const programIdRaw = String(formData.get('programId') || '')
  const programId = programIdRaw ? parseInt(programIdRaw, 10) : null
  const name = String(formData.get('name') || '')
  const parsed = createTeamSchema.safeParse({ programId: programIdRaw || undefined, name })
  if (!parsed.success) return { error: 'Invalid input' }
  try {
    const p = (await import('@/lib/getPrisma')).getPrisma()
    await p.team.create({ data: { programId: programId ?? undefined, name } })
    revalidatePath('/teams')
    return { ok: true }
  } catch (e: unknown) {
    // Safely extract message if it's an Error, otherwise stringify
    const message = e instanceof Error ? e.message : String(e)
    return { error: message || 'Failed to create team' }
  }
}