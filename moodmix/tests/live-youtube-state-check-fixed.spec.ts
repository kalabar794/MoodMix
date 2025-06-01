import { test, expect } from '@playwright/test';

test.describe('Live YouTube Integration State Check', () => {
  test('Check current state of YouTube integration on live site', async ({ page }) => {
    console.log('🔍 Starting comprehensive YouTube integration check on live site...');
    
    // Navigate to live site
    await page.goto('https://mood-mix-theta.vercel.app/');
    await page.waitForLoadState('networkidle');
    
    // Take initial screenshot
    await page.screenshot({ 
      path: 'test-results/live-site-initial.png', 
      fullPage: true 
    });
    console.log('📸 Initial site screenshot taken');
    
    // Check for any JavaScript errors in console
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
        console.log('❌ Console error:', msg.text());
      }
    });
    
    // Wait for mood cards to load (not mood wheel)
    await page.waitForSelector('text=SELECT YOUR MOOD BELOW', { timeout: 10000 });
    console.log('✅ Mood selector loaded');
    
    // Select "Energetic" mood by clicking the card
    console.log('🎯 Selecting Energetic mood...');
    const energeticCard = page.locator('text=Energetic').locator('..').locator('..');
    await energeticCard.click();
    
    // Wait for music results to load
    console.log('⏳ Waiting for music results...');
    await page.waitForTimeout(5000); // Give time for API call and results to load
    
    // Take screenshot after mood selection
    await page.screenshot({ 
      path: 'test-results/live-site-after-mood-selection.png', 
      fullPage: true 
    });
    console.log('📸 Screenshot after mood selection taken');
    
    // Check for YouTube-related elements
    console.log('🔍 Checking for YouTube elements...');
    
    // Look for YouTube buttons
    const youtubeButtons = await page.locator('button:has-text("YouTube"), button:has-text("Watch"), [data-testid*="youtube"], .youtube-button').count();
    console.log(`🎬 YouTube buttons found: ${youtubeButtons}`);
    
    // Look for red YouTube icons/buttons
    const redYouTubeElements = await page.locator('button[style*="red"], .youtube-red, [class*="youtube"][class*="red"]').count();
    console.log(`🔴 Red YouTube elements found: ${redYouTubeElements}`);
    
    // Check for any YouTube-related text
    const youtubeText = await page.locator('text=/youtube/i').count();
    console.log(`📝 Elements containing "YouTube" text: ${youtubeText}`);
    
    // Check for video/iframe elements
    const iframes = await page.locator('iframe').count();
    const videos = await page.locator('video').count();
    console.log(`🖼️ iframes found: ${iframes}`);
    console.log(`🎥 video elements found: ${videos}`);
    
    // Look for music results area more generally
    const musicResultsAreas = await page.locator('text=/track|song|artist|spotify|music/i').count();
    console.log(`🎵 Music-related content areas: ${musicResultsAreas}`);
    
    // Check for Spotify elements for comparison
    const spotifyButtons = await page.locator('button:has-text("Play"), [data-testid*="spotify"], .spotify-button').count();
    console.log(`🎵 Spotify-related buttons found: ${spotifyButtons}`);
    
    // Look for any play buttons
    const playButtons = await page.locator('button:has-text("Play"), button[aria-label*="play"]').count();
    console.log(`▶️ Play buttons found: ${playButtons}`);
    
    // Check for any hidden YouTube elements
    const hiddenYouTubeElements = await page.locator('[style*="display: none"]:has-text("youtube"), .hidden:has-text("youtube")').count();
    console.log(`👻 Hidden YouTube elements: ${hiddenYouTubeElements}`);
    
    // Get page content to analyze
    const pageContent = await page.content();
    const hasYouTubeInHTML = pageContent.toLowerCase().includes('youtube');
    console.log(`📄 YouTube mentioned in HTML: ${hasYouTubeInHTML}`);
    
    // Try selecting another mood to see if YouTube elements appear
    console.log('🎯 Trying another mood (Serene)...');
    const sereneCard = page.locator('text=Serene').locator('..').locator('..');
    if (await sereneCard.isVisible()) {
      await sereneCard.click();
      await page.waitForTimeout(5000);
      
      // Check again for YouTube elements
      const youtubeButtonsAfterSerene = await page.locator('button:has-text("YouTube"), button:has-text("Watch")').count();
      console.log(`🎬 YouTube buttons after Serene mood: ${youtubeButtonsAfterSerene}`);
      
      await page.screenshot({ 
        path: 'test-results/live-site-serene-mood.png', 
        fullPage: true 
      });
    }
    
    // Final summary
    console.log('\n📊 FINAL SUMMARY:');
    console.log(`❌ Console errors: ${errors.length}`);
    if (errors.length > 0) {
      console.log('Errors:', errors);
    }
    console.log(`🎬 YouTube buttons: ${youtubeButtons}`);
    console.log(`🔴 Red YouTube elements: ${redYouTubeElements}`);
    console.log(`📝 YouTube text elements: ${youtubeText}`);
    console.log(`🖼️ iframes: ${iframes}`);
    console.log(`🎥 video elements: ${videos}`);
    console.log(`🎵 Spotify buttons: ${spotifyButtons}`);
    console.log(`▶️ Total play buttons: ${playButtons}`);
    console.log(`📄 YouTube in HTML: ${hasYouTubeInHTML}`);
    
    // Take a final full page screenshot
    await page.screenshot({ 
      path: 'test-results/live-site-final-state.png', 
      fullPage: true 
    });
    
    // The test passes regardless - we're just gathering info
    expect(true).toBe(true);
  });
});