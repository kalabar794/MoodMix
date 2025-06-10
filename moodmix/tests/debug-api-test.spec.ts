import { test, expect } from '@playwright/test'

test('Debug API and fixes', async ({ page }) => {
  console.log('🔍 Debug API Test')
  
  // Listen for console logs
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Browser error:', msg.text())
    }
  })
  
  // Listen for network responses
  page.on('response', response => {
    if (response.url().includes('/api/mood-to-music')) {
      console.log(`\nAPI Response: ${response.status()} ${response.statusText()}`)
    }
  })
  
  await page.goto('https://mood-mix-theta.vercel.app/')
  await page.waitForLoadState('networkidle')
  
  console.log('Page loaded, clicking Energetic...')
  
  // Click Energetic
  await page.locator('button:has-text("Energetic")').first().click()
  
  // Wait for API response
  await page.waitForTimeout(5000)
  
  // Check for error messages
  const errorMessage = await page.locator('text=/error|failed/i').count()
  if (errorMessage > 0) {
    const errorText = await page.locator('text=/error|failed/i').first().textContent()
    console.log(`\nError found: ${errorText}`)
  }
  
  // Check for tracks
  const trackCount = await page.locator('.track-card').count()
  console.log(`\nTracks loaded: ${trackCount}`)
  
  if (trackCount > 0) {
    // Get first 5 tracks
    for (let i = 0; i < Math.min(5, trackCount); i++) {
      const trackCard = page.locator('.track-card').nth(i)
      const name = await trackCard.locator('h3').textContent()
      const artist = await trackCard.locator('p').textContent()
      const hasYouTube = await trackCard.locator('button.bg-red-600').count() > 0
      
      console.log(`${i + 1}. "${name}" by ${artist} - YouTube: ${hasYouTube ? '✅' : '❌'}`)
    }
    
    // Check YouTube coverage
    const youtubeCount = await page.locator('button.bg-red-600').count()
    console.log(`\nYouTube coverage: ${youtubeCount}/${trackCount} (${(youtubeCount/trackCount*100).toFixed(1)}%)`)
  }
  
  // Check loading state
  const isLoading = await page.locator('.loading-spinner').count()
  console.log(`\nStill loading: ${isLoading > 0}`)
  
  await page.screenshot({ path: 'test-results/debug-api-test.png' })
})