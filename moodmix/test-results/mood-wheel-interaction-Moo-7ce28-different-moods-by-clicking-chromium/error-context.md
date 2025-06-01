# Test info

- Name: Mood Wheel Interaction >> should allow selecting different moods by clicking
- Location: /Users/jonathonc/Auto1111/claude/MoodMix/moodmix/tests/mood-wheel-interaction.spec.ts:57:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3001/
Call log:
  - navigating to "http://localhost:3001/", waiting until "load"

    at /Users/jonathonc/Auto1111/claude/MoodMix/moodmix/tests/mood-wheel-interaction.spec.ts:5:16
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test'
   2 |
   3 | test.describe('Mood Wheel Interaction', () => {
   4 |   test.beforeEach(async ({ page }) => {
>  5 |     await page.goto('http://localhost:3001')
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3001/
   6 |     await page.waitForLoadState('networkidle')
   7 |   })
   8 |
   9 |   test('should not trigger mood selection on hover, only on click', async ({ page }) => {
   10 |     // Wait for mood wheel to be visible
   11 |     const moodWheel = page.locator('.mood-wheel-premium').first()
   12 |     await expect(moodWheel).toBeVisible()
   13 |
   14 |     // Check initial state - no mood should be selected
   15 |     const resultsSection = page.locator('text="Your Perfect Soundtrack"')
   16 |     await expect(resultsSection).not.toBeVisible()
   17 |
   18 |     // Hover over the mood wheel without clicking
   19 |     await moodWheel.hover({ position: { x: 200, y: 100 } })
   20 |     await page.waitForTimeout(500) // Wait a bit to ensure no selection happens
   21 |
   22 |     // Verify no mood selection occurred (no results showing)
   23 |     await expect(resultsSection).not.toBeVisible()
   24 |
   25 |     // Now click on the mood wheel
   26 |     await moodWheel.click({ position: { x: 200, y: 100 } })
   27 |     
   28 |     // Wait for results to appear
   29 |     await expect(resultsSection).toBeVisible({ timeout: 10000 })
   30 |     
   31 |     // Verify mood was selected
   32 |     const moodDisplay = page.locator('text="Current Mood"')
   33 |     await expect(moodDisplay).toBeVisible()
   34 |   })
   35 |
   36 |   test('should show visual feedback on hover without triggering selection', async ({ page }) => {
   37 |     const moodWheel = page.locator('.mood-wheel-premium').first()
   38 |     await expect(moodWheel).toBeVisible()
   39 |
   40 |     // Get initial center hub text
   41 |     const centerHub = page.locator('.glass-premium').filter({ hasText: 'Your Vibe' })
   42 |     await expect(centerHub).toBeVisible()
   43 |
   44 |     // Hover over different positions
   45 |     await moodWheel.hover({ position: { x: 300, y: 200 } }) // Happy area
   46 |     await page.waitForTimeout(300)
   47 |     
   48 |     // Should show mood name but not trigger selection
   49 |     const happyText = page.locator('text="Happy"').first()
   50 |     await expect(happyText).toBeVisible()
   51 |     
   52 |     // But results should not appear
   53 |     const resultsSection = page.locator('text="Your Perfect Soundtrack"')
   54 |     await expect(resultsSection).not.toBeVisible()
   55 |   })
   56 |
   57 |   test('should allow selecting different moods by clicking', async ({ page }) => {
   58 |     const moodWheel = page.locator('.mood-wheel-premium').first()
   59 |     
   60 |     // Click on "Sad" area (bottom left)
   61 |     await moodWheel.click({ position: { x: 100, y: 300 } })
   62 |     
   63 |     // Wait for results
   64 |     await page.waitForSelector('text="Your Perfect Soundtrack"', { timeout: 10000 })
   65 |     
   66 |     // Verify "Sad" mood is selected
   67 |     const moodText = page.locator('.glass-premium').filter({ hasText: 'Sad' })
   68 |     await expect(moodText).toBeVisible()
   69 |     
   70 |     // Click "Change Mood" button
   71 |     const changeMoodButton = page.locator('button:has-text("Change Mood")')
   72 |     await changeMoodButton.click()
   73 |     
   74 |     // Mood wheel should be visible again
   75 |     await expect(moodWheel).toBeVisible()
   76 |     
   77 |     // Click on "Happy" area (right side)
   78 |     await moodWheel.click({ position: { x: 350, y: 200 } })
   79 |     
   80 |     // Verify "Happy" mood is now selected
   81 |     await page.waitForSelector('text="Happy"', { timeout: 10000 })
   82 |   })
   83 |
   84 |   test('should show intensity based on distance from center', async ({ page }) => {
   85 |     const moodWheel = page.locator('.mood-wheel-premium').first()
   86 |     
   87 |     // Click near the edge for high intensity
   88 |     await moodWheel.click({ position: { x: 380, y: 200 } })
   89 |     
   90 |     // Wait for results
   91 |     await page.waitForSelector('text="Your Perfect Soundtrack"', { timeout: 10000 })
   92 |     
   93 |     // Check intensity is high (should be > 80%)
   94 |     const intensityText = page.locator('text=/\\d+%/').first()
   95 |     const intensity = await intensityText.textContent()
   96 |     const intensityValue = parseInt(intensity?.replace('%', '') || '0')
   97 |     expect(intensityValue).toBeGreaterThan(80)
   98 |     
   99 |     // Go back and click near center for low intensity
  100 |     const changeMoodButton = page.locator('button:has-text("Change Mood")')
  101 |     await changeMoodButton.click()
  102 |     
  103 |     // Click near center
  104 |     await moodWheel.click({ position: { x: 220, y: 200 } })
  105 |     
```