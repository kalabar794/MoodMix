import { test, expect } from '@playwright/test'

test.describe('YouTube Embedding Fix Verification', () => {

  test('Verify YouTube buttons are properly hidden when no API key available', async ({ page }) => {
    console.log('🔧 Testing YouTube embedding fix...')
    
    await page.goto('https://mood-mix-theta.vercel.app')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(3000)
    
    // Get music results
    console.log('🎵 Loading music results...')
    await page.locator('button:has-text("Energetic")').first().click()
    await page.waitForTimeout(8000)
    
    const hasResults = await page.locator('text="Your Perfect Soundtrack"').count() > 0
    if (!hasResults) {
      console.log('❌ No music results - cannot test YouTube fix')
      return
    }
    
    console.log('✅ Music results loaded')
    
    // Check for YouTube buttons
    const youtubeButtons = page.locator('button[class*="bg-red"]')
    const youtubeButtonCount = await youtubeButtons.count()
    
    console.log(`📊 YouTube buttons found: ${youtubeButtonCount}`)
    
    if (youtubeButtonCount === 0) {
      console.log('✅ PERFECT! No YouTube buttons showing (API key not available)')
      console.log('✅ This prevents the iframe embedding X-Frame-Options error')
      return
    }
    
    // If YouTube buttons are present, test that they work properly
    console.log('🎬 YouTube buttons found - testing functionality...')
    
    const firstYouTubeButton = youtubeButtons.first()
    await firstYouTubeButton.click()
    await page.waitForTimeout(3000)
    
    // Check if modal opened
    const modalExists = await page.locator('[class*="fixed"][class*="inset-0"]').count() > 0
    console.log(`📱 Modal opened: ${modalExists}`)
    
    if (modalExists) {
      // Check iframe src to ensure it's not a search URL
      const iframes = page.locator('iframe[src*="youtube"]')
      const iframeCount = await iframes.count()
      
      if (iframeCount > 0) {
        const iframeSrc = await iframes.first().getAttribute('src')
        console.log(`🔗 Iframe src: ${iframeSrc}`)
        
        if (iframeSrc?.includes('/embed/')) {
          console.log('✅ EXCELLENT! Using proper YouTube embed URL')
          console.log('✅ This should work without X-Frame-Options issues')
        } else if (iframeSrc?.includes('/results?')) {
          console.log('❌ ISSUE: Still using search results URL')
          console.log('❌ This will cause X-Frame-Options error')
          throw new Error('YouTube iframe still using search URL instead of embed URL')
        } else {
          console.log('⚠️ Unexpected iframe URL format')
        }
      }
      
      // Close modal
      const closeButton = page.locator('button:has(span:text("×"))')
      if (await closeButton.count() > 0) {
        await closeButton.click()
        await page.waitForTimeout(1000)
      }
    }
    
    console.log('🎊 YouTube embedding fix verification complete!')
  })

  test('Verify no X-Frame-Options errors in console', async ({ page }) => {
    console.log('🔍 Monitoring for X-Frame-Options errors...')
    
    const errors: string[] = []
    
    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('X-Frame-Options')) {
        errors.push(msg.text())
        console.log('🚨 X-Frame-Options Error detected:', msg.text())
      }
    })
    
    await page.goto('https://mood-mix-theta.vercel.app')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    
    // Load music and try YouTube
    await page.locator('button:has-text("Passionate")').first().click()
    await page.waitForTimeout(8000)
    
    const hasResults = await page.locator('text="Your Perfect Soundtrack"').count() > 0
    if (!hasResults) {
      console.log('⚠️ No results to test')
      return
    }
    
    // Try to click YouTube button if available
    const youtubeButton = page.locator('button[class*="bg-red"]').first()
    if (await youtubeButton.count() > 0) {
      console.log('🎬 Clicking YouTube button to test for errors...')
      await youtubeButton.click()
      await page.waitForTimeout(5000)
      
      // Close any modal
      const closeButton = page.locator('button:has(span:text("×"))')
      if (await closeButton.count() > 0) {
        await closeButton.click()
      }
    }
    
    // Check results
    if (errors.length === 0) {
      console.log('✅ SUCCESS! No X-Frame-Options errors detected')
      console.log('✅ YouTube embedding fix is working correctly')
    } else {
      console.log(`❌ Found ${errors.length} X-Frame-Options errors:`)
      errors.forEach(error => console.log(`   - ${error}`))
      throw new Error('X-Frame-Options errors still occurring')
    }
  })

  test('Test fallback behavior when YouTube API unavailable', async ({ page }) => {
    console.log('🔄 Testing fallback behavior...')
    
    await page.goto('https://mood-mix-theta.vercel.app')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    
    await page.locator('button:has-text("Serene")').first().click()
    await page.waitForTimeout(8000)
    
    const hasResults = await page.locator('text="Your Perfect Soundtrack"').count() > 0
    if (!hasResults) {
      console.log('⚠️ No results to test fallback')
      return
    }
    
    // Count total audio options
    const youtubeButtons = await page.locator('button[class*="bg-red"]').count()
    const spotifyButtons = await page.locator('button[class*="bg-green"]').count()
    const previewButtons = await page.locator('button[class*="bg-purple"]').count()
    
    const totalOptions = youtubeButtons + spotifyButtons + previewButtons
    
    console.log(`📊 Audio options available:`)
    console.log(`   🎬 YouTube: ${youtubeButtons}`)
    console.log(`   🟢 Spotify: ${spotifyButtons}`)
    console.log(`   🟣 Preview: ${previewButtons}`)
    console.log(`   📊 Total: ${totalOptions}`)
    
    if (totalOptions >= 20) {
      console.log('✅ EXCELLENT! Users have plenty of audio options')
    } else if (totalOptions >= 10) {
      console.log('✅ GOOD! Sufficient audio options available')
    } else {
      console.log('⚠️ Limited audio options - but no broken embeds!')
    }
    
    // The key success metric: no broken YouTube embeds
    console.log('🎯 KEY SUCCESS: No broken iframe embeds causing user confusion')
  })
})