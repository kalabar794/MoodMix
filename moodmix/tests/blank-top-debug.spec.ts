import { test, expect } from '@playwright/test';

test.describe('Blank Top Page Debug', () => {
  test('should investigate blank space at top of results page', async ({ page }) => {
    await page.goto('https://mood-mix-theta.vercel.app');
    await page.waitForLoadState('networkidle');

    // Take screenshot of initial state
    await page.screenshot({ path: 'test-results/initial-mood-selection.png', fullPage: true });

    // Click on a mood card
    const happyCard = page.locator('button:has-text("Happy")');
    await expect(happyCard).toBeVisible();
    await happyCard.click();

    // Wait for transition
    await page.waitForTimeout(5000);

    // Take screenshot of results page showing blank top
    await page.screenshot({ path: 'test-results/results-page-blank-top.png', fullPage: true });

    // Analyze the page structure
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    const scrollPosition = await page.evaluate(() => window.scrollY);
    
    console.log('Page metrics:');
    console.log(`- Body height: ${bodyHeight}px`);
    console.log(`- Viewport height: ${viewportHeight}px`);
    console.log(`- Scroll position: ${scrollPosition}px`);

    // Check for elements that might be causing blank space
    const header = page.locator('header');
    const headerHeight = await header.boundingBox().then(box => box?.height || 0);
    console.log(`- Header height: ${headerHeight}px`);

    // Check main content positioning
    const mainContent = page.locator('main');
    const mainBox = await mainContent.boundingBox();
    if (mainBox) {
      console.log(`- Main content top: ${mainBox.y}px`);
      console.log(`- Main content height: ${mainBox.height}px`);
    }

    // Look for the mood summary card
    const moodSummary = page.locator('text="Current Mood"').first();
    const summaryBox = await moodSummary.boundingBox();
    if (summaryBox) {
      console.log(`- Mood summary top: ${summaryBox.y}px`);
    } else {
      console.log('- Mood summary not found');
    }

    // Check for music results
    const musicResults = page.locator('text="Your Perfect Soundtrack"');
    const musicBox = await musicResults.boundingBox();
    if (musicBox) {
      console.log(`- Music results top: ${musicBox.y}px`);
    } else {
      console.log('- Music results header not found');
    }

    // Check for large padding/margins causing blank space
    const contentContainer = page.locator('.min-h-screen').first();
    const containerStyles = await contentContainer.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        paddingTop: styles.paddingTop,
        paddingBottom: styles.paddingBottom,
        marginTop: styles.marginTop,
        marginBottom: styles.marginBottom,
        minHeight: styles.minHeight
      };
    });
    
    console.log('Container styles:', containerStyles);

    // Scroll to top to see what's there
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/scrolled-to-top.png', fullPage: true });

    // Try scrolling down to see where content starts
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/scrolled-down-200.png', fullPage: true });

    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/scrolled-down-400.png', fullPage: true });
  });

  test('should analyze CSS causing blank space', async ({ page }) => {
    await page.goto('https://mood-mix-theta.vercel.app');
    await page.waitForLoadState('networkidle');

    // Click mood card
    const happyCard = page.locator('button:has-text("Happy")');
    await happyCard.click();
    await page.waitForTimeout(5000);

    // Inspect specific elements that might cause spacing issues
    const spacingElements = [
      'main',
      '.min-h-screen',
      '.pt-32',
      '.pb-16',
      'header',
      '.fixed'
    ];

    for (const selector of spacingElements) {
      const element = page.locator(selector).first();
      const elementExists = await element.count() > 0;
      
      if (elementExists) {
        const styles = await element.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            position: computed.position,
            top: computed.top,
            paddingTop: computed.paddingTop,
            paddingBottom: computed.paddingBottom,
            marginTop: computed.marginTop,
            marginBottom: computed.marginBottom,
            height: computed.height,
            minHeight: computed.minHeight
          };
        });
        
        console.log(`Styles for ${selector}:`, styles);

        const boundingBox = await element.boundingBox();
        if (boundingBox) {
          console.log(`Bounding box for ${selector}:`, {
            x: boundingBox.x,
            y: boundingBox.y,
            width: boundingBox.width,
            height: boundingBox.height
          });
        }
      } else {
        console.log(`Element ${selector} not found`);
      }
    }

    // Look for the actual content positioning
    const resultsContent = page.locator('.space-y-8').first();
    const resultsBox = await resultsContent.boundingBox();
    if (resultsBox) {
      console.log('Results content position:', {
        top: resultsBox.y,
        height: resultsBox.height
      });
    }

    // Check viewport and document dimensions
    const dimensions = await page.evaluate(() => ({
      documentHeight: document.documentElement.scrollHeight,
      documentWidth: document.documentElement.scrollWidth,
      viewportHeight: window.innerHeight,
      viewportWidth: window.innerWidth,
      scrollY: window.scrollY,
      scrollX: window.scrollX
    }));

    console.log('Page dimensions:', dimensions);
  });
});