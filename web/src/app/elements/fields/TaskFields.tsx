"use client"

import React from 'react'

export default function TaskFields({ status, priority, dueDate, setStatus, setPriority, setDueDate }: any) {
  return (
    <div className="space-y-6">
      {/* Status Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground/80">Status</label>
        <div className="flex gap-2 p-2 rounded-xl bg-muted">
          {['open','in_progress','done'].map(s => (
            <button 
              key={s} 
              type="button" 
              onClick={() => setStatus(s)} 
              className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${status===s ? 'bg-background shadow-sm' : 'hover:bg-background/50'}`}
            >
              {s === 'in_progress' ? 'In Progress' : s[0].toUpperCase()+s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Priority Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground/80">Priority</label>
        <div className="flex gap-2 p-2 rounded-xl bg-muted">
          {['low','medium','high'].map(p => (
            <button 
              key={p} 
              type="button" 
              onClick={() => setPriority(p)} 
              className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${priority===p ? 'bg-background shadow-sm' : 'hover:bg-background/50'}`}
            >
              {p[0].toUpperCase()+p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Due Date */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground/80">Due Date</label>
        <input 
          type="date" 
          value={dueDate} 
          onChange={(e) => setDueDate(e.target.value)} 
          className="w-full px-4 py-3 border border-border bg-background text-foreground rounded-lg shadow-sm focus:ring-2 focus:ring-accent focus:border-accent transition-all"
        />
      </div>
    </div>
  )
}
