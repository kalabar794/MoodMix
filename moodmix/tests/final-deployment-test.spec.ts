import { test, expect } from '@playwright/test';

test.describe('Final Deployment Verification', () => {
  test('should verify mood wheel fix works on live deployment', async ({ page }) => {
    const apiCalls: any[] = [];
    
    // Monitor API calls
    page.on('request', request => {
      if (request.url().includes('/api/mood-to-music')) {
        apiCalls.push({
          url: request.url(),
          method: request.method(),
          postData: request.postData()
        });
        console.log(`✅ API Request made: ${request.method()} ${request.url()}`);
      }
    });

    page.on('response', response => {
      if (response.url().includes('/api/mood-to-music')) {
        console.log(`✅ API Response: ${response.status()} ${response.url()}`);
      }
    });

    // Navigate to live site
    await page.goto('https://mood-mix-theta.vercel.app');
    await page.waitForLoadState('networkidle');

    // Verify initial state
    const moodSelectionTitle = page.locator('text="How are you feeling?"');
    await expect(moodSelectionTitle).toBeVisible();
    console.log('✅ Initial mood selection page loaded');

    // Take before screenshot
    await page.screenshot({ path: 'test-results/final-before-click.png', fullPage: true });

    // Find and click mood wheel
    const clickableWheel = page.locator('.rounded-full.cursor-pointer.overflow-hidden').first();
    await expect(clickableWheel).toBeVisible();
    
    // Click mood wheel
    await clickableWheel.click();
    console.log('✅ Clicked mood wheel');

    // Wait for API call and response
    await page.waitForTimeout(8000);

    // Take after screenshot
    await page.screenshot({ path: 'test-results/final-after-click.png', fullPage: true });

    // Verify API call was made
    expect(apiCalls.length).toBeGreaterThan(0);
    console.log(`✅ ${apiCalls.length} API calls made successfully`);

    if (apiCalls.length > 0) {
      const moodData = JSON.parse(apiCalls[0].postData || '{}');
      console.log(`✅ Mood data: ${moodData.primary} at ${moodData.intensity}% intensity`);
    }

    // Check if view transitioned to results
    const resultsViewElements = [
      page.locator('text="Current Mood"').first(),
      page.locator('text="Change Mood"'),
      page.locator('text="Tracks Found"')
    ];

    let resultsViewVisible = false;
    for (const element of resultsViewElements) {
      if (await element.isVisible()) {
        resultsViewVisible = true;
        break;
      }
    }

    expect(resultsViewVisible).toBeTruthy();
    console.log('✅ Successfully transitioned to results view');

    // Check for music tracks or loading state
    const hasLoadingState = await page.locator('text="Discovering Your Music"').isVisible();
    const hasMusicResults = await page.locator('.track-card-premium').count() > 0;
    const hasNoTracksMessage = await page.locator('text="No Tracks Found"').isVisible();

    console.log('Loading state:', hasLoadingState);
    console.log('Music results:', hasMusicResults);
    console.log('No tracks message:', hasNoTracksMessage);

    // Verify we get some kind of results (either tracks or appropriate error/empty state)
    expect(hasMusicResults || hasNoTracksMessage).toBeTruthy();

    if (hasMusicResults) {
      console.log('✅ Music tracks loaded successfully');
      
      // Test preview functionality
      const playButtons = page.locator('button:has-text("Preview"), .play-button, [aria-label*="play"]');
      const playButtonCount = await playButtons.count();
      console.log(`Found ${playButtonCount} play buttons`);
      
      if (playButtonCount > 0) {
        await playButtons.first().click();
        await page.waitForTimeout(2000);
        console.log('✅ Preview button clicked');
      }
    } else {
      console.log('ℹ️ No music tracks loaded (possibly due to API or auth issues)');
    }
  });

  test('should verify mood wheel responsiveness and interaction', async ({ page }) => {
    await page.goto('https://mood-mix-theta.vercel.app');
    await page.waitForLoadState('networkidle');

    // Test multiple click positions on mood wheel
    const clickableWheel = page.locator('.rounded-full.cursor-pointer.overflow-hidden').first();
    await expect(clickableWheel).toBeVisible();
    
    const wheelBox = await clickableWheel.boundingBox();
    if (wheelBox) {
      // Test different positions to ensure all moods are selectable
      const positions = [
        { x: wheelBox.width * 0.8, y: wheelBox.height * 0.5 }, // Right (Happy)
        { x: wheelBox.width * 0.5, y: wheelBox.height * 0.2 }, // Top
        { x: wheelBox.width * 0.2, y: wheelBox.height * 0.5 }, // Left
        { x: wheelBox.width * 0.5, y: wheelBox.height * 0.8 }, // Bottom
      ];

      for (let i = 0; i < positions.length; i++) {
        const position = positions[i];
        
        // Go back to mood selection if needed
        const changeMoodButton = page.locator('text="Change Mood"');
        if (await changeMoodButton.isVisible()) {
          await changeMoodButton.click();
          await page.waitForTimeout(1000);
        }

        // Click at specific position
        await clickableWheel.click({ position });
        await page.waitForTimeout(2000);
        
        await page.screenshot({ path: `test-results/mood-test-position-${i}.png`, fullPage: true });
        
        // Verify some response occurred
        const hasResponse = await page.locator('text="Current Mood", text="Change Mood"').first().isVisible();
        expect(hasResponse).toBeTruthy();
        
        console.log(`✅ Position ${i} click successful`);
      }
    }
  });
});