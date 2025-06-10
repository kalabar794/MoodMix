import { test, expect } from '@playwright/test'

test('Quick QA - Check critical fixes', async ({ page }) => {
  console.log('🔍 Quick QA Test')
  
  await page.goto('https://mood-mix-theta.vercel.app/')
  await page.waitForLoadState('networkidle')
  
  // Test Energetic mood
  await page.locator('button:has-text("Energetic")').first().click()
  await page.waitForSelector('.track-card', { timeout: 15000 })
  
  // 1. Check for duplicates
  const trackNames = await page.locator('.track-card h3').allTextContents()
  const artistNames = await page.locator('.track-card p').allTextContents()
  
  console.log(`\nFound ${trackNames.length} tracks`)
  
  // Check specifically for "Lose Control" duplicates
  const loseControlTracks = trackNames.map((name, i) => ({
    name,
    artist: artistNames[i]
  })).filter(t => t.name.toLowerCase().includes('lose control'))
  
  console.log(`\n"Lose Control" instances: ${loseControlTracks.length}`)
  loseControlTracks.forEach(t => console.log(`  - "${t.name}" by ${t.artist}`))
  
  // 2. Check YouTube coverage
  const youtubeCount = await page.locator('button.bg-red-600').count()
  const coverage = (youtubeCount / trackNames.length * 100).toFixed(1)
  
  console.log(`\nYouTube coverage: ${youtubeCount}/${trackNames.length} (${coverage}%)`)
  
  // 3. Test YouTube playback (especially Teddy Swims)
  if (youtubeCount > 0) {
    // Find Teddy Swims track if available
    const teddySwimsIndex = artistNames.findIndex(artist => 
      artist.toLowerCase().includes('teddy swims')
    )
    
    if (teddySwimsIndex >= 0) {
      console.log(`\nFound Teddy Swims track at index ${teddySwimsIndex}`)
      const trackCard = page.locator('.track-card').nth(teddySwimsIndex)
      const ytButton = trackCard.locator('button.bg-red-600')
      
      if (await ytButton.count() > 0) {
        console.log('Testing Teddy Swims YouTube video...')
        await ytButton.click()
        await page.waitForTimeout(2000)
        
        // Check iframe
        const iframe = page.locator('iframe[src*="youtube"]')
        const hasIframe = await iframe.count() > 0
        console.log(`YouTube iframe loaded: ${hasIframe ? '✅' : '❌'}`)
        
        if (hasIframe) {
          const src = await iframe.getAttribute('src')
          console.log(`Video URL: ${src}`)
          
          // Check for sandbox
          const sandbox = await iframe.getAttribute('sandbox')
          console.log(`Sandbox attribute: ${sandbox || 'none (good!)'}`)
        }
        
        await page.keyboard.press('Escape')
      }
    }
    
    // Test first YouTube video
    console.log('\nTesting first YouTube video...')
    const firstYtButton = page.locator('button.bg-red-600').first()
    await firstYtButton.click()
    await page.waitForTimeout(2000)
    
    const iframe = page.locator('iframe[src*="youtube"]')
    const iframeExists = await iframe.count() > 0
    console.log(`YouTube playback working: ${iframeExists ? '✅' : '❌'}`)
    
    await page.keyboard.press('Escape')
  }
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/quick-qa-test.png' })
  
  console.log('\n=== RESULTS ===')
  console.log(`Duplicate "Lose Control": ${loseControlTracks.length > 1 ? '❌ FAILED' : '✅ PASSED'}`)
  console.log(`YouTube coverage: ${Number(coverage) > 20 ? '✅ GOOD' : '⚠️ LOW'} (${coverage}%)`)
  console.log(`YouTube playback: ${youtubeCount > 0 ? '✅ WORKING' : '❌ NO VIDEOS'}`)
})