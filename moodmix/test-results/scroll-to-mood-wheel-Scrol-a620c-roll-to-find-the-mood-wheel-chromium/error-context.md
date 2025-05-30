# Test info

- Name: Scroll to Mood Wheel >> Scroll to find the mood wheel
- Location: /Users/jonathonc/Auto1111/claude/MoodMix/moodmix/tests/scroll-to-mood-wheel.spec.ts:5:7

# Error details

```
Error: page.screenshot: Clipped area is either empty or outside the resulting image
Call log:
  - taking page screenshot
  - waiting for fonts to load...
  - fonts loaded

    at /Users/jonathonc/Auto1111/claude/MoodMix/moodmix/tests/scroll-to-mood-wheel.spec.ts:58:20
```

# Page snapshot

```yaml
- main:
  - text: 🎵
  - heading "MoodMix" [level=1]
  - heading "How are you feeling?" [level=1]
  - paragraph: Discover the perfect soundtrack for your emotions. Our AI-powered mood analysis creates personalized playlists that resonate with your current state of mind.
  - text: Select your mood below Choose Mood Your Vibe Happy Joyful & Bright Excited Thrilled & Energized Energetic Powerful & Dynamic Love Romantic & Tender Sad Emotional & Deep Calm Peaceful & Serene
  - paragraph: Crafted with precision • Powered by Spotify • Made for music lovers
- alert
- button "Open Next.js Dev Tools":
  - img
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test'
   2 |
   3 | test.describe('Scroll to Mood Wheel', () => {
   4 |   
   5 |   test('Scroll to find the mood wheel', async ({ page }) => {
   6 |     await page.goto('http://localhost:3001')
   7 |     await page.waitForLoadState('networkidle')
   8 |     
   9 |     // Get the position of the mood wheel
  10 |     const moodWheelPosition = await page.evaluate(() => {
  11 |       const element = document.querySelector('.mood-wheel-premium')
  12 |       if (element) {
  13 |         const rect = element.getBoundingClientRect()
  14 |         return {
  15 |           top: rect.top,
  16 |           left: rect.left,
  17 |           bottom: rect.bottom,
  18 |           right: rect.right,
  19 |           width: rect.width,
  20 |           height: rect.height,
  21 |           centerY: rect.top + rect.height / 2,
  22 |           centerX: rect.left + rect.width / 2
  23 |         }
  24 |       }
  25 |       return null
  26 |     })
  27 |     console.log('Mood wheel position:', moodWheelPosition)
  28 |     
  29 |     // Get viewport info
  30 |     const viewportInfo = await page.evaluate(() => ({
  31 |       width: window.innerWidth,
  32 |       height: window.innerHeight,
  33 |       scrollY: window.scrollY,
  34 |       scrollX: window.scrollX
  35 |     }))
  36 |     console.log('Viewport info:', viewportInfo)
  37 |     
  38 |     // Scroll to the mood wheel area if needed
  39 |     if (moodWheelPosition) {
  40 |       await page.evaluate((pos) => {
  41 |         window.scrollTo({
  42 |           top: pos.centerY - window.innerHeight / 2,
  43 |           left: pos.centerX - window.innerWidth / 2,
  44 |           behavior: 'smooth'
  45 |         })
  46 |       }, moodWheelPosition)
  47 |       
  48 |       await page.waitForTimeout(1000) // Wait for scroll animation
  49 |       
  50 |       // Take screenshot after scrolling
  51 |       await page.screenshot({ 
  52 |         path: 'test-results/scrolled-to-mood-wheel.png',
  53 |         fullPage: false 
  54 |       })
  55 |       
  56 |       // Try to take screenshot of just the mood wheel area
  57 |       if (moodWheelPosition.width > 0 && moodWheelPosition.height > 0) {
> 58 |         await page.screenshot({
     |                    ^ Error: page.screenshot: Clipped area is either empty or outside the resulting image
  59 |           path: 'test-results/mood-wheel-only.png',
  60 |           clip: {
  61 |             x: moodWheelPosition.left,
  62 |             y: moodWheelPosition.top,
  63 |             width: moodWheelPosition.width,
  64 |             height: moodWheelPosition.height
  65 |           }
  66 |         })
  67 |       }
  68 |     }
  69 |     
  70 |     // Also try full page screenshot
  71 |     await page.screenshot({ 
  72 |       path: 'test-results/full-page-after-scroll.png',
  73 |       fullPage: true 
  74 |     })
  75 |   })
  76 | })
```