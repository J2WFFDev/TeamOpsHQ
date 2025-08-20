import { test, expect } from '@playwright/test'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'

test('signin page loads and shows sign-in form', async ({ page }) => {
  await page.goto(`${BASE}/signin`)
  // The app doesn't set a consistent <title>, assert visible form/button instead
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByRole('button', { name: /sign in|signin/i })).toBeVisible()
})
