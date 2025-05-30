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