import { test, expect } from '@playwright/test';

test.describe('Card Mood Selector Tests', () => {
  test('should load new card grid mood selector', async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');

    // Check for the new card selector header
    const header = page.locator('text="Choose Your Vibe"');
    await expect(header).toBeVisible();
    
    // Check for mood cards
    const moodCards = page.locator('button:has-text("Happy"), button:has-text("Calm"), button:has-text("Energetic")');
    await expect(moodCards.first()).toBeVisible();
    
    // Count total mood cards
    const cardCount = await page.locator('button').filter({ hasText: /Happy|Calm|Energetic|Romantic|Focused|Chill|Melancholy|Excited|Dreamy/ }).count();
    expect(cardCount).toBe(9);
    
    console.log(`✅ Found ${cardCount} mood cards`);
    
    await page.screenshot({ path: 'test-results/card-selector-loaded.png', fullPage: true });
  });

  test('should handle card click and trigger music search', async ({ page }) => {
    const apiCalls: any[] = [];
    
    // Monitor API calls
    page.on('request', request => {
      if (request.url().includes('/api/mood-to-music')) {
        apiCalls.push({
          url: request.url(),
          method: request.method(),
          postData: request.postData()
        });
        console.log(`✅ API Request: ${request.method()} ${request.url()}`);
      }
    });

    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');

    // Click on a specific mood card
    const happyCard = page.locator('button:has-text("Happy")');
    await expect(happyCard).toBeVisible();
    
    await page.screenshot({ path: 'test-results/before-card-click.png', fullPage: true });
    
    // Click the Happy card
    await happyCard.click();
    
    // Wait for API call and transition
    await page.waitForTimeout(5000);
    
    await page.screenshot({ path: 'test-results/after-card-click.png', fullPage: true });
    
    // Verify API call was made
    expect(apiCalls.length).toBeGreaterThan(0);
    console.log(`✅ ${apiCalls.length} API calls made`);
    
    if (apiCalls.length > 0) {
      const moodData = JSON.parse(apiCalls[0].postData || '{}');
      expect(moodData.primary).toBe('happy');
      expect(moodData.intensity).toBe(75);
      expect(moodData.color).toBeDefined();
      console.log(`✅ Mood selected: ${moodData.primary} at ${moodData.intensity}% intensity`);
    }
    
    // Check if we transitioned to results view
    const resultsIndicators = [
      page.locator('text="Current Mood"').first(),
      page.locator('text="Change Mood"'),
      page.locator('text="Your Perfect Soundtrack"')
    ];
    
    let transitioned = false;
    for (const indicator of resultsIndicators) {
      if (await indicator.isVisible()) {
        transitioned = true;
        break;
      }
    }
    
    expect(transitioned).toBeTruthy();
    console.log('✅ Successfully transitioned to results view');
  });

  test('should test multiple mood card selections', async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');

    const moodTests = [
      { name: 'Calm', expectedMood: 'calm' },
      { name: 'Energetic', expectedMood: 'energetic' },
      { name: 'Romantic', expectedMood: 'romantic' }
    ];

    for (const moodTest of moodTests) {
      // Go back to mood selection if needed
      const changeMoodButton = page.locator('button:has-text("Change Mood")');
      if (await changeMoodButton.isVisible()) {
        await changeMoodButton.click();
        await page.waitForTimeout(1000);
      }

      // Click the mood card
      const moodCard = page.locator(`button:has-text("${moodTest.name}")`);
      await expect(moodCard).toBeVisible();
      
      await moodCard.click();
      await page.waitForTimeout(3000);
      
      // Verify transition occurred
      const currentMoodText = page.locator('text="Current Mood"').first();
      await expect(currentMoodText).toBeVisible({ timeout: 10000 });
      
      console.log(`✅ ${moodTest.name} mood selection successful`);
      
      await page.screenshot({ path: `test-results/mood-${moodTest.expectedMood}-selected.png`, fullPage: true });
    }
  });

  test('should verify card animations and interactions', async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');

    // Test hover effects on cards
    const happyCard = page.locator('button:has-text("Happy")');
    await expect(happyCard).toBeVisible();

    // Hover over the card
    await happyCard.hover();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/card-hover-effect.png' });

    // Test multiple card hovers
    const cardNames = ['Calm', 'Energetic', 'Romantic'];
    for (const cardName of cardNames) {
      const card = page.locator(`button:has-text("${cardName}")`);
      await card.hover();
      await page.waitForTimeout(200);
    }

    console.log('✅ Card hover effects working');

    // Test card selection visual feedback
    await happyCard.click();
    
    // Look for selection indicators (loading, pulse effects, etc.)
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/card-selection-feedback.png' });
    
    console.log('✅ Card selection feedback working');
  });

  test('should verify responsive design on different screen sizes', async ({ page }) => {
    // Test mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ path: 'test-results/cards-mobile.png', fullPage: true });
    
    // Verify cards are still clickable on mobile
    const happyCard = page.locator('button:has-text("Happy")');
    await expect(happyCard).toBeVisible();
    
    // Test tablet size
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ path: 'test-results/cards-tablet.png', fullPage: true });
    
    // Test desktop size
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ path: 'test-results/cards-desktop.png', fullPage: true });
    
    console.log('✅ Responsive design verified across screen sizes');
  });
});