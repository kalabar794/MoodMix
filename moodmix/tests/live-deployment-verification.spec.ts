import { test, expect } from '@playwright/test';

test.describe('Live Deployment Verification', () => {
  test('should load page and test Energetic mood selection with network analysis', async ({ page }) => {
    // Navigate to the live deployment
    await page.goto('https://mood-mix-theta.vercel.app');
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    
    // Take initial screenshot
    await page.screenshot({ path: 'test-results/live-deployment-initial.png', fullPage: true });
    
    // Check if page loads without errors
    const title = await page.title();
    console.log('Page title:', title);
    
    // Look for the mood cards
    const moodCards = await page.locator('[data-testid="mood-card"]').count();
    console.log('Number of mood cards found:', moodCards);
    
    // If no mood cards, look for any mood-related elements
    if (moodCards === 0) {
      const alternativeMoodElements = await page.locator('button:has-text("Energetic"), .mood, [class*="mood"]').count();
      console.log('Alternative mood elements found:', alternativeMoodElements);
    }
    
    // Listen for network requests
    const networkRequests: any[] = [];
    page.on('request', request => {
      networkRequests.push({
        url: request.url(),
        method: request.method()
      });
    });
    
    // Listen for network responses
    const networkResponses: any[] = [];
    page.on('response', response => {
      networkResponses.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
    });
    
    // Listen for console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Try to find and click "Energetic" mood
    let energeticClicked = false;
    
    // Method 1: Try data-testid
    const energeticCard = page.locator('[data-testid="mood-card"]:has-text("Energetic")');
    if (await energeticCard.count() > 0) {
      await energeticCard.click();
      energeticClicked = true;
      console.log('Clicked Energetic via data-testid');
    } else {
      // Method 2: Try any button with "Energetic" text
      const energeticButton = page.locator('button:has-text("Energetic")');
      if (await energeticButton.count() > 0) {
        await energeticButton.click();
        energeticClicked = true;
        console.log('Clicked Energetic via button text');
      } else {
        // Method 3: Try any clickable element with "Energetic"
        const energeticElement = page.locator(':has-text("Energetic")').first();
        if (await energeticElement.count() > 0) {
          await energeticElement.click();
          energeticClicked = true;
          console.log('Clicked Energetic via general text search');
        }
      }
    }
    
    if (energeticClicked) {
      // Wait for potential API call
      await page.waitForTimeout(3000);
      
      // Check for results
      const resultsContainer = page.locator('[data-testid="music-results"], .results, [class*="result"]');
      const resultsCount = await resultsContainer.count();
      console.log('Results containers found:', resultsCount);
      
      // Look for any music-related content
      const musicItems = await page.locator('.track, .song, [class*="music"], [class*="track"]').count();
      console.log('Music items found:', musicItems);
      
      // Take screenshot after mood selection
      await page.screenshot({ path: 'test-results/live-deployment-after-mood.png', fullPage: true });
    } else {
      console.log('Could not find Energetic mood option');
      
      // Get all visible text to understand what's on the page
      const pageContent = await page.textContent('body');
      console.log('Page content preview:', pageContent?.substring(0, 500));
    }
    
    // Wait a bit more for any delayed responses
    await page.waitForTimeout(2000);
    
    // Log all network activity
    console.log('\n=== NETWORK REQUESTS ===');
    networkRequests.forEach(req => {
      console.log(`${req.method} ${req.url}`);
    });
    
    console.log('\n=== NETWORK RESPONSES ===');
    networkResponses.forEach(res => {
      console.log(`${res.status} ${res.statusText} ${res.url}`);
    });
    
    console.log('\n=== CONSOLE ERRORS ===');
    consoleErrors.forEach(error => {
      console.log(error);
    });
    
    // Check for specific API calls
    const apiCalls = networkRequests.filter(req => req.url.includes('/api/'));
    console.log('\n=== API CALLS ===');
    apiCalls.forEach(call => {
      console.log(`${call.method} ${call.url}`);
    });
    
    // Get detailed response for API calls
    for (const apiCall of apiCalls) {
      try {
        const response = await page.request.get(apiCall.url);
        const responseBody = await response.text();
        console.log(`\nAPI Response for ${apiCall.url}:`);
        console.log(`Status: ${response.status()}`);
        console.log(`Body: ${responseBody.substring(0, 500)}`);
      } catch (error) {
        console.log(`Error fetching ${apiCall.url}:`, error);
      }
    }
  });
});