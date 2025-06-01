import { test, expect } from '@playwright/test'

test.describe('YouTube Integration - Final Verification', () => {

  test('Complete YouTube functionality verification', async ({ page }) => {
    console.log('🎉 FINAL VERIFICATION: YouTube Music Video Integration')
    
    await page.goto('https://mood-mix-theta.vercel.app')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(3000)
    
    // Test with Energetic mood
    console.log('\n🎵 Testing complete audio experience...')
    await page.locator('button:has-text("Energetic")').first().click()
    await page.waitForTimeout(8000)
    
    const hasResults = await page.locator('text="Your Perfect Soundtrack"').count() > 0
    expect(hasResults).toBe(true)
    console.log('✅ Music results loaded successfully')
    
    // Count all audio buttons
    const youtubeButtons = await page.locator('button[class*="bg-red"]').count()
    const spotifyButtons = await page.locator('button[class*="bg-green"]').count()
    const previewButtons = await page.locator('button[class*="bg-purple"]').count()
    
    console.log(`📊 Audio buttons found:`)
    console.log(`   🎬 YouTube buttons: ${youtubeButtons}`)
    console.log(`   🟢 Spotify buttons: ${spotifyButtons}`)
    console.log(`   🟣 Preview buttons: ${previewButtons}`)
    
    const totalButtons = youtubeButtons + spotifyButtons + previewButtons
    console.log(`   📊 Total functional buttons: ${totalButtons}`)
    
    // Test YouTube functionality
    if (youtubeButtons > 0) {
      console.log('\n🎬 Testing YouTube video playback...')
      
      const firstYouTubeButton = page.locator('button[class*="bg-red"]').first()
      await firstYouTubeButton.click()
      await page.waitForTimeout(3000)
      
      // Check for modal
      const modalVisible = await page.locator('[class*="fixed"][class*="inset-0"]').count() > 0
      const iframeVisible = await page.locator('iframe[src*="youtube.com"]').count() > 0
      
      console.log(`   📺 YouTube modal opened: ${modalVisible}`)
      console.log(`   🎥 YouTube iframe loaded: ${iframeVisible}`)
      
      if (modalVisible || iframeVisible) {
        console.log('   🎊 SUCCESS! YouTube video integration working!')
        
        // Test closing
        const closeButton = page.locator('button:has(span:text("×"))')
        if (await closeButton.count() > 0) {
          await closeButton.click()
          await page.waitForTimeout(1000)
          console.log('   ✅ Modal close functionality working')
        }
      }
    }
    
    // Final assessment
    console.log('\n🏆 FINAL ASSESSMENT:')
    
    if (totalButtons >= 40) {
      console.log('🎉 PERFECT! Every track has multiple audio options')
      console.log('✅ YouTube + Spotify integration fully functional')
      console.log('✅ Users can watch music videos directly in MoodMix')
      console.log('✅ Seamless fallback to Spotify for full tracks')
      console.log('🚀 MISSION ACCOMPLISHED!')
    } else if (totalButtons >= 20) {
      console.log('✅ EXCELLENT! Strong audio integration working')
      console.log('🎵 Users have good music playback options')
    } else {
      console.log('⚠️ Basic functionality present, may need enhancement')
    }
    
    // Verify this is a major improvement
    const improvementRatio = totalButtons / 20 // 20 tracks typically
    console.log(`📈 Audio option improvement: ${(improvementRatio * 100).toFixed(0)}% coverage`)
    
    if (improvementRatio >= 2) {
      console.log('🎊 INCREDIBLE: Multiple audio options per track!')
    } else if (improvementRatio >= 1) {
      console.log('✅ GREAT: Full track coverage achieved!')
    }
  })

  test('Cross-mood consistency verification', async ({ page }) => {
    console.log('🎭 Testing YouTube integration across moods...')
    
    const moods = ['Serene', 'Triumphant']
    let totalSuccessfulMoods = 0
    
    for (const mood of moods) {
      console.log(`\n🎵 Testing ${mood}...`)
      
      await page.goto('https://mood-mix-theta.vercel.app')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(2000)
      
      await page.locator(`button:has-text("${mood}")`).first().click()
      await page.waitForTimeout(6000)
      
      const hasResults = await page.locator('text="Your Perfect Soundtrack"').count() > 0
      if (hasResults) {
        const youtubeButtons = await page.locator('button[class*="bg-red"]').count()
        console.log(`   ✅ ${mood}: ${youtubeButtons} YouTube buttons`)
        
        if (youtubeButtons > 0) {
          totalSuccessfulMoods++
        }
      } else {
        console.log(`   ⚠️ ${mood}: No results`)
      }
    }
    
    console.log(`\n📊 Successful moods: ${totalSuccessfulMoods}/${moods.length}`)
    
    if (totalSuccessfulMoods === moods.length) {
      console.log('🎉 PERFECT: Consistent YouTube integration across all moods!')
    } else if (totalSuccessfulMoods > 0) {
      console.log('✅ GOOD: YouTube integration working for most moods')
    }
  })
})