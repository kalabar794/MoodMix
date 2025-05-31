import { test, expect } from '@playwright/test';

test.describe('API Request Debug', () => {
  test('should manually test API with exact request data', async ({ page }) => {
    // Navigate to the live deployment
    await page.goto('https://mood-mix-theta.vercel.app');
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    
    // Intercept all network requests to examine them
    const requests: any[] = [];
    const responses: any[] = [];
    
    page.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
        postData: request.postData()
      });
    });
    
    page.on('response', async response => {
      const responseBody = await response.text().catch(() => 'Failed to read response body');
      responses.push({
        url: response.url(),
        status: response.status(),
        headers: response.headers(),
        body: responseBody
      });
    });
    
    // Test 1: Direct API call using page.request
    console.log('\n=== DIRECT API TEST ===');
    try {
      const directResponse = await page.request.post('https://mood-mix-theta.vercel.app/api/mood-to-music', {
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          primary: 'energetic',
          intensity: 75,
          color: '#ef4444',
          coordinates: { x: 0, y: 0 }
        }
      });
      
      const directBody = await directResponse.text();
      console.log('Direct API Status:', directResponse.status());
      console.log('Direct API Response:', directBody.substring(0, 500));
    } catch (error) {
      console.log('Direct API Error:', error);
    }
    
    // Test 2: Use page.evaluate to make the exact same call the frontend makes
    console.log('\n=== FRONTEND SIMULATION TEST ===');
    const frontendResult = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/mood-to-music', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            primary: 'energetic',
            intensity: 75,
            color: '#ef4444',
            coordinates: { x: 0, y: 0 }
          }),
        });
        
        const data = await response.json();
        return {
          status: response.status,
          data: data,
          headers: Object.fromEntries(response.headers.entries())
        };
      } catch (error) {
        return { error: error.message };
      }
    });
    
    console.log('Frontend Simulation Result:', JSON.stringify(frontendResult, null, 2));
    
    // Test 3: Click on the actual Energetic button and monitor the network
    console.log('\n=== ACTUAL BUTTON CLICK TEST ===');
    
    // Clear previous requests/responses
    requests.length = 0;
    responses.length = 0;
    
    // Find and click the Energetic button
    const energeticButton = page.locator('button:has-text("Energetic")').first();
    await energeticButton.click();
    
    // Wait for the request to complete
    await page.waitForTimeout(5000);
    
    // Log all network activity from the button click
    console.log('\n=== REQUESTS FROM BUTTON CLICK ===');
    requests.forEach((req, index) => {
      console.log(`Request ${index + 1}:`);
      console.log(`  Method: ${req.method}`);
      console.log(`  URL: ${req.url}`);
      console.log(`  Headers:`, JSON.stringify(req.headers, null, 2));
      console.log(`  Body: ${req.postData || 'No body'}`);
    });
    
    console.log('\n=== RESPONSES FROM BUTTON CLICK ===');
    responses.forEach((res, index) => {
      console.log(`Response ${index + 1}:`);
      console.log(`  Status: ${res.status}`);
      console.log(`  URL: ${res.url}`);
      console.log(`  Body: ${res.body.substring(0, 500)}`);
    });
    
    // Check if any music results appeared
    await page.waitForTimeout(2000);
    const musicItems = await page.locator('.track, .song, [class*="music"], [class*="track"]').count();
    console.log(`\nMusic items found after click: ${musicItems}`);
    
    // Take a screenshot
    await page.screenshot({ path: 'test-results/api-debug-after-click.png', fullPage: true });
  });
});