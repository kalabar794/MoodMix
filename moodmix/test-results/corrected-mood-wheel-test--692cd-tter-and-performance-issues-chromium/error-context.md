# Test info

- Name: Corrected MoodMix Live Debugging >> should analyze jitter and performance issues
- Location: /Users/jonathonc/Auto1111/claude/MoodMix/moodmix/tests/corrected-mood-wheel-test.spec.ts:56:7

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: locator('.rounded-full.cursor-pointer.overflow-hidden').first()
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for locator('.rounded-full.cursor-pointer.overflow-hidden').first()

    at /Users/jonathonc/Auto1111/claude/MoodMix/moodmix/tests/corrected-mood-wheel-test.spec.ts:58:34
```

# Page snapshot

```yaml
- main:
  - img
  - heading "MoodMix" [level=1]
  - text: MoodMix
  - button "Auto theme"
  - button "Show keyboard shortcuts": Press ? for shortcuts
  - heading "How are you feeling?" [level=1]
  - paragraph: Discover the perfect soundtrack for your emotions. Our AI creates personalized playlists that match your current mood.
  - text: Select your mood below
  - button "Euphoric Pure joy and elation":
    - heading "Euphoric" [level=3]
    - paragraph: Pure joy and elation
  - button "Melancholic Bittersweet contemplation":
    - heading "Melancholic" [level=3]
    - paragraph: Bittersweet contemplation
  - button "Energetic High-octane intensity":
    - heading "Energetic" [level=3]
    - paragraph: High-octane intensity
  - button "Serene Peaceful tranquility":
    - heading "Serene" [level=3]
    - paragraph: Peaceful tranquility
  - button "Passionate Intense romantic energy":
    - heading "Passionate" [level=3]
    - paragraph: Intense romantic energy
  - button "Contemplative Deep introspective focus":
    - heading "Contemplative" [level=3]
    - paragraph: Deep introspective focus
  - button "Nostalgic Wistful remembrance":
    - heading "Nostalgic" [level=3]
    - paragraph: Wistful remembrance
  - button "Rebellious Defiant and bold":
    - heading "Rebellious" [level=3]
    - paragraph: Defiant and bold
  - button "Mystical Ethereal and otherworldly":
    - heading "Mystical" [level=3]
    - paragraph: Ethereal and otherworldly
  - button "Triumphant Victorious achievement":
    - heading "Triumphant" [level=3]
    - paragraph: Victorious achievement
  - button "Vulnerable Open and exposed":
    - heading "Vulnerable" [level=3]
    - paragraph: Open and exposed
  - button "Adventurous Ready for exploration":
    - heading "Adventurous" [level=3]
    - paragraph: Ready for exploration
  - paragraph: Each emotion unlocks a carefully curated musical journey designed to complement and enhance your current state of mind
  - paragraph: Powered by Spotify • Made for music lovers
- alert
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Corrected MoodMix Live Debugging', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     await page.goto('https://mood-mix-theta.vercel.app');
   6 |     await page.waitForLoadState('networkidle');
   7 |   });
   8 |
   9 |   test('should find and test actual mood wheel functionality', async ({ page }) => {
   10 |     // Look for the actual mood wheel structure from the component
   11 |     const moodWheelContainer = page.locator('.relative.w-96.h-96.mx-auto').first();
   12 |     await expect(moodWheelContainer).toBeVisible({ timeout: 10000 });
   13 |     
   14 |     // Find the clickable wheel element
   15 |     const clickableWheel = page.locator('.rounded-full.cursor-pointer.overflow-hidden').first();
   16 |     await expect(clickableWheel).toBeVisible();
   17 |     
   18 |     await page.screenshot({ path: 'test-results/corrected-mood-wheel-found.png', fullPage: true });
   19 |     
   20 |     console.log('✓ Mood wheel found with correct selectors');
   21 |   });
   22 |
   23 |   test('should test mood wheel interaction and click behavior', async ({ page }) => {
   24 |     // Find the clickable mood wheel
   25 |     const clickableWheel = page.locator('.rounded-full.cursor-pointer.overflow-hidden').first();
   26 |     await expect(clickableWheel).toBeVisible();
   27 |     
   28 |     // Hover over the wheel to trigger mood selection
   29 |     const wheelBox = await clickableWheel.boundingBox();
   30 |     if (wheelBox) {
   31 |       // Hover to trigger mood detection
   32 |       await page.mouse.move(wheelBox.x + wheelBox.width * 0.7, wheelBox.y + wheelBox.height * 0.3);
   33 |       await page.waitForTimeout(1000);
   34 |       await page.screenshot({ path: 'test-results/mood-wheel-hover.png', fullPage: true });
   35 |       
   36 |       // Click to select mood
   37 |       await clickableWheel.click({ position: { x: wheelBox.width * 0.7, y: wheelBox.height * 0.3 } });
   38 |       await page.waitForTimeout(3000);
   39 |       await page.screenshot({ path: 'test-results/after-mood-click.png', fullPage: true });
   40 |     }
   41 |     
   42 |     // Check if we navigated to results or if content appeared
   43 |     const url = page.url();
   44 |     console.log('Current URL after click:', url);
   45 |     
   46 |     // Look for music results or any new content
   47 |     const musicResults = page.locator('.music-results, [class*="result"], [class*="track"], [class*="song"]');
   48 |     const resultCount = await musicResults.count();
   49 |     console.log(`Found ${resultCount} potential music result elements`);
   50 |     
   51 |     if (resultCount > 0) {
   52 |       await page.screenshot({ path: 'test-results/music-results-visible.png', fullPage: true });
   53 |     }
   54 |   });
   55 |
   56 |   test('should analyze jitter and performance issues', async ({ page }) => {
   57 |     const clickableWheel = page.locator('.rounded-full.cursor-pointer.overflow-hidden').first();
>  58 |     await expect(clickableWheel).toBeVisible();
      |                                  ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
   59 |     
   60 |     // Test rapid mouse movements to detect jitter
   61 |     const wheelBox = await clickableWheel.boundingBox();
   62 |     if (wheelBox) {
   63 |       const startTime = Date.now();
   64 |       
   65 |       // Rapid mouse movements to test for jitter
   66 |       for (let i = 0; i < 10; i++) {
   67 |         const x = wheelBox.x + wheelBox.width * (0.3 + i * 0.04);
   68 |         const y = wheelBox.y + wheelBox.height * (0.3 + i * 0.04);
   69 |         await page.mouse.move(x, y);
   70 |         await page.waitForTimeout(50);
   71 |       }
   72 |       
   73 |       const endTime = Date.now();
   74 |       console.log(`Mouse movement test completed in ${endTime - startTime}ms`);
   75 |       
   76 |       await page.screenshot({ path: 'test-results/jitter-test-final.png', fullPage: true });
   77 |     }
   78 |     
   79 |     // Check for any CSS animations that might cause jitter
   80 |     const animations = await page.evaluate(() => {
   81 |       const element = document.querySelector('.rounded-full.cursor-pointer.overflow-hidden');
   82 |       if (element) {
   83 |         const computedStyle = window.getComputedStyle(element);
   84 |         return {
   85 |           transition: computedStyle.transition,
   86 |           transform: computedStyle.transform,
   87 |           animation: computedStyle.animation
   88 |         };
   89 |       }
   90 |       return null;
   91 |     });
   92 |     
   93 |     console.log('Mood wheel CSS properties:', animations);
   94 |   });
   95 |
   96 |   test('should check for preview buttons and music functionality', async ({ page }) => {
   97 |     const clickableWheel = page.locator('.rounded-full.cursor-pointer.overflow-hidden').first();
   98 |     await expect(clickableWheel).toBeVisible();
   99 |     
  100 |     // Click mood wheel
  101 |     await clickableWheel.click();
  102 |     await page.waitForTimeout(5000);
  103 |     
  104 |     // Look for any preview or play buttons
  105 |     const previewButtons = page.locator('button:has-text("play"), button:has-text("preview"), .play-button, .preview-button, [aria-label*="play"], [title*="play"]');
  106 |     const buttonCount = await previewButtons.count();
  107 |     console.log(`Found ${buttonCount} potential play/preview buttons`);
  108 |     
  109 |     if (buttonCount > 0) {
  110 |       await previewButtons.first().click();
  111 |       await page.waitForTimeout(2000);
  112 |       await page.screenshot({ path: 'test-results/preview-clicked.png', fullPage: true });
  113 |     }
  114 |     
  115 |     // Check for audio elements
  116 |     const audioElements = page.locator('audio, [src*=".mp3"], [src*=".wav"], [src*="spotify"], [src*="preview"]');
  117 |     const audioCount = await audioElements.count();
  118 |     console.log(`Found ${audioCount} audio elements`);
  119 |     
  120 |     await page.screenshot({ path: 'test-results/final-state.png', fullPage: true });
  121 |   });
  122 |
  123 |   test('should capture all console messages and errors', async ({ page }) => {
  124 |     const messages: string[] = [];
  125 |     
  126 |     page.on('console', msg => {
  127 |       messages.push(`${msg.type()}: ${msg.text()}`);
  128 |     });
  129 |     
  130 |     page.on('requestfailed', request => {
  131 |       messages.push(`Failed request: ${request.url()}`);
  132 |     });
  133 |     
  134 |     // Interact with mood wheel
  135 |     const clickableWheel = page.locator('.rounded-full.cursor-pointer.overflow-hidden').first();
  136 |     await expect(clickableWheel).toBeVisible();
  137 |     await clickableWheel.click();
  138 |     await page.waitForTimeout(5000);
  139 |     
  140 |     console.log('=== Console Messages ===');
  141 |     messages.forEach(msg => console.log(msg));
  142 |     console.log('=== End Console Messages ===');
  143 |   });
  144 | });
```