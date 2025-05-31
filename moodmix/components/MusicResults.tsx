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
  const [isBuffering, setIsBuffering] = useState(false)
  const [audioProgress, setAudioProgress] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)

  // Handle audio playback with enhanced controls
  const handlePlayPause = async (track: SpotifyTrack) => {
    if (!track.preview_url) return

    if (playingTrackId === track.id) {
      // Pause current track
      audioRef.current?.pause()
      setPlayingTrackId(null)
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
        progressInterval.current = null
      }
    } else {
      try {
        setIsBuffering(true)
        
        // Stop any currently playing track
        if (audioRef.current) {
          audioRef.current.pause()
          if (progressInterval.current) {
            clearInterval(progressInterval.current)
            progressInterval.current = null
          }
        }
        
        // Create new audio instance
        audioRef.current = new Audio(track.preview_url)
        audioRef.current.volume = volume
        audioRef.current.preload = 'auto'
        
        // Audio event listeners
        audioRef.current.addEventListener('loadedmetadata', () => {
          setAudioDuration(audioRef.current?.duration || 0)
          setIsBuffering(false)
        })
        
        audioRef.current.addEventListener('canplay', () => {
          setIsBuffering(false)
        })
        
        audioRef.current.addEventListener('ended', () => {
          setPlayingTrackId(null)
          setAudioProgress(0)
          if (progressInterval.current) {
            clearInterval(progressInterval.current)
            progressInterval.current = null
          }
        })
        
        audioRef.current.addEventListener('error', (error) => {
          console.error('Audio playback error:', error)
          setIsBuffering(false)
          setPlayingTrackId(null)
        })
        
        // Start playback
        await audioRef.current.play()
        setPlayingTrackId(track.id)
        setAudioProgress(0)
        
        // Start progress tracking
        progressInterval.current = setInterval(() => {
          if (audioRef.current && !audioRef.current.paused) {
            setAudioProgress(audioRef.current.currentTime)
          }
        }, 100)
        
      } catch (error) {
        console.error('Error playing audio:', error)
        setIsBuffering(false)
        setPlayingTrackId(null)
      }
    }
  }

  // Volume control
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  // Seek functionality
  const handleSeek = (seekTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime
      setAudioProgress(seekTime)
    }
  }

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      audioRef.current?.pause()
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [])

  // Stop playing when tracks change
  useEffect(() => {
    audioRef.current?.pause()
    setPlayingTrackId(null)
    setAudioProgress(0)
    setIsBuffering(false)
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
      progressInterval.current = null
    }
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
    <div className="w-full max-w-4xl mx-auto space-y-6 relative">
      {/* Modern Header */}
      <AnimatePresence mode="wait">
        {moodDescription && !isLoading && tracks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center"
          >
            <div className="glass-card p-6 mx-auto max-w-2xl">
              <h2 className="text-title mb-4">Your Perfect Soundtrack</h2>
              <p className="text-body mb-4">{moodDescription}</p>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-px bg-white/20" />
                <div className="text-caption">{tracks.length} tracks curated for you</div>
                <div className="w-12 h-px bg-white/20" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Loading State */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <div className="glass-card p-6 mx-auto max-w-md">
                <div className="text-heading mb-4">Discovering Your Music</div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
              </div>
            </div>
            
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="track-card p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="skeleton w-12 h-12 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-3/4 rounded" />
                    <div className="skeleton h-3 w-1/2 rounded" />
                    <div className="skeleton h-3 w-1/4 rounded" />
                  </div>
                  <div className="skeleton w-10 h-10 rounded-full" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Results Grid */}
      <AnimatePresence mode="wait">
        {!isLoading && tracks.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-3"
          >
            {tracks.map((track, index) => (
              <motion.div 
                key={track.id} 
                variants={itemVariants}
                className="relative group"
                style={{ zIndex: tracks.length - index }}
              >
                <ModernMusicCard
                  track={track}
                  isPlaying={playingTrackId === track.id}
                  isBuffering={isBuffering && playingTrackId === track.id}
                  audioProgress={playingTrackId === track.id ? audioProgress : 0}
                  audioDuration={playingTrackId === track.id ? audioDuration : 0}
                  onPlay={() => handlePlayPause(track)}
                  onSeek={handleSeek}
                  index={index}
                />
              </motion.div>
            ))}

            {/* Modern Spotify Attribution */}
            <motion.div 
              variants={itemVariants}
              className="mt-8 text-center"
            >
              <div className="glass-card inline-flex items-center gap-3 px-6 py-3">
                <SpotifyLogo className="w-5 h-5 text-green-400" />
                <div className="text-center">
                  <div className="text-caption mb-1">Powered by</div>
                  <div className="text-body font-semibold">Spotify</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Empty State */}
      <AnimatePresence>
        {!isLoading && tracks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center py-12"
          >
            <div className="glass-card p-8 mx-auto max-w-md">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-6xl mb-6 opacity-60"
              >
                🎵
              </motion.div>
              <h3 className="text-title mb-4">No Tracks Found</h3>
              <p className="text-body mb-4">
                We couldn&apos;t find music matching your current mood selection
              </p>
              <div className="text-caption">
                Try selecting a different mood
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Audio Control Panel */}
      <AnimatePresence>
        {playingTrackId && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="glass-card p-4 flex items-center gap-4 min-w-[300px] max-w-[500px]">
              {/* Currently Playing Track Info */}
              {(() => {
                const currentTrack = tracks.find(t => t.id === playingTrackId)
                return currentTrack ? (
                  <>
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      {currentTrack.album?.images?.[0] ? (
                        <img
                          src={currentTrack.album.images[0].url}
                          alt={currentTrack.album.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <span className="text-lg">🎵</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">
                        {currentTrack.name}
                      </div>
                      <div className="text-xs text-white/60 truncate">
                        {currentTrack.artists?.map(artist => artist.name).join(', ')}
                      </div>
                    </div>
                    
                    {/* Global Volume Control */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/60">🔊</span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="w-16 h-1 bg-white/20 rounded-full appearance-none cursor-pointer
                                   [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                                   [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-400"
                      />
                      <span className="text-xs text-white/60 w-6">{Math.round(volume * 100)}</span>
                    </div>
                    
                    {/* Close Button */}
                    <motion.button
                      onClick={() => {
                        audioRef.current?.pause()
                        setPlayingTrackId(null)
                        if (progressInterval.current) {
                          clearInterval(progressInterval.current)
                          progressInterval.current = null
                        }
                      }}
                      className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <span className="text-xs">×</span>
                    </motion.button>
                  </>
                ) : null
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Modern Music Card Component
function ModernMusicCard({ 
  track, 
  isPlaying, 
  isBuffering,
  audioProgress,
  audioDuration,
  onPlay, 
  onSeek,
  index 
}: { 
  track: SpotifyTrack
  isPlaying: boolean
  isBuffering: boolean
  audioProgress: number
  audioDuration: number
  onPlay: () => void
  onSeek: (time: number) => void
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
      className={`track-card group relative overflow-hidden transition-all duration-300 ${
        isPlaying ? 'ring-2 ring-purple-400/50 bg-purple-500/5' : ''
      }`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Track Number */}
        <div className="w-6 text-caption text-center font-mono opacity-60">
          {index + 1}
        </div>
        
        {/* Album Art */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-lg overflow-hidden album-art">
            {album.images?.[0] ? (
              <img
                src={album.images[0].url}
                alt={album.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <span className="text-lg opacity-50">🎵</span>
              </div>
            )}
          </div>
          
          {/* Now Playing Indicator */}
          {isPlaying && (
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </motion.div>
          )}
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-body font-semibold mb-1 truncate">
            {track.name}
          </h3>
          
          <p className="text-caption truncate mb-1">
            {artists.map(artist => artist.name).join(', ')}
          </p>
          
          <p className="text-small truncate opacity-60">
            {album.name}
          </p>
        </div>

        {/* Track Duration */}
        <div className="text-caption font-mono opacity-60">
          {Math.floor(track.duration_ms / 60000)}:{String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
        </div>

        {/* Audio Controls */}
        <div className="flex items-center gap-2">
          {/* Play/Pause Button */}
          <motion.button
            onClick={onPlay}
            disabled={!hasPreview || isBuffering}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 relative ${
              hasPreview 
                ? 'bg-purple-500 hover:bg-purple-400 cursor-pointer' 
                : 'bg-gray-600 opacity-50 cursor-not-allowed'
            }`}
            whileHover={hasPreview && !isBuffering ? { scale: 1.05 } : {}}
            whileTap={hasPreview && !isBuffering ? { scale: 0.95 } : {}}
            title={hasPreview ? (isPlaying ? 'Pause preview' : 'Play preview') : 'No preview available'}
          >
            {isBuffering ? (
              <motion.div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : hasPreview ? (
              <>
                {isPlaying ? (
                  <div className="flex gap-0.5">
                    <div className="w-1 h-3 bg-white rounded-full" />
                    <div className="w-1 h-3 bg-white rounded-full" />
                  </div>
                ) : (
                  <div className="w-0 h-0 border-l-[6px] border-l-white border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5" />
                )}
              </>
            ) : (
              <span className="text-xs">—</span>
            )}
          </motion.button>

          {/* Progress Bar & Time (only show when playing/has played) */}
          {isPlaying && audioDuration > 0 && (
            <div className="flex items-center gap-2 min-w-[120px]">
              {/* Current Time */}
              <span className="text-xs font-mono text-white/60 w-8">
                {Math.floor(audioProgress / 60)}:{String(Math.floor(audioProgress % 60)).padStart(2, '0')}
              </span>
              
              {/* Progress Bar */}
              <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer group"
                   onClick={(e) => {
                     const rect = e.currentTarget.getBoundingClientRect()
                     const x = e.clientX - rect.left
                     const percentage = x / rect.width
                     const seekTime = percentage * audioDuration
                     onSeek(seekTime)
                   }}
              >
                <motion.div
                  className="h-full bg-purple-400 rounded-full relative"
                  style={{ width: `${(audioProgress / audioDuration) * 100}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(audioProgress / audioDuration) * 100}%` }}
                  transition={{ duration: 0.1 }}
                >
                  {/* Progress dot */}
                  <div className="absolute right-0 top-1/2 w-2 h-2 bg-white rounded-full transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              </div>
              
              {/* Total Duration */}
              <span className="text-xs font-mono text-white/60 w-8">
                {Math.floor(audioDuration / 60)}:{String(Math.floor(audioDuration % 60)).padStart(2, '0')}
              </span>
            </div>
          )}
        </div>

        {/* External Link */}
        <motion.a
          href={externalUrls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 rounded-full flex items-center justify-center text-green-400 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-green-400/10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <SpotifyLogo className="w-4 h-4" />
        </motion.a>
      </div>
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