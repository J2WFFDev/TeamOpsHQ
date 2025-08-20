import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const notes = await prisma.note.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ notes })
  } catch (err) {
    console.error('notes list failed', err)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
