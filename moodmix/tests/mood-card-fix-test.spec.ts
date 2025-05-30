import { test, expect } from '@playwright/test'

test.describe('Mood Card Click Fix', () => {
  test('should successfully click mood cards without errors', async ({ page }) => {
    // Listen for console errors
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    // Listen for uncaught exceptions
    const uncaughtExceptions: string[] = []
    page.on('pageerror', error => {
      uncaughtExceptions.push(error.message)
    })

    // Navigate to the app
    await page.goto('http://localhost:3000')
    
    // Wait for mood cards to load
    await page.waitForSelector('[data-testid="mood-card"], .mood-card-sophisticated, button:has-text("Euphoric")', { timeout: 10000 })
    
    // Find and click the first mood card
    const moodCards = await page.locator('button').filter({ hasText: /Euphoric|Melancholic|Energetic|Serene/ })
    const firstCard = moodCards.first()
    
    // Take screenshot before clicking
    await page.screenshot({ path: 'test-results/before-mood-click.png' })
    
    // Click the mood card
    await firstCard.click()
    
    // Wait a moment for any async operations
    await page.waitForTimeout(2000)
    
    // Take screenshot after clicking
    await page.screenshot({ path: 'test-results/after-mood-click.png' })
    
    // Check for console errors
    expect(consoleErrors.length).toBe(0)
    
    // Check for uncaught exceptions
    expect(uncaughtExceptions.length).toBe(0)
    
    // Verify we're now on the results page or that the state changed
    const hasResults = await page.locator('text="Discovering Your Music"').isVisible().catch(() => false)
    const hasError = await page.locator('text="Application error"').isVisible().catch(() => false)
    
    // Should either be loading or have results, but no error
    expect(hasError).toBe(false)
    
    // Log success
    console.log('✅ Mood card click test passed - no errors detected')
  })

  test('should handle all mood types without errors', async ({ page }) => {
    await page.goto('http://localhost:3000')
    
    // Wait for cards to load
    await page.waitForSelector('button:has-text("Euphoric")', { timeout: 10000 })
    
    // Test each mood type
    const moodTypes = ['Euphoric', 'Melancholic', 'Energetic', 'Serene', 'Passionate', 'Contemplative']
    
    for (const mood of moodTypes) {
      // Reset page
      await page.reload()
      await page.waitForSelector(`button:has-text("${mood}")`, { timeout: 10000 })
      
      // Click the specific mood
      await page.click(`button:has-text("${mood}")`)
      
      // Wait for response
      await page.waitForTimeout(1000)
      
      // Check no application error
      const hasError = await page.locator('text="Application error"').isVisible().catch(() => false)
      expect(hasError).toBe(false)
      
      console.log(`✅ ${mood} mood card works correctly`)
    }
  })
})