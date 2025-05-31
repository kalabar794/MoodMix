import { test, expect } from '@playwright/test';

test.describe('Audio Preview Functionality Debug', () => {
  test('comprehensive audio preview testing and debugging', async ({ page }) => {
    // Enable console logging to capture errors
    const consoleMessages: string[] = [];
    const consoleErrors: string[] = [];
    
    page.on('console', msg => {
      const text = `[${msg.type()}] ${msg.text()}`;
      consoleMessages.push(text);
      if (msg.type() === 'error') {
        consoleErrors.push(text);
      }
    });

    // Navigate to the live site
    console.log('🌐 Navigating to live site...');
    await page.goto('https://mood-mix-theta.vercel.app');
    await page.waitForLoadState('networkidle');

    // Take initial screenshot
    await page.screenshot({ path: 'test-results/preview-debug-initial.png', fullPage: true });

    // Wait for mood cards to load - looking for actual card structure
    console.log('🎯 Waiting for mood cards to load...');
    await page.waitForSelector('text=Euphoric', { timeout: 10000 });
    
    // Select a mood (let's try "Energetic" which I can see in the screenshot)
    console.log('⚡ Selecting Energetic mood...');
    const energeticCard = page.locator('text=Energetic').first();
    await expect(energeticCard).toBeVisible();
    await energeticCard.click();

    // Wait for music results to load - look for any music-related content
    console.log('🎵 Waiting for music results...');
    try {
      // Try multiple selectors to find music results
      await Promise.race([
        page.waitForSelector('[data-testid="track-item"]', { timeout: 15000 }),
        page.waitForSelector('.track-card', { timeout: 15000 }),
        page.waitForSelector('button:has-text("Preview")', { timeout: 15000 }),
        page.waitForSelector('img[alt*="album"]', { timeout: 15000 }),
        page.waitForSelector('h3', { timeout: 15000 }) // Track titles
      ]);
    } catch (e) {
      console.log('⚠️ No specific music elements found, taking screenshot to inspect...');
    }
    
    await page.waitForTimeout(3000); // Allow time for results to fully render

    // Take screenshot of results
    await page.screenshot({ path: 'test-results/preview-debug-results.png', fullPage: true });

    // Check for preview buttons with multiple possible selectors
    console.log('🔍 Inspecting preview buttons...');
    const previewButtons = page.locator('button:has-text("Preview")');
    const playButtons = page.locator('button:has-text("Play")');
    const allMusicButtons = page.locator('button').filter({ hasText: /preview|play|pause|▶|⏸/i });
    
    const previewButtonCount = await previewButtons.count();
    const playButtonCount = await playButtons.count();
    const allMusicButtonCount = await allMusicButtons.count();
    
    console.log(`Found ${previewButtonCount} "Preview" buttons`);
    console.log(`Found ${playButtonCount} "Play" buttons`);
    console.log(`Found ${allMusicButtonCount} total music-related buttons`);

    if (previewButtonCount === 0 && playButtonCount === 0) {
      console.log('❌ No preview/play buttons found!');
      // Look for any buttons at all
      const allButtons = page.locator('button');
      const allButtonsCount = await allButtons.count();
      console.log(`Found ${allButtonsCount} total buttons on page`);
      
      for (let i = 0; i < Math.min(allButtonsCount, 5); i++) {
        const buttonText = await allButtons.nth(i).textContent();
        const buttonClass = await allButtons.nth(i).getAttribute('class');
        console.log(`Button ${i}: "${buttonText}" (class: ${buttonClass})`);
      }
    }

    // Test first preview/play button if available
    const testButtons = previewButtonCount > 0 ? previewButtons : playButtons;
    const testButtonCount = previewButtonCount > 0 ? previewButtonCount : playButtonCount;
    
    if (testButtonCount > 0) {
      console.log('🎧 Testing first preview/play button...');
      const firstTestButton = testButtons.first();
      
      // Get button details before clicking
      const buttonText = await firstTestButton.textContent();
      const isEnabled = await firstTestButton.isEnabled();
      const isVisible = await firstTestButton.isVisible();
      
      console.log(`Button text: "${buttonText}"`);
      console.log(`Button enabled: ${isEnabled}`);
      console.log(`Button visible: ${isVisible}`);

      // Check parent track item for preview URL
      const trackItem = firstTestButton.locator('xpath=ancestor::div[contains(@class, "track") or contains(@class, "card") or contains(@class, "item")]');
      const trackData = await trackItem.getAttribute('data-preview-url');
      console.log(`Track preview URL: ${trackData}`);

      // Click the preview/play button
      await firstTestButton.click();
      await page.waitForTimeout(1000);

      // Check if button text changed (playing state)
      const newButtonText = await firstTestButton.textContent();
      console.log(`Button text after click: "${newButtonText}"`);

      // Check for audio elements
      const audioElements = page.locator('audio');
      const audioCount = await audioElements.count();
      console.log(`Audio elements found: ${audioCount}`);

      if (audioCount > 0) {
        for (let i = 0; i < audioCount; i++) {
          const audio = audioElements.nth(i);
          const src = await audio.getAttribute('src');
          const paused = await audio.evaluate((el: HTMLAudioElement) => el.paused);
          const currentTime = await audio.evaluate((el: HTMLAudioElement) => el.currentTime);
          const duration = await audio.evaluate((el: HTMLAudioElement) => el.duration);
          
          console.log(`Audio ${i}: src="${src}", paused=${paused}, currentTime=${currentTime}, duration=${duration}`);
        }
      }

      // Test multiple preview/play buttons
      console.log('🎵 Testing multiple preview/play buttons...');
      for (let i = 0; i < Math.min(testButtonCount, 3); i++) {
        const button = testButtons.nth(i);
        const trackItem = button.locator('xpath=ancestor::div[contains(@class, "track") or contains(@class, "card") or contains(@class, "item")]');
        
        // Get track info - try multiple selectors
        let trackName = 'Unknown';
        let artistName = 'Unknown';
        
        try {
          trackName = await trackItem.locator('h3, h2, h4, .track-title, .song-title').first().textContent() || 'Unknown';
        } catch (e) {}
        
        try {
          artistName = await trackItem.locator('p, .artist, .track-artist').first().textContent() || 'Unknown';
        } catch (e) {}
        
        console.log(`\n--- Testing track ${i + 1}: "${trackName}" by ${artistName} ---`);
        
        // Click preview/play
        await button.click();
        await page.waitForTimeout(500);
        
        const buttonTextAfter = await button.textContent();
        console.log(`Button text after click: "${buttonTextAfter}"`);
        
        // Check for new audio elements
        const newAudioCount = await page.locator('audio').count();
        console.log(`Total audio elements after click: ${newAudioCount}`);
      }
    }

    // Check network requests for preview URLs
    console.log('🌐 Checking network activity...');
    const responses = await page.context().newPage();
    await responses.close();

    // Inspect the actual HTML structure of music results
    console.log('🔧 Inspecting HTML structure...');
    
    // Try multiple selectors for track items
    let trackItems = page.locator('[data-testid="track-item"]');
    let trackCount = await trackItems.count();
    
    if (trackCount === 0) {
      trackItems = page.locator('.track-card, .song-card, .music-item, div:has(img[alt*="album"]), div:has(button:text-matches("Preview|Play", "i"))');
      trackCount = await trackItems.count();
    }
    
    console.log(`Total track items: ${trackCount}`);

    if (trackCount > 0) {
      // Get HTML of first track item
      const firstTrack = trackItems.first();
      const trackHTML = await firstTrack.innerHTML();
      console.log('First track HTML structure:');
      console.log(trackHTML.substring(0, 1000) + (trackHTML.length > 1000 ? '...' : ''));
    } else {
      // If no track items found, show general page structure
      console.log('No track items found, showing page structure...');
      const bodyHTML = await page.locator('body').innerHTML();
      console.log('Page body structure (first 1500 chars):');
      console.log(bodyHTML.substring(0, 1500) + '...');
    }

    // Final screenshot
    await page.screenshot({ path: 'test-results/preview-debug-final.png', fullPage: true });

    // Log all console messages
    console.log('\n📋 All console messages:');
    consoleMessages.forEach(msg => console.log(msg));

    if (consoleErrors.length > 0) {
      console.log('\n❌ Console errors found:');
      consoleErrors.forEach(error => console.log(error));
    }

    // Check if any Spotify preview URLs are present in the page
    console.log('\n🔍 Checking for Spotify preview URLs in page content...');
    const pageContent = await page.content();
    const spotifyPreviewRegex = /https:\/\/p\.scdn\.co\/mp3-preview\/[a-f0-9]+/g;
    const spotifyMatches = pageContent.match(spotifyPreviewRegex);
    
    if (spotifyMatches) {
      console.log(`Found ${spotifyMatches.length} Spotify preview URLs:`);
      spotifyMatches.slice(0, 3).forEach((url, i) => {
        console.log(`${i + 1}: ${url}`);
      });
    } else {
      console.log('No Spotify preview URLs found in page content');
    }

    // Create a summary report
    const report = {
      previewButtonsFound: previewButtonCount,
      audioElementsFound: await page.locator('audio').count(),
      consoleErrors: consoleErrors.length,
      spotifyPreviewUrls: spotifyMatches ? spotifyMatches.length : 0,
      trackItemsFound: trackCount
    };

    console.log('\n📊 Debug Summary:');
    console.log(JSON.stringify(report, null, 2));

    // Assertions for validation
    expect(trackCount).toBeGreaterThan(0);
    // Note: We're not asserting preview functionality works yet, just gathering data
  });

  test('test preview functionality with specific mood selections', async ({ page }) => {
    console.log('🧪 Testing preview with different moods...');
    
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(`[${msg.type()}] ${msg.text()}`);
      }
    });

    await page.goto('https://mood-mix-theta.vercel.app');
    await page.waitForLoadState('networkidle');

    // Test different moods available on the live site
    const moodsToTest = ['Energetic', 'Melancholic', 'Serene', 'Passionate'];
    
    for (const mood of moodsToTest) {
      console.log(`\n🎭 Testing ${mood} mood...`);
      
      // Select mood
      const moodCard = page.locator(`text=${mood}`).first();
      if (await moodCard.count() > 0) {
        await moodCard.click();
        
        // Wait for music results with flexible selectors
        try {
          await Promise.race([
            page.waitForSelector('[data-testid="track-item"]', { timeout: 10000 }),
            page.waitForSelector('.track-card', { timeout: 10000 }),
            page.waitForSelector('button:has-text("Preview")', { timeout: 10000 }),
            page.waitForSelector('h3', { timeout: 10000 })
          ]);
        } catch (e) {
          console.log(`No music results found for ${mood}`);
        }
        await page.waitForTimeout(1000);

        // Check for preview buttons
        const previewButtons = page.locator('button:has-text("Preview")');
        const buttonCount = await previewButtons.count();
        console.log(`${mood}: Found ${buttonCount} preview buttons`);

        if (buttonCount > 0) {
          // Test first preview button
          const firstButton = previewButtons.first();
          await firstButton.click();
          await page.waitForTimeout(500);
          
          const buttonText = await firstButton.textContent();
          console.log(`${mood}: Button text after click: "${buttonText}"`);
          
          const audioCount = await page.locator('audio').count();
          console.log(`${mood}: Audio elements: ${audioCount}`);
        }

        // Take screenshot for this mood
        await page.screenshot({ 
          path: `test-results/preview-debug-${mood.toLowerCase()}.png`, 
          fullPage: true 
        });
      } else {
        console.log(`❌ ${mood} mood card not found`);
      }
    }

    console.log('\n❌ Console errors across all moods:');
    consoleErrors.forEach(error => console.log(error));
  });
});