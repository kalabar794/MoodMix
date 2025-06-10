import { test, expect } from '@playwright/test'

test('Check deployment status', async ({ page }) => {
  console.log('🔍 Checking deployment status...')
  
  // Check main page
  console.log('\n=== Main Page ===')
  const mainResponse = await page.goto('https://mood-mix-theta.vercel.app/')
  console.log(`Status: ${mainResponse?.status()}`)
  
  // Check experimental page
  console.log('\n=== Experimental Page ===')
  const expResponse = await page.goto('https://mood-mix-theta.vercel.app/experimental')
  console.log(`Status: ${expResponse?.status()}`)
  
  if (expResponse?.status() === 404) {
    console.log('\n❌ Experimental page not found - deployment may still be in progress')
    
    // Check if main page is working
    await page.goto('https://mood-mix-theta.vercel.app/')
    const title = await page.title()
    console.log(`Main page title: ${title}`)
    
    // List all routes that work
    console.log('\n=== Testing Other Routes ===')
    const routes = ['/api/health', '/test-youtube']
    
    for (const route of routes) {
      const response = await page.goto(`https://mood-mix-theta.vercel.app${route}`)
      console.log(`${route}: ${response?.status()}`)
    }
  } else {
    console.log('\n✅ Experimental page is deployed!')
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/experimental-deployed.png' })
  }
})