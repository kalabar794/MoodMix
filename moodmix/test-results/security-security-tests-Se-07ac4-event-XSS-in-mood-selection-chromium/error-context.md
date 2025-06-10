# Test info

- Name: Security Testing Suite >> XSS Prevention >> should prevent XSS in mood selection
- Location: /Users/jonathonc/Auto1111/claude/MoodMix/moodmix/tests/security/security-tests.spec.ts:9:9

# Error details

```
Error: expect(received).not.toContain(expected) // indexOf

Expected substring: not "<script>"
Received string:        "<script>alert(\"XSS\")</script>"
    at /Users/jonathonc/Auto1111/claude/MoodMix/moodmix/tests/security/security-tests.spec.ts:35:28
```

# Page snapshot

```yaml
- main:
  - img
  - heading [level=1]
  - text: MoodMix
  - button "Auto theme"
  - button "Show keyboard shortcuts"
  - heading "How are you feeling?" [level=1]
  - paragraph: Discover the perfect soundtrack for your emotions. Our AI creates personalized playlists that match your current mood.
  - text: Select your mood below
  - button "Euphoric Pure joy and elation":
    - heading "Euphoric" [level=3]
    - paragraph: Pure joy and elation
  - button "Melancholic Bittersweet contemplation":
    - heading "Melancholic" [level=3]
    - paragraph: Bittersweet contemplation
  - button "Energetic High-octane intensity":
    - heading "Energetic" [level=3]
    - paragraph: High-octane intensity
  - button "Serene Peaceful tranquility":
    - heading "Serene" [level=3]
    - paragraph: Peaceful tranquility
  - button "Passionate Intense romantic energy":
    - heading "Passionate" [level=3]
    - paragraph: Intense romantic energy
  - button "Contemplative Deep introspective focus":
    - heading "Contemplative" [level=3]
    - paragraph: Deep introspective focus
  - button "Nostalgic Wistful remembrance":
    - heading "Nostalgic" [level=3]
    - paragraph: Wistful remembrance
  - button "Rebellious Defiant and bold":
    - heading "Rebellious" [level=3]
    - paragraph: Defiant and bold
  - button "Mystical Ethereal and otherworldly":
    - heading "Mystical" [level=3]
    - paragraph: Ethereal and otherworldly
  - button "Triumphant Victorious achievement":
    - heading "Triumphant" [level=3]
    - paragraph: Victorious achievement
  - button "Vulnerable Open and exposed":
    - heading "Vulnerable" [level=3]
    - paragraph: Open and exposed
  - button "Adventurous Ready for exploration":
    - heading "Adventurous" [level=3]
    - paragraph: Ready for exploration
  - paragraph: Each emotion unlocks a carefully curated musical journey designed to complement and enhance your current state of mind
  - paragraph: Powered by Spotify • Made for music lovers
- alert
- button "Open Next.js Dev Tools":
  - img
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test'
   2 |
   3 | test.describe('Security Testing Suite', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     await page.goto('/')
   6 |   })
   7 |
   8 |   test.describe('XSS Prevention', () => {
   9 |     test('should prevent XSS in mood selection', async ({ page }) => {
   10 |       // Attempt to inject script via console
   11 |       const xssPayloads = [
   12 |         '<script>alert("XSS")</script>',
   13 |         '<img src=x onerror=alert("XSS")>',
   14 |         'javascript:alert("XSS")',
   15 |         '<svg onload=alert("XSS")>',
   16 |         '<iframe src="javascript:alert(\'XSS\')"></iframe>'
   17 |       ]
   18 |
   19 |       for (const payload of xssPayloads) {
   20 |         // Try to inject via page evaluation
   21 |         const result = await page.evaluate((xss) => {
   22 |           try {
   23 |             // Attempt to set innerHTML
   24 |             const element = document.querySelector('h1')
   25 |             if (element) {
   26 |               element.innerHTML = xss
   27 |               return element.innerHTML
   28 |             }
   29 |           } catch (e) {
   30 |             return 'blocked'
   31 |           }
   32 |         }, payload)
   33 |
   34 |         // Verify script tags are escaped or blocked
>  35 |         expect(result).not.toContain('<script>')
      |                            ^ Error: expect(received).not.toContain(expected) // indexOf
   36 |         expect(result).not.toContain('onerror=')
   37 |       }
   38 |     })
   39 |
   40 |     test('should sanitize user inputs in API calls', async ({ page }) => {
   41 |       // Intercept API calls
   42 |       await page.route('**/api/mood-to-music', async route => {
   43 |         const request = route.request()
   44 |         const postData = request.postDataJSON()
   45 |         
   46 |         // Check that malicious input is handled
   47 |         expect(postData).toBeDefined()
   48 |         
   49 |         await route.continue()
   50 |       })
   51 |
   52 |       // Try to send malicious mood data
   53 |       await page.evaluate(() => {
   54 |         fetch('/api/mood-to-music', {
   55 |           method: 'POST',
   56 |           headers: { 'Content-Type': 'application/json' },
   57 |           body: JSON.stringify({
   58 |             mood: {
   59 |               primary: '<script>alert("XSS")</script>',
   60 |               intensity: 50
   61 |             }
   62 |           })
   63 |         })
   64 |       })
   65 |     })
   66 |   })
   67 |
   68 |   test.describe('Content Security Policy', () => {
   69 |     test('should have proper CSP headers', async ({ page }) => {
   70 |       const response = await page.goto('/')
   71 |       const headers = response?.headers()
   72 |       
   73 |       // Check for CSP header
   74 |       const csp = headers?.['content-security-policy']
   75 |       
   76 |       if (csp) {
   77 |         // Verify CSP directives
   78 |         expect(csp).toContain("default-src 'self'")
   79 |         expect(csp).not.toContain("unsafe-inline")
   80 |         expect(csp).not.toContain("unsafe-eval")
   81 |       }
   82 |     })
   83 |
   84 |     test('should block inline scripts', async ({ page }) => {
   85 |       // Try to execute inline script
   86 |       const consoleMessages: string[] = []
   87 |       page.on('console', msg => consoleMessages.push(msg.text()))
   88 |       
   89 |       await page.evaluate(() => {
   90 |         try {
   91 |           const script = document.createElement('script')
   92 |           script.textContent = 'console.log("Inline script executed")'
   93 |           document.head.appendChild(script)
   94 |         } catch (e) {
   95 |           console.log('Script blocked')
   96 |         }
   97 |       })
   98 |       
   99 |       // Check that inline script was blocked
  100 |       expect(consoleMessages).not.toContain('Inline script executed')
  101 |     })
  102 |   })
  103 |
  104 |   test.describe('Authentication & Authorization', () => {
  105 |     test('should not expose API keys in client code', async ({ page }) => {
  106 |       // Get all script contents
  107 |       const scripts = await page.evaluate(() => {
  108 |         const scriptElements = document.querySelectorAll('script')
  109 |         return Array.from(scriptElements).map(s => s.textContent || '')
  110 |       })
  111 |       
  112 |       const allScripts = scripts.join(' ')
  113 |       
  114 |       // Check for exposed secrets
  115 |       expect(allScripts).not.toMatch(/SPOTIFY_CLIENT_SECRET/i)
  116 |       expect(allScripts).not.toMatch(/sk_[a-zA-Z0-9]{24,}/) // Secret key pattern
  117 |       expect(allScripts).not.toMatch(/AIza[0-9A-Za-z-_]{35}/) // Google API key pattern
  118 |     })
  119 |
  120 |     test('should handle unauthorized API access', async ({ page }) => {
  121 |       // Try to access API directly without proper headers
  122 |       const response = await page.evaluate(async () => {
  123 |         const res = await fetch('/api/mood-to-music', {
  124 |           method: 'POST',
  125 |           body: JSON.stringify({ mood: { primary: 'happy', intensity: 50 } })
  126 |         })
  127 |         return {
  128 |           status: res.status,
  129 |           ok: res.ok
  130 |         }
  131 |       })
  132 |       
  133 |       // Should either work (public API) or return proper error
  134 |       expect([200, 400, 401, 403]).toContain(response.status)
  135 |     })
```