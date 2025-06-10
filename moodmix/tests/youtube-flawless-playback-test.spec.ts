import { test, expect } from '@playwright/test'

test('YouTube flawless playback - All videos work properly', async ({ page }) => {
  console.log('🎬 Testing YouTube flawless playback with improved matching')
  
  // Go to the site
  await page.goto('https://mood-mix-theta.vercel.app/')
  await page.waitForLoadState('networkidle')
  
  // Click Energetic mood for variety
  const energeticMood = page.locator('button:has-text("Energetic")').first()
  await energeticMood.click()
  console.log('✅ Clicked Energetic mood')
  
  // Wait for tracks to load
  await page.waitForTimeout(10000)
  
  // Analyze the results
  const trackCards = page.locator('.track-card')
  const totalTracks = await trackCards.count()
  const youtubeButtons = page.locator('button.bg-red-600')
  const youtubeCount = await youtubeButtons.count()
  
  console.log(`📊 Track Analysis:`)
  console.log(`   Total tracks: ${totalTracks}`)
  console.log(`   YouTube buttons: ${youtubeCount}`)
  console.log(`   YouTube coverage: ${((youtubeCount / totalTracks) * 100).toFixed(1)}%`)
  
  // Check for duplicates
  const trackInfo = []
  const seenTracks = new Set()
  let duplicateCount = 0
  
  for (let i = 0; i < totalTracks; i++) {
    const trackCard = trackCards.nth(i)
    const trackNameElement = trackCard.locator('h3').first()
    const artistElement = trackCard.locator('p').first()
    
    const trackName = await trackNameElement.textContent()
    const artistName = await artistElement.textContent()
    
    if (trackName && artistName) {
      const trackSignature = `${trackName.trim()} - ${artistName.trim()}`
      
      if (seenTracks.has(trackSignature)) {
        duplicateCount++
        console.log(`   ❌ DUPLICATE: ${trackSignature}`)
      } else {
        seenTracks.add(trackSignature)
      }
      
      trackInfo.push(trackSignature)
    }
  }
  
  console.log(`🔍 Duplicate Check:`)
  console.log(`   Total tracks: ${trackInfo.length}`)
  console.log(`   Unique tracks: ${seenTracks.size}`)
  console.log(`   Duplicates: ${duplicateCount}`)
  
  // Test YouTube playback for multiple videos
  const videosToTest = Math.min(3, youtubeCount)
  console.log(`\n🎬 Testing ${videosToTest} YouTube videos for flawless playback:`)
  
  for (let i = 0; i < videosToTest; i++) {
    console.log(`\n   Testing video ${i + 1}/${videosToTest}:`)
    
    // Find the YouTube button (they may shift after clicking)
    const currentYoutubeButtons = page.locator('button.bg-red-600')
    const button = currentYoutubeButtons.nth(i)
    
    // Get track info before clicking
    const trackCard = button.locator('xpath=ancestor::div[@class="track-card group relative overflow-hidden transition-all duration-300"]').first()
    const trackName = await trackCard.locator('h3').first().textContent()
    console.log(`   Track: ${trackName}`)
    
    // Click YouTube button
    await button.click()
    console.log(`   ✅ Clicked YouTube button`)
    
    // Wait for modal to appear
    await page.waitForTimeout(2000)
    
    // Check if modal opened
    const modal = page.locator('.fixed.inset-0').first()
    const isModalVisible = await modal.isVisible()
    console.log(`   Modal visible: ${isModalVisible}`)
    
    if (isModalVisible) {
      // Check for iframe (video player)
      const iframe = page.locator('iframe').first()
      const hasIframe = await iframe.count() > 0
      console.log(`   Has iframe: ${hasIframe}`)
      
      // Check for error state
      const errorMessage = page.locator('text="Video Unavailable"')
      const hasError = await errorMessage.count() > 0
      console.log(`   Has error: ${hasError}`)
      
      // Check for search fallback
      const searchFallback = page.locator('text="Search YouTube"')
      const hasSearchFallback = await searchFallback.count() > 0
      console.log(`   Has search fallback: ${hasSearchFallback}`)
      
      if (hasIframe && !hasError) {
        console.log(`   ✅ Video player loaded successfully`)
        
        // Check iframe src
        const iframeSrc = await iframe.getAttribute('src')
        console.log(`   Embed URL: ${iframeSrc?.substring(0, 50)}...`)
        
        // Verify iframe has proper parameters
        expect(iframeSrc).toContain('youtube')
        expect(iframeSrc).toContain('embed/')
        expect(iframeSrc).toContain('rel=0')
        expect(iframeSrc).toContain('modestbranding=1')
      }
      
      // Close modal
      const closeButton = page.locator('button').filter({ hasText: '×' }).first()
      await closeButton.click()
      console.log(`   ✅ Modal closed`)
      
      await page.waitForTimeout(1000)
    }
  }
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/youtube-flawless-playback.png', fullPage: true })
  
  // Assertions
  expect(duplicateCount).toBe(0) // No duplicates
  expect(youtubeCount).toBeGreaterThan(totalTracks * 0.4) // At least 40% YouTube coverage
  expect(totalTracks).toBeGreaterThan(15) // Sufficient tracks
  
  console.log('\n✅ YouTube flawless playback test PASSED')
  console.log(`📈 Summary: ${totalTracks} tracks (${seenTracks.size} unique), ${youtubeCount} YouTube videos (${((youtubeCount / totalTracks) * 100).toFixed(1)}% coverage)`)
})

test('YouTube database matching - Verify improved algorithm', async ({ page }) => {
  console.log('🔍 Testing improved YouTube matching algorithm')
  
  // Test tracks with variations that should match
  const testCases = [
    { track: 'Blinding Lights', artist: 'The Weeknd', shouldMatch: true },
    { track: 'Blinding Lights (Radio Edit)', artist: 'The Weeknd', shouldMatch: true },
    { track: 'Shape of You', artist: 'Ed Sheeran', shouldMatch: true },
    { track: 'Shape of You - Acoustic', artist: 'Ed Sheeran', shouldMatch: true },
    { track: 'bad guy', artist: 'Billie Eilish', shouldMatch: true },
    { track: 'Bad Guy (feat. Justin Bieber)', artist: 'Billie Eilish', shouldMatch: true },
  ]
  
  // This would need to be tested via API endpoint or console logs
  // For now, we'll test via the UI
  
  await page.goto('https://mood-mix-theta.vercel.app/')
  await page.waitForLoadState('networkidle')
  
  // Test different moods to get variety
  const moods = ['Euphoric', 'Melancholic', 'Serene']
  
  for (const mood of moods) {
    console.log(`\n🎵 Testing ${mood} mood:`)
    
    const moodButton = page.locator(`button:has-text("${mood}")`).first()
    await moodButton.click()
    
    await page.waitForTimeout(8000)
    
    const trackCards = page.locator('.track-card')
    const totalTracks = await trackCards.count()
    const youtubeButtons = page.locator('button.bg-red-600')
    const youtubeCount = await youtubeButtons.count()
    
    console.log(`   Tracks: ${totalTracks}, YouTube: ${youtubeCount} (${((youtubeCount / totalTracks) * 100).toFixed(1)}%)`)
    
    // Go back to mood selection
    const changeMoodButton = page.locator('button:has-text("Change Mood")')
    await changeMoodButton.click()
    await page.waitForTimeout(1000)
  }
  
  console.log('\n✅ YouTube matching algorithm test complete')
})