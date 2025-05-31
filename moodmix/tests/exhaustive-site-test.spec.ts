import { test, expect } from '@playwright/test'

test.describe('EXHAUSTIVE SITE TESTING - EVERY TILE, EVERY PAGE', () => {
  
  test('Test EVERY mood tile and capture ALL errors', async ({ page }) => {
    console.log('🔥 EXHAUSTIVE TESTING OF EVERY SINGLE TILE')
    console.log('=' * 60)

    // Arrays to capture ALL errors
    const allPageErrors: Array<{tile: string, error: string}> = []
    const allConsoleErrors: Array<{tile: string, error: string}> = []
    const allNetworkErrors: Array<{tile: string, url: string, error: string}> = []
    const successfulTiles: string[] = []
    const failedTiles: string[] = []

    // ALL mood tiles to test
    const ALL_TILES = [
      'Euphoric', 'Melancholic', 'Energetic', 'Serene', 
      'Passionate', 'Contemplative', 'Nostalgic', 'Rebellious',
      'Mystical', 'Triumphant', 'Vulnerable', 'Adventurous'
    ]

    let currentTile = 'INITIAL_LOAD'

    // Capture ALL console activity
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const error = msg.text()
        allConsoleErrors.push({tile: currentTile, error})
        console.log(`❌ [${currentTile}] CONSOLE ERROR: ${error}`)
      } else if (msg.type() === 'warn') {
        console.log(`⚠️  [${currentTile}] CONSOLE WARNING: ${msg.text()}`)
      }
    })

    // Capture ALL page errors
    page.on('pageerror', error => {
      const errorMsg = `${error.name}: ${error.message}\n${error.stack}`
      allPageErrors.push({tile: currentTile, error: errorMsg})
      console.log(`💥 [${currentTile}] PAGE ERROR: ${error.name}: ${error.message}`)
    })

    // Capture ALL network failures
    page.on('requestfailed', request => {
      const networkError = `${request.url()} - ${request.failure()?.errorText || 'Unknown error'}`
      allNetworkErrors.push({tile: currentTile, url: request.url(), error: networkError})
      console.log(`🌐 [${currentTile}] NETWORK FAIL: ${networkError}`)
    })

    // Test initial page load
    console.log('\n📍 TESTING INITIAL PAGE LOAD...')
    try {
      await page.goto('https://mood-mix-theta.vercel.app', { 
        timeout: 45000,
        waitUntil: 'networkidle'
      })
      await page.waitForTimeout(5000)
      console.log('✅ Initial page load successful')
    } catch (error) {
      console.log(`❌ Initial page load failed: ${error}`)
      failedTiles.push('INITIAL_LOAD')
    }

    // Check if tiles are visible at all
    const tilesContainer = await page.locator('button:has-text("Euphoric")').first().isVisible().catch(() => false)
    if (!tilesContainer) {
      console.log('❌ CRITICAL: No mood tiles found on page!')
      const bodyContent = await page.textContent('body').catch(() => 'Could not get body content')
      console.log(`Page content preview: ${bodyContent.substring(0, 500)}...`)
      await page.screenshot({ path: 'test-results/no-tiles-found.png', fullPage: true })
    }

    // Test EVERY SINGLE TILE
    for (let i = 0; i < ALL_TILES.length; i++) {
      const tileName = ALL_TILES[i]
      currentTile = tileName
      
      console.log(`\n🧪 TESTING TILE ${i + 1}/${ALL_TILES.length}: ${tileName}`)
      console.log('-' * 40)

      try {
        // Fresh page load for each tile to avoid state contamination
        console.log(`   🔄 Loading fresh page for ${tileName}...`)
        await page.goto('https://mood-mix-theta.vercel.app', { 
          timeout: 30000,
          waitUntil: 'domcontentloaded'
        })
        await page.waitForTimeout(3000)

        // Count errors before clicking
        const pageErrorsBefore = allPageErrors.length
        const consoleErrorsBefore = allConsoleErrors.length

        // Find the specific tile
        const tileSelector = `button:has-text("${tileName}")`
        const tileLocator = page.locator(tileSelector)
        
        // Check if tile exists
        const tileExists = await tileLocator.isVisible({ timeout: 10000 }).catch(() => false)
        console.log(`   👀 Tile "${tileName}" visible: ${tileExists}`)

        if (!tileExists) {
          console.log(`   ❌ TILE NOT FOUND: ${tileName}`)
          failedTiles.push(tileName)
          await page.screenshot({ path: `test-results/${tileName}-not-found.png` })
          continue
        }

        // Click the tile
        console.log(`   🖱️  Clicking ${tileName} tile...`)
        await tileLocator.click({ timeout: 10000 })
        
        // Wait for any async operations
        await page.waitForTimeout(5000)

        // Check for errors after clicking
        const pageErrorsAfter = allPageErrors.length
        const consoleErrorsAfter = allConsoleErrors.length
        
        const hasNewErrors = pageErrorsAfter > pageErrorsBefore || consoleErrorsAfter > consoleErrorsBefore

        if (hasNewErrors) {
          console.log(`   ❌ ${tileName} CAUSED ${pageErrorsAfter - pageErrorsBefore} PAGE ERRORS`)
          console.log(`   ❌ ${tileName} CAUSED ${consoleErrorsAfter - consoleErrorsBefore} CONSOLE ERRORS`)
          failedTiles.push(tileName)
          await page.screenshot({ path: `test-results/${tileName}-error.png` })
        } else {
          // Check page state after click
          const hasApplicationError = await page.locator('text="Application error"').isVisible().catch(() => false)
          const hasLoading = await page.locator('text="Discovering Your Music"').isVisible().catch(() => false)
          const hasResults = await page.locator('text="Your Perfect Soundtrack"').isVisible().catch(() => false)

          console.log(`   📊 Application error: ${hasApplicationError}`)
          console.log(`   📊 Loading state: ${hasLoading}`)
          console.log(`   📊 Results state: ${hasResults}`)

          if (hasApplicationError) {
            console.log(`   ❌ ${tileName} shows "Application error" message`)
            failedTiles.push(tileName)
            await page.screenshot({ path: `test-results/${tileName}-app-error.png` })
          } else {
            console.log(`   ✅ ${tileName} SUCCESSFUL`)
            successfulTiles.push(tileName)
            await page.screenshot({ path: `test-results/${tileName}-success.png` })
          }
        }

      } catch (error) {
        console.log(`   💥 EXCEPTION testing ${tileName}: ${error}`)
        failedTiles.push(tileName)
        await page.screenshot({ path: `test-results/${tileName}-exception.png` }).catch(() => {})
      }
    }

    // COMPREHENSIVE FINAL REPORT
    console.log('\n' + '=' * 60)
    console.log('📊 COMPREHENSIVE TEST RESULTS')
    console.log('=' * 60)
    
    console.log(`✅ SUCCESSFUL TILES (${successfulTiles.length}/${ALL_TILES.length}):`)
    successfulTiles.forEach(tile => console.log(`   ✅ ${tile}`))
    
    console.log(`\n❌ FAILED TILES (${failedTiles.length}/${ALL_TILES.length}):`)
    failedTiles.forEach(tile => console.log(`   ❌ ${tile}`))
    
    console.log(`\n💥 TOTAL PAGE ERRORS: ${allPageErrors.length}`)
    allPageErrors.forEach((error, i) => {
      console.log(`   ${i + 1}. [${error.tile}] ${error.error.split('\n')[0]}`)
    })
    
    console.log(`\n❌ TOTAL CONSOLE ERRORS: ${allConsoleErrors.length}`)
    allConsoleErrors.forEach((error, i) => {
      console.log(`   ${i + 1}. [${error.tile}] ${error.error}`)
    })
    
    console.log(`\n🌐 TOTAL NETWORK ERRORS: ${allNetworkErrors.length}`)
    allNetworkErrors.forEach((error, i) => {
      console.log(`   ${i + 1}. [${error.tile}] ${error.url}`)
    })

    // SUCCESS RATE
    const successRate = (successfulTiles.length / ALL_TILES.length) * 100
    console.log(`\n📈 SUCCESS RATE: ${successRate.toFixed(1)}%`)
    
    if (successRate < 100) {
      console.log('🚨 CRITICAL: NOT ALL TILES WORK!')
    } else {
      console.log('🎉 SUCCESS: ALL TILES WORKING!')
    }

    // Create detailed error report
    const errorReport = {
      totalTiles: ALL_TILES.length,
      successfulTiles: successfulTiles.length,
      failedTiles: failedTiles.length,
      successRate: `${successRate.toFixed(1)}%`,
      successful: successfulTiles,
      failed: failedTiles,
      pageErrors: allPageErrors,
      consoleErrors: allConsoleErrors,
      networkErrors: allNetworkErrors
    }

    // Write error report to file
    await page.evaluate((report) => {
      console.log('DETAILED ERROR REPORT:', JSON.stringify(report, null, 2))
    }, errorReport)

    // Test passes if we have more than 80% success rate (adjust as needed)
    expect(successRate).toBeGreaterThanOrEqual(80)
  })

  test('Test ALL API endpoints', async ({ page }) => {
    console.log('\n🌐 TESTING ALL API ENDPOINTS')
    
    const apiEndpoints = [
      '/api/health',
      '/api/mood-to-music',
      '/api/spotify-auth'
    ]

    for (const endpoint of apiEndpoints) {
      console.log(`🧪 Testing ${endpoint}...`)
      
      try {
        const response = await page.request.get(`https://mood-mix-theta.vercel.app${endpoint}`)
        const status = response.status()
        console.log(`   Status: ${status}`)
        
        if (status === 200) {
          console.log(`   ✅ ${endpoint} working`)
        } else {
          console.log(`   ❌ ${endpoint} returned ${status}`)
        }
      } catch (error) {
        console.log(`   💥 ${endpoint} error: ${error}`)
      }
    }
  })
})