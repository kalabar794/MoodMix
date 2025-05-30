# 02. Environment Configuration

## Setting Up Spotify API Access

### Step 1: Create Spotify App
1. Go to https://developer.spotify.com/dashboard
2. Log in or create a Spotify account
3. Click "Create app"
4. Fill in:
   - App name: "MoodMix"
   - App description: "Mood-based music discovery"
   - Redirect URI: http://localhost:3000 (not used, but required)
   - Check "Web API" under APIs used
5. Click "Save"
6. Copy your `Client ID` and `Client Secret`

### Step 2: Create .env.local file
In your project root, create `.env.local`:

```env
# Spotify API Credentials
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here

# OpenAI API (for mood analysis - optional for MVP)
# OPENAI_API_KEY=your_openai_key_here
```

### Step 3: Update .gitignore
Make sure `.env.local` is in your `.gitignore` file:

```gitignore
# local env files
.env*.local
```

### Step 4: Create Environment Type Definitions
Create `lib/types.ts`:

```typescript
// Mood-related types
export interface MoodSelection {
  primary: string;
  color: string;
  intensity: number;
  coordinates: {
    x: number;
    y: number;
  };
}

// Spotify-related types
export interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  preview_url: string | null;
  external_url: string;
  image_url: string;
  duration_ms: number;
}

export interface MoodMusicParams {
  valence: number;
  energy: number;
  danceability: number;
  genres: string[];
  limit: number;
}
```

### Step 5: Verify Environment Variables
Create a simple test file `lib/config.ts`:

```typescript
export const spotifyConfig = {
  clientId: process.env.SPOTIFY_CLIENT_ID!,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
}

// Verify on server startup
if (!spotifyConfig.clientId || !spotifyConfig.clientSecret) {
  throw new Error('Missing Spotify API credentials in environment variables')
}
```

## Important Notes
- Never commit your `.env.local` file
- For Vercel deployment, add these environment variables in the Vercel dashboard
- The Spotify API is free for development use
- Rate limits: 180 requests per minute

## Next Steps
Move on to `03-global-styles.md` to set up the glassmorphic design system.