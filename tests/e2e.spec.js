import { test, expect } from '@playwright/test'

// ── Zero-Dead-Click QA: verify every interactive element fires correctly ──

test.describe('FlowPilot — Zero Dead Click', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('renders the dashboard with stats', async ({ page }) => {
    await expect(page.getByText('Welcome back')).toBeVisible()
    await expect(page.getByText('Active outcomes')).toBeVisible()
  })

  test('launches mission control and scrolls to metrics', async ({ page }) => {
    await page.getByRole('button', { name: 'Launch dashboard' }).click()
    await expect(page.getByText('Mission control')).toBeVisible()
    await page.getByRole('button', { name: 'Dashboard', exact: true }).click()
    await page.getByRole('button', { name: 'View metrics' }).click()
    await expect(page.locator('#metrics')).toBeVisible()
  })

  test('navigates between all views', async ({ page }) => {
    await page.getByRole('button', { name: 'Mission control' }).click()
    await expect(page.getByText('Add execution signal')).toBeVisible()

    await page.getByRole('button', { name: 'Ops copilot' }).click()
    await expect(page.getByText('Ops copilot')).toBeVisible()

    await page.getByRole('button', { name: 'Settings' }).click()
    await expect(page.getByText('Appearance')).toBeVisible()
  })

  test('creates a new task', async ({ page }) => {
    await page.getByRole('button', { name: 'Mission control' }).click()
    await page.getByRole('button', { name: 'Add execution signal' }).click()

    await page.getByPlaceholder('Task title').fill('Test task from QA')
    await page.getByRole('button', { name: 'Create Task' }).click()

    await expect(page.getByText('Test task from QA')).toBeVisible()
    await expect(page.getByText('Task created')).toBeVisible()
  })

  test('filters tasks by status', async ({ page }) => {
    await page.getByRole('button', { name: 'Mission control' }).click()
    await page.getByRole('button', { name: 'Done' }).click()
    await expect(page.getByText('Ship dark mode toggle')).toBeVisible()
  })

  test('toggles dark mode in settings', async ({ page }) => {
    await page.getByRole('button', { name: 'Settings' }).click()
    await page.getByText('Dark Mode').click()
    await expect(page.getByText('Light mode enabled')).toBeVisible()
  })

  test('AI assistant responds', async ({ page }) => {
    await page.getByRole('button', { name: 'Ops copilot' }).click()
    await page.getByPlaceholder('Ask your copilot about priorities, risks, or next steps…').fill('hello')
    await page.getByPlaceholder('Ask your copilot about priorities, risks, or next steps…').press('Enter')
    await expect(page.getByText('Assistant')).toBeVisible()
  })
})
