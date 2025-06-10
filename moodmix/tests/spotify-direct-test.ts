// Direct test to check Spotify API responses
import axios from 'axios'

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'

async function getAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('Missing Spotify credentials')
  }

  const response = await axios.post(
    SPOTIFY_TOKEN_URL,
    new URLSearchParams({
      grant_type: 'client_credentials',
    }),
    {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  )

  return response.data.access_token
}

async function testSpotifyQueries() {
  const token = await getAccessToken()
  
  const queries = [
    'happy energetic upbeat dance pop year:2020-2024',
    'party celebration fun dance year:2018-2024',
    'sad emotional ballad love year:2020-2024',
    'chill relaxing calm peaceful year:2020-2024',
    'electronic dance hip-hop rap year:2020-2024'
  ]
  
  for (const query of queries) {
    console.log(`\n=== Query: "${query}" ===`)
    
    try {
      const response = await axios.get(`${SPOTIFY_API_BASE}/search`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: {
          q: query,
          type: 'track',
          limit: 10,
          market: 'US',
        },
      })
      
      const tracks = response.data.tracks.items
      console.log(`Found ${tracks.length} tracks:`)
      
      tracks.forEach((track: any, i: number) => {
        const artists = track.artists.map((a: any) => a.name).join(', ')
        console.log(`${i + 1}. "${track.name}" by ${artists}`)
      })
    } catch (error) {
      console.error('Error:', error)
    }
  }
}

// Run the test
testSpotifyQueries().catch(console.error)