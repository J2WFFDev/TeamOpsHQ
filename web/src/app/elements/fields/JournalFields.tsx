"use client"

import React from 'react'

export default function JournalFields({ mood, setMood }: any) {
  return (
    <div className="space-y-6">
      {/* Mood Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground/80">Mood</label>
        <div className="flex gap-2 p-2 rounded-xl bg-muted">
          {['happy','neutral','sad','excited','anxious','grateful'].map(m => (
            <button 
              key={m} 
              type="button" 
              onClick={() => setMood(m)} 
              className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${mood===m ? 'bg-background shadow-sm' : 'hover:bg-background/50'}`}
            >
              {m[0].toUpperCase()+m.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
