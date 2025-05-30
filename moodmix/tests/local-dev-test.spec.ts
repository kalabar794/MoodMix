import { test, expect } from '@playwright/test'

test.describe('Local Development UI Test', () => {
  
  test('Test premium UI components locally', async ({ page }) => {
    await page.goto('http://localhost:3001')
    await page.waitForLoadState('networkidle')
    
    // Take screenshot to see what's actually loading
    await page.screenshot({ 
      path: 'test-results/local-dev-full-page.png', 
      fullPage: true 
    })
    
    // Check if MoodWheel component is present
    const moodWheel = page.locator('[data-testid="mood-wheel"], .mood-wheel-premium, svg')
    if (await moodWheel.count() > 0) {
      await moodWheel.first().screenshot({ path: 'test-results/local-mood-wheel.png' })
      console.log('Mood wheel found locally')
    } else {
      console.log('Mood wheel NOT found locally')
    }
    
    // Check for glassmorphic effects
    const glassElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('.glass-premium, .glass-ultra')
      return elements.length
    })
    console.log(`Found ${glassElements} glass elements locally`)
    
    // Check for premium text classes
    const premiumText = await page.evaluate(() => {
      const elements = document.querySelectorAll('[class*="text-premium"]')
      return elements.length
    })
    console.log(`Found ${premiumText} premium text elements locally`)
    
    // Check computed styles of glass elements
    const glassStyles = await page.evaluate(() => {
      const element = document.querySelector('.glass-premium')
      if (element) {
        const style = window.getComputedStyle(element)
        return {
          backdropFilter: style.backdropFilter,
          background: style.background,
          borderRadius: style.borderRadius
        }
      }
      return null
    })
    console.log('Glass styles:', glassStyles)
  })
})