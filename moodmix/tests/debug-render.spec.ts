import { test, expect } from '@playwright/test'

test.describe('Debug Component Rendering', () => {
  
  test('Debug what is actually rendering', async ({ page }) => {
    // Listen for console errors
    const logs = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        logs.push(`ERROR: ${msg.text()}`)
      }
    })
    
    // Listen for JS errors
    const errors = []
    page.on('pageerror', error => {
      errors.push(error.message)
    })
    
    await page.goto('http://localhost:3001')
    await page.waitForLoadState('networkidle')
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/debug-render.png' })
    
    // Check what's in the DOM
    const bodyContent = await page.evaluate(() => document.body.innerHTML)
    console.log('Body innerHTML length:', bodyContent.length)
    
    // Check for specific components
    const mainContent = await page.evaluate(() => {
      const main = document.querySelector('main')
      return main ? main.innerHTML.substring(0, 500) : 'NO MAIN FOUND'
    })
    console.log('Main content preview:', mainContent)
    
    // Check for MoodWheel specifically
    const moodWheelExists = await page.evaluate(() => {
      return {
        hasGlassUltra: !!document.querySelector('.glass-ultra'),
        hasMoodWheel: !!document.querySelector('[class*="mood"]'),
        hasMotionDiv: !!document.querySelector('[data-framer-name]'),
        allDivs: document.querySelectorAll('div').length
      }
    })
    console.log('Component check:', moodWheelExists)
    
    // Check CSS loading
    const cssLoaded = await page.evaluate(() => {
      const stylesheets = Array.from(document.styleSheets)
      return {
        totalStylesheets: stylesheets.length,
        hasCustomCSS: stylesheets.some(sheet => {
          try {
            return Array.from(sheet.cssRules).some(rule => 
              rule.selectorText && rule.selectorText.includes('glass-premium')
            )
          } catch {
            return false
          }
        })
      }
    })
    console.log('CSS status:', cssLoaded)
    
    console.log('Console errors:', logs)
    console.log('JS errors:', errors)
  })
})