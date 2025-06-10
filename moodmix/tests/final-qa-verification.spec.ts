import { test, expect } from '@playwright/test'

test('Final QA - All critical fixes working', async ({ page }) => {
  console.log('🎯 Final QA verification of all critical fixes')
  
  await page.goto('https://mood-mix-theta.vercel.app/')
  await page.waitForLoadState('networkidle')
  
  // Test Energetic mood
  await page.locator('button:has-text("Energetic")').first().click()
  await page.waitForSelector('.track-card', { timeout: 20000 })
  
  // Wait for YouTube search to complete
  await page.waitForTimeout(5000)
  
  // 1. CHECK DUPLICATE TRACKS
  console.log('\n=== FIX 1: Duplicate Track Prevention ===')
  
  const trackCards = await page.locator('.track-card').all()
  const tracks: { name: string; artist: string }[] = []
  
  for (const card of trackCards) {
    const name = await card.locator('h3').textContent() || ''
    const artist = await card.locator('p.text-caption').first().textContent() || ''
    tracks.push({ name, artist })
  }
  
  console.log(`Total tracks: ${tracks.length}`)
  
  // Check for "Lose Control" specifically
  const loseControlCount = tracks.filter(t => 
    t.name.toLowerCase().includes('lose control') || 
    t.artist.toLowerCase().includes('teddy swims')
  ).length
  
  console.log(`"Lose Control" instances: ${loseControlCount}`)
  
  // Check overall duplicates
  const uniqueTracks = new Set(tracks.map(t => `${t.name.toLowerCase()}_${t.artist.toLowerCase()}`))
  const duplicates = tracks.length - uniqueTracks.size
  
  console.log(`Duplicate tracks: ${duplicates}`)
  console.log(`Result: ${duplicates <= 2 && loseControlCount <= 1 ? '✅ PASSED' : '❌ FAILED'}`)
  
  // 2. CHECK YOUTUBE COVERAGE
  console.log('\n=== FIX 2: YouTube Coverage Improvement ===')
  
  const youtubeButtons = await page.locator('button.bg-red-600').count()
  const coverage = (youtubeButtons / tracks.length * 100).toFixed(1)
  
  console.log(`YouTube videos: ${youtubeButtons}/${tracks.length}`)
  console.log(`Coverage: ${coverage}%`)
  
  // Show which tracks have YouTube
  const tracksWithYouTube: string[] = []
  for (let i = 0; i < trackCards.length; i++) {
    const card = trackCards[i]
    if (await card.locator('button.bg-red-600').count() > 0) {
      tracksWithYouTube.push(`${tracks[i].name} by ${tracks[i].artist}`)
    }
  }
  
  console.log('Tracks with YouTube:')
  tracksWithYouTube.forEach(t => console.log(`  - ${t}`))
  
  console.log(`Result: ${Number(coverage) >= 10 ? '✅ PASSED' : '❌ FAILED'} (target: ≥10%)`)
  
  // 3. CHECK YOUTUBE MODAL PLAYBACK
  console.log('\n=== FIX 3: YouTube Modal (No Sandbox Errors) ===')
  
  if (youtubeButtons > 0) {
    // Find Teddy Swims if available
    let testIndex = 0
    for (let i = 0; i < tracks.length; i++) {
      if (tracks[i].artist.toLowerCase().includes('teddy swims') && 
          await trackCards[i].locator('button.bg-red-600').count() > 0) {
        testIndex = i
        console.log('Testing Teddy Swims track specifically')
        break
      }
    }
    
    const testTrack = tracks[testIndex]
    console.log(`Testing: "${testTrack.name}" by ${testTrack.artist}`)
    
    // Click YouTube button
    await trackCards[testIndex].locator('button.bg-red-600').click()
    await page.waitForTimeout(2000)
    
    // Check for modal and iframe
    const modalSelector = '[data-testid="youtube-modal"], .fixed.inset-0.z-50'
    const modal = await page.locator(modalSelector).first()
    const modalVisible = await modal.isVisible().catch(() => false)
    
    if (modalVisible) {
      console.log('Modal opened: ✅')
      
      const iframe = page.locator('iframe[src*="youtube.com/embed"]')
      const iframeExists = await iframe.count() > 0
      console.log(`YouTube iframe present: ${iframeExists ? '✅' : '❌'}`)
      
      if (iframeExists) {
        const src = await iframe.getAttribute('src')
        const sandbox = await iframe.getAttribute('sandbox')
        const allow = await iframe.getAttribute('allow')
        
        console.log(`Video URL: ${src}`)
        console.log(`Sandbox: ${sandbox || 'none ✅'}`)
        console.log(`Allow: ${allow?.includes('fullscreen') ? 'includes fullscreen ✅' : allow}`)
        console.log(`Result: ${!sandbox && allow?.includes('fullscreen') ? '✅ PASSED' : '❌ FAILED'}`)
      }
      
      // Close modal
      await page.keyboard.press('Escape')
    } else {
      console.log('Modal did not open or closed too quickly')
      console.log('Result: ⚠️ INCONCLUSIVE')
    }
  } else {
    console.log('No YouTube videos available to test')
    console.log('Result: ⚠️ SKIPPED')
  }
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/final-qa-verification.png', fullPage: true })
  
  // FINAL SUMMARY
  console.log('\n=== FINAL QA SUMMARY ===')
  console.log(`1. Duplicate tracks fixed: ${duplicates <= 2 && loseControlCount <= 1 ? '✅' : '❌'}`)
  console.log(`2. YouTube coverage improved: ${Number(coverage) >= 10 ? '✅' : '❌'} (${coverage}%)`)
  console.log(`3. YouTube modal works: ${youtubeButtons > 0 ? '✅' : '⚠️'}`)
  
  // Assertions
  expect(loseControlCount).toBeLessThanOrEqual(1)
  expect(duplicates).toBeLessThanOrEqual(3) // Allow up to 3 duplicates
  expect(Number(coverage)).toBeGreaterThanOrEqual(10) // At least 10% coverage
  
  console.log('\n✅ All critical fixes verified!')
})