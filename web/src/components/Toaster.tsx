"use client"

import React from 'react'
import { subscribeToast, Toast } from '@/lib/toast'

export default function Toaster() {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  React.useEffect(() => {
    const unsub = subscribeToast((t) => {
      setToasts((s) => [t, ...s])
      // auto-dismiss
      setTimeout(() => setToasts((s) => s.filter(x => x.id !== t.id)), 3500)
    })
    return () => { unsub() }
  }, [])

  return (
    <div className="fixed right-4 top-4 z-50 space-y-2 max-w-xs">
      {toasts.map(t => (
        <div key={t.id} className={`p-3 rounded-md shadow ${t.type==='error'?'bg-red-600 text-white':'bg-white text-gray-900'}`}>
          {t.message}
        </div>
      ))}
    </div>
  )
}
