# Test info

- Name: Verify mood tile fix - no more application errors
- Location: /Users/jonathonc/Auto1111/claude/MoodMix/moodmix/tests/mood-tile-fix-verification.spec.ts:3:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 6
    at /Users/jonathonc/Auto1111/claude/MoodMix/moodmix/tests/mood-tile-fix-verification.spec.ts:75:32
```

# Page snapshot

```yaml
- main:
  - paragraph:
    - strong: "404"
    - text: ": NOT_FOUND Code:"
    - code: "`DEPLOYMENT_NOT_FOUND`"
    - text: "ID:"
    - code: "`sfo1::xn69q-1748735938273-5ca3eb6a789d`"
  - link "This deployment cannot be found. For more information and troubleshooting, see our documentation.":
    - /url: https://vercel.com/docs/errors/platform-error-codes#deployment_not_found
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test'
   2 |
   3 | test('Verify mood tile fix - no more application errors', async ({ page }) => {
   4 |   console.log('🔧 TESTING MOOD TILE FIX')
   5 |   
   6 |   // Track all errors
   7 |   const pageErrors: string[] = []
   8 |   const consoleErrors: string[] = []
   9 |   
  10 |   page.on('pageerror', error => {
  11 |     pageErrors.push(`${error.name}: ${error.message}`)
  12 |     console.log(`❌ PAGE ERROR: ${error.name}: ${error.message}`)
  13 |   })
  14 |   
  15 |   page.on('console', msg => {
  16 |     if (msg.type() === 'error') {
  17 |       consoleErrors.push(msg.text())
  18 |       console.log(`❌ CONSOLE ERROR: ${msg.text()}`)
  19 |     }
  20 |   })
  21 |
  22 |   // Test the live site
  23 |   await page.goto('https://mood-mix-k5qk4ue9b-vibejpc.vercel.app')
  24 |   await page.waitForTimeout(3000)
  25 |   
  26 |   console.log('✅ Page loaded successfully')
  27 |   
  28 |   // Test each mood tile that was causing errors
  29 |   const problemMoods = ['Euphoric', 'Melancholic', 'Serene', 'Passionate', 'Contemplative']
  30 |   
  31 |   for (const mood of problemMoods) {
  32 |     console.log(`🧪 Testing ${mood}...`)
  33 |     
  34 |     // Reset page
  35 |     await page.reload()
  36 |     await page.waitForTimeout(2000)
  37 |     
  38 |     // Track errors before clicking
  39 |     const errorsBefore = pageErrors.length + consoleErrors.length
  40 |     
  41 |     // Click the mood tile
  42 |     const tileSelector = `button:has-text("${mood}")`
  43 |     const tileExists = await page.locator(tileSelector).isVisible()
  44 |     
  45 |     if (tileExists) {
  46 |       await page.click(tileSelector)
  47 |       await page.waitForTimeout(2000)
  48 |       
  49 |       // Check for new errors
  50 |       const errorsAfter = pageErrors.length + consoleErrors.length
  51 |       
  52 |       if (errorsAfter > errorsBefore) {
  53 |         console.log(`❌ ${mood} still causes errors!`)
  54 |       } else {
  55 |         console.log(`✅ ${mood} works correctly!`)
  56 |       }
  57 |     } else {
  58 |       console.log(`⚠️ ${mood} tile not found`)
  59 |     }
  60 |   }
  61 |   
  62 |   console.log(`\n📊 Final Results:`)
  63 |   console.log(`Total page errors: ${pageErrors.length}`)
  64 |   console.log(`Total console errors: ${consoleErrors.length}`)
  65 |   
  66 |   if (pageErrors.length === 0 && consoleErrors.length === 0) {
  67 |     console.log('🎉 SUCCESS: No errors detected!')
  68 |   } else {
  69 |     console.log('❌ STILL HAVE ERRORS:')
  70 |     pageErrors.forEach(error => console.log(`  PAGE: ${error}`))
  71 |     consoleErrors.forEach(error => console.log(`  CONSOLE: ${error}`))
  72 |   }
  73 |   
  74 |   expect(pageErrors.length).toBe(0)
> 75 |   expect(consoleErrors.length).toBe(0)
     |                                ^ Error: expect(received).toBe(expected) // Object.is equality
  76 | })
```