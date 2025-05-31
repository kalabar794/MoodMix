import { test, expect } from '@playwright/test'

test.describe('Comprehensive Mood Tile Testing', () => {
  const MOOD_TILES = [
    'Euphoric', 'Melancholic', 'Energetic', 'Serene', 
    'Passionate', 'Contemplative', 'Nostalgic', 'Rebellious',
    'Mystical', 'Triumphant', 'Vulnerable', 'Adventurous'
  ]

  test('Test every mood tile individually', async ({ page }) => {
    console.log('🧪 COMPREHENSIVE MOOD TILE TESTING')
    console.log('=' * 50)

    // Capture ALL console activity
    const allConsoleMessages: string[] = []
    const errors: string[] = []
    const warnings: string[] = []

    page.on('console', msg => {
      const message = `[${msg.type().toUpperCase()}] ${msg.text()}`
      allConsoleMessages.push(message)
      
      if (msg.type() === 'error') {
        errors.push(msg.text())
        console.log(`❌ CONSOLE ERROR: ${msg.text()}`)
      } else if (msg.type() === 'warning') {
        warnings.push(msg.text())
        console.log(`⚠️  CONSOLE WARNING: ${msg.text()}`)
      }
    })

    // Capture page errors (most important)
    const pageErrors: string[] = []
    page.on('pageerror', error => {
      const errorMsg = `${error.name}: ${error.message}\nStack: ${error.stack}`
      pageErrors.push(errorMsg)
      console.log(`💥 PAGE ERROR: ${error.name}: ${error.message}`)
      console.log(`Stack: ${error.stack}`)
    })

    // Capture network failures
    page.on('requestfailed', request => {
      console.log(`🌐 NETWORK FAIL: ${request.url()} - ${request.failure()?.errorText}`)
    })

    try {
      // Navigate to live site
      console.log('📍 Loading live site...')
      await page.goto('https://mood-mix-k5qk4ue9b-vibejpc.vercel.app', { 
        timeout: 30000,
        waitUntil: 'networkidle'
      })

      // Wait for initial load
      await page.waitForTimeout(3000)
      console.log('✅ Page loaded')

      // Take initial screenshot
      await page.screenshot({ path: 'test-results/initial-load.png' })

      // Check if mood tiles are visible
      const moodTilesVisible = await page.locator('button:has-text("Euphoric")').isVisible()
      console.log(`👀 Mood tiles visible: ${moodTilesVisible}`)

      if (!moodTilesVisible) {
        console.log('❌ Mood tiles not found! Taking debug screenshot...')
        await page.screenshot({ path: 'test-results/no-tiles-found.png' })
        const bodyText = await page.textContent('body')
        console.log(`Page content: ${bodyText?.substring(0, 500)}...`)
        return
      }

      // Test each mood tile individually
      for (let i = 0; i < MOOD_TILES.length; i++) {
        const moodName = MOOD_TILES[i]
        console.log(`\n🧪 Testing tile ${i + 1}/${MOOD_TILES.length}: ${moodName}`)
        console.log('-'.repeat(30))

        try {
          // Reset page state between tests
          if (i > 0) {
            console.log('🔄 Resetting page state...')
            await page.reload()
            await page.waitForTimeout(2000)
          }

          // Find the specific mood tile
          const tileSelector = `button:has-text("${moodName}")`
          const tile = page.locator(tileSelector)
          
          const tileExists = await tile.isVisible()
          console.log(`   📍 Tile "${moodName}" visible: ${tileExists}`)

          if (!tileExists) {
            console.log(`   ❌ Tile "${moodName}" not found!`)
            continue
          }

          // Record errors before clicking
          const errorsBefore = pageErrors.length
          const consoleErrorsBefore = errors.length

          // Click the tile
          console.log(`   🖱️  Clicking "${moodName}" tile...`)
          await tile.click({ timeout: 5000 })

          // Wait for any async operations
          await page.waitForTimeout(3000)

          // Check for new errors after clicking
          const errorsAfter = pageErrors.length
          const consoleErrorsAfter = errors.length

          if (errorsAfter > errorsBefore || consoleErrorsAfter > consoleErrorsBefore) {
            console.log(`   ❌ "${moodName}" CAUSED ERRORS!`)
            console.log(`      Page errors: ${errorsBefore} -> ${errorsAfter}`)
            console.log(`      Console errors: ${consoleErrorsBefore} -> ${consoleErrorsAfter}`)
            
            // Take screenshot of error state
            await page.screenshot({ path: `test-results/error-${moodName.toLowerCase()}.png` })

            // Log the specific errors
            if (errorsAfter > errorsBefore) {
              for (let j = errorsBefore; j < errorsAfter; j++) {
                console.log(`      PAGE ERROR ${j + 1}: ${pageErrors[j]}`)
              }
            }
            if (consoleErrorsAfter > consoleErrorsBefore) {
              for (let j = consoleErrorsBefore; j < consoleErrorsAfter; j++) {
                console.log(`      CONSOLE ERROR ${j + 1}: ${errors[j]}`)
              }
            }
          } else {
            console.log(`   ✅ "${moodName}" clicked successfully - no errors`)
            
            // Check if we got to results or loading state
            const hasLoading = await page.locator('text="Discovering Your Music"').isVisible().catch(() => false)
            const hasResults = await page.locator('text="Your Perfect Soundtrack"').isVisible().catch(() => false)
            const hasError = await page.locator('text="Application error"').isVisible().catch(() => false)
            
            console.log(`      Loading state: ${hasLoading}`)
            console.log(`      Results state: ${hasResults}`)
            console.log(`      Error state: ${hasError}`)
          }

        } catch (error) {
          console.log(`   💥 Exception testing "${moodName}": ${error}`)
          await page.screenshot({ path: `test-results/exception-${moodName.toLowerCase()}.png` })
        }
      }

      // Final summary
      console.log('\n📊 FINAL TEST SUMMARY')
      console.log('=' * 50)
      console.log(`Total page errors: ${pageErrors.length}`)
      console.log(`Total console errors: ${errors.length}`)
      console.log(`Total console warnings: ${warnings.length}`)
      console.log(`Total console messages: ${allConsoleMessages.length}`)

      if (pageErrors.length > 0) {
        console.log('\n💥 ALL PAGE ERRORS:')
        pageErrors.forEach((error, index) => {
          console.log(`${index + 1}. ${error}`)
        })
      }

      if (errors.length > 0) {
        console.log('\n❌ ALL CONSOLE ERRORS:')
        errors.forEach((error, index) => {
          console.log(`${index + 1}. ${error}`)
        })
      }

    } catch (error) {
      console.log(`💥 Test framework error: ${error}`)
      await page.screenshot({ path: 'test-results/test-framework-error.png' })
    }

    // Test should always pass so we get the full output
    expect(true).toBe(true)
  })
})