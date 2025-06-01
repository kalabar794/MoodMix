import { useState, useCallback } from 'react'
import { SpotifyTrack, MoodSelection } from '@/lib/types'

export function useMusic() {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [moodDescription, setMoodDescription] = useState<string>('')

  const fetchMusicForMood = useCallback(async (mood: MoodSelection) => {
    setIsLoading(true)
    setError(null)

    try {
      // Use test API if in development and debug mode is enabled
      const isDebugMode = process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && window.location.search.includes('debug=true')
      const apiEndpoint = isDebugMode ? '/api/test-tracks' : '/api/mood-to-music'
      
      console.log('🎵 Fetching music from:', apiEndpoint)

      const response = isDebugMode 
        ? await fetch(apiEndpoint)  // GET request for test-tracks
        : await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(mood),
          })

      const data = await response.json()

      if (data.tracks && data.tracks.length > 0) {
        setTracks(data.tracks)
        setMoodDescription(data.description || `Perfect tracks for your ${mood.primary} mood`)
        console.log('🎵 Successfully loaded', data.tracks.length, 'tracks')
      } else if (data.success) {
        setTracks(data.tracks)
        setMoodDescription(data.description)
      } else {
        setError(data.message || 'Failed to fetch music')
        setTracks([])
      }
    } catch (error) {
      console.error('Music fetch error:', error)
      setError('Network error. Please try again.')
      setTracks([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearMusic = useCallback(() => {
    setTracks([])
    setMoodDescription('')
    setError(null)
  }, [])

  return {
    tracks,
    isLoading,
    error,
    moodDescription,
    fetchMusicForMood,
    clearMusic,
  }
}