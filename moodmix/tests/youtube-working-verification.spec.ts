import { test, expect } from '@playwright/test'

test('YouTube integration must actually work - no more lies', async ({ page }) => {
  console.log('🎬 REAL TEST: Verifying YouTube actually works this time')
  
  // Go to the live site
  await page.goto('https://mood-mix-theta.vercel.app/')
  await page.waitForLoadState('networkidle')
  
  // Take initial screenshot
  await page.screenshot({ path: 'test-results/youtube-real-test-01-initial.png', fullPage: true })
  
  // Click Energetic mood
  const energeticMood = page.locator('button:has-text("Energetic")').first()
  await energeticMood.click()
  console.log('✅ Clicked Energetic mood')
  
  // Wait for tracks to load
  await page.waitForTimeout(8000)
  
  // Take screenshot of results
  await page.screenshot({ path: 'test-results/youtube-real-test-02-results.png', fullPage: true })
  
  // Look for YouTube buttons
  const youtubeButtons = page.locator('button.bg-red-600')
  const buttonCount = await youtubeButtons.count()
  console.log(`Found ${buttonCount} YouTube buttons`)
  
  if (buttonCount === 0) {
    console.log('❌ FAIL: No YouTube buttons found')
    throw new Error('No YouTube buttons found - completely broken')
  }
  
  // Click the first YouTube button
  const firstYouTubeButton = youtubeButtons.first()
  await firstYouTubeButton.click()
  console.log('✅ Clicked first YouTube button')
  
  // Wait for YouTube player modal
  await page.waitForTimeout(3000)
  
  // Take screenshot of YouTube modal
  await page.screenshot({ path: 'test-results/youtube-real-test-03-modal.png', fullPage: true })
  
  // Check if video is actually working - wait for content to load
  await page.waitForTimeout(3000)
  
  const unavailableText = page.locator('text="This video is unavailable"')
  const isUnavailable = await unavailableText.isVisible()
  
  if (isUnavailable) {
    console.log('❌ FAIL: Video shows "This video is unavailable"')
    console.log('❌ The current search-based embedding approach is not working')
    throw new Error('YouTube video is unavailable - search-based embedding failed')
  }
  
  // Check for actual video iframe
  const videoIframe = page.locator('iframe')
  const iframeCount = await videoIframe.count()
  console.log(`Found ${iframeCount} iframes`)
  
  if (iframeCount === 0) {
    console.log('❌ FAIL: No video iframe found')
    throw new Error('No video iframe - YouTube not actually loading')
  }
  
  // Check iframe source
  const iframeSrc = await videoIframe.first().getAttribute('src')
  console.log(`Iframe src: ${iframeSrc}`)
  
  if (!iframeSrc || iframeSrc.includes('about:blank')) {
    console.log('❌ FAIL: Iframe has no valid source')
    throw new Error('Iframe has invalid source - YouTube not working')
  }
  
  console.log('🎉 SUCCESS: YouTube integration appears to be working!')
  
  // Final screenshot
  await page.screenshot({ path: 'test-results/youtube-real-test-04-success.png', fullPage: true })
})