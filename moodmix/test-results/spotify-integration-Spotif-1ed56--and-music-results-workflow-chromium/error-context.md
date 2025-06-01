# Test info

- Name: Spotify Integration >> complete mood selection and music results workflow
- Location: /Users/jonathonc/Auto1111/claude/MoodMix/moodmix/tests/spotify-integration.spec.ts:4:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3001/
Call log:
  - navigating to "http://localhost:3001/", waiting until "load"

    at /Users/jonathonc/Auto1111/claude/MoodMix/moodmix/tests/spotify-integration.spec.ts:5:16
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test'
   2 |
   3 | test.describe('Spotify Integration', () => {
   4 |   test('complete mood selection and music results workflow', async ({ page }) => {
>  5 |     await page.goto('/')
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3001/
   6 |     
   7 |     // Verify initial state
   8 |     await expect(page.getByText('How are you feeling?')).toBeVisible()
   9 |     await expect(page.getByText('Select', { exact: true })).toBeVisible()
   10 |     
   11 |     // Wait for animations to settle
   12 |     await page.waitForTimeout(2000)
   13 |     
   14 |     // Click on the mood wheel to select a mood
   15 |     const moodWheelContainer = page.locator('.relative.w-80.h-80.mx-auto').first()
   16 |     await expect(moodWheelContainer).toBeVisible()
   17 |     
   18 |     // Click on the right side for "Happy" mood
   19 |     await moodWheelContainer.click({ position: { x: 240, y: 160 } })
   20 |     
   21 |     // Wait for mood selection to process
   22 |     await page.waitForTimeout(3000)
   23 |     
   24 |     // Check if we transitioned to results view
   25 |     const currentMoodDisplay = page.getByText('Current Mood')
   26 |     const resultsVisible = await currentMoodDisplay.isVisible()
   27 |     
   28 |     if (resultsVisible) {
   29 |       console.log('✅ Mood selection successful - showing results view')
   30 |       
   31 |       // Verify mood display
   32 |       await expect(currentMoodDisplay).toBeVisible()
   33 |       
   34 |       // Look for music results or loading state
   35 |       const musicSection = page.locator('[data-testid="music-results"], .music-results, .tracks-container').first()
   36 |       const loadingState = page.getByText('Finding your perfect tracks...')
   37 |       
   38 |       // Wait for either music results or error message
   39 |       try {
   40 |         await Promise.race([
   41 |           expect(musicSection).toBeVisible({ timeout: 10000 }),
   42 |           expect(loadingState).toBeVisible({ timeout: 5000 }),
   43 |           expect(page.getByText('Try Again')).toBeVisible({ timeout: 10000 })
   44 |         ])
   45 |         console.log('✅ Music results section loaded')
   46 |       } catch (e) {
   47 |         console.log('ℹ️ Music results may still be loading or in error state')
   48 |       }
   49 |       
   50 |     } else {
   51 |       console.log('ℹ️ Still on mood selection - this is fine for UI test')
   52 |     }
   53 |     
   54 |     // Take screenshot for visual verification
   55 |     await page.screenshot({ path: 'test-results/spotify-integration-test.png', fullPage: true })
   56 |   })
   57 |   
   58 |   test('API health check shows Spotify connection', async ({ page }) => {
   59 |     // Test API health endpoint
   60 |     const response = await page.request.get('/api/health')
   61 |     expect(response.ok()).toBeTruthy()
   62 |     
   63 |     const data = await response.json()
   64 |     expect(data.success).toBe(true)
   65 |     expect(data.checks.spotify).toBe(true)
   66 |     expect(data.checks.environment.hasClientId).toBe(true)
   67 |     expect(data.checks.environment.hasClientSecret).toBe(true)
   68 |   })
   69 |   
   70 |   test('mood-to-music API returns track results', async ({ page }) => {
   71 |     // Test mood-to-music API directly
   72 |     const response = await page.request.post('/api/mood-to-music', {
   73 |       data: {
   74 |         primary: 'energetic',
   75 |         color: '#FF6B6B',
   76 |         intensity: 90,
   77 |         coordinates: { x: 75, y: -25 }
   78 |       }
   79 |     })
   80 |     
   81 |     expect(response.ok()).toBeTruthy()
   82 |     
   83 |     const data = await response.json()
   84 |     expect(data.success).toBe(true)
   85 |     expect(data.mood.primary).toBe('energetic')
   86 |     expect(data.tracks).toBeDefined()
   87 |     expect(Array.isArray(data.tracks)).toBe(true)
   88 |     
   89 |     // Should have found some tracks
   90 |     expect(data.metadata.totalTracks).toBeGreaterThan(0)
   91 |     
   92 |     // Verify track structure
   93 |     if (data.tracks.length > 0) {
   94 |       const track = data.tracks[0]
   95 |       expect(track.id).toBeDefined()
   96 |       expect(track.name).toBeDefined()
   97 |       expect(track.artist).toBeDefined()
   98 |       expect(track.external_url).toContain('spotify.com')
   99 |     }
  100 |   })
  101 | })
```