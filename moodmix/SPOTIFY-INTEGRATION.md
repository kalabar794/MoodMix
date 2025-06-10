# Spotify Integration Guide

## Overview
Complete implementation of Spotify Web API integration for MoodMix, including authentication, search, and music recommendations.

## Core Files

### 1. `/lib/spotify.ts`
Main Spotify API integration with caching and error handling:

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
      new URLSearchParams({ grant_type: 'client_credentials' }),
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

    return accessToken!
  } catch (error) {
    console.error('Error getting Spotify access token:', error)
    throw new Error('Failed to authenticate with Spotify')
  }
}

// Search for tracks based on mood parameters
export async function searchTracksByMood(params: MoodMusicParams): Promise<SpotifyTrack[]> {
  const token = await getAccessToken()

  try {
    const moodQueries = getMoodSearchQueries(params)
    const allTracks: SpotifyTrack[] = []

    for (const query of moodQueries) {
      try {
        const response = await axios.get(`${SPOTIFY_API_BASE}/search`, {
          headers: { 'Authorization': `Bearer ${token}` },
          params: {
            q: query,
            type: 'track',
            limit: 50,
            market: 'US',
          },
        })

        const queryTracks: SpotifyTrack[] = response.data.tracks.items
          .map((track: any) => ({
            id: track.id,
            name: track.name,
            artists: track.artists.map((a: any) => ({ id: a.id, name: a.name })),
            album: {
              id: track.album.id,
              name: track.album.name,
              images: track.album.images || []
            },
            preview_url: track.preview_url,
            external_urls: track.external_urls,
            duration_ms: track.duration_ms,
            popularity: track.popularity || 0
          }))

        // Prioritize tracks with previews
        const tracksWithPreviews = queryTracks.filter(track => track.preview_url !== null)
        const tracksWithoutPreviews = queryTracks.filter(track => track.preview_url === null)
        
        allTracks.push(...tracksWithPreviews, ...tracksWithoutPreviews)
      } catch (queryError) {
        console.error(`Error with query "${query}":`, queryError)
      }
    }

    // Sort by popularity
    const sortedTracks = allTracks.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))

    // Remove duplicates by both Spotify ID and track name + artist combination
    const uniqueTracks = sortedTracks.filter((track, index, self) => {
      const currentSignature = `${track.name.toLowerCase().trim()}-${track.artists[0]?.name.toLowerCase().trim()}`
      return index === self.findIndex(t => {
        const tSignature = `${t.name.toLowerCase().trim()}-${t.artists[0]?.name.toLowerCase().trim()}`
        return t.id === track.id || tSignature === currentSignature
      })
    })
    
    return uniqueTracks.slice(0, params.limit)
  } catch (error) {
    console.error('Error searching Spotify tracks:', error)
    throw new Error('Failed to search tracks')
  }
}

// Generate mood-based search queries
function getMoodSearchQueries(params: MoodMusicParams): string[] {
  const queries: string[] = []
  
  // High-energy, positive moods
  if (params.valence > 0.7 && params.energy > 0.7) {
    queries.push(
      'happy energetic upbeat dance pop year:2020-2024',
      'party celebration fun dance year:2018-2024',
      'upbeat pop dance electronic year:2019-2024'
    )
  }
  // High-energy, negative moods
  else if (params.valence < 0.3 && params.energy > 0.7) {
    queries.push(
      'aggressive rock metal intense year:2015-2024',
      'angry rap hip-hop intense year:2018-2024',
      'punk rock alternative aggressive year:2010-2024'
    )
  }
  // Low-energy, positive moods
  else if (params.valence > 0.7 && params.energy < 0.3) {
    queries.push(
      'chill happy peaceful acoustic year:2018-2024',
      'relaxed positive indie folk year:2015-2024',
      'mellow happy ambient chill year:2019-2024'
    )
  }
  // Low-energy, negative moods
  else if (params.valence < 0.3 && params.energy < 0.3) {
    queries.push(
      'sad melancholy acoustic ballad year:2015-2024',
      'emotional indie alternative sad year:2018-2024',
      'depression ambient dark year:2010-2024'
    )
  }
  // Neutral/mixed moods
  else {
    queries.push(
      'indie alternative rock year:2015-2024',
      'pop rock mainstream year:2018-2024',
      'contemporary hits year:2020-2024'
    )
  }

  return queries
}

// Fallback search for when recommendations fail
async function searchFallbackTracks(token: string, limit: number): Promise<SpotifyTrack[]> {
  const fallbackQueries = [
    'top hits 2024',
    'popular music trending',
    'chart hits mainstream',
    'radio friendly pop rock'
  ]

  const allTracks: SpotifyTrack[] = []

  for (const query of fallbackQueries.slice(0, 2)) { // Limit to 2 queries
    try {
      const response = await axios.get(`${SPOTIFY_API_BASE}/search`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: {
          q: query,
          type: 'track',
          limit: Math.min(20, limit),
          market: 'US',
        },
      })

      const tracks: SpotifyTrack[] = response.data.tracks.items.map((track: any) => ({
        id: track.id,
        name: track.name,
        artists: track.artists.map((a: any) => ({ id: a.id, name: a.name })),
        album: {
          id: track.album.id,
          name: track.album.name,
          images: track.album.images || []
        },
        preview_url: track.preview_url,
        external_urls: track.external_urls,
        duration_ms: track.duration_ms,
        popularity: track.popularity || 0
      }))

      allTracks.push(...tracks)
    } catch (error) {
      console.error(`Fallback query "${query}" failed:`, error)
    }
  }

  return allTracks.slice(0, limit)
}

// Search tracks by general query
export async function searchTracks(query: string, limit: number = 20): Promise<SpotifyTrack[]> {
  const token = await getAccessToken()

  try {
    const response = await axios.get(`${SPOTIFY_API_BASE}/search`, {
      headers: { 'Authorization': `Bearer ${token}` },
      params: {
        q: query,
        type: 'track',
        limit,
        market: 'US',
      },
    })

    return response.data.tracks.items.map((track: any) => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map((a: any) => ({ id: a.id, name: a.name })),
      album: {
        id: track.album.id,
        name: track.album.name,
        images: track.album.images || []
      },
      preview_url: track.preview_url,
      external_urls: track.external_urls,
      duration_ms: track.duration_ms,
      popularity: track.popularity || 0
    }))
  } catch (error) {
    console.error('Error searching tracks:', error)
    throw new Error('Failed to search tracks')
  }
}

// Get available genres for recommendations
export async function getAvailableGenres(): Promise<string[]> {
  const token = await getAccessToken()

  try {
    const response = await axios.get(`${SPOTIFY_API_BASE}/recommendations/available-genre-seeds`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })

    return response.data.genres
  } catch (error) {
    console.error('Error fetching genres:', error)
    return ['pop', 'rock', 'hip-hop', 'electronic', 'indie'] // fallback
  }
}
```

### 2. `/lib/types.ts`
TypeScript interfaces for Spotify data:

```typescript
export interface SpotifyTrack {
  id: string
  name: string
  artists: Array<{
    id: string
    name: string
  }>
  album: {
    id: string
    name: string
    images: Array<{
      url: string
      height: number
      width: number
    }>
  }
  preview_url: string | null
  external_urls: {
    spotify: string
  }
  duration_ms: number
  popularity: number
}

export interface MoodMusicParams {
  valence: number      // 0.0 to 1.0 (negative to positive)
  energy: number       // 0.0 to 1.0 (low to high energy)
  danceability: number // 0.0 to 1.0
  acousticness: number // 0.0 to 1.0
  genres: string[]
  limit: number
}

export interface MoodSelection {
  primary: string
  intensity: number
  color: string
  coordinates: { x: number; y: number }
}
```

### 3. `/app/api/mood-to-music/route.ts`
API endpoint for mood-based music search:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { searchTracksByMood, searchTracks, getAvailableGenres } from '@/lib/spotify'
import { moodToMusicParams, validateGenres, getMoodDescription, getMoodKeywords } from '@/lib/moodMapping'
import { MoodSelection } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const moodSelection: MoodSelection = body

    // Validate input
    if (!moodSelection.primary || typeof moodSelection.intensity !== 'number') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid mood selection',
          message: 'Please provide a mood and intensity' 
        },
        { status: 400 }
      )
    }

    // Convert mood to music parameters
    const musicParams = moodToMusicParams(moodSelection)

    // Get available genres and validate
    const availableGenres = await getAvailableGenres()
    const validatedGenres = await validateGenres(musicParams.genres, availableGenres)

    let tracks = []

    try {
      // Primary method: Use mood-based search
      tracks = await searchTracksByMood({
        ...musicParams,
        genres: validatedGenres.length > 0 ? validatedGenres : ['pop']
      })
    } catch (recommendError) {
      console.warn('Mood search failed, trying keyword fallback:', recommendError)
      
      // Fallback method: Use search with mood keywords
      const keywords = getMoodKeywords(moodSelection)
      const searchQuery = keywords.join(' ')
      
      tracks = await searchTracks(searchQuery, 20)
    }

    // Get mood description
    const description = getMoodDescription(moodSelection)

    return NextResponse.json({
      success: true,
      mood: moodSelection,
      description,
      tracks,
      params: {
        ...musicParams,
        genres: validatedGenres
      },
      metadata: {
        totalTracks: tracks.length,
        tracksWithPreviews: tracks.filter(t => t.preview_url).length
      }
    })

  } catch (error) {
    console.error('Error in mood-to-music API:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get music recommendations',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
```

## Environment Variables Required

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
```

## Key Features

1. **Token Caching**: Reduces API calls by caching Spotify access tokens
2. **Smart Queries**: Mood-based search queries for better results
3. **Fallback System**: Multiple fallback strategies if primary search fails
4. **Deduplication**: Removes duplicate tracks by ID and name/artist combination
5. **Preview Prioritization**: Prioritizes tracks with 30-second previews
6. **Error Handling**: Comprehensive error handling and logging
7. **Type Safety**: Full TypeScript support with proper interfaces

## Usage Example

```typescript
import { useMusic } from '@/lib/hooks/useMusic'

function MusicComponent() {
  const { tracks, isLoading, fetchMusicForMood } = useMusic()
  
  const handleMoodSelect = (mood: MoodSelection) => {
    fetchMusicForMood(mood)
  }
  
  return (
    <div>
      {tracks.map(track => (
        <div key={track.id}>
          <h3>{track.name}</h3>
          <p>{track.artists.map(a => a.name).join(', ')}</p>
          {track.preview_url && (
            <audio controls src={track.preview_url} />
          )}
        </div>
      ))}
    </div>
  )
}
```

## Troubleshooting

- **401 Unauthorized**: Check Spotify credentials in environment variables
- **Empty results**: Verify mood parameters and search queries
- **Rate limiting**: Token caching should prevent this, but add delays if needed
- **Missing previews**: Not all tracks have 30-second previews available