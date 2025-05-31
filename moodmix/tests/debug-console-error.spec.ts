import { test, expect } from '@playwright/test'

test('Debug console error on live site', async ({ page }) => {
  // Capture all console messages
  const consoleMessages: string[] = []
  const consoleErrors: string[] = []
  
  page.on('console', msg => {
    const text = `[${msg.type()}] ${msg.text()}`
    consoleMessages.push(text)
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text())
    }
  })

  // Capture page errors
  const pageErrors: string[] = []
  page.on('pageerror', error => {
    pageErrors.push(error.message)
  })

  // Navigate to live site
  console.log('🔍 Loading live site...')
  await page.goto('https://mood-mix-theta.vercel.app', { 
    waitUntil: 'networkidle',
    timeout: 30000 
  })

  // Wait a bit for any async errors
  await page.waitForTimeout(3000)

  // Try to find mood cards
  const moodCardsVisible = await page.locator('button:has-text("Euphoric")').isVisible().catch(() => false)
  
  console.log('📊 Debug Results:')
  console.log(`Mood cards visible: ${moodCardsVisible}`)
  console.log(`Console messages: ${consoleMessages.length}`)
  console.log(`Console errors: ${consoleErrors.length}`)
  console.log(`Page errors: ${pageErrors.length}`)

  if (consoleMessages.length > 0) {
    console.log('\n📝 Console Messages:')
    consoleMessages.forEach(msg => console.log(msg))
  }

  if (consoleErrors.length > 0) {
    console.log('\n❌ Console Errors:')
    consoleErrors.forEach(error => console.log(error))
  }

  if (pageErrors.length > 0) {
    console.log('\n💥 Page Errors:')
    pageErrors.forEach(error => console.log(error))
  }

  // Take screenshot for debugging
  await page.screenshot({ path: 'test-results/live-site-debug.png', fullPage: true })

  // If there are errors, click a mood card to trigger the issue
  if (moodCardsVisible) {
    console.log('\n🔬 Testing mood card click...')
    try {
      await page.click('button:has-text("Euphoric")', { timeout: 5000 })
      await page.waitForTimeout(2000)
      console.log('✅ Mood card click successful')
    } catch (error) {
      console.log(`❌ Mood card click failed: ${error}`)
    }
    
    await page.screenshot({ path: 'test-results/after-click-debug.png', fullPage: true })
  }

  // Final error summary
  if (consoleErrors.length > 0 || pageErrors.length > 0) {
    console.log('\n🚨 ERRORS DETECTED - Site has issues!')
  } else {
    console.log('\n✅ No errors detected - Site appears to be working')
  }
})