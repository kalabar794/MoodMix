import { describe, it, expect, vi } from 'vitest'
import {
  moodToMusicParams,
  getMoodKeywords,
  getMoodDescription,
  validateGenres,
  getComplementaryMoods
} from '../moodMapping'
import { MoodSelection } from '../types'

describe('moodMapping', () => {
  describe('moodToMusicParams', () => {
    it('should convert euphoric mood to music parameters', () => {
      const mood: MoodSelection = {
        primary: 'euphoric',
        intensity: 50
      }
      
      const params = moodToMusicParams(mood)
      
      expect(params.valence).toBeWithinRange(0.8, 1.0)
      expect(params.energy).toBeWithinRange(0.7, 0.9)
      expect(params.danceability).toBeWithinRange(0.7, 0.9)
      expect(params.genres).toContain('pop')
      expect(params.limit).toBe(20)
    })

    it('should handle low intensity mood', () => {
      const mood: MoodSelection = {
        primary: 'melancholic',
        intensity: 20
      }
      
      const params = moodToMusicParams(mood)
      
      expect(params.valence).toBeLessThan(0.3)
      expect(params.energy).toBeLessThan(0.4)
      expect(params.genres.length).toBeGreaterThan(2)
    })

    it('should handle high intensity mood', () => {
      const mood: MoodSelection = {
        primary: 'energetic',
        intensity: 90
      }
      
      const params = moodToMusicParams(mood)
      
      expect(params.energy).toBeGreaterThan(0.8)
      expect(params.genres.length).toBeLessThanOrEqual(2)
    })

    it('should handle unknown mood with fallback', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const mood: MoodSelection = {
        primary: 'unknownMood',
        intensity: 50
      }
      
      const params = moodToMusicParams(mood)
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Mood unknownMood not found, using happy as default'
      )
      expect(params.genres).toContain('pop')
      consoleSpy.mockRestore()
    })

    it('should adjust values for intensity extremes', () => {
      const moodLow: MoodSelection = {
        primary: 'serene',
        intensity: 0
      }
      
      const moodHigh: MoodSelection = {
        primary: 'serene',
        intensity: 100
      }
      
      const paramsLow = moodToMusicParams(moodLow)
      const paramsHigh = moodToMusicParams(moodHigh)
      
      expect(paramsLow.energy).toBeLessThan(paramsHigh.energy)
      expect(paramsLow.valence).toBeLessThan(paramsHigh.valence)
    })

    it('should handle all defined moods', () => {
      const moods = [
        'euphoric', 'melancholic', 'energetic', 'serene', 'passionate',
        'contemplative', 'nostalgic', 'rebellious', 'mystical', 'triumphant',
        'vulnerable', 'adventurous', 'happy', 'sad', 'calm'
      ]
      
      moods.forEach(moodName => {
        const mood: MoodSelection = {
          primary: moodName,
          intensity: 50
        }
        
        const params = moodToMusicParams(mood)
        
        expect(params).toBeDefined()
        expect(params.valence).toBeGreaterThanOrEqual(0)
        expect(params.valence).toBeLessThanOrEqual(1)
        expect(params.energy).toBeGreaterThanOrEqual(0)
        expect(params.energy).toBeLessThanOrEqual(1)
        expect(params.danceability).toBeGreaterThanOrEqual(0)
        expect(params.danceability).toBeLessThanOrEqual(1)
        expect(params.genres).toBeDefined()
        expect(params.genres.length).toBeGreaterThan(0)
      })
    })
  })

  describe('getMoodKeywords', () => {
    it('should return keywords for known moods', () => {
      const mood: MoodSelection = {
        primary: 'euphoric',
        intensity: 50
      }
      
      const keywords = getMoodKeywords(mood)
      
      expect(keywords).toContain('ecstatic')
      expect(keywords).toContain('blissful')
      expect(keywords.length).toBe(5)
    })

    it('should return default keywords for unknown mood', () => {
      const mood: MoodSelection = {
        primary: 'unknownMood',
        intensity: 50
      }
      
      const keywords = getMoodKeywords(mood)
      
      expect(keywords).toContain('ecstatic') // Default euphoric keywords
    })
  })

  describe('getMoodDescription', () => {
    it('should return description for known moods', () => {
      const mood: MoodSelection = {
        primary: 'rebellious',
        intensity: 50
      }
      
      const description = getMoodDescription(mood)
      
      expect(description).toContain('Bold anthems')
      expect(description).toContain('defiant')
    })

    it('should return default description for unknown mood', () => {
      const mood: MoodSelection = {
        primary: 'unknownMood',
        intensity: 50
      }
      
      const description = getMoodDescription(mood)
      
      expect(description).toBe('Music perfectly matched to your emotional state')
    })
  })

  describe('validateGenres', () => {
    it('should filter valid genres', async () => {
      const requestedGenres = ['pop', 'rock', 'invalid-genre', 'jazz']
      const availableGenres = ['pop', 'rock', 'jazz', 'classical']
      
      const validGenres = await validateGenres(requestedGenres, availableGenres)
      
      expect(validGenres).toEqual(['pop', 'rock', 'jazz'])
      expect(validGenres).not.toContain('invalid-genre')
    })

    it('should return empty array if no valid genres', async () => {
      const requestedGenres = ['genre1', 'genre2']
      const availableGenres = ['pop', 'rock']
      
      const validGenres = await validateGenres(requestedGenres, availableGenres)
      
      expect(validGenres).toEqual([])
    })
  })

  describe('getComplementaryMoods', () => {
    it('should return complementary moods for known mood', () => {
      const complementary = getComplementaryMoods('happy')
      
      expect(complementary).toContain('excited')
      expect(complementary).toContain('energetic')
      expect(complementary.length).toBe(3)
    })

    it('should return default complementary moods for unknown mood', () => {
      const complementary = getComplementaryMoods('unknownMood')
      
      expect(complementary).toEqual(['happy', 'calm', 'energetic'])
    })
  })

  describe('intensity adjustments', () => {
    it('should properly adjust values based on intensity', () => {
      const intensities = [0, 25, 50, 75, 100]
      
      intensities.forEach(intensity => {
        const mood: MoodSelection = {
          primary: 'energetic',
          intensity
        }
        
        const params = moodToMusicParams(mood)
        
        // Energy should increase with intensity for energetic mood
        if (intensity > 50) {
          expect(params.energy).toBeGreaterThan(0.8)
        }
      })
    })
  })

  describe('edge cases', () => {
    it('should handle negative intensity gracefully', () => {
      const mood: MoodSelection = {
        primary: 'happy',
        intensity: -10
      }
      
      const params = moodToMusicParams(mood)
      
      expect(params.valence).toBeGreaterThanOrEqual(0)
      expect(params.energy).toBeGreaterThanOrEqual(0)
    })

    it('should handle intensity over 100', () => {
      const mood: MoodSelection = {
        primary: 'happy',
        intensity: 150
      }
      
      const params = moodToMusicParams(mood)
      
      expect(params.valence).toBeLessThanOrEqual(1)
      expect(params.energy).toBeLessThanOrEqual(1)
    })
  })
})

// Type declaration for custom matcher
declare module 'vitest' {
  interface Assertion<T = any> {
    toBeWithinRange(floor: number, ceiling: number): T
  }
  interface AsymmetricMatchersContaining {
    toBeWithinRange(floor: number, ceiling: number): any
  }
}