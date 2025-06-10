import { test, expect } from '@playwright/test'

test('YouTube video debug - Check if same video plays for all tracks', async ({ page }) => {
  console.log('🔍 DEBUGGING: YouTube video duplication issue')
  
  // Go to the site
  await page.goto('https://mood-mix-theta.vercel.app/')
  await page.waitForLoadState('networkidle')
  
  // Click Euphoric mood
  const euphoricMood = page.locator('button:has-text("Euphoric")').first()
  await euphoricMood.click()
  console.log('✅ Clicked Euphoric mood')
  
  // Wait for tracks to load
  await page.waitForTimeout(10000)
  
  // Get all YouTube buttons
  const youtubeButtons = page.locator('button.bg-red-600')
  const youtubeCount = await youtubeButtons.count()
  console.log(`\n📊 Found ${youtubeCount} YouTube buttons`)
  
  // Store video information
  const videoData: { trackName: string, videoInfo: string | null }[] = []
  
  // Test first 5 YouTube videos (or all if less than 5)
  const testCount = Math.min(5, youtubeCount)
  console.log(`\n🎬 Testing ${testCount} YouTube videos:\n`)
  
  for (let i = 0; i < testCount; i++) {
    console.log(`\n--- Testing video ${i + 1}/${testCount} ---`)
    
    // Get the current YouTube button
    const currentButton = youtubeButtons.nth(i)
    
    // Find the track card containing this button
    const trackCard = currentButton.locator('xpath=ancestor::div[contains(@class, "track-card")]').first()
    
    // Get track name
    const trackNameElement = trackCard.locator('h3').first()
    const trackName = await trackNameElement.textContent() || 'Unknown Track'
    const artistElement = trackCard.locator('p').first()
    const artistName = await artistElement.textContent() || 'Unknown Artist'
    
    console.log(`Track: "${trackName}" by ${artistName}`)
    
    // Click the YouTube button
    await currentButton.click()
    console.log('Clicked YouTube button')
    
    // Wait for modal
    await page.waitForTimeout(2000)
    
    // Check if modal opened
    const modal = page.locator('.fixed.inset-0').first()
    const isModalVisible = await modal.isVisible()
    
    if (isModalVisible) {
      // Get video title from modal
      const videoTitle = await modal.locator('h3').first().textContent()
      console.log(`Video Title: ${videoTitle}`)
      
      // Get iframe source if available
      const iframe = modal.locator('iframe').first()
      if (await iframe.count() > 0) {
        const iframeSrc = await iframe.getAttribute('src')
        const videoIdMatch = iframeSrc?.match(/embed\/([a-zA-Z0-9_-]+)/)
        const videoId = videoIdMatch ? videoIdMatch[1] : 'Unknown ID'
        console.log(`Video ID: ${videoId}`)
        console.log(`Full embed URL: ${iframeSrc?.substring(0, 60)}...`)
        
        videoData.push({
          trackName: `${trackName} - ${artistName}`,
          videoInfo: `${videoTitle} (ID: ${videoId})`
        })
      } else {
        console.log('No iframe found - checking for search fallback')
        const searchFallback = await modal.locator('text="Search YouTube"').count() > 0
        if (searchFallback) {
          console.log('Search fallback interface shown')
          videoData.push({
            trackName: `${trackName} - ${artistName}`,
            videoInfo: 'Search Fallback (No embed)'
          })
        }
      }
      
      // Close modal
      const closeButton = modal.locator('button').filter({ hasText: '×' }).first()
      await closeButton.click()
      console.log('Modal closed')
      
      await page.waitForTimeout(1000)
    } else {
      console.log('⚠️ Modal did not open')
      videoData.push({
        trackName: `${trackName} - ${artistName}`,
        videoInfo: null
      })
    }
  }
  
  // Analysis
  console.log('\n\n🔍 ANALYSIS:')
  console.log('Video Data Collected:')
  videoData.forEach((data, index) => {
    console.log(`${index + 1}. ${data.trackName}`)
    console.log(`   → ${data.videoInfo || 'No video'}`)
  })
  
  // Check for duplicates
  const videoInfos = videoData.map(d => d.videoInfo).filter(v => v !== null)
  const uniqueVideos = new Set(videoInfos)
  
  console.log(`\n📊 Duplicate Analysis:`)
  console.log(`Total videos tested: ${videoInfos.length}`)
  console.log(`Unique videos: ${uniqueVideos.size}`)
  
  if (uniqueVideos.size < videoInfos.length) {
    console.log('\n❌ DUPLICATE VIDEOS DETECTED!')
    const counts = new Map<string, number>()
    videoInfos.forEach(v => {
      if (v) counts.set(v, (counts.get(v) || 0) + 1)
    })
    counts.forEach((count, video) => {
      if (count > 1) {
        console.log(`   "${video}" appears ${count} times`)
      }
    })
  } else {
    console.log('\n✅ All videos are unique!')
  }
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/youtube-video-debug.png', fullPage: true })
  
  // Assertion
  expect(uniqueVideos.size).toBe(videoInfos.length) // All videos should be unique
})