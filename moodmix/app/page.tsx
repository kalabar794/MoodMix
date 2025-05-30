'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import MoodWheel from '@/components/MoodWheel'
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
      {/* Premium Background System */}
      <div className="background-premium" />
      <div className={`gradient-mesh-overlay ${currentMood ? `mood-${currentMood.primary}` : ''}`} />
      
      {/* Dynamic background animation */}
      <BackgroundAnimation mood={currentMood} />
      
      {/* Main Content Container */}
      <div className="relative z-10">
        {/* Premium Header */}
        <motion.header 
          className="fixed top-0 left-0 right-0 z-50 px-8 py-6"
          style={{ 
            opacity: headerOpacity,
            backdropFilter: `blur(${headerBlur}px)`
          }}
        >
          <div className="glass-premium p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <motion.div
                className="flex items-center gap-4"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetMood}
                style={{ cursor: 'pointer' }}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
                  <span className="text-xl">🎵</span>
                </div>
                <h1 className="text-premium-lg">MoodMix</h1>
              </motion.div>
              
              {currentMood && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  className="flex items-center gap-4"
                >
                  <div className="text-right">
                    <p className="text-premium-sm opacity-60">Current Mood</p>
                    <p className="text-premium-md capitalize">{currentMood.primary}</p>
                  </div>
                  <motion.button
                    className="glass-interactive px-6 py-3 rounded-2xl text-premium-sm font-medium"
                    onClick={resetMood}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Change Mood
                  </motion.button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.header>

        {/* Main Content Area */}
        <div className="min-h-screen flex flex-col justify-center px-8 pt-32 pb-16">
          <div className="max-w-7xl mx-auto w-full">
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
                  <div className="mb-16">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.8 }}
                      className="mb-8"
                    >
                      <h1 className="text-premium-xl mb-6">
                        How are you feeling?
                      </h1>
                      <p className="text-premium-lg opacity-70 max-w-2xl mx-auto">
                        Discover the perfect soundtrack for your emotions. Our AI-powered mood analysis creates personalized playlists that resonate with your current state of mind.
                      </p>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="text-premium-sm opacity-50 uppercase tracking-wider"
                    >
                      Select your mood below
                    </motion.div>
                  </div>

                  {/* Premium Mood Wheel Container */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      delay: 0.6,
                      duration: 1,
                      ease: [0.34, 1.56, 0.64, 1]
                    }}
                    className="flex justify-center"
                  >
                    <div className="glass-ultra p-12">
                      <MoodWheel onMoodSelect={handleMoodSelect} />
                    </div>
                  </motion.div>

                  {/* Floating Elements */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="floating-orb-premium w-96 h-96 -top-48 -left-48" />
                    <div className="floating-orb-premium w-64 h-64 -bottom-32 -right-32" />
                    <div className="floating-orb-premium w-80 h-80 top-1/4 -right-40" />
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
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="glass-premium inline-block p-8">
                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <div className="text-premium-sm opacity-60 mb-2">Current Mood</div>
                          <div className="text-premium-lg capitalize font-bold">{currentMood.primary}</div>
                        </div>
                        
                        <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                        
                        <div className="text-center">
                          <div className="text-premium-sm opacity-60 mb-2">Intensity</div>
                          <div className="flex items-center gap-4">
                            <div className="w-40 h-3 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-white/60 to-white/80 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${currentMood.intensity}%` }}
                                transition={{ duration: 1.5, ease: 'easeOut' }}
                              />
                            </div>
                            <span className="text-premium-md font-bold">{currentMood.intensity}%</span>
                          </div>
                        </div>

                        <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

                        <div className="text-center">
                          <div className="text-premium-sm opacity-60 mb-2">Tracks Found</div>
                          <div className="text-premium-lg font-bold">{tracks.length}</div>
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
                        <div className="card-premium p-8 max-w-md text-center">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                            <span className="text-2xl">⚠️</span>
                          </div>
                          <p className="text-premium-md text-red-300 mb-6">{error}</p>
                          <motion.button
                            onClick={() => fetchMusicForMood(currentMood)}
                            className="glass-interactive px-6 py-3 rounded-2xl text-premium-sm font-medium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Try Again
                          </motion.button>
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

        {/* Premium Footer */}
        <motion.footer 
          className="relative z-20 px-8 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="glass-premium p-4">
            <div className="max-w-7xl mx-auto text-center">
              <p className="text-premium-sm opacity-40">
                Crafted with precision • Powered by Spotify • Made for music lovers
              </p>
            </div>
          </div>
        </motion.footer>
      </div>
    </main>
  )
}