import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    // Use the built-in formData parser in Node runtime
    const form = await req.formData()
    const file = form.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'no file' }, { status: 400 })

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const ext = (file.name?.split('.').pop()) || 'jpg'
    const filename = `upload_${Date.now()}_${Math.random().toString(36).slice(2,8)}.${ext}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })
    const filePath = path.join(uploadDir, filename)
    fs.writeFileSync(filePath, buffer)

    const mediaPath = `/uploads/${filename}`

    // Persist metadata in MediaAttachment
    const attachment = await prisma.mediaAttachment.create({ data: {
      path: mediaPath,
      mime: file.type || null,
      size: buffer.length,
    }})

    return NextResponse.json({ mediaPath, attachmentId: attachment.id })
  } catch (err) {
    console.error('upload route failed', err)
    return NextResponse.json({ error: 'upload failed' }, { status: 500 })
  }
}
