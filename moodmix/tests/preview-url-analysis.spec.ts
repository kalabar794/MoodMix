import { test, expect } from '@playwright/test';

test.describe('Preview URL Analysis', () => {
  test('analyze track data and preview URL availability', async ({ page }) => {
    console.log('🔍 Analyzing track data and preview URL availability...');
    
    // Capture network responses
    const apiCalls: any[] = [];
    
    page.on('response', async (response) => {
      if (response.url().includes('api/mood-to-music')) {
        try {
          const responseBody = await response.json();
          apiCalls.push({
            url: response.url(),
            status: response.status(),
            data: responseBody
          });
        } catch (e) {
          console.log('Could not parse API response as JSON');
        }
      }
    });

    await page.goto('https://mood-mix-theta.vercel.app');
    await page.waitForLoadState('networkidle');
    
    // Select Energetic mood
    console.log('⚡ Selecting Energetic mood...');
    const energeticCard = page.locator('text=Energetic').first();
    await energeticCard.click();
    
    // Wait for API response
    await page.waitForTimeout(5000);
    
    console.log('\n📊 API Response Analysis:');
    console.log(`Number of API calls captured: ${apiCalls.length}`);
    
    if (apiCalls.length > 0) {
      const lastCall = apiCalls[apiCalls.length - 1];
      console.log(`\nLast API call status: ${lastCall.status}`);
      
      if (lastCall.data && lastCall.data.tracks) {
        const tracks = lastCall.data.tracks;
        console.log(`\nTotal tracks returned: ${tracks.length}`);
        
        let tracksWithPreview = 0;
        let tracksWithoutPreview = 0;
        const sampleTrackData: any[] = [];
        
        tracks.forEach((track: any, index: number) => {
          if (track.preview_url) {
            tracksWithPreview++;
          } else {
            tracksWithoutPreview++;
          }
          
          // Collect sample data for first 3 tracks
          if (index < 3) {
            sampleTrackData.push({
              name: track.name,
              artist: track.artists?.[0]?.name || 'Unknown',
              has_preview: !!track.preview_url,
              preview_url: track.preview_url
            });
          }
        });
        
        console.log(`\n🎵 Preview URL Statistics:`);
        console.log(`Tracks WITH preview URLs: ${tracksWithPreview}`);
        console.log(`Tracks WITHOUT preview URLs: ${tracksWithoutPreview}`);
        console.log(`Percentage with previews: ${((tracksWithPreview / tracks.length) * 100).toFixed(1)}%`);
        
        console.log(`\n📋 Sample Track Data:`);
        sampleTrackData.forEach((track, index) => {
          console.log(`${index + 1}. "${track.name}" by ${track.artist}`);
          console.log(`   Has preview: ${track.has_preview}`);
          if (track.preview_url) {
            console.log(`   Preview URL: ${track.preview_url}`);
          }
          console.log('');
        });
        
        // Test if any track has a working preview URL
        const tracksWithPreviews = tracks.filter((track: any) => track.preview_url);
        if (tracksWithPreviews.length > 0) {
          console.log(`\n🧪 Testing first available preview URL...`);
          const testTrack = tracksWithPreviews[0];
          console.log(`Testing: "${testTrack.name}" by ${testTrack.artists?.[0]?.name}`);
          console.log(`Preview URL: ${testTrack.preview_url}`);
          
          // Try to load the preview URL directly
          try {
            const audioResponse = await page.request.get(testTrack.preview_url);
            console.log(`Preview URL response status: ${audioResponse.status()}`);
            console.log(`Content-Type: ${audioResponse.headers()['content-type']}`);
            
            if (audioResponse.ok()) {
              console.log('✅ Preview URL is accessible and returns audio content');
            } else {
              console.log('❌ Preview URL returned an error');
            }
          } catch (error) {
            console.log(`❌ Error testing preview URL: ${error}`);
          }
        }
        
      } else {
        console.log('❌ No track data found in API response');
        console.log('Response data:', JSON.stringify(lastCall.data, null, 2));
      }
    } else {
      console.log('❌ No API calls captured');
    }
    
    // Also check the page content for any clues
    console.log('\n🔧 Page Content Analysis:');
    const pageContent = await page.content();
    
    // Look for error messages or loading states
    const hasErrorMessage = pageContent.includes('error') || pageContent.includes('failed');
    const hasLoadingState = pageContent.includes('loading') || pageContent.includes('discovering');
    
    console.log(`Page contains error indicators: ${hasErrorMessage}`);
    console.log(`Page contains loading indicators: ${hasLoadingState}`);
    
    // Check for any tracks displayed
    const trackElements = await page.locator('h3').count();
    console.log(`Number of track title elements found: ${trackElements}`);
    
    if (trackElements > 0) {
      console.log('\n🎵 Sample track titles from page:');
      for (let i = 0; i < Math.min(trackElements, 3); i++) {
        const trackTitle = await page.locator('h3').nth(i).textContent();
        console.log(`${i + 1}. ${trackTitle}`);
      }
    }
    
    // Take final screenshot
    await page.screenshot({ path: 'test-results/preview-url-analysis.png', fullPage: true });
  });
});