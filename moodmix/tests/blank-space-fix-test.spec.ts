import { test, expect } from '@playwright/test';

test.describe('Blank Space Fix Verification', () => {
  test('should verify reduced blank space at top of results page', async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');

    // Click on a mood card
    const happyCard = page.locator('button:has-text("Happy")');
    await expect(happyCard).toBeVisible();
    await happyCard.click();

    // Wait for transition
    await page.waitForTimeout(5000);

    // Take screenshot after fix
    await page.screenshot({ path: 'test-results/results-page-fixed.png', fullPage: true });

    // Measure the distance from top to first content
    const moodSummary = page.locator('text="Current Mood"').first();
    const summaryBox = await moodSummary.boundingBox();
    
    if (summaryBox) {
      console.log(`✅ Mood summary now at: ${summaryBox.y}px from top`);
      
      // Should be much closer to top now (around 80-120px instead of 800+px)
      expect(summaryBox.y).toBeLessThan(200);
      console.log('✅ Blank space significantly reduced!');
    }

    // Verify header is still visible
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Scroll to top to verify layout
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/top-fixed.png', fullPage: true });

    // Check that mood selection still centers properly
    const changeMoodButton = page.locator('button:has-text("Change Mood")');
    if (await changeMoodButton.isVisible()) {
      await changeMoodButton.click();
      await page.waitForTimeout(2000);
      
      // Should still be centered for mood selection
      await page.screenshot({ path: 'test-results/mood-selection-centered.png', fullPage: true });
      
      const cardSelector = page.locator('text="Choose Your Vibe"');
      const cardBox = await cardSelector.boundingBox();
      if (cardBox) {
        console.log(`✅ Mood selection at: ${cardBox.y}px (should be centered)`);
        // Should be more centered (around 300-400px)
        expect(cardBox.y).toBeGreaterThan(200);
        expect(cardBox.y).toBeLessThan(500);
      }
    }
  });

  test('should compare before and after spacing', async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');

    // Test mood selection layout (should be centered)
    const moodSelectionTitle = page.locator('text="Choose Your Vibe"');
    const titleBox = await moodSelectionTitle.boundingBox();
    
    if (titleBox) {
      console.log(`Mood selection title at: ${titleBox.y}px`);
      // Should be vertically centered on screen
      expect(titleBox.y).toBeGreaterThan(200); // Not too close to top
      expect(titleBox.y).toBeLessThan(600); // Not too far down
    }

    // Click mood and test results layout (should be near top)
    const happyCard = page.locator('button:has-text("Happy")');
    await happyCard.click();
    await page.waitForTimeout(5000);

    const moodSummary = page.locator('text="Current Mood"').first();
    const summaryBox = await moodSummary.boundingBox();
    
    if (summaryBox) {
      console.log(`Results summary at: ${summaryBox.y}px`);
      // Should be close to top (accounting for header)
      expect(summaryBox.y).toBeLessThan(200);
      expect(summaryBox.y).toBeGreaterThan(50); // But not overlapping header
    }

    // Check overall page metrics
    const pageMetrics = await page.evaluate(() => ({
      documentHeight: document.documentElement.scrollHeight,
      viewportHeight: window.innerHeight,
      scrollY: window.scrollY
    }));

    console.log('Page metrics after fix:', pageMetrics);
    
    // Should not need to scroll to see content
    expect(pageMetrics.scrollY).toBeLessThan(100);
  });
});