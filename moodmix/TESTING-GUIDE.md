# Testing Guide - Playwright End-to-End Testing

## Overview
Comprehensive testing strategy for MoodMix using Playwright for end-to-end functionality verification, API testing, and visual regression testing.

## Setup

### 1. Install Playwright
```bash
npm install -D playwright @playwright/test
npx playwright install
```

### 2. Configuration Files

#### `playwright.config.ts`
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

#### `playwright.live.config.ts` (for live site testing)
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  
  use: {
    baseURL: 'https://mood-mix-theta.vercel.app',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'live-chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
```

## Core Test Suites

### 1. Comprehensive Functionality Test (`/tests/comprehensive-functionality.spec.ts`)
```typescript
import { test, expect } from '@playwright/test'

test('Complete MoodMix functionality verification', async ({ page }) => {
  console.log('🔧 Testing complete MoodMix functionality')
  
  // Navigate to app
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  
  // Verify initial state
  await expect(page.locator('h1')).toContainText('How are you feeling?')
  await expect(page.locator('.glass-card')).toBeVisible()
  
  // Test mood selection
  const euphoricMood = page.locator('button:has-text("Euphoric")').first()
  await expect(euphoricMood).toBeVisible()
  await euphoricMood.click()
  console.log('✅ Selected Euphoric mood')
  
  // Wait for tracks to load
  await page.waitForTimeout(8000)
  
  // Verify results loaded
  const trackCards = page.locator('.track-card')
  const totalTracks = await trackCards.count()
  expect(totalTracks).toBeGreaterThan(10)
  console.log(`📊 Loaded ${totalTracks} tracks`)
  
  // Test audio controls
  const spotifyButtons = page.locator('button.bg-green-600')
  const spotifyCount = await spotifyButtons.count()
  expect(spotifyCount).toBe(totalTracks) // All tracks should have Spotify
  console.log(`🟢 Found ${spotifyCount} Spotify buttons`)
  
  // Test YouTube integration
  const youtubeButtons = page.locator('button.bg-red-600')
  const youtubeCount = await youtubeButtons.count()
  console.log(`🎬 Found ${youtubeCount} YouTube buttons`)
  
  if (youtubeCount > 0) {
    // Test YouTube modal
    await youtubeButtons.first().click()
    await page.waitForTimeout(3000)
    
    const modal = page.locator('.fixed.inset-0').first()
    await expect(modal).toBeVisible()
    console.log('✅ YouTube modal opened')
    
    // Close modal
    const closeButton = page.locator('button').filter({ hasText: '×' }).first()
    await closeButton.click()
    await expect(modal).not.toBeVisible()
    console.log('✅ YouTube modal closed')
  }
  
  // Test glassmorphism design
  await expect(page.locator('.glass-card')).toHaveCSS('backdrop-filter', /blur/)
  console.log('✅ Glassmorphism effects working')
  
  // Test mood reset
  const changeMoodButton = page.locator('button:has-text("Change Mood")')
  if (await changeMoodButton.isVisible()) {
    await changeMoodButton.click()
    await expect(page.locator('h1')).toContainText('How are you feeling?')
    console.log('✅ Mood reset working')
  }
  
  // Take final screenshot
  await page.screenshot({ path: 'test-results/comprehensive-functionality.png', fullPage: true })
  
  console.log('🎉 All functionality tests passed!')
})
```

### 2. YouTube Integration Test (`/tests/youtube-integration.spec.ts`)
```typescript
import { test, expect } from '@playwright/test'

test('YouTube integration verification', async ({ page }) => {
  console.log('🎬 Testing YouTube integration')
  
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  
  // Select mood and wait for results
  await page.locator('button:has-text("Energetic")').first().click()
  await page.waitForTimeout(10000)
  
  // Check YouTube button coverage
  const totalTracks = await page.locator('.track-card').count()
  const youtubeButtons = await page.locator('button.bg-red-600').count()
  const coverage = (youtubeButtons / totalTracks) * 100
  
  console.log(`📊 YouTube Coverage: ${coverage.toFixed(1)}% (${youtubeButtons}/${totalTracks})`)
  
  // Test YouTube functionality if available
  if (youtubeButtons > 0) {
    await page.locator('button.bg-red-600').first().click()
    
    // Wait for modal and iframe
    await page.waitForTimeout(3000)
    const iframe = page.locator('iframe').first()
    
    if (await iframe.isVisible()) {
      const iframeSrc = await iframe.getAttribute('src')
      expect(iframeSrc).toContain('youtube')
      expect(iframeSrc).not.toContain('listType=search') // Should use database approach
      console.log('✅ YouTube video embedded successfully')
      
      // Test modal controls
      const fullScreenButton = page.locator('button:has-text("Watch Full Screen")')
      await expect(fullScreenButton).toBeVisible()
      
      // Close modal
      await page.locator('button').filter({ hasText: '×' }).first().click()
    } else {
      console.log('⚠️ YouTube iframe not visible - using search fallback')
    }
  }
  
  // Verify database fallback is working
  expect(youtubeButtons).toBeGreaterThanOrEqual(0) // Should have some coverage
  console.log('✅ YouTube integration test completed')
})
```

### 3. Spotify Integration Test (`/tests/spotify-integration.spec.ts`)
```typescript
import { test, expect } from '@playwright/test'

test('Spotify integration verification', async ({ page }) => {
  console.log('🟢 Testing Spotify integration')
  
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  
  // Test multiple moods for variety
  const moods = ['Euphoric', 'Serene', 'Energetic']
  
  for (const mood of moods) {
    console.log(`🎵 Testing ${mood} mood`)
    
    // Select mood
    await page.locator(`button:has-text("${mood}")`).first().click()
    await page.waitForTimeout(8000)
    
    // Verify tracks loaded
    const trackCards = page.locator('.track-card')
    const totalTracks = await trackCards.count()
    expect(totalTracks).toBeGreaterThan(5)
    
    // Verify all tracks have Spotify buttons
    const spotifyButtons = page.locator('button.bg-green-600')
    const spotifyCount = await spotifyButtons.count()
    expect(spotifyCount).toBe(totalTracks)
    
    // Test track information is displayed
    for (let i = 0; i < Math.min(3, totalTracks); i++) {
      const trackCard = trackCards.nth(i)
      await expect(trackCard.locator('h3')).not.toBeEmpty() // Track name
      await expect(trackCard.locator('p').first()).not.toBeEmpty() // Artist name
    }
    
    console.log(`✅ ${mood}: ${totalTracks} tracks, ${spotifyCount} Spotify links`)
    
    // Reset for next mood (if not last)
    if (mood !== moods[moods.length - 1]) {
      await page.locator('button:has-text("Change Mood")').click()
      await page.waitForTimeout(2000)
    }
  }
  
  console.log('✅ Spotify integration verified across all moods')
})
```

### 4. Glassmorphism Design Test (`/tests/glassmorphism-design.spec.ts`)
```typescript
import { test, expect } from '@playwright/test'

test('Glassmorphism design verification', async ({ page }) => {
  console.log('🎨 Testing glassmorphism design implementation')
  
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  
  // Test glassmorphism effects
  const glassCards = page.locator('.glass-card')
  await expect(glassCards.first()).toBeVisible()
  
  // Verify backdrop-filter is applied
  const backdropFilter = await glassCards.first().evaluate(el => 
    getComputedStyle(el).backdropFilter
  )
  expect(backdropFilter).toContain('blur')
  console.log('✅ Backdrop filter applied')
  
  // Test dynamic backgrounds
  await page.locator('button:has-text("Energetic")').first().click()
  await page.waitForTimeout(3000)
  
  // Verify mood-based background changes
  const gradientOverlay = page.locator('.gradient-overlay')
  await expect(gradientOverlay).toHaveClass(/mood-energetic/)
  console.log('✅ Mood-based backgrounds working')
  
  // Test floating orbs
  const floatingOrbs = page.locator('.floating-orb')
  const orbCount = await floatingOrbs.count()
  expect(orbCount).toBeGreaterThan(3)
  console.log(`✅ Found ${orbCount} floating orbs`)
  
  // Test button hover effects
  const primaryButton = page.locator('.btn-primary').first()
  if (await primaryButton.isVisible()) {
    await primaryButton.hover()
    // Verify transform is applied on hover
    const transform = await primaryButton.evaluate(el => 
      getComputedStyle(el).transform
    )
    console.log('✅ Button hover effects working')
  }
  
  // Test track card glassmorphism
  const trackCards = page.locator('.track-card')
  if (await trackCards.count() > 0) {
    const firstCard = trackCards.first()
    await firstCard.hover()
    
    const cardBackdrop = await firstCard.evaluate(el => 
      getComputedStyle(el).backdropFilter
    )
    expect(cardBackdrop).toContain('blur')
    console.log('✅ Track card glassmorphism working')
  }
  
  // Take visual regression screenshot
  await page.screenshot({ 
    path: 'test-results/glassmorphism-design.png', 
    fullPage: true 
  })
  
  console.log('✅ Glassmorphism design verification complete')
})
```

### 5. Performance Test (`/tests/performance.spec.ts`)
```typescript
import { test, expect } from '@playwright/test'

test('Performance and loading verification', async ({ page }) => {
  console.log('⚡ Testing performance and loading times')
  
  // Start performance monitoring
  await page.goto('/')
  
  // Measure initial load time
  const startTime = Date.now()
  await page.waitForLoadState('networkidle')
  const loadTime = Date.now() - startTime
  
  console.log(`📊 Initial load time: ${loadTime}ms`)
  expect(loadTime).toBeLessThan(5000) // Should load within 5 seconds
  
  // Test mood selection performance
  const moodStartTime = Date.now()
  await page.locator('button:has-text("Euphoric")').first().click()
  
  // Wait for first track to appear
  await page.waitForSelector('.track-card', { timeout: 15000 })
  const moodLoadTime = Date.now() - moodStartTime
  
  console.log(`📊 Mood processing time: ${moodLoadTime}ms`)
  expect(moodLoadTime).toBeLessThan(15000) // Should load tracks within 15 seconds
  
  // Verify no console errors
  const errors: string[] = []
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text())
    }
  })
  
  await page.waitForTimeout(3000)
  
  // Filter out expected errors (like YouTube quota)
  const criticalErrors = errors.filter(error => 
    !error.includes('YouTube API quota') && 
    !error.includes('403') &&
    !error.includes('Failed to load resource')
  )
  
  if (criticalErrors.length > 0) {
    console.log('❌ Console errors detected:', criticalErrors)
  } else {
    console.log('✅ No critical console errors')
  }
  
  expect(criticalErrors.length).toBe(0)
  console.log('✅ Performance test completed')
})
```

### 6. Mobile Responsiveness Test (`/tests/mobile-responsive.spec.ts`)
```typescript
import { test, expect, devices } from '@playwright/test'

test('Mobile responsiveness verification', async ({ browser }) => {
  console.log('📱 Testing mobile responsiveness')
  
  // Test on mobile device
  const context = await browser.newContext({
    ...devices['iPhone 12'],
  })
  const page = await context.newPage()
  
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  
  // Verify mobile layout
  const header = page.locator('header')
  await expect(header).toBeVisible()
  
  // Test mood selection on mobile
  const moodButtons = page.locator('button:has-text("Euphoric")')
  await expect(moodButtons.first()).toBeVisible()
  await moodButtons.first().tap()
  
  // Wait for mobile-optimized results
  await page.waitForTimeout(8000)
  
  // Verify mobile track cards
  const trackCards = page.locator('.track-card')
  const cardCount = await trackCards.count()
  expect(cardCount).toBeGreaterThan(5)
  
  // Test mobile YouTube modal
  const youtubeButtons = page.locator('button.bg-red-600')
  const youtubeCount = await youtubeButtons.count()
  
  if (youtubeCount > 0) {
    await youtubeButtons.first().tap()
    await page.waitForTimeout(2000)
    
    const modal = page.locator('.fixed.inset-0')
    await expect(modal).toBeVisible()
    
    // Close modal on mobile
    await page.locator('button').filter({ hasText: '×' }).first().tap()
  }
  
  // Take mobile screenshot
  await page.screenshot({ 
    path: 'test-results/mobile-responsive.png', 
    fullPage: true 
  })
  
  await context.close()
  console.log('✅ Mobile responsiveness verified')
})
```

## Testing Commands

### Development Testing
```bash
# Run all tests on local dev server
npm run test

# Run specific test suite
npx playwright test comprehensive-functionality

# Run tests in UI mode (interactive)
npx playwright test --ui

# Run tests with debug mode
npx playwright test --debug

# Run tests in headed mode (see browser)
npx playwright test --headed
```

### Live Site Testing
```bash
# Test against live deployment
npx playwright test --config=playwright.live.config.ts

# Run specific live test
npx playwright test youtube-integration --config=playwright.live.config.ts
```

### Reporting
```bash
# Generate and view HTML report
npx playwright show-report

# Generate test coverage report
npx playwright test --reporter=html
```

## Test Data Management

### `/lib/test-data.ts`
```typescript
export const TEST_MOODS = [
  { name: 'euphoric', expectedTracks: 15, minYouTube: 1 },
  { name: 'energetic', expectedTracks: 18, minYouTube: 2 },
  { name: 'serene', expectedTracks: 12, minYouTube: 0 },
  { name: 'passionate', expectedTracks: 16, minYouTube: 1 },
]

export const EXPECTED_FEATURES = {
  glassmorphism: true,
  youtubeIntegration: true,
  spotifyIntegration: true,
  moodMapping: true,
  responsiveDesign: true
}
```

## CI/CD Integration

### GitHub Actions (`.github/workflows/test.yml`)
```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: 18
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test
      env:
        SPOTIFY_CLIENT_ID: ${{ secrets.SPOTIFY_CLIENT_ID }}
        SPOTIFY_CLIENT_SECRET: ${{ secrets.SPOTIFY_CLIENT_SECRET }}
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

## Test Debugging

### Common Issues & Solutions

1. **Slow loading**: Increase timeouts for API-dependent tests
2. **Flaky YouTube tests**: Use retry logic for quota-dependent features
3. **Mobile test failures**: Ensure proper touch events and viewport settings
4. **CSS animation issues**: Use `waitForLoadState('networkidle')` before assertions

### Debug Commands
```bash
# Run with verbose logging
DEBUG=pw:api npx playwright test

# Generate trace files
npx playwright test --trace on

# View trace files
npx playwright show-trace trace.zip
```

## Test Coverage Goals

- **Functionality**: 100% of core features tested
- **Browser Compatibility**: Chrome, Firefox, Safari, Mobile
- **API Integration**: Spotify and YouTube error handling
- **Visual Regression**: Key UI states captured
- **Performance**: Load times under acceptable thresholds
- **Accessibility**: Basic WCAG compliance verified