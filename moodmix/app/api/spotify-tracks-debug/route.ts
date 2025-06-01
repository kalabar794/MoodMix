import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('🎵 Spotify Debug API called with mood:', body)
    
    // Call the actual mood-to-music API to see what tracks are returned
    const moodResponse = await fetch(`${process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://mood-mix-theta.vercel.app'}/api/mood-to-music`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    
    const moodData = await moodResponse.json()
    
    console.log('Mood API Response:', JSON.stringify(moodData, null, 2))
    
    if (moodData.tracks && moodData.tracks.length > 0) {
      // Log each track for analysis
      moodData.tracks.forEach((track: any, index: number) => {
        console.log(`Track ${index + 1}:`, {
          name: track.name,
          artist: track.artists?.[0]?.name,
          hasPreview: !!track.preview_url,
          popularity: track.popularity
        })
      })
      
      return NextResponse.json({
        success: true,
        trackCount: moodData.tracks.length,
        sampleTracks: moodData.tracks.slice(0, 5).map((track: any) => ({
          name: track.name,
          artist: track.artists?.[0]?.name,
          hasPreview: !!track.preview_url,
          popularity: track.popularity,
          id: track.id
        })),
        allTracks: moodData.tracks.map((track: any) => ({
          name: track.name,
          artist: track.artists?.[0]?.name,
          hasPreview: !!track.preview_url,
          popularity: track.popularity,
          id: track.id
        })),
        moodData
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'No tracks returned from Spotify',
        moodData
      })
    }
  } catch (error) {
    console.error('Spotify debug error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}