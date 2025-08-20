import { test, expect } from '@playwright/test'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'

test('teams page loads and shows teams list', async ({ page }) => {
  await page.goto(`${BASE}/teams`)
  // Assert the page header (h1) and the create form are visible
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Teams/i)
  await expect(page.getByText('Create Team')).toBeVisible()
})
