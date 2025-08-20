import React from 'react'
import { prisma } from '@/lib/prisma'

export default async function GalleryPage() {
  // server component: query Prisma directly
  type NoteServer = { id: string; athleteId: string | null; text: string; createdAt: Date; mediaPath?: string | null }
  const raw = await prisma.note.findMany({ orderBy: { createdAt: 'desc' } })
  const notes: NoteServer[] = raw as unknown as NoteServer[]

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Attachments Gallery</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {notes.map(n => (
          <div key={n.id} className="bg-white rounded shadow p-2">
      { n.mediaPath ? <img src={n.mediaPath} alt="attachment" className="w-full object-cover h-40 rounded" /> : <div className="h-40 bg-gray-100 flex items-center justify-center">No image</div>}
            <div className="mt-2 text-sm text-gray-700">{n.text}</div>
            <div className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
