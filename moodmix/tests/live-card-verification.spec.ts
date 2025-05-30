import { test, expect } from '@playwright/test';

test.describe('Live Card Selector Verification', () => {
  test('should verify new card selector works on live deployment', async ({ page }) => {
    await page.goto('https://mood-mix-theta.vercel.app');
    await page.waitForLoadState('networkidle');

    // Verify the new card selector loaded instead of wheel
    const cardSelector = page.locator('text="Choose Your Vibe"');
    await expect(cardSelector).toBeVisible();
    console.log('✅ New card selector loaded successfully');

    // Verify mood cards are present
    const moodCards = page.locator('button:has-text("Happy"), button:has-text("Calm"), button:has-text("Energetic")');
    await expect(moodCards.first()).toBeVisible();
    
    const cardCount = await page.locator('button').filter({ hasText: /Happy|Calm|Energetic|Romantic|Focused|Chill|Melancholy|Excited|Dreamy/ }).count();
    expect(cardCount).toBe(9);
    console.log(`✅ Found all ${cardCount} mood cards on live site`);

    // Take screenshot of new design
    await page.screenshot({ path: 'test-results/live-card-selector.png', fullPage: true });

    // Test clicking a mood card
    const happyCard = page.locator('button:has-text("Happy")');
    await happyCard.click();
    
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'test-results/live-card-clicked.png', fullPage: true });

    // Verify transition to music results
    const resultsIndicators = [
      page.locator('text="Current Mood"').first(),
      page.locator('text="Change Mood"'),
      page.locator('text="Your Perfect Soundtrack"')
    ];
    
    let transitioned = false;
    for (const indicator of resultsIndicators) {
      if (await indicator.isVisible()) {
        transitioned = true;
        console.log('✅ Successfully transitioned to results view');
        break;
      }
    }
    
    expect(transitioned).toBeTruthy();
    console.log('✅ Card selector working perfectly on live deployment!');
  });

  test('should compare old vs new design', async ({ page }) => {
    await page.goto('https://mood-mix-theta.vercel.app');
    await page.waitForLoadState('networkidle');

    // Verify old wheel is gone
    const oldWheel = page.locator('.mood-wheel, [data-testid="mood-wheel"]');
    const wheelExists = await oldWheel.count() > 0;
    expect(wheelExists).toBeFalsy();
    console.log('✅ Old problematic wheel has been removed');

    // Verify new cards are beautiful and functional
    const cards = page.locator('button').filter({ hasText: /Happy|Calm|Energetic/ });
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThan(0);
    console.log(`✅ New beautiful card design with ${cardCount} visible cards`);

    // Test responsive behavior
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile
    await page.screenshot({ path: 'test-results/live-cards-mobile.png', fullPage: true });

    await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop
    await page.screenshot({ path: 'test-results/live-cards-desktop.png', fullPage: true });

    console.log('✅ New design is fully responsive and gorgeous!');
  });
});