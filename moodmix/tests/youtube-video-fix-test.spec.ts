import { test, expect } from '@playwright/test'

test.describe('YouTube Video Fix Test', () => {
  test('should display different videos for different tracks', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Click on the mood wheel to select "Energetic"
    await page.waitForSelector('.mood-wheel-container', { timeout: 10000 })
    
    // Click on Energetic mood (positive valence, high arousal)
    await page.mouse.click(600, 200) // Approximate position for Energetic
    
    // Wait for music results
    await page.waitForSelector('.track-card', { timeout: 30000 })
    
    // Get all track information
    const tracks = await page.$$eval('.track-card', cards => 
      cards.slice(0, 3).map(card => ({
        title: card.querySelector('h3')?.textContent || '',
        artist: card.querySelector('p')?.textContent || ''
      }))
    )
    
    console.log('Found tracks:', tracks)
    
    // Get all YouTube buttons
    const youtubeButtons = page.locator('button[title^="Watch"]')
    const buttonCount = await youtubeButtons.count()
    
    console.log(`Found ${buttonCount} YouTube buttons`)
    
    // Test first three videos if available
    const videoTitles: string[] = []
    
    for (let i = 0; i < Math.min(3, buttonCount); i++) {
      // Click YouTube button
      await youtubeButtons.nth(i).click()
      
      // Wait for modal
      await page.waitForSelector('.fixed.inset-0.z-50', { timeout: 5000 })
      
      // Get video title
      const videoTitle = await page.locator('.fixed.inset-0.z-50 h3').textContent()
      console.log(`Video ${i + 1}: ${videoTitle}`)
      videoTitles.push(videoTitle || '')
      
      // Close modal
      await page.locator('.fixed.inset-0.z-50 button:has-text("×")').click()
      await page.waitForTimeout(500)
    }
    
    // Verify all videos are different
    const uniqueVideos = new Set(videoTitles)
    console.log(`Unique videos: ${uniqueVideos.size} out of ${videoTitles.length}`)
    
    // The fix should ensure each track gets a different video (or null)
    // With the fallback removed, tracks that don't match should not show a button
    expect(uniqueVideos.size).toBe(videoTitles.length)
    
    // Also verify that video titles somewhat relate to track info
    for (let i = 0; i < videoTitles.length; i++) {
      const track = tracks[i]
      const video = videoTitles[i]
      
      console.log(`Checking match: Track "${track.title}" by "${track.artist}" => Video "${video}"`)
      
      // At least the artist or track name should appear in the video title
      const videoLower = video.toLowerCase()
      const trackLower = track.title.toLowerCase()
      const artistLower = track.artist.toLowerCase()
      
      // Check if there's some relevance (artist name or track name appears in video)
      const hasRelevance = artistLower.split(/\s+/).some(word => 
        word.length > 2 && videoLower.includes(word)
      ) || trackLower.split(/\s+/).some(word => 
        word.length > 2 && videoLower.includes(word)
      )
      
      if (!hasRelevance) {
        console.warn(`Warning: Video "${video}" might not match track "${track.title}" by "${track.artist}"`)
      }
    }
  })
})