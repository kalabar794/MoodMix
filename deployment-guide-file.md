# 13. Deployment Guide - Launch MoodMix on Vercel

## Deploy Your MoodMix App to Production

### Step 1: Prepare for Deployment

#### Update package.json scripts
Ensure your `package.json` has these scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

#### Create .env.example
Create `.env.example` in your root directory:

```env
# Spotify API Credentials
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
```

### Step 2: Test Production Build Locally

```bash
# Build the production version
npm run build

# Test the production build
npm run start
```

Visit http://localhost:3000 and ensure everything works correctly.

### Step 3: Push to GitHub

1. Create a new repository on GitHub
2. Initialize git and push your code:

```bash
git init
git add .
git commit -m "Initial commit - MoodMix app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/moodmix.git
git push -u origin main
```

### Step 4: Deploy to Vercel

#### Option A: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts:
   - Set up and deploy: `Y`
   - Which scope: Select your account
   - Link to existing project: `N`
   - Project name: `moodmix`
   - Directory: `./`
   - Override settings: `N`

#### Option B: Using Vercel Dashboard

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: `Next.js`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Step 5: Add Environment Variables

1. In Vercel Dashboard, go to your project
2. Navigate to "Settings" → "Environment Variables"
3. Add these variables:

```
SPOTIFY_CLIENT_ID = your_spotify_client_id
SPOTIFY_CLIENT_SECRET = your_spotify_client_secret
```

4. Redeploy for changes to take effect

### Step 6: Configure Spotify App for Production

1. Go to https://developer.spotify.com/dashboard
2. Select your MoodMix app
3. Click "Edit Settings"
4. Add your production URL to Redirect URIs:
   ```
   https://your-app-name.vercel.app
   ```
5. Save changes

### Step 7: Custom Domain (Optional)

1. In Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update Spotify app with custom domain

### Step 8: Performance Optimizations

#### Add these to next.config.js:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.scdn.co'],
    formats: ['image/avif', 'image/webp'],
  },
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

### Step 9: Monitoring & Analytics (Optional)

#### Add Vercel Analytics:

```bash
npm install @vercel/analytics
```

Update `app/layout.tsx`:

```tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Step 10: Post-Deployment Checklist

- [ ] Test mood wheel on mobile devices
- [ ] Verify Spotify authentication works
- [ ] Check all animations perform well
- [ ] Test music playback across browsers
- [ ] Ensure error states display correctly
- [ ] Verify environment variables are working
- [ ] Check loading states
- [ ] Test on slow network (Chrome DevTools)
- [ ] Share with friends for feedback!

### Troubleshooting Common Issues

#### 1. "Missing Spotify credentials" error
- Ensure environment variables are added in Vercel
- Redeploy after adding variables
- Check variable names match exactly

#### 2. Build failures
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Remove any unused imports

#### 3. Spotify API not working
- Verify production URL is added to Spotify app
- Check API rate limits
- Ensure credentials are for the correct app

#### 4. Slow performance
- Enable caching in API routes
- Optimize images with next/image
- Check bundle size with:
  ```bash
  npm run build
  ```

### Production Environment Variables

For enhanced production setup, consider adding:

```env
# Analytics (optional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# Error tracking (optional)
SENTRY_DSN=your_sentry_dsn

# Feature flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### Maintenance Tips

1. **Regular Updates**:
   ```bash
   npm update
   npm audit fix
   ```

2. **Monitor Usage**:
   - Check Vercel Analytics
   - Monitor Spotify API usage
   - Track error rates

3. **Backup**:
   - Keep GitHub repo updated
   - Document any manual changes

### Success! 🎉

Your MoodMix app is now live! Share it with the world:

- Tweet about it with #MoodMix
- Share on Product Hunt
- Get feedback from users
- Keep iterating and improving

### Next Features to Consider

1. **User Accounts**: Save favorite moods/playlists
2. **Social Sharing**: Share mood playlists
3. **More Moods**: Add seasonal, activity-based moods
4. **Playlist Export**: Save to Spotify
5. **Mood History**: Track mood over time
6. **AI Enhancement**: Better mood-to-music matching

---

## Congratulations! 

You've built and deployed a beautiful, functional mood-based music discovery app. The vibe coding is complete! 🎵