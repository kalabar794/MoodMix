import { test, expect } from '@playwright/test'

test('Experimental page - mood selection and music loading', async ({ page }) => {
  console.log('🎨 Testing experimental mood interface')
  
  await page.goto('https://mood-mix-theta.vercel.app/experimental')
  await page.waitForLoadState('networkidle')
  
  // Check that all 12 mood cards are displayed
  const moodCards = await page.locator('.group.cursor-pointer').all()
  console.log(`Found ${moodCards.length} mood cards`)
  expect(moodCards.length).toBe(12)
  
  // Test the animated text cycle
  const animatedText = await page.locator('.inline-block.font-bold').first()
  const firstText = await animatedText.textContent()
  console.log(`First animated text: ${firstText}`)
  
  // Wait for text to change
  await page.waitForTimeout(2500)
  const secondText = await animatedText.textContent()
  console.log(`Second animated text: ${secondText}`)
  expect(firstText).not.toBe(secondText)
  
  // Click on "Energetic" mood
  console.log('\nClicking on Energetic mood...')
  const energeticCard = await page.locator('.group.cursor-pointer').filter({ hasText: 'Energetic' }).first()
  await energeticCard.click()
  
  // Check that modal appears
  await page.waitForSelector('.fixed.inset-0.z-50')
  const modalTitle = await page.locator('h3.text-3xl').textContent()
  console.log(`Modal title: ${modalTitle}`)
  expect(modalTitle).toBe('Energetic Vibes')
  
  // Wait for the loading to complete and music results to show
  console.log('Waiting for music to load...')
  await page.waitForTimeout(4000) // Wait for 3s animation + transition
  
  // Check that we're now on the results page
  const backButton = await page.locator('button:has-text("Back to Moods")')
  expect(await backButton.count()).toBe(1)
  
  // Check for music results
  const resultsHeader = await page.locator('h2').filter({ hasText: 'Your Energetic Playlist' })
  expect(await resultsHeader.count()).toBe(1)
  
  // Check that tracks are loaded
  const trackCards = await page.locator('.track-card').all()
  console.log(`\nLoaded ${trackCards.length} tracks`)
  expect(trackCards.length).toBeGreaterThan(0)
  
  // Test back navigation
  console.log('\nTesting back navigation...')
  await backButton.click()
  
  // Should be back on mood selection
  await page.waitForTimeout(1000)
  const moodCardsAfterBack = await page.locator('.group.cursor-pointer').all()
  expect(moodCardsAfterBack.length).toBe(12)
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/experimental-page-test.png', fullPage: true })
  
  console.log('✅ Experimental page test passed!')
})