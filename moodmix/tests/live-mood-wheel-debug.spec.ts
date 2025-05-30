import { test, expect } from '@playwright/test';

test.describe('Live MoodMix Debugging Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to live deployment
    await page.goto('https://mood-mix-theta.vercel.app');
    await page.waitForLoadState('networkidle');
  });

  test('should load page and find mood wheel', async ({ page }) => {
    // Check if page loads
    await expect(page).toHaveTitle(/MoodMix/);
    
    // Take screenshot of initial page load
    await page.screenshot({ path: 'test-results/initial-page-load.png', fullPage: true });
    
    // Look for mood wheel container
    const moodWheel = page.locator('[data-testid="mood-wheel"], .mood-wheel, svg').first();
    await expect(moodWheel).toBeVisible({ timeout: 10000 });
    
    // Take screenshot of mood wheel
    await page.screenshot({ path: 'test-results/mood-wheel-visible.png', fullPage: true });
  });

  test('should analyze mood wheel jitter and animation issues', async ({ page }) => {
    // Wait for mood wheel to load
    const moodWheel = page.locator('[data-testid="mood-wheel"], .mood-wheel, svg').first();
    await expect(moodWheel).toBeVisible({ timeout: 10000 });
    
    // Check for CSS animations that might cause jitter
    const computedStyle = await moodWheel.evaluate((el) => {
      return window.getComputedStyle(el);
    });
    
    console.log('Mood wheel computed styles:', computedStyle);
    
    // Move mouse over different parts of the wheel to test hover effects
    const wheelBox = await moodWheel.boundingBox();
    if (wheelBox) {
      // Test hover on different parts of the wheel
      await page.mouse.move(wheelBox.x + wheelBox.width * 0.2, wheelBox.y + wheelBox.height * 0.2);
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'test-results/mood-wheel-hover-1.png' });
      
      await page.mouse.move(wheelBox.x + wheelBox.width * 0.8, wheelBox.y + wheelBox.height * 0.8);
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'test-results/mood-wheel-hover-2.png' });
    }
  });

  test('should test mood selection and identify blank page issue', async ({ page }) => {
    // Wait for mood wheel to load
    const moodWheel = page.locator('[data-testid="mood-wheel"], .mood-wheel, svg').first();
    await expect(moodWheel).toBeVisible({ timeout: 10000 });
    
    // Try to find clickable mood segments
    const moodSegments = page.locator('path, circle, rect, g').filter({ hasText: /happy|sad|calm|energetic|angry|peaceful/i });
    const allSegments = page.locator('svg path, svg circle, svg g');
    
    console.log('Looking for mood segments...');
    const segmentCount = await allSegments.count();
    console.log(`Found ${segmentCount} potential clickable elements`);
    
    // Screenshot before clicking
    await page.screenshot({ path: 'test-results/before-mood-click.png', fullPage: true });
    
    // Try clicking on different parts of the mood wheel
    const wheelBox = await moodWheel.boundingBox();
    if (wheelBox) {
      // Click on center-left (might be a mood)
      await page.click(`[data-testid="mood-wheel"], .mood-wheel, svg`, { 
        position: { x: wheelBox.width * 0.3, y: wheelBox.height * 0.5 } 
      });
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test-results/after-mood-click-1.png', fullPage: true });
      
      // Click on center-right (might be another mood)
      await page.click(`[data-testid="mood-wheel"], .mood-wheel, svg`, { 
        position: { x: wheelBox.width * 0.7, y: wheelBox.height * 0.5 } 
      });
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test-results/after-mood-click-2.png', fullPage: true });
    }
    
    // Check if any content appears after clicking
    const resultsSection = page.locator('.music-results, [data-testid="music-results"], .results');
    const hasResults = await resultsSection.count() > 0;
    console.log('Has results section:', hasResults);
    
    if (hasResults) {
      await expect(resultsSection.first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('should test preview functionality', async ({ page }) => {
    // Navigate and wait for mood wheel
    const moodWheel = page.locator('[data-testid="mood-wheel"], .mood-wheel, svg').first();
    await expect(moodWheel).toBeVisible({ timeout: 10000 });
    
    // Click on mood wheel to trigger music results
    await moodWheel.click();
    await page.waitForTimeout(3000);
    
    // Look for music preview elements
    const previewButtons = page.locator('button:has-text("Preview"), [data-testid="preview"], .preview-button, audio, .play-button');
    const previewCount = await previewButtons.count();
    console.log(`Found ${previewCount} preview elements`);
    
    if (previewCount > 0) {
      // Try clicking on first preview button
      await previewButtons.first().click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test-results/preview-test.png', fullPage: true });
      
      // Check for audio elements or playing indicators
      const audioElements = page.locator('audio');
      const audioCount = await audioElements.count();
      console.log(`Found ${audioCount} audio elements`);
    }
    
    await page.screenshot({ path: 'test-results/music-results-page.png', fullPage: true });
  });

  test('should check for console errors and network issues', async ({ page }) => {
    const messages: string[] = [];
    
    // Listen for console messages
    page.on('console', msg => {
      messages.push(`${msg.type()}: ${msg.text()}`);
    });
    
    // Listen for failed requests
    page.on('requestfailed', request => {
      messages.push(`Failed request: ${request.url()} - ${request.failure()?.errorText}`);
    });
    
    // Navigate and interact
    await page.goto('https://mood-mix-theta.vercel.app');
    await page.waitForLoadState('networkidle');
    
    const moodWheel = page.locator('[data-testid="mood-wheel"], .mood-wheel, svg').first();
    await expect(moodWheel).toBeVisible({ timeout: 10000 });
    await moodWheel.click();
    await page.waitForTimeout(5000);
    
    // Log all collected messages
    console.log('Console messages and errors:');
    messages.forEach(msg => console.log(msg));
    
    // Check for specific error patterns
    const errors = messages.filter(msg => msg.includes('error') || msg.includes('Error') || msg.includes('failed'));
    if (errors.length > 0) {
      console.log('Found errors:', errors);
    }
  });
});