import { test, expect } from '@playwright/test'

// ── Zero-Dead-Click QA: verify every interactive element fires correctly ──

test.describe('TaskFlow Pro — Zero Dead Click', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('renders the dashboard with stats', async ({ page }) => {
    await expect(page.getByText('Welcome back')).toBeVisible()
    await expect(page.getByText('Total Tasks')).toBeVisible()
  })

  test('navigates between all views', async ({ page }) => {
    await page.getByRole('button', { name: 'Tasks' }).click()
    await expect(page.getByText('New Task')).toBeVisible()

    await page.getByRole('button', { name: 'AI Insights' }).click()
    await expect(page.getByText('AI Insights')).toBeVisible()

    await page.getByRole('button', { name: 'Settings' }).click()
    await expect(page.getByText('Appearance')).toBeVisible()
  })

  test('creates a new task', async ({ page }) => {
    await page.getByRole('button', { name: 'Tasks' }).click()
    await page.getByRole('button', { name: 'New Task' }).click()

    await page.getByPlaceholder('Task title').fill('Test task from QA')
    await page.getByRole('button', { name: 'Create Task' }).click()

    await expect(page.getByText('Test task from QA')).toBeVisible()
    await expect(page.getByText('Task created')).toBeVisible()
  })

  test('filters tasks by status', async ({ page }) => {
    await page.getByRole('button', { name: 'Tasks' }).click()
    await page.getByRole('button', { name: 'Done' }).click()
    await expect(page.getByText('Ship dark mode toggle')).toBeVisible()
  })

  test('toggles dark mode in settings', async ({ page }) => {
    await page.getByRole('button', { name: 'Settings' }).click()
    await page.getByText('Dark Mode').click()
    await expect(page.getByText('Light mode coming soon')).toBeVisible()
  })

  test('AI assistant responds', async ({ page }) => {
    await page.getByRole('button', { name: 'AI Insights' }).click()
    await page.getByPlaceholder('Ask about your tasks…').fill('hello')
    await page.getByPlaceholder('Ask about your tasks…').press('Enter')
    await expect(page.getByText('Assistant')).toBeVisible()
  })
})
