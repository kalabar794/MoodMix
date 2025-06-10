# MoodMix - Complete Setup Guide

## Overview
MoodMix is a Next.js application that creates personalized music playlists based on user mood selections. It features glassmorphism design, Spotify integration, and YouTube video playback.

## Technology Stack
- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom glassmorphism effects
- **Animation**: Framer Motion
- **Music API**: Spotify Web API
- **Video**: YouTube Data API v3 (with fallback database)
- **Testing**: Playwright
- **Deployment**: Vercel

## Prerequisites
1. Node.js 18+ installed
2. Spotify Developer Account
3. YouTube Data API key (optional but recommended)
4. Vercel account for deployment

## Quick Start

### 1. Initialize Project
```bash
npx create-next-app@latest moodmix --typescript --tailwind --eslint --app
cd moodmix
```

### 2. Install Dependencies
```bash
npm install framer-motion axios
npm install -D playwright @playwright/test
```

### 3. Environment Variables
Create `.env.local`:
```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key
```

### 4. Project Structure
```
moodmix/
├── app/
│   ├── api/
│   │   ├── mood-to-music/route.ts
│   │   ├── spotify-auth/route.ts
│   │   └── health/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── MoodCardSelector.tsx
│   ├── MusicResults.tsx
│   ├── YouTubePlayer.tsx
│   ├── GlassCard.tsx
│   └── BackgroundAnimation.tsx
├── lib/
│   ├── spotify.ts
│   ├── youtube-integration.ts
│   ├── youtube-video-database.ts
│   ├── moodMapping.ts
│   ├── types.ts
│   └── hooks/
│       ├── useMusic.ts
│       └── useKeyboardShortcuts.ts
└── tests/
    └── *.spec.ts
```

## API Credentials Setup

### Spotify API
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create new app
3. Get Client ID and Client Secret
4. Add to `.env.local`

### YouTube API (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable YouTube Data API v3
3. Create API key
4. Add to `.env.local`

## Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run Playwright tests
npm run lint         # Run ESLint
```

## Deployment
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Key Features Implemented
- ✅ Mood-based music discovery
- ✅ Glassmorphism UI design
- ✅ Spotify integration with previews
- ✅ YouTube video database fallback
- ✅ Responsive design
- ✅ Keyboard shortcuts
- ✅ Comprehensive testing
- ✅ Dynamic mood-based backgrounds

## Testing
```bash
npx playwright test                    # Run all tests
npx playwright test --ui              # Interactive mode
npx playwright show-report           # View results
```

## Troubleshooting
- **Spotify 401 errors**: Check credentials and scopes
- **YouTube quota exceeded**: App uses database fallback
- **Build errors**: Ensure all TypeScript types are correct
- **Missing tracks**: Verify Spotify API responses

## Performance Considerations
- YouTube database provides instant video access
- Spotify token caching reduces API calls
- Efficient deduplication prevents duplicate tracks
- Optimized image loading and animations

## Next Steps
1. Follow the individual component guides
2. Implement the glassmorphism styling
3. Set up the API routes
4. Configure the mood mapping logic
5. Add comprehensive testing