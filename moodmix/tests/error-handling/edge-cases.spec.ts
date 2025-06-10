import { test, expect } from '@playwright/test'

test.describe('Error Handling and Edge Cases', () => {
  test.describe('Network Error Handling', () => {
    test('should handle API timeout gracefully', async ({ page }) => {
      // Mock API timeout
      await page.route('**/api/mood-to-music', async route => {
        await new Promise(resolve => setTimeout(resolve, 35000)) // Longer than typical timeout
        await route.abort()
      })
      
      await page.goto('/')
      await page.locator('button:has-text("Happy")').first().click()
      
      // Should show timeout error
      await expect(page.locator('text=/timeout|timed out|try again/i')).toBeVisible({ 
        timeout: 40000 
      })
      
      // Should allow retry
      const retryButton = page.locator('button:has-text(/retry|try again/i)')
      await expect(retryButton).toBeVisible()
    })

    test('should handle 500 server errors', async ({ page }) => {
      await page.route('**/api/mood-to-music', route => 
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' })
        })
      )
      
      await page.goto('/')
      await page.locator('button:has-text("Happy")').first().click()
      
      // Should show user-friendly error
      await expect(page.locator('text=/error|something went wrong/i')).toBeVisible()
      
      // Should not show technical details
      const errorText = await page.locator('text=/error/i').textContent()
      expect(errorText).not.toContain('500')
      expect(errorText).not.toContain('stack')
    })

    test('should handle 429 rate limit errors', async ({ page }) => {
      await page.route('**/api/mood-to-music', route => 
        route.fulfill({
          status: 429,
          headers: {
            'Retry-After': '60'
          },
          body: JSON.stringify({ error: 'Rate limit exceeded' })
        })
      )
      
      await page.goto('/')
      await page.locator('button:has-text("Happy")').first().click()
      
      // Should show rate limit message
      await expect(page.locator('text=/rate limit|too many requests|slow down/i')).toBeVisible()
    })

    test('should handle malformed API responses', async ({ page }) => {
      await page.route('**/api/mood-to-music', route => 
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: 'invalid json{{'
        })
      )
      
      await page.goto('/')
      await page.locator('button:has-text("Happy")').first().click()
      
      // Should handle gracefully
      await expect(page.locator('text=/error|failed/i')).toBeVisible()
    })

    test('should handle empty API responses', async ({ page }) => {
      await page.route('**/api/mood-to-music', route => 
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ tracks: [] })
        })
      )
      
      await page.goto('/')
      await page.locator('button:has-text("Happy")').first().click()
      
      // Should show no results message
      await expect(page.locator('text=/no tracks found|no results|try different mood/i')).toBeVisible()
    })
  })

  test.describe('Browser Compatibility', () => {
    test('should handle missing localStorage', async ({ page }) => {
      // Disable localStorage
      await page.addInitScript(() => {
        delete (window as any).localStorage
      })
      
      await page.goto('/')
      
      // App should still function
      await expect(page.locator('h1')).toBeVisible()
      await page.locator('button:has-text("Happy")').first().click()
      
      // Should work without localStorage
      await expect(page.locator('.loading-spinner, .track-card')).toBeVisible({ 
        timeout: 15000 
      })
    })

    test('should handle disabled JavaScript gracefully', async ({ browser }) => {
      const context = await browser.newContext({
        javaScriptEnabled: false
      })
      const page = await context.newPage()
      
      await page.goto('/')
      
      // Should show noscript message or basic functionality
      const content = await page.content()
      expect(content).toContain('MoodMix')
      
      await context.close()
    })

    test('should handle disabled cookies', async ({ browser }) => {
      const context = await browser.newContext({
        acceptDownloads: false,
        bypassCSP: false,
        ignoreHTTPSErrors: false,
        javaScriptEnabled: true,
        permissions: [],
        // Block all cookies
        storageState: {
          cookies: [],
          origins: []
        }
      })
      
      const page = await context.newPage()
      await page.goto('/')
      
      // Should still function
      await expect(page.locator('h1')).toBeVisible()
      
      await context.close()
    })
  })

  test.describe('Concurrent Operations', () => {
    test('should handle rapid mood changes', async ({ page }) => {
      await page.goto('/')
      
      // Rapidly click different moods without waiting
      const clicks = []
      for (let i = 0; i < 10; i++) {
        clicks.push(
          page.locator('button:has-text("Happy")').first().click(),
          page.locator('button:has-text("Sad")').first().click(),
          page.locator('button:has-text("Energetic")').first().click()
        )
      }
      
      await Promise.all(clicks)
      
      // Should not crash and should show some result
      await expect(page.locator('.loading-spinner, .track-card, [data-testid="mood-card"]')).toBeVisible({
        timeout: 10000
      })
    })

    test('should handle multiple YouTube modals', async ({ page }) => {
      await page.goto('/')
      await page.locator('button:has-text("Happy")').first().click()
      await page.waitForSelector('.track-card')
      
      const youtubeButtons = await page.locator('button.bg-red-600').all()
      
      if (youtubeButtons.length >= 2) {
        // Open first modal
        await youtubeButtons[0].click()
        await expect(page.locator('[data-testid="youtube-modal"]')).toBeVisible()
        
        // Try to open second modal without closing first
        await youtubeButtons[1].click()
        
        // Should handle gracefully (close first or prevent second)
        const modalCount = await page.locator('[data-testid="youtube-modal"]').count()
        expect(modalCount).toBeLessThanOrEqual(1)
      }
    })
  })

  test.describe('State Management Edge Cases', () => {
    test('should handle browser back/forward', async ({ page }) => {
      await page.goto('/')
      
      // Select mood
      await page.locator('button:has-text("Happy")').first().click()
      await page.waitForSelector('.track-card')
      
      // Go back
      await page.goBack()
      
      // Should be back at mood selection
      await expect(page.locator('h1')).toContainText(/How are you feeling/i)
      
      // Go forward
      await page.goForward()
      
      // State may or may not be preserved
      await expect(page.locator('.track-card, [data-testid="mood-card"]')).toBeVisible()
    })

    test('should handle page refresh during loading', async ({ page }) => {
      await page.goto('/')
      
      // Start loading
      await page.locator('button:has-text("Happy")').first().click()
      
      // Refresh immediately
      await page.reload()
      
      // Should return to initial state
      await expect(page.locator('h1')).toContainText(/How are you feeling/i)
    })

    test('should handle closing modal with browser back', async ({ page }) => {
      await page.goto('/')
      await page.locator('button:has-text("Happy")').first().click()
      await page.waitForSelector('.track-card')
      
      const youtubeButton = page.locator('button.bg-red-600').first()
      if (await youtubeButton.count() > 0) {
        await youtubeButton.click()
        await expect(page.locator('[data-testid="youtube-modal"]')).toBeVisible()
        
        // Use browser back
        await page.goBack()
        
        // Modal should close
        await expect(page.locator('[data-testid="youtube-modal"]')).not.toBeVisible()
      }
    })
  })

  test.describe('Data Edge Cases', () => {
    test('should handle special characters in track names', async ({ page }) => {
      await page.route('**/api/mood-to-music', route => 
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            tracks: [{
              id: '1',
              name: '♪♫ Test & Track <with> "Special" \'Chars\' €£¥',
              artist: 'Artist & Co.',
              album: 'Album (Deluxe)',
              image: 'test.jpg',
              duration: '3:30',
              spotifyUrl: 'https://open.spotify.com/track/1'
            }]
          })
        })
      )
      
      await page.goto('/')
      await page.locator('button:has-text("Happy")').first().click()
      
      // Should display correctly
      await expect(page.locator('.track-card')).toBeVisible()
      const trackName = await page.locator('.track-card h3').textContent()
      expect(trackName).toContain('Test & Track')
    })

    test('should handle very long track names', async ({ page }) => {
      const longName = 'A'.repeat(200)
      
      await page.route('**/api/mood-to-music', route => 
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            tracks: [{
              id: '1',
              name: longName,
              artist: 'Artist',
              album: 'Album',
              image: 'test.jpg',
              duration: '3:30',
              spotifyUrl: 'https://open.spotify.com/track/1'
            }]
          })
        })
      )
      
      await page.goto('/')
      await page.locator('button:has-text("Happy")').first().click()
      
      // Should handle gracefully (truncate or wrap)
      await expect(page.locator('.track-card')).toBeVisible()
      
      // Check for text overflow handling
      const trackElement = page.locator('.track-card h3').first()
      const overflow = await trackElement.evaluate(el => 
        window.getComputedStyle(el).textOverflow
      )
      
      expect(['ellipsis', 'clip']).toContain(overflow)
    })

    test('should handle missing track data gracefully', async ({ page }) => {
      await page.route('**/api/mood-to-music', route => 
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            tracks: [
              {
                id: '1',
                name: 'Track with missing data',
                artist: null,
                album: undefined,
                image: '',
                duration: null,
                spotifyUrl: null
              },
              {
                id: '2',
                // Minimal valid track
                name: 'Valid Track',
                artist: 'Artist',
                spotifyUrl: 'https://open.spotify.com/track/2'
              }
            ]
          })
        })
      )
      
      await page.goto('/')
      await page.locator('button:has-text("Happy")').first().click()
      
      // Should display tracks without crashing
      await expect(page.locator('.track-card')).toHaveCount(2)
      
      // Should handle missing artist gracefully
      const firstArtist = await page.locator('.track-card').first().locator('p').textContent()
      expect(firstArtist).not.toBe('null')
      expect(firstArtist).not.toBe('undefined')
    })
  })

  test.describe('Performance Edge Cases', () => {
    test('should handle very slow image loading', async ({ page }) => {
      // Delay all images
      await page.route('**/*.jpg', async route => {
        await new Promise(resolve => setTimeout(resolve, 5000))
        await route.continue()
      })
      
      await page.goto('/')
      await page.locator('button:has-text("Happy")').first().click()
      
      // Content should be visible even if images are slow
      await expect(page.locator('.track-card h3')).toBeVisible({ timeout: 10000 })
      
      // Should show image placeholders or loading states
      const images = await page.locator('.track-card img').all()
      for (const img of images) {
        const altText = await img.getAttribute('alt')
        expect(altText).toBeTruthy()
      }
    })

    test('should handle interrupted connections', async ({ page, context }) => {
      await page.goto('/')
      await page.locator('button:has-text("Happy")').first().click()
      
      // Simulate connection interruption
      await context.setOffline(true)
      
      // Wait a bit
      await page.waitForTimeout(2000)
      
      // Restore connection
      await context.setOffline(false)
      
      // App should recover or show appropriate error
      const hasError = await page.locator('text=/error|offline|connection/i').count()
      const hasResults = await page.locator('.track-card').count()
      
      expect(hasError > 0 || hasResults > 0).toBe(true)
    })
  })

  test.describe('Integration Edge Cases', () => {
    test('should handle Spotify API quota exceeded', async ({ page }) => {
      await page.route('**/api/mood-to-music', route => 
        route.fulfill({
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Date.now() + 3600000
          },
          body: JSON.stringify({ 
            error: 'API rate limit exceeded',
            message: 'Too many requests'
          })
        })
      )
      
      await page.goto('/')
      await page.locator('button:has-text("Happy")').first().click()
      
      // Should show appropriate message
      await expect(page.locator('text=/quota|limit|later/i')).toBeVisible()
    })

    test('should handle YouTube embed restrictions', async ({ page }) => {
      // Mock tracks with non-embeddable videos
      await page.route('**/api/mood-to-music', route => 
        route.fulfill({
          status: 200,
          body: JSON.stringify({
            tracks: [{
              id: '1',
              name: 'Restricted Track',
              artist: 'Artist',
              album: 'Album',
              spotifyUrl: 'https://open.spotify.com/track/1',
              youtubeVideoId: 'restricted-video'
            }]
          })
        })
      )
      
      await page.goto('/')
      await page.locator('button:has-text("Happy")').first().click()
      
      // YouTube button might not appear for restricted videos
      const youtubeButton = page.locator('button.bg-red-600')
      const hasYouTube = await youtubeButton.count() > 0
      
      // If YouTube button exists, clicking should handle embed errors
      if (hasYouTube) {
        await youtubeButton.first().click()
        
        // Should handle embed errors gracefully
        const hasError = await page.locator('text=/unavailable|restricted|cannot play/i').count()
        const hasIframe = await page.locator('iframe').count()
        
        expect(hasError > 0 || hasIframe > 0).toBe(true)
      }
    })
  })
})