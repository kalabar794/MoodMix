import { test, expect } from '@playwright/test';

test.describe('Corrected MoodMix Live Debugging', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://mood-mix-theta.vercel.app');
    await page.waitForLoadState('networkidle');
  });

  test('should find and test actual mood wheel functionality', async ({ page }) => {
    // Look for the actual mood wheel structure from the component
    const moodWheelContainer = page.locator('.relative.w-96.h-96.mx-auto').first();
    await expect(moodWheelContainer).toBeVisible({ timeout: 10000 });
    
    // Find the clickable wheel element
    const clickableWheel = page.locator('.rounded-full.cursor-pointer.overflow-hidden').first();
    await expect(clickableWheel).toBeVisible();
    
    await page.screenshot({ path: 'test-results/corrected-mood-wheel-found.png', fullPage: true });
    
    console.log('✓ Mood wheel found with correct selectors');
  });

  test('should test mood wheel interaction and click behavior', async ({ page }) => {
    // Find the clickable mood wheel
    const clickableWheel = page.locator('.rounded-full.cursor-pointer.overflow-hidden').first();
    await expect(clickableWheel).toBeVisible();
    
    // Hover over the wheel to trigger mood selection
    const wheelBox = await clickableWheel.boundingBox();
    if (wheelBox) {
      // Hover to trigger mood detection
      await page.mouse.move(wheelBox.x + wheelBox.width * 0.7, wheelBox.y + wheelBox.height * 0.3);
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'test-results/mood-wheel-hover.png', fullPage: true });
      
      // Click to select mood
      await clickableWheel.click({ position: { x: wheelBox.width * 0.7, y: wheelBox.height * 0.3 } });
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'test-results/after-mood-click.png', fullPage: true });
    }
    
    // Check if we navigated to results or if content appeared
    const url = page.url();
    console.log('Current URL after click:', url);
    
    // Look for music results or any new content
    const musicResults = page.locator('.music-results, [class*="result"], [class*="track"], [class*="song"]');
    const resultCount = await musicResults.count();
    console.log(`Found ${resultCount} potential music result elements`);
    
    if (resultCount > 0) {
      await page.screenshot({ path: 'test-results/music-results-visible.png', fullPage: true });
    }
  });

  test('should analyze jitter and performance issues', async ({ page }) => {
    const clickableWheel = page.locator('.rounded-full.cursor-pointer.overflow-hidden').first();
    await expect(clickableWheel).toBeVisible();
    
    // Test rapid mouse movements to detect jitter
    const wheelBox = await clickableWheel.boundingBox();
    if (wheelBox) {
      const startTime = Date.now();
      
      // Rapid mouse movements to test for jitter
      for (let i = 0; i < 10; i++) {
        const x = wheelBox.x + wheelBox.width * (0.3 + i * 0.04);
        const y = wheelBox.y + wheelBox.height * (0.3 + i * 0.04);
        await page.mouse.move(x, y);
        await page.waitForTimeout(50);
      }
      
      const endTime = Date.now();
      console.log(`Mouse movement test completed in ${endTime - startTime}ms`);
      
      await page.screenshot({ path: 'test-results/jitter-test-final.png', fullPage: true });
    }
    
    // Check for any CSS animations that might cause jitter
    const animations = await page.evaluate(() => {
      const element = document.querySelector('.rounded-full.cursor-pointer.overflow-hidden');
      if (element) {
        const computedStyle = window.getComputedStyle(element);
        return {
          transition: computedStyle.transition,
          transform: computedStyle.transform,
          animation: computedStyle.animation
        };
      }
      return null;
    });
    
    console.log('Mood wheel CSS properties:', animations);
  });

  test('should check for preview buttons and music functionality', async ({ page }) => {
    const clickableWheel = page.locator('.rounded-full.cursor-pointer.overflow-hidden').first();
    await expect(clickableWheel).toBeVisible();
    
    // Click mood wheel
    await clickableWheel.click();
    await page.waitForTimeout(5000);
    
    // Look for any preview or play buttons
    const previewButtons = page.locator('button:has-text("play"), button:has-text("preview"), .play-button, .preview-button, [aria-label*="play"], [title*="play"]');
    const buttonCount = await previewButtons.count();
    console.log(`Found ${buttonCount} potential play/preview buttons`);
    
    if (buttonCount > 0) {
      await previewButtons.first().click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test-results/preview-clicked.png', fullPage: true });
    }
    
    // Check for audio elements
    const audioElements = page.locator('audio, [src*=".mp3"], [src*=".wav"], [src*="spotify"], [src*="preview"]');
    const audioCount = await audioElements.count();
    console.log(`Found ${audioCount} audio elements`);
    
    await page.screenshot({ path: 'test-results/final-state.png', fullPage: true });
  });

  test('should capture all console messages and errors', async ({ page }) => {
    const messages: string[] = [];
    
    page.on('console', msg => {
      messages.push(`${msg.type()}: ${msg.text()}`);
    });
    
    page.on('requestfailed', request => {
      messages.push(`Failed request: ${request.url()}`);
    });
    
    // Interact with mood wheel
    const clickableWheel = page.locator('.rounded-full.cursor-pointer.overflow-hidden').first();
    await expect(clickableWheel).toBeVisible();
    await clickableWheel.click();
    await page.waitForTimeout(5000);
    
    console.log('=== Console Messages ===');
    messages.forEach(msg => console.log(msg));
    console.log('=== End Console Messages ===');
  });
});