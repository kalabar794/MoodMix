import { test, expect } from '@playwright/test'

test.describe('Detailed Preview URL Analysis', () => {

  test('Analyze actual Spotify data for preview patterns', async ({ page }) => {
    console.log('🔬 Deep analysis of Spotify preview URL availability...')
    
    // Capture network responses
    const apiResponses: any[] = []
    page.on('response', async response => {
      if (response.url().includes('/api/mood-to-music')) {
        try {
          const data = await response.json()
          apiResponses.push(data)
        } catch (error) {
          console.log('Could not parse API response')
        }
      }
    })
    
    await page.goto('https://mood-mix-theta.vercel.app')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    
    // Test multiple moods to gather data
    const moodsToAnalyze = ['Energetic', 'Melancholic', 'Serene', 'Passionate']
    
    for (const mood of moodsToAnalyze) {
      console.log(`\n🎵 Analyzing ${mood} mood...`)
      
      // Reset page and select mood
      await page.goto('https://mood-mix-theta.vercel.app')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(2000)
      
      const moodButton = page.locator(`button:has-text("${mood}")`).first()
      await moodButton.click()
      await page.waitForTimeout(8000)
      
      // Check if results loaded
      const hasResults = await page.locator('text="Your Perfect Soundtrack"').count() > 0
      if (!hasResults) {
        console.log(`   ❌ ${mood}: No results loaded`)
        continue
      }
      
      console.log(`   ✅ ${mood}: Results loaded`)
      
      // Analyze the most recent API response
      const latestResponse = apiResponses[apiResponses.length - 1]
      if (latestResponse && latestResponse.tracks) {
        const tracks = latestResponse.tracks
        console.log(`   📊 Total tracks returned: ${tracks.length}`)
        
        let tracksWithPreviews = 0
        let tracksWithoutPreviews = 0
        const sampleTracks = []
        
        tracks.forEach((track: any, index: number) => {
          if (track.preview_url) {
            tracksWithPreviews++
          } else {
            tracksWithoutPreviews++
          }
          
          // Collect sample data for first 5 tracks
          if (index < 5) {
            sampleTracks.push({
              name: track.name,
              artist: track.artists?.[0]?.name || 'Unknown',
              hasPreview: !!track.preview_url,
              popularity: track.popularity || 0,
              album: track.album?.name || 'Unknown',
              duration_ms: track.duration_ms
            })
          }
        })
        
        console.log(`   📊 Tracks with previews: ${tracksWithPreviews}`)
        console.log(`   📊 Tracks without previews: ${tracksWithoutPreviews}`)
        console.log(`   📊 Preview percentage: ${((tracksWithPreviews / tracks.length) * 100).toFixed(1)}%`)
        
        console.log(`   🎼 Sample tracks:`)
        sampleTracks.forEach((track, i) => {
          console.log(`     ${i + 1}. "${track.name}" by ${track.artist}`)
          console.log(`        Preview: ${track.hasPreview ? '✅ YES' : '❌ NO'} | Popularity: ${track.popularity} | Album: ${track.album}`)
        })
        
        // Look for patterns
        const previewTracks = tracks.filter((t: any) => t.preview_url)
        const noPreviewTracks = tracks.filter((t: any) => !t.preview_url)
        
        if (previewTracks.length > 0) {
          const avgPopularityWithPreview = previewTracks.reduce((sum: number, t: any) => sum + (t.popularity || 0), 0) / previewTracks.length
          console.log(`   📈 Average popularity (with previews): ${avgPopularityWithPreview.toFixed(1)}`)
        }
        
        if (noPreviewTracks.length > 0) {
          const avgPopularityNoPreview = noPreviewTracks.reduce((sum: number, t: any) => sum + (t.popularity || 0), 0) / noPreviewTracks.length
          console.log(`   📉 Average popularity (no previews): ${avgPopularityNoPreview.toFixed(1)}`)
        }
        
        // Check search parameters used
        if (latestResponse.params) {
          console.log(`   🎛️ Search params - Valence: ${latestResponse.params.valence?.toFixed(2)}, Energy: ${latestResponse.params.energy?.toFixed(2)}`)
          console.log(`   🏷️ Genres: ${latestResponse.params.genres?.join(', ') || 'None'}`)
        }
      }
      
      await page.waitForTimeout(1000)
    }
    
    console.log('\n📋 Analysis Summary:')
    console.log(`Total API calls captured: ${apiResponses.length}`)
    
    // Overall statistics
    let totalTracks = 0
    let totalWithPreviews = 0
    
    apiResponses.forEach(response => {
      if (response.tracks) {
        totalTracks += response.tracks.length
        totalWithPreviews += response.tracks.filter((t: any) => t.preview_url).length
      }
    })
    
    console.log(`📊 Overall preview rate: ${totalTracks > 0 ? ((totalWithPreviews / totalTracks) * 100).toFixed(1) : 0}% (${totalWithPreviews}/${totalTracks})`)
    
    if (totalWithPreviews === 0) {
      console.log('\n💡 Recommendations:')
      console.log('   - Preview availability appears to be severely limited in this region/market')
      console.log('   - Consider implementing alternative preview sources or partnering with other music APIs')
      console.log('   - Focus on providing rich track metadata and seamless Spotify redirect experience')
      console.log('   - Implement user feedback to identify which tracks actually have working previews')
    } else {
      console.log('\n💡 Found some patterns - further optimization possible!')
    }
  })
})