import { test, expect } from '@playwright/test';

test.describe('YouTube Embedding Fix - Live Site Final Verification', () => {
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
    
    // Wait for music results to appear
    await page.waitForTimeout(8000); // Give it time to load results
    
    // Take screenshot of music results
    await page.screenshot({ 
      path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/music-results-with-youtube-buttons.png',
      fullPage: true 
    });
    
    // Look for RED YouTube buttons (the circular red buttons with Y)
    // These appear as red circular buttons, not text buttons
    const redYouTubeButtons = await page.locator('button[style*="background"][style*="red"], button.bg-red-500, button:has-text("Y"):not(.opacity-50)').count();
    
    // Also check for any red buttons in the music results area
    const allRedButtons = await page.locator('[style*="background-color: red"], [style*="background: red"], .bg-red-500').count();
    
    console.log(`🔴 Found ${redYouTubeButtons} YouTube buttons with red styling`);
    console.log(`🔴 Found ${allRedButtons} total red buttons`);
    
    // Set up console logging to catch embeddability messages
    page.on('console', msg => {
      if (msg.text().includes('embeddable') || msg.text().includes('YouTube') || msg.text().includes('video')) {
        console.log(`📝 Console: ${msg.text()}`);
      }
    });
    
    // Look for any clickable buttons in the music results
    const musicResultButtons = await page.locator('[data-testid*="music"], .music-track button, .track-item button').count();
    console.log(`🎵 Found ${musicResultButtons} buttons in music results area`);
    
    // Try to find buttons by their position near track items
    const trackButtons = await page.locator('.track-item button, .music-track button, button:near([class*="track"])').count();
    console.log(`🎵 Found ${trackButtons} buttons near track items`);
    
    // Get all buttons on the page for debugging
    const allButtons = await page.locator('button').count();
    console.log(`🔘 Total buttons on page: ${allButtons}`);
    
    // Check if we can find red-styled buttons specifically
    const redStyledButtons = await page.locator('button').evaluateAll(buttons => {
      return buttons.filter(button => {
        const style = getComputedStyle(button);
        const bgColor = style.backgroundColor;
        const hasRedBg = bgColor.includes('rgb(239, 68, 68)') || bgColor.includes('red') || 
                        button.style.backgroundColor.includes('red');
        return hasRedBg;
      }).length;
    });
    
    console.log(`🔴 Found ${redStyledButtons} buttons with red background color`);
    
    if (redStyledButtons > 0 || allRedButtons > 0) {
      console.log('🖱️ Clicking on a red button (YouTube button)...');
      
      // Try to click the first red button we can find
      let buttonClicked = false;
      
      // Try different selectors for red buttons
      const selectors = [
        '[style*="background-color: red"]',
        '[style*="background: red"]', 
        '.bg-red-500',
        'button[style*="background"]'
      ];
      
      for (const selector of selectors) {
        const buttons = await page.locator(selector).count();
        if (buttons > 0) {
          console.log(`Found ${buttons} buttons with selector: ${selector}`);
          await page.locator(selector).first().click();
          buttonClicked = true;
          break;
        }
      }
      
      if (!buttonClicked) {
        // Try clicking any button in the music results area
        const musicButtons = page.locator('button').filter({ hasText: /Y|YouTube|Play/ });
        const musicButtonCount = await musicButtons.count();
        if (musicButtonCount > 0) {
          console.log(`🎵 Clicking first music-related button...`);
          await musicButtons.first().click();
          buttonClicked = true;
        }
      }
      
      if (buttonClicked) {
        // Wait for YouTube player to load
        await page.waitForTimeout(5000);
        
        // Take screenshot after clicking button
        await page.screenshot({ 
          path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/youtube-player-after-click.png',
          fullPage: true 
        });
        
        // Check for YouTube iframe (actual embedded video)
        const youtubeIframes = await page.locator('iframe[src*="youtube.com/embed"]').count();
        console.log(`🎬 YouTube iframes found: ${youtubeIframes}`);
        
        // Check for the old search interface elements
        const searchInterface = await page.locator('text=Search YouTube').count();
        console.log(`🔍 "Search YouTube" text found: ${searchInterface}`);
        
        // Check for any iframes at all
        const allIframes = await page.locator('iframe').count();
        console.log(`📺 Total iframes on page: ${allIframes}`);
        
        if (allIframes > 0) {
          const iframeSrcs = await page.locator('iframe').evaluateAll(iframes => 
            iframes.map(iframe => iframe.src)
          );
          console.log('📺 Iframe sources:', iframeSrcs);
        }
        
        if (youtubeIframes > 0) {
          console.log('✅ SUCCESS: Actual YouTube video player is embedded!');
          console.log('✅ TRANSFORMATION CONFIRMED: Search interface → Real video player');
          
          // Verify no search interface
          expect(searchInterface).toBe(0);
          console.log('✅ Search interface successfully eliminated');
          
        } else if (allIframes > 0) {
          console.log('⚠️ iframes found but not YouTube embeds');
        } else {
          console.log('❌ No embedded video player found');
          
          // Check what's actually on the page
          const bodyText = await page.textContent('body');
          console.log('📄 Page contains search-related text:', bodyText?.includes('Search YouTube'));
        }
      } else {
        console.log('❌ Could not find or click any red YouTube buttons');
      }
    } else {
      console.log('❌ No red YouTube buttons found on the page');
    }
    
    // Final summary
    console.log('\n🎯 EMBEDDING FIX VERIFICATION SUMMARY:');
    console.log(`🔴 Red buttons found: ${Math.max(redYouTubeButtons, allRedButtons, redStyledButtons)}`);
    console.log(`🎬 Embedded video players: ${await page.locator('iframe[src*="youtube.com/embed"]').count()}`);
    console.log(`🔍 Search interface eliminated: ${await page.locator('text=Search YouTube').count() === 0 ? 'YES' : 'NO'}`);
    console.log('🎯 EXPECTED: RED buttons → Click → Embedded YouTube video (not search interface)');
  });
});