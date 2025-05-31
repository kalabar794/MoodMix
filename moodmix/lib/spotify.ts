import axios from 'axios'
import { SpotifyTrack, MoodMusicParams } from './types'

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'

// Cache token to avoid unnecessary requests
let accessToken: string | null = null
let tokenExpiry: number | null = null

// Get Spotify access token using Client Credentials flow
async function getAccessToken(): Promise<string> {
  // Return cached token if still valid
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('Missing Spotify credentials')
  }

  try {
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

    accessToken = response.data.access_token
    // Set expiry 5 minutes before actual expiry for safety
    tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000

    return accessToken!
  } catch (error) {
    console.error('Error getting Spotify access token:', error)
    throw new Error('Failed to authenticate with Spotify')
  }
}

// Search for tracks based on mood parameters
export async function searchTracksByMood(params: MoodMusicParams): Promise<SpotifyTrack[]> {
  const token = await getAccessToken()

  try {
    // Use search API with mood-based queries optimized for preview availability
    const moodQueries = getMoodSearchQueries(params)
    const allTracks: SpotifyTrack[] = []

    for (const query of moodQueries) {
      try {
        const response = await axios.get(`${SPOTIFY_API_BASE}/search`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          params: {
            q: query,
            type: 'track',
            limit: 50, // Request more tracks to filter for previews
            market: 'US',
          },
        })

        const allQueryTracks: SpotifyTrack[] = response.data.tracks.items
          .map((track: any) => ({
            id: track.id,
            name: track.name,
            artists: track.artists.map((a: any) => ({ id: a.id, name: a.name })),
            album: {
              id: track.album.id,
              name: track.album.name,
              images: track.album.images || []
            },
            preview_url: track.preview_url,
            external_urls: track.external_urls,
            duration_ms: track.duration_ms,
            popularity: track.popularity || 0
          }))

        // Prioritize tracks with previews, but include all tracks
        const tracksWithPreviews = allQueryTracks.filter((track: SpotifyTrack) => track.preview_url !== null)
        const tracksWithoutPreviews = allQueryTracks.filter((track: SpotifyTrack) => track.preview_url === null)
        
        // Add tracks with previews first, then tracks without previews
        allTracks.push(...tracksWithPreviews, ...tracksWithoutPreviews)
      } catch (queryError) {
        console.error(`Error with query "${query}":`, queryError)
        // Continue with other queries
      }
    }

    // Sort by popularity to get better quality tracks first
    const sortedTracks = allTracks.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))

    // Remove duplicates and limit results
    const uniqueTracks = sortedTracks.filter((track, index, self) => 
      index === self.findIndex(t => t.id === track.id)
    )
    
    // If we don't have enough tracks with previews, try fallback searches
    if (uniqueTracks.length < params.limit) {
      const fallbackTracks = await searchFallbackTracks(token, params.limit - uniqueTracks.length)
      uniqueTracks.push(...fallbackTracks.filter(track => 
        !uniqueTracks.some(existing => existing.id === track.id)
      ))
    }
    
    return uniqueTracks.slice(0, params.limit)
  } catch (error) {
    console.error('Error searching Spotify tracks:', error)
    throw new Error('Failed to search tracks')
  }
}

// Generate search queries targeting mainstream hits with high preview availability
function getMoodSearchQueries(params: MoodMusicParams): string[] {
  const queries: string[] = []
  
  // High-energy, positive moods - target mainstream pop hits
  if (params.valence > 0.7 && params.energy > 0.7) {
    queries.push(
      'track:"uptown funk" OR track:"can\'t stop the feeling" OR track:"happy" OR track:"shake it off"',
      'track:"blinding lights" OR track:"levitating" OR track:"good 4 u" OR track:"anti-hero"',
      'year:2020-2024 genre:pop NOT acoustic NOT instrumental'
    )
  }
  // Sad/emotional moods - target emotional pop ballads and hits
  else if (params.valence < 0.3) {
    queries.push(
      'track:"someone like you" OR track:"hello" OR track:"when the party\'s over" OR track:"drivers license"',
      'track:"all too well" OR track:"somebody that i used to know" OR track:"stay with me"',
      'year:2018-2024 genre:pop sad NOT frequency NOT meditation'
    )
  }
  // Chill/relaxed moods - target mellow hits
  else if (params.energy < 0.3) {
    queries.push(
      'track:"stay" OR track:"peaches" OR track:"watermelon sugar" OR track:"circles"',
      'track:"lovely" OR track:"perfect" OR track:"thinking out loud"',
      'year:2019-2024 genre:indie-pop NOT ambient NOT meditation'
    )
  }
  // High energy but moderate valence - electronic and hip-hop hits
  else if (params.energy > 0.7) {
    queries.push(
      'track:"closer" OR track:"don\'t start now" OR track:"sicko mode" OR track:"starboy"',
      'track:"industry baby" OR track:"heat waves" OR track:"stay" OR track:"as it was"',
      'year:2020-2024 genre:electronic NOT trance NOT meditation'
    )
  }
  // Default popular hits
  else {
    queries.push(
      'track:"shape of you" OR track:"bad guy" OR track:"sunflower" OR track:"rockstar"',
      'track:"flowers" OR track:"unholy" OR track:"as it was" OR track:"about damn time"',
      'year:2020-2024 NOT meditation NOT frequency NOT instrumental'
    )
  }
  
  return queries.slice(0, 3)
}

// Fallback search targeting guaranteed mainstream hits
async function searchFallbackTracks(token: string, needed: number): Promise<SpotifyTrack[]> {
  const fallbackQueries = [
    'track:"shape of you" OR track:"blinding lights" OR track:"bad guy" OR track:"watermelon sugar" OR track:"levitating"',
    'track:"as it was" OR track:"flowers" OR track:"anti-hero" OR track:"unholy" OR track:"about damn time"',
    'track:"stay" OR track:"good 4 u" OR track:"drivers license" OR track:"heat waves" OR track:"peaches"',
    'year:2020-2024 genre:pop NOT meditation NOT frequency NOT healing',
    'artist:"Taylor Swift" OR artist:"Ed Sheeran" OR artist:"Dua Lipa" year:2020-2024'
  ]
  
  const tracks: SpotifyTrack[] = []
  
  for (const query of fallbackQueries) {
    if (tracks.length >= needed) break
    
    try {
      const response = await axios.get(`${SPOTIFY_API_BASE}/search`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: {
          q: query,
          type: 'track',
          limit: 50,
          market: 'US',
        },
      })

      const queryTracks = response.data.tracks.items
        .map((track: any) => ({
          id: track.id,
          name: track.name,
          artists: track.artists.map((a: any) => ({ id: a.id, name: a.name })),
          album: {
            id: track.album.id,
            name: track.album.name,
            images: track.album.images || []
          },
          preview_url: track.preview_url,
          external_urls: track.external_urls,
          duration_ms: track.duration_ms,
          popularity: track.popularity || 0
        }))

      // Prioritize tracks with previews but include all tracks
      const withPreviews = queryTracks.filter((track: any) => track.preview_url !== null)
      const withoutPreviews = queryTracks.filter((track: any) => track.preview_url === null)
      
      tracks.push(...withPreviews, ...withoutPreviews)
    } catch (error) {
      console.error('Fallback search error:', error)
    }
  }
  
  return tracks.slice(0, needed)
}

// Get available genre seeds from Spotify (fallback to hardcoded list since API not accessible)
export async function getAvailableGenres(): Promise<string[]> {
  // Return commonly available Spotify genres since the API endpoint isn't accessible
  return [
    'pop', 'rock', 'hip-hop', 'electronic', 'indie', 'alternative',
    'jazz', 'classical', 'country', 'r-n-b', 'reggae', 'folk',
    'blues', 'dance', 'house', 'techno', 'ambient', 'chill',
    'acoustic', 'soul', 'funk', 'disco', 'punk', 'metal'
  ]
}

// Search tracks by query (alternative method)
export async function searchTracks(query: string, limit: number = 20): Promise<SpotifyTrack[]> {
  const token = await getAccessToken()

  try {
    const response = await axios.get(`${SPOTIFY_API_BASE}/search`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      params: {
        q: query,
        type: 'track',
        limit,
      },
    })

    const tracks: SpotifyTrack[] = response.data.tracks.items.map((track: any) => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map((a: any) => ({ id: a.id, name: a.name })),
      album: {
        id: track.album.id,
        name: track.album.name,
        images: track.album.images || []
      },
      preview_url: track.preview_url,
      external_urls: track.external_urls,
      duration_ms: track.duration_ms,
    }))

    return tracks // Return all tracks, not just ones with previews
  } catch (error) {
    console.error('Error searching tracks:', error)
    throw new Error('Failed to search tracks')
  }
}

// Get track audio features (for future enhancements)
export async function getTrackFeatures(trackId: string) {
  const token = await getAccessToken()

  try {
    const response = await axios.get(`${SPOTIFY_API_BASE}/audio-features/${trackId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    return response.data
  } catch (error) {
    console.error('Error fetching track features:', error)
    return null
  }
}