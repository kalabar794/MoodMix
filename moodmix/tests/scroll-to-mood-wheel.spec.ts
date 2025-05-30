import { test, expect } from '@playwright/test'

test.describe('Scroll to Mood Wheel', () => {
  
  test('Scroll to find the mood wheel', async ({ page }) => {
    await page.goto('http://localhost:3001')
    await page.waitForLoadState('networkidle')
    
    // Get the position of the mood wheel
    const moodWheelPosition = await page.evaluate(() => {
      const element = document.querySelector('.mood-wheel-premium')
      if (element) {
        const rect = element.getBoundingClientRect()
        return {
          top: rect.top,
          left: rect.left,
          bottom: rect.bottom,
          right: rect.right,
          width: rect.width,
          height: rect.height,
          centerY: rect.top + rect.height / 2,
          centerX: rect.left + rect.width / 2
        }
      }
      return null
    })
    console.log('Mood wheel position:', moodWheelPosition)
    
    // Get viewport info
    const viewportInfo = await page.evaluate(() => ({
      width: window.innerWidth,
      height: window.innerHeight,
      scrollY: window.scrollY,
      scrollX: window.scrollX
    }))
    console.log('Viewport info:', viewportInfo)
    
    // Scroll to the mood wheel area if needed
    if (moodWheelPosition) {
      await page.evaluate((pos) => {
        window.scrollTo({
          top: pos.centerY - window.innerHeight / 2,
          left: pos.centerX - window.innerWidth / 2,
          behavior: 'smooth'
        })
      }, moodWheelPosition)
      
      await page.waitForTimeout(1000) // Wait for scroll animation
      
      // Take screenshot after scrolling
      await page.screenshot({ 
        path: 'test-results/scrolled-to-mood-wheel.png',
        fullPage: false 
      })
      
      // Try to take screenshot of just the mood wheel area
      if (moodWheelPosition.width > 0 && moodWheelPosition.height > 0) {
        await page.screenshot({
          path: 'test-results/mood-wheel-only.png',
          clip: {
            x: moodWheelPosition.left,
            y: moodWheelPosition.top,
            width: moodWheelPosition.width,
            height: moodWheelPosition.height
          }
        })
      }
    }
    
    // Also try full page screenshot
    await page.screenshot({ 
      path: 'test-results/full-page-after-scroll.png',
      fullPage: true 
    })
  })
})