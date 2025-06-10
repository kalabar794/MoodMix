import { test, expect, Page } from '@playwright/test'

test.describe('Comprehensive User Flow Tests', () => {
  let page: Page

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage()
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test.afterEach(async () => {
    await page.close()
  })

  test('Complete user journey: mood selection to music playback', async () => {
    // 1. Verify landing page loads correctly
    await expect(page).toHaveTitle(/MoodMix/)
    await expect(page.locator('h1')).toContainText(/How are you feeling/i)
    
    // 2. Check all mood cards are visible
    const moodCards = page.locator('[data-testid="mood-card"]')
    await expect(moodCards).toHaveCount(12)
    
    // 3. Select a mood
    const euphoricMood = page.locator('button:has-text("Euphoric")').first()
    await expect(euphoricMood).toBeVisible()
    await euphoricMood.click()
    
    // 4. Wait for results
    await expect(page.locator('.loading-spinner')).toBeVisible()
    await expect(page.locator('.track-card')).toBeVisible({ timeout: 15000 })
    
    // 5. Verify track results
    const tracks = page.locator('.track-card')
    const trackCount = await tracks.count()
    expect(trackCount).toBeGreaterThan(0)
    expect(trackCount).toBeLessThanOrEqual(20)
    
    // 6. Test Spotify button functionality
    const firstSpotifyButton = page.locator('a[href*="spotify.com"]').first()
    await expect(firstSpotifyButton).toBeVisible()
    
    // 7. Test YouTube button (if available)
    const youtubeButton = page.locator('button.bg-red-600').first()
    if (await youtubeButton.count() > 0) {
      await youtubeButton.click()
      
      // Verify modal opens
      await expect(page.locator('[data-testid="youtube-modal"]')).toBeVisible()
      await expect(page.locator('iframe[src*="youtube"]')).toBeVisible()
      
      // Close modal
      await page.keyboard.press('Escape')
      await expect(page.locator('[data-testid="youtube-modal"]')).not.toBeVisible()
    }
    
    // 8. Test mood change
    const changeMoodButton = page.locator('button:has-text("Change Mood")')
    await expect(changeMoodButton).toBeVisible()
    await changeMoodButton.click()
    
    // 9. Verify return to mood selection
    await expect(page.locator('h1')).toContainText(/How are you feeling/i)
  })

  test('Mood intensity slider interaction', async () => {
    // Select mood with intensity control
    const passionateMood = page.locator('button:has-text("Passionate")').first()
    await passionateMood.click()
    
    // If intensity slider exists, test it
    const intensitySlider = page.locator('[data-testid="intensity-slider"]')
    if (await intensitySlider.count() > 0) {
      // Move slider to different positions
      await intensitySlider.evaluate((slider: HTMLInputElement) => {
        slider.value = '25'
        slider.dispatchEvent(new Event('input', { bubbles: true }))
      })
      
      await page.waitForTimeout(500)
      
      await intensitySlider.evaluate((slider: HTMLInputElement) => {
        slider.value = '90'
        slider.dispatchEvent(new Event('input', { bubbles: true }))
      })
    }
  })

  test('Error handling and recovery', async () => {
    // Simulate network error by blocking Spotify API
    await page.route('**/api/mood-to-music', route => {
      route.abort('failed')
    })
    
    // Try to select a mood
    const sereneMood = page.locator('button:has-text("Serene")').first()
    await sereneMood.click()
    
    // Should show error message
    await expect(page.locator('text=/error|failed|try again/i')).toBeVisible({ timeout: 10000 })
    
    // Should be able to try again
    const retryButton = page.locator('button:has-text(/try again|retry/i)')
    if (await retryButton.count() > 0) {
      await retryButton.click()
    }
  })

  test('Responsive design on mobile', async () => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Verify mobile layout
    await expect(page.locator('h1')).toBeVisible()
    
    // Mood cards should still be clickable
    const moodCard = page.locator('button:has-text("Energetic")').first()
    await expect(moodCard).toBeVisible()
    await moodCard.click()
    
    // Results should be visible on mobile
    await expect(page.locator('.track-card').first()).toBeVisible({ timeout: 15000 })
  })

  test('Keyboard navigation', async () => {
    // Tab through mood cards
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Select mood with Enter
    await page.keyboard.press('Enter')
    
    // Wait for results
    await expect(page.locator('.track-card').first()).toBeVisible({ timeout: 15000 })
    
    // Tab to first action button
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Escape should work in modals
    const youtubeButton = page.locator('button.bg-red-600').first()
    if (await youtubeButton.count() > 0) {
      await youtubeButton.click()
      await page.waitForTimeout(1000)
      await page.keyboard.press('Escape')
      await expect(page.locator('[data-testid="youtube-modal"]')).not.toBeVisible()
    }
  })

  test('Multiple mood selections in sequence', async () => {
    const moods = ['Euphoric', 'Melancholic', 'Energetic']
    
    for (const mood of moods) {
      // Select mood
      const moodButton = page.locator(`button:has-text("${mood}")`).first()
      await moodButton.click()
      
      // Wait for results
      await expect(page.locator('.track-card').first()).toBeVisible({ timeout: 15000 })
      
      // Verify results loaded
      const tracks = await page.locator('.track-card').count()
      expect(tracks).toBeGreaterThan(0)
      
      // Go back
      await page.locator('button:has-text("Change Mood")').click()
      await expect(page.locator('h1')).toContainText(/How are you feeling/i)
    }
  })

  test('Theme toggle functionality', async () => {
    const themeToggle = page.locator('[data-testid="theme-toggle"]')
    
    if (await themeToggle.count() > 0) {
      // Get initial theme
      const initialTheme = await page.evaluate(() => 
        document.documentElement.classList.contains('dark')
      )
      
      // Toggle theme
      await themeToggle.click()
      
      // Verify theme changed
      const newTheme = await page.evaluate(() => 
        document.documentElement.classList.contains('dark')
      )
      
      expect(newTheme).not.toBe(initialTheme)
      
      // Toggle back
      await themeToggle.click()
      const finalTheme = await page.evaluate(() => 
        document.documentElement.classList.contains('dark')
      )
      
      expect(finalTheme).toBe(initialTheme)
    }
  })

  test('Track deduplication verification', async () => {
    await page.locator('button:has-text("Happy")').first().click()
    await expect(page.locator('.track-card').first()).toBeVisible({ timeout: 15000 })
    
    // Get all track names
    const trackNames = await page.locator('.track-card h3').allTextContents()
    const artistNames = await page.locator('.track-card p').allTextContents()
    
    // Create track identifiers
    const trackIdentifiers = trackNames.map((name, i) => 
      `${name.toLowerCase()}-${artistNames[i].toLowerCase()}`
    )
    
    // Check for duplicates
    const uniqueTracks = new Set(trackIdentifiers)
    expect(uniqueTracks.size).toBe(trackIdentifiers.length)
  })

  test('Loading states and animations', async () => {
    // Check initial animation
    await expect(page.locator('.mood-card')).toBeVisible()
    
    // Select mood and check loading state
    await page.locator('button:has-text("Mystical")').first().click()
    
    // Should show loading indicator
    const loadingElement = page.locator('.loading-spinner, [data-testid="loading"]')
    await expect(loadingElement).toBeVisible()
    
    // Should hide loading when results appear
    await expect(page.locator('.track-card').first()).toBeVisible({ timeout: 15000 })
    await expect(loadingElement).not.toBeVisible()
  })

  test('Deep linking and URL state', async () => {
    // Select a mood
    await page.locator('button:has-text("Triumphant")').first().click()
    await expect(page.locator('.track-card').first()).toBeVisible({ timeout: 15000 })
    
    // Check if URL updates (if implemented)
    const url = page.url()
    
    // Reload page
    await page.reload()
    
    // Check if state is preserved or returns to home
    const currentUrl = page.url()
    expect(currentUrl).toBe(url)
  })
})