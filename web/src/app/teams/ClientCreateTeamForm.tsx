"use client";
import React from 'react'
import { createTeam } from './actions'

type ActionResult = { ok?: boolean; error?: string }
type ActionFn = (...args: unknown[]) => Promise<ActionResult | undefined>

export default function ClientCreateTeamForm({ programs }: { programs: { id: number; name: string }[] }) {
  const [stateRaw, formAction] = React.useActionState(createTeam as ActionFn, null)
  const state = stateRaw as ActionResult | undefined
  return (
    <form action={formAction} className="flex gap-2 items-end">
      <label className="flex flex-col">
        <span className="text-sm text-gray-600">Program</span>
        <select name="programId" className="border rounded px-2 py-1">
          {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </label>
      <label className="flex flex-col">
        <span className="text-sm text-gray-600">Team name</span>
        <input name="name" className="border rounded px-2 py-1" placeholder="Rifle C" />
      </label>
      <button className="rounded bg-black text-white px-3 py-2">Create</button>
      {state?.error && <span className="text-red-600">{state.error}</span>}
      {state?.ok && <span className="text-green-700">Created.</span>}
    </form>
  )
}
