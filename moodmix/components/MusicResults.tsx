'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SpotifyTrack } from '@/lib/types'

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
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Premium Header */}
      <AnimatePresence mode="wait">
        {moodDescription && !isLoading && tracks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center"
          >
            <div className="glass-premium p-8 mx-auto max-w-2xl">
              <h2 className="text-premium-lg mb-4">Your Perfect Soundtrack</h2>
              <p className="text-premium-md opacity-80">{moodDescription}</p>
              <div className="mt-6 flex items-center justify-center gap-4">
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                <div className="text-premium-sm opacity-60">{tracks.length} tracks curated for you</div>
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Loading State */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="text-center mb-8">
              <div className="glass-premium p-6 mx-auto max-w-md">
                <div className="text-premium-md mb-4">Discovering Your Music</div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
              </div>
            </div>
            
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="track-card-premium p-6"
              >
                <div className="flex items-center gap-6">
                  <div className="skeleton-premium w-16 h-16 rounded-xl" />
                  <div className="flex-1 space-y-3">
                    <div className="skeleton-premium h-5 w-3/4 rounded-lg" />
                    <div className="skeleton-premium h-4 w-1/2 rounded-lg" />
                    <div className="skeleton-premium h-3 w-1/4 rounded-lg" />
                  </div>
                  <div className="skeleton-premium w-12 h-12 rounded-full" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Results Grid */}
      <AnimatePresence mode="wait">
        {!isLoading && tracks.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-4"
          >
            {tracks.map((track, index) => (
              <motion.div 
                key={track.id} 
                variants={itemVariants}
                className="relative group"
                style={{ zIndex: tracks.length - index }}
              >
                <PremiumMusicCard
                  track={track}
                  isPlaying={playingTrackId === track.id}
                  onPlay={() => handlePlayPause(track)}
                  index={index}
                />
              </motion.div>
            ))}

            {/* Premium Spotify Attribution */}
            <motion.div 
              variants={itemVariants}
              className="mt-12 text-center"
            >
              <div className="glass-premium inline-flex items-center gap-3 px-8 py-4">
                <SpotifyLogo className="w-6 h-6 text-green-400" />
                <div className="text-center">
                  <div className="text-premium-sm opacity-60 uppercase tracking-wider mb-1">Powered by</div>
                  <div className="text-premium-md font-bold">Spotify</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Empty State */}
      <AnimatePresence>
        {!isLoading && tracks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center py-16"
          >
            <div className="glass-ultra p-12 mx-auto max-w-md">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-8xl mb-6 opacity-60"
              >
                🎵
              </motion.div>
              <h3 className="text-premium-lg mb-4">No Tracks Found</h3>
              <p className="text-premium-md opacity-70 mb-6">
                We couldn&apos;t find music matching your current mood selection
              </p>
              <div className="text-premium-sm opacity-50">
                Try selecting a different mood or adjusting the intensity level
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Premium Music Card Component
function PremiumMusicCard({ 
  track, 
  isPlaying, 
  onPlay, 
  index 
}: { 
  track: SpotifyTrack
  isPlaying: boolean
  onPlay: () => void
  index: number
}) {
  // Defensive checks
  if (!track) return null
  
  const hasPreview = !!track.preview_url
  const artists = track.artists || []
  const album = track.album || { name: 'Unknown Album', images: [] }
  const externalUrls = track.external_urls || { spotify: '' }
  
  return (
    <motion.div
      className="track-card-premium group relative overflow-hidden"
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Track Number Badge */}
      <div className="absolute -left-2 top-6 w-8 h-8 rounded-full glass-premium flex items-center justify-center text-premium-sm font-bold opacity-60 group-hover:opacity-100 transition-opacity">
        {index + 1}
      </div>
      
      <div className="flex items-center gap-6 p-6 pl-12">
        {/* Album Art with Enhanced Effects */}
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-xl overflow-hidden album-art shadow-2xl">
            {album.images?.[0] ? (
              <motion.img
                src={album.images[0].url}
                alt={album.name}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4 }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                <span className="text-3xl opacity-50">🎵</span>
              </div>
            )}
          </div>
          
          {/* Now Playing Indicator */}
          {isPlaying && (
            <motion.div
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <div className="w-2 h-2 bg-white rounded-full" />
            </motion.div>
          )}
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <motion.h3 
            className="text-premium-md font-bold mb-2 truncate group-hover:text-white transition-colors"
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            {track.name}
          </motion.h3>
          
          <motion.p 
            className="text-premium-sm opacity-70 mb-2 truncate"
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            {artists.map(artist => artist.name).join(', ')}
          </motion.p>
          
          <motion.p 
            className="text-premium-sm opacity-50 truncate"
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2, delay: 0.2 }}
          >
            {album.name}
          </motion.p>
        </div>

        {/* Track Duration */}
        <div className="text-premium-sm opacity-50 font-mono">
          {Math.floor(track.duration_ms / 60000)}:{String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
        </div>

        {/* Play Button */}
        <motion.button
          onClick={onPlay}
          disabled={!hasPreview}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
            hasPreview 
              ? 'glass-interactive cursor-pointer' 
              : 'glass opacity-30 cursor-not-allowed'
          }`}
          whileHover={hasPreview ? { scale: 1.1 } : {}}
          whileTap={hasPreview ? { scale: 0.95 } : {}}
        >
          {hasPreview ? (
            <>
              {isPlaying ? (
                <motion.div
                  className="flex gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-1 h-4 bg-white rounded-full animate-pulse" />
                  <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                </motion.div>
              ) : (
                <motion.div
                  className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </>
          ) : (
            <div className="text-premium-sm opacity-50">No Preview</div>
          )}
        </motion.button>

        {/* External Link */}
        <motion.a
          href={externalUrls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-interactive w-12 h-12 rounded-full flex items-center justify-center text-green-400 opacity-0 group-hover:opacity-100 transition-all duration-300"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <SpotifyLogo className="w-5 h-5" />
        </motion.a>
      </div>

      {/* Bottom Accent Line */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400"
        initial={{ width: 0 }}
        whileHover={{ width: '100%' }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
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