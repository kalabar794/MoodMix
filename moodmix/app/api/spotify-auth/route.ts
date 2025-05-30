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