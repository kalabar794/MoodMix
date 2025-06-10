import { test } from '@playwright/test'

test('Quick check of Spotify tracks', async ({ page }) => {
  console.log('🔍 Checking what tracks Spotify returns')
  
  await page.goto('https://mood-mix-theta.vercel.app/')
  await page.waitForLoadState('networkidle')
  
  // Try Energetic mood
  const energeticMood = page.locator('button:has-text("Energetic")').first()
  await energeticMood.click()
  
  await page.waitForTimeout(8000)
  
  const trackCards = page.locator('.track-card')
  const count = await trackCards.count()
  
  console.log(`\nFound ${count} tracks for Energetic mood:`)
  
  // Log all tracks
  for (let i = 0; i < count; i++) {
    const trackCard = trackCards.nth(i)
    const trackName = await trackCard.locator('h3').first().textContent()
    const artistName = await trackCard.locator('p').first().textContent()
    console.log(`${i + 1}. "${trackName}" by ${artistName}`)
  }
})