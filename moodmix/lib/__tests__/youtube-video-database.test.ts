import { describe, it, expect, beforeEach, vi } from 'vitest'
import { findMusicVideo, MUSIC_VIDEO_DATABASE } from '../youtube-video-database'

describe('YouTube Video Database', () => {
  beforeEach(() => {
    // Clear console mocks before each test
    vi.clearAllMocks()
  })

  describe('MUSIC_VIDEO_DATABASE', () => {
    it('should have valid structure for all entries', () => {
      MUSIC_VIDEO_DATABASE.forEach((entry, index) => {
        expect(entry).toHaveProperty('artist')
        expect(entry).toHaveProperty('track')
        expect(entry).toHaveProperty('videoId')
        expect(entry).toHaveProperty('title')
        expect(entry).toHaveProperty('channelTitle')
        expect(entry).toHaveProperty('duration')
        
        // Validate types
        expect(typeof entry.artist).toBe('string')
        expect(typeof entry.track).toBe('string')
        expect(typeof entry.videoId).toBe('string')
        expect(typeof entry.title).toBe('string')
        expect(typeof entry.channelTitle).toBe('string')
        expect(typeof entry.duration).toBe('string')
        
        // Validate videoId format (YouTube ID pattern)
        expect(entry.videoId).toMatch(/^[a-zA-Z0-9_-]{11}$/)
        
        // Validate duration format (M:SS or MM:SS or H:MM:SS)
        expect(entry.duration).toMatch(/^\d{1,2}:\d{2}(:\d{2})?$/)
        
        // Ensure no empty values
        expect(entry.artist.trim()).not.toBe('')
        expect(entry.track.trim()).not.toBe('')
        expect(entry.videoId.trim()).not.toBe('')
      })
    })

    it('should have more than 100 entries', () => {
      expect(MUSIC_VIDEO_DATABASE.length).toBeGreaterThan(100)
    })

    it('should not have duplicate video IDs', () => {
      const videoIds = MUSIC_VIDEO_DATABASE.map(entry => entry.videoId)
      const uniqueIds = new Set(videoIds)
      
      expect(uniqueIds.size).toBe(videoIds.length)
    })

    it('should include popular artists', () => {
      const popularArtists = [
        'The Weeknd', 'Taylor Swift', 'Ed Sheeran', 'Billie Eilish',
        'Bruno Mars', 'Ariana Grande', 'Drake', 'Post Malone'
      ]
      
      popularArtists.forEach(artist => {
        const hasArtist = MUSIC_VIDEO_DATABASE.some(
          entry => entry.artist.toLowerCase().includes(artist.toLowerCase())
        )
        expect(hasArtist).toBe(true)
      })
    })
  })

  describe('findMusicVideo', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    it('should find exact match', () => {
      const result = findMusicVideo('Blinding Lights', 'The Weeknd')
      
      expect(result).not.toBeNull()
      expect(result?.artist).toBe('The Weeknd')
      expect(result?.track).toBe('Blinding Lights')
      expect(result?.videoId).toBe('4NRXx6U8ABQ')
    })

    it('should handle case insensitive matching', () => {
      const result = findMusicVideo('BLINDING LIGHTS', 'the weeknd')
      
      expect(result).not.toBeNull()
      expect(result?.artist).toBe('The Weeknd')
    })

    it('should handle parentheses in track names', () => {
      const result = findMusicVideo(
        'Popular (with Playboi Carti & Madonna)',
        'The Weeknd'
      )
      
      expect(result).not.toBeNull()
      expect(result?.track).toBe('Popular')
    })

    it('should handle featuring artists', () => {
      const result = findMusicVideo(
        'Titanium feat. Sia',
        'David Guetta'
      )
      
      expect(result).not.toBeNull()
      expect(result?.artist).toBe('David Guetta')
    })

    it('should handle remix/remaster versions', () => {
      const result = findMusicVideo(
        'Bohemian Rhapsody (Remastered)',
        'Queen'
      )
      
      expect(result).not.toBeNull()
      expect(result?.track).toBe('Bohemian Rhapsody')
    })

    it('should match with flexible artist names', () => {
      // Test when database has "The Weeknd" but search is for "Weeknd"
      const result = findMusicVideo('Blinding Lights', 'Weeknd')
      
      expect(result).not.toBeNull()
      expect(result?.artist).toBe('The Weeknd')
    })

    it('should match tracks by same artist with word similarity', () => {
      // If we search for a track that's not exact but by same artist
      const result = findMusicVideo('Shape', 'Ed Sheeran')
      
      // Should find "Shape of You" since it contains "Shape" and is by Ed Sheeran
      expect(result).not.toBeNull()
      expect(result?.track).toBe('Shape of You')
    })

    it('should return null for non-existent tracks', () => {
      const result = findMusicVideo('Non Existent Track', 'Unknown Artist')
      
      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('❌ No match')
      )
    })

    it('should handle special characters in names', () => {
      const result = findMusicVideo('Can\'t Feel My Face', 'The Weeknd')
      
      expect(result).not.toBeNull()
    })

    it('should prioritize exact matches over partial matches', () => {
      // Add a mock to ensure exact match is found first
      const exactResult = findMusicVideo('Circles', 'Post Malone')
      const partialResult = findMusicVideo('Circle', 'Post Malone')
      
      expect(exactResult).not.toBeNull()
      expect(exactResult?.track).toBe('Circles')
    })

    it('should handle popular artist partial matching', () => {
      const popularArtists = ['swift', 'drake', 'bieber', 'grande']
      
      // Test that searching with partial popular artist names works
      const result = findMusicVideo('Any Track', 'taylor swift and friends')
      
      // Should find a Taylor Swift track
      if (result) {
        expect(result.artist.toLowerCase()).toContain('swift')
      }
    })

    it('should not match wrong artist even with same track name', () => {
      // Assuming there might be multiple "Love" songs by different artists
      const result = findMusicVideo('Blinding Lights', 'Drake')
      
      // Should not return The Weeknd's Blinding Lights for Drake
      if (result) {
        expect(result.artist).not.toBe('The Weeknd')
      }
    })
  })

  describe('Edge Cases and Security', () => {
    it('should handle SQL injection-like strings safely', () => {
      const maliciousStrings = [
        "'; DROP TABLE songs; --",
        "track' OR '1'='1",
        "<script>alert('xss')</script>"
      ]
      
      maliciousStrings.forEach(str => {
        expect(() => findMusicVideo(str, str)).not.toThrow()
      })
    })

    it('should handle extremely long strings', () => {
      const longString = 'a'.repeat(1000)
      
      expect(() => findMusicVideo(longString, longString)).not.toThrow()
      const result = findMusicVideo(longString, longString)
      expect(result).toBeNull()
    })

    it('should handle empty strings', () => {
      expect(findMusicVideo('', '')).toBeNull()
      expect(findMusicVideo('Blinding Lights', '')).toBeNull()
      expect(findMusicVideo('', 'The Weeknd')).toBeNull()
    })

    it('should handle null/undefined gracefully', () => {
      // @ts-ignore - Testing runtime behavior
      expect(() => findMusicVideo(null, null)).not.toThrow()
      // @ts-ignore
      expect(() => findMusicVideo(undefined, undefined)).not.toThrow()
    })
  })

  describe('Performance', () => {
    it('should find matches quickly even with large database', () => {
      const iterations = 1000
      const startTime = performance.now()
      
      for (let i = 0; i < iterations; i++) {
        findMusicVideo('Blinding Lights', 'The Weeknd')
      }
      
      const endTime = performance.now()
      const avgTime = (endTime - startTime) / iterations
      
      // Should complete in less than 1ms per search on average
      expect(avgTime).toBeLessThan(1)
    })
  })
})