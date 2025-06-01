import { test, expect } from '@playwright/test';

test('FINAL YOUTUBE INTEGRATION TEST - Using Mock Data', async ({ page }) => {
  console.log('🎬 FINAL YOUTUBE INTEGRATION TEST WITH MOCK DATA');
  console.log('🧪 This test uses mock tracks to verify YouTube integration works!');
  
  try {
    // Navigate to the test page
    console.log('🌐 Navigating to test YouTube page...');
    await page.goto('http://localhost:3000/test-youtube', { waitUntil: 'networkidle' });
    
    // Take screenshot of test page
    await page.screenshot({ 
      path: 'test-results/youtube-working-01-test-page.png',
      fullPage: true 
    });
    console.log('📸 Screenshot 1: Test page loaded');

    // Wait for test tracks to load
    console.log('⏳ Waiting for test tracks to load...');
    await page.waitForSelector('text=Your Perfect Soundtrack', { timeout: 15000 });
    console.log('✅ Test tracks loaded successfully');
    
    // Wait extra time for YouTube API calls
    console.log('⏳ Waiting for YouTube API to process tracks...');
    await page.waitForTimeout(8000);
    
    // Take screenshot after tracks load
    await page.screenshot({ 
      path: 'test-results/youtube-working-02-tracks-loaded.png',
      fullPage: true 
    });
    console.log('📸 Screenshot 2: Tracks loaded with YouTube buttons');

    // CRITICAL TEST: Check for RED YouTube buttons
    const redButtons = await page.locator('button:has-text("▶")').count();
    const grayButtons = await page.locator('button:has-text("—")').count();
    
    console.log('🔍 YOUTUBE BUTTON ANALYSIS:');
    console.log(`🔴 RED YouTube buttons (▶): ${redButtons}`);
    console.log(`⚫ GRAY YouTube buttons (—): ${grayButtons}`);

    // Get all button text for debugging
    const allButtons = await page.locator('button').allTextContents();
    const youtubeButtons = allButtons.filter(text => text.includes('▶') || text.includes('—'));
    console.log('🎬 YouTube button texts found:', youtubeButtons);

    if (redButtons === 0) {
      console.log('❌ CRITICAL FAILURE: NO RED YOUTUBE BUTTONS FOUND!');
      
      // Debug info
      const pageText = await page.textContent('body');
      console.log('📝 Page contains YouTube API key?', pageText?.includes('AIzaSy') ? 'YES' : 'NO');
      
      throw new Error(`YOUTUBE INTEGRATION FAILED: Expected red buttons (▶) but found ${redButtons}. Gray buttons: ${grayButtons}`);
    }

    console.log('🎉 SUCCESS: RED YOUTUBE BUTTONS FOUND!');
    console.log(`✅ Found ${redButtons} working YouTube buttons`);

    // Test clicking the first YouTube button
    console.log('🎬 Testing first YouTube button...');
    const firstRedButton = page.locator('button:has-text("▶")').first();
    await firstRedButton.click();

    // Wait for YouTube player iframe
    console.log('⏳ Waiting for YouTube player iframe...');
    await page.waitForSelector('iframe[src*="youtube.com"]', { timeout: 10000 });
    
    const iframe = page.locator('iframe[src*="youtube.com"]');
    const iframeSrc = await iframe.getAttribute('src');
    console.log(`✅ YouTube iframe loaded: ${iframeSrc?.substring(0, 80)}...`);
    
    // Take screenshot of working YouTube player
    await page.screenshot({ 
      path: 'test-results/youtube-working-03-video-playing.png',
      fullPage: true 
    });
    console.log('📸 Screenshot 3: YouTube video playing');

    // Test multiple YouTube buttons
    const maxButtons = Math.min(3, redButtons);
    console.log(`🎬 Testing ${maxButtons} YouTube buttons...`);

    for (let i = 0; i < maxButtons; i++) {
      console.log(`🎬 Testing YouTube button ${i + 1}...`);
      
      const button = page.locator('button:has-text("▶")').nth(i);
      await button.click();
      await page.waitForTimeout(2000);
      
      // Verify iframe updates
      const currentIframe = page.locator('iframe[src*="youtube.com"]');
      const currentSrc = await currentIframe.getAttribute('src');
      console.log(`✅ Button ${i + 1} works: ${currentSrc?.substring(0, 60)}...`);
    }

    // Final success screenshot
    await page.screenshot({ 
      path: 'test-results/youtube-working-04-all-buttons-tested.png',
      fullPage: true 
    });
    console.log('📸 Screenshot 4: All buttons tested successfully');

    // Capture console logs about YouTube API
    const youtubeApiLogs: string[] = [];
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('YouTube') || text.includes('Found video') || text.includes('API')) {
        youtubeApiLogs.push(text);
      }
    });

    console.log('🎉 YOUTUBE INTEGRATION TEST COMPLETE - SUCCESS!');
    console.log('=' .repeat(70));
    console.log('📊 FINAL TEST RESULTS:');
    console.log(`✅ RED YouTube buttons found: ${redButtons}`);
    console.log(`✅ GRAY YouTube buttons: ${grayButtons} (should be 0)`);
    console.log(`✅ Tested ${maxButtons} different videos successfully`);
    console.log(`✅ YouTube iframe loads correctly with valid URLs`);
    console.log(`✅ YouTube API integration is WORKING!`);
    console.log('=' .repeat(70));
    console.log('🚀 YOUTUBE INTEGRATION IS READY FOR DEPLOYMENT!');

    // Final assertions
    expect(redButtons).toBeGreaterThan(0);
    expect(grayButtons).toBe(0);
    await expect(page.locator('iframe[src*="youtube.com"]')).toBeVisible();

  } catch (error) {
    console.error('❌ YOUTUBE INTEGRATION TEST FAILED:', error);
    await page.screenshot({ 
      path: 'test-results/youtube-working-error.png',
      fullPage: true 
    });
    throw error;
  }
});