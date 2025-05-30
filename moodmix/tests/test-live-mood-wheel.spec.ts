import { test, expect } from '@playwright/test'

test.describe('Test Live Mood Wheel', () => {
  
  test('Check if mood wheel appears on live deployment', async ({ page }) => {
    await page.goto('https://mood-mix-theta.vercel.app/')
    await page.waitForLoadState('networkidle')
    
    // Take initial screenshot
    await page.screenshot({ path: 'test-results/live-initial.png' })
    
    // Scroll down to look for mood wheel
    await page.evaluate(() => {
      window.scrollTo(0, window.innerHeight)
    })
    await page.waitForTimeout(1000)
    
    // Take screenshot after scrolling
    await page.screenshot({ path: 'test-results/live-scrolled.png' })
    
    // Check for mood wheel elements
    const moodWheelExists = await page.evaluate(() => {
      return {
        hasMoodWheelPremium: !!document.querySelector('.mood-wheel-premium'),
        hasGlassUltra: !!document.querySelector('.glass-ultra'),
        moodElements: document.querySelectorAll('[class*="mood"]').length
      }
    })
    console.log('Live deployment mood wheel check:', moodWheelExists)
    
    // Full page screenshot to capture everything
    await page.screenshot({ 
      path: 'test-results/live-full-page-new.png', 
      fullPage: true 
    })
  })
})