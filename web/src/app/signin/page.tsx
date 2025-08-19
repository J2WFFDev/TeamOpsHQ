'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignIn() {
  const [email, setEmail] = useState('admin@local.test')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <h1 className="text-xl font-semibold mb-4">Sign in</h1>
      <div className="space-y-3">
        <input className="w-full border rounded px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
        <input className="w-full border rounded px-3 py-2" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" />
        <button
          className="w-full rounded bg-black text-white py-2"
          onClick={async ()=>{
            setLoading(true)
            // Fake sign-in for initial build: just redirect to dashboard
            router.push('/dashboard')
          }}
          disabled={loading}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        <p className="text-sm text-gray-500">Dev users: admin@local.test / coach@local.test / parent@local.test (passwords: admin123 / coach123 / parent123)</p>
      </div>
    </div>
  )
}
