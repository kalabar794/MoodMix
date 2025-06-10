import { test, expect } from '@playwright/test'

test('Test experimental page locally', async ({ page }) => {
  console.log('🎨 Testing experimental page on local server')
  
  await page.goto('http://localhost:3001/experimental')
  await page.waitForLoadState('networkidle')
  
  // Check page loaded
  const title = await page.title()
  console.log(`Page title: ${title}`)
  
  // Check for mood cards
  const moodCards = await page.locator('.group.cursor-pointer').all()
  console.log(`\nFound ${moodCards.length} mood cards`)
  
  if (moodCards.length === 0) {
    // Check for any error messages
    const bodyText = await page.locator('body').textContent()
    console.log('\nPage content:', bodyText?.substring(0, 200))
  } else {
    // List all moods
    console.log('\nMood cards found:')
    for (let i = 0; i < moodCards.length; i++) {
      const text = await moodCards[i].textContent()
      console.log(`${i + 1}. ${text}`)
    }
  }
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/experimental-local.png', fullPage: true })
  
  // If cards exist, test interaction
  if (moodCards.length > 0) {
    console.log('\nTesting Energetic mood selection...')
    const energeticCard = await page.locator('.group.cursor-pointer').filter({ hasText: 'Energetic' }).first()
    await energeticCard.click()
    
    // Wait for modal
    await page.waitForTimeout(1000)
    
    // Check for modal
    const modal = await page.locator('.fixed.inset-0.z-50').count()
    console.log(`Modal appeared: ${modal > 0 ? '✅' : '❌'}`)
    
    if (modal > 0) {
      await page.screenshot({ path: 'test-results/experimental-modal.png' })
    }
  }
})