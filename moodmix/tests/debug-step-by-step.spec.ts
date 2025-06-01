import { test, expect } from '@playwright/test';

test('Debug step by step - see what happens after mood click', async ({ page }) => {
  console.log('🔍 DEBUG: Step by step analysis');
  
  // Navigate to the app
  console.log('🌐 Navigating to localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  // Screenshot 1: Initial page
  await page.screenshot({ 
    path: 'test-results/debug-01-initial.png',
    fullPage: true 
  });
  console.log('📸 Screenshot 1: Initial page');

  // Wait for mood cards
  await page.waitForSelector('text=Energetic', { timeout: 10000 });
  console.log('✅ Energetic mood card found');
  
  // Screenshot 2: Before click
  await page.screenshot({ 
    path: 'test-results/debug-02-before-click.png',
    fullPage: true 
  });
  console.log('📸 Screenshot 2: Before clicking Energetic');

  // Click Energetic
  console.log('🎯 Clicking Energetic...');
  await page.click('text=Energetic');
  
  // Wait a moment for reaction
  await page.waitForTimeout(2000);
  
  // Screenshot 3: Immediately after click
  await page.screenshot({ 
    path: 'test-results/debug-03-after-click.png',
    fullPage: true 
  });
  console.log('📸 Screenshot 3: Immediately after click');

  // Wait longer and take another screenshot
  await page.waitForTimeout(5000);
  
  await page.screenshot({ 
    path: 'test-results/debug-04-after-5-seconds.png',
    fullPage: true 
  });
  console.log('📸 Screenshot 4: After 5 seconds');

  // Check what text is visible on the page
  const pageText = await page.textContent('body');
  console.log('📝 Current page text (first 500 chars):', pageText?.substring(0, 500));

  // Check for any error messages
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    consoleMessages.push(`${msg.type()}: ${msg.text()}`);
  });

  // Check network responses
  const networkResponses: string[] = [];
  page.on('response', response => {
    networkResponses.push(`${response.status()} ${response.url()}`);
  });

  // Wait longer to see if anything loads
  await page.waitForTimeout(10000);
  
  await page.screenshot({ 
    path: 'test-results/debug-05-after-15-seconds.png',
    fullPage: true 
  });
  console.log('📸 Screenshot 5: After 15 seconds total');

  console.log('🌐 Network responses:', networkResponses.slice(-10)); // Last 10 responses
  console.log('💬 Console messages:', consoleMessages.slice(-10)); // Last 10 messages

  // Check if we can find any music-related elements
  const musicElements = await page.locator('*').evaluateAll(elements => {
    return elements.filter(el => {
      const text = el.textContent?.toLowerCase() || '';
      return text.includes('music') || text.includes('track') || text.includes('spotify') || text.includes('youtube');
    }).map(el => `${el.tagName}: ${el.textContent?.substring(0, 100)}`);
  });
  
  console.log('🎵 Music-related elements found:', musicElements);

  // Check for any buttons
  const allButtons = await page.locator('button').allTextContents();
  console.log('🔘 All buttons found:', allButtons);

  console.log('🔍 Debug complete - check screenshots for visual progress');
});