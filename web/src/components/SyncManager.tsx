'use client'

import React from 'react'
import { drainPendingActions } from '@/lib/sync'

export default function SyncManager() {
  // minimal manager; we don't store last result to avoid unused-vars

  React.useEffect(() => {
  // no local state needed
    const run = async () => {
      if (!navigator.onLine) return
      try {
        await drainPendingActions(50)
      } catch {
        // ignore network hiccups
      }
    }

    // run on mount
    run()

    const onOnline = () => run()
    window.addEventListener('online', onOnline)
    const id = setInterval(run, 30_000)
    return () => {
      clearInterval(id)
      window.removeEventListener('online', onOnline)
    }
  }, [])

  return null
}
