'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import MoodCardSelector from '@/components/MoodCardSelector'
import BackgroundAnimation from '@/components/BackgroundAnimation'
import MusicResults from '@/components/MusicResults'
import { MoodSelection } from '@/lib/types'
import { useMusic } from '@/lib/hooks/useMusic'

export default function Home() {
  const [currentMood, setCurrentMood] = useState<MoodSelection | null>(null)
  const [showWheel, setShowWheel] = useState(true)
  const { tracks, isLoading, error, moodDescription, fetchMusicForMood, clearMusic } = useMusic()
  
  const { scrollY } = useScroll()
  const headerOpacity = useTransform(scrollY, [0, 100], [0.95, 1])
  const headerBlur = useTransform(scrollY, [0, 100], [16, 24])

  const handleMoodSelect = (mood: MoodSelection) => {
    setCurrentMood(mood)
    setShowWheel(false)
    // Update CSS variables for dynamic theming
    if (typeof window !== 'undefined') {
      document.documentElement.className = `mood-${mood.primary}`
    }
  }

  // Fetch music when mood changes
  useEffect(() => {
    if (currentMood) {
      fetchMusicForMood(currentMood)
    }
  }, [currentMood, fetchMusicForMood])

  const resetMood = () => {
    setCurrentMood(null)
    clearMusic()
    setShowWheel(true)
    if (typeof window !== 'undefined') {
      document.documentElement.className = ''
    }
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Modern Background System */}
      <div className="modern-bg" />
      <div className={`gradient-overlay ${currentMood ? `mood-${currentMood.primary}` : ''}`} />
      
      {/* Dynamic background animation */}
      <BackgroundAnimation mood={currentMood} />
      
      {/* Main Content Container */}
      <div className="relative z-10">
        {/* Modern Header */}
        <motion.header 
          className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
          style={{ 
            opacity: headerOpacity,
            backdropFilter: `blur(${headerBlur}px)`
          }}
        >
          <div className="glass-card p-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <motion.div
                className="flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetMood}
                style={{ cursor: 'pointer' }}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                  <span className="text-sm">🎵</span>
                </div>
                <h1 className="text-title font-bold">MoodMix</h1>
              </motion.div>
              
              {currentMood && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  className="flex items-center gap-4"
                >
                  <div className="text-right">
                    <p className="text-small">Current Mood</p>
                    <p className="text-body font-medium capitalize">{currentMood.primary}</p>
                  </div>
                  <button
                    className="btn-secondary"
                    onClick={resetMood}
                  >
                    Change Mood
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.header>

        {/* Main Content Area */}
        <div className={`min-h-screen flex flex-col px-6 pb-16 ${showWheel && !currentMood ? 'justify-center pt-32' : 'pt-24'}`}>
          <div className="max-w-4xl mx-auto w-full">
            <AnimatePresence mode="wait">
              {/* Mood Selection View */}
              {showWheel && !currentMood && (
                <motion.div
                  key="mood-selection"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    duration: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  className="text-center"
                >
                  {/* Hero Section */}
                  <div className="mb-12 text-center">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.8 }}
                      className="mb-8"
                    >
                      <h1 className="text-display mb-6">
                        How are you feeling?
                      </h1>
                      <p className="text-body max-w-2xl mx-auto">
                        Discover the perfect soundtrack for your emotions. Our AI creates personalized playlists that match your current mood.
                      </p>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="text-caption uppercase tracking-wider"
                    >
                      Select your mood below
                    </motion.div>
                  </div>

                  {/* Modern Mood Card Selector */}
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 0.6,
                      duration: 0.8,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                  >
                    <MoodCardSelector onMoodSelect={handleMoodSelect} />
                  </motion.div>

                  {/* Floating Elements */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="floating-orb w-80 h-80 -top-40 -left-40" />
                    <div className="floating-orb w-60 h-60 -bottom-30 -right-30" />
                  </div>
                </motion.div>
              )}

              {/* Results View */}
              {currentMood && (
                <motion.div
                  key="results-view"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ 
                    duration: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  className="space-y-8"
                >
                  {/* Mood Summary Card */}
                  <motion.div 
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="glass-card inline-block p-6">
                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <div className="text-caption mb-2">Current Mood</div>
                          <div className="text-heading capitalize font-semibold">{currentMood.primary}</div>
                        </div>
                        
                        <div className="w-px h-12 bg-white/10" />
                        
                        <div className="text-center">
                          <div className="text-caption mb-2">Intensity</div>
                          <div className="flex items-center gap-3">
                            <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${currentMood.intensity}%` }}
                                transition={{ duration: 1.5, ease: 'easeOut' }}
                              />
                            </div>
                            <span className="text-body font-semibold">{currentMood.intensity}%</span>
                          </div>
                        </div>

                        <div className="w-px h-12 bg-white/10" />

                        <div className="text-center">
                          <div className="text-caption mb-2">Tracks Found</div>
                          <div className="text-heading font-semibold">{tracks.length}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Error Display */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="flex justify-center"
                      >
                        <div className="card p-6 max-w-md text-center">
                          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                            <span className="text-xl">⚠️</span>
                          </div>
                          <p className="text-body text-red-300 mb-4">{error}</p>
                          <button
                            onClick={() => fetchMusicForMood(currentMood)}
                            className="btn-primary"
                          >
                            Try Again
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Music Results */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <MusicResults 
                      tracks={tracks} 
                      isLoading={isLoading}
                      moodDescription={moodDescription}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Modern Footer */}
        <motion.footer 
          className="relative z-20 px-6 py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="glass-card p-4">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-caption">
                Powered by Spotify • Made for music lovers
              </p>
            </div>
          </div>
        </motion.footer>
      </div>
    </main>
  )
}