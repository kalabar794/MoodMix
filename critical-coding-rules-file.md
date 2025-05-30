# Critical Coding Rules - Professional Development Standards

## 🚨 MANDATORY RULES - NEVER VIOLATE

### Rule 1: No Mock Data or Simplified Components

**NEVER create mock data or simplified components** unless explicitly told to do so.

#### ❌ WRONG Approach:
```typescript
// DON'T DO THIS - Creating mock data instead of fixing API
const mockUsers = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' }
]

// DON'T DO THIS - Simplified component replacing complex one
const SimpleDataGrid = () => {
  return <div>Simplified grid here</div>
}
```

#### ✅ CORRECT Approach:
```typescript
// FIX the actual API call
const fetchUsers = async () => {
  try {
    const response = await api.get('/users')
    return response.data
  } catch (error) {
    // Debug and fix the actual issue
    console.error('API Error:', error)
    // Fix the root cause, don't mock
  }
}

// WORK with the existing complex component
import { DataGrid } from '@mui/x-data-grid'
// Debug and fix the actual DataGrid issues
```

### Rule 2: Never Replace Complex Components

**NEVER replace existing complex components with simplified versions** - always fix the actual problem.

#### ❌ WRONG Approach:
```typescript
// Original complex component having issues
// DON'T replace it with:
const SimplifiedChart = () => {
  return <div>Chart placeholder</div>
}
```

#### ✅ CORRECT Approach:
```typescript
// Debug the existing complex component
import { ResponsiveChart } from './components/ResponsiveChart'

// Find the actual issue:
// 1. Check console errors
// 2. Verify prop types
// 3. Check data format
// 4. Review documentation
// 5. Fix the root cause
```

### Rule 3: Work With Existing Codebase

**ALWAYS work with the existing codebase** - do not create new simplified alternatives.

#### Debugging Checklist:
```typescript
// When encountering an issue:

// 1. Understand the existing implementation
const ExistingComponent = () => {
  // Read through ALL the code
  // Understand the data flow
  // Check all imports and dependencies
}

// 2. Identify the actual problem
// - Console errors?
// - Network issues?
// - State management problems?
// - Prop drilling issues?

// 3. Fix within the existing structure
// - Don't create Component2 or ComponentSimple
// - Work with what's there
```

### Rule 4: Find and Fix Root Causes

**ALWAYS find and fix the root cause** of issues instead of creating workarounds.

#### Root Cause Analysis Process:

```typescript
// 1. REPRODUCE the issue
// - Get exact steps
// - Check environment
// - Verify dependencies

// 2. INVESTIGATE thoroughly
console.log('Component props:', props)
console.log('State before error:', state)
console.log('API response:', response)

// 3. CHECK common culprits
// - Version mismatches
// - Missing dependencies
// - Incorrect imports
// - API changes
// - State mutations

// 4. FIX at the source
// ❌ WRONG: Add try-catch to hide error
// ✅ RIGHT: Fix what's causing the error
```

### Rule 5: Check Documentation First

**ALWAYS check MUI X v8 AND MUI v7 DOCS before making changes** to MUI-related components.

#### MUI Version Checking:
```typescript
// 1. Check package.json for versions
{
  "dependencies": {
    "@mui/material": "^5.x.x",  // Check exact version
    "@mui/x-data-grid": "^7.x.x" // May have breaking changes
  }
}

// 2. Review migration guides
// - https://mui.com/x/migration/migration-data-grid-v6/
// - Check for breaking changes
// - Update imports accordingly

// 3. Common breaking changes to watch:
// - Import paths changed
// - Prop names changed
// - API methods renamed
// - Default behaviors modified
```

## 📋 TypeScript and Linting Standards

### Rule 6: Explicit Types Always

**ALWAYS add explicit types** to all function parameters, variables, and return types.

#### ❌ WRONG - Implicit Types:
```typescript
// No parameter types
const processData = (data) => {
  return data.map(item => item.value)
}

// No return type
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// No variable type
const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL
}
```

#### ✅ CORRECT - Explicit Types:
```typescript
// Explicit parameter and return types
interface DataItem {
  id: string
  value: number
}

const processData = (data: DataItem[]): number[] => {
  return data.map(item => item.value)
}

// Clear return type
interface OrderItem {
  id: string
  price: number
  quantity: number
}

const calculateTotal = (items: OrderItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

// Typed configuration
interface AppConfig {
  apiUrl: string | undefined
}

const config: AppConfig = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL
}
```

### Rule 7: Build Before Commit

**ALWAYS run `pnpm build`** or appropriate linter command before considering any code changes complete.

#### Pre-Commit Checklist:
```bash
# 1. Run type checking
pnpm tsc --noEmit

# 2. Run linter
pnpm lint

# 3. Run build
pnpm build

# 4. Fix ALL errors before proceeding
# NO exceptions, NO "will fix later"
```

### Rule 8: Fix All Errors Immediately

**Fix all linter and TypeScript errors immediately** - don't leave them for the user to fix.

#### Error Resolution Process:
```typescript
// 1. TypeScript errors
// ❌ WRONG: @ts-ignore or @ts-expect-error
// ✅ RIGHT: Fix the type issue

// Example: Property 'x' does not exist on type 'Y'
interface Y {
  x?: string // Add the missing property
}

// 2. Linter errors
// ❌ WRONG: // eslint-disable-next-line
// ✅ RIGHT: Fix the actual issue

// Example: React Hook useEffect has missing dependency
useEffect(() => {
  fetchData(id)
}, [id]) // Add the missing dependency

// 3. Build errors
// Always resolve before marking complete
// Check:
// - Import paths
// - Module resolution
// - Environment variables
// - Build configuration
```

### Rule 9: Multi-File Changes

**When making changes to multiple files**, check each one for type errors.

#### Multi-File Workflow:
```bash
# 1. Make changes across files
# 2. Check each file individually
pnpm tsc --noEmit src/components/Header.tsx
pnpm tsc --noEmit src/pages/index.tsx

# 3. Run full project check
pnpm tsc --noEmit

# 4. Verify no circular dependencies
# 5. Ensure all imports resolve
# 6. Check for unused exports
```

## 🔍 Debugging Best Practices

### Systematic Debugging Approach:

```typescript
// 1. GATHER INFORMATION
console.log('=== DEBUG START ===')
console.log('Props:', props)
console.log('State:', state)
console.log('Environment:', process.env.NODE_ENV)

// 2. ISOLATE THE PROBLEM
// Comment out sections systematically
// Use binary search approach
// Test with minimal props

// 3. CHECK DEPENDENCIES
// Verify versions match
// Check peer dependencies
// Review breaking changes

// 4. USE PROPER TOOLS
// React DevTools
// Network tab
// Console errors
// TypeScript errors

// 5. DOCUMENT THE FIX
// Add comments explaining what was wrong
// Document why the fix works
// Note any edge cases
```

### Common Issues and Solutions:

```typescript
// 1. Module not found
// ✅ Check: tsconfig.json paths, package.json, node_modules

// 2. Type errors
// ✅ Check: TypeScript version, @types packages, declaration files

// 3. Runtime errors
// ✅ Check: Data structure, null checks, async handling

// 4. Build failures
// ✅ Check: Environment variables, build config, dependencies

// 5. Component not rendering
// ✅ Check: Props, state, conditionals, error boundaries
```

## ⚡ Quick Reference

### Before Starting Any Fix:
1. **Understand** the existing code completely
2. **Reproduce** the issue reliably
3. **Research** the proper solution (docs, migration guides)
4. **Plan** the fix without shortcuts
5. **Implement** the proper solution
6. **Test** thoroughly
7. **Type-check** and lint
8. **Build** successfully

### Red Flags to Avoid:
- 🚫 "Let me simplify this..."
- 🚫 "Here's a mock version..."
- 🚫 "As a temporary fix..."
- 🚫 "We can replace this with..."
- 🚫 "To work around this..."

### Green Flags to Follow:
- ✅ "Let me debug the existing..."
- ✅ "I'll check the documentation..."
- ✅ "The root cause is..."
- ✅ "After running pnpm build..."
- ✅ "All TypeScript errors are resolved..."

## 📚 Resources

### Essential Documentation:
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [MUI Migration Guides](https://mui.com/material-ui/migration/migration-v4/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [ESLint Rules](https://eslint.org/docs/rules/)

### Debugging Tools:
- Chrome DevTools
- React Developer Tools
- TypeScript Playground
- Bundle Analyzers

---

**Remember**: Professional development means solving problems properly, not hiding them. Every shortcut creates technical debt that someone else will have to pay.