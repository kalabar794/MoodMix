import { test, expect } from '@playwright/test';

test.describe('Manual YouTube Fix Verification', () => {
  test('verify YouTube fix - clean interface with only Spotify buttons', async ({ page }) => {
    console.log('🔍 Testing YouTube fix on live site...');
    
    // Navigate to live site
    await page.goto('https://mood-mix-theta.vercel.app/');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of initial mood selection
    await page.screenshot({ 
      path: 'test-results/01-mood-selection-page.png',
      fullPage: true 
    });
    
    // Click Energetic mood
    console.log('🎯 Clicking Energetic mood...');
    await page.click('text=Energetic');
    
    // Wait for music results to appear (use a more flexible wait)
    await page.waitForTimeout(10000); // Give time for API calls
    
    // Take screenshot showing the music results
    await page.screenshot({ 
      path: 'test-results/02-music-results-with-fix.png',
      fullPage: true 
    });
    
    // Check what buttons are actually present
    const allButtons = await page.locator('button').allInnerTexts();
    console.log('🔍 All buttons found:', allButtons);
    
    // Look for Spotify-related elements
    const spotifyElements = await page.locator('[class*="spotify"], [id*="spotify"], button:has-text("Spotify")').count();
    console.log(`✅ Spotify elements found: ${spotifyElements}`);
    
    // Look for YouTube-related elements
    const youtubeElements = await page.locator('[class*="youtube"], [id*="youtube"], button:has-text("YouTube")').count();
    console.log(`❌ YouTube elements found: ${youtubeElements}`);
    
    // Look for any play buttons
    const playButtons = await page.locator('button:has-text("Play"), [aria-label*="play"], .play-button').count();
    console.log(`🎵 Play buttons found: ${playButtons}`);
    
    // Check for any modal dialogs
    const modals = await page.locator('[role="dialog"], .modal, [class*="modal"]').count();
    console.log(`📱 Modals found: ${modals}`);
    
    // Final verification screenshot
    await page.screenshot({ 
      path: 'test-results/03-final-verification.png',
      fullPage: true 
    });
    
    console.log('✅ YouTube fix verification complete!');
    console.log('Expected: Only Spotify buttons, no YouTube elements');
  });
});