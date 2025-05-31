import { test, expect } from '@playwright/test';

test.describe('Final Live Deployment Verification', () => {
  test('should verify live deployment with improved search queries', async ({ page }) => {
    // Navigate to the live deployment
    await page.goto('https://mood-mix-theta.vercel.app');
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    
    console.log('\n=== TESTING IMPROVED SEARCH QUERIES ===');
    
    // Test the new spotify-search endpoint first
    try {
      const spotifyResponse = await page.request.get('https://mood-mix-theta.vercel.app/api/spotify-search?q=pop%20music&limit=5');
      const spotifyBody = await spotifyResponse.text();
      
      console.log('Spotify Search Test Status:', spotifyResponse.status());
      console.log('Spotify Search Test Response:', spotifyBody.substring(0, 300));
      
      if (spotifyResponse.status() === 200) {
        const spotifyData = JSON.parse(spotifyBody);
        console.log('Direct search tracks found:', spotifyData.tracks?.length || 0);
      }
    } catch (error) {
      console.log('Spotify Search Test Error:', error);
    }
    
    // Test mood-to-music with energetic mood
    console.log('\n=== TESTING ENERGETIC MOOD WITH NEW QUERIES ===');
    try {
      const energeticResponse = await page.request.post('https://mood-mix-theta.vercel.app/api/mood-to-music', {
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          primary: 'energetic',
          intensity: 75,
          color: '#ef4444',
          coordinates: { x: 0, y: 0 }
        }
      });
      
      const energeticBody = await energeticResponse.text();
      console.log('Energetic Mood API Status:', energeticResponse.status());
      
      if (energeticResponse.status() === 200) {
        const energeticData = JSON.parse(energeticBody);
        console.log('Energetic tracks found:', energeticData.tracks?.length || 0);
        console.log('Search params used:', JSON.stringify(energeticData.params, null, 2));
        
        if (energeticData.tracks?.length > 0) {
          console.log('Sample tracks:');
          energeticData.tracks.slice(0, 3).forEach((track: any, index: number) => {
            console.log(`  ${index + 1}. ${track.name} by ${track.artists[0].name} (Preview: ${track.preview_url ? 'Yes' : 'No'})`);
          });
        }
      } else {
        console.log('Error response:', energeticBody);
      }
    } catch (error) {
      console.log('Energetic Mood API Error:', error);
    }
    
    // Test different moods to see which ones work now
    const moodsToTest = [
      { name: 'serene', color: '#14b8a6', description: 'low energy' },
      { name: 'melancholic', color: '#64748b', description: 'sad' },
      { name: 'passionate', color: '#ec4899', description: 'high emotion' }
    ];
    
    console.log('\n=== TESTING OTHER MOODS ===');
    for (const mood of moodsToTest) {
      try {
        const moodResponse = await page.request.post('https://mood-mix-theta.vercel.app/api/mood-to-music', {
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            primary: mood.name,
            intensity: 60,
            color: mood.color,
            coordinates: { x: 0, y: 0 }
          }
        });
        
        if (moodResponse.status() === 200) {
          const moodData = await moodResponse.json();
          console.log(`${mood.name.toUpperCase()} (${mood.description}): ${moodData.tracks?.length || 0} tracks found`);
        } else {
          console.log(`${mood.name.toUpperCase()}: Error ${moodResponse.status()}`);
        }
      } catch (error) {
        console.log(`${mood.name.toUpperCase()}: Error -`, error);
      }
    }
    
    // Test the UI by actually clicking on Energetic
    console.log('\n=== TESTING UI INTERACTION ===');
    
    // Find and click the Energetic button
    const energeticButton = page.locator('button:has-text("Energetic")').first();
    if (await energeticButton.count() > 0) {
      await energeticButton.click();
      
      // Wait for the API call and UI update
      await page.waitForTimeout(5000);
      
      // Check if any music results appeared
      const resultsVisible = await page.locator('[data-testid="music-results"], .track, .song, [class*="music"]').count();
      console.log('Music results visible in UI:', resultsVisible);
      
      // Take a screenshot
      await page.screenshot({ path: 'test-results/final-live-verification.png', fullPage: true });
      
      // Check for error messages
      const errorMessage = await page.locator('.error, [class*="error"]').textContent();
      if (errorMessage) {
        console.log('Error message in UI:', errorMessage);
      }
    } else {
      console.log('Could not find Energetic button');
    }
  });
});