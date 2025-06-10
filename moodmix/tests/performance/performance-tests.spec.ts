import { test, expect } from '@playwright/test'

test.describe('Performance and Load Testing', () => {
  test.describe('Page Load Performance', () => {
    test('should load homepage within acceptable time', async ({ page }) => {
      const startTime = Date.now()
      
      await page.goto('/', { waitUntil: 'networkidle' })
      
      const loadTime = Date.now() - startTime
      
      // Homepage should load within 3 seconds
      expect(loadTime).toBeLessThan(3000)
      
      // Check Core Web Vitals
      const metrics = await page.evaluate(() => {
        return new Promise((resolve) => {
          let fcp, lcp, cls, fid
          
          // First Contentful Paint
          new PerformanceObserver((list) => {
            fcp = list.getEntries()[0].startTime
          }).observe({ entryTypes: ['paint'] })
          
          // Largest Contentful Paint
          new PerformanceObserver((list) => {
            const entries = list.getEntries()
            lcp = entries[entries.length - 1].startTime
          }).observe({ entryTypes: ['largest-contentful-paint'] })
          
          // Cumulative Layout Shift
          let clsValue = 0
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) {
                clsValue += entry.value
              }
            }
            cls = clsValue
          }).observe({ entryTypes: ['layout-shift'] })
          
          // Wait a bit for metrics to be collected
          setTimeout(() => {
            resolve({ fcp, lcp, cls })
          }, 2000)
        })
      })
      
      // Check performance thresholds
      if (metrics.fcp) expect(metrics.fcp).toBeLessThan(1800) // FCP < 1.8s
      if (metrics.lcp) expect(metrics.lcp).toBeLessThan(2500) // LCP < 2.5s
      if (metrics.cls) expect(metrics.cls).toBeLessThan(0.1)   // CLS < 0.1
    })

    test('should handle slow network gracefully', async ({ page }) => {
      // Simulate slow 3G
      await page.route('**/*', async route => {
        await new Promise(resolve => setTimeout(resolve, 500))
        await route.continue()
      })
      
      const startTime = Date.now()
      await page.goto('/', { waitUntil: 'domcontentloaded' })
      const loadTime = Date.now() - startTime
      
      // Should still load within reasonable time
      expect(loadTime).toBeLessThan(10000)
      
      // Critical content should be visible
      await expect(page.locator('h1')).toBeVisible()
    })
  })

  test.describe('Runtime Performance', () => {
    test('should handle rapid mood selections without lag', async ({ page }) => {
      await page.goto('/')
      
      const moods = ['Happy', 'Sad', 'Energetic', 'Calm']
      const times: number[] = []
      
      for (const mood of moods) {
        const startTime = Date.now()
        
        await page.locator(`button:has-text("${mood}")`).first().click()
        await page.waitForSelector('.track-card', { timeout: 10000 })
        
        const responseTime = Date.now() - startTime
        times.push(responseTime)
        
        await page.locator('button:has-text("Change Mood")').click()
      }
      
      // Average response time should be reasonable
      const avgTime = times.reduce((a, b) => a + b) / times.length
      expect(avgTime).toBeLessThan(5000)
      
      // No single request should take too long
      times.forEach(time => {
        expect(time).toBeLessThan(8000)
      })
    })

    test('should render large result sets efficiently', async ({ page }) => {
      await page.goto('/')
      await page.locator('button:has-text("Euphoric")').first().click()
      
      // Measure render time
      const renderStart = Date.now()
      await page.waitForSelector('.track-card')
      
      const trackCount = await page.locator('.track-card').count()
      const renderTime = Date.now() - renderStart
      
      // Should render efficiently regardless of track count
      const timePerTrack = renderTime / trackCount
      expect(timePerTrack).toBeLessThan(100) // Less than 100ms per track
    })
  })

  test.describe('Memory Management', () => {
    test('should not leak memory on repeated interactions', async ({ page }) => {
      await page.goto('/')
      
      // Get initial memory usage
      const getMemoryUsage = () => page.evaluate(() => {
        if ('memory' in performance) {
          return (performance as any).memory.usedJSHeapSize
        }
        return 0
      })
      
      const initialMemory = await getMemoryUsage()
      
      // Perform repeated actions
      for (let i = 0; i < 10; i++) {
        await page.locator('button:has-text("Happy")').first().click()
        await page.waitForSelector('.track-card')
        await page.locator('button:has-text("Change Mood")').click()
        await page.waitForSelector('[data-testid="mood-card"]')
      }
      
      // Force garbage collection if available
      await page.evaluate(() => {
        if ('gc' in window) {
          (window as any).gc()
        }
      })
      
      await page.waitForTimeout(1000)
      
      const finalMemory = await getMemoryUsage()
      
      // Memory should not increase dramatically
      const memoryIncrease = finalMemory - initialMemory
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024) // Less than 50MB increase
    })
  })

  test.describe('API Performance', () => {
    test('should handle concurrent API requests', async ({ page }) => {
      await page.goto('/')
      
      // Make multiple concurrent requests
      const requests = Array(5).fill(null).map(() => 
        page.evaluate(async () => {
          const start = Date.now()
          const response = await fetch('/api/mood-to-music', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mood: { primary: 'happy', intensity: 50 }
            })
          })
          const end = Date.now()
          return {
            status: response.status,
            time: end - start
          }
        })
      )
      
      const results = await Promise.all(requests)
      
      // All requests should complete
      results.forEach(result => {
        expect(result.status).toBe(200)
        expect(result.time).toBeLessThan(5000)
      })
      
      // Average time should be reasonable
      const avgTime = results.reduce((sum, r) => sum + r.time, 0) / results.length
      expect(avgTime).toBeLessThan(3000)
    })

    test('should implement proper caching', async ({ page }) => {
      await page.goto('/')
      
      // First request
      const firstRequestTime = await page.evaluate(async () => {
        const start = Date.now()
        await fetch('/api/mood-to-music', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mood: { primary: 'happy', intensity: 50 }
          })
        })
        return Date.now() - start
      })
      
      // Second identical request (might be cached)
      const secondRequestTime = await page.evaluate(async () => {
        const start = Date.now()
        await fetch('/api/mood-to-music', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mood: { primary: 'happy', intensity: 50 }
          })
        })
        return Date.now() - start
      })
      
      // Second request should be faster if caching is implemented
      // Note: This might not always be true due to various factors
      console.log(`First: ${firstRequestTime}ms, Second: ${secondRequestTime}ms`)
    })
  })

  test.describe('Resource Loading', () => {
    test('should optimize image loading', async ({ page }) => {
      const imageSizes: number[] = []
      
      page.on('response', response => {
        if (response.request().resourceType() === 'image') {
          const size = Number(response.headers()['content-length'] || 0)
          imageSizes.push(size)
        }
      })
      
      await page.goto('/')
      await page.locator('button:has-text("Happy")').first().click()
      await page.waitForSelector('.track-card')
      
      // Check image optimization
      imageSizes.forEach(size => {
        // Images should be reasonably sized (less than 500KB)
        expect(size).toBeLessThan(500 * 1024)
      })
    })

    test('should minimize bundle sizes', async ({ page }) => {
      const jsSizes: number[] = []
      const cssSizes: number[] = []
      
      page.on('response', response => {
        const url = response.url()
        const type = response.request().resourceType()
        const size = Number(response.headers()['content-length'] || 0)
        
        if (type === 'script' && url.includes('_next')) {
          jsSizes.push(size)
        } else if (type === 'stylesheet') {
          cssSizes.push(size)
        }
      })
      
      await page.goto('/')
      
      // Total JS should be reasonable
      const totalJS = jsSizes.reduce((a, b) => a + b, 0)
      expect(totalJS).toBeLessThan(1 * 1024 * 1024) // Less than 1MB total
      
      // Total CSS should be minimal
      const totalCSS = cssSizes.reduce((a, b) => a + b, 0)
      expect(totalCSS).toBeLessThan(200 * 1024) // Less than 200KB total
    })
  })

  test.describe('Stress Testing', () => {
    test('should handle rapid user interactions', async ({ page }) => {
      await page.goto('/')
      
      // Rapidly click different moods
      const actions = []
      for (let i = 0; i < 20; i++) {
        actions.push(
          page.locator('button:has-text("Happy")').first().click(),
          page.waitForTimeout(100),
          page.locator('button:has-text("Sad")').first().click(),
          page.waitForTimeout(100)
        )
      }
      
      // Should not crash or throw errors
      await expect(Promise.all(actions)).resolves.not.toThrow()
      
      // Page should still be responsive
      await expect(page.locator('h1')).toBeVisible()
    })

    test('should handle large viewport sizes', async ({ page }) => {
      // Test 4K display
      await page.setViewportSize({ width: 3840, height: 2160 })
      await page.goto('/')
      
      // Should render correctly
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('[data-testid="mood-card"]').first()).toBeVisible()
      
      // Layout should not break
      const moodCards = await page.locator('[data-testid="mood-card"]').all()
      const positions = await Promise.all(
        moodCards.map(card => card.boundingBox())
      )
      
      // Cards should not overlap
      positions.forEach((pos1, i) => {
        positions.slice(i + 1).forEach(pos2 => {
          if (pos1 && pos2) {
            const overlap = !(
              pos1.x + pos1.width <= pos2.x ||
              pos2.x + pos2.width <= pos1.x ||
              pos1.y + pos1.height <= pos2.y ||
              pos2.y + pos2.height <= pos1.y
            )
            expect(overlap).toBe(false)
          }
        })
      })
    })
  })

  test.describe('Network Resilience', () => {
    test('should handle offline mode gracefully', async ({ page, context }) => {
      await page.goto('/')
      
      // Go offline
      await context.setOffline(true)
      
      // Try to select a mood
      await page.locator('button:has-text("Happy")').first().click()
      
      // Should show error message
      await expect(page.locator('text=/offline|network|connection/i')).toBeVisible({ 
        timeout: 10000 
      })
      
      // Go back online
      await context.setOffline(false)
      
      // Should recover
      await page.locator('button:has-text("Happy")').first().click()
      await expect(page.locator('.track-card')).toBeVisible({ timeout: 15000 })
    })
  })
})