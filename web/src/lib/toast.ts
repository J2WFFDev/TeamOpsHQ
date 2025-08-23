// simple toast pub/sub for small ephemeral notifications
type Toast = { id: string; message: string; type?: 'info'|'success'|'error' }

const listeners = new Set<(t: Toast) => void>()

export function subscribeToast(fn: (t: Toast) => void) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function pushToast(message: string, type: Toast['type'] = 'info') {
  const t: Toast = { id: `toast-${Date.now()}-${Math.random().toString(36).slice(2,6)}`, message, type }
  for (const fn of Array.from(listeners)) fn(t)
}

export type { Toast }
