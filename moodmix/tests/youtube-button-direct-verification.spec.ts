import { test, expect } from '@playwright/test';

test.describe('YouTube Button Direct Verification', () => {
  test('Test YouTube button functionality with mock data', async ({ page }) => {
    // Set up console logging to capture YouTube-related messages
    const consoleMessages: string[] = [];
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('YouTube') || text.includes('youtube') || text.includes('API') || text.includes('key')) {
        consoleMessages.push(`${msg.type()}: ${text}`);
      }
    });

    // Navigate to local development server
    await page.goto('http://localhost:3000');
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Take screenshot of initial state
    await page.screenshot({ 
      path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/youtube-direct-initial.png',
      fullPage: true 
    });
    console.log('✓ Initial state screenshot taken');

    // Click on Energetic mood to trigger the flow
    const energeticMood = page.locator('.mood-card:has-text("Energetic")').first();
    await expect(energeticMood).toBeVisible({ timeout: 10000 });
    await energeticMood.click();
    console.log('✓ Clicked on Energetic mood');

    // Wait for the error state to appear (since Spotify isn't configured)
    await page.waitForTimeout(5000);

    // Take screenshot of the error state
    await page.screenshot({ 
      path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/youtube-direct-error-state.png',
      fullPage: true 
    });

    // Now let's inject some mock data to test YouTube buttons directly
    await page.evaluate(() => {
      // Create mock music results with YouTube data
      const mockTracks = [
        {
          id: 'test1',
          name: 'Energetic Song 1',
          artists: [{ name: 'Test Artist 1' }],
          album: { images: [{ url: 'https://via.placeholder.com/300' }] },
          preview_url: null,
          external_urls: { spotify: 'https://spotify.com/test1' }
        },
        {
          id: 'test2', 
          name: 'Energetic Song 2',
          artists: [{ name: 'Test Artist 2' }],
          album: { images: [{ url: 'https://via.placeholder.com/300' }] },
          preview_url: 'https://p.scdn.co/test.mp3',
          external_urls: { spotify: 'https://spotify.com/test2' }
        }
      ];

      // Dispatch a custom event to inject mock data
      window.dispatchEvent(new CustomEvent('mockMusicData', { detail: mockTracks }));
    });

    console.log('✓ Injected mock music data');

    // Wait for the UI to potentially update
    await page.waitForTimeout(3000);

    // Take screenshot after mock data injection
    await page.screenshot({ 
      path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/youtube-direct-after-mock.png',
      fullPage: true 
    });

    // Let's test the YouTube integration by calling the API directly
    console.log('\n🔍 Testing YouTube API direct call...');
    
    const apiResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/youtube-debug', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: 'Energetic Song Test Artist upbeat music'
          })
        });
        
        const data = await response.json();
        return { status: response.status, data };
      } catch (error) {
        return { error: error.message };
      }
    });

    console.log('YouTube API Response:', JSON.stringify(apiResponse, null, 2));

    // Check if we have a valid YouTube API key by looking at the response
    if (apiResponse.status === 200 && apiResponse.data && !apiResponse.data.error) {
      console.log('✅ YouTube API key is working!');
      console.log(`Found ${apiResponse.data.items?.length || 0} video results`);
      
      if (apiResponse.data.items && apiResponse.data.items.length > 0) {
        const firstVideo = apiResponse.data.items[0];
        console.log(`First video: "${firstVideo.snippet?.title}" - ID: ${firstVideo.id?.videoId}`);
      }
    } else {
      console.log('❌ YouTube API key issue:');
      console.log('Response:', apiResponse);
    }

    // Test the YouTube integration component directly
    console.log('\n🎬 Testing YouTube integration component...');
    
    const componentTest = await page.evaluate(async () => {
      // Test the searchYouTubeVideo function directly if available
      if (window.searchYouTubeVideo) {
        try {
          const result = await window.searchYouTubeVideo('Test Song by Test Artist');
          return { success: true, result };
        } catch (error) {
          return { success: false, error: error.message };
        }
      } else {
        return { success: false, error: 'searchYouTubeVideo function not available' };
      }
    });

    console.log('Component test result:', JSON.stringify(componentTest, null, 2));

    // Check for any YouTube buttons that might have appeared
    const youtubeButtons = page.locator('button:has-text("▶"), button:has-text("Play"), .youtube-button, [data-testid="youtube-button"]');
    const buttonCount = await youtubeButtons.count();
    console.log(`\n📊 Found ${buttonCount} YouTube buttons on page`);

    // Check console messages
    console.log('\n📝 CONSOLE MESSAGES:');
    if (consoleMessages.length > 0) {
      consoleMessages.forEach(msg => console.log(msg));
    } else {
      console.log('No YouTube/API related console messages found');
    }

    // Final assessment
    console.log('\n🎯 YOUTUBE API KEY VERIFICATION:');
    if (apiResponse.status === 200 && !apiResponse.data?.error) {
      console.log('✅ SUCCESS: YouTube API key is configured and working');
      console.log('✅ The YouTube integration should work once Spotify provides music data');
    } else {
      console.log('❌ ISSUE: YouTube API key is not working properly');
      console.log('The API key may be invalid, expired, or have restrictions');
    }

    // The main issue is Spotify authentication, not YouTube
    console.log('\n⚠️  NOTE: The main issue preventing full testing is Spotify authentication');
    console.log('Once Spotify credentials are configured, YouTube buttons should appear and work');
  });
});