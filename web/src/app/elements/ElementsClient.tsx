"use client"

import React from 'react'
import ClientCreateElementForm from './ClientCreateElementForm'

type ElementLike = any

export default function ElementsClient({ initialElements }: { initialElements?: ElementLike[] }) {
  const [elements, setElements] = React.useState<ElementLike[]>(initialElements ?? [])

  function handleCreated(el: ElementLike, action: 'created' | 'replaced' = 'created') {
    if (action === 'created') {
      // Prepend provisional item
      setElements(prev => [el, ...prev])
      return
    }

    if (action === 'replaced') {
      // Replace provisional item if present (match by localId or temp id), else prepend
      setElements(prev => {
        const idx = prev.findIndex(p => p.id === el.id || p.localId === el.id || (p.localId && p.localId === el.localId))
        if (idx >= 0) {
          const copy = [...prev]
          copy[idx] = el
          return copy
        }
        return [el, ...prev]
      })
      return
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Elements</h1>

      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold mb-3">Create Element</h2>
        <ClientCreateElementForm onCreated={handleCreated} />
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Recent Elements</h2>
        </div>
        <ul className="divide-y">
          {elements.map((el: any) => (
            <li key={el.id ?? el.localId ?? Math.random()} className="py-2">
              <div className="font-medium">{el.title ?? (el.detailsJson?.body_md ? el.detailsJson.body_md.slice(0,80) : 'Untitled')}</div>
              <div className="text-sm text-gray-600">{new Date(el.createdAt || el.created_at || Date.now()).toLocaleString()} • {el.type}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
