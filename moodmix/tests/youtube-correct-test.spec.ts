import { test, expect } from '@playwright/test';

test('YouTube Integration - Correct Text Detection', async ({ page }) => {
  console.log('🎬 YOUTUBE INTEGRATION TEST WITH CORRECT TEXT DETECTION');
  
  try {
    // Navigate to the app
    console.log('🌐 Navigating to localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    // Take screenshot of initial mood selection page
    await page.screenshot({ 
      path: 'test-results/correct-01-initial-mood-page.png',
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
    
    // Wait for loading state first
    console.log('⏳ Waiting for loading state...');
    await page.waitForSelector('text=Discovering Your Music', { timeout: 10000 });
    console.log('✅ Loading state visible');
    
    // Wait for music results header
    console.log('⏳ Waiting for music results header...');
    await page.waitForSelector('text=Your Perfect Soundtrack', { timeout: 60000 });
    console.log('✅ Music results loaded');
    
    // Wait additional time for YouTube API calls to complete
    console.log('⏳ Waiting for YouTube API calls to complete...');
    await page.waitForTimeout(5000);
    
    // Take screenshot of music results
    await page.screenshot({ 
      path: 'test-results/correct-02-music-results.png',
      fullPage: true 
    });
    console.log('📸 Screenshot 2: Music results taken');

    // CRITICAL CHECK: Look for RED YouTube buttons (▶) vs gray (—)
    const redButtons = await page.locator('button:has-text("▶")').count();
    const grayButtons = await page.locator('button:has-text("—")').count();
    
    console.log('🔍 CRITICAL ANALYSIS:');
    console.log(`🔴 RED YouTube buttons (▶): ${redButtons}`);
    console.log(`⚫ GRAY YouTube buttons (—): ${grayButtons}`);

    // Get all button text for debugging
    const allButtons = await page.locator('button').allTextContents();
    const youtubeButtons = allButtons.filter(text => text.includes('▶') || text.includes('—'));
    console.log('🎬 YouTube button texts:', youtubeButtons);

    if (redButtons === 0) {
      console.log('❌ FAILURE: NO RED YOUTUBE BUTTONS FOUND!');
      
      // Debug: check if any YouTube related elements exist
      const allYouTubeElements = await page.locator('*').evaluateAll(elements => {
        return elements.filter(el => 
          el.textContent?.includes('YouTube') || 
          el.textContent?.includes('▶') || 
          el.textContent?.includes('—')
        ).map(el => el.tagName + ': ' + el.textContent?.substring(0, 50));
      });
      console.log('🔍 All YouTube-related elements:', allYouTubeElements);
      
      throw new Error(`Expected red YouTube buttons (▶) but found ${redButtons}. Gray buttons: ${grayButtons}`);
    }

    console.log('🎉 SUCCESS: RED YOUTUBE BUTTONS FOUND!');

    // Click the first red YouTube button
    console.log('🎬 Clicking first RED YouTube button...');
    const firstRedButton = page.locator('button:has-text("▶")').first();
    await firstRedButton.click();

    // Wait for YouTube player to appear
    console.log('⏳ Waiting for YouTube player iframe...');
    await page.waitForSelector('iframe[src*="youtube.com"]', { timeout: 15000 });
    
    // Take screenshot of YouTube player
    await page.screenshot({ 
      path: 'test-results/correct-03-youtube-player.png',
      fullPage: true 
    });
    console.log('📸 Screenshot 3: YouTube player taken');

    // Verify the iframe
    const iframe = page.locator('iframe[src*="youtube.com"]');
    const iframeSrc = await iframe.getAttribute('src');
    console.log(`✅ YouTube iframe source: ${iframeSrc}`);

    // Test multiple buttons
    const maxButtons = Math.min(3, redButtons);
    console.log(`🎬 Testing ${maxButtons} YouTube buttons...`);

    for (let i = 0; i < maxButtons; i++) {
      console.log(`🎬 Testing button ${i + 1}...`);
      const button = page.locator('button:has-text("▶")').nth(i);
      await button.click();
      await page.waitForTimeout(2000);
      
      const currentIframe = page.locator('iframe[src*="youtube.com"]');
      const currentSrc = await currentIframe.getAttribute('src');
      console.log(`✅ Button ${i + 1} works: ${currentSrc?.substring(0, 60)}...`);
    }

    // Final screenshot
    await page.screenshot({ 
      path: 'test-results/correct-04-final-test.png',
      fullPage: true 
    });
    console.log('📸 Screenshot 4: Final test completed');

    console.log('🎉 YOUTUBE INTEGRATION SUCCESS!');
    console.log('=' .repeat(50));
    console.log(`✅ RED YouTube buttons: ${redButtons}`);
    console.log(`✅ GRAY YouTube buttons: ${grayButtons} (should be 0)`);
    console.log(`✅ Tested ${maxButtons} videos successfully`);
    console.log('=' .repeat(50));

    // Final assertions
    expect(redButtons).toBeGreaterThan(0);
    expect(grayButtons).toBe(0);
    await expect(page.locator('iframe[src*="youtube.com"]')).toBeVisible();

    console.log('🚀 READY FOR VERCEL DEPLOYMENT!');

  } catch (error) {
    console.error('❌ TEST FAILED:', error);
    await page.screenshot({ 
      path: 'test-results/correct-error.png',
      fullPage: true 
    });
    throw error;
  }
});