import { test, expect } from '@playwright/test'

test.describe('Check what tracks Spotify returns', () => {
  test('Get Spotify tracks for various moods', async ({ page }) => {
    // Enable console logging
    page.on('console', msg => {
      if (msg.type() === 'log') {
        console.log(msg.text())
      }
    })

    await page.goto('http://localhost:3000')
    
    const moods = ['Euphoric', 'Serene', 'Passionate', 'Melancholic', 'Peaceful']
    
    for (const mood of moods) {
      console.log(`\n=== Testing ${mood} mood ===`)
      
      // Click on mood button
      const moodButton = page.locator(`button:has-text("${mood}")`)
      await expect(moodButton).toBeVisible({ timeout: 10000 })
      await moodButton.click()
      
      // Wait for results to load
      await page.waitForSelector('.track-card', { timeout: 15000 })
      await page.waitForTimeout(2000) // Extra time for all tracks to load
      
      // Get all track cards
      const trackCards = await page.locator('.track-card').all()
      console.log(`Found ${trackCards.length} tracks:`)
      
      // Extract track information
      for (let i = 0; i < Math.min(trackCards.length, 10); i++) {
        const card = trackCards[i]
        
        // Get track name
        const trackName = await card.locator('.text-body.font-semibold').first().textContent()
        
        // Get artist name
        const artistName = await card.locator('.text-caption').first().textContent()
        
        console.log(`${i + 1}. "${trackName?.trim()}" by ${artistName?.trim()}`)
      }
      
      // Return to main page
      await page.reload()
      await page.waitForLoadState('networkidle')
    }
  })
})