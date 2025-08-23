import './globals.css'
import Link from 'next/link'
import { ReactNode } from 'react'
import RegisterPWA from '@/components/RegisterPWA'
import OfflineIndicator from '@/components/OfflineIndicator'
import SyncManager from '@/components/SyncManager'
import ThemeToggle from '@/components/ThemeToggle'
import ActiveNavLink from '@/components/ActiveNavLink'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
  <body className="min-h-screen bg-background text-foreground">
  <RegisterPWA />
  <OfflineIndicator />
  <SyncManager />
        <header className="border-b" style={{ borderColor: 'var(--border)' }}>
          <nav className="mx-auto max-w-5xl flex items-center gap-6 p-4 surface">
            <Link href="/" className="nav-link font-semibold">TeamOpsHQ</Link>
            <ActiveNavLink href="/dashboard">Dashboard</ActiveNavLink>
            <ActiveNavLink href="/elements">Elements</ActiveNavLink>
            <ActiveNavLink href="/teams">Teams</ActiveNavLink>
            <ActiveNavLink href="/events">Events</ActiveNavLink>
            <ActiveNavLink href="/gallery">Gallery</ActiveNavLink>
            <ActiveNavLink href="/signin">Sign in</ActiveNavLink>
            <div className="ml-auto"><ThemeToggle /></div>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl p-6">{children}</main>
      </body>
    </html>
  )
}
