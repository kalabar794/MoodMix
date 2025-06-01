# Test info

- Name: MoodMix Application >> page renders without white screen
- Location: /Users/jonathonc/Auto1111/claude/MoodMix/moodmix/tests/mood-selection.spec.ts:100:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3001/
Call log:
  - navigating to "http://localhost:3001/", waiting until "load"

    at /Users/jonathonc/Auto1111/claude/MoodMix/moodmix/tests/mood-selection.spec.ts:101:16
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test'
   2 |
   3 | test.describe('MoodMix Application', () => {
   4 |   test('homepage loads with all UI elements visible', async ({ page }) => {
   5 |     await page.goto('/')
   6 |     
   7 |     // Check page loads without errors
   8 |     await expect(page).toHaveTitle(/MoodMix/)
   9 |     
   10 |     // Verify main heading is visible
   11 |     await expect(page.getByText('How are you feeling?')).toBeVisible()
   12 |     
   13 |     // Verify subtitle is visible
   14 |     await expect(page.getByText('Select your mood and discover your perfect playlist')).toBeVisible()
   15 |     
   16 |     // Verify MoodMix header is visible
   17 |     await expect(page.getByRole('heading', { name: 'MoodMix' })).toBeVisible()
   18 |     
   19 |     // Verify footer is visible
   20 |     await expect(page.getByText('Made with ❤️ using Next.js • Powered by Spotify')).toBeVisible()
   21 |   })
   22 |
   23 |   test('mood wheel is visible and interactive', async ({ page }) => {
   24 |     await page.goto('/')
   25 |     
   26 |     // Wait for mood wheel to be visible
   27 |     const moodWheel = page.locator('.mood-wheel-gradient').first()
   28 |     await expect(moodWheel).toBeVisible()
   29 |     
   30 |     // Check that mood labels are visible
   31 |     await expect(page.getByText('Happy')).toBeVisible()
   32 |     await expect(page.getByText('Excited')).toBeVisible()
   33 |     await expect(page.getByText('Energetic')).toBeVisible()
   34 |     await expect(page.getByText('Love')).toBeVisible()
   35 |     await expect(page.getByText('Sad')).toBeVisible()
   36 |     await expect(page.getByText('Calm')).toBeVisible()
   37 |     
   38 |     // Verify center shows "Select" initially (use exact match)
   39 |     await expect(page.getByText('Select', { exact: true })).toBeVisible()
   40 |   })
   41 |
   42 |   test('mood selection functionality works', async ({ page }) => {
   43 |     await page.goto('/')
   44 |     
   45 |     // Wait for animations to settle
   46 |     await page.waitForTimeout(2000)
   47 |     
   48 |     // Find a clickable mood wheel container that won't move
   49 |     const moodWheelContainer = page.locator('.relative.w-80.h-80.mx-auto').first()
   50 |     await expect(moodWheelContainer).toBeVisible()
   51 |     
   52 |     // Click on a specific area (avoiding the center which has overlays)
   53 |     await moodWheelContainer.click({ position: { x: 240, y: 160 } }) // Right side for "Happy"
   54 |     
   55 |     // Wait a moment for any state updates
   56 |     await page.waitForTimeout(1000)
   57 |     
   58 |     // Check if we can see any mood-related content or state changes
   59 |     // This is a basic test since we don't have Spotify API working
   60 |     console.log('Mood wheel clicked - testing basic interactivity')
   61 |   })
   62 |
   63 |   test('glassmorphic design elements are present', async ({ page }) => {
   64 |     await page.goto('/')
   65 |     
   66 |     // Check for glass card elements
   67 |     const glassElements = page.locator('.glass')
   68 |     await expect(glassElements.first()).toBeVisible()
   69 |     
   70 |     // Verify gradient background is present
   71 |     const gradientBg = page.locator('.gradient-bg')
   72 |     await expect(gradientBg).toBeVisible()
   73 |   })
   74 |
   75 |   test('no hydration errors in console', async ({ page }) => {
   76 |     const errors: string[] = []
   77 |     
   78 |     // Listen for console errors
   79 |     page.on('console', msg => {
   80 |       if (msg.type() === 'error') {
   81 |         errors.push(msg.text())
   82 |       }
   83 |     })
   84 |     
   85 |     await page.goto('/')
   86 |     
   87 |     // Wait for page to fully load
   88 |     await page.waitForTimeout(3000)
   89 |     
   90 |     // Filter out known acceptable errors (like Spotify API failures)
   91 |     const hydrationErrors = errors.filter(error => 
   92 |       error.includes('Hydration') || 
   93 |       error.includes('Text content does not match') ||
   94 |       error.includes('server rendered HTML')
   95 |     )
   96 |     
   97 |     expect(hydrationErrors).toHaveLength(0)
   98 |   })
   99 |
  100 |   test('page renders without white screen', async ({ page }) => {
> 101 |     await page.goto('/')
      |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3001/
  102 |     
  103 |     // Take a screenshot for visual verification
  104 |     await page.screenshot({ path: 'test-results/homepage-screenshot.png', fullPage: true })
  105 |     
  106 |     // Verify that main content containers have visible content
  107 |     const mainContent = page.locator('main')
  108 |     await expect(mainContent).toBeVisible()
  109 |     
  110 |     // Check that elements don't have opacity: 0 (which would cause white screen)
  111 |     const header = page.locator('header')
  112 |     const headerOpacity = await header.evaluate(el => getComputedStyle(el).opacity)
  113 |     expect(parseFloat(headerOpacity)).toBeGreaterThan(0)
  114 |     
  115 |     const moodSelection = page.locator('[key="mood-selection"]').first()
  116 |     if (await moodSelection.isVisible()) {
  117 |       const selectionOpacity = await moodSelection.evaluate(el => getComputedStyle(el).opacity)
  118 |       expect(parseFloat(selectionOpacity)).toBeGreaterThan(0)
  119 |     }
  120 |   })
  121 | })
```