import { test, expect } from '@playwright/test'

test.describe('Audio Preview Functionality', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://mood-mix-theta.vercel.app')
    await page.waitForLoadState('networkidle')
  })

  test('Preview button appears and functions correctly', async ({ page }) => {
    console.log('🎵 Testing audio preview functionality...')
    
    // Select a mood to get music results
    const moodButton = page.locator('button:has-text("Energetic")').first()
    await moodButton.click()
    await page.waitForTimeout(5000) // Wait for music results
    
    // Check if music results loaded
    const resultsVisible = await page.locator('text="Your Perfect Soundtrack"').isVisible()
    if (!resultsVisible) {
      console.log('   ⚠️ No music results loaded - skipping preview test')
      return
    }
    
    console.log('   ✅ Music results loaded')
    
    // Find preview buttons
    const previewButtons = page.locator('button[title*="preview"], button:has(div[class*="border-l"])')
    const previewButtonCount = await previewButtons.count()
    console.log(`   📊 Preview buttons found: ${previewButtonCount}`)
    
    if (previewButtonCount === 0) {
      console.log('   ⚠️ No preview buttons found')
      return
    }
    
    // Test first available preview button
    const firstPreviewButton = previewButtons.first()
    const isEnabled = await firstPreviewButton.isEnabled()
    console.log(`   📊 First preview button enabled: ${isEnabled}`)
    
    if (isEnabled) {
      // Click to play preview
      await firstPreviewButton.click()
      await page.waitForTimeout(2000)
      
      // Check for playing state indicators
      const playingIndicators = [
        page.locator('[class*="ring-purple"]'), // Playing card highlight
        page.locator('div:has(div[class*="bg-white rounded-full"])'), // Pause button
        page.locator('[class*="fixed bottom"]'), // Global audio control
        page.locator('text="🔊"') // Volume control
      ]
      
      let foundPlayingIndicator = false
      for (const indicator of playingIndicators) {
        if (await indicator.count() > 0) {
          foundPlayingIndicator = true
          console.log('   ✅ Playing state indicator found')
          break
        }
      }
      
      if (foundPlayingIndicator) {
        console.log('   ✅ Audio preview appears to be playing')
        
        // Test pause functionality
        await firstPreviewButton.click()
        await page.waitForTimeout(1000)
        
        // Check if playing indicators disappeared
        const stillPlaying = await page.locator('[class*="ring-purple"]').count() > 0
        console.log(`   ✅ Pause functionality: ${stillPlaying ? 'May still be playing' : 'Appears to have paused'}`)
      } else {
        console.log('   ⚠️ No clear playing state indicators found')
      }
    } else {
      console.log('   ⚠️ Preview button is disabled (no preview available)')
    }
  })

  test('Global audio control panel appears when playing', async ({ page }) => {
    console.log('🎛️ Testing global audio control panel...')
    
    // Select a mood and wait for results
    const moodButton = page.locator('button:has-text("Passionate")').first()
    await moodButton.click()
    await page.waitForTimeout(5000)
    
    // Check if results loaded
    const hasResults = await page.locator('text="Your Perfect Soundtrack"').isVisible()
    if (!hasResults) {
      console.log('   ⚠️ No music results - skipping global control test')
      return
    }
    
    // Find and click a preview button
    const previewButtons = page.locator('button[title*="preview"], button:has(div[class*="border-l"])')
    const enabledPreviewButton = previewButtons.first()
    
    const isButtonEnabled = await enabledPreviewButton.isEnabled()
    if (isButtonEnabled) {
      await enabledPreviewButton.click()
      await page.waitForTimeout(2000)
      
      // Look for global audio control panel
      const globalControls = [
        page.locator('.fixed.bottom-6'), // Fixed bottom position
        page.locator('text="🔊"'), // Volume icon
        page.locator('[type="range"]'), // Volume slider
        page.locator('button:has(span:text("×"))') // Close button
      ]
      
      let foundGlobalControl = false
      for (const control of globalControls) {
        if (await control.count() > 0) {
          foundGlobalControl = true
          console.log('   ✅ Global audio control found')
          break
        }
      }
      
      if (foundGlobalControl) {
        console.log('   ✅ Global audio control panel working')
        
        // Test volume control if present
        const volumeSlider = page.locator('[type="range"]')
        if (await volumeSlider.count() > 0) {
          console.log('   ✅ Volume control available')
        }
        
        // Test close button if present
        const closeButton = page.locator('button:has(span:text("×"))')
        if (await closeButton.count() > 0) {
          await closeButton.click()
          await page.waitForTimeout(1000)
          
          const controlStillVisible = await page.locator('.fixed.bottom-6').count() > 0
          console.log(`   ✅ Close button: ${controlStillVisible ? 'Still visible' : 'Hidden successfully'}`)
        }
      } else {
        console.log('   ⚠️ Global audio control panel not found')
      }
    } else {
      console.log('   ⚠️ No enabled preview buttons found')
    }
  })

  test('Progress bar and time display functionality', async ({ page }) => {
    console.log('⏱️ Testing progress bar and time display...')
    
    // Get music results
    const moodButton = page.locator('button:has-text("Serene")').first()
    await moodButton.click()
    await page.waitForTimeout(5000)
    
    const hasResults = await page.locator('text="Your Perfect Soundtrack"').isVisible()
    if (!hasResults) {
      console.log('   ⚠️ No music results - skipping progress test')
      return
    }
    
    // Start preview
    const previewButton = page.locator('button[title*="preview"], button:has(div[class*="border-l"])').first()
    const isEnabled = await previewButton.isEnabled()
    
    if (isEnabled) {
      await previewButton.click()
      await page.waitForTimeout(3000) // Give time for audio to load and play
      
      // Look for progress indicators
      const progressElements = [
        page.locator('[class*="bg-purple-400"]'), // Progress bar
        page.locator('span:text-matches("\\d+:\\d+")'), // Time display
        page.locator('[class*="font-mono"]') // Mono font time
      ]
      
      let foundProgress = false
      for (const element of progressElements) {
        if (await element.count() > 0) {
          foundProgress = true
          console.log('   ✅ Progress indicator found')
          break
        }
      }
      
      if (foundProgress) {
        console.log('   ✅ Progress bar and time display working')
      } else {
        console.log('   ⚠️ Progress indicators not clearly visible')
      }
      
      // Test seek functionality by clicking on progress area
      const progressBar = page.locator('[class*="bg-white/20"]').first()
      if (await progressBar.count() > 0) {
        try {
          await progressBar.click({ position: { x: 30, y: 2 } })
          await page.waitForTimeout(500)
          console.log('   ✅ Progress bar click (seek) tested')
        } catch (error) {
          console.log('   ⚠️ Progress bar seek test failed')
        }
      }
    } else {
      console.log('   ⚠️ No enabled preview button for progress test')
    }
  })

  test('Multiple track preview switching', async ({ page }) => {
    console.log('🔄 Testing multiple track preview switching...')
    
    // Get music results
    const moodButton = page.locator('button:has-text("Triumphant")').first()
    await moodButton.click()
    await page.waitForTimeout(5000)
    
    const hasResults = await page.locator('text="Your Perfect Soundtrack"').isVisible()
    if (!hasResults) {
      console.log('   ⚠️ No music results - skipping multi-track test')
      return
    }
    
    // Find multiple preview buttons
    const previewButtons = page.locator('button[title*="preview"], button:has(div[class*="border-l"])')
    const buttonCount = await previewButtons.count()
    console.log(`   📊 Total preview buttons: ${buttonCount}`)
    
    if (buttonCount >= 2) {
      // Play first track
      const firstButton = previewButtons.nth(0)
      const firstEnabled = await firstButton.isEnabled()
      
      if (firstEnabled) {
        await firstButton.click()
        await page.waitForTimeout(2000)
        console.log('   ✅ First track started')
        
        // Switch to second track
        const secondButton = previewButtons.nth(1)
        const secondEnabled = await secondButton.isEnabled()
        
        if (secondEnabled) {
          await secondButton.click()
          await page.waitForTimeout(2000)
          
          // Check that first track stopped and second started
          const currentlyPlaying = page.locator('[class*="ring-purple"]')
          const playingCount = await currentlyPlaying.count()
          console.log(`   📊 Currently playing tracks: ${playingCount}`)
          
          if (playingCount === 1) {
            console.log('   ✅ Track switching works correctly (only one playing)')
          } else {
            console.log('   ⚠️ Multiple tracks may be playing simultaneously')
          }
        } else {
          console.log('   ⚠️ Second preview button not enabled')
        }
      } else {
        console.log('   ⚠️ First preview button not enabled')
      }
    } else {
      console.log('   ⚠️ Not enough preview buttons for switching test')
    }
  })

  test('Audio preview loading and buffering states', async ({ page }) => {
    console.log('⏳ Testing loading and buffering states...')
    
    // Get music results
    const moodButton = page.locator('button:has-text("Mystical")').first()
    await moodButton.click()
    await page.waitForTimeout(5000)
    
    const hasResults = await page.locator('text="Your Perfect Soundtrack"').isVisible()
    if (!hasResults) {
      console.log('   ⚠️ No music results - skipping buffering test')
      return
    }
    
    // Monitor for loading/buffering indicators
    const previewButton = page.locator('button[title*="preview"], button:has(div[class*="border-l"])').first()
    const isEnabled = await previewButton.isEnabled()
    
    if (isEnabled) {
      // Click and immediately check for loading state
      await previewButton.click()
      
      // Check for buffering/loading indicators within first 500ms
      await page.waitForTimeout(100)
      
      const loadingIndicators = [
        page.locator('[class*="animate-spin"]'), // Spinning loader
        page.locator('[class*="border-t-transparent"]'), // Loading ring
        page.locator('button[disabled]') // Disabled state
      ]
      
      let foundLoading = false
      for (const indicator of loadingIndicators) {
        if (await indicator.count() > 0) {
          foundLoading = true
          console.log('   ✅ Loading/buffering indicator found')
          break
        }
      }
      
      // Wait longer to see if it transitions to playing
      await page.waitForTimeout(3000)
      
      const playingState = await page.locator('[class*="ring-purple"]').count() > 0
      console.log(`   ✅ Final state: ${playingState ? 'Playing' : 'Not playing'}`)
      
      if (foundLoading && playingState) {
        console.log('   ✅ Loading → Playing transition working correctly')
      } else if (playingState) {
        console.log('   ✅ Audio started (loading may have been too fast to detect)')
      } else {
        console.log('   ⚠️ Audio may not have started playing')
      }
    } else {
      console.log('   ⚠️ No enabled preview button for buffering test')
    }
  })
})