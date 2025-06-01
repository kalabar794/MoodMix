import { test, expect } from '@playwright/test';

test.describe('YouTube Embeddable Test with Mock Data', () => {
  test('should test YouTube embeddable functionality with mock data', async ({ page }) => {
    // Navigate to the application with debug mode enabled
    await page.goto('http://localhost:3000?debug=true');
    
    console.log('✅ Step 1: Navigated to localhost:3000 with debug mode');
    
    // Take initial screenshot
    await page.screenshot({ 
      path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/youtube-test-step1-home-debug.png',
      fullPage: true 
    });
    
    // Wait for mood cards to load
    await page.waitForSelector('text=Energetic', { timeout: 10000 });
    
    // Click on the Energetic card
    const energeticCard = page.locator('text=Energetic').first();
    await energeticCard.click();
    console.log('✅ Step 2: Clicked on Energetic mood');
    
    // Wait for music results to load (should now use mock data)
    await page.waitForTimeout(5000);
    
    // Take screenshot after clicking mood
    await page.screenshot({ 
      path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/youtube-test-step2-after-mood-click.png',
      fullPage: true 
    });
    
    // Look for music results
    const musicResults = page.locator('.music-results, [data-testid="music-results"]');
    const hasResults = await musicResults.count() > 0;
    console.log(`📝 Music results found: ${hasResults}`);
    
    if (!hasResults) {
      // Check for any error messages
      const bodyText = await page.textContent('body');
      console.log('Page content:', bodyText?.substring(0, 500));
      
      // Try alternative selectors for music content
      const trackElements = await page.locator('[class*="track"], [class*="music"], .song').count();
      console.log(`📝 Found ${trackElements} potential track elements`);
    }
    
    // Look for YouTube buttons (red buttons with play icon)
    const youtubeButtons = page.locator('button.bg-red-600, button[class*="bg-red-600"]');
    const buttonCount = await youtubeButtons.count();
    console.log(`📝 Found ${buttonCount} YouTube buttons (red buttons with play icon)`);
    
    if (buttonCount > 0) {
      console.log('✅ Step 3: YouTube buttons found - testing embeddable functionality');
      
      // Test the first YouTube button
      await youtubeButtons.first().click();
      console.log('✅ Step 4: Clicked on first YouTube button');
      
      // Wait for modal/video player to appear
      await page.waitForTimeout(3000);
      
      // Take screenshot after clicking YouTube button
      await page.screenshot({ 
        path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/youtube-test-step3-youtube-clicked.png',
        fullPage: true 
      });
      
      // Check for modal
      const modal = page.locator('.modal, [role="dialog"], .youtube-modal, .video-modal, [class*="modal"]');
      const modalExists = await modal.count() > 0;
      console.log(`📝 Modal exists: ${modalExists}`);
      
      if (modalExists) {
        // Look for YouTube iframe (embedded video)
        const iframe = page.locator('iframe[src*="youtube.com"], iframe[src*="youtube-nocookie.com"]');
        const iframeCount = await iframe.count();
        console.log(`📝 YouTube iframes found: ${iframeCount}`);
        
        if (iframeCount > 0) {
          const iframeSrc = await iframe.first().getAttribute('src');
          console.log(`📝 YouTube iframe src: ${iframeSrc}`);
          
          // Check if it's an embed URL (not search)
          const isEmbedUrl = iframeSrc?.includes('/embed/') || false;
          const isSearchUrl = iframeSrc?.includes('/results') || iframeSrc?.includes('search_query') || false;
          
          console.log(`📝 Is embed URL: ${isEmbedUrl}`);
          console.log(`📝 Is search URL: ${isSearchUrl}`);
          
          if (isEmbedUrl && !isSearchUrl) {
            console.log('🎉 SUCCESS: Found embedded YouTube video (not search interface)');
            
            // Take final success screenshot
            await page.screenshot({ 
              path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/youtube-test-SUCCESS-embedded-video.png',
              fullPage: true 
            });
            
            expect(true).toBe(true); // Test passes
          } else {
            console.log('❌ ISSUE: YouTube iframe is search interface, not embedded video');
            
            await page.screenshot({ 
              path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/youtube-test-FAIL-search-interface.png',
              fullPage: true 
            });
            
            throw new Error(`Expected embed URL but got: ${iframeSrc}`);
          }
        } else {
          console.log('❌ ISSUE: No YouTube iframe found in modal');
          
          // Log modal content for debugging
          const modalContent = await modal.first().textContent();
          console.log('Modal content:', modalContent);
          
          await page.screenshot({ 
            path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/youtube-test-FAIL-no-iframe.png',
            fullPage: true 
          });
          
          throw new Error('No YouTube iframe found in modal');
        }
        
        // Test multiple YouTube buttons if available
        if (buttonCount > 1) {
          console.log(`✅ Step 5: Testing additional YouTube buttons (${buttonCount - 1} more)`);
          
          // Close current modal first
          const closeButton = page.locator('button').filter({ hasText: /close|×/i }).first();
          if (await closeButton.count() > 0) {
            await closeButton.click();
          } else {
            await page.keyboard.press('Escape');
          }
          
          await page.waitForTimeout(1000);
          
          // Test up to 2 more buttons
          const buttonsToTest = Math.min(buttonCount - 1, 2);
          for (let i = 1; i <= buttonsToTest; i++) {
            console.log(`📝 Testing YouTube button ${i + 1} of ${buttonCount}`);
            
            await youtubeButtons.nth(i).click();
            await page.waitForTimeout(2000);
            
            // Check for iframe
            const iframe = page.locator('iframe[src*="youtube.com"], iframe[src*="youtube-nocookie.com"]');
            const iframeCount = await iframe.count();
            
            if (iframeCount > 0) {
              const iframeSrc = await iframe.first().getAttribute('src');
              const isEmbedUrl = iframeSrc?.includes('/embed/') || false;
              
              console.log(`📝 Button ${i + 1}: ${isEmbedUrl ? '✅ Embeddable' : '❌ Not embeddable'} - ${iframeSrc}`);
            } else {
              console.log(`📝 Button ${i + 1}: ❌ No iframe found`);
            }
            
            // Close modal
            const closeButton = page.locator('button').filter({ hasText: /close|×/i }).first();
            if (await closeButton.count() > 0) {
              await closeButton.click();
            } else {
              await page.keyboard.press('Escape');
            }
            
            await page.waitForTimeout(1000);
          }
        }
      } else {
        console.log('❌ ISSUE: No modal opened when clicking YouTube button');
        
        await page.screenshot({ 
          path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/youtube-test-FAIL-no-modal.png',
          fullPage: true 
        });
        
        throw new Error('No modal opened when clicking YouTube button');
      }
    } else {
      console.log('❌ ISSUE: No YouTube buttons found even with mock data');
      
      // Show page content for debugging
      const bodyText = await page.textContent('body');
      console.log('Full page content:', bodyText);
      
      await page.screenshot({ 
        path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/youtube-test-FAIL-no-buttons.png',
        fullPage: true 
      });
      
      throw new Error('No YouTube buttons found even with mock data');
    }
    
    // Final screenshot
    await page.screenshot({ 
      path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/youtube-test-final.png',
      fullPage: true 
    });
    
    console.log('✅ YouTube embeddable test complete');
  });
});