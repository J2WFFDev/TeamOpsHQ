import { test, expect } from '@playwright/test'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'

test('offline quicknote syncs when back online', async ({ page, context }) => {
  await page.goto(`${BASE}/events`)

  // intercept /api/sync requests
  let syncCalled = false
  await page.route('**/api/sync', route => {
    syncCalled = true
    route.continue()
  })

  // go offline
  await context.setOffline(true)

  // fill quick note
  await page.fill('textarea[aria-label="note-text"]', 'E2E offline note')
  await page.fill('input[aria-label="athlete-id"]', 'athlete-e2e')
  await page.click('button:has-text("Save Offline")')

  // ensure pending count increments (shows locally)
  await expect(page.locator('text=Pending sync:')).toContainText('1')

  // go online
  await context.setOffline(false)

  // wait a bit for background sync/SyncManager to run
  await page.waitForTimeout(3000)

  expect(syncCalled).toBeTruthy()
})
