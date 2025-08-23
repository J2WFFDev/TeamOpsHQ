"use client"

import React from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = React.useState<'light'|'dark'>(() => {
    try { return (localStorage.getItem('theme') as 'light'|'dark') || 'light' } catch { return 'light' }
  })

  React.useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    try { localStorage.setItem('theme', theme) } catch {}
  }, [theme])

  return (
    <button onClick={()=>setTheme(t=>t==='dark'?'light':'dark')} className="px-2 py-1 rounded border" aria-label="Toggle theme">
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  )
}
