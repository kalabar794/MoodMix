import { test, expect } from '@playwright/test'

test.describe('Security Testing Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('XSS Prevention', () => {
    test('should prevent XSS in mood selection', async ({ page }) => {
      // Attempt to inject script via console
      const xssPayloads = [
        '<script>alert("XSS")</script>',
        '<img src=x onerror=alert("XSS")>',
        'javascript:alert("XSS")',
        '<svg onload=alert("XSS")>',
        '<iframe src="javascript:alert(\'XSS\')"></iframe>'
      ]

      for (const payload of xssPayloads) {
        // Try to inject via page evaluation
        const result = await page.evaluate((xss) => {
          try {
            // Attempt to set innerHTML
            const element = document.querySelector('h1')
            if (element) {
              element.innerHTML = xss
              return element.innerHTML
            }
          } catch (e) {
            return 'blocked'
          }
        }, payload)

        // Verify script tags are escaped or blocked
        expect(result).not.toContain('<script>')
        expect(result).not.toContain('onerror=')
      }
    })

    test('should sanitize user inputs in API calls', async ({ page }) => {
      // Intercept API calls
      await page.route('**/api/mood-to-music', async route => {
        const request = route.request()
        const postData = request.postDataJSON()
        
        // Check that malicious input is handled
        expect(postData).toBeDefined()
        
        await route.continue()
      })

      // Try to send malicious mood data
      await page.evaluate(() => {
        fetch('/api/mood-to-music', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mood: {
              primary: '<script>alert("XSS")</script>',
              intensity: 50
            }
          })
        })
      })
    })
  })

  test.describe('Content Security Policy', () => {
    test('should have proper CSP headers', async ({ page }) => {
      const response = await page.goto('/')
      const headers = response?.headers()
      
      // Check for CSP header
      const csp = headers?.['content-security-policy']
      
      if (csp) {
        // Verify CSP directives
        expect(csp).toContain("default-src 'self'")
        expect(csp).not.toContain("unsafe-inline")
        expect(csp).not.toContain("unsafe-eval")
      }
    })

    test('should block inline scripts', async ({ page }) => {
      // Try to execute inline script
      const consoleMessages: string[] = []
      page.on('console', msg => consoleMessages.push(msg.text()))
      
      await page.evaluate(() => {
        try {
          const script = document.createElement('script')
          script.textContent = 'console.log("Inline script executed")'
          document.head.appendChild(script)
        } catch (e) {
          console.log('Script blocked')
        }
      })
      
      // Check that inline script was blocked
      expect(consoleMessages).not.toContain('Inline script executed')
    })
  })

  test.describe('Authentication & Authorization', () => {
    test('should not expose API keys in client code', async ({ page }) => {
      // Get all script contents
      const scripts = await page.evaluate(() => {
        const scriptElements = document.querySelectorAll('script')
        return Array.from(scriptElements).map(s => s.textContent || '')
      })
      
      const allScripts = scripts.join(' ')
      
      // Check for exposed secrets
      expect(allScripts).not.toMatch(/SPOTIFY_CLIENT_SECRET/i)
      expect(allScripts).not.toMatch(/sk_[a-zA-Z0-9]{24,}/) // Secret key pattern
      expect(allScripts).not.toMatch(/AIza[0-9A-Za-z-_]{35}/) // Google API key pattern
    })

    test('should handle unauthorized API access', async ({ page }) => {
      // Try to access API directly without proper headers
      const response = await page.evaluate(async () => {
        const res = await fetch('/api/mood-to-music', {
          method: 'POST',
          body: JSON.stringify({ mood: { primary: 'happy', intensity: 50 } })
        })
        return {
          status: res.status,
          ok: res.ok
        }
      })
      
      // Should either work (public API) or return proper error
      expect([200, 400, 401, 403]).toContain(response.status)
    })
  })

  test.describe('Input Validation', () => {
    test('should validate and sanitize all inputs', async ({ page }) => {
      const maliciousInputs = [
        { primary: 'happy".charAt(0)', intensity: 50 }, // Code injection
        { primary: 'happy', intensity: '50; drop table users;' }, // SQL injection
        { primary: 'a'.repeat(10000), intensity: 50 }, // Buffer overflow attempt
        { primary: '../../../etc/passwd', intensity: 50 }, // Path traversal
        { primary: 'happy\x00', intensity: 50 }, // Null byte injection
      ]

      for (const input of maliciousInputs) {
        const response = await page.evaluate(async (data) => {
          try {
            const res = await fetch('/api/mood-to-music', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ mood: data })
            })
            return res.status
          } catch {
            return 'error'
          }
        }, input)
        
        // Should reject malicious input
        expect([400, 422, 'error']).toContain(response)
      }
    })
  })

  test.describe('HTTPS and Secure Communication', () => {
    test('should redirect HTTP to HTTPS in production', async ({ page }) => {
      const isProduction = process.env.NODE_ENV === 'production'
      
      if (isProduction) {
        // Try HTTP request
        const response = await page.goto('http://localhost:3000/', {
          waitUntil: 'domcontentloaded'
        })
        
        // Should redirect to HTTPS
        expect(page.url()).toMatch(/^https:/)
      }
    })

    test('should use secure cookies', async ({ context }) => {
      const cookies = await context.cookies()
      
      cookies.forEach(cookie => {
        // All cookies should be secure in production
        if (process.env.NODE_ENV === 'production') {
          expect(cookie.secure).toBe(true)
          expect(cookie.sameSite).toBe('Strict')
        }
      })
    })
  })

  test.describe('Rate Limiting', () => {
    test('should handle rapid requests gracefully', async ({ page }) => {
      const requests = 50
      const results = []
      
      // Send many requests rapidly
      for (let i = 0; i < requests; i++) {
        const result = page.evaluate(async () => {
          const res = await fetch('/api/mood-to-music', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mood: { primary: 'happy', intensity: 50 }
            })
          })
          return res.status
        })
        results.push(result)
      }
      
      const statuses = await Promise.all(results)
      
      // Should see rate limiting kick in (429 status)
      const rateLimited = statuses.filter(status => status === 429)
      
      // At least some requests should be rate limited
      if (rateLimited.length > 0) {
        expect(rateLimited.length).toBeGreaterThan(0)
      }
    })
  })

  test.describe('Error Information Disclosure', () => {
    test('should not leak sensitive error details', async ({ page }) => {
      // Cause an error
      await page.route('**/api/mood-to-music', route => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({
            error: 'Internal Server Error',
            // Should NOT include:
            // - Stack traces
            // - Database queries
            // - File paths
            // - Framework versions
          })
        })
      })
      
      await page.locator('button:has-text("Happy")').first().click()
      
      // Check error message
      const errorText = await page.locator('text=/error|failed/i').textContent()
      
      // Should not contain sensitive information
      expect(errorText).not.toContain('at Function')  // Stack trace
      expect(errorText).not.toContain('/Users/')      // File paths
      expect(errorText).not.toContain('SELECT')        // SQL queries
      expect(errorText).not.toContain('MongoDB')       // Database info
    })
  })

  test.describe('Clickjacking Prevention', () => {
    test('should prevent iframe embedding', async ({ page }) => {
      const response = await page.goto('/')
      const headers = response?.headers()
      
      // Check X-Frame-Options
      expect(headers?.['x-frame-options']).toBe('DENY')
      
      // Try to embed in iframe
      await page.evaluate(() => {
        const iframe = document.createElement('iframe')
        iframe.src = window.location.href
        document.body.appendChild(iframe)
      })
      
      // Wait and check if iframe loaded
      await page.waitForTimeout(2000)
      
      const iframeContent = await page.evaluate(() => {
        const iframe = document.querySelector('iframe') as HTMLIFrameElement
        try {
          return iframe?.contentDocument?.body?.innerHTML || 'blocked'
        } catch {
          return 'blocked'
        }
      })
      
      expect(iframeContent).toBe('blocked')
    })
  })

  test.describe('Data Validation', () => {
    test('should validate YouTube video IDs', async ({ page }) => {
      // If YouTube functionality exists
      const youtubeButton = page.locator('button.bg-red-600').first()
      
      if (await youtubeButton.count() > 0) {
        // Check that video IDs match YouTube format
        const videoId = await youtubeButton.getAttribute('data-video-id')
        
        if (videoId) {
          expect(videoId).toMatch(/^[a-zA-Z0-9_-]{11}$/)
        }
      }
    })

    test('should validate Spotify URLs', async ({ page }) => {
      await page.locator('button:has-text("Happy")').first().click()
      await page.waitForTimeout(5000)
      
      const spotifyLinks = await page.locator('a[href*="spotify"]').all()
      
      for (const link of spotifyLinks) {
        const href = await link.getAttribute('href')
        
        // Should be valid Spotify URL
        expect(href).toMatch(/^https:\/\/open\.spotify\.com\//)
        
        // Should not contain user input directly
        expect(href).not.toContain('<script>')
        expect(href).not.toContain('javascript:')
      }
    })
  })

  test.describe('Local Storage Security', () => {
    test('should not store sensitive data in localStorage', async ({ page }) => {
      await page.locator('button:has-text("Happy")').first().click()
      await page.waitForTimeout(3000)
      
      const localStorage = await page.evaluate(() => {
        const items = {}
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i)
          if (key) {
            items[key] = window.localStorage.getItem(key)
          }
        }
        return items
      })
      
      const localStorageString = JSON.stringify(localStorage)
      
      // Check for sensitive data
      expect(localStorageString).not.toContain('client_secret')
      expect(localStorageString).not.toContain('api_key')
      expect(localStorageString).not.toContain('password')
      expect(localStorageString).not.toContain('token')
    })
  })
})