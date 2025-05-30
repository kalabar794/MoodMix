import { test, expect } from '@playwright/test'

test.describe('Mood Wheel Interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001')
    await page.waitForLoadState('networkidle')
  })

  test('should not trigger mood selection on hover, only on click', async ({ page }) => {
    // Wait for mood wheel to be visible
    const moodWheel = page.locator('.mood-wheel-premium').first()
    await expect(moodWheel).toBeVisible()

    // Check initial state - no mood should be selected
    const resultsSection = page.locator('text="Your Perfect Soundtrack"')
    await expect(resultsSection).not.toBeVisible()

    // Hover over the mood wheel without clicking
    await moodWheel.hover({ position: { x: 200, y: 100 } })
    await page.waitForTimeout(500) // Wait a bit to ensure no selection happens

    // Verify no mood selection occurred (no results showing)
    await expect(resultsSection).not.toBeVisible()

    // Now click on the mood wheel
    await moodWheel.click({ position: { x: 200, y: 100 } })
    
    // Wait for results to appear
    await expect(resultsSection).toBeVisible({ timeout: 10000 })
    
    // Verify mood was selected
    const moodDisplay = page.locator('text="Current Mood"')
    await expect(moodDisplay).toBeVisible()
  })

  test('should show visual feedback on hover without triggering selection', async ({ page }) => {
    const moodWheel = page.locator('.mood-wheel-premium').first()
    await expect(moodWheel).toBeVisible()

    // Get initial center hub text
    const centerHub = page.locator('.glass-premium').filter({ hasText: 'Your Vibe' })
    await expect(centerHub).toBeVisible()

    // Hover over different positions
    await moodWheel.hover({ position: { x: 300, y: 200 } }) // Happy area
    await page.waitForTimeout(300)
    
    // Should show mood name but not trigger selection
    const happyText = page.locator('text="Happy"').first()
    await expect(happyText).toBeVisible()
    
    // But results should not appear
    const resultsSection = page.locator('text="Your Perfect Soundtrack"')
    await expect(resultsSection).not.toBeVisible()
  })

  test('should allow selecting different moods by clicking', async ({ page }) => {
    const moodWheel = page.locator('.mood-wheel-premium').first()
    
    // Click on "Sad" area (bottom left)
    await moodWheel.click({ position: { x: 100, y: 300 } })
    
    // Wait for results
    await page.waitForSelector('text="Your Perfect Soundtrack"', { timeout: 10000 })
    
    // Verify "Sad" mood is selected
    const moodText = page.locator('.glass-premium').filter({ hasText: 'Sad' })
    await expect(moodText).toBeVisible()
    
    // Click "Change Mood" button
    const changeMoodButton = page.locator('button:has-text("Change Mood")')
    await changeMoodButton.click()
    
    // Mood wheel should be visible again
    await expect(moodWheel).toBeVisible()
    
    // Click on "Happy" area (right side)
    await moodWheel.click({ position: { x: 350, y: 200 } })
    
    // Verify "Happy" mood is now selected
    await page.waitForSelector('text="Happy"', { timeout: 10000 })
  })

  test('should show intensity based on distance from center', async ({ page }) => {
    const moodWheel = page.locator('.mood-wheel-premium').first()
    
    // Click near the edge for high intensity
    await moodWheel.click({ position: { x: 380, y: 200 } })
    
    // Wait for results
    await page.waitForSelector('text="Your Perfect Soundtrack"', { timeout: 10000 })
    
    // Check intensity is high (should be > 80%)
    const intensityText = page.locator('text=/\\d+%/').first()
    const intensity = await intensityText.textContent()
    const intensityValue = parseInt(intensity?.replace('%', '') || '0')
    expect(intensityValue).toBeGreaterThan(80)
    
    // Go back and click near center for low intensity
    const changeMoodButton = page.locator('button:has-text("Change Mood")')
    await changeMoodButton.click()
    
    // Click near center
    await moodWheel.click({ position: { x: 220, y: 200 } })
    
    // Check intensity is low (should be < 40%)
    await page.waitForSelector('text="Your Perfect Soundtrack"', { timeout: 10000 })
    const newIntensityText = page.locator('text=/\\d+%/').first()
    const newIntensity = await newIntensityText.textContent()
    const newIntensityValue = parseInt(newIntensity?.replace('%', '') || '0')
    expect(newIntensityValue).toBeLessThan(40)
  })
})