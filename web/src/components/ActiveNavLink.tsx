"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

export default function ActiveNavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname === href
  
  return (
    <Link 
      href={href} 
      className="nav-link" 
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  )
}