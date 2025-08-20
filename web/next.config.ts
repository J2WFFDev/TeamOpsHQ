import type { NextConfig } from 'next'
import withPWA from 'next-pwa'
import { join } from 'path'

const pwaOptions = {
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  swSrc: 'public/sw-custom.js',
  register: true,
  skipWaiting: true,
  // basic runtime caching handled by next-pwa
}

const nextConfig: NextConfig = {
  // ...existing Next.js config can go here
}

export default withPWA(pwaOptions)(nextConfig)
