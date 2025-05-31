import { test, expect } from '@playwright/test';

test.describe('Deployment Verification - Audio Preview Fix', () => {
  test('Check site loads and test Energetic mood selection - LIVE', async ({ page }) => {
    // Navigate to the deployed site
    await page.goto('https://mood-mix-theta.vercel.app');
    
    // Take initial screenshot
    await page.screenshot({ path: 'test-results/deployment-initial-load.png', fullPage: true });
    
    // Check if page loads properly
    await expect(page).toHaveTitle(/MoodMix/);
    
    // Set up monitoring for console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Track network requests
    const networkRequests: any[] = [];
    page.on('request', request => {
      networkRequests.push({
        url: request.url(),
        method: request.method(),
        headers: request.headers()
      });
    });
    
    // Track network responses
    const networkResponses: any[] = [];
    page.on('response', response => {
      networkResponses.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
    });
    
    // Wait for the mood cards to be visible using the actual button elements
    await page.waitForSelector('button:has-text("Energetic")', { timeout: 15000 });
    
    // Look for the Energetic mood card and click it
    console.log('Looking for Energetic mood card...');
    const energeticCard = page.locator('button:has-text("Energetic")');
    await expect(energeticCard).toBeVisible();
    
    // Take screenshot before clicking
    await page.screenshot({ path: 'test-results/before-energetic-click.png', fullPage: true });
    
    // Click the Energetic mood
    await energeticCard.click();
    
    // Wait for navigation or results to load
    await page.waitForTimeout(3000);
    
    // Check if we're on results page or if results appeared
    const currentUrl = page.url();
    console.log('Current URL after click:', currentUrl);
    
    // Wait for navigation or results to load - look for actual content
    try {
      // Wait for either music results or error message
      await Promise.race([
        page.waitForSelector('text="Loading your music..."', { timeout: 5000 }),
        page.waitForSelector('h2', { timeout: 5000 }) // Results page typically has h2 headers
      ]);
      console.log('Found loading or results content');
    } catch (error) {
      console.log('No loading or results content found within 5 seconds, continuing...');
    }
    
    // Take screenshot after click
    await page.screenshot({ path: 'test-results/after-energetic-click.png', fullPage: true });
    
    // Wait a bit more for any async operations
    await page.waitForTimeout(8000);
    
    // Take final screenshot
    await page.screenshot({ path: 'test-results/deployment-final-state.png', fullPage: true });
    
    // Check for any API calls to Spotify or mood-to-music
    const spotifyRequests = networkRequests.filter(req => 
      req.url.includes('spotify') || req.url.includes('mood-to-music')
    );
    
    const spotifyResponses = networkResponses.filter(res => 
      res.url.includes('spotify') || res.url.includes('mood-to-music')
    );
    
    // Look for track elements using common selectors
    const trackElements = page.locator('div:has(img[alt*="album" i]), div:has(img[src*="spotify" i]), .track-card, [class*="track"]');
    const trackCount = await trackElements.count();
    
    // Log findings
    console.log('=== DEPLOYMENT VERIFICATION RESULTS ===');
    console.log('Current URL:', page.url());
    console.log('Console Errors:', consoleErrors);
    console.log('Spotify/Music API Requests:', spotifyRequests);
    console.log('Spotify/Music API Responses:', spotifyResponses);
    console.log('Total Network Requests:', networkRequests.length);
    console.log('Total Network Responses:', networkResponses.length);
    console.log('Number of potential track elements found:', trackCount);
    
    if (trackCount > 0) {
      // Get track details to see if they look different/improved
      for (let i = 0; i < Math.min(3, trackCount); i++) {
        const track = trackElements.nth(i);
        const trackText = await track.textContent();
        console.log(`Track ${i + 1}:`, trackText?.substring(0, 100));
      }
    }
    
    // Look for any error messages
    const errorElements = page.locator('text="Error" i, text="Failed" i, .error');
    const errorCount = await errorElements.count();
    if (errorCount > 0) {
      console.log('Error messages found:', errorCount);
      for (let i = 0; i < errorCount; i++) {
        const errorText = await errorElements.nth(i).textContent();
        console.log(`Error ${i + 1}:`, errorText);
      }
    }
    
    // Verify no critical console errors
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('manifest') &&
      !error.includes('chunk')
    );
    
    if (criticalErrors.length > 0) {
      console.log('CRITICAL ERRORS FOUND:', criticalErrors);
    }
    
    // Check if API calls succeeded
    const failedApiCalls = spotifyResponses.filter(res => res.status >= 400);
    if (failedApiCalls.length > 0) {
      console.log('FAILED API CALLS:', failedApiCalls);
    }
  });
});