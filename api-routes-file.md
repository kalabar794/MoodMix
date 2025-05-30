# 10. API Routes - Complete Backend Structure

## Finalize All API Routes

### Step 1: Update app/api/mood-to-music/route.ts (Final Version)

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
      // Primary method: Use recommendations API
      tracks = await searchTracksByMood({
        ...musicParams,
        genres: validatedGenres.length > 0 ? validatedGenres : ['pop'] // Fallback genre
      })
    } catch (recommendError) {
      console.warn('Recommendation API failed, trying search fallback:', recommendError)
      
      // Fallback method: Use search with mood keywords
      const keywords = getMoodKeywords(moodSelection)
      const searchQuery = keywords.join(' ')
      
      tracks = await searchTracks(searchQuery, 20)
    }

    // Get mood description
    const description = getMoodDescription(moodSelection)

    // Log for debugging
    console.log(`Mood: ${moodSelection.primary}, Intensity: ${moodSelection.intensity}, Tracks found: ${tracks.length}`)

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
        message: error instanceof Error ? error.message : 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Mood to Music API is running',
    endpoints: {
      POST: '/api/mood-to-music - Convert mood to music recommendations',
      body: {
        primary: 'string (mood name)',
        intensity: 'number (0-100)',
        color: 'string (hex color)',
        coordinates: { x: 'number', y: 'number' }
      }
    }
  })
}
```

### Step 2: Create app/api/spotify-search/route.ts (Additional Search Endpoint)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { searchTracks } from '@/lib/spotify'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!query) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing query parameter' 
        },
        { status: 400 }
      )
    }

    const tracks = await searchTracks(query, limit)

    return NextResponse.json({
      success: true,
      query,
      tracks,
      count: tracks.length
    })

  } catch (error) {
    console.error('Error in spotify-search API:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search tracks',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
```

### Step 3: Create app/api/health/route.ts (Health Check Endpoint)

```typescript
import { NextResponse } from 'next/server'
import { getAvailableGenres } from '@/lib/spotify'

export async function GET() {
  const checks = {
    api: true,
    spotify: false,
    environment: {
      hasClientId: !!process.env.SPOTIFY_CLIENT_ID,
      hasClientSecret: !!process.env.SPOTIFY_CLIENT_SECRET,
    }
  }

  try {
    // Test Spotify connection
    const genres = await getAvailableGenres()
    checks.spotify = genres.length > 0

    return NextResponse.json({
      success: true,
      status: 'healthy',
      checks,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      status: 'unhealthy',
      checks,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 503 })
  }
}
```

### Step 4: Create Middleware for API Rate Limiting (middleware.ts)

Create `middleware.ts` in your project root:

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple in-memory rate limiting (for production, use Redis or similar)
const rateLimitMap = new Map()

function rateLimit(ip: string, limit: number = 10, windowMs: number = 60000) {
  const now = Date.now()
  const windowStart = now - windowMs

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, [])
  }

  const timestamps = rateLimitMap.get(ip).filter((t: number) => t > windowStart)
  timestamps.push(now)
  rateLimitMap.set(ip, timestamps)

  return timestamps.length <= limit
}

export function middleware(request: NextRequest) {
  // Only apply to API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown'
    
    // Skip rate limiting in development
    if (process.env.NODE_ENV === 'production') {
      const allowed = rateLimit(ip)
      
      if (!allowed) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        )
      }
    }

    // Add CORS headers for API routes
    const response = NextResponse.next()
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
    
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*'
}
```

### Step 5: Create Error Handling Utilities (lib/errors.ts)

```typescript
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export function handleAPIError(error: unknown) {
  console.error('API Error:', error)

  if (error instanceof APIError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
      statusCode: error.statusCode
    }
  }

  if (error instanceof Error) {
    return {
      success: false,
      error: error.message,
      statusCode: 500
    }
  }

  return {
    success: false,
    error: 'An unexpected error occurred',
    statusCode: 500
  }
}

// Spotify-specific errors
export class SpotifyAuthError extends APIError {
  constructor(message: string = 'Failed to authenticate with Spotify') {
    super(message, 401, 'SPOTIFY_AUTH_ERROR')
  }
}

export class SpotifyRateLimitError extends APIError {
  constructor(message: string = 'Spotify rate limit exceeded') {
    super(message, 429, 'SPOTIFY_RATE_LIMIT')
  }
}
```

### Step 6: API Documentation (Create app/api/route.ts)

```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    name: 'MoodMix API',
    version: '1.0.0',
    description: 'Mood-based music discovery API',
    endpoints: [
      {
        path: '/api/health',
        method: 'GET',
        description: 'Health check endpoint',
        response: {
          success: 'boolean',
          status: 'string',
          checks: 'object'
        }
      },
      {
        path: '/api/spotify-auth',
        method: 'GET',
        description: 'Test Spotify connection and get available genres',
        response: {
          success: 'boolean',
          genres: 'string[]'
        }
      },
      {
        path: '/api/mood-to-music',
        method: 'POST',
        description: 'Get music recommendations based on mood',
        body: {
          primary: 'string - mood name',
          intensity: 'number - 0 to 100',
          color: 'string - hex color',
          coordinates: {
            x: 'number',
            y: 'number'
          }
        },
        response: {
          success: 'boolean',
          tracks: 'SpotifyTrack[]',
          description: 'string'
        }
      },
      {
        path: '/api/spotify-search',
        method: 'GET',
        description: 'Search Spotify tracks',
        query: {
          q: 'string - search query',
          limit: 'number - max results (default: 20)'
        },
        response: {
          success: 'boolean',
          tracks: 'SpotifyTrack[]'
        }
      }
    ],
    rateLimits: {
      production: '10 requests per minute per IP',
      development: 'unlimited'
    }
  })
}
```

### Testing Your API

1. **Health Check**: 
   ```
   http://localhost:3000/api/health
   ```

2. **API Documentation**:
   ```
   http://localhost:3000/api
   ```

3. **Test Mood to Music**:
   ```bash
   curl -X POST http://localhost:3000/api/mood-to-music \
     -H "Content-Type: application/json" \
     -d '{"primary":"happy","intensity":75,"color":"#FFD93D","coordinates":{"x":0,"y":0}}'
   ```

## Next Steps
Move on to `11-main-page-assembly.md` to bring everything together.