'use client'

import { useState, useEffect } from 'react'
import MusicResults from '@/components/MusicResults'
import { SpotifyTrack } from '@/lib/types'

export default function TestYouTubePage() {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTestTracks = async () => {
      try {
        console.log('🧪 Loading test tracks for YouTube integration test...')
        const response = await fetch('/api/test-tracks')
        const data = await response.json()
        
        console.log('🧪 Test tracks loaded:', data)
        setTracks(data.tracks)
        setIsLoading(false)
      } catch (error) {
        console.error('❌ Failed to load test tracks:', error)
        setIsLoading(false)
      }
    }

    // Load test tracks after a brief delay to simulate real loading
    setTimeout(loadTestTracks, 1000)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🧪 YouTube Integration Test Page
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            This page uses mock track data to test the YouTube integration functionality.
            You should see RED YouTube buttons (▶) that play actual music videos when clicked.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <MusicResults 
            tracks={tracks}
            isLoading={isLoading}
            moodDescription="High-energy tracks perfect for testing YouTube integration"
          />
        </div>

        {!isLoading && tracks.length > 0 && (
          <div className="text-center mt-8">
            <div className="glass-card p-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-white mb-4">🎬 Test Instructions:</h3>
              <ol className="text-left text-white/80 space-y-2">
                <li>1. Look for RED YouTube buttons (▶) next to each track</li>
                <li>2. Click on a YouTube button to open a music video</li>
                <li>3. Verify that actual YouTube videos load and play</li>
                <li>4. Test multiple buttons to ensure all work correctly</li>
                <li>5. Check browser console for successful API calls</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}