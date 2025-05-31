import { test, expect } from '@playwright/test'

test('Emergency debug - capture actual error', async ({ page }) => {
  console.log('🚨 EMERGENCY DEBUG - Capturing actual error from live site')
  
  // Capture ALL console output
  const allLogs: string[] = []
  page.on('console', msg => {
    const logEntry = `[${msg.type().toUpperCase()}] ${msg.text()}`
    allLogs.push(logEntry)
    console.log(`CONSOLE: ${logEntry}`)
  })

  // Capture page errors  
  const pageErrors: string[] = []
  page.on('pageerror', error => {
    const errorMsg = `PAGE ERROR: ${error.name}: ${error.message}\nStack: ${error.stack}`
    pageErrors.push(errorMsg)
    console.log(errorMsg)
  })

  // Capture network failures
  page.on('requestfailed', request => {
    console.log(`NETWORK FAIL: ${request.url()} - ${request.failure()?.errorText}`)
  })

  try {
    console.log('📍 Navigating to live site...')
    await page.goto('https://mood-mix-theta.vercel.app', { 
      timeout: 30000,
      waitUntil: 'domcontentloaded'
    })
    
    console.log('⏳ Waiting for page to load...')
    await page.waitForTimeout(5000)

    // Check if we can see the page content
    const bodyText = await page.textContent('body').catch(() => 'ERROR GETTING BODY')
    console.log(`📄 Body contains: ${bodyText.substring(0, 200)}...`)

    // Try to interact with the page
    console.log('🔍 Looking for mood cards...')
    const moodCards = await page.locator('button').count()
    console.log(`🎯 Found ${moodCards} buttons on page`)

    if (moodCards > 0) {
      console.log('🖱️ Attempting to click first button...')
      await page.locator('button').first().click({ timeout: 5000 })
      await page.waitForTimeout(3000)
    }

  } catch (error) {
    console.log(`❌ Navigation/interaction error: ${error}`)
  }

  // Final summary
  console.log('\n📊 FINAL ERROR SUMMARY:')
  console.log(`Total console logs: ${allLogs.length}`)
  console.log(`Page errors: ${pageErrors.length}`)
  
  if (pageErrors.length > 0) {
    console.log('\n💥 PAGE ERRORS FOUND:')
    pageErrors.forEach(error => console.log(error))
  }

  // Take final screenshot
  await page.screenshot({ 
    path: 'test-results/emergency-debug.png', 
    fullPage: true 
  }).catch(() => console.log('Failed to take screenshot'))

  // Force test to complete
  expect(true).toBe(true)
})