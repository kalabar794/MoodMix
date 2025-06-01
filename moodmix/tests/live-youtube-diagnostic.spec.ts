import { test, expect } from '@playwright/test';

test.describe('Live YouTube Diagnostic', () => {
  test('Deep diagnostic of YouTube integration on live site', async ({ page }) => {
    console.log('🔍 Starting deep diagnostic of YouTube integration...');
    
    // Monitor network requests
    const requests: any[] = [];
    const responses: any[] = [];
    
    page.on('request', (request) => {
      requests.push({
        url: request.url(),
        method: request.method(),
        headers: request.headers()
      });
    });
    
    page.on('response', (response) => {
      responses.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
    });
    
    // Monitor console logs
    const consoleLogs: any[] = [];
    page.on('console', (msg) => {
      consoleLogs.push({
        type: msg.type(),
        text: msg.text(),
        args: msg.args()
      });
    });
    
    await page.goto('https://mood-mix-theta.vercel.app/');
    await page.waitForLoadState('networkidle');
    
    // Take initial screenshot
    await page.screenshot({ 
      path: 'test-results/diagnostic-initial.png', 
      fullPage: true 
    });
    
    // Wait for mood cards and select one
    await page.waitForSelector('text=SELECT YOUR MOOD BELOW', { timeout: 10000 });
    const energeticCard = page.locator('text=Energetic').locator('..').locator('..');
    await energeticCard.click();
    
    // Wait extra time for all API calls to complete
    await page.waitForTimeout(10000);
    
    // Take screenshot after mood selection
    await page.screenshot({ 
      path: 'test-results/diagnostic-after-mood.png', 
      fullPage: true 
    });
    
    // Check if YouTube API calls were made
    const youtubeRequests = requests.filter(req => 
      req.url.includes('youtube') || 
      req.url.includes('mood-to-music') ||
      req.url.includes('youtube-debug')
    );
    
    console.log('🌐 YouTube-related network requests:', youtubeRequests.length);
    youtubeRequests.forEach(req => {
      console.log(`  → ${req.method} ${req.url}`);
    });
    
    // Check console logs for YouTube-related messages
    const youtubeConsole = consoleLogs.filter(log => 
      log.text.toLowerCase().includes('youtube') ||
      log.text.toLowerCase().includes('🎬')
    );
    
    console.log('📝 YouTube-related console logs:', youtubeConsole.length);
    youtubeConsole.forEach(log => {
      console.log(`  ${log.type}: ${log.text}`);
    });
    
    // Check if MusicResults component loaded
    const musicResultsExists = await page.locator('[data-testid="music-results"]').count() > 0;
    console.log('🎵 MusicResults component exists:', musicResultsExists);
    
    // Check for any elements that might be YouTube buttons
    const allButtons = await page.locator('button').count();
    console.log('🔘 Total buttons on page:', allButtons);
    
    // Get all button text/attributes
    const buttonInfo = await page.locator('button').evaluateAll(buttons => 
      buttons.map(btn => ({
        text: btn.textContent?.trim(),
        className: btn.className,
        title: btn.title,
        style: btn.getAttribute('style')
      }))
    );
    
    console.log('🔘 Button analysis:');
    buttonInfo.forEach((btn, index) => {
      if (btn.text || btn.title || btn.className.includes('red') || btn.style?.includes('red')) {
        console.log(`  Button ${index}: "${btn.text}" | class: ${btn.className} | title: ${btn.title}`);
      }
    });
    
    // Check page source for YouTube-related code
    const pageContent = await page.content();
    const hasYouTubeInSource = pageContent.includes('YouTubeButton') || pageContent.includes('youtube-integration');
    console.log('📄 YouTube code in page source:', hasYouTubeInSource);
    
    // Check if Next.js properly bundled the YouTube components
    const scriptTags = await page.locator('script[src]').evaluateAll(scripts => 
      scripts.map(script => script.getAttribute('src')).filter(src => src)
    );
    
    console.log('📦 Script bundles loaded:');
    scriptTags.forEach(src => {
      console.log(`  → ${src}`);
    });
    
    // Check for React component mounting issues
    const reactErrors = consoleLogs.filter(log => 
      log.text.includes('React') || 
      log.text.includes('Component') ||
      log.text.includes('Hook') ||
      log.type === 'error'
    );
    
    console.log('⚛️  React/Component errors:', reactErrors.length);
    reactErrors.forEach(error => {
      console.log(`  ERROR: ${error.text}`);
    });
    
    // Final comprehensive report
    console.log('\n📊 COMPREHENSIVE DIAGNOSTIC REPORT:');
    console.log('====================================');
    console.log(`🌐 Total network requests: ${requests.length}`);
    console.log(`🎬 YouTube API requests: ${youtubeRequests.length}`);
    console.log(`📝 Console logs: ${consoleLogs.length}`);
    console.log(`🎵 Music results component: ${musicResultsExists ? 'FOUND' : 'MISSING'}`);
    console.log(`🔘 Total buttons: ${allButtons}`);
    console.log(`📄 YouTube in source: ${hasYouTubeInSource ? 'YES' : 'NO'}`);
    console.log(`⚛️  React errors: ${reactErrors.length}`);
    
    // Test passes - this is just diagnostic
    expect(true).toBe(true);
  });
  
  test('Test mood-to-music API endpoint directly', async ({ page }) => {
    console.log('🔧 Testing mood-to-music API endpoint directly...');
    
    // Test the API endpoint directly
    const apiResponse = await page.goto('https://mood-mix-theta.vercel.app/api/mood-to-music?mood=energetic');
    const apiStatus = apiResponse?.status();
    const apiText = await apiResponse?.text();
    
    console.log(`📡 API Response Status: ${apiStatus}`);
    console.log('📡 API Response Body:', apiText?.substring(0, 500) + '...');
    
    // Check if response contains YouTube data
    const hasYouTubeData = apiText?.includes('youtube') || apiText?.includes('embedUrl') || apiText?.includes('watchUrl');
    console.log(`🎬 API contains YouTube data: ${hasYouTubeData ? 'YES' : 'NO'}`);
    
    if (apiText) {
      try {
        const jsonResponse = JSON.parse(apiText);
        console.log('📊 API Response Structure:', Object.keys(jsonResponse));
        
        if (jsonResponse.tracks && Array.isArray(jsonResponse.tracks)) {
          console.log(`🎵 Number of tracks: ${jsonResponse.tracks.length}`);
          
          // Check first track for YouTube data
          const firstTrack = jsonResponse.tracks[0];
          if (firstTrack) {
            console.log('🎵 First track structure:', Object.keys(firstTrack));
            const hasYouTubeFields = 'youtubeUrl' in firstTrack || 'youtube' in firstTrack || 'embedUrl' in firstTrack;
            console.log(`🎬 First track has YouTube fields: ${hasYouTubeFields ? 'YES' : 'NO'}`);
          }
        }
      } catch (error) {
        console.log('❌ Failed to parse API response as JSON:', error);
      }
    }
    
    expect(true).toBe(true);
  });
});