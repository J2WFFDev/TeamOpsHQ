"use client"

import React from 'react'

export default function DecisionFields({ outcome, rationale, setOutcome, setRationale }: any) {
  return (
    <div className="space-y-6">
      {/* Outcome */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground/80">Outcome</label>
        <input 
          placeholder="Decision outcome (e.g., approved, rejected, deferred)" 
          value={outcome} 
          onChange={(e) => setOutcome(e.target.value)} 
          className="w-full px-4 py-3 border border-border bg-background text-foreground rounded-lg shadow-sm focus:ring-2 focus:ring-accent focus:border-accent transition-all"
        />
      </div>

      {/* Rationale */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground/80">Rationale</label>
        <textarea 
          placeholder="Explain the reasoning behind this decision..." 
          value={rationale} 
          onChange={(e) => setRationale(e.target.value)} 
          className="w-full px-4 py-3 border border-border bg-background text-foreground rounded-lg min-h-[100px] shadow-sm focus:ring-2 focus:ring-accent focus:border-accent transition-all resize-vertical"
        />
      </div>
    </div>
  )
}
