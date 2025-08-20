/* Custom service worker to support background sync trigger
   This file will be used with next-pwa injectManifest so we can listen
   for sync events and message clients to wake them to drain the queue.
*/
// Workbox will replace `self.__WB_MANIFEST` at build time. Reference it here so
// injectManifest can locate and replace the placeholder.
/* global self */
// eslint-disable-next-line no-undef
self.__WB_MANIFEST

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  self.clients.claim()
})

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pending-actions') {
    event.waitUntil(
      (async () => {
        try {
          // Open IndexedDB and read pendingActions
          const openReq = indexedDB.open('TeamOpsHQDB')
          const db = await new Promise((resolve, reject) => {
            openReq.onsuccess = () => resolve(openReq.result)
            openReq.onerror = () => reject(openReq.error)
          })

          const tx = db.transaction('pendingActions', 'readwrite')
          const store = tx.objectStore('pendingActions')
          const getAllReq = store.getAll()
          const actions = await new Promise((resolve, reject) => {
            getAllReq.onsuccess = () => resolve(getAllReq.result)
            getAllReq.onerror = () => reject(getAllReq.error)
          })

          if (!actions || !actions.length) return

          // POST to server
          const resp = await fetch('/api/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ actions })
          })

          if (!resp.ok) return
          const result = await resp.json()
          if (result?.applied && Array.isArray(result.applied) && result.applied.length) {
            for (const id of result.applied) {
              try {
                store.delete(id)
              } catch (e) {
                // ignore individual delete errors
              }
            }
          }
        } catch (err) {
          // ignore and retry later
          console.error('SW sync upload failed', err)
        }
      })()
    )
  }
})

// Fallback: respond to messages from clients to run sync-related tasks in SW
self.addEventListener('message', (event) => {
  // Could implement SW-side network operations here if needed
})
