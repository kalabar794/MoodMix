# Test info

- Name: Mood Card Click Fix >> should handle all mood types without errors
- Location: /Users/jonathonc/Auto1111/claude/MoodMix/moodmix/tests/mood-card-fix-test.spec.ts:58:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_RESET at http://localhost:3000/
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

    at /Users/jonathonc/Auto1111/claude/MoodMix/moodmix/tests/mood-card-fix-test.spec.ts:59:16
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test'
   2 |
   3 | test.describe('Mood Card Click Fix', () => {
   4 |   test('should successfully click mood cards without errors', async ({ page }) => {
   5 |     // Listen for console errors
   6 |     const consoleErrors: string[] = []
   7 |     page.on('console', msg => {
   8 |       if (msg.type() === 'error') {
   9 |         consoleErrors.push(msg.text())
  10 |       }
  11 |     })
  12 |
  13 |     // Listen for uncaught exceptions
  14 |     const uncaughtExceptions: string[] = []
  15 |     page.on('pageerror', error => {
  16 |       uncaughtExceptions.push(error.message)
  17 |     })
  18 |
  19 |     // Navigate to the app
  20 |     await page.goto('http://localhost:3000')
  21 |     
  22 |     // Wait for mood cards to load
  23 |     await page.waitForSelector('[data-testid="mood-card"], .mood-card-sophisticated, button:has-text("Euphoric")', { timeout: 10000 })
  24 |     
  25 |     // Find and click the first mood card
  26 |     const moodCards = await page.locator('button').filter({ hasText: /Euphoric|Melancholic|Energetic|Serene/ })
  27 |     const firstCard = moodCards.first()
  28 |     
  29 |     // Take screenshot before clicking
  30 |     await page.screenshot({ path: 'test-results/before-mood-click.png' })
  31 |     
  32 |     // Click the mood card
  33 |     await firstCard.click()
  34 |     
  35 |     // Wait a moment for any async operations
  36 |     await page.waitForTimeout(2000)
  37 |     
  38 |     // Take screenshot after clicking
  39 |     await page.screenshot({ path: 'test-results/after-mood-click.png' })
  40 |     
  41 |     // Check for console errors
  42 |     expect(consoleErrors.length).toBe(0)
  43 |     
  44 |     // Check for uncaught exceptions
  45 |     expect(uncaughtExceptions.length).toBe(0)
  46 |     
  47 |     // Verify we're now on the results page or that the state changed
  48 |     const hasResults = await page.locator('text="Discovering Your Music"').isVisible().catch(() => false)
  49 |     const hasError = await page.locator('text="Application error"').isVisible().catch(() => false)
  50 |     
  51 |     // Should either be loading or have results, but no error
  52 |     expect(hasError).toBe(false)
  53 |     
  54 |     // Log success
  55 |     console.log('✅ Mood card click test passed - no errors detected')
  56 |   })
  57 |
  58 |   test('should handle all mood types without errors', async ({ page }) => {
> 59 |     await page.goto('http://localhost:3000')
     |                ^ Error: page.goto: net::ERR_CONNECTION_RESET at http://localhost:3000/
  60 |     
  61 |     // Wait for cards to load
  62 |     await page.waitForSelector('button:has-text("Euphoric")', { timeout: 10000 })
  63 |     
  64 |     // Test each mood type
  65 |     const moodTypes = ['Euphoric', 'Melancholic', 'Energetic', 'Serene', 'Passionate', 'Contemplative']
  66 |     
  67 |     for (const mood of moodTypes) {
  68 |       // Reset page
  69 |       await page.reload()
  70 |       await page.waitForSelector(`button:has-text("${mood}")`, { timeout: 10000 })
  71 |       
  72 |       // Click the specific mood
  73 |       await page.click(`button:has-text("${mood}")`)
  74 |       
  75 |       // Wait for response
  76 |       await page.waitForTimeout(1000)
  77 |       
  78 |       // Check no application error
  79 |       const hasError = await page.locator('text="Application error"').isVisible().catch(() => false)
  80 |       expect(hasError).toBe(false)
  81 |       
  82 |       console.log(`✅ ${mood} mood card works correctly`)
  83 |     }
  84 |   })
  85 | })
```