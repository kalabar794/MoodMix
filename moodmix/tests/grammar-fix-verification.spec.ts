import { test, expect } from '@playwright/test'

test('Verify grammar fixes in hero text', async ({ page }) => {
  console.log('🔍 Verifying grammar improvements')
  
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  
  // 1. Check that the heading uses correct grammar
  console.log('\n✅ Checking hero heading grammar:')
  
  const heading = await page.locator('h1').textContent()
  console.log(`   Current heading: "${heading}"`)
  
  // Should start with "Feeling" not "How are you"
  expect(heading).toContain('Feeling')
  expect(heading).not.toContain('How are you')
  console.log('   ✅ Uses "Feeling" instead of "How are you"')
  
  // 2. Check subtitle is improved
  const subtitle = await page.locator('p').filter({ hasText: 'Let\'s find' }).textContent()
  console.log(`   Subtitle: "${subtitle}"`)
  expect(subtitle).toContain('Let\'s find the perfect soundtrack')
  console.log('   ✅ Improved conversational subtitle')
  
  // 3. Test mood selection for modal grammar
  console.log('\n✅ Testing modal text:')
  await page.locator('.group.cursor-pointer').filter({ hasText: 'Euphoric' }).click()
  
  await page.waitForSelector('.fixed.inset-0.z-50', { timeout: 5000 })
  const modalText = await page.locator('.fixed.inset-0.z-50').textContent()
  
  // Should say "Finding your perfect euphoric tracks" not "Curating the perfect"
  expect(modalText).toContain('Finding your perfect euphoric tracks')
  console.log('   ✅ Modal uses "Finding your perfect" phrasing')
  
  // Take screenshot
  await page.screenshot({ 
    path: 'test-results/grammar-improvements.png', 
    fullPage: true 
  })
  
  console.log('\n🎉 All grammar improvements verified!')
  console.log('   ✅ "Feeling euphoric?" instead of "How are you euphoric?"')
  console.log('   ✅ More conversational and engaging copy')
  console.log('   ✅ Consistent tone throughout')
})