import { test, expect } from '@playwright/test'

test('Verify mood tile fix - no more application errors', async ({ page }) => {
  console.log('🔧 TESTING MOOD TILE FIX')
  
  // Track all errors
  const pageErrors: string[] = []
  const consoleErrors: string[] = []
  
  page.on('pageerror', error => {
    pageErrors.push(`${error.name}: ${error.message}`)
    console.log(`❌ PAGE ERROR: ${error.name}: ${error.message}`)
  })
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text())
      console.log(`❌ CONSOLE ERROR: ${msg.text()}`)
    }
  })

  // Test the live site
  await page.goto('https://mood-mix-k5qk4ue9b-vibejpc.vercel.app')
  await page.waitForTimeout(3000)
  
  console.log('✅ Page loaded successfully')
  
  // Test each mood tile that was causing errors
  const problemMoods = ['Euphoric', 'Melancholic', 'Serene', 'Passionate', 'Contemplative']
  
  for (const mood of problemMoods) {
    console.log(`🧪 Testing ${mood}...`)
    
    // Reset page
    await page.reload()
    await page.waitForTimeout(2000)
    
    // Track errors before clicking
    const errorsBefore = pageErrors.length + consoleErrors.length
    
    // Click the mood tile
    const tileSelector = `button:has-text("${mood}")`
    const tileExists = await page.locator(tileSelector).isVisible()
    
    if (tileExists) {
      await page.click(tileSelector)
      await page.waitForTimeout(2000)
      
      // Check for new errors
      const errorsAfter = pageErrors.length + consoleErrors.length
      
      if (errorsAfter > errorsBefore) {
        console.log(`❌ ${mood} still causes errors!`)
      } else {
        console.log(`✅ ${mood} works correctly!`)
      }
    } else {
      console.log(`⚠️ ${mood} tile not found`)
    }
  }
  
  console.log(`\n📊 Final Results:`)
  console.log(`Total page errors: ${pageErrors.length}`)
  console.log(`Total console errors: ${consoleErrors.length}`)
  
  if (pageErrors.length === 0 && consoleErrors.length === 0) {
    console.log('🎉 SUCCESS: No errors detected!')
  } else {
    console.log('❌ STILL HAVE ERRORS:')
    pageErrors.forEach(error => console.log(`  PAGE: ${error}`))
    consoleErrors.forEach(error => console.log(`  CONSOLE: ${error}`))
  }
  
  expect(pageErrors.length).toBe(0)
  expect(consoleErrors.length).toBe(0)
})