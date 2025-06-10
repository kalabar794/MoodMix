import { test, expect } from '@playwright/test'

test('Check improved YouTube coverage', async ({ page }) => {
  console.log('🎬 Testing YouTube coverage with expanded database (134 entries)')
  
  await page.goto('https://mood-mix-theta.vercel.app/')
  await page.waitForLoadState('networkidle')
  
  const moods = ['Energetic', 'Euphoric', 'Passionate', 'Serene']
  let totalTracks = 0
  let totalYouTube = 0
  const tracksWithYouTube: string[] = []
  const tracksWithoutYouTube: string[] = []
  
  for (const mood of moods) {
    console.log(`\n=== Testing ${mood} mood ===`)
    
    const moodButton = page.locator(`button:has-text("${mood}")`).first()
    await moodButton.click()
    
    await page.waitForTimeout(8000)
    
    const trackCards = page.locator('.track-card')
    const moodTrackCount = await trackCards.count()
    const youtubeButtons = page.locator('button.bg-red-600')
    const moodYouTubeCount = await youtubeButtons.count()
    
    totalTracks += moodTrackCount
    totalYouTube += moodYouTubeCount
    
    console.log(`Found ${moodTrackCount} tracks, ${moodYouTubeCount} with YouTube (${((moodYouTubeCount / moodTrackCount) * 100).toFixed(1)}%)`)
    
    // Check first 5 tracks
    for (let i = 0; i < Math.min(5, moodTrackCount); i++) {
      const trackCard = trackCards.nth(i)
      const trackName = await trackCard.locator('h3').first().textContent()
      const artistName = await trackCard.locator('p').first().textContent()
      const hasYouTube = await trackCard.locator('button.bg-red-600').count() > 0
      
      const trackInfo = `"${trackName}" by ${artistName}`
      
      if (hasYouTube) {
        tracksWithYouTube.push(trackInfo)
        console.log(`✅ ${i + 1}. ${trackInfo}`)
      } else {
        tracksWithoutYouTube.push(trackInfo)
        console.log(`❌ ${i + 1}. ${trackInfo}`)
      }
    }
    
    // Go back to mood selection
    const changeMood = page.locator('button:has-text("Change Mood")')
    if (await changeMood.count() > 0) {
      await changeMood.click()
      await page.waitForTimeout(2000)
    }
  }
  
  console.log('\n📊 OVERALL RESULTS:')
  console.log(`Total tracks tested: ${totalTracks}`)
  console.log(`Total YouTube videos: ${totalYouTube}`)
  console.log(`Overall YouTube coverage: ${((totalYouTube / totalTracks) * 100).toFixed(1)}%`)
  
  console.log('\n🎬 Sample tracks WITH YouTube:')
  tracksWithYouTube.slice(0, 10).forEach(track => console.log(`   ✅ ${track}`))
  
  console.log('\n❌ Sample tracks WITHOUT YouTube:')
  tracksWithoutYouTube.slice(0, 10).forEach(track => console.log(`   ❌ ${track}`))
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/youtube-coverage-improved.png', fullPage: true })
  
  console.log('\n📈 Analysis:')
  const coveragePercent = (totalYouTube / totalTracks) * 100
  if (coveragePercent >= 30) {
    console.log(`✅ EXCELLENT! ${coveragePercent.toFixed(1)}% YouTube coverage achieved!`)
  } else if (coveragePercent >= 20) {
    console.log(`🟢 Good! ${coveragePercent.toFixed(1)}% YouTube coverage - significant improvement`)
  } else if (coveragePercent >= 10) {
    console.log(`🟡 Fair - ${coveragePercent.toFixed(1)}% YouTube coverage`)
  } else {
    console.log(`⚠️ Low - ${coveragePercent.toFixed(1)}% YouTube coverage - still needs work`)
  }
  
  // Expect at least 15% coverage with expanded database
  expect(coveragePercent).toBeGreaterThan(15)
})