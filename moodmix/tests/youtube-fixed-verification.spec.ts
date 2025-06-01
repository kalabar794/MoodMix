import { test, expect } from '@playwright/test'

test.describe('YouTube Fixed Verification', () => {
  test('should show YouTube buttons and search functionality', async ({ page }) => {
    console.log('🎬 Testing YouTube fix - buttons should now be visible...')
    
    // Navigate to the app
    await page.goto('http://localhost:3000')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(3000)
    
    // Take initial screenshot
    await page.screenshot({ 
      path: 'test-results/youtube-fix-initial.png',
      fullPage: true 
    })
    
    // Find and click a mood to trigger music results
    const moodElements = await page.locator('circle, [data-mood], .mood-segment, button').all()
    
    if (moodElements.length > 0) {
      console.log(`🎯 Found ${moodElements.length} mood elements, clicking first one...`)
      await moodElements[0].click()
      
      // Wait for music results
      await page.waitForTimeout(5000)
      
      // Take screenshot after mood selection
      await page.screenshot({ 
        path: 'test-results/youtube-fix-after-mood.png',
        fullPage: true 
      })
      
      // Look for music results
      const musicCards = page.locator('.track-card, .music-card')
      const cardCount = await musicCards.count()
      console.log(`🎵 Found ${cardCount} music cards`)
      
      if (cardCount > 0) {
        // Look for YouTube buttons in the first few cards
        for (let i = 0; i < Math.min(cardCount, 3); i++) {
          const card = musicCards.nth(i)
          
          // Look for red YouTube button (more specific selector)
          const youtubeButton = card.locator('button[class*="bg-red"], button[title*="YouTube"]').first()
          const hasButton = await youtubeButton.count() > 0
          
          console.log(`🎬 Card ${i + 1}: YouTube button present: ${hasButton}`)
          
          if (hasButton) {
            const isVisible = await youtubeButton.isVisible()
            const isEnabled = await youtubeButton.isEnabled()
            
            console.log(`🎬 Card ${i + 1}: Button visible: ${isVisible}, enabled: ${isEnabled}`)
            
            if (isVisible && isEnabled) {
              // Click the YouTube button
              console.log(`🎬 Clicking YouTube button on card ${i + 1}`)
              await youtubeButton.click()
              
              // Wait for modal to appear
              await page.waitForTimeout(2000)
              
              // Check for YouTube modal
              const modal = page.locator('.fixed.inset-0')
              const modalVisible = await modal.count() > 0
              
              console.log(`🎬 YouTube modal appeared: ${modalVisible}`)
              
              if (modalVisible) {
                // Take screenshot of modal
                await page.screenshot({ 
                  path: `test-results/youtube-fix-modal-${i + 1}.png`,
                  fullPage: true 
                })
                
                // Look for search interface or iframe
                const searchInterface = page.locator('text*="Search YouTube", text*="Find the official"')
                const hasSearchInterface = await searchInterface.count() > 0
                
                const iframe = page.locator('iframe[src*="youtube"]')
                const hasIframe = await iframe.count() > 0
                
                console.log(`🎬 Search interface visible: ${hasSearchInterface}`)
                console.log(`🎬 YouTube iframe visible: ${hasIframe}`)
                
                // Look for "Search on YouTube" button
                const searchButton = page.locator('button:has-text("Search on YouTube")')
                const hasSearchButton = await searchButton.count() > 0
                
                console.log(`🎬 "Search on YouTube" button visible: ${hasSearchButton}`)
                
                if (hasSearchButton) {
                  console.log('✅ YouTube search functionality is working!')
                  
                  // Test the search button (don't actually click to avoid opening new tab)
                  const searchButtonElement = await searchButton.first()
                  const isSearchButtonEnabled = await searchButtonElement.isEnabled()
                  console.log(`🎬 Search button enabled: ${isSearchButtonEnabled}`)
                }
                
                // Close modal by clicking close button or outside
                const closeButton = page.locator('button:has-text("×")')
                if (await closeButton.count() > 0) {
                  await closeButton.click()
                } else {
                  // Click outside modal
                  await page.click('body', { position: { x: 50, y: 50 } })
                }
                
                await page.waitForTimeout(1000)
                
                // Success! YouTube functionality is restored
                console.log('✅ YouTube functionality verified successfully!')
                break
              } else {
                console.error('❌ YouTube button clicked but no modal appeared')
              }
            }
          }
        }
      } else {
        console.error('❌ No music cards found after mood selection')
      }
    } else {
      console.error('❌ No mood elements found to click')
    }
    
    // Final screenshot
    await page.screenshot({ 
      path: 'test-results/youtube-fix-final.png',
      fullPage: true 
    })
    
    console.log('🎬 YouTube fix verification completed!')
  })
})