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