import { test, expect } from '@playwright/test';

test.describe('Live YouTube Integration State Check', () => {
  test('Check current state of YouTube integration on live site', async ({ page }) => {
    console.log('🔍 Starting comprehensive YouTube integration check on live site...');
    
    // Navigate to live site
    await page.goto('https://mood-mix-theta.vercel.app/');
    await page.waitForLoadState('networkidle');
    
    // Take initial screenshot
    await page.screenshot({ 
      path: 'test-results/live-site-initial.png', 
      fullPage: true 
    });
    console.log('📸 Initial site screenshot taken');
    
    // Check for any JavaScript errors in console
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
        console.log('❌ Console error:', msg.text());
      }
    });
    
    // Wait for mood wheel to load
    await page.waitForSelector('[data-testid="mood-wheel"]', { timeout: 10000 });
    console.log('✅ Mood wheel loaded');
    
    // Select "Energetic" mood
    console.log('🎯 Selecting Energetic mood...');
    const energeticMood = page.locator('[data-mood="energetic"]').first();
    await energeticMood.click();
    
    // Wait for music results to load
    console.log('⏳ Waiting for music results...');
    await page.waitForSelector('[data-testid="music-results"]', { timeout: 15000 });
    await page.waitForTimeout(3000); // Additional wait for all elements to render
    
    // Take screenshot after mood selection
    await page.screenshot({ 
      path: 'test-results/live-site-after-mood-selection.png', 
      fullPage: true 
    });
    console.log('📸 Screenshot after mood selection taken');
    
    // Check for YouTube-related elements
    console.log('🔍 Checking for YouTube elements...');
    
    // Look for YouTube buttons
    const youtubeButtons = await page.locator('button:has-text("YouTube"), button:has-text("Watch"), [data-testid*="youtube"], .youtube-button').count();
    console.log(`🎬 YouTube buttons found: ${youtubeButtons}`);
    
    // Look for red YouTube icons/buttons
    const redYouTubeElements = await page.locator('button[style*="red"], .youtube-red, [class*="youtube"][class*="red"]').count();
    console.log(`🔴 Red YouTube elements found: ${redYouTubeElements}`);
    
    // Check for any YouTube-related text
    const youtubeText = await page.locator('text=/youtube/i').count();
    console.log(`📝 Elements containing "YouTube" text: ${youtubeText}`);
    
    // Check for video/iframe elements
    const iframes = await page.locator('iframe').count();
    const videos = await page.locator('video').count();
    console.log(`🖼️ iframes found: ${iframes}`);
    console.log(`🎥 video elements found: ${videos}`);
    
    // Look specifically in music results area
    const musicResults = page.locator('[data-testid="music-results"]');
    const musicResultsHTML = await musicResults.innerHTML();
    console.log('🎵 Music results HTML structure preview:', musicResultsHTML.substring(0, 500) + '...');
    
    // Check for Spotify elements for comparison
    const spotifyButtons = await page.locator('button:has-text("Play"), [data-testid*="spotify"], .spotify-button').count();
    console.log(`🎵 Spotify-related buttons found: ${spotifyButtons}`);
    
    // Look for any play buttons
    const playButtons = await page.locator('button:has-text("Play"), button[aria-label*="play"]').count();
    console.log(`▶️ Play buttons found: ${playButtons}`);
    
    // Check for any hidden YouTube elements
    const hiddenYouTubeElements = await page.locator('[style*="display: none"]:has-text("youtube"), .hidden:has-text("youtube")').count();
    console.log(`👻 Hidden YouTube elements: ${hiddenYouTubeElements}`);
    
    // Take a focused screenshot of the music results area
    if (await musicResults.isVisible()) {
      await musicResults.screenshot({ 
        path: 'test-results/live-site-music-results-focus.png' 
      });
      console.log('📸 Focused music results screenshot taken');
    }
    
    // Try selecting another mood to see if YouTube elements appear
    console.log('🎯 Trying another mood (Happy)...');
    const happyMood = page.locator('[data-mood="happy"]').first();
    if (await happyMood.isVisible()) {
      await happyMood.click();
      await page.waitForTimeout(3000);
      
      // Check again for YouTube elements
      const youtubeButtonsAfterHappy = await page.locator('button:has-text("YouTube"), button:has-text("Watch")').count();
      console.log(`🎬 YouTube buttons after Happy mood: ${youtubeButtonsAfterHappy}`);
      
      await page.screenshot({ 
        path: 'test-results/live-site-happy-mood.png', 
        fullPage: true 
      });
    }
    
    // Final summary
    console.log('\n📊 FINAL SUMMARY:');
    console.log(`❌ Console errors: ${errors.length}`);
    if (errors.length > 0) {
      console.log('Errors:', errors);
    }
    console.log(`🎬 YouTube buttons: ${youtubeButtons}`);
    console.log(`🔴 Red YouTube elements: ${redYouTubeElements}`);
    console.log(`📝 YouTube text elements: ${youtubeText}`);
    console.log(`🖼️ iframes: ${iframes}`);
    console.log(`🎥 video elements: ${videos}`);
    console.log(`🎵 Spotify buttons: ${spotifyButtons}`);
    console.log(`▶️ Total play buttons: ${playButtons}`);
    
    // The test passes regardless - we're just gathering info
    expect(true).toBe(true);
  });
  
  test('Test YouTube element interactions if they exist', async ({ page }) => {
    console.log('🔍 Testing YouTube element interactions...');
    
    await page.goto('https://mood-mix-theta.vercel.app/');
    await page.waitForLoadState('networkidle');
    
    // Wait for mood wheel and select mood
    await page.waitForSelector('[data-testid="mood-wheel"]', { timeout: 10000 });
    const energeticMood = page.locator('[data-mood="energetic"]').first();
    await energeticMood.click();
    await page.waitForSelector('[data-testid="music-results"]', { timeout: 15000 });
    await page.waitForTimeout(3000);
    
    // Look for any clickable YouTube elements
    const youtubeElements = page.locator('button:has-text("YouTube"), button:has-text("Watch"), [data-testid*="youtube"]');
    const count = await youtubeElements.count();
    
    if (count > 0) {
      console.log(`🎬 Found ${count} YouTube elements, testing interactions...`);
      
      for (let i = 0; i < count; i++) {
        const element = youtubeElements.nth(i);
        const text = await element.textContent();
        console.log(`🖱️ Clicking YouTube element ${i + 1}: "${text}"`);
        
        try {
          await element.click();
          await page.waitForTimeout(2000);
          
          // Check if anything changed
          await page.screenshot({ 
            path: `test-results/youtube-click-${i + 1}.png`, 
            fullPage: true 
          });
          
        } catch (error) {
          console.log(`❌ Error clicking element ${i + 1}:`, error);
        }
      }
    } else {
      console.log('❌ No YouTube elements found to test interactions');
    }
  });
});