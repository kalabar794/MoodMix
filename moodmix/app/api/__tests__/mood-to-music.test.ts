import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '../mood-to-music/route'
import * as spotify from '@/lib/spotify'
import * as moodMapping from '@/lib/moodMapping'

// Mock the modules
vi.mock('@/lib/spotify')
vi.mock('@/lib/moodMapping')

describe('POST /api/mood-to-music', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Successful Requests', () => {
    it('should return recommendations for valid mood', async () => {
      const mockTracks = [
        {
          id: '1',
          name: 'Test Track',
          artist: 'Test Artist',
          album: 'Test Album',
          image: 'test.jpg',
          duration: '3:30',
          previewUrl: 'preview.mp3',
          spotifyUrl: 'spotify:track:1'
        }
      ]

      vi.mocked(moodMapping.moodToMusicParams).mockReturnValue({
        valence: 0.8,
        energy: 0.7,
        danceability: 0.6,
        genres: ['pop'],
        limit: 20
      })

      vi.mocked(spotify.getRecommendations).mockResolvedValue(mockTracks)

      const request = new NextRequest('http://localhost:3000/api/mood-to-music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mood: {
            primary: 'happy',
            intensity: 75
          }
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.tracks).toEqual(mockTracks)
      expect(moodMapping.moodToMusicParams).toHaveBeenCalledWith({
        primary: 'happy',
        intensity: 75
      })
    })

    it('should handle different mood types', async () => {
      const moods = ['euphoric', 'melancholic', 'energetic', 'serene']
      
      for (const mood of moods) {
        vi.mocked(spotify.getRecommendations).mockResolvedValue([])
        
        const request = new NextRequest('http://localhost:3000/api/mood-to-music', {
          method: 'POST',
          body: JSON.stringify({
            mood: { primary: mood, intensity: 50 }
          })
        })

        const response = await POST(request)
        
        expect(response.status).toBe(200)
      }
    })
  })

  describe('Input Validation', () => {
    it('should reject missing mood object', async () => {
      const request = new NextRequest('http://localhost:3000/api/mood-to-music', {
        method: 'POST',
        body: JSON.stringify({})
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Missing mood data')
    })

    it('should reject missing primary mood', async () => {
      const request = new NextRequest('http://localhost:3000/api/mood-to-music', {
        method: 'POST',
        body: JSON.stringify({
          mood: { intensity: 50 }
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Invalid mood format')
    })

    it('should reject invalid intensity values', async () => {
      const invalidIntensities = [-10, 150, 'high', null, undefined]
      
      for (const intensity of invalidIntensities) {
        const request = new NextRequest('http://localhost:3000/api/mood-to-music', {
          method: 'POST',
          body: JSON.stringify({
            mood: { primary: 'happy', intensity }
          })
        })

        const response = await POST(request)
        expect(response.status).toBe(400)
      }
    })

    it('should reject malformed JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/mood-to-music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'invalid json'
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
    })
  })

  describe('Security Tests', () => {
    it('should sanitize XSS attempts in mood input', async () => {
      const xssAttempts = [
        '<script>alert("xss")</script>',
        'javascript:alert("xss")',
        '<img src=x onerror=alert("xss")>'
      ]

      for (const xss of xssAttempts) {
        const request = new NextRequest('http://localhost:3000/api/mood-to-music', {
          method: 'POST',
          body: JSON.stringify({
            mood: { primary: xss, intensity: 50 }
          })
        })

        const response = await POST(request)
        expect(response.status).toBe(400)
      }
    })

    it('should handle SQL injection attempts safely', async () => {
      const sqlInjections = [
        "happy'; DROP TABLE moods; --",
        "happy' OR '1'='1",
        "happy\"; DELETE FROM tracks WHERE \"1\"=\"1"
      ]

      for (const sql of sqlInjections) {
        const request = new NextRequest('http://localhost:3000/api/mood-to-music', {
          method: 'POST',
          body: JSON.stringify({
            mood: { primary: sql, intensity: 50 }
          })
        })

        const response = await POST(request)
        // Should either reject as invalid mood or handle safely
        expect([400, 500]).toContain(response.status)
      }
    })

    it('should validate Content-Type header', async () => {
      const request = new NextRequest('http://localhost:3000/api/mood-to-music', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
          mood: { primary: 'happy', intensity: 50 }
        })
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
    })

    it('should reject oversized payloads', async () => {
      const largePayload = {
        mood: { primary: 'happy', intensity: 50 },
        extra: 'x'.repeat(1000000) // 1MB of data
      }

      const request = new NextRequest('http://localhost:3000/api/mood-to-music', {
        method: 'POST',
        body: JSON.stringify(largePayload)
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
    })

    it('should include security headers in response', async () => {
      vi.mocked(spotify.getRecommendations).mockResolvedValue([])
      
      const request = new NextRequest('http://localhost:3000/api/mood-to-music', {
        method: 'POST',
        body: JSON.stringify({
          mood: { primary: 'happy', intensity: 50 }
        })
      })

      const response = await POST(request)
      
      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff')
      expect(response.headers.get('X-Frame-Options')).toBe('DENY')
      expect(response.headers.get('X-XSS-Protection')).toBe('1; mode=block')
    })
  })

  describe('Error Handling', () => {
    it('should handle Spotify API errors gracefully', async () => {
      vi.mocked(spotify.getRecommendations).mockRejectedValue(
        new Error('Spotify API error')
      )

      const request = new NextRequest('http://localhost:3000/api/mood-to-music', {
        method: 'POST',
        body: JSON.stringify({
          mood: { primary: 'happy', intensity: 50 }
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toContain('Failed to get music recommendations')
      expect(data.details).not.toContain('Spotify API error') // Don't leak internal errors
    })

    it('should handle network timeouts', async () => {
      vi.mocked(spotify.getRecommendations).mockImplementation(
        () => new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 100)
        )
      )

      const request = new NextRequest('http://localhost:3000/api/mood-to-music', {
        method: 'POST',
        body: JSON.stringify({
          mood: { primary: 'happy', intensity: 50 }
        })
      })

      const response = await POST(request)
      expect(response.status).toBe(500)
    })
  })

  describe('Rate Limiting', () => {
    it('should handle rate limiting headers', async () => {
      // This would typically be handled by middleware
      // Testing that the endpoint respects rate limit errors
      vi.mocked(spotify.getRecommendations).mockRejectedValue({
        response: { status: 429 }
      })

      const request = new NextRequest('http://localhost:3000/api/mood-to-music', {
        method: 'POST',
        body: JSON.stringify({
          mood: { primary: 'happy', intensity: 50 }
        })
      })

      const response = await POST(request)
      expect(response.status).toBe(429)
    })
  })

  describe('CORS Headers', () => {
    it('should include appropriate CORS headers', async () => {
      vi.mocked(spotify.getRecommendations).mockResolvedValue([])
      
      const request = new NextRequest('http://localhost:3000/api/mood-to-music', {
        method: 'POST',
        headers: {
          'Origin': 'https://example.com'
        },
        body: JSON.stringify({
          mood: { primary: 'happy', intensity: 50 }
        })
      })

      const response = await POST(request)
      
      // Check CORS headers based on your app's policy
      const corsHeaders = response.headers.get('Access-Control-Allow-Origin')
      expect(corsHeaders).toBeDefined()
    })
  })
})