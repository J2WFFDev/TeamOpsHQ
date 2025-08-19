import './globals.css'
import Link from 'next/link'
import { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b bg-white">
          <nav className="mx-auto max-w-5xl flex items-center gap-6 p-4">
            <Link href="/" className="font-semibold">TeamOpsHQ</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/teams">Teams</Link>
            <Link href="/events">Events</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl p-6">{children}</main>
      </body>
    </html>
  )
}
