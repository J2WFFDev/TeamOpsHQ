import { vi, describe, it, expect, beforeEach } from 'vitest'

describe('drainPendingActions', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.restoreAllMocks()
  })

  it('returns zero when no actions', async () => {
    vi.doMock('@/lib/dexie', () => ({
      db: { pendingActions: { orderBy: () => ({ limit: () => ({ toArray: async () => [] }) }) } }
    }))
    const { drainPendingActions } = await import('../sync')
    const res = await drainPendingActions(10)
    expect(res.sent).toBe(0)
  })

  it('posts actions and deletes applied ids', async () => {
    const fakeActions = [{ id: 1, type: 'create_note', payload: { text: 'hi' }, createdAt: Date.now() }]
    const deleteSpy = vi.fn()
    vi.doMock('@/lib/dexie', () => ({
      db: {
        pendingActions: {
          orderBy: () => ({ limit: () => ({ toArray: async () => fakeActions }) }),
          where: () => ({ anyOf: () => ({ delete: deleteSpy }) })
        }
      }
    }))

  global.fetch = vi.fn(async () => ({ ok: true, json: async () => ({ applied: [1] }) })) as unknown as typeof global.fetch

    const { drainPendingActions } = await import('../sync')
    const res = await drainPendingActions(10)
    expect(res.sent).toBe(1)
    expect(res.applied).toEqual([1])
    expect(deleteSpy).toHaveBeenCalled()
  })
})
