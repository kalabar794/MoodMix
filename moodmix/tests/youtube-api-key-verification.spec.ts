import { test, expect } from '@playwright/test';

test.describe('YouTube Integration with API Key - Local Development', () => {
  test('Complete YouTube integration flow verification', async ({ page }) => {
    // Set up console logging to capture YouTube-related messages
    const consoleMessages: string[] = [];
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('YouTube') || text.includes('youtube') || text.includes('API') || text.includes('key')) {
        consoleMessages.push(`${msg.type()}: ${text}`);
      }
    });

    // Navigate to local development server
    await page.goto('http://localhost:3000');
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Step 1: Take screenshot of initial state
    await page.screenshot({ 
      path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/youtube-api-initial-state.png',
      fullPage: true 
    });
    console.log('✓ Initial state screenshot taken');

    // Step 2: Verify page loaded properly
    await expect(page.locator('h1').first()).toContainText('MoodMix');
    console.log('✓ Page loaded with MoodMix title');

    // Step 3: Click on "Energetic" mood
    const energeticMood = page.locator('[data-testid="mood-energetic"], button:has-text("Energetic"), .mood-card:has-text("Energetic")').first();
    await expect(energeticMood).toBeVisible({ timeout: 10000 });
    await energeticMood.click();
    console.log('✓ Clicked on Energetic mood');

    // Step 4: Wait for music results to load
    console.log('Waiting for music results to load (up to 10 seconds)...');
    
    // Wait for either success or error state
    await Promise.race([
      page.waitForSelector('.music-result, [data-testid="music-result"]', { timeout: 10000 }),
      page.waitForSelector('.error, [data-testid="error"]', { timeout: 10000 }),
      page.waitForTimeout(10000)
    ]);

    // Additional wait to ensure all results are loaded
    await page.waitForTimeout(3000);

    // Step 5: Look for YouTube buttons and check their state
    const youtubeButtons = page.locator('button:has-text("▶"), button:has-text("Play"), .youtube-button, [data-testid="youtube-button"]');
    const youtubeButtonCount = await youtubeButtons.count();
    
    console.log(`Found ${youtubeButtonCount} YouTube buttons`);

    // Check if buttons are red (not gray or disabled)
    let redButtonCount = 0;
    let grayButtonCount = 0;
    
    for (let i = 0; i < youtubeButtonCount; i++) {
      const button = youtubeButtons.nth(i);
      const buttonText = await button.textContent();
      const buttonColor = await button.evaluate(el => getComputedStyle(el).color);
      const buttonBackground = await button.evaluate(el => getComputedStyle(el).backgroundColor);
      const isDisabled = await button.isDisabled();
      
      console.log(`Button ${i + 1}: "${buttonText}" - Color: ${buttonColor}, Background: ${buttonBackground}, Disabled: ${isDisabled}`);
      
      if (buttonText === '▶' || buttonText?.includes('Play')) {
        redButtonCount++;
      } else if (buttonText === '—' || buttonText === '-' || isDisabled) {
        grayButtonCount++;
      }
    }

    // Step 6: Take screenshot of music results
    await page.screenshot({ 
      path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/youtube-api-music-results.png',
      fullPage: true 
    });
    console.log('✓ Music results screenshot taken');

    // Report button status
    console.log(`\n📊 YOUTUBE BUTTON ANALYSIS:`);
    console.log(`Red/Active buttons (▶): ${redButtonCount}`);
    console.log(`Gray/Disabled buttons (—): ${grayButtonCount}`);
    console.log(`Total buttons found: ${youtubeButtonCount}`);

    // Step 7: Try to click on a red YouTube button if available
    if (redButtonCount > 0) {
      console.log('\n🎬 Testing YouTube video playback...');
      
      const activeButton = page.locator('button:has-text("▶")').first();
      await activeButton.click();
      console.log('✓ Clicked on YouTube button');

      // Wait for YouTube player to appear
      await page.waitForTimeout(3000);
      
      // Check for YouTube player or iframe
      const youtubePlayer = page.locator('iframe[src*="youtube"], iframe[src*="embed"], .youtube-player, [data-testid="youtube-player"]');
      const playerVisible = await youtubePlayer.isVisible().catch(() => false);
      
      if (playerVisible) {
        console.log('✅ YouTube player opened successfully!');
        
        // Take screenshot of YouTube player
        await page.screenshot({ 
          path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/youtube-api-player-opened.png',
          fullPage: true 
        });
        
        // Get the video URL if possible
        const videoSrc = await youtubePlayer.getAttribute('src').catch(() => 'Not available');
        console.log(`Video URL: ${videoSrc}`);
        
      } else {
        console.log('❌ YouTube player did not open');
        
        // Check for any error messages
        const errorElement = page.locator('.error, [data-testid="error"]');
        if (await errorElement.isVisible()) {
          const errorText = await errorElement.textContent();
          console.log(`Error message: ${errorText}`);
        }
      }
    } else {
      console.log('❌ No active YouTube buttons found - API key may not be working');
    }

    // Step 8: Check console messages
    console.log('\n📝 CONSOLE MESSAGES:');
    if (consoleMessages.length > 0) {
      consoleMessages.forEach(msg => console.log(msg));
    } else {
      console.log('No YouTube/API related console messages found');
    }

    // Step 9: Check network requests for YouTube API calls
    const responses = [];
    page.on('response', response => {
      if (response.url().includes('youtube') || response.url().includes('googleapis')) {
        responses.push(`${response.status()} ${response.url()}`);
      }
    });

    // Wait a bit more to catch any async API calls
    await page.waitForTimeout(2000);

    console.log('\n🌐 YOUTUBE API NETWORK REQUESTS:');
    if (responses.length > 0) {
      responses.forEach(resp => console.log(resp));
    } else {
      console.log('No YouTube API network requests detected');
    }

    // Final assessment
    console.log('\n🎯 FINAL ASSESSMENT:');
    if (redButtonCount > 0) {
      console.log('✅ SUCCESS: YouTube buttons are active (red ▶ buttons found)');
    } else if (grayButtonCount > 0) {
      console.log('❌ ISSUE: Only gray/disabled buttons found - API key may not be configured');
    } else {
      console.log('❌ ISSUE: No YouTube buttons found at all');
    }

    // Assertions for test pass/fail
    expect(youtubeButtonCount).toBeGreaterThan(0);
    expect(redButtonCount).toBeGreaterThan(0);
  });
});