import { test, expect } from '@playwright/test'

test('Check YouTube database integration', async ({ page }) => {
  console.log('🔍 Testing YouTube video database integration')
  
  // Enable console logging
  page.on('console', msg => {
    if (msg.type() === 'log' && msg.text().includes('YouTube')) {
      console.log('Console:', msg.text())
    }
  })
  
  // Intercept API calls
  page.on('response', response => {
    if (response.url().includes('/api/mood-to-music')) {
      console.log(`API Response: ${response.status()} ${response.statusText()}`)
    }
  })
  
  await page.goto('https://mood-mix-theta.vercel.app/')
  await page.waitForLoadState('networkidle')
  
  // Click Energetic mood
  await page.locator('button:has-text("Energetic")').first().click()
  await page.waitForSelector('.track-card', { timeout: 15000 })
  
  // Wait for YouTube search to complete
  await page.waitForTimeout(5000)
  
  // Check tracks and YouTube coverage
  const tracks = await page.locator('.track-card').all()
  const youtubeButtons = await page.locator('button.bg-red-600').all()
  
  console.log(`\nTracks loaded: ${tracks.length}`)
  console.log(`YouTube buttons: ${youtubeButtons.length}`)
  console.log(`Coverage: ${(youtubeButtons.length / tracks.length * 100).toFixed(1)}%`)
  
  // Get details of tracks with YouTube
  if (youtubeButtons.length > 0) {
    console.log('\nTracks with YouTube videos:')
    for (let i = 0; i < tracks.length; i++) {
      const card = tracks[i]
      const hasYouTube = await card.locator('button.bg-red-600').count() > 0
      if (hasYouTube) {
        const name = await card.locator('h3').textContent()
        const artist = await card.locator('p.text-caption').first().textContent()
        console.log(`  ✅ "${name}" by ${artist}`)
      }
    }
  } else {
    console.log('\n❌ No YouTube videos found!')
    
    // Get sample tracks to debug
    console.log('\nSample tracks for debugging:')
    for (let i = 0; i < Math.min(5, tracks.length); i++) {
      const card = tracks[i]
      const name = await card.locator('h3').textContent()
      const artist = await card.locator('p.text-caption').first().textContent()
      console.log(`  ${i + 1}. "${name}" by ${artist}`)
    }
  }
  
  // Test YouTube playback if available
  if (youtubeButtons.length > 0) {
    console.log('\nTesting YouTube playback...')
    await youtubeButtons[0].click()
    await page.waitForTimeout(2000)
    
    const modal = page.locator('[data-testid="youtube-modal"]')
    const modalExists = await modal.count() > 0
    console.log(`Modal opened: ${modalExists ? '✅' : '❌'}`)
    
    if (modalExists) {
      const iframe = page.locator('iframe[src*="youtube.com/embed"]')
      const iframeExists = await iframe.count() > 0
      console.log(`YouTube iframe loaded: ${iframeExists ? '✅' : '❌'}`)
      
      if (iframeExists) {
        const src = await iframe.getAttribute('src')
        console.log(`Video URL: ${src}`)
      }
      
      await page.keyboard.press('Escape')
    }
  }
  
  await page.screenshot({ path: 'test-results/youtube-database-check.png' })
})