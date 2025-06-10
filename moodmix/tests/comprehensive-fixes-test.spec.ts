import { test, expect } from '@playwright/test'

test('Comprehensive fixes verification - YouTube coverage and duplicates', async ({ page }) => {
  console.log('🔧 Testing fixes for YouTube coverage and duplicate tracks')
  
  // Go to the site
  await page.goto('https://mood-mix-theta.vercel.app/')
  await page.waitForLoadState('networkidle')
  
  // Click Euphoric mood (same as in the screenshot)
  const euphoricMood = page.locator('button:has-text("Euphoric")').first()
  await euphoricMood.click()
  console.log('✅ Clicked Euphoric mood')
  
  // Wait for tracks to load
  await page.waitForTimeout(10000)
  
  // Analyze the results
  const trackCards = page.locator('.track-card')
  const totalTracks = await trackCards.count()
  const youtubeButtons = page.locator('button.bg-red-600')
  const youtubeCount = await youtubeButtons.count()
  const spotifyButtons = page.locator('button.bg-green-600')
  const spotifyCount = await spotifyButtons.count()
  
  console.log(`📊 Results Analysis:`)
  console.log(`   Total tracks: ${totalTracks}`)
  console.log(`   YouTube buttons: ${youtubeCount}`)
  console.log(`   Spotify buttons: ${spotifyCount}`)
  console.log(`   YouTube coverage: ${((youtubeCount / totalTracks) * 100).toFixed(1)}%`)
  
  // Check for duplicate tracks by collecting track names and artists
  const trackInfo = []
  for (let i = 0; i < totalTracks; i++) {
    const trackCard = trackCards.nth(i)
    
    // Get track name and artist
    const trackNameElement = trackCard.locator('h3').first()
    const artistElement = trackCard.locator('p').first()
    
    const trackName = await trackNameElement.textContent()
    const artistName = await artistElement.textContent()
    
    if (trackName && artistName) {
      const trackSignature = `${trackName.trim()} - ${artistName.trim()}`
      trackInfo.push(trackSignature)
      console.log(`   Track ${i + 1}: ${trackSignature}`)
    }
  }
  
  // Check for duplicates
  const uniqueTracks = new Set(trackInfo)
  const duplicateCount = trackInfo.length - uniqueTracks.size
  
  console.log(`🔍 Duplicate Analysis:`)
  console.log(`   Total tracks: ${trackInfo.length}`)
  console.log(`   Unique tracks: ${uniqueTracks.size}`)
  console.log(`   Duplicates found: ${duplicateCount}`)
  
  if (duplicateCount > 0) {
    console.log(`❌ DUPLICATES DETECTED:`)
    const seen = new Set()
    for (const track of trackInfo) {
      if (seen.has(track)) {
        console.log(`   • DUPLICATE: ${track}`)
      } else {
        seen.add(track)
      }
    }
  }
  
  // Take screenshot for documentation
  await page.screenshot({ path: 'test-results/comprehensive-fixes-verification.png', fullPage: true })
  
  // Assertions
  expect(totalTracks).toBeGreaterThan(15) // Should have plenty of tracks
  expect(youtubeCount).toBeGreaterThan(5) // Should have significantly more YouTube coverage now
  expect(duplicateCount).toBe(0) // Should have no duplicates
  expect(youtubeCount / totalTracks).toBeGreaterThan(0.3) // At least 30% YouTube coverage
  
  console.log('✅ Comprehensive fixes verification complete')
})

test('Test specific YouTube database matching', async ({ page }) => {
  console.log('🎬 Testing YouTube database matching improvements')
  
  // Enable debug mode to get consistent test data
  await page.goto('https://mood-mix-theta.vercel.app/?debug=true')
  await page.waitForLoadState('networkidle')
  
  // Click Euphoric mood
  const euphoricMood = page.locator('button:has-text("Euphoric")').first()
  await euphoricMood.click()
  console.log('✅ Clicked Euphoric mood')
  
  // Wait for tracks to load
  await page.waitForTimeout(8000)
  
  // Check console logs for YouTube matching info
  const consoleLogs = []
  page.on('console', msg => {
    if (msg.text().includes('🔍') || msg.text().includes('✅') || msg.text().includes('⚠️')) {
      consoleLogs.push(msg.text())
    }
  })
  
  // Force a reload to capture console logs
  await page.reload()
  await page.waitForTimeout(3000)
  const euphoricMoodReload = page.locator('button:has-text("Euphoric")').first()
  await euphoricMoodReload.click()
  await page.waitForTimeout(8000)
  
  // Analyze YouTube buttons again
  const youtubeButtons = page.locator('button.bg-red-600')
  const youtubeCount = await youtubeButtons.count()
  
  console.log(`🎬 YouTube Matching Results:`)
  console.log(`   YouTube buttons found: ${youtubeCount}`)
  
  // Print some console logs for debugging
  console.log(`📝 Console logs (first 10):`)
  for (let i = 0; i < Math.min(10, consoleLogs.length); i++) {
    console.log(`   ${consoleLogs[i]}`)
  }
  
  expect(youtubeCount).toBeGreaterThan(2) // Should have improved matching
})