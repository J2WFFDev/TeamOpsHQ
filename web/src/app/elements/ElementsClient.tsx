"use client"

import React from 'react'
import ClientCreateElementForm from './ClientCreateElementForm'
import Toaster from '@/components/Toaster'
import { pushToast } from '@/lib/toast'

type ElementLike = any

export default function ElementsClient({ initialElements }: { initialElements?: ElementLike[] }) {
  const [elements, setElements] = React.useState<ElementLike[]>(initialElements ?? [])
  const [editingId, setEditingId] = React.useState<string | number | null>(null)
  const [editingTitle, setEditingTitle] = React.useState<string>('')
  const [editingDue, setEditingDue] = React.useState<string | null>(null)

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

  async function retryCreate(provisional: ElementLike) {
    try {
      // mark provisional as retrying (optimistic local state)
      setElements(prev => prev.map(p => (p.localId === provisional.localId ? { ...p, retrying: true } : p)))
      const body = { type: provisional.type, title: provisional.title, detailsJson: provisional.detailsJson }
      const res = await fetch('/api/elements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || 'retry failed')
      // replace provisional with server element
      handleCreated(j.element, 'replaced')
  pushToast('Element created', 'success')
    } catch (err) {
      console.error('retry failed', err)
      // mark failure so user can see and retry again
      setElements(prev => prev.map(p => (p.localId === provisional.localId ? { ...p, retrying: false, retryFailed: true } : p)))
  pushToast('Retry failed', 'error')
    }
  }

  // Inline edit handlers
  function startEdit(el: ElementLike) {
    setEditingId(el.id ?? el.localId)
    setEditingTitle(el.title ?? el.detailsJson?.body_md ?? '')
    setEditingDue(el.detailsJson?.dueAt ?? null)
  }

  async function saveEdit(el: ElementLike, updates: { title?: string; detailsJson?: any }) {
    // optimistic update
    setElements(prev => prev.map(p => (p.id === el.id || p.localId === el.localId ? { ...p, ...updates } : p)))
    setEditingId(null)
    try {
      const body: any = { id: el.id, ...updates }
      const res = await fetch('/api/elements', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || 'save failed')
      // replace with server element
      setElements(prev => {
        const idx = prev.findIndex(p => p.id === j.element.id || p.localId === j.element.localId)
        if (idx >= 0) { const copy = [...prev]; copy[idx] = j.element; return copy }
        return [j.element, ...prev]
      })
      pushToast('Saved', 'success')
    } catch (err: any) {
      console.error('save failed', err)
      pushToast('Save failed', 'error')
    }
  }

  async function toggleComplete(el: ElementLike) {
    const current = el.detailsJson?.status ?? 'open'
    const next = current === 'done' ? 'open' : 'done'
    const newDetails = { ...el.detailsJson, status: next }
    // optimistic
    setElements(prev => prev.map(p => (p.id === el.id || p.localId === el.localId ? { ...p, detailsJson: newDetails } : p)))
    try {
      const body = { id: el.id, detailsJson: newDetails }
      const res = await fetch('/api/elements', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || 'toggle failed')
      // replace
      setElements(prev => prev.map(p => (p.id === j.element.id ? j.element : p)))
    } catch (err) {
      console.error('toggle failed', err)
      pushToast('Update failed', 'error')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Elements</h1>
      </div>

      <div className="bg-background rounded-xl border border-border shadow-sm p-8">
        <h2 className="text-xl font-semibold mb-6">Create Element</h2>
        <ClientCreateElementForm onCreated={handleCreated} />
      </div>

      <div className="bg-background rounded-xl border border-border shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recent Elements</h2>
          <span className="text-sm text-foreground/60">{elements.length} items</span>
        </div>
        <Toaster />
        <div className="space-y-2">{elements.map((el: any) => (
            <li key={el.id ?? el.localId ?? Math.random()} className="py-3 first:pt-0">
              <div className="task-row bg-muted/30 hover:bg-muted/50 transition-colors">
                <div>
                  <button 
                    aria-label="toggle complete" 
                    className="task-checkbox" 
                    aria-checked={el.detailsJson?.status === 'done' ? 'true' : 'false'}
                    onClick={() => toggleComplete(el)} 
                  />
                </div>
                <div className="flex-1">
                  {!editingId || editingId !== (el.id ?? el.localId) ? (
                    <>
                      <div className="task-title text-base" onClick={() => startEdit(el)} style={{ cursor: 'text' }}>{el.title ?? (el.detailsJson?.body_md ? el.detailsJson.body_md.slice(0,120) : 'Untitled')}</div>
                      <div className="task-meta mt-1">
                        <span className={`priority-dot ${el.detailsJson?.priority ? 'priority-'+el.detailsJson.priority : 'priority-medium'}`}></span>
                        <span className="text-sm font-medium">{el.type}</span>
                        <span className="text-sm">•</span>
                        <button className="task-date hover:text-accent transition-colors" onClick={() => startEdit(el)} style={{ background: 'transparent', border: 'none', padding:0, cursor:'pointer' }}>{new Date(el.createdAt || el.created_at || Date.now()).toLocaleString()}</button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <input 
                        value={editingTitle} 
                        onChange={(e) => setEditingTitle(e.target.value)} 
                        className="w-full px-4 py-3 border border-border bg-background rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(el, { title: editingTitle })
                          if (e.key === 'Escape') setEditingId(null)
                        }}
                        autoFocus
                      />
                      <input
                        type="date"
                        value={editingDue?.split('T')[0] ?? ''}
                        onChange={(e) => setEditingDue(e.target.value ? `${e.target.value}T00:00:00Z` : null)}
                        className="px-4 py-3 border border-border bg-background rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                        placeholder="Due date"
                      />
                      <div className="flex gap-3">
                        <button className="px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-all" onClick={() => saveEdit(el, { title: editingTitle, detailsJson: { ...el.detailsJson, dueAt: editingDue } })}>Save</button>
                        <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-all" onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {/* inline actions removed in favor of direct interactions */}
                </div>
              </div>
            </li>
          ))}
        </div>
      </div>
    </div>
  )
}

function EditableElementRow({ element, onSave, onRetry }: { element: any, onSave: (u: any) => void, onRetry: () => void }) {
  const [editing, setEditing] = React.useState(false)
  const [title, setTitle] = React.useState(element.title ?? '')
  const [body, setBody] = React.useState(element.detailsJson?.body_md ?? '')
  const [saving, setSaving] = React.useState(false)

  async function save() {
    setSaving(true)
    try {
      const payload = { id: element.id, title: title || null, detailsJson: { ...element.detailsJson, body_md: body || null } }
      const res = await fetch('/api/elements', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || 'save failed')
      onSave(j.element)
      setEditing(false)
      pushToast('Saved', 'success')
    } catch (err: any) {
      console.error('save failed', err)
      pushToast('Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="">
      {!editing ? (
        <div>
          <div className="font-medium text-foreground">{element.title ?? (element.detailsJson?.body_md ? element.detailsJson.body_md.slice(0,80) : 'Untitled')}</div>
          <div className="text-sm text-foreground/70 flex flex-col md:flex-row md:items-center md:gap-2">
            <span>{new Date(element.createdAt || element.created_at || Date.now()).toLocaleString()}</span>
            <span>•</span>
            <span className="capitalize">{element.type}</span>
            {element.pending && (
              <span className="ml-2 flex items-center gap-2">
                {element.retrying ? <span className="spin" /> : <span className="text-xs text-amber-600">(pending)</span>}
                {element.retryFailed ? <button className="retry-btn btn-ghost" onClick={onRetry}>Retry</button> : null}
              </span>
            )}
          </div>
          <div className="mt-2 flex gap-2">
            <button className="btn btn-ghost" onClick={() => setEditing(true)}>Edit</button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <input value={title ?? ''} onChange={(e) => setTitle(e.target.value)} className="w-full border border-border rounded-md px-2 py-1 bg-background text-foreground" />
          <textarea value={body ?? ''} onChange={(e) => setBody(e.target.value)} className="w-full border border-border rounded-md px-2 py-1 bg-background text-foreground min-h-[64px]" />
          <div className="flex gap-2">
            <button disabled={saving} className="px-3 py-1 bg-foreground text-background rounded-md" onClick={save}>{saving ? 'Saving...' : 'Save'}</button>
            <button className="px-3 py-1 border rounded-md" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
