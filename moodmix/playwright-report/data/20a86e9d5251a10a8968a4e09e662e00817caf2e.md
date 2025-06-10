# Test info

- Name: Experimental page - mood selection and music loading
- Location: /Users/jonathonc/Auto1111/claude/MoodMix/moodmix/tests/experimental-page-test.spec.ts:3:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 1
Received: 0
    at /Users/jonathonc/Auto1111/claude/MoodMix/moodmix/tests/experimental-page-test.spec.ts:42:36
```

# Page snapshot

```yaml
- text: MoodMix
- heading "How are you serene ?" [level=1]
- paragraph: Discover the perfect soundtrack for your emotions. Let AI curate your musical journey based on how you feel right now.
- heading "Euphoric" [level=3]
- paragraph: High energy beats that lift your spirits to the clouds
- heading "Melancholic" [level=3]
- paragraph: Soulful melodies for introspective moments
- heading "Energetic" [level=3]
- paragraph: Pump-up tracks that fuel your workout sessions
- heading "Serene" [level=3]
- paragraph: Peaceful sounds for meditation and relaxation
- heading "Passionate" [level=3]
- paragraph: Intense rhythms that ignite your inner fire
- heading "Contemplative" [level=3]
- paragraph: Deep compositions for thoughtful reflection
- heading "Nostalgic" [level=3]
- paragraph: Timeless classics that bring back memories
- heading "Rebellious" [level=3]
- paragraph: Raw power chords that break all the rules
- heading "Mystical" [level=3]
- paragraph: Ethereal soundscapes from otherworldly realms
- heading "Triumphant" [level=3]
- paragraph: Victory anthems for your greatest achievements
- heading "Vulnerable" [level=3]
- paragraph: Gentle harmonies for your most tender moments
- heading "Adventurous" [level=3]
- paragraph: Epic soundtracks for your next great journey
- text: 🎵
- heading "Energetic Vibes" [level=3]
- paragraph: Curating the perfect energetic playlist just for you...
- text: Loading your personalized playlist...
- alert
- button "Open Next.js Dev Tools":
  - img
- button "Open issues overlay": 1 Issue
- button "Collapse issues badge":
  - img
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test'
   2 |
   3 | test('Experimental page - mood selection and music loading', async ({ page }) => {
   4 |   console.log('🎨 Testing experimental mood interface')
   5 |   
   6 |   await page.goto('http://localhost:3001/experimental')
   7 |   await page.waitForLoadState('networkidle')
   8 |   
   9 |   // Check that all 12 mood cards are displayed
  10 |   const moodCards = await page.locator('.group.cursor-pointer').all()
  11 |   console.log(`Found ${moodCards.length} mood cards`)
  12 |   expect(moodCards.length).toBe(12)
  13 |   
  14 |   // Test the animated text cycle
  15 |   const animatedText = await page.locator('.inline-block.font-bold').first()
  16 |   const firstText = await animatedText.textContent()
  17 |   console.log(`First animated text: ${firstText}`)
  18 |   
  19 |   // Wait for text to change
  20 |   await page.waitForTimeout(2500)
  21 |   const secondText = await animatedText.textContent()
  22 |   console.log(`Second animated text: ${secondText}`)
  23 |   expect(firstText).not.toBe(secondText)
  24 |   
  25 |   // Click on "Energetic" mood
  26 |   console.log('\nClicking on Energetic mood...')
  27 |   const energeticCard = await page.locator('.group.cursor-pointer').filter({ hasText: 'Energetic' }).first()
  28 |   await energeticCard.click()
  29 |   
  30 |   // Check that modal appears
  31 |   await page.waitForSelector('.fixed.inset-0.z-50')
  32 |   const modalTitle = await page.locator('h3.text-3xl').textContent()
  33 |   console.log(`Modal title: ${modalTitle}`)
  34 |   expect(modalTitle).toBe('Energetic Vibes')
  35 |   
  36 |   // Wait for the loading to complete and music results to show
  37 |   console.log('Waiting for music to load...')
  38 |   await page.waitForTimeout(4000) // Wait for 3s animation + transition
  39 |   
  40 |   // Check that we're now on the results page
  41 |   const backButton = await page.locator('button:has-text("Back to Moods")')
> 42 |   expect(await backButton.count()).toBe(1)
     |                                    ^ Error: expect(received).toBe(expected) // Object.is equality
  43 |   
  44 |   // Check for music results
  45 |   const resultsHeader = await page.locator('h2').filter({ hasText: 'Your Energetic Playlist' })
  46 |   expect(await resultsHeader.count()).toBe(1)
  47 |   
  48 |   // Check that tracks are loaded
  49 |   const trackCards = await page.locator('.track-card').all()
  50 |   console.log(`\nLoaded ${trackCards.length} tracks`)
  51 |   expect(trackCards.length).toBeGreaterThan(0)
  52 |   
  53 |   // Test back navigation
  54 |   console.log('\nTesting back navigation...')
  55 |   await backButton.click()
  56 |   
  57 |   // Should be back on mood selection
  58 |   await page.waitForTimeout(1000)
  59 |   const moodCardsAfterBack = await page.locator('.group.cursor-pointer').all()
  60 |   expect(moodCardsAfterBack.length).toBe(12)
  61 |   
  62 |   // Take screenshot
  63 |   await page.screenshot({ path: 'test-results/experimental-page-test.png', fullPage: true })
  64 |   
  65 |   console.log('✅ Experimental page test passed!')
  66 | })
```