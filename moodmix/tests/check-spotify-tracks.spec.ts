import { test } from '@playwright/test'

test('Check what tracks Spotify returns', async ({ page }) => {
  console.log('🔍 Checking Spotify track results')
  
  await page.goto('https://mood-mix-theta.vercel.app/')
  await page.waitForLoadState('networkidle')
  
  // Try different moods
  const moods = ['Euphoric', 'Serene', 'Passionate']
  
  for (const mood of moods) {
    console.log(`\n=== Testing ${mood} mood ===`)
    
    const moodButton = page.locator(`button:has-text("${mood}")`).first()
    await moodButton.click()
    
    await page.waitForTimeout(8000)
    
    const trackCards = page.locator('.track-card')
    const count = await trackCards.count()
    
    console.log(`Found ${count} tracks:`)
    
    // Log first 10 tracks
    for (let i = 0; i < Math.min(10, count); i++) {
      const trackCard = trackCards.nth(i)
      const trackName = await trackCard.locator('h3').first().textContent()
      const artistName = await trackCard.locator('p').first().textContent()
      console.log(`${i + 1}. "${trackName}" by ${artistName}`)
    }
    
    // Go back to mood selection
    const changeMood = page.locator('button:has-text("Change Mood")')
    if (await changeMood.count() > 0) {
      await changeMood.click()
      await page.waitForTimeout(2000)
    }
  }
  
  console.log('\n📊 Analysis: These are the actual tracks Spotify is returning')
  console.log('We need to add more popular tracks to our database or adjust matching')
})