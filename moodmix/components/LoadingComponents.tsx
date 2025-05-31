'use client'

import { motion } from 'framer-motion'

// Page-wide loading screen for initial app load
export function AppLoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-primary)]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-6">
        {/* Animated Logo */}
        <motion.div
          className="relative w-20 h-20 mx-auto"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 opacity-80" />
          <div className="absolute inset-2 rounded-xl bg-[var(--bg-primary)] flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white" className="drop-shadow-lg">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              <circle cx="10" cy="17" r="1.5" fill="white"/>
              <path d="M19 3h2v8h-2z" fill="white"/>
            </svg>
          </div>
        </motion.div>

        {/* Loading text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">MoodMix</h2>
          <p className="text-sm text-[var(--text-secondary)]">Loading your musical journey...</p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="w-32 h-1 bg-white/20 rounded-full mx-auto overflow-hidden"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

// Mood transition loading overlay
export function MoodTransitionLoader({ mood }: { mood?: string }) {
  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="glass-card p-8 text-center max-w-sm mx-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Mood-specific animation */}
        <motion.div
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <div className="w-8 h-8 rounded-full bg-white/20" />
        </motion.div>

        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
          {mood ? `Curating ${mood} vibes...` : 'Discovering music...'}
        </h3>
        <p className="text-sm text-[var(--text-secondary)]">
          Finding the perfect tracks for your mood
        </p>

        {/* Animated dots */}
        <div className="flex justify-center gap-1 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-purple-500 rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                delay: i * 0.2 
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

// Enhanced skeleton components for different use cases
export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`skeleton animate-pulse ${className}`}>
      <div className="space-y-3 p-4">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="flex gap-2">
          <div className="skeleton h-3 w-16 rounded" />
          <div className="skeleton h-3 w-12 rounded" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonMoodGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="skeleton h-40 rounded-2xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
        >
          <div className="p-6 h-full flex flex-col justify-between">
            <div className="skeleton w-12 h-12 rounded-xl" />
            <div className="space-y-2">
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-3 w-full rounded" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Search/input loading state
export function SearchLoading() {
  return (
    <motion.div
      className="flex items-center gap-3 p-4 glass-card rounded-lg"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div className="skeleton w-6 h-6 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-1/3 rounded" />
        <div className="skeleton h-3 w-full rounded" />
      </div>
      <div className="skeleton w-8 h-8 rounded-full" />
    </motion.div>
  )
}

// Theme transition loading
export function ThemeTransitionLoader() {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-[var(--bg-primary)] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  )
}