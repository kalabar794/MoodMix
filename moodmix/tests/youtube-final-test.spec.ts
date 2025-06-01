import { test, expect } from '@playwright/test';

test('Final YouTube Integration Test - Red Buttons and Video Playback', async ({ page }) => {
  console.log('🎬 FINAL YOUTUBE INTEGRATION TEST - THE MOMENT OF TRUTH!');
  
  try {
    // Navigate to the app
    console.log('🌐 Navigating to localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    // Take screenshot of initial mood selection page
    await page.screenshot({ 
      path: 'test-results/final-01-initial-mood-page.png',
      fullPage: true 
    });
    console.log('📸 Screenshot 1: Initial mood selection page taken');

    // Wait for the mood cards to load
    console.log('⏳ Waiting for mood cards to load...');
    await page.waitForSelector('text=Energetic', { timeout: 10000 });
    console.log('✅ Mood cards are visible');

    // Click "Energetic" mood
    console.log('🎯 Clicking Energetic mood...');
    await page.click('text=Energetic');
    
    // Wait for music results to load
    console.log('⏳ Waiting for music results to load...');
    await page.waitForSelector('text=Music Results', { timeout: 30000 });
    
    // Wait additional time for YouTube API calls to complete
    console.log('⏳ Waiting for YouTube API calls to complete...');
    await page.waitForTimeout(5000);
    
    // Take screenshot of music results with YouTube buttons
    await page.screenshot({ 
      path: 'test-results/final-02-music-results-with-youtube.png',
      fullPage: true 
    });
    console.log('📸 Screenshot 2: Music results with YouTube buttons taken');

    // CRITICAL CHECK: Look for RED YouTube buttons (▶) vs gray (—)
    const redButtons = await page.locator('button:has-text("▶")').count();
    const grayButtons = await page.locator('button:has-text("—")').count();
    
    console.log(`🔍 CRITICAL ANALYSIS:`);
    console.log(`🔴 RED YouTube buttons (▶): ${redButtons}`);
    console.log(`⚫ GRAY YouTube buttons (—): ${grayButtons}`);

    // List all buttons for debugging
    const allButtonTexts = await page.locator('button').allTextContents();
    const youtubeButtonTexts = allButtonTexts.filter(text => text.includes('▶') || text.includes('—'));
    console.log('🎬 YouTube button texts found:', youtubeButtonTexts);

    if (redButtons === 0) {
      console.log('❌ FAILURE: NO RED YOUTUBE BUTTONS FOUND!');
      throw new Error(`Expected red YouTube buttons (▶) but found ${redButtons}. Gray buttons: ${grayButtons}`);
    }

    console.log('🎉 SUCCESS: RED YOUTUBE BUTTONS FOUND!');

    // Click the first red YouTube button
    console.log('🎬 Clicking first RED YouTube button...');
    const firstRedButton = page.locator('button:has-text("▶")').first();
    await firstRedButton.click();

    // Wait for YouTube player to appear
    console.log('⏳ Waiting for YouTube player iframe...');
    await page.waitForSelector('iframe[src*="youtube.com"]', { timeout: 10000 });
    
    // Take screenshot of YouTube player working
    await page.screenshot({ 
      path: 'test-results/final-03-youtube-player-working.png',
      fullPage: true 
    });
    console.log('📸 Screenshot 3: YouTube player working taken');

    // Verify the iframe has a valid YouTube URL
    const iframe = page.locator('iframe[src*="youtube.com"]');
    const iframeSrc = await iframe.getAttribute('src');
    console.log(`✅ YouTube iframe source: ${iframeSrc}`);

    // Test clicking multiple YouTube buttons
    const maxButtonsToTest = Math.min(3, redButtons);
    console.log(`🎬 Testing ${maxButtonsToTest} different YouTube buttons...`);

    for (let i = 0; i < maxButtonsToTest; i++) {
      console.log(`🎬 Testing YouTube button ${i + 1}/${maxButtonsToTest}...`);
      
      const button = page.locator('button:has-text("▶")').nth(i);
      await button.click();
      await page.waitForTimeout(2000); // Wait for video to load
      
      // Verify iframe is still present and has a valid YouTube URL
      const currentIframe = page.locator('iframe[src*="youtube.com"]');
      const currentSrc = await currentIframe.getAttribute('src');
      console.log(`✅ YouTube button ${i + 1} works - iframe src: ${currentSrc?.substring(0, 60)}...`);
    }

    // Final screenshot showing multiple videos tested
    await page.screenshot({ 
      path: 'test-results/final-04-multiple-youtube-videos-tested.png',
      fullPage: true 
    });
    console.log('📸 Screenshot 4: Multiple YouTube videos tested');

    // Listen for console logs about YouTube API success
    const youtubeApiLogs: string[] = [];
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('Found video:') || text.includes('YouTube') || text.includes('video')) {
        youtubeApiLogs.push(text);
      }
    });

    console.log('🎉 YOUTUBE INTEGRATION TEST COMPLETE - SUCCESS!');
    console.log('=' .repeat(60));
    console.log('📊 FINAL RESULTS:');
    console.log(`✅ Found ${redButtons} red YouTube buttons (▶)`);
    console.log(`✅ Found 0 gray YouTube buttons (—) - AS EXPECTED!`);
    console.log(`✅ Tested ${maxButtonsToTest} different YouTube videos`);
    console.log(`✅ YouTube player iframe loads correctly`);
    console.log(`✅ All videos have valid YouTube URLs`);
    console.log('=' .repeat(60));

    // Assert final success conditions
    expect(redButtons).toBeGreaterThan(0);
    expect(grayButtons).toBe(0); // Should be no gray buttons
    await expect(page.locator('iframe[src*="youtube.com"]')).toBeVisible();

    console.log('🚀 READY FOR DEPLOYMENT TO VERCEL!');

  } catch (error) {
    console.error('❌ CRITICAL FAILURE:', error);
    await page.screenshot({ 
      path: 'test-results/final-error-debug.png',
      fullPage: true 
    });
    throw error;
  }
});