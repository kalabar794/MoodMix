import { NextResponse } from 'next/server'
import { SpotifyTrack } from '@/lib/types'

// Mock track data for testing YouTube integration
const MOCK_TRACKS: SpotifyTrack[] = [
  {
    id: 'test-track-1',
    name: 'Upbeat Electronic Dance',
    artists: [{ name: 'Test Artist 1', id: 'artist-1' }],
    album: {
      id: 'test-album-1',
      name: 'Test Album',
      images: [{ 
        url: 'https://i.scdn.co/image/test-image-1',
        width: 640,
        height: 640
      }]
    },
    preview_url: 'https://p.scdn.co/mp3-preview/test-preview-1',
    external_urls: { spotify: 'https://open.spotify.com/track/test-track-1' },
    duration_ms: 180000,
    popularity: 85
  },
  {
    id: 'test-track-2',
    name: 'High Energy Rock Anthem',
    artists: [{ name: 'Test Artist 2', id: 'artist-2' }],
    album: {
      id: 'test-album-2',
      name: 'Test Album 2',
      images: [{ 
        url: 'https://i.scdn.co/image/test-image-2',
        width: 640,
        height: 640
      }]
    },
    preview_url: 'https://p.scdn.co/mp3-preview/test-preview-2',
    external_urls: { spotify: 'https://open.spotify.com/track/test-track-2' },
    duration_ms: 200000,
    popularity: 78
  },
  {
    id: 'test-track-3',
    name: 'Energetic Pop Beat',
    artists: [{ name: 'Test Artist 3', id: 'artist-3' }],
    album: {
      id: 'test-album-3',
      name: 'Test Album 3',
      images: [{ 
        url: 'https://i.scdn.co/image/test-image-3',
        width: 640,
        height: 640
      }]
    },
    preview_url: 'https://p.scdn.co/mp3-preview/test-preview-3',
    external_urls: { spotify: 'https://open.spotify.com/track/test-track-3' },
    duration_ms: 190000,
    popularity: 82
  }
]

export async function GET() {
  console.log('🧪 Test tracks endpoint called - returning mock data')
  
  return NextResponse.json({
    tracks: MOCK_TRACKS,
    mood: 'energetic',
    description: 'High-energy tracks perfect for an energetic mood - TEST DATA'
  })
}