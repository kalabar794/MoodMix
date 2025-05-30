import { test, expect } from '@playwright/test'

test.describe('Inspect MoodWheel Content', () => {
  
  test('Inspect the actual MoodWheel content', async ({ page }) => {
    await page.goto('http://localhost:3001')
    await page.waitForLoadState('networkidle')
    
    // Find and inspect the glass-ultra container
    const glassUltraContent = await page.evaluate(() => {
      const element = document.querySelector('.glass-ultra')
      return element ? element.innerHTML : 'GLASS ULTRA NOT FOUND'
    })
    console.log('Glass Ultra Content:', glassUltraContent.substring(0, 1000))
    
    // Check for SVG or mood wheel elements
    const moodWheelDetails = await page.evaluate(() => {
      const svgs = document.querySelectorAll('svg')
      const circles = document.querySelectorAll('circle')
      const paths = document.querySelectorAll('path')
      
      return {
        svgCount: svgs.length,
        circleCount: circles.length,
        pathCount: paths.length,
        hasMoodWheelPremium: !!document.querySelector('.mood-wheel-premium'),
        allMoodClasses: Array.from(document.querySelectorAll('[class*="mood"]')).map(el => el.className)
      }
    })
    console.log('Mood Wheel Details:', moodWheelDetails)
    
    // Check if there are any hidden or invisible elements
    const hiddenElements = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*')
      let hiddenCount = 0
      let invisibleCount = 0
      
      for (const el of allElements) {
        const style = window.getComputedStyle(el)
        if (style.display === 'none') hiddenCount++
        if (style.visibility === 'hidden') invisibleCount++
      }
      
      return { hiddenCount, invisibleCount }
    })
    console.log('Hidden/Invisible elements:', hiddenElements)
    
    // Try to find the actual MoodWheel component
    const moodWheelComponent = await page.evaluate(() => {
      // Look for any element that might be the mood wheel
      const candidates = [
        document.querySelector('[class*="wheel"]'),
        document.querySelector('[class*="mood-wheel"]'),
        document.querySelector('svg[width]'),
        document.querySelector('.glass-ultra > *'),
      ]
      
      return candidates.map((el, i) => ({
        index: i,
        exists: !!el,
        tagName: el?.tagName,
        className: el?.className,
        innerHTML: el?.innerHTML.substring(0, 200)
      }))
    })
    console.log('MoodWheel candidates:', moodWheelComponent)
    
    // Get computed styles of glass-ultra
    const glassStyles = await page.evaluate(() => {
      const element = document.querySelector('.glass-ultra')
      if (element) {
        const style = window.getComputedStyle(element)
        return {
          display: style.display,
          width: style.width,
          height: style.height,
          background: style.background,
          backdropFilter: style.backdropFilter,
          border: style.border,
          borderRadius: style.borderRadius,
          boxShadow: style.boxShadow
        }
      }
      return null
    })
    console.log('Glass Ultra Styles:', glassStyles)
  })
})