# Test info

- Name: Mood Wheel Fix Verification >> should show loading state while fetching music
- Location: /Users/jonathonc/Auto1111/claude/MoodMix/moodmix/tests/mood-wheel-fix-test.spec.ts:85:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3002/
Call log:
  - navigating to "http://localhost:3002/", waiting until "load"

    at /Users/jonathonc/Auto1111/claude/MoodMix/moodmix/tests/mood-wheel-fix-test.spec.ts:86:16
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Mood Wheel Fix Verification', () => {
   4 |   test('should trigger API call when clicking mood wheel', async ({ page }) => {
   5 |     const apiCalls: any[] = [];
   6 |     
   7 |     // Monitor API calls
   8 |     page.on('request', request => {
   9 |       if (request.url().includes('/api/mood-to-music')) {
   10 |         apiCalls.push({
   11 |           url: request.url(),
   12 |           method: request.method(),
   13 |           postData: request.postData()
   14 |         });
   15 |         console.log(`✓ API Request detected: ${request.method()} ${request.url()}`);
   16 |       }
   17 |     });
   18 |
   19 |     // Start local dev server
   20 |     await page.goto('http://localhost:3002');
   21 |     await page.waitForLoadState('networkidle');
   22 |
   23 |     // Find mood wheel
   24 |     const clickableWheel = page.locator('.rounded-full.cursor-pointer.overflow-hidden').first();
   25 |     await expect(clickableWheel).toBeVisible();
   26 |     
   27 |     // Take before screenshot
   28 |     await page.screenshot({ path: 'test-results/before-fix-click.png', fullPage: true });
   29 |     
   30 |     // Click mood wheel
   31 |     await clickableWheel.click();
   32 |     
   33 |     // Wait for potential API calls and state changes
   34 |     await page.waitForTimeout(5000);
   35 |     
   36 |     // Take after screenshot
   37 |     await page.screenshot({ path: 'test-results/after-fix-click.png', fullPage: true });
   38 |     
   39 |     // Verify API call was made
   40 |     expect(apiCalls.length).toBeGreaterThan(0);
   41 |     console.log(`✓ ${apiCalls.length} API calls made`);
   42 |     
   43 |     if (apiCalls.length > 0) {
   44 |       const apiCall = apiCalls[0];
   45 |       console.log('API call data:', apiCall.postData);
   46 |       
   47 |       // Parse the mood selection data
   48 |       const moodData = JSON.parse(apiCall.postData || '{}');
   49 |       expect(moodData.primary).toBeDefined();
   50 |       expect(moodData.intensity).toBeGreaterThan(0);
   51 |       expect(moodData.color).toBeDefined();
   52 |       expect(moodData.coordinates).toBeDefined();
   53 |       
   54 |       console.log(`✓ Mood selected: ${moodData.primary} at ${moodData.intensity}% intensity`);
   55 |     }
   56 |   });
   57 |
   58 |   test('should transition from mood selection to results view', async ({ page }) => {
   59 |     await page.goto('http://localhost:3002');
   60 |     await page.waitForLoadState('networkidle');
   61 |
   62 |     // Verify initial state
   63 |     const moodSelectionTitle = page.locator('text="How are you feeling?"');
   64 |     await expect(moodSelectionTitle).toBeVisible();
   65 |     
   66 |     // Click mood wheel
   67 |     const clickableWheel = page.locator('.rounded-full.cursor-pointer.overflow-hidden').first();
   68 |     await clickableWheel.click();
   69 |     
   70 |     // Wait for transition
   71 |     await page.waitForTimeout(3000);
   72 |     
   73 |     // Check if view changed to results
   74 |     const currentMoodHeader = page.locator('text="Current Mood"');
   75 |     await expect(currentMoodHeader).toBeVisible({ timeout: 10000 });
   76 |     
   77 |     // Verify mood selection disappeared
   78 |     await expect(moodSelectionTitle).not.toBeVisible();
   79 |     
   80 |     console.log('✓ Successfully transitioned from mood selection to results view');
   81 |     
   82 |     await page.screenshot({ path: 'test-results/results-view.png', fullPage: true });
   83 |   });
   84 |
   85 |   test('should show loading state while fetching music', async ({ page }) => {
>  86 |     await page.goto('http://localhost:3002');
      |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3002/
   87 |     await page.waitForLoadState('networkidle');
   88 |
   89 |     // Click mood wheel
   90 |     const clickableWheel = page.locator('.rounded-full.cursor-pointer.overflow-hidden').first();
   91 |     await clickableWheel.click();
   92 |     
   93 |     // Check for loading indicator
   94 |     const loadingIndicator = page.locator('text="Discovering Your Music"');
   95 |     await expect(loadingIndicator).toBeVisible({ timeout: 5000 });
   96 |     
   97 |     console.log('✓ Loading state appears');
   98 |     
   99 |     await page.screenshot({ path: 'test-results/loading-state.png' });
  100 |     
  101 |     // Wait for loading to complete
  102 |     await page.waitForTimeout(5000);
  103 |     
  104 |     // Check if loading disappears and results appear
  105 |     await expect(loadingIndicator).not.toBeVisible();
  106 |     
  107 |     // Look for music results
  108 |     const musicResults = page.locator('.track-card-premium').first();
  109 |     await expect(musicResults).toBeVisible({ timeout: 10000 });
  110 |     
  111 |     console.log('✓ Music results loaded successfully');
  112 |     
  113 |     await page.screenshot({ path: 'test-results/music-loaded.png', fullPage: true });
  114 |   });
  115 | });
```