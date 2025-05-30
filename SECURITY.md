# 🔐 Security Policy

This document outlines the security practices and guidelines for the MoodMix project.

## 🚨 Security Issue Reporting

**DO NOT** report security vulnerabilities in public issues. 

Instead, please email security concerns to: [your-email@example.com]

We will respond within 48 hours and provide a timeline for fixes.

## 🛡️ Deployment Security

### Environment Variables

**NEVER** commit the following to the repository:
- `.env.local` files with real credentials
- API keys or secrets
- Database connection strings
- JWT secrets

### Required Environment Variables

For production deployment, set these environment variables securely:

```bash
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

### Secure Deployment Checklist

#### ✅ For Vercel:
1. Go to Project Settings → Environment Variables
2. Add secrets individually (never in bulk)
3. Set appropriate environments (Production, Preview, Development)

#### ✅ For Netlify:
1. Go to Site Settings → Environment variables
2. Add secrets with appropriate scopes

#### ✅ For Docker/VPS:
```bash
# Use a secrets management system
docker run -e SPOTIFY_CLIENT_ID="$(cat /run/secrets/spotify_id)" ...

# Or use a .env file outside the container
docker run --env-file /secure/path/.env ...
```

## 🔍 Security Features

### API Security
- **Rate Limiting**: Spotify API calls are automatically rate-limited
- **Input Validation**: All user inputs are validated and sanitized
- **Environment Isolation**: Secrets are only available server-side
- **HTTPS Enforcement**: All API calls use HTTPS

### Client Security
- **CSP Headers**: Content Security Policy implemented
- **XSS Protection**: All user inputs are sanitized
- **CSRF Protection**: Built-in Next.js CSRF protection
- **Secure Headers**: Security headers configured

## 🔧 Security Tools

### Automated Security Scanning

```bash
# Dependency vulnerability scanning
npm audit

# Comprehensive security audit
npx audit-ci --critical --high --moderate

# License compliance check
npx license-checker

# Bundle analysis
npm run build && npx @next/bundle-analyzer
```

### Manual Security Testing

```bash
# Check for hardcoded secrets
grep -r -i "api_key\|secret\|password\|token" --exclude-dir=node_modules .

# Check for sensitive file exposure
find . -name "*.env*" -o -name "*secret*" -o -name "*key*"

# Verify .gitignore effectiveness
git ls-files | grep -E "(\.env|secret|key|token)"
```

## 🚫 Security Anti-Patterns

### ❌ DON'T DO:
```javascript
// NEVER hardcode secrets
const API_KEY = "sk-1234567890abcdef"

// NEVER log sensitive data
console.log("User token:", userToken)

// NEVER expose secrets in client-side code
const config = {
  apiKey: process.env.SECRET_KEY // This gets sent to client!
}
```

### ✅ DO INSTEAD:
```javascript
// Use environment variables server-side only
const apiKey = process.env.SPOTIFY_CLIENT_SECRET // Server-side only

// Log safely
console.log("Authentication successful for user:", userId)

// Keep secrets server-side
// In API routes only:
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
```

## 🔐 Spotify API Security

### Best Practices:
1. **Client Credentials Flow**: Using server-side flow only
2. **Token Rotation**: Tokens are automatically refreshed
3. **Rate Limiting**: Respecting Spotify's rate limits
4. **Scope Limitation**: Only requesting necessary permissions

### Spotify App Configuration:
- **Redirect URIs**: Only allow your domain
- **Rate Limiting**: Monitor usage in Spotify Dashboard
- **Key Rotation**: Regularly rotate client secrets

## 🛠️ Development Security

### Local Development:
```bash
# 1. Copy the example file
cp .env.example .env.local

# 2. Add your credentials
echo "SPOTIFY_CLIENT_ID=your_id_here" >> .env.local
echo "SPOTIFY_CLIENT_SECRET=your_secret_here" >> .env.local

# 3. Verify .env.local is in .gitignore
git status | grep -v ".env.local" || echo "⚠️  .env.local is tracked by git!"
```

### Pre-commit Security Checks:
```bash
# Install pre-commit hooks
npm install --save-dev @commitlint/cli @commitlint/config-conventional

# Add to package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run security-check",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "scripts": {
    "security-check": "npm audit && npx audit-ci --moderate"
  }
}
```

## 📋 Security Checklist

### Before Deployment:
- [ ] All `.env` files are in `.gitignore`
- [ ] No hardcoded secrets in code
- [ ] Security audit passes
- [ ] Environment variables configured on hosting platform
- [ ] HTTPS enabled
- [ ] Security headers configured

### Regular Maintenance:
- [ ] Update dependencies monthly
- [ ] Run security audits weekly
- [ ] Review access logs monthly
- [ ] Rotate API keys quarterly

## 🆘 Incident Response

### If Credentials Are Compromised:

1. **Immediate Actions:**
   - Revoke compromised credentials at Spotify Dashboard
   - Generate new credentials
   - Update production environment variables
   - Review access logs for suspicious activity

2. **Investigation:**
   - Check git history: `git log --patch -S "secret"`
   - Review deployment logs
   - Audit file access patterns

3. **Recovery:**
   - Deploy with new credentials
   - Monitor for unusual API usage
   - Consider adding additional monitoring

## 📞 Security Contacts

- **Project Maintainer**: [your-email@example.com]
- **Security Team**: [security@example.com]
- **Emergency Contact**: [emergency@example.com]

## 📚 Additional Resources

- [Spotify API Security Guide](https://developer.spotify.com/documentation/general/guides/authorization/)
- [Next.js Security Best Practices](https://nextjs.org/docs/going-to-production#security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

**Last Updated**: May 30, 2025
**Version**: 1.0