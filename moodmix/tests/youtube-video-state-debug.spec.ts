import { test, expect } from '@playwright/test'

test.describe('YouTube Video State Debug', () => {
  test('should show different videos for different tracks', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Select a mood (Energetic)
    const energeticCard = page.locator('[data-mood-name="Energetic"]')
    await energeticCard.waitFor({ state: 'visible', timeout: 10000 })
    await energeticCard.click()
    
    // Wait for music results
    await page.waitForSelector('.track-card', { timeout: 30000 })
    
    // Get all YouTube buttons
    const youtubeButtons = page.locator('button[title^="Watch"]')
    const buttonCount = await youtubeButtons.count()
    
    console.log(`Found ${buttonCount} YouTube buttons`)
    
    // Click the first YouTube button and capture the video title
    if (buttonCount > 0) {
      await youtubeButtons.nth(0).click()
      
      // Wait for YouTube player modal
      await page.waitForSelector('.fixed.inset-0.z-50', { timeout: 5000 })
      
      // Get the first video title
      const firstVideoTitle = await page.locator('.fixed.inset-0.z-50 h3').textContent()
      console.log(`First video title: ${firstVideoTitle}`)
      
      // Close the modal
      await page.locator('.fixed.inset-0.z-50 button:has-text("×")').click()
      await page.waitForTimeout(500)
      
      // Click the second YouTube button if available
      if (buttonCount > 1) {
        await youtubeButtons.nth(1).click()
        
        // Wait for YouTube player modal again
        await page.waitForSelector('.fixed.inset-0.z-50', { timeout: 5000 })
        
        // Get the second video title
        const secondVideoTitle = await page.locator('.fixed.inset-0.z-50 h3').textContent()
        console.log(`Second video title: ${secondVideoTitle}`)
        
        // Check if videos are different
        expect(secondVideoTitle).not.toBe(firstVideoTitle)
        
        // Close the modal
        await page.locator('.fixed.inset-0.z-50 button:has-text("×")').click()
        await page.waitForTimeout(500)
        
        // Try a third video if available
        if (buttonCount > 2) {
          await youtubeButtons.nth(2).click()
          
          // Wait for YouTube player modal
          await page.waitForSelector('.fixed.inset-0.z-50', { timeout: 5000 })
          
          // Get the third video title
          const thirdVideoTitle = await page.locator('.fixed.inset-0.z-50 h3').textContent()
          console.log(`Third video title: ${thirdVideoTitle}`)
          
          // Check if all videos are different
          expect(thirdVideoTitle).not.toBe(firstVideoTitle)
          expect(thirdVideoTitle).not.toBe(secondVideoTitle)
        }
      }
    }
    
    // Also log the track information
    const trackCards = page.locator('.track-card')
    const trackCount = await trackCards.count()
    
    for (let i = 0; i < Math.min(3, trackCount); i++) {
      const trackName = await trackCards.nth(i).locator('h3').textContent()
      const artistName = await trackCards.nth(i).locator('p').first().textContent()
      console.log(`Track ${i + 1}: ${trackName} by ${artistName}`)
    }
  })
})