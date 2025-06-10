import { test, expect } from '@playwright/test'

test('YouTube simple debug - Check video uniqueness', async ({ page }) => {
  console.log('🔍 Simple YouTube video debug')
  
  // Set up console log capture
  const consoleLogs: string[] = []
  page.on('console', msg => {
    const text = msg.text()
    if (text.includes('YouTube') || text.includes('video') || text.includes('Found') || text.includes('No match')) {
      consoleLogs.push(text)
    }
  })
  
  // Go to the site
  await page.goto('https://mood-mix-theta.vercel.app/')
  await page.waitForLoadState('networkidle')
  
  // Click Energetic mood for different results
  const energeticMood = page.locator('button:has-text("Energetic")').first()
  await energeticMood.click()
  console.log('✅ Clicked Energetic mood')
  
  // Wait for tracks to load
  await page.waitForTimeout(10000)
  
  // Get track information
  const trackCards = page.locator('.track-card')
  const totalTracks = await trackCards.count()
  const youtubeButtons = page.locator('button.bg-red-600')
  const youtubeCount = await youtubeButtons.count()
  
  console.log(`\n📊 Results:`)
  console.log(`   Total tracks: ${totalTracks}`)
  console.log(`   YouTube buttons: ${youtubeCount}`)
  
  // Log first 10 tracks and their YouTube status
  console.log(`\n🎵 Track List with YouTube status:`)
  for (let i = 0; i < Math.min(10, totalTracks); i++) {
    const trackCard = trackCards.nth(i)
    const trackName = await trackCard.locator('h3').first().textContent()
    const artistName = await trackCard.locator('p').first().textContent()
    
    // Check if this track has a YouTube button
    const hasYouTube = await trackCard.locator('button.bg-red-600').count() > 0
    
    console.log(`${i + 1}. "${trackName}" by ${artistName} - YouTube: ${hasYouTube ? '✅' : '❌'}`)
  }
  
  // Test clicking different YouTube buttons
  if (youtubeCount >= 3) {
    console.log(`\n🎬 Testing 3 different YouTube buttons:`)
    
    const videoIds: string[] = []
    
    for (const index of [0, Math.floor(youtubeCount / 2), youtubeCount - 1]) {
      if (index < youtubeCount) {
        console.log(`\nTesting button ${index + 1}:`)
        
        const button = youtubeButtons.nth(index)
        await button.click()
        
        await page.waitForTimeout(3000)
        
        // Try to get video ID from iframe src
        const iframe = page.locator('iframe[src*="youtube"]').first()
        if (await iframe.count() > 0) {
          const src = await iframe.getAttribute('src')
          const idMatch = src?.match(/embed\/([a-zA-Z0-9_-]+)/)
          const videoId = idMatch ? idMatch[1] : 'unknown'
          videoIds.push(videoId)
          console.log(`   Video ID: ${videoId}`)
          
          // Try to get the visible title text
          const titleElements = page.locator('.text-white.font-semibold')
          if (await titleElements.count() > 0) {
            const title = await titleElements.first().textContent()
            console.log(`   Title: ${title}`)
          }
        } else {
          console.log(`   No iframe found`)
          videoIds.push('no-iframe')
        }
        
        // Close modal
        await page.keyboard.press('Escape')
        await page.waitForTimeout(1000)
      }
    }
    
    // Check for duplicates
    const uniqueIds = new Set(videoIds)
    console.log(`\n📊 Video ID Analysis:`)
    console.log(`   Total tested: ${videoIds.length}`)
    console.log(`   Unique IDs: ${uniqueIds.size}`)
    console.log(`   IDs: ${Array.from(uniqueIds).join(', ')}`)
    
    if (uniqueIds.size < videoIds.length) {
      console.log('❌ DUPLICATE VIDEO IDS DETECTED!')
    } else {
      console.log('✅ All video IDs are unique!')
    }
  }
  
  // Print relevant console logs
  console.log(`\n📝 Relevant console logs:`)
  consoleLogs.slice(-20).forEach(log => console.log(`   ${log}`))
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/youtube-simple-debug.png', fullPage: true })
})