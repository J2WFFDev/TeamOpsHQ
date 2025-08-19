"use client";
import React from 'react'
import { createEvent } from './actions'

type ActionResult = { ok?: boolean; error?: string }
type ActionFn = (...args: unknown[]) => Promise<ActionResult | undefined>

export default function ClientCreateEventForm({ teams }: { teams: { id: string; name: string }[] }) {
  const [stateRaw, formAction] = React.useActionState(createEvent as ActionFn, null)
  const state = stateRaw as ActionResult | undefined
  const now = new Date().toISOString().slice(0,16) // yyyy-MM-ddTHH:mm
  const later = new Date(Date.now() + 60*60*1000).toISOString().slice(0,16)
  return (
    <form action={formAction} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
      <label className="flex flex-col">
        <span className="text-sm text-gray-600">Team</span>
        <select name="teamId" className="border rounded px-2 py-1">
          {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </label>
      <label className="flex flex-col">
        <span className="text-sm text-gray-600">Title</span>
        <input name="title" className="border rounded px-2 py-1" placeholder="Practice" />
      </label>
      <label className="flex flex-col">
        <span className="text-sm text-gray-600">Starts</span>
        <input type="datetime-local" name="startsAt" defaultValue={now} className="border rounded px-2 py-1" />
      </label>
      <label className="flex flex-col">
        <span className="text-sm text-gray-600">Ends</span>
        <input type="datetime-local" name="endsAt" defaultValue={later} className="border rounded px-2 py-1" />
      </label>
      <label className="flex flex-col">
        <span className="text-sm text-gray-600">Location</span>
        <input name="location" className="border rounded px-2 py-1" placeholder="Range 1" />
      </label>
      <button className="md:col-span-5 rounded bg-black text-white px-3 py-2">Create</button>
      {state?.error && <span className="text-red-600">{state.error}</span>}
      {state?.ok && <span className="text-green-700">Created.</span>}
    </form>
  )
}
