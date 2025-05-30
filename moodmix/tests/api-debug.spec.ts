import { test, expect } from '@playwright/test';

test.describe('API and Data Flow Debugging', () => {
  test('should test mood-to-music API directly', async ({ request }) => {
    // Test the API endpoint directly
    const response = await request.post('https://mood-mix-theta.vercel.app/api/mood-to-music', {
      data: {
        primary: 'happy',
        intensity: 75,
        color: '#FFE055',
        coordinates: { x: 100, y: 100 }
      }
    });

    const data = await response.json();
    console.log('API Response Status:', response.status());
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    expect(response.status()).toBe(200);
    expect(data.success).toBeTruthy();
    expect(data.tracks).toBeDefined();
    expect(Array.isArray(data.tracks)).toBeTruthy();
  });

  test('should monitor network requests during mood selection', async ({ page }) => {
    const apiCalls: any[] = [];
    
    // Monitor all network requests
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        apiCalls.push({
          url: request.url(),
          method: request.method(),
          postData: request.postData()
        });
        console.log(`API Request: ${request.method()} ${request.url()}`);
      }
    });

    page.on('response', response => {
      if (response.url().includes('/api/')) {
        console.log(`API Response: ${response.status()} ${response.url()}`);
      }
    });

    // Navigate to site
    await page.goto('https://mood-mix-theta.vercel.app');
    await page.waitForLoadState('networkidle');

    // Find and click mood wheel
    const clickableWheel = page.locator('.rounded-full.cursor-pointer.overflow-hidden').first();
    await expect(clickableWheel).toBeVisible();
    
    // Click to select mood
    await clickableWheel.click();
    
    // Wait for potential API calls
    await page.waitForTimeout(10000);
    
    console.log('=== API Calls Made ===');
    apiCalls.forEach((call, index) => {
      console.log(`${index + 1}. ${call.method} ${call.url}`);
      if (call.postData) {
        console.log(`   Data: ${call.postData}`);
      }
    });
    console.log('=== End API Calls ===');
    
    // Take screenshot to see final state
    await page.screenshot({ path: 'test-results/api-debug-final.png', fullPage: true });
    
    // Check if any mood-to-music API calls were made
    const moodApiCalls = apiCalls.filter(call => call.url.includes('mood-to-music'));
    expect(moodApiCalls.length).toBeGreaterThan(0);
  });

  test('should check if mood state is properly set', async ({ page }) => {
    await page.goto('https://mood-mix-theta.vercel.app');
    await page.waitForLoadState('networkidle');

    // Click mood wheel
    const clickableWheel = page.locator('.rounded-full.cursor-pointer.overflow-hidden').first();
    await expect(clickableWheel).toBeVisible();
    await clickableWheel.click();
    
    await page.waitForTimeout(3000);
    
    // Check if the page state changed from mood selection to results view
    const moodSelectionView = page.locator('text="How are you feeling?"');
    const resultsView = page.locator('text="Current Mood"');
    
    const isMoodSelectionVisible = await moodSelectionView.isVisible();
    const isResultsViewVisible = await resultsView.isVisible();
    
    console.log('Mood selection view visible:', isMoodSelectionVisible);
    console.log('Results view visible:', isResultsViewVisible);
    
    // Check for loading states
    const loadingIndicator = page.locator('text="Discovering Your Music"');
    const isLoadingVisible = await loadingIndicator.isVisible();
    console.log('Loading indicator visible:', isLoadingVisible);
    
    // Check for error messages
    const errorMessage = page.locator('text*="error"');
    const errorCount = await errorMessage.count();
    console.log('Error messages found:', errorCount);
    
    if (errorCount > 0) {
      const errorText = await errorMessage.first().textContent();
      console.log('Error text:', errorText);
    }
    
    await page.screenshot({ path: 'test-results/state-check.png', fullPage: true });
  });

  test('should test Spotify API endpoints', async ({ request }) => {
    // Test the basic health endpoint
    const healthResponse = await request.get('https://mood-mix-theta.vercel.app/api/health');
    console.log('Health endpoint status:', healthResponse.status());
    
    if (healthResponse.ok()) {
      const healthData = await healthResponse.json();
      console.log('Health data:', healthData);
    }
    
    // Test if Spotify auth is working
    const spotifyResponse = await request.get('https://mood-mix-theta.vercel.app/api/spotify-auth');
    console.log('Spotify auth endpoint status:', spotifyResponse.status());
    
    if (spotifyResponse.ok()) {
      const spotifyData = await spotifyResponse.json();
      console.log('Spotify auth data:', spotifyData);
    }
  });

  test('should examine the actual DOM structure after click', async ({ page }) => {
    await page.goto('https://mood-mix-theta.vercel.app');
    await page.waitForLoadState('networkidle');

    // Take before screenshot
    await page.screenshot({ path: 'test-results/before-click-dom.png', fullPage: true });

    // Click mood wheel
    const clickableWheel = page.locator('.rounded-full.cursor-pointer.overflow-hidden').first();
    await clickableWheel.click();
    
    await page.waitForTimeout(5000);
    
    // Take after screenshot
    await page.screenshot({ path: 'test-results/after-click-dom.png', fullPage: true });
    
    // Examine the DOM structure
    const bodyContent = await page.locator('body').innerHTML();
    
    // Check for specific elements that should appear
    const hasMusicResults = bodyContent.includes('music-results') || bodyContent.includes('track-card') || bodyContent.includes('PremiumMusicCard');
    const hasLoadingState = bodyContent.includes('Discovering Your Music') || bodyContent.includes('loading');
    const hasErrorState = bodyContent.includes('error') || bodyContent.includes('Error');
    const hasCurrentMoodHeader = bodyContent.includes('Current Mood');
    
    console.log('=== DOM Analysis ===');
    console.log('Has music results:', hasMusicResults);
    console.log('Has loading state:', hasLoadingState);
    console.log('Has error state:', hasErrorState);
    console.log('Has current mood header:', hasCurrentMoodHeader);
    console.log('=== End DOM Analysis ===');
    
    // Look for specific text content that should appear
    const allText = await page.locator('body').textContent();
    const hasNoTracksFound = allText?.includes('No Tracks Found');
    const hasDiscoveringMusic = allText?.includes('Discovering Your Music');
    const hasPoweredBySpotify = allText?.includes('Powered by Spotify');
    
    console.log('=== Text Content Analysis ===');
    console.log('Has "No Tracks Found":', hasNoTracksFound);
    console.log('Has "Discovering Your Music":', hasDiscoveringMusic);
    console.log('Has "Powered by Spotify":', hasPoweredBySpotify);
    console.log('=== End Text Analysis ===');
  });
});