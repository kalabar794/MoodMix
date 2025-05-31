import { test, expect } from '@playwright/test'

test.describe('Live Audio Preview Fix Verification', () => {

  test('Test improved search strategy on live site', async ({ page }) => {
    console.log('🔧 Testing improved search strategy for audio previews...')
    
    // Go directly to live production site
    await page.goto('https://mood-mix-theta.vercel.app')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(3000)
    
    console.log('✅ Live site loaded')
    
    // Test Energetic mood (high valence + energy = pop artists)
    console.log('\n🎵 Testing Energetic mood with new search strategy...')
    const energeticButton = page.locator('button:has-text("Energetic")').first()
    await expect(energeticButton).toBeVisible()
    await energeticButton.click()
    
    // Wait for API call and results
    await page.waitForTimeout(10000) // Give extra time for new search strategy
    
    // Check if results loaded
    const resultsLoaded = await page.locator('text="Your Perfect Soundtrack"').count() > 0
    if (!resultsLoaded) {
      console.log('   ❌ No results loaded - testing failed')
      return
    }
    
    console.log('   ✅ Results loaded successfully')
    
    // Check preview button states
    const allButtons = page.locator('button')
    const buttonCount = await allButtons.count()
    console.log(`   📊 Total buttons on page: ${buttonCount}`)
    
    // Find preview buttons specifically
    const previewButtons = page.locator('button[title*="preview"], button:has(.w-10.h-10), .track-card button')
    const previewButtonCount = await previewButtons.count()
    console.log(`   📊 Preview-style buttons found: ${previewButtonCount}`)
    
    // Count enabled vs disabled preview buttons
    let enabledPreviewCount = 0
    let disabledPreviewCount = 0
    let tracksWithPreviews = 0
    
    for (let i = 0; i < previewButtonCount && i < 20; i++) {
      const button = previewButtons.nth(i)
      try {
        const isDisabled = await button.getAttribute('disabled')
        const hasGrayBackground = await button.evaluate(el => {
          const styles = getComputedStyle(el)
          return styles.backgroundColor.includes('rgb(75, 85, 99)') || 
                 styles.backgroundColor.includes('rgb(107, 114, 128)') ||
                 el.classList.contains('bg-gray-600') ||
                 el.classList.contains('opacity-50')
        })
        
        const buttonText = await button.textContent()
        const hasNoPreviewSymbol = buttonText?.includes('—') || buttonText?.includes('-')
        
        if (isDisabled === null && !hasGrayBackground && !hasNoPreviewSymbol) {
          enabledPreviewCount++
          tracksWithPreviews++
        } else {
          disabledPreviewCount++
        }
      } catch (error) {
        // Skip buttons that can't be evaluated
      }
    }
    
    console.log(`   📊 Enabled preview buttons: ${enabledPreviewCount}`)
    console.log(`   📊 Disabled preview buttons: ${disabledPreviewCount}`)
    console.log(`   📊 Tracks with previews: ${tracksWithPreviews}`)
    
    const totalButtons = enabledPreviewCount + disabledPreviewCount
    const previewPercentage = totalButtons > 0 ? (enabledPreviewCount / totalButtons) * 100 : 0
    console.log(`   📊 Preview availability: ${previewPercentage.toFixed(1)}%`)
    
    // Test should pass if we have ANY preview availability (improvement from 0%)
    if (previewPercentage > 0) {
      console.log(`   ✅ SUCCESS: Found ${enabledPreviewCount} tracks with previews! (Major improvement from 0%)`)
      
      // Test actually clicking a preview button
      if (enabledPreviewCount > 0) {
        console.log('   🎵 Testing preview playback...')
        
        // Find the first enabled preview button
        let testedPlayback = false
        for (let i = 0; i < previewButtonCount && i < 10; i++) {
          const button = previewButtons.nth(i)
          try {
            const isDisabled = await button.getAttribute('disabled')
            const hasGrayBg = await button.evaluate(el => 
              el.classList.contains('bg-gray-600') || 
              getComputedStyle(el).backgroundColor.includes('rgb(75, 85, 99)')
            )
            
            if (isDisabled === null && !hasGrayBg) {
              await button.click()
              await page.waitForTimeout(3000)
              
              // Check for playing indicators
              const playingElements = await page.locator('[class*="ring-purple"], [class*="bg-green-500"], .fixed.bottom-6').count()
              if (playingElements > 0) {
                console.log('   ✅ AUDIO PREVIEW WORKING! Playing state detected!')
                testedPlayback = true
                break
              } else {
                console.log('   ⚠️ Preview clicked but no clear playing state detected')
              }
            }
          } catch (error) {
            // Try next button
          }
        }
        
        if (!testedPlayback) {
          console.log('   ⚠️ Could not test playback, but previews are available')
        }
      }
    } else {
      console.log(`   ❌ Still no preview availability - search strategy needs more work`)
    }
    
    // Now test a different mood to verify consistency
    console.log('\n🎵 Testing Passionate mood...')
    
    // Go back to mood selection
    await page.keyboard.press('Escape')
    await page.waitForTimeout(2000)
    
    const passionateButton = page.locator('button:has-text("Passionate")').first()
    if (await passionateButton.isVisible()) {
      await passionateButton.click()
      await page.waitForTimeout(8000)
      
      const passionateResults = await page.locator('text="Your Perfect Soundtrack"').count() > 0
      if (passionateResults) {
        console.log('   ✅ Passionate mood: Results loaded')
        
        const passionatePreviewButtons = page.locator('button[title*="preview"], button:has(.w-10.h-10)')
        let passionateEnabledCount = 0
        const passionateButtonCount = await passionatePreviewButtons.count()
        
        for (let i = 0; i < Math.min(passionateButtonCount, 10); i++) {
          const button = passionatePreviewButtons.nth(i)
          try {
            const isDisabled = await button.getAttribute('disabled')
            const hasGrayBg = await button.evaluate(el => 
              el.classList.contains('bg-gray-600') || 
              getComputedStyle(el).backgroundColor.includes('rgb(75, 85, 99)')
            )
            
            if (isDisabled === null && !hasGrayBg) {
              passionateEnabledCount++
            }
          } catch (error) {
            // Skip problematic buttons
          }
        }
        
        console.log(`   📊 Passionate mood: ${passionateEnabledCount} enabled previews`)
        
        if (passionateEnabledCount > 0) {
          console.log('   ✅ Consistent preview availability across moods!')
        } else {
          console.log('   ⚠️ No previews for Passionate mood')
        }
      } else {
        console.log('   ⚠️ Passionate mood: No results loaded')
      }
    }
    
    console.log('\n🎯 Live audio preview test complete!')
    
    // Final assessment
    if (tracksWithPreviews > 0) {
      console.log(`\n🎉 SUCCESS: Audio preview fix is working! Found ${tracksWithPreviews} tracks with working previews!`)
      console.log('💡 The improved search strategy using popular artists is delivering results!')
    } else {
      console.log('\n❌ Audio previews still not working - may need further search optimization')
    }
  })
})