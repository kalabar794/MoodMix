# 09. Music Results Component

## Create Component to Display Music Recommendations

### Step 1: Create components/MusicResults.tsx

```tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SpotifyTrack } from '@/lib/types'
import { MusicCard, LoadingCard } from './GlassCard'
import GlassCard from './GlassCard'

interface MusicResultsProps {
  tracks: SpotifyTrack[]
  isLoading: boolean
  moodDescription?: string
}

export default function MusicResults({ tracks, isLoading, moodDescription }: MusicResultsProps) {
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Handle audio playback
  const handlePlayPause = (track: SpotifyTrack) => {
    if (!track.preview_url) return

    if (playingTrackId === track.id) {
      // Pause current track
      audioRef.current?.pause()
      setPlayingTrackId(null)
    } else {
      // Play new track
      if (audioRef.current) {
        audioRef.current.pause()
      }
      
      audioRef.current = new Audio(track.preview_url)
      audioRef.current.volume = 0.5
      
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error)
      })

      audioRef.current.addEventListener('ended', () => {
        setPlayingTrackId(null)
      })

      setPlayingTrackId(track.id)
    }
  }

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      audioRef.current?.pause()
    }
  }, [])

  // Stop playing when tracks change
  useEffect(() => {
    audioRef.current?.pause()
    setPlayingTrackId(null)
  }, [tracks])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20
      }
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <AnimatePresence mode="wait">
        {moodDescription && !isLoading && tracks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-2">Your Mood Playlist</h2>
            <p className="text-white/60 text-lg">{moodDescription}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-4"
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <LoadingCard />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence mode="wait">
        {!isLoading && tracks.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid gap-4"
          >
            {tracks.map((track) => (
              <motion.div key={track.id} variants={itemVariants}>
                <MusicCard
                  track={track}
                  isPlaying={playingTrackId === track.id}
                  onPlay={() => handlePlayPause(track)}
                />
              </motion.div>
            ))}

            {/* Spotify Attribution */}
            <motion.div 
              variants={itemVariants}
              className="mt-6 text-center"
            >
              <GlassCard className="inline-flex items-center gap-2 px-4 py-2">
                <SpotifyLogo className="w-5 h-5" />
                <span className="text-sm text-white/60">Powered by Spotify</span>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      <AnimatePresence>
        {!isLoading && tracks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-12"
          >
            <GlassCard className="inline-block p-8">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="text-xl font-semibold mb-2">No tracks found</h3>
              <p className="text-white/60">
                Try selecting a different mood or adjusting the intensity
              </p>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Spotify Logo Component
function SpotifyLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  )
}
```

### Step 2: Create a Hook for Music Fetching (lib/hooks/useMusic.ts)

```typescript
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
    } catch (err) {
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
```

### Step 3: Update app/page.tsx to Use Music Results

```tsx
'use client'

import { useState, useEffect } from 'react'
import MoodWheel from '@/components/MoodWheel'
import BackgroundAnimation from '@/components/BackgroundAnimation'
import MusicResults from '@/components/MusicResults'
import GlassCard from '@/components/GlassCard'
import { MoodSelection } from '@/lib/types'
import { useMusic } from '@/lib/hooks/useMusic'

export default function Home() {
  const [currentMood, setCurrentMood] = useState<MoodSelection | null>(null)
  const { tracks, isLoading, error, moodDescription, fetchMusicForMood } = useMusic()

  const handleMoodSelect = (mood: MoodSelection) => {
    setCurrentMood(mood)
    // Update CSS variables for dynamic theming
    document.documentElement.className = `mood-${mood.primary}`
  }

  // Fetch music when mood changes
  useEffect(() => {
    if (currentMood) {
      fetchMusicForMood(currentMood)
    }
  }, [currentMood, fetchMusicForMood])

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Base gradient background */}
      <div className={`gradient-bg ${currentMood ? `mood-${currentMood.primary}` : ''}`} />
      
      {/* Dynamic background animation */}
      <BackgroundAnimation mood={currentMood} />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 gap-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2">MoodMix</h1>
          <p className="text-white/60 text-lg">How are you feeling today?</p>
        </div>

        {/* Mood Wheel */}
        <div className="glass p-8 rounded-3xl">
          <MoodWheel onMoodSelect={handleMoodSelect} />
        </div>

        {/* Selected Mood Display */}
        {currentMood && (
          <div className="glass glass-hover p-6 rounded-2xl text-center">
            <p className="text-sm text-white/60 mb-1">Current Mood</p>
            <p className="text-2xl font-semibold capitalize">{currentMood.primary}</p>
            <p className="text-sm text-white/60 mt-1">Intensity: {currentMood.intensity}%</p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <GlassCard variant="default" className="p-4 max-w-md text-center">
            <p className="text-red-400">{error}</p>
          </GlassCard>
        )}

        {/* Music Results */}
        {(currentMood && (tracks.length > 0 || isLoading)) && (
          <div className="w-full mt-8">
            <MusicResults 
              tracks={tracks} 
              isLoading={isLoading}
              moodDescription={moodDescription}
            />
          </div>
        )}
      </div>
    </main>
  )
}
```

### Step 4: Test the Complete Flow

1. Select a mood on the wheel
2. The app should:
   - Show loading cards
   - Fetch music from Spotify
   - Display track cards with preview buttons
   - Allow playing 30-second previews
   - Show Spotify attribution

### Features Implemented

- **Loading States**: Skeleton cards during fetch
- **Audio Playback**: 30-second preview player
- **Animations**: Smooth transitions and staggered appearance
- **Error Handling**: Graceful error states
- **Empty States**: Clear messaging when no tracks found
- **Spotify Attribution**: Required by Spotify API terms

### Troubleshooting

If tracks aren't loading:
1. Check browser console for errors
2. Verify Spotify credentials in `.env.local`
3. Ensure the selected mood has valid genres
4. Check if tracks have preview URLs (not all do)

## Next Steps
Move on to `10-api-routes.md` to finalize the API struc