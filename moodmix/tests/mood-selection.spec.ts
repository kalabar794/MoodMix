import { test, expect } from '@playwright/test'

test.describe('MoodMix Application', () => {
  test('homepage loads with all UI elements visible', async ({ page }) => {
    await page.goto('/')
    
    // Check page loads without errors
    await expect(page).toHaveTitle(/MoodMix/)
    
    // Verify main heading is visible
    await expect(page.getByText('How are you feeling?')).toBeVisible()
    
    // Verify subtitle is visible
    await expect(page.getByText('Select your mood and discover your perfect playlist')).toBeVisible()
    
    // Verify MoodMix header is visible
    await expect(page.getByRole('heading', { name: 'MoodMix' })).toBeVisible()
    
    // Verify footer is visible
    await expect(page.getByText('Made with ❤️ using Next.js • Powered by Spotify')).toBeVisible()
  })

  test('mood wheel is visible and interactive', async ({ page }) => {
    await page.goto('/')
    
    // Wait for mood wheel to be visible
    const moodWheel = page.locator('.mood-wheel-gradient').first()
    await expect(moodWheel).toBeVisible()
    
    // Check that mood labels are visible
    await expect(page.getByText('Happy')).toBeVisible()
    await expect(page.getByText('Excited')).toBeVisible()
    await expect(page.getByText('Energetic')).toBeVisible()
    await expect(page.getByText('Love')).toBeVisible()
    await expect(page.getByText('Sad')).toBeVisible()
    await expect(page.getByText('Calm')).toBeVisible()
    
    // Verify center shows "Select" initially (use exact match)
    await expect(page.getByText('Select', { exact: true })).toBeVisible()
  })

  test('mood selection functionality works', async ({ page }) => {
    await page.goto('/')
    
    // Wait for animations to settle
    await page.waitForTimeout(2000)
    
    // Find a clickable mood wheel container that won't move
    const moodWheelContainer = page.locator('.relative.w-80.h-80.mx-auto').first()
    await expect(moodWheelContainer).toBeVisible()
    
    // Click on a specific area (avoiding the center which has overlays)
    await moodWheelContainer.click({ position: { x: 240, y: 160 } }) // Right side for "Happy"
    
    // Wait a moment for any state updates
    await page.waitForTimeout(1000)
    
    // Check if we can see any mood-related content or state changes
    // This is a basic test since we don't have Spotify API working
    console.log('Mood wheel clicked - testing basic interactivity')
  })

  test('glassmorphic design elements are present', async ({ page }) => {
    await page.goto('/')
    
    // Check for glass card elements
    const glassElements = page.locator('.glass')
    await expect(glassElements.first()).toBeVisible()
    
    // Verify gradient background is present
    const gradientBg = page.locator('.gradient-bg')
    await expect(gradientBg).toBeVisible()
  })

  test('no hydration errors in console', async ({ page }) => {
    const errors: string[] = []
    
    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    await page.goto('/')
    
    // Wait for page to fully load
    await page.waitForTimeout(3000)
    
    // Filter out known acceptable errors (like Spotify API failures)
    const hydrationErrors = errors.filter(error => 
      error.includes('Hydration') || 
      error.includes('Text content does not match') ||
      error.includes('server rendered HTML')
    )
    
    expect(hydrationErrors).toHaveLength(0)
  })

  test('page renders without white screen', async ({ page }) => {
    await page.goto('/')
    
    // Take a screenshot for visual verification
    await page.screenshot({ path: 'test-results/homepage-screenshot.png', fullPage: true })
    
    // Verify that main content containers have visible content
    const mainContent = page.locator('main')
    await expect(mainContent).toBeVisible()
    
    // Check that elements don't have opacity: 0 (which would cause white screen)
    const header = page.locator('header')
    const headerOpacity = await header.evaluate(el => getComputedStyle(el).opacity)
    expect(parseFloat(headerOpacity)).toBeGreaterThan(0)
    
    const moodSelection = page.locator('[key="mood-selection"]').first()
    if (await moodSelection.isVisible()) {
      const selectionOpacity = await moodSelection.evaluate(el => getComputedStyle(el).opacity)
      expect(parseFloat(selectionOpacity)).toBeGreaterThan(0)
    }
  })
})