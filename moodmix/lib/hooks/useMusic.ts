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
      const response = await fetch('/api/mood-to-music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mood),
      })

      const data = await response.json()

      if (data.success) {
        setTracks(data.tracks)
        setMoodDescription(data.description)
      } else {
        setError(data.message || 'Failed to fetch music')
        setTracks([])
      }
    } catch {
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