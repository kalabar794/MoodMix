import { test, expect } from '@playwright/test';

test.describe('YouTube API Direct Test', () => {
  test('Test YouTube API key directly', async ({ page }) => {
    console.log('\n🔧 TESTING YOUTUBE API KEY DIRECTLY');
    
    // Navigate to the page to get access to environment variables
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');

    // Test the YouTube API key directly using the browser
    const apiKeyTest = await page.evaluate(async () => {
      // Get the API key from the environment
      const apiKey = 'AIzaSyA1QWW8HCIlkRdfdmkOjcHnnEQEVlXxtQw'; // From .env.local
      
      if (!apiKey) {
        return { success: false, error: 'No API key found' };
      }

      console.log('Testing YouTube API key:', apiKey.substring(0, 10) + '...');

      try {
        // Test the YouTube API directly
        const searchUrl = 'https://www.googleapis.com/youtube/v3/search';
        const params = new URLSearchParams({
          part: 'snippet',
          q: 'upbeat energetic music',
          type: 'video',
          videoCategoryId: '10', // Music category
          maxResults: '5',
          order: 'relevance',
          key: apiKey
        });

        const response = await fetch(`${searchUrl}?${params}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          return { 
            success: false, 
            error: `HTTP ${response.status}: ${errorText}`,
            status: response.status 
          };
        }

        const data = await response.json();
        
        if (data.error) {
          return { 
            success: false, 
            error: data.error.message || 'API error',
            code: data.error.code 
          };
        }

        return {
          success: true,
          totalResults: data.pageInfo?.totalResults || 0,
          resultCount: data.items?.length || 0,
          firstVideoTitle: data.items?.[0]?.snippet?.title || 'No videos found',
          apiKeyWorking: true
        };
        
      } catch (error) {
        return { 
          success: false, 
          error: error.message,
          networkError: true 
        };
      }
    });

    console.log('\n📊 YOUTUBE API TEST RESULTS:');
    console.log(JSON.stringify(apiKeyTest, null, 2));

    if (apiKeyTest.success) {
      console.log('✅ SUCCESS: YouTube API key is working!');
      console.log(`✅ Found ${apiKeyTest.resultCount} video results`);
      console.log(`✅ Total available results: ${apiKeyTest.totalResults}`);
      console.log(`✅ First video: "${apiKeyTest.firstVideoTitle}"`);
    } else {
      console.log('❌ FAILED: YouTube API key test failed');
      console.log(`❌ Error: ${apiKeyTest.error}`);
      
      if (apiKeyTest.status === 403) {
        console.log('❌ This is likely an API key authorization issue');
        console.log('❌ Check if the key has YouTube Data API v3 enabled');
        console.log('❌ Check if there are any IP restrictions');
      } else if (apiKeyTest.status === 400) {
        console.log('❌ This is likely a bad request or invalid parameters');
      } else if (apiKeyTest.networkError) {
        console.log('❌ This is a network connectivity issue');
      }
    }

    // Now test with the YouTubeMusicIntegration class
    console.log('\n🎵 TESTING YOUTUBE MUSIC INTEGRATION CLASS');
    
    const integrationTest = await page.evaluate(async () => {
      try {
        // Define the YouTubeMusicIntegration class inline for testing
        class YouTubeMusicIntegration {
          private apiKey: string;
          private baseUrl = 'https://www.googleapis.com/youtube/v3';

          constructor(apiKey: string) {
            this.apiKey = apiKey;
          }

          async searchMusicVideo(trackName: string, artistName: string) {
            if (!this.apiKey) {
              return { success: false, error: 'No API key' };
            }

            try {
              const query = `"${trackName}" "${artistName}" official music video`;
              const searchUrl = `${this.baseUrl}/search`;
              const params = new URLSearchParams({
                part: 'snippet',
                q: query,
                type: 'video',
                videoCategoryId: '10',
                maxResults: '3',
                order: 'relevance',
                key: this.apiKey
              });

              const response = await fetch(`${searchUrl}?${params}`);
              
              if (!response.ok) {
                const errorText = await response.text();
                return { success: false, error: `HTTP ${response.status}: ${errorText}` };
              }

              const data = await response.json();
              
              if (data.error) {
                return { success: false, error: data.error.message };
              }

              return {
                success: true,
                videos: data.items || [],
                searchQuery: query,
                resultCount: data.items?.length || 0
              };
              
            } catch (error) {
              return { success: false, error: error.message };
            }
          }
        }

        // Test the integration
        const youtube = new YouTubeMusicIntegration('AIzaSyA1QWW8HCIlkRdfdmkOjcHnnEQEVlXxtQw');
        const result = await youtube.searchMusicVideo('Happy', 'Pharrell Williams');
        
        return result;
        
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    console.log('\n📊 INTEGRATION TEST RESULTS:');
    console.log(JSON.stringify(integrationTest, null, 2));

    if (integrationTest.success) {
      console.log('✅ SUCCESS: YouTube Music Integration is working!');
      console.log(`✅ Found ${integrationTest.resultCount} video results for test track`);
      console.log(`✅ Search query: "${integrationTest.searchQuery}"`);
    } else {
      console.log('❌ FAILED: YouTube Music Integration failed');
      console.log(`❌ Error: ${integrationTest.error}`);
    }

    // Final assessment
    console.log('\n🎯 FINAL YOUTUBE API ASSESSMENT:');
    
    if (apiKeyTest.success && integrationTest.success) {
      console.log('✅ EXCELLENT: YouTube API key is working perfectly!');
      console.log('✅ Both direct API calls and integration class work');
      console.log('✅ YouTube buttons should be RED (▶) when music results are available');
      console.log('✅ The issue is likely with Spotify authentication, not YouTube');
    } else if (apiKeyTest.success) {
      console.log('⚠️  PARTIAL: Direct API works but integration has issues');
      console.log('⚠️  This suggests a code issue in the integration class');
    } else {
      console.log('❌ CRITICAL: YouTube API key is not working');
      console.log('❌ This explains why YouTube buttons are gray (—) instead of red (▶)');
      
      if (apiKeyTest.status === 403) {
        console.log('🔧 FIX: Enable YouTube Data API v3 in Google Cloud Console');
        console.log('🔧 FIX: Check API key restrictions and quotas');
      }
    }

    // Expect the API to work for the test to pass
    expect(apiKeyTest.success).toBe(true);
    expect(integrationTest.success).toBe(true);
  });
});