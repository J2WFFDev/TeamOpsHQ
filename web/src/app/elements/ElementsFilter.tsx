'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ElementsFilter() {
  const router = useRouter()
  const params = useSearchParams()
  const type = params?.get('type') || ''
  const [val, setVal] = React.useState(type)

  function apply() {
    const url = new URL(window.location.href)
    if (val) url.searchParams.set('type', val)
    else url.searchParams.delete('type')
    router.push(url.pathname + url.search)
  }

  return (
    <div className="flex items-center gap-2">
      <select value={val} onChange={e=>setVal(e.target.value)} className="border rounded p-2">
        <option value="">All</option>
        <option value="note">Note</option>
        <option value="task">Task</option>
        <option value="event">Event</option>
        <option value="journal">Journal</option>
        <option value="decision">Decision</option>
      </select>
      <button type="button" onClick={apply} className="bg-teal-500 text-white px-3 py-2 rounded">Filter</button>
    </div>
  )
}
