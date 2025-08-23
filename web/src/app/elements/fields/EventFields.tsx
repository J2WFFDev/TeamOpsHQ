"use client"

import React from 'react'

export default function EventFields({ startsAt, endsAt, location, setStartsAt, setEndsAt, setLocation }: any) {
  return (
    <div className="space-y-6">
      {/* Start Time */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground/80">Start Time</label>
        <input 
          type="datetime-local" 
          value={startsAt} 
          onChange={(e) => setStartsAt(e.target.value)} 
          className="w-full px-4 py-3 border border-border bg-background text-foreground rounded-lg shadow-sm focus:ring-2 focus:ring-accent focus:border-accent transition-all"
        />
      </div>

      {/* End Time */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground/80">End Time</label>
        <input 
          type="datetime-local" 
          value={endsAt} 
          onChange={(e) => setEndsAt(e.target.value)} 
          className="w-full px-4 py-3 border border-border bg-background text-foreground rounded-lg shadow-sm focus:ring-2 focus:ring-accent focus:border-accent transition-all"
        />
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground/80">Location</label>
        <input 
          placeholder="Enter location..." 
          value={location} 
          onChange={(e) => setLocation(e.target.value)} 
          className="w-full px-4 py-3 border border-border bg-background text-foreground rounded-lg shadow-sm focus:ring-2 focus:ring-accent focus:border-accent transition-all"
        />
      </div>
    </div>
  )
}
