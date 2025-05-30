#!/bin/bash

# 🔐 MoodMix Security Check Script
# This script performs comprehensive security checks

set -e

echo "🔐 Starting MoodMix Security Audit..."
echo "======================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
fi

echo "1. Checking for exposed secrets..."
if grep -r -E "(sk-[a-zA-Z0-9]{40,}|['\"][a-zA-Z0-9]{20,}['\"].*=.*(key|secret|token)|const.*=.*['\"][a-zA-Z0-9]{20,}['\"])" --include="*.ts" --include="*.tsx" --include="*.js" --exclude-dir=node_modules --exclude-dir=.next --exclude="*.example*" . 2>/dev/null | grep -v "process.env" | grep -v "your_" | grep -v "example" | grep -v "placeholder"; then
    print_error "Potential hardcoded secrets found!"
else
    print_status "No hardcoded secrets detected"
fi

echo "2. Checking for sensitive files in git..."
if git ls-files | grep -E "(\.env$|\.env\.|secret|key|token|password)" | grep -v "\.example" | grep -v "package-lock.json"; then
    print_error "Sensitive files found in git repository!"
else
    print_status "No sensitive files in git repository"
fi

echo "3. Checking .gitignore effectiveness..."
if [ -f ".env.local" ] && git check-ignore .env.local >/dev/null 2>&1; then
    print_status ".env.local is properly ignored"
elif [ -f ".env.local" ]; then
    print_error ".env.local exists but is not ignored by git!"
else
    print_status "No .env.local file found"
fi

echo "4. Running npm security audit..."
if npm audit --audit-level=high >/dev/null 2>&1; then
    print_status "No high/critical vulnerabilities found"
else
    print_warning "High/critical vulnerabilities detected. Run 'npm audit' for details"
fi

echo "5. Checking for development dependencies in production..."
if grep -q '"devDependencies"' package.json; then
    print_status "Development dependencies properly separated"
fi

echo "6. Checking environment variable usage..."
if grep -r "process\.env\." --include="*.ts" --include="*.tsx" --include="*.js" --exclude-dir=node_modules . | grep -v "process\.env\.NODE_ENV" | grep -v "process\.env\.SPOTIFY_CLIENT" >/dev/null; then
    print_warning "Found additional environment variables. Ensure they're documented"
fi

echo "7. Checking for console.log statements..."
if grep -r "console\.log" --include="*.ts" --include="*.tsx" --include="*.js" --exclude-dir=node_modules --exclude-dir=.next . | head -5; then
    print_warning "Console.log statements found. Remove before production"
fi

echo "8. Checking Next.js security headers..."
if [ -f "next.config.ts" ] || [ -f "next.config.js" ]; then
    if grep -q "headers\|security" next.config.* 2>/dev/null; then
        print_status "Security headers configuration found"
    else
        print_warning "Consider adding security headers to Next.js config"
    fi
fi

echo ""
echo "======================================="
echo "🔐 Security audit completed!"
echo ""
echo "📋 Next steps:"
echo "  • Review any warnings above"
echo "  • Run 'npm audit fix' if vulnerabilities found"
echo "  • Ensure all environment variables are set on deployment platform"
echo "  • Test the application with production-like environment"
echo ""