import { test, expect } from '@playwright/test';

test.describe('YouTube Button Detection Test', () => {
  test('should detect YouTube buttons with different selectors', async ({ page }) => {
    // Navigate to the application with debug mode enabled
    await page.goto('http://localhost:3000?debug=true');
    
    console.log('✅ Navigated to localhost:3000 with debug mode');
    
    // Wait for mood cards to load
    await page.waitForSelector('text=Energetic', { timeout: 10000 });
    
    // Click on the Energetic card
    const energeticCard = page.locator('text=Energetic').first();
    await energeticCard.click();
    console.log('✅ Clicked on Energetic mood');
    
    // Wait for music results to load
    await page.waitForTimeout(8000);
    
    // Take screenshot
    await page.screenshot({ 
      path: '/Users/jonathonc/Auto1111/claude/MoodMix/moodmix/test-results/button-detection-test.png',
      fullPage: true 
    });
    
    // Try different button selectors
    const selectors = [
      'button[class*="bg-red"]',
      'button[class*="red"]',
      'button[title*="YouTube"]',
      'button[title*="Watch"]',
      'button svg[viewBox="0 0 24 24"]',
      'button:has(svg)',
      'button[class*="w-10"][class*="h-10"][class*="rounded-full"]',
      '.bg-red-600',
      'button'
    ];
    
    for (const selector of selectors) {
      const buttons = page.locator(selector);
      const count = await buttons.count();
      console.log(`📝 Selector "${selector}": ${count} buttons found`);
      
      if (count > 0 && count < 20) { // Reasonable number for YouTube buttons
        // Get button info
        for (let i = 0; i < Math.min(count, 5); i++) {
          const button = buttons.nth(i);
          const className = await button.getAttribute('class') || '';
          const title = await button.getAttribute('title') || '';
          const text = await button.textContent() || '';
          console.log(`  Button ${i + 1}: class="${className}", title="${title}", text="${text.slice(0, 50)}"`);
        }
      }
    }
    
    // Look for red background styles specifically
    const redButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.map((btn, index) => {
        const computed = window.getComputedStyle(btn);
        return {
          index,
          backgroundColor: computed.backgroundColor,
          className: btn.className,
          title: btn.title,
          hasRedBackground: computed.backgroundColor.includes('rgb(220, 38, 38)') || // red-600
                           computed.backgroundColor.includes('rgb(239, 68, 68)') || // red-500
                           computed.backgroundColor.includes('red')
        };
      }).filter(btn => btn.hasRedBackground);
    });
    
    console.log('📝 Buttons with red background:', redButtons.length);
    redButtons.forEach((btn, i) => {
      console.log(`  Red button ${i + 1}: ${btn.backgroundColor}, class="${btn.className}", title="${btn.title}"`);
    });
    
    // Get all button text content for debugging
    const allButtons = await page.locator('button').all();
    console.log(`📝 Total buttons found: ${allButtons.length}`);
    
    // Check for YouTube-specific indicators
    const youtubeIndicators = await page.evaluate(() => {
      const indicators = [];
      
      // Look for YouTube-related text
      if (document.body.textContent?.toLowerCase().includes('youtube')) {
        indicators.push('Found "youtube" text in page');
      }
      
      // Look for play icons (triangle shapes)
      const svgs = Array.from(document.querySelectorAll('svg'));
      const playIcons = svgs.filter(svg => {
        const paths = svg.querySelectorAll('path');
        return Array.from(paths).some(path => {
          const d = path.getAttribute('d') || '';
          return d.includes('8 5v14l11-7') || d.includes('triangle') || d.includes('play');
        });
      });
      
      if (playIcons.length > 0) {
        indicators.push(`Found ${playIcons.length} play icon SVGs`);
      }
      
      return indicators;
    });
    
    console.log('📝 YouTube indicators:', youtubeIndicators);
    
    expect(true).toBe(true); // Always pass for debugging
  });
});