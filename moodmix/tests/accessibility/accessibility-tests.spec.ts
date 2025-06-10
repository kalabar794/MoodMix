import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y } from 'axe-playwright'

test.describe('Accessibility Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await injectAxe(page)
  })

  test.describe('WCAG Compliance', () => {
    test('homepage should have no accessibility violations', async ({ page }) => {
      await checkA11y(page, null, {
        detailedReport: true,
        detailedReportOptions: {
          html: true
        }
      })
    })

    test('mood selection view should be accessible', async ({ page }) => {
      await checkA11y(page, '[data-testid="mood-selector"]', {
        detailedReport: true
      })
    })

    test('results view should be accessible', async ({ page }) => {
      await page.locator('button:has-text("Happy")').first().click()
      await page.waitForSelector('.track-card')
      
      await checkA11y(page, '[data-testid="results-view"]', {
        detailedReport: true
      })
    })
  })

  test.describe('Keyboard Navigation', () => {
    test('should navigate entire app with keyboard only', async ({ page }) => {
      // Start at the top
      await page.keyboard.press('Tab')
      
      // Should focus on first interactive element
      const firstFocused = await page.evaluate(() => 
        document.activeElement?.tagName
      )
      expect(['BUTTON', 'A', 'INPUT']).toContain(firstFocused)
      
      // Navigate through mood cards
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab')
        
        const focused = await page.evaluate(() => ({
          tag: document.activeElement?.tagName,
          text: document.activeElement?.textContent,
          visible: document.activeElement?.checkVisibility()
        }))
        
        expect(focused.visible).toBe(true)
      }
      
      // Select a mood with Enter
      await page.keyboard.press('Enter')
      
      // Should load results
      await expect(page.locator('.track-card')).toBeVisible({ timeout: 15000 })
      
      // Navigate through results
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      
      // Should be able to activate buttons
      const spotifyLink = await page.evaluate(() => 
        document.activeElement?.getAttribute('href')
      )
      
      if (spotifyLink) {
        expect(spotifyLink).toContain('spotify.com')
      }
    })

    test('should handle focus trapping in modals', async ({ page }) => {
      await page.locator('button:has-text("Happy")').first().click()
      await page.waitForSelector('.track-card')
      
      // Open YouTube modal if available
      const youtubeButton = page.locator('button.bg-red-600').first()
      if (await youtubeButton.count() > 0) {
        await youtubeButton.click()
        await page.waitForSelector('[data-testid="youtube-modal"]')
        
        // Tab should cycle within modal
        const focusableElements = await page.evaluate(() => {
          const modal = document.querySelector('[data-testid="youtube-modal"]')
          const focusable = modal?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
          return focusable?.length || 0
        })
        
        // Tab through all elements in modal
        for (let i = 0; i < focusableElements + 1; i++) {
          await page.keyboard.press('Tab')
        }
        
        // Should cycle back to first element
        const focusedInModal = await page.evaluate(() => {
          const modal = document.querySelector('[data-testid="youtube-modal"]')
          return modal?.contains(document.activeElement)
        })
        
        expect(focusedInModal).toBe(true)
        
        // Escape should close modal
        await page.keyboard.press('Escape')
        await expect(page.locator('[data-testid="youtube-modal"]')).not.toBeVisible()
      }
    })

    test('should have visible focus indicators', async ({ page }) => {
      // Tab to first button
      await page.keyboard.press('Tab')
      
      // Check focus styles
      const focusStyles = await page.evaluate(() => {
        const element = document.activeElement
        if (!element) return null
        
        const styles = window.getComputedStyle(element)
        return {
          outline: styles.outline,
          outlineWidth: styles.outlineWidth,
          outlineColor: styles.outlineColor,
          boxShadow: styles.boxShadow
        }
      })
      
      // Should have visible focus indicator
      expect(
        focusStyles?.outline !== 'none' || 
        focusStyles?.boxShadow !== 'none'
      ).toBe(true)
    })
  })

  test.describe('Screen Reader Support', () => {
    test('should have proper ARIA labels', async ({ page }) => {
      // Check mood cards
      const moodCards = await page.locator('[data-testid="mood-card"]').all()
      
      for (const card of moodCards) {
        const ariaLabel = await card.getAttribute('aria-label')
        const role = await card.getAttribute('role')
        
        expect(ariaLabel || await card.textContent()).toBeTruthy()
        expect(['button', 'link']).toContain(role)
      }
      
      // Check main navigation
      const nav = page.locator('nav')
      if (await nav.count() > 0) {
        const navLabel = await nav.getAttribute('aria-label')
        expect(navLabel).toBeTruthy()
      }
    })

    test('should announce loading states', async ({ page }) => {
      await page.locator('button:has-text("Happy")').first().click()
      
      // Check for loading announcement
      const loadingElement = page.locator('[aria-live="polite"], [aria-live="assertive"]')
      
      if (await loadingElement.count() > 0) {
        const loadingText = await loadingElement.textContent()
        expect(loadingText).toContain('loading')
      }
    })

    test('should have descriptive page title', async ({ page }) => {
      const title = await page.title()
      expect(title).not.toBe('')
      expect(title).toContain('MoodMix')
      
      // Title should update based on state
      await page.locator('button:has-text("Happy")').first().click()
      await page.waitForSelector('.track-card')
      
      // Could check if title updates to reflect current view
    })

    test('should use semantic HTML', async ({ page }) => {
      // Check for proper heading hierarchy
      const headings = await page.evaluate(() => {
        const h1 = document.querySelectorAll('h1').length
        const h2 = document.querySelectorAll('h2').length
        const h3 = document.querySelectorAll('h3').length
        
        return { h1, h2, h3 }
      })
      
      // Should have exactly one h1
      expect(headings.h1).toBe(1)
      
      // Check for main landmark
      const hasMain = await page.locator('main').count()
      expect(hasMain).toBeGreaterThan(0)
      
      // Check for proper list usage
      const trackList = page.locator('.track-list, [role="list"]')
      if (await trackList.count() > 0) {
        const listItems = await trackList.locator('li, [role="listitem"]').count()
        expect(listItems).toBeGreaterThan(0)
      }
    })
  })

  test.describe('Color Contrast', () => {
    test('should have sufficient color contrast', async ({ page }) => {
      // This test would use axe-core's color contrast checks
      await checkA11y(page, null, {
        rules: {
          'color-contrast': { enabled: true }
        }
      })
    })

    test('should not rely solely on color', async ({ page }) => {
      // Check that interactive elements have more than just color changes
      const buttons = await page.locator('button').all()
      
      for (const button of buttons.slice(0, 5)) {
        const text = await button.textContent()
        const hasIcon = await button.locator('svg, img').count()
        
        // Should have text or icon, not just color
        expect(text || hasIcon).toBeTruthy()
      }
    })
  })

  test.describe('Form Accessibility', () => {
    test('should have accessible form controls', async ({ page }) => {
      // Check intensity slider if it exists
      const slider = page.locator('input[type="range"]')
      
      if (await slider.count() > 0) {
        const label = await slider.getAttribute('aria-label')
        const labelledBy = await slider.getAttribute('aria-labelledby')
        
        expect(label || labelledBy).toBeTruthy()
        
        // Check min/max values
        const min = await slider.getAttribute('min')
        const max = await slider.getAttribute('max')
        
        expect(min).toBeDefined()
        expect(max).toBeDefined()
      }
    })

    test('should provide error feedback accessibly', async ({ page }) => {
      // Force an error
      await page.route('**/api/mood-to-music', route => 
        route.fulfill({ status: 500, body: 'Error' })
      )
      
      await page.locator('button:has-text("Happy")').first().click()
      
      // Check error message
      const errorMessage = await page.locator('[role="alert"], [aria-live="assertive"]')
      
      if (await errorMessage.count() > 0) {
        const errorText = await errorMessage.textContent()
        expect(errorText).toBeTruthy()
      }
    })
  })

  test.describe('Media Accessibility', () => {
    test('should have accessible images', async ({ page }) => {
      await page.locator('button:has-text("Happy")').first().click()
      await page.waitForSelector('.track-card')
      
      const images = await page.locator('img').all()
      
      for (const img of images) {
        const alt = await img.getAttribute('alt')
        const role = await img.getAttribute('role')
        
        // Should have alt text or be marked as decorative
        expect(alt !== null || role === 'presentation').toBe(true)
        
        // Alt text should not be filename
        if (alt) {
          expect(alt).not.toMatch(/\.(jpg|png|gif|svg)$/i)
        }
      }
    })

    test('should handle video content accessibly', async ({ page }) => {
      // Check YouTube player if present
      await page.locator('button:has-text("Happy")').first().click()
      await page.waitForSelector('.track-card')
      
      const youtubeButton = page.locator('button.bg-red-600').first()
      if (await youtubeButton.count() > 0) {
        await youtubeButton.click()
        
        // Check iframe title
        const iframe = page.locator('iframe')
        const title = await iframe.getAttribute('title')
        
        expect(title).toBeTruthy()
        expect(title).not.toBe('YouTube video player') // Should be descriptive
      }
    })
  })

  test.describe('Responsive Accessibility', () => {
    test('should remain accessible on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      
      // Run accessibility checks
      await checkA11y(page)
      
      // Check touch targets
      const buttons = await page.locator('button').all()
      
      for (const button of buttons.slice(0, 5)) {
        const box = await button.boundingBox()
        
        // Touch targets should be at least 44x44 pixels
        if (box) {
          expect(box.width).toBeGreaterThanOrEqual(44)
          expect(box.height).toBeGreaterThanOrEqual(44)
        }
      }
    })

    test('should handle zoom without horizontal scroll', async ({ page }) => {
      // Zoom to 200%
      await page.evaluate(() => {
        document.body.style.zoom = '2'
      })
      
      // Check for horizontal scroll
      const hasHorizontalScroll = await page.evaluate(() => 
        document.documentElement.scrollWidth > document.documentElement.clientWidth
      )
      
      expect(hasHorizontalScroll).toBe(false)
    })
  })

  test.describe('Motion and Animation', () => {
    test('should respect prefers-reduced-motion', async ({ page }) => {
      // Enable reduced motion
      await page.emulateMedia({ reducedMotion: 'reduce' })
      
      // Check that animations are reduced
      const animationDurations = await page.evaluate(() => {
        const elements = document.querySelectorAll('*')
        const durations: string[] = []
        
        elements.forEach(el => {
          const duration = window.getComputedStyle(el).animationDuration
          if (duration && duration !== '0s') {
            durations.push(duration)
          }
        })
        
        return durations
      })
      
      // Animations should be disabled or very short
      animationDurations.forEach(duration => {
        const seconds = parseFloat(duration)
        expect(seconds).toBeLessThanOrEqual(0.1)
      })
    })
  })
})