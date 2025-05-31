import { NextRequest, NextResponse } from 'next/server'
import { searchTracks } from '@/lib/spotify'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || 'happy'
    const limit = parseInt(searchParams.get('limit') || '10')

    const tracks = await searchTracks(query, limit)

    return NextResponse.json({
      success: true,
      query,
      tracks,
      count: tracks.length
    })
  } catch (error) {
    console.error('Spotify search error:', error)
    
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