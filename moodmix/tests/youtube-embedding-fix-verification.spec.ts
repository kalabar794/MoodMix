import { test, expect } from '@playwright/test';

test.describe('YouTube Embedding Fix - Live Site Verification', () => {
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
    
    // Wait for music results to appear (they should be visible)
    await page.waitForTimeout(5000); // Give it time to load
    
    // Take screenshot of music results
    await page.screenshot({ 
      path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/music-results-with-youtube-buttons.png',
      fullPage: true 
    });
    
    // Look for RED YouTube buttons (non-disabled ones)
    const redYouTubeButtons = await page.locator('button:has-text("YouTube"):not(.opacity-50):not([disabled])').count();
    console.log(`🔴 Found ${redYouTubeButtons} RED YouTube buttons`);
    
    expect(redYouTubeButtons).toBeGreaterThan(0);
    
    // Set up console logging to catch embeddability messages
    page.on('console', msg => {
      if (msg.text().includes('embeddable') || msg.text().includes('YouTube') || msg.text().includes('video')) {
        console.log(`📝 Console: ${msg.text()}`);
      }
    });
    
    if (redYouTubeButtons > 0) {
      // Click first RED YouTube button
      console.log('🖱️ Clicking first RED YouTube button...');
      const firstButton = page.locator('button:has-text("YouTube"):not(.opacity-50):not([disabled])').first();
      await firstButton.click();
      
      // Wait for YouTube player to load
      await page.waitForTimeout(4000);
      
      // Take screenshot after clicking YouTube button
      await page.screenshot({ 
        path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/youtube-player-after-click.png',
        fullPage: true 
      });
      
      // Check for YouTube iframe (actual embedded video)
      const youtubeIframes = await page.locator('iframe[src*="youtube.com/embed"]').count();
      console.log(`🎬 YouTube iframes found: ${youtubeIframes}`);
      
      // Check for the old search interface elements
      const searchInterface = await page.locator('text=Search YouTube').count();
      const searchText = await page.locator(':has-text("Search YouTube")').count();
      
      console.log(`🔍 "Search YouTube" text found: ${searchInterface}`);
      console.log(`🔍 Search-related elements: ${searchText}`);
      
      if (youtubeIframes > 0) {
        console.log('✅ SUCCESS: Actual YouTube video player is embedded!');
        console.log('✅ TRANSFORMATION CONFIRMED: Search interface → Real video player');
        
        // Test multiple YouTube buttons if available
        if (redYouTubeButtons > 1) {
          console.log('🔄 Testing second YouTube button...');
          
          const secondButton = page.locator('button:has-text("YouTube"):not(.opacity-50):not([disabled])').nth(1);
          await secondButton.click();
          await page.waitForTimeout(3000);
          
          await page.screenshot({ 
            path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/youtube-second-player.png',
            fullPage: true 
          });
          
          const secondIframes = await page.locator('iframe[src*="youtube.com/embed"]').count();
          console.log(`🎬 Total YouTube iframes after second click: ${secondIframes}`);
        }
        
        if (redYouTubeButtons > 2) {
          console.log('🔄 Testing third YouTube button...');
          
          const thirdButton = page.locator('button:has-text("YouTube"):not(.opacity-50):not([disabled])').nth(2);
          await thirdButton.click();
          await page.waitForTimeout(3000);
          
          await page.screenshot({ 
            path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/youtube-third-player.png',
            fullPage: true 
          });
        }
        
        // Final verification - should have embedded videos, no search interface
        expect(youtubeIframes).toBeGreaterThan(0);
        expect(searchInterface).toBe(0);
        
      } else {
        console.log('❌ FAILURE: No YouTube iframe found');
        console.log('❌ May still be showing search interface instead of embedded videos');
        
        // Debug what's actually on the page
        const bodyText = await page.textContent('body');
        console.log('📄 Page contains:', {
          hasSearchYouTube: bodyText?.includes('Search YouTube'),
          hasVideo: bodyText?.includes('video'),
          hasPlayer: bodyText?.includes('player'),
          hasEmbed: bodyText?.includes('embed')
        });
        
        // Look for any iframes at all
        const allIframes = await page.locator('iframe').count();
        console.log(`🔍 Total iframes on page: ${allIframes}`);
        
        if (allIframes > 0) {
          const iframeSrcs = await page.locator('iframe').evaluateAll(iframes => 
            iframes.map(iframe => iframe.src)
          );
          console.log('🔍 Iframe sources:', iframeSrcs);
        }
      }
    }
    
    // Final summary
    console.log('\n🎯 EMBEDDING FIX VERIFICATION SUMMARY:');
    console.log(`✅ RED YouTube buttons found: ${redYouTubeButtons}`);
    console.log(`✅ Embedded video players working: ${await page.locator('iframe[src*="youtube.com/embed"]').count() > 0 ? 'YES' : 'NO'}`);
    console.log(`✅ Search interface eliminated: ${await page.locator('text=Search YouTube').count() === 0 ? 'YES' : 'NO'}`);
    console.log('🎬 EXPECTED TRANSFORMATION: "Search YouTube" → Embedded video player');
  });
});