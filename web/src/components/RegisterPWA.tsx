'use client'

import React from 'react'
import { registerServiceWorker } from '@/lib/pwa'

export default function RegisterPWA() {
  React.useEffect(() => {
    registerServiceWorker()
  }, [])
  return null
}
