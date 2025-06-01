# Test info

- Name: Final Deployment Verification >> should verify mood wheel responsiveness and interaction
- Location: /Users/jonathonc/Auto1111/claude/MoodMix/moodmix/tests/final-deployment-test.spec.ts:108:7

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: locator('.rounded-full.cursor-pointer.overflow-hidden').first()
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for locator('.rounded-full.cursor-pointer.overflow-hidden').first()

    at /Users/jonathonc/Auto1111/claude/MoodMix/moodmix/tests/final-deployment-test.spec.ts:114:34
```

# Page snapshot

```yaml
- main:
  - img
  - heading "MoodMix" [level=1]
  - text: MoodMix
  - button "Auto theme"
  - button "Show keyboard shortcuts": Press ? for shortcuts
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
```

# Test source

```ts
   14 |         });
   15 |         console.log(`✅ API Request made: ${request.method()} ${request.url()}`);
   16 |       }
   17 |     });
   18 |
   19 |     page.on('response', response => {
   20 |       if (response.url().includes('/api/mood-to-music')) {
   21 |         console.log(`✅ API Response: ${response.status()} ${response.url()}`);
   22 |       }
   23 |     });
   24 |
   25 |     // Navigate to live site
   26 |     await page.goto('https://mood-mix-theta.vercel.app');
   27 |     await page.waitForLoadState('networkidle');
   28 |
   29 |     // Verify initial state
   30 |     const moodSelectionTitle = page.locator('text="How are you feeling?"');
   31 |     await expect(moodSelectionTitle).toBeVisible();
   32 |     console.log('✅ Initial mood selection page loaded');
   33 |
   34 |     // Take before screenshot
   35 |     await page.screenshot({ path: 'test-results/final-before-click.png', fullPage: true });
   36 |
   37 |     // Find and click mood wheel
   38 |     const clickableWheel = page.locator('.rounded-full.cursor-pointer.overflow-hidden').first();
   39 |     await expect(clickableWheel).toBeVisible();
   40 |     
   41 |     // Click mood wheel
   42 |     await clickableWheel.click();
   43 |     console.log('✅ Clicked mood wheel');
   44 |
   45 |     // Wait for API call and response
   46 |     await page.waitForTimeout(8000);
   47 |
   48 |     // Take after screenshot
   49 |     await page.screenshot({ path: 'test-results/final-after-click.png', fullPage: true });
   50 |
   51 |     // Verify API call was made
   52 |     expect(apiCalls.length).toBeGreaterThan(0);
   53 |     console.log(`✅ ${apiCalls.length} API calls made successfully`);
   54 |
   55 |     if (apiCalls.length > 0) {
   56 |       const moodData = JSON.parse(apiCalls[0].postData || '{}');
   57 |       console.log(`✅ Mood data: ${moodData.primary} at ${moodData.intensity}% intensity`);
   58 |     }
   59 |
   60 |     // Check if view transitioned to results
   61 |     const resultsViewElements = [
   62 |       page.locator('text="Current Mood"').first(),
   63 |       page.locator('text="Change Mood"'),
   64 |       page.locator('text="Tracks Found"')
   65 |     ];
   66 |
   67 |     let resultsViewVisible = false;
   68 |     for (const element of resultsViewElements) {
   69 |       if (await element.isVisible()) {
   70 |         resultsViewVisible = true;
   71 |         break;
   72 |       }
   73 |     }
   74 |
   75 |     expect(resultsViewVisible).toBeTruthy();
   76 |     console.log('✅ Successfully transitioned to results view');
   77 |
   78 |     // Check for music tracks or loading state
   79 |     const hasLoadingState = await page.locator('text="Discovering Your Music"').isVisible();
   80 |     const hasMusicResults = await page.locator('.track-card-premium').count() > 0;
   81 |     const hasNoTracksMessage = await page.locator('text="No Tracks Found"').isVisible();
   82 |
   83 |     console.log('Loading state:', hasLoadingState);
   84 |     console.log('Music results:', hasMusicResults);
   85 |     console.log('No tracks message:', hasNoTracksMessage);
   86 |
   87 |     // Verify we get some kind of results (either tracks or appropriate error/empty state)
   88 |     expect(hasMusicResults || hasNoTracksMessage).toBeTruthy();
   89 |
   90 |     if (hasMusicResults) {
   91 |       console.log('✅ Music tracks loaded successfully');
   92 |       
   93 |       // Test preview functionality
   94 |       const playButtons = page.locator('button:has-text("Preview"), .play-button, [aria-label*="play"]');
   95 |       const playButtonCount = await playButtons.count();
   96 |       console.log(`Found ${playButtonCount} play buttons`);
   97 |       
   98 |       if (playButtonCount > 0) {
   99 |         await playButtons.first().click();
  100 |         await page.waitForTimeout(2000);
  101 |         console.log('✅ Preview button clicked');
  102 |       }
  103 |     } else {
  104 |       console.log('ℹ️ No music tracks loaded (possibly due to API or auth issues)');
  105 |     }
  106 |   });
  107 |
  108 |   test('should verify mood wheel responsiveness and interaction', async ({ page }) => {
  109 |     await page.goto('https://mood-mix-theta.vercel.app');
  110 |     await page.waitForLoadState('networkidle');
  111 |
  112 |     // Test multiple click positions on mood wheel
  113 |     const clickableWheel = page.locator('.rounded-full.cursor-pointer.overflow-hidden').first();
> 114 |     await expect(clickableWheel).toBeVisible();
      |                                  ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  115 |     
  116 |     const wheelBox = await clickableWheel.boundingBox();
  117 |     if (wheelBox) {
  118 |       // Test different positions to ensure all moods are selectable
  119 |       const positions = [
  120 |         { x: wheelBox.width * 0.8, y: wheelBox.height * 0.5 }, // Right (Happy)
  121 |         { x: wheelBox.width * 0.5, y: wheelBox.height * 0.2 }, // Top
  122 |         { x: wheelBox.width * 0.2, y: wheelBox.height * 0.5 }, // Left
  123 |         { x: wheelBox.width * 0.5, y: wheelBox.height * 0.8 }, // Bottom
  124 |       ];
  125 |
  126 |       for (let i = 0; i < positions.length; i++) {
  127 |         const position = positions[i];
  128 |         
  129 |         // Go back to mood selection if needed
  130 |         const changeMoodButton = page.locator('text="Change Mood"');
  131 |         if (await changeMoodButton.isVisible()) {
  132 |           await changeMoodButton.click();
  133 |           await page.waitForTimeout(1000);
  134 |         }
  135 |
  136 |         // Click at specific position
  137 |         await clickableWheel.click({ position });
  138 |         await page.waitForTimeout(2000);
  139 |         
  140 |         await page.screenshot({ path: `test-results/mood-test-position-${i}.png`, fullPage: true });
  141 |         
  142 |         // Verify some response occurred
  143 |         const hasResponse = await page.locator('text="Current Mood", text="Change Mood"').first().isVisible();
  144 |         expect(hasResponse).toBeTruthy();
  145 |         
  146 |         console.log(`✅ Position ${i} click successful`);
  147 |       }
  148 |     }
  149 |   });
  150 | });
```