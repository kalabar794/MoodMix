import { test, expect } from '@playwright/test';

test('Manual YouTube verification - check red buttons and functionality', async ({ page }) => {
  console.log('🎬 MANUAL YOUTUBE VERIFICATION TEST');
  
  try {
    // Navigate to the app (assuming it's already running)
    console.log('🌐 Navigating to localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    // Take screenshot of initial page
    await page.screenshot({ 
      path: 'test-results/manual-01-initial-page.png',
      fullPage: true 
    });
    console.log('📸 Initial page screenshot taken');

    // Wait for and click mood wheel
    await page.waitForSelector('[data-testid="mood-wheel"]', { timeout: 15000 });
    console.log('✅ Mood wheel found');

    // Click Energetic mood
    console.log('🎯 Clicking Energetic mood...');
    await page.click('text=Energetic');
    
    // Wait for music results
    console.log('⏳ Waiting for music results...');
    await page.waitForSelector('[data-testid="music-results"]', { timeout: 30000 });
    
    // Wait extra time for API calls
    await page.waitForTimeout(5000);
    
    // Take screenshot of results
    await page.screenshot({ 
      path: 'test-results/manual-02-music-results.png',
      fullPage: true 
    });
    console.log('📸 Music results screenshot taken');

    // Check YouTube buttons
    const allButtons = await page.locator('button').count();
    console.log(`🔍 Total buttons found: ${allButtons}`);
    
    const redButtons = await page.locator('button:has-text("▶")').count();
    console.log(`🔴 Red YouTube buttons (▶): ${redButtons}`);
    
    const grayButtons = await page.locator('button:has-text("—")').count();
    console.log(`⚫ Gray YouTube buttons (—): ${grayButtons}`);

    // List all button texts
    const buttonTexts = await page.locator('button').allTextContents();
    console.log('📝 All button texts:', buttonTexts.filter(text => text.includes('▶') || text.includes('—')));

    if (redButtons > 0) {
      console.log('🎉 SUCCESS: Found red YouTube buttons!');
      
      // Try clicking the first red button
      console.log('🎬 Clicking first red YouTube button...');
      await page.locator('button:has-text("▶")').first().click();
      
      // Wait for iframe
      await page.waitForTimeout(3000);
      
      // Check for YouTube iframe
      const iframes = await page.locator('iframe').count();
      const youtubeIframes = await page.locator('iframe[src*="youtube"]').count();
      
      console.log(`📺 Total iframes: ${iframes}`);
      console.log(`🎬 YouTube iframes: ${youtubeIframes}`);
      
      if (youtubeIframes > 0) {
        const iframeSrc = await page.locator('iframe[src*="youtube"]').first().getAttribute('src');
        console.log(`✅ YouTube iframe found with src: ${iframeSrc}`);
      }
      
      // Final screenshot
      await page.screenshot({ 
        path: 'test-results/manual-03-youtube-player.png',
        fullPage: true 
      });
      console.log('📸 YouTube player screenshot taken');
      
    } else {
      console.log('❌ NO RED BUTTONS FOUND!');
      console.log('🔍 Debug info:');
      
      // Debug: Check API responses
      const responses = [];
      page.on('response', response => {
        if (response.url().includes('api')) {
          responses.push(`${response.status()} ${response.url()}`);
        }
      });
      
      console.log('🌐 API responses:', responses);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
    await page.screenshot({ 
      path: 'test-results/manual-error.png',
      fullPage: true 
    });
    throw error;
  }
});