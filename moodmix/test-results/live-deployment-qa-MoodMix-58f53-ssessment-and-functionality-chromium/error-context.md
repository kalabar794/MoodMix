# Test info

- Name: MoodMix Live Deployment QA >> Mood wheel assessment and functionality
- Location: /Users/jonathonc/Auto1111/claude/MoodMix/moodmix/tests/live-deployment-qa.spec.ts:32:7

# Error details

```
Error: locator.screenshot: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button:has-text("Happy"), button:has-text("Sad"), button:has-text("Excited")').first()

    at /Users/jonathonc/Auto1111/claude/MoodMix/moodmix/tests/live-deployment-qa.spec.ts:61:33
```

# Page snapshot

```yaml
- main:
  - img
  - heading "MoodMix" [level=1]
  - text: MoodMix
  - button "Auto theme"
  - button "Show keyboard shortcuts"
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
   1 | import { test, expect } from '@playwright/test'
   2 |
   3 | const VERCEL_URL = 'https://mood-mix-theta.vercel.app'
   4 |
   5 | test.describe('MoodMix Live Deployment QA', () => {
   6 |   
   7 |   test('Full page screenshot and initial load assessment', async ({ page }) => {
   8 |     await page.goto(VERCEL_URL)
   9 |     
   10 |     // Wait for page to fully load
   11 |     await page.waitForLoadState('networkidle')
   12 |     
   13 |     // Take full page screenshot
   14 |     await page.screenshot({ 
   15 |       path: 'test-results/live-deployment-full-page.png', 
   16 |       fullPage: true 
   17 |     })
   18 |     
   19 |     // Check basic page elements
   20 |     await expect(page).toHaveTitle(/MoodMix/i)
   21 |     
   22 |     // Check if main heading exists
   23 |     const heading = page.locator('h1')
   24 |     await expect(heading).toBeVisible()
   25 |     
   26 |     // Take screenshot of viewport
   27 |     await page.screenshot({ 
   28 |       path: 'test-results/live-deployment-viewport.png' 
   29 |     })
   30 |   })
   31 |
   32 |   test('Mood wheel assessment and functionality', async ({ page }) => {
   33 |     await page.goto(VERCEL_URL)
   34 |     await page.waitForLoadState('networkidle')
   35 |     
   36 |     // Look for mood wheel container
   37 |     const moodWheel = page.locator('[data-testid="mood-wheel"], .mood-wheel, #mood-wheel')
   38 |     
   39 |     if (await moodWheel.count() > 0) {
   40 |       // Take screenshot of mood wheel area
   41 |       await moodWheel.screenshot({ path: 'test-results/mood-wheel-area.png' })
   42 |       
   43 |       // Test if mood wheel is interactive
   44 |       await moodWheel.hover()
   45 |       await page.screenshot({ path: 'test-results/mood-wheel-hover.png' })
   46 |       
   47 |       // Try clicking on different areas
   48 |       const boundingBox = await moodWheel.boundingBox()
   49 |       if (boundingBox) {
   50 |         await page.mouse.click(
   51 |           boundingBox.x + boundingBox.width / 2, 
   52 |           boundingBox.y + boundingBox.height / 2
   53 |         )
   54 |         await page.screenshot({ path: 'test-results/mood-wheel-click.png' })
   55 |       }
   56 |     } else {
   57 |       console.log('Mood wheel not found - checking for alternative mood selectors')
   58 |       
   59 |       // Look for any mood-related buttons or elements
   60 |       const moodButtons = page.locator('button:has-text("Happy"), button:has-text("Sad"), button:has-text("Excited")')
>  61 |       await moodButtons.first().screenshot({ path: 'test-results/mood-buttons.png' })
      |                                 ^ Error: locator.screenshot: Test timeout of 30000ms exceeded.
   62 |     }
   63 |   })
   64 |
   65 |   test('Premium UI effects assessment', async ({ page }) => {
   66 |     await page.goto(VERCEL_URL)
   67 |     await page.waitForLoadState('networkidle')
   68 |     
   69 |     // Check for glassmorphic effects by evaluating computed styles
   70 |     const glassElements = await page.evaluate(() => {
   71 |       const elements = document.querySelectorAll('*')
   72 |       const glassEffects = []
   73 |       
   74 |       for (const el of elements) {
   75 |         const style = window.getComputedStyle(el)
   76 |         if (style.backdropFilter && style.backdropFilter !== 'none') {
   77 |           glassEffects.push({
   78 |             tag: el.tagName,
   79 |             classes: el.className,
   80 |             backdropFilter: style.backdropFilter,
   81 |             background: style.background
   82 |           })
   83 |         }
   84 |       }
   85 |       return glassEffects
   86 |     })
   87 |     
   88 |     console.log('Glass effects found:', glassEffects)
   89 |     
   90 |     // Take screenshot with dev tools to show styles
   91 |     await page.screenshot({ path: 'test-results/ui-effects-assessment.png' })
   92 |   })
   93 |
   94 |   test('Responsive design test', async ({ page }) => {
   95 |     // Test mobile viewport
   96 |     await page.setViewportSize({ width: 375, height: 667 })
   97 |     await page.goto(VERCEL_URL)
   98 |     await page.waitForLoadState('networkidle')
   99 |     await page.screenshot({ path: 'test-results/mobile-view.png' })
  100 |     
  101 |     // Test tablet viewport
  102 |     await page.setViewportSize({ width: 768, height: 1024 })
  103 |     await page.goto(VERCEL_URL)
  104 |     await page.waitForLoadState('networkidle')
  105 |     await page.screenshot({ path: 'test-results/tablet-view.png' })
  106 |     
  107 |     // Test desktop viewport
  108 |     await page.setViewportSize({ width: 1920, height: 1080 })
  109 |     await page.goto(VERCEL_URL)
  110 |     await page.waitForLoadState('networkidle')
  111 |     await page.screenshot({ path: 'test-results/desktop-view.png' })
  112 |   })
  113 |
  114 |   test('Performance and loading assessment', async ({ page }) => {
  115 |     const startTime = Date.now()
  116 |     
  117 |     await page.goto(VERCEL_URL)
  118 |     await page.waitForLoadState('networkidle')
  119 |     
  120 |     const loadTime = Date.now() - startTime
  121 |     console.log(`Page load time: ${loadTime}ms`)
  122 |     
  123 |     // Check for any console errors
  124 |     const logs = []
  125 |     page.on('console', msg => logs.push(msg.text()))
  126 |     
  127 |     // Check for any failed network requests
  128 |     const failedRequests = []
  129 |     page.on('response', response => {
  130 |       if (!response.ok()) {
  131 |         failedRequests.push({
  132 |           url: response.url(),
  133 |           status: response.status()
  134 |         })
  135 |       }
  136 |     })
  137 |     
  138 |     await page.reload()
  139 |     await page.waitForLoadState('networkidle')
  140 |     
  141 |     console.log('Console logs:', logs)
  142 |     console.log('Failed requests:', failedRequests)
  143 |     
  144 |     // Take performance screenshot
  145 |     await page.screenshot({ path: 'test-results/performance-assessment.png' })
  146 |   })
  147 |
  148 |   test('CSS and styling verification', async ({ page }) => {
  149 |     await page.goto(VERCEL_URL)
  150 |     await page.waitForLoadState('networkidle')
  151 |     
  152 |     // Check if Tailwind classes are applied
  153 |     const tailwindCheck = await page.evaluate(() => {
  154 |       const element = document.querySelector('body')
  155 |       const computedStyle = window.getComputedStyle(element)
  156 |       return {
  157 |         backgroundColor: computedStyle.backgroundColor,
  158 |         fontFamily: computedStyle.fontFamily,
  159 |         hasClasses: element?.className || 'No classes found'
  160 |       }
  161 |     })
```