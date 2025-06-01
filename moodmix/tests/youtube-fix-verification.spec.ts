import { test, expect } from '@playwright/test';

test.describe('YouTube Fix Verification - Live Site', () => {
  test('should show only Spotify buttons with no YouTube elements', async ({ page }) => {
    // Navigate to live site
    await page.goto('https://mood-mix-theta.vercel.app/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Select Energetic mood
    await page.click('text=Energetic');
    
    // Wait for music results to load
    await page.waitForSelector('[data-testid="music-results"]', { timeout: 30000 });
    
    // Take screenshot of the initial results
    await page.screenshot({ 
      path: 'test-results/youtube-fix-verification-initial.png',
      fullPage: true 
    });
    
    // Verify NO YouTube buttons are present
    const youtubeButtons = page.locator('button:has-text("YouTube")');
    await expect(youtubeButtons).toHaveCount(0);
    
    // Verify NO "Search YouTube" text is present
    const searchYouTubeText = page.locator('text=Search YouTube');
    await expect(searchYouTubeText).toHaveCount(0);
    
    // Verify NO YouTube modals are present
    const youtubeModals = page.locator('[data-testid="youtube-modal"]');
    await expect(youtubeModals).toHaveCount(0);
    
    // Verify Spotify buttons ARE present
    const spotifyButtons = page.locator('button:has-text("Play on Spotify")');
    await expect(spotifyButtons).toBeVisible();
    
    // Count Spotify buttons (should be multiple)
    const spotifyButtonCount = await spotifyButtons.count();
    expect(spotifyButtonCount).toBeGreaterThan(0);
    
    console.log(`✅ Found ${spotifyButtonCount} Spotify buttons`);
    console.log('✅ No YouTube buttons found');
    console.log('✅ No YouTube search interface found');
    
    // Take final screenshot showing clean interface
    await page.screenshot({ 
      path: 'test-results/youtube-fix-verification-final.png',
      fullPage: true 
    });
    
    // Try clicking on a track to ensure no YouTube modals appear
    const firstTrack = page.locator('[data-testid="music-results"] .track-item').first();
    if (await firstTrack.isVisible()) {
      await firstTrack.click();
      
      // Wait a moment for any potential modals
      await page.waitForTimeout(2000);
      
      // Verify still no YouTube modals
      const youtubeModalsAfterClick = page.locator('[data-testid="youtube-modal"]');
      await expect(youtubeModalsAfterClick).toHaveCount(0);
      
      console.log('✅ No YouTube modals appeared after clicking track');
    }
  });
  
  test('should verify clean music results interface', async ({ page }) => {
    await page.goto('https://mood-mix-theta.vercel.app/');
    await page.waitForLoadState('networkidle');
    
    // Select mood
    await page.click('text=Happy');
    await page.waitForSelector('[data-testid="music-results"]', { timeout: 30000 });
    
    // Check for clean interface elements
    const musicResults = page.locator('[data-testid="music-results"]');
    await expect(musicResults).toBeVisible();
    
    // Verify track elements are present
    const tracks = page.locator('.track-item, .music-track, [class*="track"]');
    const trackCount = await tracks.count();
    expect(trackCount).toBeGreaterThan(0);
    
    console.log(`✅ Found ${trackCount} music tracks`);
    
    // Take screenshot of clean interface
    await page.screenshot({ 
      path: 'test-results/clean-interface-verification.png',
      fullPage: true 
    });
  });
});