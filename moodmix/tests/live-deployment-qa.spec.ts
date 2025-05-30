import { test, expect } from '@playwright/test'

const VERCEL_URL = 'https://mood-mix-theta.vercel.app'

test.describe('MoodMix Live Deployment QA', () => {
  
  test('Full page screenshot and initial load assessment', async ({ page }) => {
    await page.goto(VERCEL_URL)
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle')
    
    // Take full page screenshot
    await page.screenshot({ 
      path: 'test-results/live-deployment-full-page.png', 
      fullPage: true 
    })
    
    // Check basic page elements
    await expect(page).toHaveTitle(/MoodMix/i)
    
    // Check if main heading exists
    const heading = page.locator('h1')
    await expect(heading).toBeVisible()
    
    // Take screenshot of viewport
    await page.screenshot({ 
      path: 'test-results/live-deployment-viewport.png' 
    })
  })

  test('Mood wheel assessment and functionality', async ({ page }) => {
    await page.goto(VERCEL_URL)
    await page.waitForLoadState('networkidle')
    
    // Look for mood wheel container
    const moodWheel = page.locator('[data-testid="mood-wheel"], .mood-wheel, #mood-wheel')
    
    if (await moodWheel.count() > 0) {
      // Take screenshot of mood wheel area
      await moodWheel.screenshot({ path: 'test-results/mood-wheel-area.png' })
      
      // Test if mood wheel is interactive
      await moodWheel.hover()
      await page.screenshot({ path: 'test-results/mood-wheel-hover.png' })
      
      // Try clicking on different areas
      const boundingBox = await moodWheel.boundingBox()
      if (boundingBox) {
        await page.mouse.click(
          boundingBox.x + boundingBox.width / 2, 
          boundingBox.y + boundingBox.height / 2
        )
        await page.screenshot({ path: 'test-results/mood-wheel-click.png' })
      }
    } else {
      console.log('Mood wheel not found - checking for alternative mood selectors')
      
      // Look for any mood-related buttons or elements
      const moodButtons = page.locator('button:has-text("Happy"), button:has-text("Sad"), button:has-text("Excited")')
      await moodButtons.first().screenshot({ path: 'test-results/mood-buttons.png' })
    }
  })

  test('Premium UI effects assessment', async ({ page }) => {
    await page.goto(VERCEL_URL)
    await page.waitForLoadState('networkidle')
    
    // Check for glassmorphic effects by evaluating computed styles
    const glassElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('*')
      const glassEffects = []
      
      for (const el of elements) {
        const style = window.getComputedStyle(el)
        if (style.backdropFilter && style.backdropFilter !== 'none') {
          glassEffects.push({
            tag: el.tagName,
            classes: el.className,
            backdropFilter: style.backdropFilter,
            background: style.background
          })
        }
      }
      return glassEffects
    })
    
    console.log('Glass effects found:', glassEffects)
    
    // Take screenshot with dev tools to show styles
    await page.screenshot({ path: 'test-results/ui-effects-assessment.png' })
  })

  test('Responsive design test', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto(VERCEL_URL)
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: 'test-results/mobile-view.png' })
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto(VERCEL_URL)
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: 'test-results/tablet-view.png' })
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto(VERCEL_URL)
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: 'test-results/desktop-view.png' })
  })

  test('Performance and loading assessment', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto(VERCEL_URL)
    await page.waitForLoadState('networkidle')
    
    const loadTime = Date.now() - startTime
    console.log(`Page load time: ${loadTime}ms`)
    
    // Check for any console errors
    const logs = []
    page.on('console', msg => logs.push(msg.text()))
    
    // Check for any failed network requests
    const failedRequests = []
    page.on('response', response => {
      if (!response.ok()) {
        failedRequests.push({
          url: response.url(),
          status: response.status()
        })
      }
    })
    
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    console.log('Console logs:', logs)
    console.log('Failed requests:', failedRequests)
    
    // Take performance screenshot
    await page.screenshot({ path: 'test-results/performance-assessment.png' })
  })

  test('CSS and styling verification', async ({ page }) => {
    await page.goto(VERCEL_URL)
    await page.waitForLoadState('networkidle')
    
    // Check if Tailwind classes are applied
    const tailwindCheck = await page.evaluate(() => {
      const element = document.querySelector('body')
      const computedStyle = window.getComputedStyle(element)
      return {
        backgroundColor: computedStyle.backgroundColor,
        fontFamily: computedStyle.fontFamily,
        hasClasses: element?.className || 'No classes found'
      }
    })
    
    console.log('Tailwind/CSS check:', tailwindCheck)
    
    // Check if custom CSS variables are defined
    const cssVariables = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement)
      return {
        glassOpacity: style.getPropertyValue('--glass-opacity-medium'),
        glassBlur: style.getPropertyValue('--glass-blur-lg'),
        primaryColor: style.getPropertyValue('--color-primary')
      }
    })
    
    console.log('CSS variables:', cssVariables)
    
    await page.screenshot({ path: 'test-results/css-verification.png' })
  })
})