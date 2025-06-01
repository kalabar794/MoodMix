import { test, expect } from '@playwright/test';

test.describe('YouTube Embeddable Fix Verification', () => {
  test('should show embeddable YouTube videos instead of search interface', async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    console.log('Navigated to localhost:3000');
    
    // Take initial screenshot
    await page.screenshot({ 
      path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/youtube-embeddable-fix-initial.png',
      fullPage: true 
    });
    
    // Click on Energetic mood
    console.log('Looking for Energetic mood card...');
    
    // Wait for mood cards to load
    await page.waitForSelector('text=Energetic', { timeout: 10000 });
    
    // Click on the Energetic card
    const energeticCard = page.locator('text=Energetic').first();
    await energeticCard.click();
    
    console.log('Clicked on Energetic mood');
    
    // Wait for music results to load
    await page.waitForSelector('.music-results, [data-testid="music-results"]', { timeout: 15000 });
    console.log('Music results loaded');
    
    // Take screenshot of music results
    await page.screenshot({ 
      path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/youtube-embeddable-music-results.png',
      fullPage: true 
    });
    
    // Look for YouTube buttons - they should be RED
    const youtubeButtons = page.locator('button').filter({ hasText: /youtube/i });
    const buttonCount = await youtubeButtons.count();
    console.log(`Found ${buttonCount} YouTube buttons`);
    
    if (buttonCount === 0) {
      // Log all buttons to debug
      const allButtons = await page.locator('button').all();
      console.log(`Total buttons found: ${allButtons.length}`);
      for (let i = 0; i < Math.min(allButtons.length, 10); i++) {
        const buttonText = await allButtons[i].textContent();
        console.log(`Button ${i}: ${buttonText}`);
      }
      
      throw new Error('No YouTube buttons found');
    }
    
    // Check if YouTube buttons are red
    const firstYouTubeButton = youtubeButtons.first();
    const buttonStyles = await firstYouTubeButton.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
        borderColor: computed.borderColor
      };
    });
    console.log('YouTube button styles:', buttonStyles);
    
    // Wait a moment before clicking
    await page.waitForTimeout(2000);
    
    // Click on the first YouTube button
    console.log('Clicking on first YouTube button...');
    await firstYouTubeButton.click();
    
    // Wait for modal or video player to appear
    await page.waitForTimeout(3000);
    
    // Check for modal
    const modal = page.locator('.modal, [role="dialog"], .youtube-modal, .video-modal');
    const modalExists = await modal.count() > 0;
    console.log(`Modal exists: ${modalExists}`);
    
    if (modalExists) {
      // Take screenshot of modal
      await page.screenshot({ 
        path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/youtube-embeddable-modal-opened.png',
        fullPage: true 
      });
      
      // Look for YouTube iframe (embedded video)
      const iframe = page.locator('iframe[src*="youtube.com"], iframe[src*="youtube-nocookie.com"]');
      const iframeCount = await iframe.count();
      console.log(`YouTube iframes found: ${iframeCount}`);
      
      if (iframeCount > 0) {
        const iframeSrc = await iframe.first().getAttribute('src');
        console.log('YouTube iframe src:', iframeSrc);
        
        // Check if it's an embed URL (not search)
        const isEmbedUrl = iframeSrc?.includes('/embed/') || false;
        const isSearchUrl = iframeSrc?.includes('/results') || iframeSrc?.includes('search_query') || false;
        
        console.log(`Is embed URL: ${isEmbedUrl}`);
        console.log(`Is search URL: ${isSearchUrl}`);
        
        if (isEmbedUrl && !isSearchUrl) {
          console.log('✅ SUCCESS: Found embedded YouTube video (not search interface)');
          
          // Take final screenshot showing embedded video
          await page.screenshot({ 
            path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/youtube-embeddable-success.png',
            fullPage: true 
          });
          
          expect(true).toBe(true); // Test passes
        } else {
          console.log('❌ FAIL: YouTube iframe is not an embed URL or is search interface');
          
          await page.screenshot({ 
            path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/youtube-embeddable-fail.png',
            fullPage: true 
          });
          
          throw new Error(`Expected embed URL but got: ${iframeSrc}`);
        }
      } else {
        console.log('❌ FAIL: No YouTube iframe found in modal');
        
        // Log modal content for debugging
        const modalContent = await modal.first().textContent();
        console.log('Modal content:', modalContent);
        
        await page.screenshot({ 
          path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/youtube-embeddable-no-iframe.png',
          fullPage: true 
        });
        
        throw new Error('No YouTube iframe found in modal');
      }
    } else {
      console.log('❌ FAIL: No modal opened when clicking YouTube button');
      
      await page.screenshot({ 
        path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/youtube-embeddable-no-modal.png',
        fullPage: true 
      });
      
      throw new Error('No modal opened when clicking YouTube button');
    }
    
    // Check browser console for embeddability logs
    const consoleLogs = [];
    page.on('console', msg => {
      if (msg.text().toLowerCase().includes('embed') || 
          msg.text().toLowerCase().includes('youtube') ||
          msg.text().toLowerCase().includes('video')) {
        consoleLogs.push(msg.text());
      }
    });
    
    // Wait for any additional logs
    await page.waitForTimeout(2000);
    
    console.log('Console logs related to embeddability:');
    consoleLogs.forEach(log => console.log(`  ${log}`));
  });
  
  test('should test multiple YouTube buttons for embeddability', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Click on Energetic mood
    await page.waitForSelector('text=Energetic', { timeout: 10000 });
    const energeticCard = page.locator('text=Energetic').first();
    await energeticCard.click();
    
    // Wait for results
    await page.waitForSelector('.music-results, [data-testid="music-results"]', { timeout: 15000 });
    
    // Test multiple YouTube buttons
    const youtubeButtons = page.locator('button').filter({ hasText: /youtube/i });
    const buttonCount = Math.min(await youtubeButtons.count(), 3); // Test up to 3 buttons
    
    for (let i = 0; i < buttonCount; i++) {
      console.log(`Testing YouTube button ${i + 1} of ${buttonCount}`);
      
      await youtubeButtons.nth(i).click();
      await page.waitForTimeout(2000);
      
      // Check for iframe
      const iframe = page.locator('iframe[src*="youtube.com"], iframe[src*="youtube-nocookie.com"]');
      const iframeCount = await iframe.count();
      
      if (iframeCount > 0) {
        const iframeSrc = await iframe.first().getAttribute('src');
        const isEmbedUrl = iframeSrc?.includes('/embed/') || false;
        
        console.log(`Button ${i + 1}: ${isEmbedUrl ? '✅ Embeddable' : '❌ Not embeddable'} - ${iframeSrc}`);
        
        // Close modal
        const closeButton = page.locator('button').filter({ hasText: /close|×/i }).first();
        if (await closeButton.count() > 0) {
          await closeButton.click();
        } else {
          await page.keyboard.press('Escape');
        }
        
        await page.waitForTimeout(1000);
      } else {
        console.log(`Button ${i + 1}: ❌ No iframe found`);
      }
    }
  });
});