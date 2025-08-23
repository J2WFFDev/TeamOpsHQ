"use client"

import React from 'react'
import EventFields from './fields/EventFields'
import TaskFields from './fields/TaskFields'
import DecisionFields from './fields/DecisionFields'
import JournalFields from './fields/JournalFields'
import { pushToast } from '@/lib/toast'

export default function ClientCreateElementForm({ onCreated }: { onCreated?: (e: any, action?: 'created' | 'replaced') => void }) {
  const [type, setType] = React.useState('note')
  const [title, setTitle] = React.useState('')
  const [text, setText] = React.useState('')
  const [startsAt, setStartsAt] = React.useState('')
  const [endsAt, setEndsAt] = React.useState('')
  const [location, setLocation] = React.useState('')
  const [status, setStatus] = React.useState('open')
  const [priority, setPriority] = React.useState('medium')
  const [dueDate, setDueDate] = React.useState('')
  const [outcome, setOutcome] = React.useState('')
  const [rationale, setRationale] = React.useState('')
  const [mood, setMood] = React.useState('neutral')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function submit(e?: React.FormEvent) {
    if (e) e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      // Build detailsJson with common body_md and type-specific data
      const details: any = { $type: type, $v: 1, body_md: text || null }
      if (type === 'event') {
        if (startsAt) details.startsAt = startsAt
        if (endsAt) details.endsAt = endsAt
        if (location) details.locationName = location
      }
      if (type === 'task') {
        details.status = status
        details.priority = priority
        if (dueDate) details.dueAt = dueDate
      }
      if (type === 'decision') {
        if (outcome) details.outcome = outcome
        if (rationale) details.rationale = rationale
      }
      if (type === 'journal') {
        details.mood = mood
      }

      const body: any = { type, title: title || null, detailsJson: details }
      // Create provisional element for optimistic UI
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2,8)}`
      const provisional = {
        id: tempId,
        localId: tempId,
        type,
        title: title || null,
        detailsJson: details,
        createdAt: new Date().toISOString(),
        pending: true,
      }
      if (onCreated) onCreated(provisional, 'created')
      // client-side validation
      if (type === 'event' && details.startsAt && details.endsAt) {
        if (new Date(details.endsAt) < new Date(details.startsAt)) throw new Error('Event end must be after start')
      }

      const res = await fetch('/api/elements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || 'create failed')

      // reset inputs
      setTitle('')
      setText('')
      setStartsAt('')
      setDueDate('')
      setEndsAt('')
      setLocation('')
      setOutcome('')
      setRationale('')
      setMood('neutral')
      setType('note')

      // inform the parent to replace the provisional item with the server-provided element
      if (onCreated) onCreated(j.element, 'replaced')
  pushToast('Element created', 'success')
    } catch (err: any) {
      setError(err?.message || String(err))
  pushToast(`Create failed: ${err?.message || String(err)}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      {/* Element Type Tabs - matching nav spacing */}
      <div className="flex gap-2 p-2 rounded-xl bg-muted">
        {['note','event','task','journal','decision','coach_note','habit','bucket_list'].map(t => (
          <button 
            key={t} 
            type="button" 
            onClick={() => setType(t)} 
            className={`nav-link px-6 py-3 rounded-lg font-medium transition-all ${type === t ? 'bg-background shadow-sm' : 'hover:bg-background/50'}`}
            aria-current={type === t ? 'page' : undefined}
          >
            {t === 'coach_note' ? 'Coach Note' : t === 'bucket_list' ? 'Bucket List' : t[0].toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {/* Title Input - matching nav spacing */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground/80">Title</label>
        <input 
          placeholder="Enter a title..." 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          className="w-full px-4 py-3 border border-border bg-background text-foreground rounded-lg shadow-sm focus:ring-2 focus:ring-accent focus:border-accent transition-all"
        />
      </div>

      {/* Content Textarea - matching nav spacing */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground/80">Content</label>
        <textarea 
          placeholder="Write something..." 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          className="w-full px-4 py-3 border border-border bg-background text-foreground rounded-lg min-h-[140px] shadow-sm focus:ring-2 focus:ring-accent focus:border-accent transition-all resize-vertical"
        />
      </div>

      {type === 'event' && (
        <EventFields startsAt={startsAt} endsAt={endsAt} location={location} setStartsAt={setStartsAt} setEndsAt={setEndsAt} setLocation={setLocation} />
      )}

      {type === 'task' && (
        <TaskFields status={status} priority={priority} dueDate={dueDate} setStatus={setStatus} setPriority={setPriority} setDueDate={setDueDate} />
      )}

      {type === 'decision' && (
        <div className="space-y-3">
          <DecisionFields outcome={outcome} rationale={rationale} setOutcome={setOutcome} setRationale={setRationale} />
        </div>
      )}

      {type === 'journal' && (
        <JournalFields mood={mood} setMood={setMood} />
      )}

      <div className="flex items-center gap-4 pt-2">
        <button 
          className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium shadow-sm hover:bg-accent/90 transition-all focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed" 
          type="submit" 
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Element'}
        </button>
        {error && (
          <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
            {error}
          </div>
        )}
      </div>
    </form>
  )
}
