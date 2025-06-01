import { test, expect } from '@playwright/test';

test.describe('YouTube Embeddable Manual Verification', () => {
  test('manual verification of YouTube embeddable fix', async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:3000');
    
    // Take initial screenshot
    await page.screenshot({ 
      path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/manual-verification-step1-home.png',
      fullPage: true 
    });
    
    console.log('✅ Step 1: Navigated to localhost:3000');
    
    // Wait and look for mood cards
    await page.waitForTimeout(3000);
    
    // Try to click on Energetic mood if it exists
    const energeticText = page.locator('text=Energetic');
    if (await energeticText.count() > 0) {
      await energeticText.first().click();
      console.log('✅ Step 2: Clicked on Energetic mood');
      
      // Wait for results
      await page.waitForTimeout(5000);
      
      // Take screenshot after clicking mood
      await page.screenshot({ 
        path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/manual-verification-step2-after-click.png',
        fullPage: true 
      });
      
      // Look for any error messages or content
      const bodyText = await page.textContent('body');
      console.log('Current page content includes:', bodyText?.substring(0, 200) + '...');
      
      // Look for YouTube buttons
      const youtubeButtons = page.locator('button').filter({ hasText: /youtube/i });
      const buttonCount = await youtubeButtons.count();
      console.log(`📝 Found ${buttonCount} YouTube buttons`);
      
      if (buttonCount > 0) {
        // Test clicking the first YouTube button
        await youtubeButtons.first().click();
        console.log('✅ Step 3: Clicked on first YouTube button');
        
        await page.waitForTimeout(3000);
        
        // Take screenshot after clicking YouTube button
        await page.screenshot({ 
          path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/manual-verification-step3-youtube-clicked.png',
          fullPage: true 
        });
        
        // Check for iframe
        const iframe = page.locator('iframe[src*="youtube"]');
        const iframeCount = await iframe.count();
        console.log(`📝 Found ${iframeCount} YouTube iframes`);
        
        if (iframeCount > 0) {
          const iframeSrc = await iframe.first().getAttribute('src');
          console.log(`📝 YouTube iframe src: ${iframeSrc}`);
          
          const isEmbedUrl = iframeSrc?.includes('/embed/') || false;
          const isSearchUrl = iframeSrc?.includes('/results') || iframeSrc?.includes('search_query') || false;
          
          if (isEmbedUrl && !isSearchUrl) {
            console.log('🎉 SUCCESS: Found embedded YouTube video (not search interface)');
          } else {
            console.log('❌ ISSUE: YouTube iframe is search interface, not embedded video');
          }
        } else {
          console.log('📝 No YouTube iframe found');
        }
      } else {
        console.log('📝 No YouTube buttons found - checking for error messages');
        
        // Look for specific error indicators
        const errorText = page.locator('text=Network error');
        const noTracksText = page.locator('text=No Tracks Found');
        
        if (await errorText.count() > 0) {
          console.log('❌ Network error detected');
        }
        if (await noTracksText.count() > 0) {
          console.log('❌ No tracks found error detected');
        }
      }
    } else {
      console.log('❌ Could not find Energetic mood card');
      
      // Show what's actually on the page
      const allText = await page.textContent('body');
      console.log('Page contains:', allText?.substring(0, 500) + '...');
    }
    
    // Final screenshot
    await page.screenshot({ 
      path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/manual-verification-final.png',
      fullPage: true 
    });
    
    console.log('✅ Manual verification complete - check screenshots in test-results/');
  });
});