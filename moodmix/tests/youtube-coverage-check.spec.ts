import { test } from '@playwright/test'

test('Check YouTube coverage after improved matching', async ({ page }) => {
  console.log('🎬 Testing YouTube coverage with improved matching algorithm')
  
  await page.goto('https://mood-mix-theta.vercel.app/')
  await page.waitForLoadState('networkidle')
  
  // Try multiple moods to get a good sample
  const moods = ['Euphoric', 'Serene', 'Energetic', 'Passionate']
  
  let totalTracks = 0
  let totalYouTube = 0
  let popularTracksWithYouTube: string[] = []
  let popularTracksWithoutYouTube: string[] = []
  
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
    
    console.log(`Found ${moodTrackCount} tracks, ${moodYouTubeCount} with YouTube`)
    
    // Check which popular tracks have YouTube
    for (let i = 0; i < Math.min(5, moodTrackCount); i++) {
      const trackCard = trackCards.nth(i)
      const trackName = await trackCard.locator('h3').first().textContent()
      const artistName = await trackCard.locator('p').first().textContent()
      const hasYouTube = await trackCard.locator('button.bg-red-600').count() > 0
      
      const trackInfo = `"${trackName}" by ${artistName}`
      
      // Check if this is a known popular artist
      const popularArtists = ['weeknd', 'swift', 'drake', 'bieber', 'grande', 'sheeran', 'mars', 'dua lipa', 'styles', 'billie']
      const isPopular = popularArtists.some(artist => artistName?.toLowerCase().includes(artist))
      
      if (isPopular) {
        if (hasYouTube) {
          popularTracksWithYouTube.push(trackInfo)
        } else {
          popularTracksWithoutYouTube.push(trackInfo)
        }
      }
      
      console.log(`${i + 1}. ${trackInfo} - YouTube: ${hasYouTube ? '✅' : '❌'}`)
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
  
  console.log('\n🌟 Popular tracks WITH YouTube:')
  popularTracksWithYouTube.forEach(track => console.log(`   ✅ ${track}`))
  
  console.log('\n❌ Popular tracks WITHOUT YouTube:')
  popularTracksWithoutYouTube.forEach(track => console.log(`   ❌ ${track}`))
  
  console.log('\n📈 Analysis:')
  console.log(`   Popular tracks with YouTube: ${popularTracksWithYouTube.length}`)
  console.log(`   Popular tracks without YouTube: ${popularTracksWithoutYouTube.length}`)
  
  if (totalYouTube === 0) {
    console.log('\n⚠️ WARNING: No YouTube videos found at all!')
    console.log('The matching algorithm might still be too strict.')
  } else if (totalYouTube / totalTracks < 0.2) {
    console.log('\n⚠️ WARNING: Very low YouTube coverage!')
    console.log('Consider adding more entries to the database.')
  } else {
    console.log('\n✅ Good YouTube coverage achieved!')
  }
})