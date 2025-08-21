import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
  // Return elements of type 'note'
  const { getPrisma } = await import('@/lib/getPrisma')
  const p = getPrisma()
  const notes = await p.element.findMany({ where: { type: 'note' }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ notes })
  } catch (err) {
    console.error('notes list failed', err)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
