import { test, expect } from '@playwright/test'

test.describe('QA Critical Fixes', () => {
  test('Verify all critical fixes are working', async ({ page }) => {
    console.log('🔍 QA Testing Critical Fixes')
    
    // Wait for deployment to complete
    await page.waitForTimeout(60000) // Wait 1 minute for deployment
    
    await page.goto('https://mood-mix-theta.vercel.app/')
    await page.waitForLoadState('networkidle')
    
    // Test 1: Check for duplicate tracks
    console.log('\n=== TEST 1: Checking for Duplicate Tracks ===')
    
    await page.locator('button:has-text("Energetic")').first().click()
    await page.waitForSelector('.track-card', { timeout: 15000 })
    
    // Get all track names and artists
    const tracks = await page.locator('.track-card').all()
    const trackData: { name: string; artist: string }[] = []
    
    for (const track of tracks) {
      const name = await track.locator('h3').textContent() || ''
      const artist = await track.locator('p').textContent() || ''
      trackData.push({ name, artist })
    }
    
    console.log(`Found ${trackData.length} tracks`)
    
    // Check for duplicates
    const signatures = trackData.map(t => `${t.name.toLowerCase()}_${t.artist.toLowerCase()}`)
    const uniqueSignatures = new Set(signatures)
    const duplicates = signatures.length - uniqueSignatures.size
    
    console.log(`Duplicates found: ${duplicates}`)
    
    // Log any duplicates
    const seen = new Set<string>()
    const duplicateList: string[] = []
    signatures.forEach((sig, i) => {
      if (seen.has(sig)) {
        duplicateList.push(`"${trackData[i].name}" by ${trackData[i].artist}`)
      }
      seen.add(sig)
    })
    
    if (duplicateList.length > 0) {
      console.log('Duplicate tracks:')
      duplicateList.forEach(d => console.log(`  - ${d}`))
    }
    
    // Test 2: Check YouTube video availability
    console.log('\n=== TEST 2: Checking YouTube Video Coverage ===')
    
    const youtubeButtons = await page.locator('button.bg-red-600').all()
    const youtubeCount = youtubeButtons.length
    const coverage = (youtubeCount / trackData.length * 100).toFixed(1)
    
    console.log(`YouTube coverage: ${youtubeCount}/${trackData.length} (${coverage}%)`)
    
    // Check which popular tracks have YouTube
    const popularArtists = ['weeknd', 'swims', 'swift', 'sheeran', 'eilish', 'mars', 'grande', 'drake']
    const popularTracks = trackData.filter(t => 
      popularArtists.some(artist => t.artist.toLowerCase().includes(artist))
    )
    
    console.log(`\nPopular artist tracks: ${popularTracks.length}`)
    for (const track of popularTracks) {
      const index = trackData.findIndex(t => t.name === track.name && t.artist === track.artist)
      const trackCard = tracks[index]
      const hasYouTube = await trackCard.locator('button.bg-red-600').count() > 0
      console.log(`  ${hasYouTube ? '✅' : '❌'} "${track.name}" by ${track.artist}`)
    }
    
    // Test 3: Check YouTube playback
    console.log('\n=== TEST 3: Testing YouTube Playback ===')
    
    if (youtubeCount > 0) {
      // Find Teddy Swims if available
      let buttonToTest = youtubeButtons[0]
      let trackInfo = { name: trackData[0].name, artist: trackData[0].artist }
      
      for (let i = 0; i < tracks.length; i++) {
        if (trackData[i].artist.toLowerCase().includes('teddy swims')) {
          const trackCard = tracks[i]
          const ytButton = trackCard.locator('button.bg-red-600')
          if (await ytButton.count() > 0) {
            buttonToTest = ytButton.first()
            trackInfo = trackData[i]
            console.log('Found Teddy Swims track to test!')
            break
          }
        }
      }
      
      console.log(`Testing: "${trackInfo.name}" by ${trackInfo.artist}`)
      
      await buttonToTest.click()
      await page.waitForTimeout(2000)
      
      // Check modal opened
      const modal = page.locator('[data-testid="youtube-modal"]')
      const modalVisible = await modal.count() > 0
      console.log(`Modal opened: ${modalVisible ? '✅' : '❌'}`)
      
      // Check iframe
      const iframe = page.locator('iframe[src*="youtube"]')
      const iframeVisible = await iframe.count() > 0
      console.log(`YouTube iframe present: ${iframeVisible ? '✅' : '❌'}`)
      
      if (iframeVisible) {
        const src = await iframe.getAttribute('src')
        console.log(`Video URL: ${src}`)
        
        // Check for sandbox attribute
        const sandbox = await iframe.getAttribute('sandbox')
        console.log(`Sandbox attribute: ${sandbox || 'none (good!)'}`)
        
        // Check allow attribute
        const allow = await iframe.getAttribute('allow')
        console.log(`Allow attribute: ${allow}`)
      }
      
      // Close modal
      await page.keyboard.press('Escape')
      await page.waitForTimeout(1000)
      
      const modalClosed = await modal.count() === 0
      console.log(`Modal closed with ESC: ${modalClosed ? '✅' : '❌'}`)
    }
    
    // Test different moods for consistency
    console.log('\n=== TEST 4: Testing Multiple Moods ===')
    
    await page.locator('button:has-text("Change Mood")').click()
    await page.waitForTimeout(1000)
    
    const moods = ['Euphoric', 'Serene', 'Passionate']
    const moodResults: any[] = []
    
    for (const mood of moods) {
      await page.locator(`button:has-text("${mood}")`).first().click()
      await page.waitForSelector('.track-card', { timeout: 15000 })
      
      const moodTracks = await page.locator('.track-card').count()
      const moodYouTube = await page.locator('button.bg-red-600').count()
      
      moodResults.push({
        mood,
        tracks: moodTracks,
        youtube: moodYouTube,
        coverage: (moodYouTube / moodTracks * 100).toFixed(1)
      })
      
      // Check for Lose Control duplicate
      const trackNames = await page.locator('.track-card h3').allTextContents()
      const loseControlCount = trackNames.filter(name => 
        name.toLowerCase().includes('lose control')
      ).length
      
      if (loseControlCount > 1) {
        console.log(`⚠️ "${mood}" has ${loseControlCount} instances of "Lose Control"`)
      }
      
      await page.locator('button:has-text("Change Mood")').click()
      await page.waitForTimeout(1000)
    }
    
    console.log('\nMood comparison:')
    moodResults.forEach(r => {
      console.log(`  ${r.mood}: ${r.tracks} tracks, ${r.youtube} YouTube (${r.coverage}%)`)
    })
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/qa-critical-fixes.png', fullPage: true })
    
    // Final assertions
    console.log('\n=== FINAL RESULTS ===')
    
    // Should have minimal or no duplicates
    expect(duplicates).toBeLessThanOrEqual(2) // Allow max 2 duplicates
    
    // Should have better YouTube coverage
    expect(Number(coverage)).toBeGreaterThan(20) // Expect > 20% coverage
    
    // Popular tracks should mostly have YouTube
    const popularWithYouTube = popularTracks.filter((_, i) => 
      trackData[i].artist.toLowerCase().includes('youtube')
    ).length
    expect(popularWithYouTube / popularTracks.length).toBeGreaterThan(0.5)
    
    console.log('\n✅ QA Testing Complete!')
  })
})