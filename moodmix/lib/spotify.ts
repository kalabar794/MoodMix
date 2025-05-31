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

        const tracks: SpotifyTrack[] = response.data.tracks.items
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
          .filter((track: SpotifyTrack) => track.preview_url !== null) // Only include tracks with previews

        allTracks.push(...tracks)
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

// Generate search queries based on mood parameters - optimized for preview availability
function getMoodSearchQueries(params: MoodMusicParams): string[] {
  const queries: string[] = []
  
  // High-energy, positive moods
  if (params.valence > 0.7 && params.energy > 0.7) {
    queries.push(
      'artist:Dua Lipa OR artist:Bruno Mars OR artist:"The Weeknd" OR artist:Ariana Grande',
      'artist:Taylor Swift OR artist:Ed Sheeran OR artist:Billie Eilish',
      'artist:Doja Cat OR artist:Post Malone OR artist:Olivia Rodrigo'
    )
  }
  // Sad/emotional moods
  else if (params.valence < 0.3) {
    queries.push(
      'artist:Adele OR artist:"Sam Smith" OR artist:"Lana Del Rey"',
      'artist:"Billie Eilish" OR artist:Hozier OR artist:"Lewis Capaldi"',
      'artist:"The Weeknd" OR artist:"Lorde" OR artist:"Bon Iver"'
    )
  }
  // Chill/relaxed moods
  else if (params.energy < 0.3) {
    queries.push(
      'artist:"Billie Eilish" OR artist:Lorde OR artist:"The 1975"',
      'artist:"Arctic Monkeys" OR artist:"Tame Impala" OR artist:Hozier',
      'artist:"Mac Miller" OR artist:"Frank Ocean" OR artist:"Rex Orange County"'
    )
  }
  // High energy but moderate valence
  else if (params.energy > 0.7) {
    queries.push(
      'artist:"The Weeknd" OR artist:"Dua Lipa" OR artist:"Calvin Harris"',
      'artist:"David Guetta" OR artist:"Martin Garrix" OR artist:"Swedish House Mafia"',
      'artist:"Zedd" OR artist:"Marshmello" OR artist:"Tiësto"'
    )
  }
  // Default popular artists with high preview availability
  else {
    queries.push(
      'artist:"Taylor Swift" OR artist:"Ed Sheeran" OR artist:"Bruno Mars"',
      'artist:"Ariana Grande" OR artist:"Justin Bieber" OR artist:"Dua Lipa"',
      'artist:"The Weeknd" OR artist:"Post Malone" OR artist:"Billie Eilish"'
    )
  }
  
  return queries.slice(0, 3)
}

// Fallback search for tracks with previews when primary search doesn't yield enough
async function searchFallbackTracks(token: string, needed: number): Promise<SpotifyTrack[]> {
  const fallbackQueries = [
    'year:2020-2024 genre:pop',
    'year:2018-2024 genre:hip-hop',
    'year:2019-2024 genre:electronic',
    'artist:"Taylor Swift" OR artist:"Ed Sheeran" OR artist:"Ariana Grande"',
    'track:"blinding lights" OR track:"shape of you" OR track:"bad guy"'
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
        .filter((track: any) => track.preview_url !== null)

      tracks.push(...queryTracks)
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