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
      }
    ],
    rateLimits: {
      production: '10 requests per minute per IP',
      development: 'unlimited'
    }
  })
}