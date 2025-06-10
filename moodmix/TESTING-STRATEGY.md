# MoodMix Testing Strategy

## Overview
MoodMix implements a comprehensive Test-Driven Development (TDD) approach with multiple layers of testing to ensure reliability, security, performance, and accessibility.

## Test Structure

### 1. Unit Tests (Vitest)
Located in `lib/__tests__/`

- **Coverage Target**: 80% minimum for all business logic
- **Key Areas**:
  - Mood mapping algorithms
  - Spotify integration functions
  - YouTube video database lookups
  - Utility functions

**Run Commands**:
```bash
npm run test:unit          # Run all unit tests
npm run test:unit:watch    # Watch mode for development
npm run test:unit:coverage # Generate coverage report
```

### 2. API Integration Tests
Located in `app/api/__tests__/`

- **Coverage**: All API endpoints
- **Focus Areas**:
  - Input validation
  - Error handling
  - Security (XSS, SQL injection prevention)
  - Rate limiting
  - Response formatting

### 3. End-to-End Tests (Playwright)
Located in `tests/e2e/`

- **Coverage**: Complete user journeys
- **Test Scenarios**:
  - Mood selection → Music results → Playback
  - Error recovery flows
  - Mobile responsiveness
  - Keyboard navigation
  - Cross-browser compatibility

**Run Commands**:
```bash
npm run test:e2e      # Run all E2E tests
npm run test:e2e:ui   # Run with UI mode
```

### 4. Security Tests
Located in `tests/security/`

- **OWASP Top 10 Coverage**:
  - XSS prevention
  - CSRF protection
  - Injection attacks
  - Secure headers
  - Authentication/Authorization
  - Rate limiting
  - Error information disclosure

**Run Command**:
```bash
npm run test:security
```

### 5. Performance Tests
Located in `tests/performance/`

- **Metrics Monitored**:
  - Core Web Vitals (FCP, LCP, CLS)
  - API response times
  - Memory usage
  - Bundle sizes
  - Network resilience

**Run Command**:
```bash
npm run test:perf
```

### 6. Accessibility Tests
Located in `tests/accessibility/`

- **WCAG 2.1 Level AA Compliance**:
  - Screen reader compatibility
  - Keyboard navigation
  - Color contrast
  - Focus management
  - ARIA labels
  - Semantic HTML

**Run Command**:
```bash
npm run test:a11y
```

### 7. Error Handling & Edge Cases
Located in `tests/error-handling/`

- **Scenarios Covered**:
  - Network failures
  - API errors
  - Malformed data
  - Browser compatibility
  - Concurrent operations

## CI/CD Integration

### GitHub Actions Workflow
```yaml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:ci
      - uses: actions/upload-artifact@v3
        with:
          name: coverage
          path: coverage/
```

### Pre-commit Hooks
```bash
# .husky/pre-commit
npm run lint
npm run test:unit
```

## Security Testing Details

### API Security
- All endpoints validate Content-Type headers
- Input sanitization for all user data
- Rate limiting: 100 requests per minute per IP
- Security headers: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection

### Client Security
- No API keys exposed in client code
- CSP headers configured
- XSS prevention through React's automatic escaping
- HTTPS enforced in production

## Performance Benchmarks

### Target Metrics
- **First Contentful Paint**: < 1.8s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s
- **API Response Time**: < 2s (p95)

### Load Testing
- Handles 100 concurrent users
- 1000 requests per minute sustained
- Graceful degradation under load

## Accessibility Requirements

### WCAG 2.1 Level AA
- All interactive elements keyboard accessible
- Color contrast ratio ≥ 4.5:1 for normal text
- Focus indicators visible
- Screen reader announcements for dynamic content
- Proper heading hierarchy
- Alternative text for all images

### Testing Tools
- axe-core for automated accessibility testing
- Manual screen reader testing (NVDA, JAWS, VoiceOver)
- Keyboard-only navigation testing

## Running All Tests

### Full Test Suite
```bash
npm run test:all
```

This runs:
1. Linting
2. Unit tests with coverage
3. All E2E tests

### CI Test Suite
```bash
npm run test:ci
```

Optimized for CI environments with:
- JSON reporters for parsing
- No interactive UI
- Fail fast on first error

## Test Data Management

### Mock Data
- Located in `__mocks__/` directories
- Consistent test fixtures for Spotify responses
- YouTube video database test entries

### Environment Variables
Test environment uses `.env.test`:
```env
SPOTIFY_CLIENT_ID=test_client_id
SPOTIFY_CLIENT_SECRET=test_client_secret
NEXT_PUBLIC_YOUTUBE_API_KEY=test_api_key
```

## Coverage Requirements

### Minimum Coverage Thresholds
- **Statements**: 80%
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%

### Excluded from Coverage
- Configuration files
- Type definitions
- Test files themselves
- Generated code

## Best Practices

1. **Write Tests First**: Follow TDD principles
2. **Test Behavior, Not Implementation**: Focus on user outcomes
3. **Keep Tests Fast**: Mock external dependencies
4. **Test in Isolation**: Each test should be independent
5. **Use Descriptive Names**: Test names should explain what and why
6. **Clean Test Data**: Reset state between tests
7. **Avoid Flaky Tests**: No time-dependent or order-dependent tests

## Debugging Tests

### Playwright Debugging
```bash
# Debug mode with headed browser
PWDEBUG=1 npm run test:e2e

# Specific test file
npm run test:e2e tests/e2e/specific-test.spec.ts
```

### Vitest Debugging
```bash
# Run specific test file
npm run test:unit lib/__tests__/specific.test.ts

# Run tests matching pattern
npm run test:unit -- -t "mood mapping"
```

## Future Improvements

1. **Visual Regression Testing**: Add Percy or Chromatic
2. **Contract Testing**: Add Pact for API contracts
3. **Mutation Testing**: Add Stryker for test quality
4. **Load Testing**: Add k6 or Artillery for stress testing
5. **Security Scanning**: Integrate OWASP ZAP
6. **Monitoring**: Add Sentry for production error tracking