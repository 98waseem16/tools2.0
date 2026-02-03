# Security Guidelines for Sendmarc Tools v2

## Environment Variables & API Keys

### Overview
This application uses environment variables to securely store sensitive information like API keys and tokens. **Never commit `.env.local` or any file containing real API keys to version control.**

### File Structure

```
.env.example          # Template file (safe to commit)
.env.local            # Your actual secrets (NEVER commit)
.gitignore            # Contains .env* to prevent commits
```

### Environment Variables

#### Required Variables

**`NIGHTCRAWLER_API_URL`**
- Description: Base URL for the Nightcrawler API
- Example: `https://api.sendmarc.com/nightcrawler`
- Used by: Server-side API routes

**`NIGHTCRAWLER_API_KEY`**
- Description: Bearer token for Nightcrawler API authentication
- Example: `sk_live_abc123...`
- Used by: Server-side API routes
- ⚠️ **NEVER expose this to the client**

#### Optional Variables

**`NEXT_PUBLIC_APP_URL`**
- Description: Base URL of your application
- Example: `http://localhost:3000` (dev), `https://tools.sendmarc.com` (prod)
- Used by: Client-side code (can be exposed)

**`NEXT_PUBLIC_GA_ID`**
- Description: Google Analytics tracking ID
- Example: `G-XXXXXXXXXX`
- Used by: Client-side analytics (can be exposed)

### Setup Instructions

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local` and add your actual API key:**
   ```bash
   NIGHTCRAWLER_API_KEY=your_actual_bearer_token_here
   ```

3. **Verify it's in `.gitignore`:**
   ```bash
   grep "\.env" .gitignore
   # Should show: .env*
   ```

4. **Restart your development server:**
   ```bash
   npm run dev
   ```

### Server-Side vs Client-Side

#### Server-Side Only (Secure) ✅
Variables **without** `NEXT_PUBLIC_` prefix are only available on the server:
- ✅ `NIGHTCRAWLER_API_URL`
- ✅ `NIGHTCRAWLER_API_KEY`

These are used in:
- API routes (`app/api/*/route.ts`)
- Server components
- Server-side functions

#### Client-Side (Public) ⚠️
Variables **with** `NEXT_PUBLIC_` prefix are exposed to the browser:
- ⚠️ `NEXT_PUBLIC_APP_URL` (OK - not sensitive)
- ⚠️ `NEXT_PUBLIC_GA_ID` (OK - not sensitive)

**Never use `NEXT_PUBLIC_` for sensitive data!**

### API Client Security

The API client (`lib/api/client.ts`) handles authentication securely:

```typescript
// ✅ GOOD: Bearer token in Authorization header
headers: {
  'Authorization': `Bearer ${this.apiKey}`,
  'Content-Type': 'application/json'
}

// ❌ BAD: Never do this
const url = `${baseURL}?api_key=${apiKey}` // Exposed in URLs/logs
```

**Security features:**
- Bearer token authentication
- Request timeout protection
- Automatic error handling
- No token exposure in URLs or query params

### Verifying Security

#### Check Environment Variables
```bash
# In your terminal
cd sendmarc-tools
node -e "console.log(process.env.NIGHTCRAWLER_API_KEY ? 'Set' : 'Not set')"
```

#### Check API Client
```typescript
// lib/api/client.ts
export function createAPIClient(): APIClient {
  const apiKey = process.env.NIGHTCRAWLER_API_KEY // ✅ Server-side only

  if (!apiKey) {
    throw new Error('NIGHTCRAWLER_API_KEY environment variable is not set')
  }

  return new APIClient(baseURL, apiKey)
}
```

### Common Mistakes to Avoid

#### ❌ DON'T: Commit secrets
```bash
# Bad
git add .env.local
git commit -m "Add config"
```

#### ❌ DON'T: Hardcode API keys
```typescript
// Bad
const API_KEY = 'sk_live_abc123...'
```

#### ❌ DON'T: Expose secrets to client
```typescript
// Bad - NEXT_PUBLIC_ exposes to browser
NEXT_PUBLIC_NIGHTCRAWLER_API_KEY=secret
```

#### ❌ DON'T: Log secrets
```typescript
// Bad
console.log('API Key:', process.env.NIGHTCRAWLER_API_KEY)
```

#### ✅ DO: Use environment variables
```typescript
// Good
const apiKey = process.env.NIGHTCRAWLER_API_KEY
```

#### ✅ DO: Check .gitignore
```bash
# Good
.env*
.env.local
.env.development.local
.env.test.local
.env.production.local
```

#### ✅ DO: Use different keys per environment
```bash
# Development
NIGHTCRAWLER_API_KEY=sk_dev_...

# Production
NIGHTCRAWLER_API_KEY=sk_live_...
```

### Deployment (Vercel)

When deploying to Vercel:

1. **Never commit `.env.local`** - it's only for local development

2. **Add environment variables in Vercel dashboard:**
   - Go to: Project Settings → Environment Variables
   - Add `NIGHTCRAWLER_API_URL`
   - Add `NIGHTCRAWLER_API_KEY`
   - Set environment: Production, Preview, Development

3. **Vercel automatically encrypts environment variables**

4. **Use different keys for each environment:**
   - Production: Real API keys
   - Preview: Test API keys
   - Development: Local keys

### Rotating API Keys

If your API key is compromised:

1. **Generate new key** in Sendmarc dashboard
2. **Update `.env.local`** locally
3. **Update Vercel environment variables**
4. **Redeploy** application
5. **Revoke old key** in Sendmarc dashboard

### Security Checklist

Before committing code:
- [ ] No API keys in code
- [ ] No API keys in comments
- [ ] `.env.local` is in `.gitignore`
- [ ] Only `.env.example` is committed
- [ ] `NEXT_PUBLIC_` not used for secrets
- [ ] All API calls use Bearer token
- [ ] No secrets in URLs/query params
- [ ] No secrets in console.log
- [ ] Error messages don't expose secrets

### Audit Commands

```bash
# Check for exposed secrets in git history
git log --all -p | grep -i "api_key"
git log --all -p | grep -i "bearer"

# Check for hardcoded secrets in code
grep -r "sk_live" . --exclude-dir=node_modules
grep -r "bearer.*[a-zA-Z0-9]{20,}" . --exclude-dir=node_modules

# Check .gitignore is working
git status --ignored

# Check environment variables are set
npm run dev 2>&1 | grep -i "environment variable"
```

### Additional Security Measures

#### Rate Limiting
The API client includes timeout protection:
```typescript
const timeout = 30000 // 30 seconds default
```

#### HTTPS Only
In production, always use HTTPS:
```typescript
// next.config.mjs
headers: [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  }
]
```

#### Content Security Policy
Add CSP headers to prevent XSS:
```typescript
// next.config.mjs (future enhancement)
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; script-src 'self'"
}
```

### Getting Help

If you suspect a security issue:
1. **Don't create a public GitHub issue**
2. **Email:** security@sendmarc.com
3. **Include:** Description, affected versions, reproduction steps

### References

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Remember:** Security is everyone's responsibility. When in doubt, ask!
