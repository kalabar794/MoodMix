import { test, expect } from '@playwright/test';

test.describe('Spotify API Debug', () => {
  test('should test Spotify API directly with simpler queries', async ({ page }) => {
    // Navigate to a simple page to use page.request
    await page.goto('https://mood-mix-theta.vercel.app');
    
    console.log('\n=== TESTING SIMPLE SPOTIFY SEARCH ===');
    
    // Test 1: Simple search that should work
    try {
      const simpleResponse = await page.request.post('https://mood-mix-theta.vercel.app/api/mood-to-music', {
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          primary: 'serene', // Try a different mood that has simpler queries
          intensity: 50,
          color: '#14b8a6',
          coordinates: { x: 0, y: 0 }
        }
      });
      
      const simpleBody = await simpleResponse.text();
      console.log('Serene Mood API Status:', simpleResponse.status());
      console.log('Serene Mood API Response:', simpleBody.substring(0, 800));
      
      const simpleData = JSON.parse(simpleBody);
      console.log('Serene tracks found:', simpleData.tracks?.length || 0);
    } catch (error) {
      console.log('Serene Mood API Error:', error);
    }
    
    // Test 2: Test a direct Spotify search endpoint to check credentials
    console.log('\n=== TESTING SPOTIFY CREDENTIALS ===');
    try {
      const spotifyTestResponse = await page.request.get('https://mood-mix-theta.vercel.app/api/spotify-search?q=happy&type=track&limit=5');
      const spotifyTestBody = await spotifyTestResponse.text();
      console.log('Spotify Search Test Status:', spotifyTestResponse.status());
      console.log('Spotify Search Test Response:', spotifyTestBody.substring(0, 500));
    } catch (error) {
      console.log('Spotify Search Test Error:', error);
    }
    
    // Test 3: Try each mood to see which ones work
    const moods = [
      { name: 'euphoric', color: '#fbbf24' },
      { name: 'melancholic', color: '#64748b' },
      { name: 'energetic', color: '#ef4444' },
      { name: 'serene', color: '#14b8a6' },
      { name: 'passionate', color: '#ec4899' }
    ];
    
    console.log('\n=== TESTING ALL MOODS ===');
    for (const mood of moods) {
      try {
        const moodResponse = await page.request.post('https://mood-mix-theta.vercel.app/api/mood-to-music', {
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            primary: mood.name,
            intensity: 75,
            color: mood.color,
            coordinates: { x: 0, y: 0 }
          }
        });
        
        const moodBody = await moodResponse.text();
        const moodData = JSON.parse(moodBody);
        
        console.log(`${mood.name.toUpperCase()}: ${moodData.tracks?.length || 0} tracks found`);
        if (moodData.tracks?.length > 0) {
          console.log(`  First track: ${moodData.tracks[0].name} by ${moodData.tracks[0].artists[0].name}`);
        }
      } catch (error) {
        console.log(`${mood.name.toUpperCase()}: Error -`, error);
      }
    }
  });
});