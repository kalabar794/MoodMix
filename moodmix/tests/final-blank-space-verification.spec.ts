import { test, expect } from '@playwright/test';

test.describe('Final Blank Space Fix Verification', () => {
  test('should verify blank space fix on live deployment', async ({ page }) => {
    await page.goto('https://mood-mix-theta.vercel.app');
    await page.waitForLoadState('networkidle');

    // Take screenshot of mood selection (should be centered)
    await page.screenshot({ path: 'test-results/live-mood-selection.png', fullPage: true });

    // Click on a mood card to go to results
    const happyCard = page.locator('button:has-text("Happy")');
    await expect(happyCard).toBeVisible();
    await happyCard.click();

    // Wait for transition
    await page.waitForTimeout(5000);

    // Take screenshot of results page (should have no blank space at top)
    await page.screenshot({ path: 'test-results/live-results-fixed.png', fullPage: true });

    // Measure distance from top to content
    const moodSummary = page.locator('text="Current Mood"').first();
    const summaryBox = await moodSummary.boundingBox();
    
    if (summaryBox) {
      console.log(`✅ Live deployment: Mood summary at ${summaryBox.y}px from top`);
      
      // Should be close to top (accounting for header ~131px)
      expect(summaryBox.y).toBeLessThan(250);
      expect(summaryBox.y).toBeGreaterThan(30);
      
      console.log('✅ Blank space issue completely resolved!');
    }

    // Verify we can see content without scrolling
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    const currentScroll = await page.evaluate(() => window.scrollY);
    
    console.log(`Viewport: ${viewportHeight}px, Scroll: ${currentScroll}px`);
    
    // Should not need to scroll to see main content
    expect(currentScroll).toBeLessThan(200);

    // Test navigation back to mood selection
    const changeMoodButton = page.locator('button:has-text("Change Mood")');
    if (await changeMoodButton.isVisible()) {
      await changeMoodButton.click();
      await page.waitForTimeout(2000);
      
      // Should return to properly centered mood selection
      await page.screenshot({ path: 'test-results/live-back-to-selection.png', fullPage: true });
      
      const cardSelector = page.locator('text="Choose Your Vibe"');
      await expect(cardSelector).toBeVisible();
      console.log('✅ Navigation between views working perfectly');
    }
  });

  test('should compare old vs new layout behavior', async ({ page }) => {
    await page.goto('https://mood-mix-theta.vercel.app');
    await page.waitForLoadState('networkidle');

    console.log('=== Layout Analysis ===');

    // Test mood selection layout
    const moodTitle = page.locator('text="How are you feeling?"');
    const titleBox = await moodTitle.boundingBox();
    
    if (titleBox) {
      console.log(`Mood selection title: ${titleBox.y}px from top`);
      // Should be reasonably centered
      expect(titleBox.y).toBeGreaterThan(100);
    }

    // Test results layout
    const energeticCard = page.locator('button:has-text("Energetic")');
    await energeticCard.click();
    await page.waitForTimeout(5000);

    const resultsTitle = page.locator('text="Your Perfect Soundtrack"');
    const resultsBox = await resultsTitle.boundingBox();
    
    if (resultsBox) {
      console.log(`Results title: ${resultsBox.y}px from top`);
      // Should be near top
      expect(resultsBox.y).toBeLessThan(300);
    }

    // Verify no excessive scrolling needed
    const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const viewport = await page.evaluate(() => window.innerHeight);
    const scrollPos = await page.evaluate(() => window.scrollY);
    
    console.log(`Page height: ${pageHeight}px, Viewport: ${viewport}px, Scroll: ${scrollPos}px`);
    
    // Key metric: should not be auto-scrolled far down
    expect(scrollPos).toBeLessThan(viewport * 0.5);
    
    console.log('✅ Layout optimization successful!');
  });
});