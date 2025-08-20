'use client'

import React from 'react'

export default function OfflineIndicator() {
  // Prevent hydration mismatch by rendering nothing on the server.
  const [mounted, setMounted] = React.useState(false)
  const [online, setOnline] = React.useState(true)

  React.useEffect(() => {
    setMounted(true)
    const onOnline = () => setOnline(true)
    const onOffline = () => setOnline(false)
    // initialize from navigator on the client
    try {
      setOnline(navigator.onLine)
    } catch {
      setOnline(true)
    }
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  if (!mounted) return null

  return (
    <div style={{position: 'fixed', right: 12, top: 12, zIndex: 9999}}>
      <div style={{padding: '6px 10px', borderRadius: 20, background: online ? 'rgba(16,185,129,0.95)' : 'rgba(239,68,68,0.95)', color: 'white', fontSize: 12}}>
        {online ? 'Online' : 'Offline'}
      </div>
    </div>
  )
}
