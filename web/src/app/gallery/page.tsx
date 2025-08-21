import React from 'react'
import { prisma } from '@/lib/prisma'

export default async function GalleryPage() {
  // server component: query Prisma directly
  // Show attachments with optional linked element title
  const raw = await prisma.attachment.findMany({ orderBy: { id: 'desc' }, include: { element: true } })

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Attachments Gallery</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {raw.map(a => (
          <div key={a.id} className="bg-white rounded shadow p-2">
            { a.urlOrPath ? <img src={a.urlOrPath} alt={a.name} className="w-full object-cover h-40 rounded" /> : <div className="h-40 bg-gray-100 flex items-center justify-center">No image</div>}
            <div className="mt-2 text-sm text-gray-700">{a.element?.title ?? a.name}</div>
            <div className="text-xs text-gray-500">{a.mime} • {a.sizeBytes} bytes</div>
          </div>
        ))}
      </div>
    </div>
  )
}
