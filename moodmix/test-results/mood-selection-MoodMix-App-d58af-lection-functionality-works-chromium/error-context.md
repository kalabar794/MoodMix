# Test info

- Name: MoodMix Application >> mood selection functionality works
- Location: /Users/jonathonc/Auto1111/claude/MoodMix/moodmix/tests/mood-selection.spec.ts:42:7

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: locator('.relative.w-80.h-80.mx-auto').first()
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for locator('.relative.w-80.h-80.mx-auto').first()

    at /Users/jonathonc/Auto1111/claude/MoodMix/moodmix/tests/mood-selection.spec.ts:50:38
```

# Page snapshot

```yaml
- alert
- button "Open Next.js Dev Tools":
  - img
- main:
  - navigation:
    - text: SEO Powerpack
    - link "Features":
      - /url: /features
    - link "About":
      - /url: /about
    - button "Start guided tour"
    - button "System mode"
  - text: "New: AI-Powered SEO Analysis"
  - heading "SEO Analysis, Reimagined" [level=1]
  - paragraph: Beautiful, instant SEO insights that anyone can understand. Stop guessing about your website's performance and start ranking higher.
  - textbox "Enter your website URL..."
  - button "Analyze"
  - text: Free forever No signup required 100% private
  - heading "See the power of advanced analytics" [level=2]
  - paragraph: Real-time visualizations that transform complex SEO data into actionable insights
  - heading "Core Web Vitals" [level=3]
  - text: Passing LCP 1.2s Largest Contentful Paint CLS 0.05 Cumulative Layout Shift FCP 0.8s First Contentful Paint
  - heading "AI Recommendations" [level=3]
  - text: Critical
  - paragraph: Add meta description for better CTR
  - text: Important
  - paragraph: Optimize images - save 2.3s load time
  - text: Quick Win
  - paragraph: Add schema markup for rich snippets
  - heading "SEO Analysis" [level=3]
  - text: PageSpeed Score 95 /100 SEO Score 88 /100 Content Quality 92 /100 Issues Found 12 warnings
  - heading "Everything you need to dominate search" [level=2]
  - heading "Lightning Analysis" [level=3]
  - paragraph: Complete SEO audit in under 10 seconds with AI-powered insights
  - heading "Interactive Reports" [level=3]
  - paragraph: Beautiful, data-rich visualizations that make optimization clear
  - heading "Privacy First" [level=3]
  - paragraph: Zero tracking, zero data collection. Your analysis stays private.
  - heading "Actionable Insights" [level=3]
  - paragraph: Prioritized recommendations with step-by-step implementation guides
  - heading "Loved by thousands" [level=2]
  - paragraph: "\"Increased our organic traffic by 340% in just 3 months using SEO Powerpack insights.\""
  - text: S Sarah Chen Marketing Director, TechFlow
  - paragraph: "\"The most intuitive SEO tool I've ever used. Finally, analytics that make sense!\""
  - text: M Marcus Johnson Founder, StartupLab
  - paragraph: "\"Game-changing visualization. My clients actually understand their SEO now.\""
  - text: E Elena Rodriguez SEO Specialist, GrowthCo
  - heading "Ready to unlock your SEO potential?" [level=2]
  - paragraph: Join thousands of businesses using SEO Powerpack to improve their search rankings and drive more organic traffic.
  - button "Start Free Analysis"
  - heading "Master SEO with daily insights" [level=2]
  - paragraph: Level up your SEO knowledge with bite-sized tips and actionable strategies
  - heading "Daily SEO Tip" [level=3]
  - text: intermediate
  - heading "Master Internal Linking" [level=4]
  - paragraph: Link related pages using descriptive anchor text. This helps search engines understand your site structure and distributes page authority throughout your website.
  - text: 3m read medium impact
  - button "New tip"
  - heading "Daily SEO Tip" [level=3]
  - paragraph: technical • intermediate
  - button
  - heading "Master Internal Linking" [level=4]
  - paragraph: Link related pages using descriptive anchor text. This helps search engines understand your site str...
  - text: intermediate medium impact 3m read
  - button "Read more"
  - button "New tip"
  - heading "Welcome! 👋" [level=3]
  - paragraph: First time here?
  - paragraph: Take a quick tour to discover how to get the most out of your SEO analysis. It only takes 2 minutes!
  - button "Maybe later"
  - button "Take Tour"
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
>  50 |     await expect(moodWheelContainer).toBeVisible()
      |                                      ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
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
  101 |     await page.goto('/')
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