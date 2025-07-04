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

  console.log('🔑 Checking Spotify credentials...')
  console.log('Client ID exists:', !!clientId)
  console.log('Client Secret exists:', !!clientSecret)

  if (!clientId || !clientSecret) {
    console.error('❌ Missing Spotify credentials in environment variables')
    throw new Error('Missing Spotify credentials - check SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in environment variables')
  }

  try {
    console.log('Attempting to get Spotify access token...')
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

    console.log('Spotify token response status:', response.status)
    accessToken = response.data.access_token
    // Set expiry 5 minutes before actual expiry for safety
    tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000

    console.log('Successfully obtained Spotify access token')
    return accessToken!
  } catch (error) {
    console.error('Error getting Spotify access token:', error)
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      })
      
      // More specific error messages
      if (error.response?.status === 401) {
        throw new Error('Invalid Spotify credentials. Please check SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET.')
      } else if (error.response?.status === 503) {
        throw new Error('Spotify service temporarily unavailable. Please try again later.')
      } else if (!error.response) {
        throw new Error('Network error connecting to Spotify. Please check your internet connection.')
      }
    }
    throw new Error('Failed to authenticate with Spotify. Please try again.')
  }
}

// Search for tracks based on mood parameters
export async function searchTracksByMood(params: MoodMusicParams): Promise<SpotifyTrack[]> {
  const token = await getAccessToken()

  try {
    // Use search API with mood-based queries optimized for preview availability
    const moodQueries = getMoodSearchQueries(params)
    console.log('Generated mood queries:', moodQueries)
    const allTracks: SpotifyTrack[] = []

    for (const query of moodQueries) {
      try {
        console.log(`Searching with query: "${query}"`)
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

        console.log(`Query "${query}" returned ${response.data.tracks.items.length} tracks`)
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

    // Remove duplicates with improved matching logic
    const seenTracks = new Set<string>()
    const seenSignatures = new Set<string>()
    const uniqueTracks = sortedTracks.filter((track) => {
      // Check if we've seen this Spotify ID
      if (seenTracks.has(track.id)) {
        console.log(`Duplicate ID detected: "${track.name}" by ${track.artists[0]?.name} (ID: ${track.id})`)
        return false
      }
      
      // Create a normalized signature for fuzzy matching
      const trackName = track.name.toLowerCase()
        .replace(/\s*\([^)]*\)/g, '') // Remove parentheses content
        .replace(/\s*\[[^\]]*\]/g, '') // Remove bracket content
        .replace(/\s*-\s*(feat|ft|featuring)\.?\s*.*/gi, '') // Remove featuring
        .replace(/\s*-\s*(remix|remaster|remastered|version|edit|mix|radio|acoustic|live|demo|single|album).*$/gi, '') // Remove version info
        .replace(/['"`]/g, '') // Remove quotes
        .replace(/[^a-z0-9\s]/g, '') // Keep alphanumeric and spaces
        .replace(/\s+/g, '') // Remove all spaces for exact matching
        .trim()
      
      const artistName = track.artists[0]?.name.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '') // Keep alphanumeric and spaces
        .replace(/\s+/g, '') // Remove all spaces for exact matching
        .trim()
      
      const signature = `${artistName}${trackName}` // Artist first for better matching
      
      // Check if we've seen a similar track
      if (seenSignatures.has(signature)) {
        console.log(`Duplicate signature detected: "${track.name}" by ${track.artists[0]?.name} (sig: ${signature})`)
        return false
      }
      
      // Additional check: Look for very similar names even with slight differences
      for (const existingSig of seenSignatures) {
        // If signatures are very similar (e.g., differ by only 1-2 characters), consider it a duplicate
        if (areSimilarStrings(signature, existingSig, 0.95)) {
          console.log(`Similar track detected: "${track.name}" by ${track.artists[0]?.name} similar to existing signature`)
          return false
        }
      }
      
      // Mark as seen
      seenTracks.add(track.id)
      seenSignatures.add(signature)
      return true
    })
    
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

// Helper function to check string similarity
function areSimilarStrings(str1: string, str2: string, threshold: number = 0.95): boolean {
  // If strings are identical, they're similar
  if (str1 === str2) return true
  
  // If lengths differ significantly, they're not similar
  const lengthDiff = Math.abs(str1.length - str2.length)
  if (lengthDiff > Math.max(str1.length, str2.length) * 0.2) return false
  
  // Calculate Levenshtein distance
  const distance = levenshteinDistance(str1, str2)
  const maxLength = Math.max(str1.length, str2.length)
  const similarity = 1 - (distance / maxLength)
  
  return similarity >= threshold
}

// Levenshtein distance implementation
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length
  const n = str2.length
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))
  
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,    // deletion
          dp[i][j - 1] + 1,    // insertion
          dp[i - 1][j - 1] + 1 // substitution
        )
      }
    }
  }
  
  return dp[m][n]
}

// Generate search queries using broader terms more likely to return results
function getMoodSearchQueries(params: MoodMusicParams): string[] {
  const queries: string[] = []
  
  // High-energy, positive moods - use broad positive keywords
  if (params.valence > 0.7 && params.energy > 0.7) {
    queries.push(
      'happy energetic upbeat dance pop year:2020-2024',
      'party celebration fun dance year:2018-2024',
      'pop rock electronic dance energy year:2019-2024'
    )
  }
  // Sad/emotional moods - use broad emotional keywords
  else if (params.valence < 0.3) {
    queries.push(
      'sad emotional ballad love year:2020-2024',
      'heartbreak melancholy piano acoustic year:2018-2024',
      'indie pop sad slow year:2019-2024'
    )
  }
  // Chill/relaxed moods - use broad chill keywords
  else if (params.energy < 0.3) {
    queries.push(
      'chill relaxing calm peaceful year:2020-2024',
      'indie acoustic mellow soft year:2018-2024',
      'ambient chill pop slow year:2019-2024'
    )
  }
  // High energy but moderate valence - electronic and hip-hop
  else if (params.energy > 0.7) {
    queries.push(
      'electronic dance hip-hop rap year:2020-2024',
      'pop rock energy beat year:2018-2024',
      'electronic pop dance year:2019-2024'
    )
  }
  // Default popular music
  else {
    queries.push(
      'pop hit chart year:2020-2024',
      'popular music mainstream year:2018-2024',
      'pop rock indie year:2019-2024'
    )
  }
  
  return queries.slice(0, 3)
}

// Fallback search using simple, broad terms most likely to return results
async function searchFallbackTracks(token: string, needed: number): Promise<SpotifyTrack[]> {
  const fallbackQueries = [
    'pop music year:2020-2024',
    'chart hits popular year:2018-2024',
    'top 40 mainstream year:2019-2024',
    'dance pop electronic year:2020-2024',
    'rock indie alternative year:2018-2024'
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