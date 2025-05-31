'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MoodSelection } from '@/lib/types'

interface BackgroundAnimationProps {
  mood: MoodSelection | null
}

// Modern CSS-based mood themes following web best practices
const MOOD_THEMES = {
  // Legacy mood names (for backward compatibility)
  happy: {
    primary: '#fbbf24', // amber-400
    secondary: '#f59e0b', // amber-500
    accent: '#fef3c7' // amber-100
  },
  excited: {
    primary: '#fb7185', // rose-400
    secondary: '#f43f5e', // rose-500
    accent: '#fecdd3' // rose-100
  },
  energetic: {
    primary: '#ef4444', // red-500
    secondary: '#dc2626', // red-600
    accent: '#fecaca' // red-200
  },
  love: {
    primary: '#ec4899', // pink-500
    secondary: '#db2777', // pink-600
    accent: '#fbcfe8' // pink-200
  },
  sad: {
    primary: '#3b82f6', // blue-500
    secondary: '#2563eb', // blue-600
    accent: '#dbeafe' // blue-200
  },
  calm: {
    primary: '#06b6d4', // cyan-500
    secondary: '#0891b2', // cyan-600
    accent: '#cffafe' // cyan-200
  },
  // New sophisticated mood names
  euphoric: {
    primary: '#fbbf24', // amber-400
    secondary: '#f59e0b', // amber-500
    accent: '#fef3c7' // amber-100
  },
  melancholic: {
    primary: '#64b5f6', // blue-400
    secondary: '#42a5f5', // blue-500
    accent: '#e3f2fd' // blue-50
  },
  serene: {
    primary: '#14b8a6', // teal-500
    secondary: '#0d9488', // teal-600
    accent: '#ccfbf1' // teal-100
  },
  passionate: {
    primary: '#ec4899', // pink-500
    secondary: '#db2777', // pink-600
    accent: '#fbcfe8' // pink-200
  },
  contemplative: {
    primary: '#8b5cf6', // violet-500
    secondary: '#7c3aed', // violet-600
    accent: '#ede9fe' // violet-100
  },
  nostalgic: {
    primary: '#d97706', // amber-600
    secondary: '#b45309', // amber-700
    accent: '#fed7aa' // orange-200
  },
  rebellious: {
    primary: '#dc2626', // red-600
    secondary: '#b91c1c', // red-700
    accent: '#fecaca' // red-200
  },
  mystical: {
    primary: '#a855f7', // purple-500
    secondary: '#9333ea', // purple-600
    accent: '#f3e8ff' // purple-100
  },
  triumphant: {
    primary: '#f59e0b', // amber-500
    secondary: '#d97706', // amber-600
    accent: '#fef3c7' // amber-100
  },
  vulnerable: {
    primary: '#94a3b8', // slate-400
    secondary: '#64748b', // slate-500
    accent: '#f1f5f9' // slate-100
  },
  adventurous: {
    primary: '#10b981', // emerald-500
    secondary: '#059669', // emerald-600
    accent: '#d1fae5' // emerald-100
  }
}

export default function BackgroundAnimation({ mood }: BackgroundAnimationProps) {

  const currentTheme = mood ? MOOD_THEMES[mood.primary as keyof typeof MOOD_THEMES] : null

  return (
    <>
      {/* Base background layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Animated mesh gradient background */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(circle at 20% 50%, ${currentTheme?.primary || '#6366f1'}20 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, ${currentTheme?.secondary || '#8b5cf6'}20 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, ${currentTheme?.accent || '#ec4899'}30 0%, transparent 50%),
              linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.9) 100%)
            `
          }}
        />
      </div>

      {/* Respect user motion preferences */}
      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          .animate-float,
          .animate-breathe,
          .animate-drift {
            animation: none !important;
          }
        }
      `}</style>

      {/* Modern CSS-only animations */}
      <AnimatePresence mode="wait">
        {mood && currentTheme && (
          <>
            {/* Morphing blob shapes */}
            <motion.div
              key={`blob1-${mood.primary}`}
              className="fixed pointer-events-none animate-float"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.4, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 2, ease: "easeOut" }}
              style={{
                width: '400px',
                height: '400px',
                left: '10%',
                top: '20%',
                background: `linear-gradient(45deg, ${currentTheme.primary}30, ${currentTheme.secondary}20)`,
                borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                filter: 'blur(40px)',
                animation: 'float 20s ease-in-out infinite, morph 15s ease-in-out infinite'
              }}
            />

            <motion.div
              key={`blob2-${mood.primary}`}
              className="fixed pointer-events-none animate-drift"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.3, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 2.5, ease: "easeOut", delay: 0.5 }}
              style={{
                width: '300px',
                height: '300px',
                right: '15%',
                bottom: '25%',
                background: `linear-gradient(135deg, ${currentTheme.secondary}25, ${currentTheme.accent}15)`,
                borderRadius: '50% 20% 80% 40% / 60% 30% 70% 40%',
                filter: 'blur(35px)',
                animation: 'drift 25s ease-in-out infinite reverse, morph2 18s ease-in-out infinite'
              }}
            />

            <motion.div
              key={`blob3-${mood.primary}`}
              className="fixed pointer-events-none animate-breathe"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.25, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 3, ease: "easeOut", delay: 1 }}
              style={{
                width: '250px',
                height: '250px',
                left: '60%',
                top: '10%',
                background: `radial-gradient(circle, ${currentTheme.primary}20, transparent 70%)`,
                borderRadius: '40% 60% 30% 70% / 50% 40% 60% 50%',
                filter: 'blur(30px)',
                animation: 'breathe 12s ease-in-out infinite, morph3 22s ease-in-out infinite'
              }}
            />

            {/* Floating geometric shapes */}
            <motion.div
              key={`geo1-${mood.primary}`}
              className="fixed pointer-events-none"
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: 0.15, rotate: 360 }}
              exit={{ opacity: 0 }}
              transition={{ 
                opacity: { duration: 2 },
                rotate: { duration: 30, repeat: Infinity, ease: "linear" }
              }}
              style={{
                width: '100px',
                height: '100px',
                left: '25%',
                top: '60%',
                background: `linear-gradient(45deg, ${currentTheme.primary}40, transparent)`,
                borderRadius: '30%',
                filter: 'blur(20px)'
              }}
            />

            <motion.div
              key={`geo2-${mood.primary}`}
              className="fixed pointer-events-none"
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: 0.1, rotate: -360 }}
              exit={{ opacity: 0 }}
              transition={{ 
                opacity: { duration: 2.5, delay: 1 },
                rotate: { duration: 45, repeat: Infinity, ease: "linear" }
              }}
              style={{
                width: '80px',
                height: '80px',
                right: '30%',
                top: '40%',
                background: `linear-gradient(135deg, ${currentTheme.secondary}30, transparent)`,
                borderRadius: '50%',
                filter: 'blur(15px)'
              }}
            />

            {/* Subtle gradient overlay */}
            <motion.div
              key={`overlay-${mood.primary}`}
              className="fixed inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
              style={{
                background: `
                  radial-gradient(circle at ${50 + (mood.coordinates?.x || 0) / 20}% ${50 + (mood.coordinates?.y || 0) / 20}%, 
                    ${currentTheme.primary}05 0%, 
                    transparent 60%)
                `,
                mixBlendMode: 'overlay'
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* CSS Keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); }
          25% { transform: translateY(-20px) translateX(10px) scale(1.05); }
          50% { transform: translateY(0) translateX(20px) scale(1); }
          75% { transform: translateY(15px) translateX(-10px) scale(0.95); }
        }

        @keyframes drift {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
          33% { transform: translateY(-15px) translateX(-20px) rotate(2deg); }
          66% { transform: translateY(10px) translateX(15px) rotate(-1deg); }
        }

        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.25; }
          50% { transform: scale(1.1); opacity: 0.4; }
        }

        @keyframes morph {
          0%, 100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
          25% { border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%; }
          50% { border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%; }
          75% { border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%; }
        }

        @keyframes morph2 {
          0%, 100% { border-radius: 50% 20% 80% 40% / 60% 30% 70% 40%; }
          25% { border-radius: 20% 60% 40% 80% / 30% 70% 40% 60%; }
          50% { border-radius: 80% 40% 60% 20% / 70% 40% 60% 30%; }
          75% { border-radius: 40% 80% 20% 60% / 40% 60% 30% 70%; }
        }

        @keyframes morph3 {
          0%, 100% { border-radius: 40% 60% 30% 70% / 50% 40% 60% 50%; }
          50% { border-radius: 60% 40% 70% 30% / 40% 60% 50% 40%; }
        }
      `}</style>
    </>
  )
}