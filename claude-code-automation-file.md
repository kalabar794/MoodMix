# Claude Code Automation & Best Practices

## 🤖 Automated Development Workflow - No Manual Steps

### Core Principle: Full Automation
Claude Code should handle the **entire development lifecycle** automatically - from coding to testing to deployment. You should never need to manually copy/paste code or test things yourself.

## 🛠️ Essential Tool Setup

### Step 1: Initialize MCP Tools & CLIs

Claude Code should **immediately** set up these tools at project start:

```bash
# Essential CLIs and Tools to Install
npm install -g vercel
npm install -g gh
npm install -D @playwright/test
npm install -D @testing-library/react
npm install -D @testing-library/jest-dom
npm install -D vitest

# MCP Tools to Enable
- GitHub MCP Server
- Vercel MCP Server
- File System MCP
- Browser Automation MCP
```

### Step 2: Configure Automated Workflows

```yaml
# .github/workflows/ci.yml - Should be created automatically
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test
      - run: npm run test:e2e
      - run: npm run build
      
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@v1
```

## 🧪 Automated Testing Protocol

### Claude Code MUST Test Everything Automatically

```typescript
// playwright.config.ts - Should be auto-generated
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
})
```

### Example E2E Test Structure

```typescript
// e2e/mood-selection.spec.ts
import { test, expect } from '@playwright/test'

test.describe('MoodMix App', () => {
  test('should allow mood selection and show music', async ({ page }) => {
    // Navigate to app
    await page.goto('/')
    
    // Check initial state
    await expect(page.getByText('How are you feeling?')).toBeVisible()
    
    // Select a mood
    await page.getByRole('button', { name: 'Happy' }).click()
    
    // Verify music loads
    await expect(page.getByText('Your Mood Playlist')).toBeVisible()
    await expect(page.locator('.music-card')).toHaveCount(20)
    
    // Test preview playback
    await page.locator('.music-card').first().click()
    await expect(page.locator('audio')).toBeVisible()
  })
})
```

### Unit Test Example

```typescript
// lib/moodMapping.test.ts
import { describe, it, expect } from 'vitest'
import { moodToMusicParams } from './moodMapping'

describe('Mood Mapping', () => {
  it('should map happy mood correctly', () => {
    const result = moodToMusicParams({
      primary: 'happy',
      intensity: 75,
      color: '#FFD93D',
      coordinates: { x: 0, y: 0 }
    })
    
    expect(result.valence).toBeGreaterThan(0.6)
    expect(result.energy).toBeGreaterThan(0.5)
    expect(result.genres).toContain('pop')
  })
})
```

## 🚀 Automated Deployment Pipeline

### GitHub Integration

```typescript
// Claude Code should execute these automatically:

// 1. Initialize repository
await executeCommand('git init')
await executeCommand('gh repo create moodmix --public')

// 2. Set up branch protection
await executeCommand('gh api repos/:owner/:repo/branches/main/protection -X PUT -f')

// 3. Create and push commits
await executeCommand('git add .')
await executeCommand('git commit -m "feat: implement mood wheel component"')
await executeCommand('git push origin main')

// 4. Create PR for features
await executeCommand('git checkout -b feature/music-integration')
await executeCommand('git push origin feature/music-integration')
await executeCommand('gh pr create --title "Add Spotify integration" --body "Implements music recommendations"')
```

### Vercel Deployment Automation

```typescript
// Automated Vercel deployment
await executeCommand('vercel --prod')

// Monitor deployment
await executeCommand('vercel logs')

// Check deployment status
await executeCommand('vercel inspect')

// Set environment variables
await executeCommand('vercel env add SPOTIFY_CLIENT_ID')
await executeCommand('vercel env add SPOTIFY_CLIENT_SECRET')
```

## 🧠 Deep Thinking Protocol

### BEFORE Writing Any Code, Claude Code Should:

```markdown
## Planning Phase (MANDATORY)

### 1. Project Analysis
- [ ] Understand the complete project scope
- [ ] Identify all technical requirements
- [ ] List potential challenges
- [ ] Research best practices for similar projects

### 2. Architecture Design
- [ ] Create component hierarchy
- [ ] Design data flow
- [ ] Plan state management
- [ ] Identify reusable patterns

### 3. Implementation Strategy
- [ ] Break down into atomic tasks
- [ ] Prioritize features by dependency
- [ ] Plan testing approach
- [ ] Consider edge cases

### 4. Risk Assessment
- [ ] Identify potential breaking points
- [ ] Plan fallback strategies
- [ ] Consider performance implications
- [ ] Security considerations
```

### Example Deep Thinking Process

```typescript
// BEFORE implementing any feature, Claude Code should:

/*
THINKING PHASE:
1. What is the user trying to achieve?
   - Mood-based music discovery
   - Visual feedback for emotional state
   - Seamless music preview experience

2. What are the technical challenges?
   - Spotify API rate limits
   - Audio playback across browsers
   - State management for multiple components
   - Responsive design requirements

3. What's the best approach?
   - Use React hooks for state management
   - Implement proper error boundaries
   - Cache API responses
   - Progressive enhancement for features

4. What could go wrong?
   - API keys exposed
   - Network failures
   - Browser compatibility issues
   - Performance on mobile devices

5. How will I validate success?
   - E2E tests for complete user flow
   - Unit tests for business logic
   - Performance benchmarks
   - Accessibility audit
*/

// ONLY AFTER this thinking phase should implementation begin
```

## 📊 Monitoring & Maintenance

### Automated Health Checks

```typescript
// monitoring/health-check.ts
import { test } from '@playwright/test'

test('production health check', async ({ page }) => {
  // Run every hour via GitHub Actions
  await page.goto('https://moodmix.vercel.app/api/health')
  
  const response = await page.evaluate(() => 
    fetch('/api/health').then(r => r.json())
  )
  
  expect(response.status).toBe('healthy')
  expect(response.checks.spotify).toBe(true)
  
  // Alert if unhealthy
  if (response.status !== 'healthy') {
    await executeCommand('gh issue create --title "Production health check failed" --body "' + JSON.stringify(response) + '"')
  }
})
```

### Performance Monitoring

```typescript
// Run Lighthouse automatically
await executeCommand('npx lighthouse https://moodmix.vercel.app --output json --output-path ./lighthouse-report.json')

// Parse results and create issue if performance degrades
const report = JSON.parse(await readFile('./lighthouse-report.json'))
if (report.categories.performance.score < 0.9) {
  await executeCommand(`gh issue create --title "Performance degradation detected" --body "Score: ${report.categories.performance.score}"`)
}
```

## 🔄 Continuous Improvement Workflow

### Automated Code Quality Checks

```bash
# Claude Code should run these before EVERY commit
npm run lint
npm run type-check
npm run test
npm run test:e2e
npm run build

# Only proceed if ALL pass
```

### Automated PR Process

```typescript
// For every feature:
// 1. Create feature branch
await executeCommand('git checkout -b feature/new-feature')

// 2. Implement with tests
// ... code implementation ...

// 3. Run all checks
await runAllTests()

// 4. Create PR with details
const prBody = `
## What does this PR do?
Implements ${feature.description}

## Testing
- [x] Unit tests added
- [x] E2E tests added
- [x] Manual testing completed via Playwright

## Performance Impact
- Bundle size: ${bundleSize}
- Lighthouse score: ${lighthouseScore}
`

await executeCommand(`gh pr create --title "${feature.title}" --body "${prBody}"`)
```

## ⚡ Quick Commands Reference

### Essential Commands Claude Code Should Use

```bash
# Git Operations
gh repo create
gh pr create
gh issue create
gh workflow run

# Vercel Operations
vercel dev
vercel deploy
vercel env
vercel logs
vercel inspect

# Testing
npm run test
npm run test:e2e
npm run test:watch
npx playwright test
npx playwright show-report

# Monitoring
npx lighthouse
npm run analyze
vercel analytics
```

## 🎯 Success Criteria

### Every Claude Code Session Should:

1. **Plan Before Coding**
   - Think through the entire solution
   - Consider edge cases
   - Design for scalability

2. **Automate Everything**
   - No manual testing required from user
   - Automated deployment pipeline
   - Continuous monitoring

3. **Validate Thoroughly**
   - Run tests automatically
   - Check performance metrics
   - Ensure accessibility

4. **Maintain Continuously**
   - Monitor production health
   - Track performance metrics
   - Auto-create issues for problems

## 🚨 Red Flags to Avoid

- ❌ "Copy this code and test it manually"
- ❌ "Run this in your browser to check"
- ❌ "Deploy this and see if it works"
- ❌ "I'll implement this quickly without planning"
- ❌ "We can test this later"

## ✅ Green Flags to Follow

- ✅ "Let me think through the architecture first"
- ✅ "I'll set up automated tests for this"
- ✅ "The CI/CD pipeline will handle deployment"
- ✅ "Playwright tests confirm this works"
- ✅ "All automated checks are passing"

---

**Remember**: Claude Code should be a fully autonomous development system. If you're being asked to manually test or deploy anything, the automation setup is incomplete.