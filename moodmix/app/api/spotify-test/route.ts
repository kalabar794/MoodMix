import { NextResponse } from 'next/server'
import { searchTracks } from '@/lib/spotify'

export async function GET() {
  try {
    console.log('🧪 Testing Spotify API connection...')
    
    // Simple test search
    const testQuery = 'happy pop'
    console.log(`Testing search query: "${testQuery}"`)
    
    const tracks = await searchTracks(testQuery, 5)
    
    console.log(`✅ Test successful: Found ${tracks.length} tracks`)
    
    return NextResponse.json({
      success: true,
      message: 'Spotify API connection working',
      query: testQuery,
      trackCount: tracks.length,
      tracks: tracks.map(track => ({
        name: track.name,
        artist: track.artists[0]?.name,
        hasPreview: !!track.preview_url,
        popularity: track.popularity
      }))
    })
  } catch (error) {
    console.error('❌ Spotify test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}