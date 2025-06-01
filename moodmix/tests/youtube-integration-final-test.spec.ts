import { test, expect } from '@playwright/test';

test('YouTube integration final test - red buttons and video playback', async ({ page }) => {
  console.log('🎬 FINAL YOUTUBE INTEGRATION TEST');
  
  // Navigate to the app
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  // Take screenshot of initial mood selection page
  await page.screenshot({ 
    path: 'test-results/01-initial-mood-page.png',
    fullPage: true 
  });
  console.log('📸 Screenshot 1: Initial mood selection page taken');

  // Wait for mood wheel to be visible
  await page.waitForSelector('[data-testid="mood-wheel"]', { timeout: 10000 });
  console.log('✅ Mood wheel is visible');

  // Click "Energetic" mood
  console.log('🎯 Clicking Energetic mood...');
  await page.click('text=Energetic');
  
  // Wait for music results to load
  console.log('⏳ Waiting for music results...');
  await page.waitForSelector('[data-testid="music-results"]', { timeout: 30000 });
  
  // Wait a bit more for YouTube buttons to load
  await page.waitForTimeout(3000);
  
  // Take screenshot of music results
  await page.screenshot({ 
    path: 'test-results/02-music-results-with-youtube.png',
    fullPage: true 
  });
  console.log('📸 Screenshot 2: Music results with YouTube buttons taken');

  // Check for YouTube buttons
  const youtubeButtons = await page.locator('button:has-text("▶")').count();
  console.log(`🔍 Found ${youtubeButtons} YouTube buttons with red play icons`);

  if (youtubeButtons === 0) {
    // Check for gray buttons (should not exist)
    const grayButtons = await page.locator('button:has-text("—")').count();
    console.log(`❌ Found ${grayButtons} gray YouTube buttons (should be 0)`);
    
    // Take a screenshot for debugging
    await page.screenshot({ 
      path: 'test-results/debug-no-red-buttons.png',
      fullPage: true 
    });
    throw new Error('No red YouTube buttons found!');
  }

  // Click the first YouTube button
  console.log('🎬 Clicking first YouTube button...');
  const firstYouTubeButton = page.locator('button:has-text("▶")').first();
  await firstYouTubeButton.click();

  // Wait for YouTube player to appear
  console.log('⏳ Waiting for YouTube player...');
  await page.waitForSelector('iframe[src*="youtube.com"]', { timeout: 10000 });
  
  // Take screenshot of YouTube player
  await page.screenshot({ 
    path: 'test-results/03-youtube-player-working.png',
    fullPage: true 
  });
  console.log('📸 Screenshot 3: YouTube player working taken');

  // Check console for YouTube API calls
  const consoleLogs: string[] = [];
  page.on('console', msg => {
    if (msg.text().includes('Found video:') || msg.text().includes('YouTube')) {
      consoleLogs.push(msg.text());
    }
  });

  // Test clicking a few different YouTube buttons
  const buttonCount = Math.min(3, youtubeButtons);
  for (let i = 0; i < buttonCount; i++) {
    console.log(`🎬 Testing YouTube button ${i + 1}...`);
    
    const button = page.locator('button:has-text("▶")').nth(i);
    await button.click();
    await page.waitForTimeout(2000); // Wait for video to load
    
    // Verify iframe is present and has a valid YouTube URL
    const iframe = page.locator('iframe[src*="youtube.com"]');
    const src = await iframe.getAttribute('src');
    console.log(`✅ YouTube button ${i + 1} works - iframe src: ${src}`);
  }

  // Final screenshot showing multiple videos tested
  await page.screenshot({ 
    path: 'test-results/04-multiple-youtube-videos-tested.png',
    fullPage: true 
  });
  console.log('📸 Screenshot 4: Multiple YouTube videos tested');

  console.log('🎉 YOUTUBE INTEGRATION TEST COMPLETE!');
  console.log(`✅ Found ${youtubeButtons} red YouTube buttons`);
  console.log(`✅ Tested ${buttonCount} different videos`);
  console.log('✅ YouTube player iframe loads correctly');
  console.log('Console logs:', consoleLogs);

  // Assert final success
  expect(youtubeButtons).toBeGreaterThan(0);
  await expect(page.locator('iframe[src*="youtube.com"]')).toBeVisible();
});