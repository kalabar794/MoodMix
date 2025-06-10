'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { YouTubeVideoResult } from '@/lib/youtube-integration'

interface YouTubePlayerProps {
  video: YouTubeVideoResult | null
  isVisible: boolean
  onClose: () => void
  onPlay: () => void
  autoplay?: boolean
}

export default function YouTubePlayer({ 
  video, 
  isVisible, 
  onClose, 
  onPlay,
  autoplay = false 
}: YouTubePlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [, setIsPlaying] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (isVisible && autoplay) {
      setIsPlaying(true)
      onPlay()
    }
  }, [isVisible, autoplay, onPlay])

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  if (!video) return null

  // Check if this is a fallback search video (no embedUrl)
  const isSearchFallback = !video.embedUrl || video.embedUrl === ''
  // Enhanced embed URL with better parameters for reliable playback
  const embedUrl = isSearchFallback ? '' : (() => {
    const baseUrl = video.embedUrl || `https://www.youtube-nocookie.com/embed/${video.id}`
    const url = new URL(baseUrl)
    
    // Add reliable parameters
    url.searchParams.set('autoplay', autoplay ? '1' : '0')
    url.searchParams.set('rel', '0')
    url.searchParams.set('modestbranding', '1')
    url.searchParams.set('playsinline', '1')
    url.searchParams.set('enablejsapi', '1')
    url.searchParams.set('origin', typeof window !== 'undefined' ? window.location.origin : '')
    
    return url.toString()
  })()

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.8) 50%, rgba(0, 0, 0, 0.75) 100%)',
            backdropFilter: 'blur(32px) saturate(150%) brightness(0.8)',
            WebkitBackdropFilter: 'blur(32px) saturate(150%) brightness(0.8)'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.95) 0%, rgba(10, 10, 20, 0.98) 100%)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: `
                0 20px 80px rgba(0, 0, 0, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.2),
                inset 0 -1px 0 rgba(255, 255, 255, 0.1),
                0 0 0 1px rgba(255, 255, 255, 0.1)
              `
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b" style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold truncate">
                  {video.title}
                </h3>
                <p className="text-gray-400 text-sm truncate">
                  {video.channelTitle} • {video.duration} • {video.viewCount ? `${parseInt(video.viewCount).toLocaleString()} views` : ''}
                </p>
              </div>
              
              {/* Close Button */}
              <motion.button
                onClick={onClose}
                className="ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-white text-lg">×</span>
              </motion.button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video bg-black">
              {isSearchFallback ? (
                // Show search interface when no embed is available
                <div className="absolute inset-0 flex items-center justify-center text-center p-8">
                  <div>
                    <div className="text-6xl mb-6">🔍</div>
                    <h3 className="text-white text-lg font-semibold mb-2">
                      Search YouTube
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Find the official music video for this track
                    </p>
                    <motion.button
                      onClick={() => window.open(video.watchUrl, '_blank')}
                      className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-lg transition-colors font-semibold text-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Search on YouTube
                    </motion.button>
                  </div>
                </div>
              ) : (
                <>
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                  )}

                  {hasError && (
                    <div className="absolute inset-0 flex items-center justify-center text-center p-8">
                      <div>
                        <div className="text-4xl mb-4">⚠️</div>
                        <h3 className="text-white text-lg font-semibold mb-2">
                          Video Unavailable
                        </h3>
                        <p className="text-gray-400 mb-4">
                          This video cannot be played in embedded mode.
                        </p>
                        <motion.button
                          onClick={() => window.open(video.watchUrl, '_blank')}
                          className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Watch on YouTube
                        </motion.button>
                      </div>
                    </div>
                  )}

                  {!hasError && embedUrl && (
                    <iframe
                      ref={iframeRef}
                      src={embedUrl}
                      title={video.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                      allowFullScreen
                      onLoad={handleIframeLoad}
                      onError={handleIframeError}
                    />
                  )}
                </>
              )}
            </div>

            {/* Controls Footer */}
            <div className="p-4 border-t" style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderTop: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={() => window.open(video.watchUrl, '_blank')}
                    className="flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      border: '1px solid rgba(220, 38, 38, 0.3)',
                      boxShadow: '0 4px 16px rgba(220, 38, 38, 0.3)'
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    Watch Full Screen
                  </motion.button>

                  <motion.button
                    onClick={() => {
                      navigator.share?.({
                        title: video.title,
                        url: video.watchUrl
                      }).catch(() => {
                        navigator.clipboard?.writeText(video.watchUrl)
                      })
                    }}
                    className="flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                      <polyline points="16,6 12,2 8,6"/>
                      <line x1="12" y1="2" x2="12" y2="15"/>
                    </svg>
                    Share
                  </motion.button>
                </div>

                <div className="text-gray-400 text-sm">
                  Press ESC to close
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Compact YouTube Player Button Component
interface YouTubeButtonProps {
  video: YouTubeVideoResult | null
  isLoading: boolean
  onPlay: () => void
  disabled?: boolean
}

export function YouTubeButton({ video, isLoading, onPlay, disabled = false }: YouTubeButtonProps) {
  if (isLoading) {
    return (
      <motion.button
        disabled
        className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center"
      >
        <motion.div
          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </motion.button>
    )
  }

  if (!video || disabled) {
    return null // Hide button when no video available
  }

  return (
    <motion.button
      onClick={onPlay}
      className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={`Watch "${video.title}" on YouTube`}
    >
      <svg className="w-4 h-4 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z"/>
      </svg>
    </motion.button>
  )
}