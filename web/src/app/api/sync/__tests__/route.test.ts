import { it, expect } from 'vitest'
import { POST } from '@/app/api/sync/route'

// Simple smoke test calling POST with empty actions
it('POST returns applied array for empty actions', async () => {
  const req = new Request('http://localhost/api/sync', { method: 'POST', body: JSON.stringify({ actions: [] }) })
  const res = await POST(req)
  const body = await res.json()
  expect(Array.isArray(body.applied)).toBe(true)
})
