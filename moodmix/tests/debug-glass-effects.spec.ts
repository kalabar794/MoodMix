import { test, expect } from '@playwright/test'

test.describe('Debug Glass Effects', () => {
  
  test('Debug glass and backdrop filter issues', async ({ page }) => {
    await page.goto('http://localhost:3001')
    await page.waitForLoadState('networkidle')
    
    // Check the glass-ultra element specifically
    const glassUltraInfo = await page.evaluate(() => {
      const element = document.querySelector('.glass-ultra')
      if (!element) return null
      
      const style = window.getComputedStyle(element)
      const rect = element.getBoundingClientRect()
      
      return {
        // Position and size
        position: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          visible: rect.width > 0 && rect.height > 0
        },
        // CSS properties
        styles: {
          display: style.display,
          visibility: style.visibility,
          opacity: style.opacity,
          zIndex: style.zIndex,
          position: style.position,
          background: style.background,
          backdropFilter: style.backdropFilter,
          WebkitBackdropFilter: style.webkitBackdropFilter,
          border: style.border,
          borderRadius: style.borderRadius,
          boxShadow: style.boxShadow,
          transform: style.transform
        },
        // Check if element is actually visible
        offsetParent: element.offsetParent !== null,
        innerHTML: element.innerHTML.length
      }
    })
    console.log('Glass Ultra Info:', JSON.stringify(glassUltraInfo, null, 2))
    
    // Check the mood-wheel-premium element
    const moodWheelInfo = await page.evaluate(() => {
      const element = document.querySelector('.mood-wheel-premium')
      if (!element) return null
      
      const style = window.getComputedStyle(element)
      const rect = element.getBoundingClientRect()
      
      return {
        position: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          visible: rect.width > 0 && rect.height > 0
        },
        styles: {
          display: style.display,
          background: style.background,
          visibility: style.visibility,
          opacity: style.opacity
        }
      }
    })
    console.log('Mood Wheel Premium Info:', JSON.stringify(moodWheelInfo, null, 2))
    
    // Take a screenshot focused on the mood wheel area
    const moodWheelElement = page.locator('.glass-ultra')
    if (await moodWheelElement.count() > 0) {
      await moodWheelElement.screenshot({ path: 'test-results/mood-wheel-area-debug.png' })
    }
  })
})