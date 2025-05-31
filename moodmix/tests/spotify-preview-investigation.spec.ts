import { test, expect } from '@playwright/test'

test.describe('Spotify Preview URL Investigation', () => {
  test('Deep dive into Spotify API responses and preview availability', async ({ page }) => {
    // Navigate to the deployed app
    await page.goto('https://mood-mix-theta.vercel.app')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Take initial screenshot
    await page.screenshot({ path: 'test-results/spotify-investigation-initial.png', fullPage: true })
    
    // Set up network monitoring to capture API responses
    const apiResponses: any[] = []
    
    page.on('response', async response => {
      if (response.url().includes('/api/mood-to-music')) {
        try {
          const responseData = await response.json()
          apiResponses.push({
            url: response.url(),
            status: response.status(),
            data: responseData
          })
          console.log('🎵 Captured mood-to-music API response:', {
            status: response.status(),
            tracksCount: responseData?.tracks?.length || 0,
            url: response.url()
          })
        } catch (error) {
          console.log('❌ Error parsing API response:', error)
        }
      }
    })
    
    // Look for mood selection cards (based on your recent redesign)
    const energeticCard = page.locator('text=Energetic').first()
    
    if (await energeticCard.isVisible()) {
      console.log('✅ Found Energetic mood card')
      
      // Click on Energetic mood
      await energeticCard.click()
      
      // Wait for API call to complete
      await page.waitForTimeout(3000)
      
      // Take screenshot after selection
      await page.screenshot({ path: 'test-results/spotify-investigation-energetic-selected.png', fullPage: true })
      
    } else {
      // Fallback: look for any clickable mood elements
      console.log('🔍 Energetic card not found, looking for alternative mood selectors...')
      
      // Look for any buttons or clickable elements that might be mood selectors
      const moodElements = await page.locator('button, [role="button"], .cursor-pointer').all()
      
      for (let i = 0; i < Math.min(moodElements.length, 10); i++) {
        const element = moodElements[i]
        const text = await element.textContent()
        console.log(`Found clickable element ${i}: "${text}"`)
        
        if (text && (text.toLowerCase().includes('energetic') || text.toLowerCase().includes('happy') || text.toLowerCase().includes('excited'))) {
          console.log(`🎯 Clicking on "${text}"`)
          await element.click()
          await page.waitForTimeout(3000)
          break
        }
      }
    }
    
    // Wait a bit more to ensure all API calls complete
    await page.waitForTimeout(5000)
    
    // Analyze the captured API responses
    console.log(`\n📊 SPOTIFY API ANALYSIS:`)
    console.log(`Total API responses captured: ${apiResponses.length}`)
    
    if (apiResponses.length > 0) {
      const latestResponse = apiResponses[apiResponses.length - 1]
      const tracks = latestResponse.data?.tracks || []
      
      console.log(`\n🎵 TRACK ANALYSIS:`)
      console.log(`Total tracks returned: ${tracks.length}`)
      
      let tracksWithPreviews = 0
      let tracksWithoutPreviews = 0
      
      tracks.forEach((track: any, index: number) => {
        const hasPreview = track.preview_url !== null && track.preview_url !== undefined
        if (hasPreview) tracksWithPreviews++
        else tracksWithoutPreviews++
        
        console.log(`\nTrack ${index + 1}:`)
        console.log(`  Name: "${track.name}"`)
        console.log(`  Artist: "${track.artists?.[0]?.name || 'Unknown'}"`)
        console.log(`  Album: "${track.album?.name || 'Unknown'}"`)
        console.log(`  Release Date: ${track.album?.release_date || 'Unknown'}`)
        console.log(`  Popularity: ${track.popularity || 'Unknown'}`)
        console.log(`  Preview URL: ${hasPreview ? '✅ Available' : '❌ NULL'}`)
        console.log(`  Spotify URL: ${track.external_urls?.spotify || 'Unknown'}`)
        
        // Log explicit content info if available
        if (track.explicit !== undefined) {
          console.log(`  Explicit: ${track.explicit ? 'Yes' : 'No'}`)
        }
        
        // Log market info if available
        if (track.available_markets) {
          console.log(`  Available Markets: ${track.available_markets.length} countries`)
        }
      })
      
      const previewPercentage = tracks.length > 0 ? (tracksWithPreviews / tracks.length * 100).toFixed(1) : '0'
      
      console.log(`\n📈 PREVIEW AVAILABILITY SUMMARY:`)
      console.log(`Tracks with previews: ${tracksWithPreviews}`)
      console.log(`Tracks without previews: ${tracksWithoutPreviews}`)
      console.log(`Preview availability: ${previewPercentage}%`)
      
      // Save detailed analysis to file for further review
      const analysisData = {
        timestamp: new Date().toISOString(),
        totalTracks: tracks.length,
        tracksWithPreviews,
        tracksWithoutPreviews,
        previewPercentage: parseFloat(previewPercentage),
        tracks: tracks.map((track: any) => ({
          name: track.name,
          artist: track.artists?.[0]?.name,
          album: track.album?.name,
          releaseDate: track.album?.release_date,
          popularity: track.popularity,
          hasPreview: track.preview_url !== null,
          previewUrl: track.preview_url,
          spotifyUrl: track.external_urls?.spotify,
          explicit: track.explicit,
          availableMarkets: track.available_markets?.length || 0
        }))
      }
      
      // Write analysis to console as JSON for easy parsing
      console.log('\n📋 DETAILED ANALYSIS JSON:')
      console.log(JSON.stringify(analysisData, null, 2))
      
    } else {
      console.log('❌ No API responses captured - this suggests the mood selection may not be working')
    }
    
    // Take final screenshot
    await page.screenshot({ path: 'test-results/spotify-investigation-final.png', fullPage: true })
    
    // Verify we got some data
    expect(apiResponses.length).toBeGreaterThan(0)
  })
  
  test('Test multiple moods for preview availability patterns', async ({ page }) => {
    await page.goto('https://mood-mix-theta.vercel.app')
    await page.waitForLoadState('networkidle')
    
    const moodResults: any = {}
    
    // Test different moods to see if preview availability varies
    const moodsToTest = ['Happy', 'Sad', 'Energetic', 'Calm', 'Angry', 'Romantic']
    
    for (const mood of moodsToTest) {
      console.log(`\n🧪 Testing mood: ${mood}`)
      
      let apiResponse: any = null
      
      // Set up response capture for this mood
      const responsePromise = new Promise((resolve) => {
        page.on('response', async response => {
          if (response.url().includes('/api/mood-to-music')) {
            try {
              const data = await response.json()
              resolve(data)
            } catch (error) {
              resolve(null)
            }
          }
        })
      })
      
      // Look for the mood card
      const moodCard = page.locator(`text=${mood}`).first()
      
      if (await moodCard.isVisible({ timeout: 2000 })) {
        await moodCard.click()
        
        // Wait for response
        try {
          apiResponse = await Promise.race([
            responsePromise,
            new Promise(resolve => setTimeout(() => resolve(null), 5000))
          ])
        } catch (error) {
          console.log(`❌ Error for mood ${mood}:`, error)
        }
        
        if (apiResponse && apiResponse.tracks) {
          const tracks = apiResponse.tracks
          const withPreviews = tracks.filter((t: any) => t.preview_url !== null).length
          const previewRate = (withPreviews / tracks.length * 100).toFixed(1)
          
          moodResults[mood] = {
            totalTracks: tracks.length,
            withPreviews,
            previewRate: parseFloat(previewRate),
            sampleTracks: tracks.slice(0, 3).map((t: any) => ({
              name: t.name,
              artist: t.artists?.[0]?.name,
              hasPreview: t.preview_url !== null,
              popularity: t.popularity,
              releaseDate: t.album?.release_date
            }))
          }
          
          console.log(`${mood}: ${withPreviews}/${tracks.length} tracks with previews (${previewRate}%)`)
        } else {
          console.log(`❌ No response for mood: ${mood}`)
          moodResults[mood] = { error: 'No API response' }
        }
        
        // Wait between tests
        await page.waitForTimeout(2000)
      } else {
        console.log(`❌ Mood card not found: ${mood}`)
        moodResults[mood] = { error: 'Mood card not found' }
      }
    }
    
    console.log('\n📊 MOOD COMPARISON RESULTS:')
    console.log(JSON.stringify(moodResults, null, 2))
    
    // Take screenshot of final state
    await page.screenshot({ path: 'test-results/spotify-investigation-mood-comparison.png', fullPage: true })
  })
})