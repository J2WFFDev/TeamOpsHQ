'use client'

import React from 'react'

export default function ClientCreateElementForm({ onCreated }: { onCreated?: (e: any, action?: 'created' | 'replaced') => void }) {
  const [type, setType] = React.useState('note')
  const [title, setTitle] = React.useState('')
  const [text, setText] = React.useState('')
  const [startsAt, setStartsAt] = React.useState('')
  const [endsAt, setEndsAt] = React.useState('')
  const [location, setLocation] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function submit(e?: React.FormEvent) {
    if (e) e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const body: any = { type, title: title || null, text: text || null }
      if (type === 'event') {
        body.startsAt = startsAt || null
        body.endsAt = endsAt || null
        body.location = location || null
      }
      // Create provisional element for optimistic UI
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2,8)}`
      const provisional = {
        id: tempId,
        localId: tempId,
        type,
        title: title || null,
        detailsJson: { $type: type, $v: 1, body_md: text || null },
        createdAt: new Date().toISOString(),
        pending: true,
      }
      if (onCreated) onCreated(provisional, 'created')
      const res = await fetch('/api/elements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || 'create failed')
      setTitle('')
      setText('')
      setStartsAt('')
      setEndsAt('')
      setLocation('')
      setType('note')
  // inform the parent to replace the provisional item with the server-provided element
  if (onCreated) onCreated(j.element, 'replaced')
    } catch (err: any) {
      setError(err?.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex gap-2 items-center">
        <label className="flex items-center gap-2">
          <span className="text-sm">Type</span>
          <select value={type} onChange={e=>setType(e.target.value)} className="border rounded p-2">
            <option value="note">Note</option>
            <option value="task">Task</option>
            <option value="event">Event</option>
            <option value="journal">Journal</option>
            <option value="decision">Decision</option>
          </select>
        </label>
      </div>
      <div>
        <input placeholder="Title (optional)" value={title} onChange={e=>setTitle(e.target.value)} className="w-full border rounded p-2" />
      </div>
      <div>
        <textarea placeholder="Content" value={text} onChange={e=>setText(e.target.value)} className="w-full border rounded p-2 h-28" />
      </div>

      {type === 'event' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input type="datetime-local" value={startsAt} onChange={e=>setStartsAt(e.target.value)} className="border rounded p-2" />
          <input type="datetime-local" value={endsAt} onChange={e=>setEndsAt(e.target.value)} className="border rounded p-2" />
          <input placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)} className="border rounded p-2" />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-red-600">{error}</div>
        <button type="submit" disabled={loading} className="bg-teal-500 text-white px-3 py-2 rounded">{loading? 'Creating...':'Create'}</button>
      </div>
    </form>
  )
}
