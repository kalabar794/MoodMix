import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { 
  getAccessToken, 
  getRecommendations, 
  getAvailableGenres,
  searchTracks 
} from '../spotify'
import axios from 'axios'

// Mock axios
vi.mock('axios')

describe('Spotify Integration', () => {
  const mockAccessToken = 'mock-access-token-123'
  const mockEnv = {
    SPOTIFY_CLIENT_ID: 'test-client-id',
    SPOTIFY_CLIENT_SECRET: 'test-client-secret'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock environment variables
    process.env = { ...process.env, ...mockEnv }
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getAccessToken', () => {
    it('should successfully get access token', async () => {
      const mockResponse = {
        data: {
          access_token: mockAccessToken,
          token_type: 'Bearer',
          expires_in: 3600
        }
      }
      
      vi.mocked(axios.post).mockResolvedValueOnce(mockResponse)
      
      const token = await getAccessToken()
      
      expect(token).toBe(mockAccessToken)
      expect(axios.post).toHaveBeenCalledWith(
        'https://accounts.spotify.com/api/token',
        'grant_type=client_credentials',
        expect.objectContaining({
          headers: {
            'Authorization': expect.stringContaining('Basic '),
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
      )
    })

    it('should throw error when credentials are missing', async () => {
      process.env.SPOTIFY_CLIENT_ID = ''
      
      await expect(getAccessToken()).rejects.toThrow('Spotify credentials not configured')
    })

    it('should handle 401 authentication error', async () => {
      const mockError = {
        response: {
          status: 401,
          data: { error: 'invalid_client' }
        }
      }
      
      vi.mocked(axios.post).mockRejectedValueOnce(mockError)
      
      await expect(getAccessToken()).rejects.toThrow(
        'Invalid Spotify credentials. Please check SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET.'
      )
    })

    it('should handle 503 service unavailable', async () => {
      const mockError = {
        response: {
          status: 503
        }
      }
      
      vi.mocked(axios.post).mockRejectedValueOnce(mockError)
      
      await expect(getAccessToken()).rejects.toThrow(
        'Spotify service temporarily unavailable. Please try again later.'
      )
    })

    it('should handle network errors', async () => {
      const mockError = new Error('Network error')
      mockError.code = 'ECONNREFUSED'
      
      vi.mocked(axios.post).mockRejectedValueOnce(mockError)
      
      await expect(getAccessToken()).rejects.toThrow('Network error')
    })
  })

  describe('getRecommendations', () => {
    const mockParams = {
      valence: 0.8,
      energy: 0.7,
      danceability: 0.6,
      genres: ['pop', 'rock'],
      limit: 20
    }

    beforeEach(() => {
      // Mock successful token fetch
      vi.mocked(axios.post).mockResolvedValueOnce({
        data: { access_token: mockAccessToken }
      })
    })

    it('should get recommendations successfully', async () => {
      const mockTracks = [
        {
          id: 'track1',
          name: 'Test Track 1',
          artists: [{ name: 'Artist 1' }],
          album: {
            name: 'Album 1',
            images: [{ url: 'image1.jpg' }]
          },
          duration_ms: 180000,
          preview_url: 'preview1.mp3',
          external_urls: { spotify: 'spotify:track:1' }
        },
        {
          id: 'track2',
          name: 'Test Track 2',
          artists: [{ name: 'Artist 2' }],
          album: {
            name: 'Album 2',
            images: [{ url: 'image2.jpg' }]
          },
          duration_ms: 200000,
          preview_url: 'preview2.mp3',
          external_urls: { spotify: 'spotify:track:2' }
        }
      ]

      vi.mocked(axios.get).mockResolvedValueOnce({
        data: { tracks: mockTracks }
      })

      const recommendations = await getRecommendations(mockParams)

      expect(recommendations).toHaveLength(2)
      expect(recommendations[0]).toMatchObject({
        id: 'track1',
        name: 'Test Track 1',
        artist: 'Artist 1',
        duration: '3:00'
      })
      
      expect(axios.get).toHaveBeenCalledWith(
        'https://api.spotify.com/v1/recommendations',
        expect.objectContaining({
          params: expect.objectContaining({
            seed_genres: 'pop,rock',
            target_valence: 0.8,
            target_energy: 0.7,
            target_danceability: 0.6,
            limit: 20
          })
        })
      )
    })

    it('should remove duplicate tracks', async () => {
      const mockTracks = [
        {
          id: 'track1',
          name: 'Duplicate Track',
          artists: [{ name: 'Artist 1' }],
          album: { name: 'Album 1', images: [] },
          duration_ms: 180000,
          external_urls: { spotify: 'spotify:track:1' }
        },
        {
          id: 'track2',
          name: 'Duplicate Track',
          artists: [{ name: 'Artist 1' }],
          album: { name: 'Album 2', images: [] },
          duration_ms: 180000,
          external_urls: { spotify: 'spotify:track:2' }
        },
        {
          id: 'track3',
          name: 'Different Track',
          artists: [{ name: 'Artist 2' }],
          album: { name: 'Album 3', images: [] },
          duration_ms: 200000,
          external_urls: { spotify: 'spotify:track:3' }
        }
      ]

      vi.mocked(axios.get).mockResolvedValueOnce({
        data: { tracks: mockTracks }
      })

      const recommendations = await getRecommendations(mockParams)

      expect(recommendations).toHaveLength(2)
      expect(recommendations[0].name).toBe('Duplicate Track')
      expect(recommendations[1].name).toBe('Different Track')
    })

    it('should handle case-insensitive duplicate detection', async () => {
      const mockTracks = [
        {
          id: 'track1',
          name: 'Same Track',
          artists: [{ name: 'Artist Name' }],
          album: { name: 'Album', images: [] },
          duration_ms: 180000,
          external_urls: { spotify: 'spotify:track:1' }
        },
        {
          id: 'track2',
          name: 'same track',
          artists: [{ name: 'artist name' }],
          album: { name: 'Album', images: [] },
          duration_ms: 180000,
          external_urls: { spotify: 'spotify:track:2' }
        }
      ]

      vi.mocked(axios.get).mockResolvedValueOnce({
        data: { tracks: mockTracks }
      })

      const recommendations = await getRecommendations(mockParams)

      expect(recommendations).toHaveLength(1)
    })

    it('should handle API errors gracefully', async () => {
      vi.mocked(axios.get).mockRejectedValueOnce(new Error('API Error'))

      await expect(getRecommendations(mockParams)).rejects.toThrow('API Error')
    })

    it('should format duration correctly', async () => {
      const mockTracks = [
        {
          id: 'track1',
          name: 'Short Track',
          artists: [{ name: 'Artist' }],
          album: { name: 'Album', images: [] },
          duration_ms: 45000, // 0:45
          external_urls: { spotify: 'spotify:track:1' }
        },
        {
          id: 'track2',
          name: 'Long Track',
          artists: [{ name: 'Artist' }],
          album: { name: 'Album', images: [] },
          duration_ms: 605000, // 10:05
          external_urls: { spotify: 'spotify:track:2' }
        }
      ]

      vi.mocked(axios.get).mockResolvedValueOnce({
        data: { tracks: mockTracks }
      })

      const recommendations = await getRecommendations(mockParams)

      expect(recommendations[0].duration).toBe('0:45')
      expect(recommendations[1].duration).toBe('10:05')
    })
  })

  describe('getAvailableGenres', () => {
    beforeEach(() => {
      vi.mocked(axios.post).mockResolvedValueOnce({
        data: { access_token: mockAccessToken }
      })
    })

    it('should fetch available genres', async () => {
      const mockGenres = ['pop', 'rock', 'jazz', 'classical']
      
      vi.mocked(axios.get).mockResolvedValueOnce({
        data: { genres: mockGenres }
      })

      const genres = await getAvailableGenres()

      expect(genres).toEqual(mockGenres)
      expect(axios.get).toHaveBeenCalledWith(
        'https://api.spotify.com/v1/recommendations/available-genre-seeds',
        expect.objectContaining({
          headers: {
            'Authorization': `Bearer ${mockAccessToken}`
          }
        })
      )
    })

    it('should handle API errors', async () => {
      vi.mocked(axios.get).mockRejectedValueOnce(new Error('Genre fetch failed'))

      await expect(getAvailableGenres()).rejects.toThrow('Genre fetch failed')
    })
  })

  describe('searchTracks', () => {
    beforeEach(() => {
      vi.mocked(axios.post).mockResolvedValueOnce({
        data: { access_token: mockAccessToken }
      })
    })

    it('should search tracks by query', async () => {
      const mockSearchResults = {
        tracks: {
          items: [
            {
              id: 'track1',
              name: 'Search Result 1',
              artists: [{ name: 'Artist 1' }],
              album: { name: 'Album 1', images: [] },
              duration_ms: 180000,
              external_urls: { spotify: 'spotify:track:1' }
            }
          ]
        }
      }

      vi.mocked(axios.get).mockResolvedValueOnce({
        data: mockSearchResults
      })

      const results = await searchTracks('test query')

      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('Search Result 1')
      expect(axios.get).toHaveBeenCalledWith(
        'https://api.spotify.com/v1/search',
        expect.objectContaining({
          params: {
            q: 'test query',
            type: 'track',
            limit: 20
          }
        })
      )
    })

    it('should handle empty search results', async () => {
      vi.mocked(axios.get).mockResolvedValueOnce({
        data: { tracks: { items: [] } }
      })

      const results = await searchTracks('nonexistent track')

      expect(results).toEqual([])
    })
  })

  describe('Security Tests', () => {
    it('should not expose credentials in error messages', async () => {
      process.env.SPOTIFY_CLIENT_SECRET = 'super-secret-key'
      
      const mockError = {
        response: {
          status: 401,
          data: { error: 'invalid_client' }
        },
        config: {
          headers: {
            Authorization: 'Basic super-secret-key'
          }
        }
      }
      
      vi.mocked(axios.post).mockRejectedValueOnce(mockError)
      
      try {
        await getAccessToken()
      } catch (error) {
        expect(error.message).not.toContain('super-secret-key')
      }
    })

    it('should use secure HTTPS endpoints', async () => {
      vi.mocked(axios.post).mockResolvedValueOnce({
        data: { access_token: mockAccessToken }
      })

      await getAccessToken()

      expect(axios.post).toHaveBeenCalledWith(
        expect.stringMatching(/^https:\/\//),
        expect.anything(),
        expect.anything()
      )
    })
  })
})

// Mock data helper for consistent test data
export const mockSpotifyTrack = (overrides = {}) => ({
  id: 'default-id',
  name: 'Default Track',
  artists: [{ name: 'Default Artist' }],
  album: {
    name: 'Default Album',
    images: [{ url: 'default-image.jpg' }]
  },
  duration_ms: 200000,
  preview_url: 'default-preview.mp3',
  external_urls: { spotify: 'spotify:track:default' },
  ...overrides
})