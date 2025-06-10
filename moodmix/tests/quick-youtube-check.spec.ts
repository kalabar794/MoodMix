import { test, expect } from '@playwright/test'

test('Quick YouTube check - are videos showing?', async ({ page }) => {
  console.log('🎬 Quick check for YouTube videos after deployment')
  
  await page.goto('https://mood-mix-theta.vercel.app/')
  await page.waitForLoadState('networkidle')
  
  // Click Energetic mood - likely to have popular tracks
  const energeticMood = page.locator('button:has-text("Energetic")').first()
  await energeticMood.click()
  console.log('✅ Clicked Energetic mood')
  
  // Wait for tracks to load
  await page.waitForTimeout(10000)
  
  // Count tracks and YouTube buttons
  const trackCards = page.locator('.track-card')
  const totalTracks = await trackCards.count()
  const youtubeButtons = page.locator('button.bg-red-600')
  const youtubeCount = await youtubeButtons.count()
  
  console.log(`\n📊 Results:`)
  console.log(`   Total tracks: ${totalTracks}`)
  console.log(`   YouTube buttons: ${youtubeCount}`)
  console.log(`   YouTube coverage: ${((youtubeCount / totalTracks) * 100).toFixed(1)}%`)
  
  // Check first 5 tracks
  console.log(`\n🎵 First 5 tracks:`)
  for (let i = 0; i < Math.min(5, totalTracks); i++) {
    const trackCard = trackCards.nth(i)
    const trackName = await trackCard.locator('h3').first().textContent()
    const artistName = await trackCard.locator('p').first().textContent()
    const hasYouTube = await trackCard.locator('button.bg-red-600').count() > 0
    
    console.log(`${i + 1}. "${trackName}" by ${artistName} - YouTube: ${hasYouTube ? '✅' : '❌'}`)
  }
  
  // If we have YouTube videos, test one
  if (youtubeCount > 0) {
    console.log(`\n🎬 Testing first YouTube video:`)
    
    const firstButton = youtubeButtons.first()
    const trackCard = firstButton.locator('xpath=ancestor::div[contains(@class, "track-card")]').first()
    const trackName = await trackCard.locator('h3').first().textContent()
    const artistName = await trackCard.locator('p').first().textContent()
    
    console.log(`Testing: "${trackName}" by ${artistName}`)
    
    await firstButton.click()
    await page.waitForTimeout(3000)
    
    // Check if modal opened and has iframe
    const iframe = page.locator('iframe[src*="youtube"]').first()
    const hasIframe = await iframe.count() > 0
    
    console.log(`Modal opened with YouTube iframe: ${hasIframe ? '✅' : '❌'}`)
    
    if (hasIframe) {
      const src = await iframe.getAttribute('src')
      console.log(`Video URL: ${src}`)
    }
    
    await page.keyboard.press('Escape')
  }
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/quick-youtube-check.png', fullPage: true })
  
  console.log(`\n📈 Summary:`)
  if (youtubeCount === 0) {
    console.log('❌ No YouTube videos showing - matching might still be too strict')
    console.log('Consider adding more popular tracks to the database')
  } else {
    console.log(`✅ YouTube videos are showing! Coverage: ${((youtubeCount / totalTracks) * 100).toFixed(1)}%`)
  }
  
  // Expect at least some YouTube videos
  expect(youtubeCount).toBeGreaterThan(0)
})