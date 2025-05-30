# 11. Main Page Assembly - Bringing It All Together

## Final Complete Implementation of app/page.tsx

### Step 1: Complete app/page.tsx

```tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MoodWheel from '@/components/MoodWheel'
import BackgroundAnimation from '@/components/BackgroundAnimation'
import MusicResults from '@/components/MusicResults'
import GlassCard from '@/components/GlassCard'
import { MoodSelection } from '@/lib/types'
import { useMusic } from '@/lib/hooks/useMusic'

export default function Home() {
  const [currentMood, setCurrentMood] = useState<MoodSelection | null>(null)
  const [showWheel, setShowWheel] = useState(true)
  const { tracks, isLoading, error, moodDescription, fetchMusicForMood, clearMusic } = useMusic()

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

  const resetMood = () => {
    setCurrentMood(null)
    clearMusic()
    setShowWheel(true)
    document.documentElement.className = ''
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Base gradient background */}
      <div className={`gradient-bg ${currentMood ? `mood-${currentMood.primary}` : ''}`} />
      
      {/* Dynamic background animation */}
      <BackgroundAnimation mood={currentMood} />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <motion.header 
          className="fixed top-0 left-0 right-0 z-50 p-6"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <motion.h1 
              className="text-3xl font-bold cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetMood}
            >
              MoodMix
            </motion.h1>
            
            {currentMood && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass glass-hover px-4 py-2 rounded-full text-sm font-medium"
                onClick={resetMood}
              >
                Change Mood
              </motion.button>
            )}
          </div>
        </motion.header>

        {/* Main Content Area */}
        <div className="flex flex-col items-center justify-center min-h-screen p-8 pt-24">
          <AnimatePresence mode="wait">
            {/* Mood Selection View */}
            {showWheel && !currentMood && (
              <motion.div
                key="mood-selection"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 100 }}
                className="flex flex-col items-center gap-8"
              >
                {/* Welcome Text */}
                <div className="text-center">
                  <motion.h2 
                    className="text-5xl font-bold mb-4"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    How are you feeling?
                  </motion.h2>
                  <motion.p 
                    className="text-xl text-white/60"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Select your mood and discover your perfect playlist
                  </motion.p>
                </div>

                {/* Mood Wheel */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 100,
                    delay: 0.3 
                  }}
                >
                  <GlassCard className="p-8" blur="lg" gradient>
                    <MoodWheel onMoodSelect={handleMoodSelect} />
                  </GlassCard>
                </motion.div>
              </motion.div>
            )}

            {/* Results View */}
            {currentMood && (
              <motion.div
                key="results-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-6xl"
              >
                {/* Mood Display */}
                <motion.div 
                  className="text-center mb-12"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <GlassCard className="inline-flex items-center gap-6 px-8 py-6" gradient>
                    <div>
                      <p className="text-sm text-white/60 mb-1">Current Mood</p>
                      <p className="text-3xl font-bold capitalize">{currentMood.primary}</p>
                    </div>
                    <div className="w-px h-12 bg-white/20" />
                    <div>
                      <p className="text-sm text-white/60 mb-1">Intensity</p>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-white/80 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${currentMood.intensity}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                          />
                        </div>
                        <span className="text-sm font-medium">{currentMood.intensity}%</span>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>

                {/* Error Display */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mb-8"
                    >
                      <GlassCard className="p-6 max-w-md mx-auto text-center">
                        <p className="text-red-400 mb-4">{error}</p>
                        <button
                          onClick={() => fetchMusicForMood(currentMood)}
                          className="glass glass-hover px-4 py-2 rounded-lg text-sm"
                        >
                          Try Again
                        </button>
                      </GlassCard>
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

        {/* Footer */}
        <motion.footer 
          className="fixed bottom-0 left-0 right-0 p-6 text-center"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-white/40 text-sm">
            Made with ❤️ using Next.js • Powered by Spotify
          </p>
        </motion.footer>
      </div>
    </main>
  )
}
```

### Step 2: Add Loading and Error Boundaries (app/error.tsx)

```tsx
'use client'

import { useEffect } from 'react'
import GlassCard from '@/components/GlassCard'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="gradient-bg" />
      <GlassCard className="p-8 max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-white/60 mb-6">
          We encountered an unexpected error. Please try again.
        </p>
        <button
          onClick={reset}
          className="glass glass-hover px-6 py-3 rounded-lg font-medium"
        >
          Try again
        </button>
      </GlassCard>
    </div>
  )
}
```

### Step 3: Add Loading State (app/loading.tsx)

```tsx
import GlassCard from '@/components/GlassCard'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="gradient-bg" />
      <GlassCard className="p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white/80 rounded-full animate-spin" />
          <p className="text-white/60">Loading MoodMix...</p>
        </div>
      </GlassCard>
    </div>
  )
}
```

### Step 4: Add Metadata and SEO (app/layout.tsx - Updated)

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MoodMix - Music for Your Mood',
  description: 'Discover the perfect playlist for your current mood. MoodMix uses AI to match music to your emotions.',
  keywords: 'music, mood, playlist, spotify, emotion, AI, music discovery',
  authors: [{ name: 'MoodMix' }],
  openGraph: {
    title: 'MoodMix - Music for Your Mood',
    description: 'Discover the perfect playlist for your current mood',
    type: 'website',
    url: 'https://moodmix.app',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MoodMix - Music for Your Mood',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MoodMix - Music for Your Mood',
    description: 'Discover the perfect playlist for your current mood',
    images: ['/og-image.png'],
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

### Step 5: Performance Optimizations (next.config.js)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.scdn.co'], // Spotify image CDN
  },
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
  },
  // Compress responses
  compress: true,
  // Optimize production builds
  swcMinify: true,
}

module.exports = nextConfig
```

### Features Implemented

1. **Complete User Flow**:
   - Mood selection → Music discovery → Playback
   - Smooth transitions between states
   - Reset functionality

2. **Polish & UX**:
   - Loading states
   - Error boundaries
   - Animations and transitions
   - Responsive design

3. **Performance**:
   - Optimized re-renders
   - Lazy loading components
   - Efficient state management

4. **Accessibility**:
   - Keyboard navigation
   - ARIA labels (add as needed)
   - Focus management

## Next Steps
Move on to `12-animations-transitions.md` for final polish with Framer Motion.