# Test info

- Name: Final Live Deployment Verification >> should verify live deployment with improved search queries
- Location: /Users/jonathonc/Auto1111/claude/MoodMix/moodmix/tests/final-live-verification.spec.ts:4:7

# Error details

```
Error: locator.textContent: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.error, [class*="error"]')

    at /Users/jonathonc/Auto1111/claude/MoodMix/moodmix/tests/final-live-verification.spec.ts:117:75
```

# Page snapshot

```yaml
- main:
  - img
  - heading "MoodMix" [level=1]
  - text: MoodMix
  - paragraph: Current Mood
  - paragraph: energetic
  - button "Change Mood"
  - button "Auto theme"
  - button "Show keyboard shortcuts"
  - text: Current Mood energetic Intensity 75% Tracks Found 0 🎵
  - heading "No Tracks Found" [level=3]
  - paragraph: We couldn't find music matching your current mood selection
  - text: Try selecting a different mood
  - paragraph: Powered by Spotify • Made for music lovers
- alert
```

# Test source

```ts
   17 |       
   18 |       console.log('Spotify Search Test Status:', spotifyResponse.status());
   19 |       console.log('Spotify Search Test Response:', spotifyBody.substring(0, 300));
   20 |       
   21 |       if (spotifyResponse.status() === 200) {
   22 |         const spotifyData = JSON.parse(spotifyBody);
   23 |         console.log('Direct search tracks found:', spotifyData.tracks?.length || 0);
   24 |       }
   25 |     } catch (error) {
   26 |       console.log('Spotify Search Test Error:', error);
   27 |     }
   28 |     
   29 |     // Test mood-to-music with energetic mood
   30 |     console.log('\n=== TESTING ENERGETIC MOOD WITH NEW QUERIES ===');
   31 |     try {
   32 |       const energeticResponse = await page.request.post('https://mood-mix-theta.vercel.app/api/mood-to-music', {
   33 |         headers: {
   34 |           'Content-Type': 'application/json',
   35 |         },
   36 |         data: {
   37 |           primary: 'energetic',
   38 |           intensity: 75,
   39 |           color: '#ef4444',
   40 |           coordinates: { x: 0, y: 0 }
   41 |         }
   42 |       });
   43 |       
   44 |       const energeticBody = await energeticResponse.text();
   45 |       console.log('Energetic Mood API Status:', energeticResponse.status());
   46 |       
   47 |       if (energeticResponse.status() === 200) {
   48 |         const energeticData = JSON.parse(energeticBody);
   49 |         console.log('Energetic tracks found:', energeticData.tracks?.length || 0);
   50 |         console.log('Search params used:', JSON.stringify(energeticData.params, null, 2));
   51 |         
   52 |         if (energeticData.tracks?.length > 0) {
   53 |           console.log('Sample tracks:');
   54 |           energeticData.tracks.slice(0, 3).forEach((track: any, index: number) => {
   55 |             console.log(`  ${index + 1}. ${track.name} by ${track.artists[0].name} (Preview: ${track.preview_url ? 'Yes' : 'No'})`);
   56 |           });
   57 |         }
   58 |       } else {
   59 |         console.log('Error response:', energeticBody);
   60 |       }
   61 |     } catch (error) {
   62 |       console.log('Energetic Mood API Error:', error);
   63 |     }
   64 |     
   65 |     // Test different moods to see which ones work now
   66 |     const moodsToTest = [
   67 |       { name: 'serene', color: '#14b8a6', description: 'low energy' },
   68 |       { name: 'melancholic', color: '#64748b', description: 'sad' },
   69 |       { name: 'passionate', color: '#ec4899', description: 'high emotion' }
   70 |     ];
   71 |     
   72 |     console.log('\n=== TESTING OTHER MOODS ===');
   73 |     for (const mood of moodsToTest) {
   74 |       try {
   75 |         const moodResponse = await page.request.post('https://mood-mix-theta.vercel.app/api/mood-to-music', {
   76 |           headers: {
   77 |             'Content-Type': 'application/json',
   78 |           },
   79 |           data: {
   80 |             primary: mood.name,
   81 |             intensity: 60,
   82 |             color: mood.color,
   83 |             coordinates: { x: 0, y: 0 }
   84 |           }
   85 |         });
   86 |         
   87 |         if (moodResponse.status() === 200) {
   88 |           const moodData = await moodResponse.json();
   89 |           console.log(`${mood.name.toUpperCase()} (${mood.description}): ${moodData.tracks?.length || 0} tracks found`);
   90 |         } else {
   91 |           console.log(`${mood.name.toUpperCase()}: Error ${moodResponse.status()}`);
   92 |         }
   93 |       } catch (error) {
   94 |         console.log(`${mood.name.toUpperCase()}: Error -`, error);
   95 |       }
   96 |     }
   97 |     
   98 |     // Test the UI by actually clicking on Energetic
   99 |     console.log('\n=== TESTING UI INTERACTION ===');
  100 |     
  101 |     // Find and click the Energetic button
  102 |     const energeticButton = page.locator('button:has-text("Energetic")').first();
  103 |     if (await energeticButton.count() > 0) {
  104 |       await energeticButton.click();
  105 |       
  106 |       // Wait for the API call and UI update
  107 |       await page.waitForTimeout(5000);
  108 |       
  109 |       // Check if any music results appeared
  110 |       const resultsVisible = await page.locator('[data-testid="music-results"], .track, .song, [class*="music"]').count();
  111 |       console.log('Music results visible in UI:', resultsVisible);
  112 |       
  113 |       // Take a screenshot
  114 |       await page.screenshot({ path: 'test-results/final-live-verification.png', fullPage: true });
  115 |       
  116 |       // Check for error messages
> 117 |       const errorMessage = await page.locator('.error, [class*="error"]').textContent();
      |                                                                           ^ Error: locator.textContent: Test timeout of 30000ms exceeded.
  118 |       if (errorMessage) {
  119 |         console.log('Error message in UI:', errorMessage);
  120 |       }
  121 |     } else {
  122 |       console.log('Could not find Energetic button');
  123 |     }
  124 |   });
  125 | });
```