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
  const embedUrl = isSearchFallback ? '' : `${video.embedUrl}&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700">
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
                className="ml-4 w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
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
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      onLoad={handleIframeLoad}
                      onError={handleIframeError}
                    />
                  )}
                </>
              )}
            </div>

            {/* Controls Footer */}
            <div className="p-4 bg-gray-900 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={() => window.open(video.watchUrl, '_blank')}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors"
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
                    className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
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
    return (
      <motion.button
        disabled
        className="w-10 h-10 rounded-full bg-gray-600 opacity-50 flex items-center justify-center cursor-not-allowed"
        title="Video unavailable"
      >
        <span className="text-white text-xs">—</span>
      </motion.button>
    )
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