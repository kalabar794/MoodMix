import { test, expect } from '@playwright/test';

test.describe('Mood Wheel Fix Verification', () => {
  test('should trigger API call when clicking mood wheel', async ({ page }) => {
    const apiCalls: any[] = [];
    
    // Monitor API calls
    page.on('request', request => {
      if (request.url().includes('/api/mood-to-music')) {
        apiCalls.push({
          url: request.url(),
          method: request.method(),
          postData: request.postData()
        });
        console.log(`✓ API Request detected: ${request.method()} ${request.url()}`);
      }
    });

    // Start local dev server
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');

    // Find mood wheel
    const clickableWheel = page.locator('.rounded-full.cursor-pointer.overflow-hidden').first();
    await expect(clickableWheel).toBeVisible();
    
    // Take before screenshot
    await page.screenshot({ path: 'test-results/before-fix-click.png', fullPage: true });
    
    // Click mood wheel
    await clickableWheel.click();
    
    // Wait for potential API calls and state changes
    await page.waitForTimeout(5000);
    
    // Take after screenshot
    await page.screenshot({ path: 'test-results/after-fix-click.png', fullPage: true });
    
    // Verify API call was made
    expect(apiCalls.length).toBeGreaterThan(0);
    console.log(`✓ ${apiCalls.length} API calls made`);
    
    if (apiCalls.length > 0) {
      const apiCall = apiCalls[0];
      console.log('API call data:', apiCall.postData);
      
      // Parse the mood selection data
      const moodData = JSON.parse(apiCall.postData || '{}');
      expect(moodData.primary).toBeDefined();
      expect(moodData.intensity).toBeGreaterThan(0);
      expect(moodData.color).toBeDefined();
      expect(moodData.coordinates).toBeDefined();
      
      console.log(`✓ Mood selected: ${moodData.primary} at ${moodData.intensity}% intensity`);
    }
  });

  test('should transition from mood selection to results view', async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');

    // Verify initial state
    const moodSelectionTitle = page.locator('text="How are you feeling?"');
    await expect(moodSelectionTitle).toBeVisible();
    
    // Click mood wheel
    const clickableWheel = page.locator('.rounded-full.cursor-pointer.overflow-hidden').first();
    await clickableWheel.click();
    
    // Wait for transition
    await page.waitForTimeout(3000);
    
    // Check if view changed to results
    const currentMoodHeader = page.locator('text="Current Mood"');
    await expect(currentMoodHeader).toBeVisible({ timeout: 10000 });
    
    // Verify mood selection disappeared
    await expect(moodSelectionTitle).not.toBeVisible();
    
    console.log('✓ Successfully transitioned from mood selection to results view');
    
    await page.screenshot({ path: 'test-results/results-view.png', fullPage: true });
  });

  test('should show loading state while fetching music', async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');

    // Click mood wheel
    const clickableWheel = page.locator('.rounded-full.cursor-pointer.overflow-hidden').first();
    await clickableWheel.click();
    
    // Check for loading indicator
    const loadingIndicator = page.locator('text="Discovering Your Music"');
    await expect(loadingIndicator).toBeVisible({ timeout: 5000 });
    
    console.log('✓ Loading state appears');
    
    await page.screenshot({ path: 'test-results/loading-state.png' });
    
    // Wait for loading to complete
    await page.waitForTimeout(5000);
    
    // Check if loading disappears and results appear
    await expect(loadingIndicator).not.toBeVisible();
    
    // Look for music results
    const musicResults = page.locator('.track-card-premium').first();
    await expect(musicResults).toBeVisible({ timeout: 10000 });
    
    console.log('✓ Music results loaded successfully');
    
    await page.screenshot({ path: 'test-results/music-loaded.png', fullPage: true });
  });
});