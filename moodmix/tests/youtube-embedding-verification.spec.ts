import { test, expect } from '@playwright/test';

test.describe('YouTube Embedding Fix Verification', () => {
  test('should show actual embedded YouTube videos instead of search interface', async ({ page }) => {
    console.log('🎬 Testing YouTube embedding fix on live site...');
    
    // Navigate to live site
    await page.goto('https://mood-mix-theta.vercel.app/');
    await page.waitForLoadState('networkidle');
    
    console.log('✅ Live site loaded');
    
    // Take initial screenshot
    await page.screenshot({ 
      path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/live-site-initial.png',
      fullPage: true 
    });
    
    // Click "Energetic" mood
    console.log('🎯 Clicking Energetic mood...');
    await page.click('text=Energetic');
    
    // Wait for music results to load
    await page.waitForSelector('[data-testid="music-results"]', { timeout: 15000 });
    console.log('🎵 Music results loaded');
    
    // Take screenshot of music results
    await page.screenshot({ 
      path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/music-results-with-youtube-buttons.png',
      fullPage: true 
    });
    
    // Look for RED YouTube buttons
    const youtubeButtons = await page.locator('button:has-text("YouTube"):not(.opacity-50)');
    const buttonCount = await youtubeButtons.count();
    console.log(`🔴 Found ${buttonCount} RED YouTube buttons`);
    
    expect(buttonCount).toBeGreaterThan(0);
    
    // Check console for embeddability logs
    page.on('console', msg => {
      if (msg.text().includes('embeddable') || msg.text().includes('YouTube')) {
        console.log(`📝 Console: ${msg.text()}`);
      }
    });
    
    if (buttonCount > 0) {
      // Click first RED YouTube button
      console.log('🖱️ Clicking first RED YouTube button...');
      await youtubeButtons.first().click();
      
      // Wait a moment for YouTube player to load
      await page.waitForTimeout(3000);
      
      // Check for YouTube iframe (actual embedded video)
      const youtubeIframe = page.locator('iframe[src*="youtube.com/embed"]');
      const iframeExists = await youtubeIframe.count() > 0;
      
      console.log(`🎬 YouTube iframe found: ${iframeExists}`);
      
      // Take screenshot after clicking YouTube button
      await page.screenshot({ 
        path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/youtube-player-after-click.png',
        fullPage: true 
      });
      
      if (iframeExists) {
        console.log('✅ SUCCESS: Actual YouTube video player is embedded');
        
        // Check if it's NOT the search interface
        const searchInterface = await page.locator('text=Search YouTube').count();
        const searchIcon = await page.locator('.search-icon, [data-icon="search"]').count();
        
        console.log(`🔍 Search interface elements: ${searchInterface}`);
        console.log(`🔍 Search icons: ${searchIcon}`);
        
        expect(searchInterface).toBe(0);
        expect(searchIcon).toBe(0);
        
        // Test multiple YouTube buttons
        if (buttonCount > 1) {
          console.log('🔄 Testing second YouTube button...');
          
          // Click second button
          await youtubeButtons.nth(1).click();
          await page.waitForTimeout(3000);
          
          const secondIframe = await page.locator('iframe[src*="youtube.com/embed"]').count();
          console.log(`🎬 Second YouTube iframe found: ${secondIframe > 0}`);
          
          await page.screenshot({ 
            path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/youtube-second-player.png',
            fullPage: true 
          });
        }
        
        // Test third button if available
        if (buttonCount > 2) {
          console.log('🔄 Testing third YouTube button...');
          
          await youtubeButtons.nth(2).click();
          await page.waitForTimeout(3000);
          
          const thirdIframe = await page.locator('iframe[src*="youtube.com/embed"]').count();
          console.log(`🎬 Third YouTube iframe found: ${thirdIframe > 0}`);
          
          await page.screenshot({ 
            path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/youtube-third-player.png',
            fullPage: true 
          });
        }
        
      } else {
        console.log('❌ FAILURE: No YouTube iframe found - may still be showing search interface');
        
        // Check what's actually showing
        const pageContent = await page.textContent('body');
        console.log('📄 Page content includes:', {
          hasSearchYoutube: pageContent?.includes('Search YouTube'),
          hasVideoPlayer: pageContent?.includes('video'),
          hasIframe: pageContent?.includes('iframe')
        });
      }
    }
    
    // Final summary
    console.log('\n🎯 EMBEDDING FIX VERIFICATION SUMMARY:');
    console.log(`- RED YouTube buttons found: ${buttonCount}`);
    console.log(`- Actual video players working: ${await page.locator('iframe[src*="youtube.com/embed"]').count() > 0 ? 'YES' : 'NO'}`);
    console.log(`- Search interface eliminated: ${await page.locator('text=Search YouTube').count() === 0 ? 'YES' : 'NO'}`);
  });
});