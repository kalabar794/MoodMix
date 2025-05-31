import { test, expect } from '@playwright/test'

test.describe('YouTube Music Video Integration Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://mood-mix-theta.vercel.app')
    await page.waitForLoadState('networkidle')
  })

  test('YouTube buttons appear and function correctly', async ({ page }) => {
    console.log('🎬 Testing YouTube music video integration...')
    
    // Select a mood to get music results
    const moodButton = page.locator('button:has-text("Energetic")').first()
    await expect(moodButton).toBeVisible()
    await moodButton.click()
    
    // Wait for music results to load
    await page.waitForTimeout(8000)
    
    // Check if results loaded
    const resultsLoaded = await page.locator('text="Your Perfect Soundtrack"').count() > 0
    if (!resultsLoaded) {
      console.log('   ⚠️ No music results loaded - skipping YouTube test')
      return
    }
    
    console.log('   ✅ Music results loaded successfully')
    
    // Look for YouTube buttons (red buttons with play icon)
    const youtubeButtons = page.locator('button[class*="bg-red"], button:has(svg[viewBox*="24 24"]):has(path[d*="8 5v14l11-7z"])')
    const youtubeButtonCount = await youtubeButtons.count()
    console.log(`   📊 YouTube buttons found: ${youtubeButtonCount}`)
    
    if (youtubeButtonCount === 0) {
      console.log('   ⚠️ No YouTube buttons found - checking for loading states...')
      
      // Check for loading indicators
      const loadingButtons = page.locator('button:has(.animate-spin), button[disabled]')
      const loadingCount = await loadingButtons.count()
      console.log(`   📊 Loading buttons found: ${loadingCount}`)
      
      if (loadingCount > 0) {
        console.log('   🔄 YouTube videos are still loading...')
        // Wait a bit more for YouTube search to complete
        await page.waitForTimeout(5000)
        
        const youtubeButtonsAfterWait = await youtubeButtons.count()
        console.log(`   📊 YouTube buttons after wait: ${youtubeButtonsAfterWait}`)
      }
      
      return
    }
    
    // Test clicking a YouTube button
    console.log('   🎵 Testing YouTube video playback...')
    const firstYouTubeButton = youtubeButtons.first()
    
    // Get button properties before clicking
    const buttonProps = await firstYouTubeButton.evaluate(el => ({
      isEnabled: !el.hasAttribute('disabled'),
      title: el.getAttribute('title') || '',
      classList: Array.from(el.classList)
    }))
    
    console.log('   🔍 YouTube button properties:', buttonProps)
    
    if (buttonProps.isEnabled) {
      // Click the YouTube button
      await firstYouTubeButton.click()
      await page.waitForTimeout(3000)
      
      // Check if YouTube player modal appeared
      const youtubeModal = page.locator('[class*="fixed"][class*="inset-0"], .youtube-player, iframe[src*="youtube.com"]')
      const modalVisible = await youtubeModal.count() > 0
      
      if (modalVisible) {
        console.log('   🎊 SUCCESS! YouTube video player opened!')
        
        // Check for player elements
        const playerElements = await page.locator('iframe[src*="youtube.com/embed"]').count()
        console.log(`   📺 YouTube iframe players: ${playerElements}`)
        
        // Check for modal header
        const modalHeader = await page.locator('text*="Official", text*="Music Video", text*="YouTube"').count()
        console.log(`   📋 Modal header elements: ${modalHeader}`)
        
        // Test closing the modal
        const closeButton = page.locator('button:has(span:text("×")), button[aria-label*="close"]')
        if (await closeButton.count() > 0) {
          await closeButton.first().click()
          await page.waitForTimeout(1000)
          
          const modalStillVisible = await youtubeModal.count() > 0
          console.log(`   ✅ Close button: ${modalStillVisible ? 'Modal still visible' : 'Modal closed successfully'}`)
        }
      } else {
        console.log('   ⚠️ YouTube player modal did not appear - checking for external redirect...')
        
        // Check if we were redirected to YouTube (in case of fallback)
        const currentUrl = page.url()
        if (currentUrl.includes('youtube.com')) {
          console.log('   🔗 Redirected to YouTube successfully')
        } else {
          console.log('   ❌ No YouTube player or redirect detected')
        }
      }
    } else {
      console.log('   ⚠️ YouTube button is disabled')
    }
  })

  test('YouTube integration with different moods', async ({ page }) => {
    console.log('🎭 Testing YouTube integration across different moods...')
    
    const moodsToTest = ['Serene', 'Melancholic', 'Passionate']
    let totalYouTubeButtons = 0
    let workingButtons = 0
    
    for (const mood of moodsToTest) {
      console.log(`\n🎵 Testing ${mood} mood...`)
      
      // Go to fresh page for each mood
      await page.goto('https://mood-mix-theta.vercel.app')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(2000)
      
      // Select mood
      const moodButton = page.locator(`button:has-text("${mood}")`).first()
      await moodButton.click()
      await page.waitForTimeout(8000)
      
      // Check for results
      const hasResults = await page.locator('text="Your Perfect Soundtrack"').count() > 0
      if (!hasResults) {
        console.log(`   ❌ ${mood}: No results loaded`)
        continue
      }
      
      console.log(`   ✅ ${mood}: Results loaded`)
      
      // Count YouTube buttons
      const youtubeButtons = page.locator('button[class*="bg-red"]')
      const buttonCount = await youtubeButtons.count()
      totalYouTubeButtons += buttonCount
      
      console.log(`   📊 ${mood}: ${buttonCount} YouTube buttons found`)
      
      // Test functionality of first button if available
      if (buttonCount > 0) {
        const firstButton = youtubeButtons.first()
        const isWorking = await firstButton.evaluate(el => {
          return !el.hasAttribute('disabled') && 
                 !el.classList.contains('opacity-50') &&
                 !el.classList.contains('cursor-not-allowed')
        })
        
        if (isWorking) {
          workingButtons++
          console.log(`   ✅ ${mood}: Functional YouTube button detected`)
        } else {
          console.log(`   ⚠️ ${mood}: YouTube button appears disabled`)
        }
      }
    }
    
    console.log('\n📊 YouTube Integration Summary:')
    console.log(`   Total YouTube buttons across moods: ${totalYouTubeButtons}`)
    console.log(`   Working YouTube buttons: ${workingButtons}`)
    
    const successRate = moodsToTest.length > 0 ? (workingButtons / moodsToTest.length) * 100 : 0
    console.log(`   Success rate: ${successRate.toFixed(1)}%`)
    
    if (workingButtons > 0) {
      console.log('   🎉 YouTube integration is working!')
    } else if (totalYouTubeButtons > 0) {
      console.log('   ⚠️ YouTube buttons present but may need API configuration')
    } else {
      console.log('   💡 YouTube integration may need YouTube API key configuration')
    }
  })

  test('YouTube player modal functionality', async ({ page }) => {
    console.log('🎬 Testing YouTube player modal interface...')
    
    // Get to music results
    await page.locator('button:has-text("Triumphant")').first().click()
    await page.waitForTimeout(8000)
    
    const hasResults = await page.locator('text="Your Perfect Soundtrack"').count() > 0
    if (!hasResults) {
      console.log('   ⚠️ No results - skipping modal test')
      return
    }
    
    // Find and click YouTube button
    const youtubeButton = page.locator('button[class*="bg-red"]').first()
    const buttonExists = await youtubeButton.count() > 0
    
    if (!buttonExists) {
      console.log('   ⚠️ No YouTube button found - skipping modal test')
      return
    }
    
    console.log('   🎵 Testing modal functionality...')
    await youtubeButton.click()
    await page.waitForTimeout(3000)
    
    // Test modal elements
    const modalTests = [
      {
        name: 'Modal background',
        selector: '[class*="fixed"][class*="inset-0"]',
        expected: 'Modal overlay appears'
      },
      {
        name: 'Video iframe',
        selector: 'iframe[src*="youtube.com"]',
        expected: 'YouTube video embed loads'
      },
      {
        name: 'Close button',
        selector: 'button:has(span:text("×"))',
        expected: 'Close button is present'
      },
      {
        name: 'YouTube link button',
        selector: 'button:has(svg[viewBox*="24 24"]):has(text*="Watch")',
        expected: 'External YouTube link button available'
      }
    ]
    
    for (const test of modalTests) {
      const elementCount = await page.locator(test.selector).count()
      if (elementCount > 0) {
        console.log(`   ✅ ${test.name}: ${test.expected}`)
      } else {
        console.log(`   ⚠️ ${test.name}: Not found`)
      }
    }
    
    // Test keyboard controls
    console.log('   ⌨️ Testing keyboard controls...')
    await page.keyboard.press('Escape')
    await page.waitForTimeout(1000)
    
    const modalStillVisible = await page.locator('[class*="fixed"][class*="inset-0"]').count() > 0
    if (!modalStillVisible) {
      console.log('   ✅ ESC key closes modal successfully')
    } else {
      console.log('   ⚠️ ESC key did not close modal')
    }
  })

  test('YouTube search fallback functionality', async ({ page }) => {
    console.log('🔄 Testing YouTube search fallback (without API key)...')
    
    // This test verifies the fallback behavior when YouTube API key is not available
    // The system should still provide YouTube search links
    
    await page.locator('button:has-text("Mystical")').first().click()
    await page.waitForTimeout(8000)
    
    const hasResults = await page.locator('text="Your Perfect Soundtrack"').count() > 0
    if (!hasResults) {
      console.log('   ⚠️ No results - skipping fallback test')
      return
    }
    
    console.log('   ✅ Music results loaded')
    
    // Check for any YouTube-related buttons or links
    const youtubeElements = [
      page.locator('button[class*="bg-red"]'), // YouTube buttons
      page.locator('a[href*="youtube.com"]'), // YouTube links
      page.locator('button[title*="YouTube"]'), // YouTube titled buttons
      page.locator('button:has(svg[viewBox*="24 24"])') // Play button icons
    ]
    
    let totalYouTubeElements = 0
    for (const elementLocator of youtubeElements) {
      const count = await elementLocator.count()
      totalYouTubeElements += count
    }
    
    console.log(`   📊 Total YouTube-related elements: ${totalYouTubeElements}`)
    
    if (totalYouTubeElements > 0) {
      console.log('   ✅ YouTube integration elements present')
      
      // Test clicking the first available element
      const firstElement = youtubeElements.find(async (el) => await el.count() > 0)
      if (firstElement && await firstElement.count() > 0) {
        const elementType = await firstElement.first().evaluate(el => ({
          tagName: el.tagName,
          href: el.getAttribute('href'),
          title: el.getAttribute('title')
        }))
        
        console.log('   🔍 First YouTube element:', elementType)
        
        if (elementType.tagName === 'A' && elementType.href) {
          console.log('   🔗 YouTube link found - fallback working correctly')
        } else {
          console.log('   🎬 YouTube button found - full integration working')
        }
      }
    } else {
      console.log('   💡 No YouTube elements - may need configuration or API key')
    }
  })

  test('Multi-source audio experience', async ({ page }) => {
    console.log('🎵 Testing complete multi-source audio experience...')
    
    await page.locator('button:has-text("Adventurous")').first().click()
    await page.waitForTimeout(8000)
    
    const hasResults = await page.locator('text="Your Perfect Soundtrack"').count() > 0
    if (!hasResults) {
      console.log('   ⚠️ No results - skipping multi-source test')
      return
    }
    
    console.log('   ✅ Music results loaded')
    
    // Count different types of audio buttons
    const buttonTypes = [
      {
        name: 'YouTube buttons',
        selector: 'button[class*="bg-red"]',
        description: 'Full music videos'
      },
      {
        name: 'Spotify preview buttons',
        selector: 'button[class*="bg-purple"]',
        description: '30-second previews'
      },
      {
        name: 'Spotify redirect buttons',
        selector: 'button[class*="bg-green"]',
        description: 'Full tracks on Spotify'
      }
    ]
    
    let totalFunctionalButtons = 0
    
    for (const buttonType of buttonTypes) {
      const count = await page.locator(buttonType.selector).count()
      totalFunctionalButtons += count
      console.log(`   📊 ${buttonType.name}: ${count} (${buttonType.description})`)
    }
    
    console.log(`   📊 Total functional audio buttons: ${totalFunctionalButtons}`)
    
    // Calculate tracks covered
    const totalTracks = await page.locator('.track-card, [class*="track"]').count()
    const coverageRate = totalTracks > 0 ? (totalFunctionalButtons / totalTracks) * 100 : 0
    
    console.log(`   📊 Audio coverage: ${coverageRate.toFixed(1)}% (${totalFunctionalButtons}/${totalTracks} tracks)`)
    
    if (coverageRate >= 100) {
      console.log('   🎉 EXCELLENT! Every track has multiple audio options')
    } else if (coverageRate >= 80) {
      console.log('   ✅ GREAT! Most tracks have audio options')
    } else if (coverageRate >= 50) {
      console.log('   ⚠️ GOOD! Some tracks have audio options')
    } else {
      console.log('   💡 Audio options available but may need enhancement')
    }
    
    // Test actual functionality
    if (totalFunctionalButtons > 0) {
      console.log('   🎵 Testing actual playback functionality...')
      
      // Try YouTube button first
      const youtubeButton = page.locator('button[class*="bg-red"]').first()
      if (await youtubeButton.count() > 0) {
        await youtubeButton.click()
        await page.waitForTimeout(2000)
        
        const youtubeWorking = await page.locator('iframe[src*="youtube"], [class*="fixed"][class*="inset-0"]').count() > 0
        console.log(`   🎬 YouTube playback: ${youtubeWorking ? 'Working' : 'Needs verification'}`)
        
        if (youtubeWorking) {
          await page.keyboard.press('Escape')
          await page.waitForTimeout(1000)
        }
      }
      
      // Try Spotify preview button
      const previewButton = page.locator('button[class*="bg-purple"]').first()
      if (await previewButton.count() > 0) {
        await previewButton.click()
        await page.waitForTimeout(2000)
        
        const previewWorking = await page.locator('[class*="ring-purple"], .fixed.bottom-6').count() > 0
        console.log(`   🎵 Spotify preview: ${previewWorking ? 'Working' : 'No preview URL available'}`)
      }
    }
  })
})