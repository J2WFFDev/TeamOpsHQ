import { NextRequest, NextResponse } from 'next/server'

// Minimal passthrough middleware so Next.js doesn't error when the file exists.
// Previously NextAuth middleware was removed because it wasn't Edge-compatible.
export function middleware() {
  return NextResponse.next()
}

export const config = {
  // apply to all routes by default — adjust as needed
  matcher: '/',
}
