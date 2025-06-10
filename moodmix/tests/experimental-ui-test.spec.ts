import { test, expect } from '@playwright/test'

test('Experimental UI - visual and interaction test', async ({ page }) => {
  console.log('🎨 Testing experimental UI elements')
  
  await page.goto('https://mood-mix-theta.vercel.app/experimental')
  await page.waitForLoadState('networkidle')
  
  // Test 1: Check all UI elements are present
  console.log('\n=== Testing UI Elements ===')
  
  // Logo and title
  const logo = await page.locator('.inline-flex').filter({ hasText: 'MoodMix' })
  expect(await logo.count()).toBe(1)
  
  // Main heading with animated text
  const heading = await page.locator('h1').filter({ hasText: 'How are you' })
  expect(await heading.count()).toBe(1)
  
  // Check mood cards
  const moodCards = await page.locator('.group.cursor-pointer').all()
  console.log(`Found ${moodCards.length} mood cards`)
  expect(moodCards.length).toBe(12)
  
  // Test 2: Check each mood card has proper content
  console.log('\n=== Checking Mood Cards ===')
  const expectedMoods = [
    'Euphoric', 'Melancholic', 'Energetic', 'Serene', 
    'Passionate', 'Contemplative', 'Nostalgic', 'Rebellious',
    'Mystical', 'Triumphant', 'Vulnerable', 'Adventurous'
  ]
  
  for (const mood of expectedMoods) {
    const card = await page.locator('.group.cursor-pointer').filter({ hasText: mood })
    const exists = await card.count() > 0
    console.log(`${mood}: ${exists ? '✅' : '❌'}`)
    expect(exists).toBe(true)
  }
  
  // Test 3: Test hover effects
  console.log('\n=== Testing Hover Effects ===')
  const firstCard = moodCards[0]
  await firstCard.hover()
  await page.waitForTimeout(500)
  
  // Test 4: Test mood selection modal
  console.log('\n=== Testing Mood Selection ===')
  const energeticCard = await page.locator('.group.cursor-pointer').filter({ hasText: 'Energetic' }).first()
  await energeticCard.click()
  
  // Check modal appears
  const modal = await page.locator('.fixed.inset-0.z-50')
  expect(await modal.count()).toBe(1)
  
  const modalTitle = await page.locator('h3').filter({ hasText: 'Energetic Vibes' })
  expect(await modalTitle.count()).toBe(1)
  
  // Check loading bar
  const loadingBar = await page.locator('.bg-gradient-to-r.from-purple-400.to-pink-400')
  expect(await loadingBar.count()).toBeGreaterThan(0)
  
  // Test 5: Test background animations
  console.log('\n=== Testing Background Animations ===')
  const floatingOrbs = await page.locator('.absolute.rounded-full.blur-3xl').all()
  console.log(`Found ${floatingOrbs.length} floating orbs`)
  expect(floatingOrbs.length).toBe(3)
  
  const soundWaves = await page.locator('.absolute.bg-white.rounded-full').all()
  console.log(`Found ${soundWaves.length} sound wave bars`)
  expect(soundWaves.length).toBe(20)
  
  // Take screenshots
  await page.screenshot({ path: 'test-results/experimental-ui-full.png', fullPage: true })
  
  // Close modal
  await page.keyboard.press('Escape')
  await page.waitForTimeout(500)
  
  // Take clean screenshot
  await page.screenshot({ path: 'test-results/experimental-ui-clean.png', fullPage: true })
  
  console.log('\n✅ Experimental UI test completed successfully!')
})