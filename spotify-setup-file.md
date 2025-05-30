# 07. Spotify API Setup

## Create Spotify Integration Library

### Step 1: Create lib/spotify.ts

```typescript
import axios from 'axios'
import { SpotifyTrack, MoodMusicParams } from './types'

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'

// Cache token to avoid unnecessary requests
let accessToken: string | null = null
let tokenExpiry: number | null = null

// Get Spotify access token using Client Credentials flow
async function getAccessToken(): Promise<string> {
  // Return cached token if still valid
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('Missing Spotify credentials')
  }

  try {
    const response = await axios.post(
      SPOTIFY_TOKEN_URL,
      new URLSearchParams({
        grant_type: 'client_credentials',
      }),
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    accessToken = response.data.access_token
    // Set expiry 5 minutes before actual expiry for safety
    tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000

    return accessToken
  } catch (error) {
    console.error('Error getting Spotify access token:', error)
    throw new Error('Failed to authenticate with Spotify')
  }
}

// Search for tracks based on mood parameters
export async function searchTracksByMood(params: MoodMusicParams): Promise<SpotifyTrack[]> {
  const token = await getAccessToken()

  try {
    // First, get track recommendations based on audio features
    const recommendations = await axios.get(`${SPOTIFY_API_BASE}/recommendations`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      params: {
        limit: params.limit,
        seed_genres: params.genres.join(','),
        target_valence: params.valence,
        target_energy: params.energy,
        target_danceability: params.danceability,
        min_popularity: 30, // Ensure somewhat popular tracks
      },
    })

    // Transform Spotify track data to our format
    const tracks: SpotifyTrack[] = recommendations.data.tracks.map((track: any) => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map((a: any) => a.name).join(', '),
      album: track.album.name,
      preview_url: track.preview_url,
      external_url: track.external_urls.spotify,
      image_url: track.album.images[0]?.url || '',
      duration_ms: track.duration_ms,
    }))

    // Filter out tracks without previews if needed
    return tracks.filter(track => track.preview_url !== null)
  } catch (error) {
    console.error('Error searching Spotify tracks:', error)
    throw new Error('Failed to search tracks')
  }
}

// Get available genre seeds from Spotify
export async function getAvailableGenres(): Promise<string[]> {
  const token = await getAccessToken()

  try {
    const response = await axios.get(`${SPOTIFY_API_BASE}/recommendations/available-genre-seeds`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    return response.data.genres
  } catch (error) {
    console.error('Error fetching genres:', error)
    return []
  }
}

// Search tracks by query (alternative method)
export async function searchTracks(query: string, limit: number = 20): Promise<SpotifyTrack[]> {
  const token = await getAccessToken()

  try {
    const response = await axios.get(`${SPOTIFY_API_BASE}/search`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      params: {
        q: query,
        type: 'track',
        limit,
      },
    })

    const tracks: SpotifyTrack[] = response.data.tracks.items.map((track: any) => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map((a: any) => a.name).join(', '),
      album: track.album.name,
      preview_url: track.preview_url,
      external_url: track.external_urls.spotify,
      image_url: track.album.images[0]?.url || '',
      duration_ms: track.duration_ms,
    }))

    return tracks.filter(track => track.preview_url !== null)
  } catch (error) {
    console.error('Error searching tracks:', error)
    throw new Error('Failed to search tracks')
  }
}

// Get track audio features (for future enhancements)
export async function getTrackFeatures(trackId: string) {
  const token = await getAccessToken()

  try {
    const response = await axios.get(`${SPOTIFY_API_BASE}/audio-features/${trackId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    return response.data
  } catch (error) {
    console.error('Error fetching track features:', error)
    return null
  }
}
```

### Step 2: Create app/api/spotify-auth/route.ts

```typescript
import { NextResponse } from 'next/server'
import { getAvailableGenres } from '@/lib/spotify'

// This endpoint is for testing and getting available genres
export async function GET() {
  try {
    const genres = await getAvailableGenres()
    
    return NextResponse.json({
      success: true,
      genres,
      message: 'Spotify connection successful'
    })
  } catch (error) {
    console.error('Spotify auth error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to connect to Spotify',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
```

### Step 3: Test Spotify Connection

Create a temporary test component in `app/page.tsx`:

```tsx
// Add this function inside your Home component
const testSpotifyConnection = async () => {
  try {
    const response = await fetch('/api/spotify-auth')
    const data = await response.json()
    console.log('Spotify test:', data)
    if (data.success) {
      alert(`Connected! Found ${data.genres.length} genres`)
    } else {
      alert(`Error: ${data.message}`)
    }
  } catch (error) {
    console.error('Test failed:', error)
    alert('Failed to test Spotify connection')
  }
}

// Add this button temporarily in your JSX
<button
  onClick={testSpotifyConnection}
  className="glass glass-hover px-4 py-2 rounded-lg"
>
  Test Spotify Connection
</button>
```

### Step 4: Common Issues & Solutions

1. **Missing Credentials Error**
   - Make sure `.env.local` has your Spotify credentials
   - Restart the dev server after adding credentials

2. **401 Unauthorized**
   - Check that your Client ID and Secret are correct
   - Make sure you're using the Client Credentials flow (no user login)

3. **No Preview URLs**
   - Not all tracks have preview URLs
   - The code filters these out automatically

4. **Rate Limiting**
   - Spotify allows 180 requests per minute
   - The token caching helps reduce requests

### Step 5: Available Spotify Audio Features

For mood mapping, these are the key audio features we'll use:

```typescript
interface AudioFeatures {
  valence: number      // 0.0-1.0 (sad to happy)
  energy: number       // 0.0-1.0 (calm to energetic)
  danceability: number // 0.0-1.0 (not danceable to very danceable)
  tempo: number        // BPM
  acousticness: number // 0.0-1.0 (electronic to acoustic)
  instrumentalness: number // 0.0-1.0 (vocal to instrumental)
}
```

### Usage Example

```typescript
// Example: Search for happy music
const happyMusic = await searchTracksByMood({
  valence: 0.8,      // High valence = happy
  energy: 0.7,       // Fairly energetic
  danceability: 0.6, // Moderately danceable
  genres: ['pop', 'indie-pop', 'happy'],
  limit: 20
})
```

## Next Steps
Move on to `08-mood-mapping-logic.md` to create the mood-to-music mapping system.