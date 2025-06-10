'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import MoodCardSelector from '@/components/MoodCardSelector'
import BackgroundAnimation from '@/components/BackgroundAnimation'
import MusicResults from '@/components/MusicResults'
import ThemeToggle from '@/components/ThemeToggle'
import KeyboardShortcuts from '@/components/KeyboardShortcuts'
import { MoodTransitionLoader } from '@/components/LoadingComponents'
import { MoodSelection } from '@/lib/types'
import { useMusic } from '@/lib/hooks/useMusic'
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts'
import { useIsMobile } from '@/lib/hooks/useTouchGestures'

export default function Home() {
  const [currentMood, setCurrentMood] = useState<MoodSelection | null>(null)
  const [showWheel, setShowWheel] = useState(true)
  const { tracks, isLoading, error, moodDescription, fetchMusicForMood, clearMusic } = useMusic()
  
  const { scrollY } = useScroll()
  const headerOpacity = useTransform(scrollY, [0, 100], [0.95, 1])
  const headerBlur = useTransform(scrollY, [0, 100], [16, 24])
  
  // Mobile detection
  const isMobile = useIsMobile()

  const handleMoodSelect = (mood: MoodSelection) => {
    setCurrentMood(mood)
    setShowWheel(false)
    // Map new mood names to existing CSS classes
    if (typeof window !== 'undefined') {
      const moodClassMap: Record<string, string> = {
        'euphoric': 'mood-happy',
        'melancholic': 'mood-sad', 
        'energetic': 'mood-energetic',
        'serene': 'mood-calm',
        'passionate': 'mood-love',
        'contemplative': 'mood-calm',
        'nostalgic': 'mood-sad',
        'rebellious': 'mood-energetic',
        'mystical': 'mood-calm',
        'triumphant': 'mood-happy',
        'vulnerable': 'mood-sad',
        'adventurous': 'mood-energetic'
      }
      const mappedClass = moodClassMap[mood.primary] || 'mood-happy'
      document.documentElement.className = mappedClass
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

  // Theme toggle functionality for keyboard shortcut
  const toggleTheme = () => {
    if (typeof window !== 'undefined') {
      const currentTheme = localStorage.getItem('theme') || 'auto'
      const themeOrder = ['auto', 'light', 'dark']
      const currentIndex = themeOrder.indexOf(currentTheme)
      const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length]
      
      document.documentElement.setAttribute('data-theme', nextTheme)
      localStorage.setItem('theme', nextTheme)
    }
  }

  // Main page keyboard shortcuts (only for global actions when not in mood selection)
  useKeyboardShortcuts({
    onThemeToggle: toggleTheme,
    onResetMood: resetMood,
    isEnabled: !showWheel // Only enabled when not in mood selection
  })

  return (
    <main className={`min-h-screen relative overflow-hidden ${isMobile ? 'mobile-full-height safe-area-padding' : ''}`}>
      {/* Modern Background System */}
      <div className="modern-bg" />
      <div className={`gradient-overlay ${currentMood ? `mood-${currentMood.primary}` : ''}`} />
      
      {/* Dynamic background animation */}
      <BackgroundAnimation mood={currentMood} />
      
      {/* Main Content Container */}
      <div className="relative z-10">
        {/* Modern Header */}
        <motion.header 
          className={`fixed top-0 left-0 right-0 z-50 ${isMobile ? 'px-4 py-3' : 'px-6 py-4'}`}
          style={{ 
            opacity: headerOpacity,
            backdropFilter: `blur(${headerBlur}px)`
          }}
        >
          <div className="glass-card p-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <motion.div
                className="flex items-center gap-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetMood}
                style={{ cursor: 'pointer' }}
              >
                {/* EPIC Animated Logo Icon */}
                <div className="relative">
                  <motion.div 
                    className="relative w-14 h-14 rounded-2xl logo-gradient-bg logo-animated overflow-hidden"
                    whileHover={{ 
                      rotate: 360,
                      scale: 1.1
                    }}
                    transition={{ 
                      rotate: { duration: 0.6, ease: "easeInOut" },
                      scale: { duration: 0.2 }
                    }}
                  >
                    {/* Outer glow ring */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl blur-md opacity-70 logo-glow" />
                    
                    {/* Inner content */}
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                      {/* Music Icon */}
                      <motion.div
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="drop-shadow-lg">
                          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                          <circle cx="10" cy="17" r="1.5" fill="white"/>
                          <path d="M19 3h2v8h-2z" fill="white"/>
                        </svg>
                      </motion.div>
                    </div>
                    
                    {/* Sparkle particles */}
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full logo-sparkle-1" />
                    <div className="absolute bottom-2 left-2 w-1 h-1 bg-white rounded-full logo-sparkle-2" />
                    <div className="absolute top-3 left-3 w-0.5 h-0.5 bg-white rounded-full logo-sparkle-3" />
                    <div className="absolute bottom-3 right-3 w-1 h-1 bg-white rounded-full logo-sparkle-1" style={{animationDelay: '1s'}} />
                  </motion.div>
                </div>
                
                {/* EPIC Animated Text Logo */}
                <div className="relative">
                  <h1 className="text-title font-black text-gradient-animated text-3xl tracking-tight">
                    MoodMix
                  </h1>
                  
                  {/* Glowing underline */}
                  <motion.div 
                    className="absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full"
                    animate={{ 
                      width: ["0%", "100%", "0%"]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  
                  {/* Text shadow/glow */}
                  <div className="absolute inset-0 text-title font-black text-3xl tracking-tight bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-blue-500/30 bg-clip-text text-transparent blur-sm logo-glow">
                    MoodMix
                  </div>
                </div>
              </motion.div>
              
              <div className="flex items-center gap-4">
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
                {/* Theme Toggle & Keyboard Shortcuts - Always visible */}
                <ThemeToggle />
                <KeyboardShortcuts />
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content Area */}
        <div className={`min-h-screen flex flex-col pb-16 ${
          isMobile 
            ? 'px-0 pt-20' 
            : 'px-6 pt-24'
        } ${showWheel && !currentMood ? (isMobile ? 'justify-start' : 'justify-center pt-32') : ''}`}>
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

                  {/* Enhanced Multi-Layered Floating Elements */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="floating-orb floating-orb-layer-3 w-96 h-96 -top-48 -left-48" style={{background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)'}} />
                    <div className="floating-orb floating-orb-layer-2 w-80 h-80 -bottom-40 -right-40" style={{background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)'}} />
                    <div className="floating-orb floating-orb-layer-1 w-64 h-64 top-1/3 -left-32" style={{background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)'}} />
                    <div className="floating-orb floating-orb-layer-2 w-72 h-72 bottom-1/4 -right-36" style={{background: 'radial-gradient(circle, rgba(34, 197, 94, 0.25) 0%, transparent 70%)'}} />
                    <div className="floating-orb floating-orb-layer-3 w-56 h-56 top-1/4 right-1/4" style={{background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)'}} />
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

      {/* Mood Transition Loading Overlay */}
      <AnimatePresence>
        {isLoading && currentMood && (
          <MoodTransitionLoader mood={currentMood.primary} />
        )}
      </AnimatePresence>
    </main>
  )
}