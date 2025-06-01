import { NextResponse } from 'next/server'
import { YouTubeMusicIntegration } from '@/lib/youtube-integration'

export async function GET() {
  try {
    console.log('🎬 Detailed YouTube Debug API called')
    
    // Check environment variables
    const youtubeApiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
    const hasApiKey = !!youtubeApiKey && youtubeApiKey !== 'your_youtube_api_key_here'
    
    console.log('YouTube API Key available:', hasApiKey)
    console.log('YouTube API Key value (first 10 chars):', youtubeApiKey ? youtubeApiKey.substring(0, 10) + '...' : 'None')
    
    if (!hasApiKey) {
      return NextResponse.json({
        success: false,
        error: 'No YouTube API key configured',
        hasApiKey: false
      })
    }
    
    // Initialize YouTube integration
    const youtube = new YouTubeMusicIntegration(youtubeApiKey)
    
    // Test with the exact track from the user's screenshot
    const testTrack = 'Funny Dance'
    const testArtist = 'Dale Burbeck'
    
    console.log(`Testing YouTube search for: "${testTrack}" by "${testArtist}"`)
    
    // Make the API call and capture all details
    const searchResult = await youtube.searchMusicVideo(testTrack, testArtist)
    
    console.log('Search result:', JSON.stringify(searchResult, null, 2))
    
    // Also test a direct YouTube API search to see what we get
    const directApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(testTrack + ' ' + testArtist)}&type=video&videoCategoryId=10&videoEmbeddable=true&maxResults=15&order=relevance&key=${youtubeApiKey}`
    
    console.log('Direct API URL:', directApiUrl)
    
    const directResponse = await fetch(directApiUrl)
    const directData = await directResponse.json()
    
    console.log('Direct API Response:', JSON.stringify(directData, null, 2))
    
    return NextResponse.json({
      success: true,
      hasApiKey,
      testTrack: {
        track: testTrack,
        artist: testArtist,
        searchResult,
        directApiResponse: directData,
        apiUrl: directApiUrl
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasYouTubeKey: hasApiKey,
        keyLength: youtubeApiKey ? youtubeApiKey.length : 0
      }
    })
  } catch (error) {
    console.error('YouTube debug error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      hasApiKey: !!process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasYouTubeKey: !!process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
      }
    }, { status: 500 })
  }
}