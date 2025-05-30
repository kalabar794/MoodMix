'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MoodSelection } from '@/lib/types'

interface MoodCardSelectorProps {
  onMoodSelect: (mood: MoodSelection) => void
}

const MOOD_CARDS = [
  { 
    name: 'happy', 
    label: 'Happy', 
    emoji: '😊',
    color: '#FFD93D', 
    gradient: 'from-yellow-300 via-yellow-400 to-orange-400',
    description: 'Upbeat & Joyful',
    shadowColor: 'shadow-yellow-500/25'
  },
  { 
    name: 'energetic', 
    label: 'Energetic', 
    emoji: '⚡',
    color: '#FF6B6B', 
    gradient: 'from-red-400 via-red-500 to-pink-500',
    description: 'High Energy & Dynamic',
    shadowColor: 'shadow-red-500/25'
  },
  { 
    name: 'calm', 
    label: 'Calm', 
    emoji: '😌',
    color: '#4DD0E1', 
    gradient: 'from-cyan-300 via-cyan-400 to-blue-400',
    description: 'Peaceful & Serene',
    shadowColor: 'shadow-cyan-500/25'
  },
  { 
    name: 'romantic', 
    label: 'Romantic', 
    emoji: '💕',
    color: '#F48FB1', 
    gradient: 'from-pink-300 via-pink-400 to-rose-400',
    description: 'Love & Romance',
    shadowColor: 'shadow-pink-500/25'
  },
  { 
    name: 'focused', 
    label: 'Focused', 
    emoji: '🎯',
    color: '#64B5F6', 
    gradient: 'from-blue-400 via-blue-500 to-indigo-500',
    description: 'Deep Concentration',
    shadowColor: 'shadow-blue-500/25'
  },
  { 
    name: 'chill', 
    label: 'Chill', 
    emoji: '🌊',
    color: '#81C784', 
    gradient: 'from-green-300 via-green-400 to-teal-400',
    description: 'Relaxed Vibes',
    shadowColor: 'shadow-green-500/25'
  },
  { 
    name: 'sad', 
    label: 'Melancholy', 
    emoji: '😔',
    color: '#90A4AE', 
    gradient: 'from-slate-400 via-slate-500 to-gray-500',
    description: 'Emotional & Deep',
    shadowColor: 'shadow-slate-500/25'
  },
  { 
    name: 'excited', 
    label: 'Excited', 
    emoji: '🎉',
    color: '#FF9D5C', 
    gradient: 'from-orange-400 via-orange-500 to-yellow-500',
    description: 'Thrilled & Energized',
    shadowColor: 'shadow-orange-500/25'
  },
  { 
    name: 'dreamy', 
    label: 'Dreamy', 
    emoji: '✨',
    color: '#B39DDB', 
    gradient: 'from-purple-300 via-purple-400 to-indigo-400',
    description: 'Ethereal & Mystical',
    shadowColor: 'shadow-purple-500/25'
  }
]

export default function MoodCardSelector({ onMoodSelect }: MoodCardSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [isSelecting, setIsSelecting] = useState(false)

  const handleMoodSelect = async (mood: typeof MOOD_CARDS[0]) => {
    if (isSelecting) return
    
    setIsSelecting(true)
    setSelectedMood(mood.name)

    // Create mood selection object
    const selection: MoodSelection = {
      primary: mood.name,
      color: mood.color,
      intensity: 75, // Default intensity for card selection
      coordinates: { x: 0, y: 0 } // Not needed for card selection
    }

    // Small delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 300))
    
    onMoodSelect(selection)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-premium-lg mb-4">Choose Your Vibe</h2>
        <p className="text-premium-md opacity-70 max-w-xl mx-auto">
          Select the mood that matches how you&apos;re feeling right now. We&apos;ll find the perfect music to complement your energy.
        </p>
      </motion.div>

      {/* Mood Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {MOOD_CARDS.map((mood) => (
          <motion.button
            key={mood.name}
            variants={cardVariants}
            onClick={() => handleMoodSelect(mood)}
            disabled={isSelecting}
            className={`
              relative overflow-hidden rounded-2xl p-6 text-left
              bg-gradient-to-br ${mood.gradient}
              hover:scale-105 active:scale-95
              transition-all duration-300 ease-out
              ${mood.shadowColor} hover:shadow-2xl
              ${selectedMood === mood.name ? 'ring-4 ring-white/50 scale-105' : ''}
              ${isSelecting && selectedMood !== mood.name ? 'opacity-50' : ''}
              group cursor-pointer
              disabled:cursor-not-allowed
            `}
            whileHover={{ 
              y: -8,
              transition: { type: "spring", stiffness: 400, damping: 25 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-300" />
            
            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
            
            {/* Content */}
            <div className="relative z-10">
              {/* Emoji */}
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {mood.emoji}
              </div>
              
              {/* Mood Name */}
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white/90 transition-colors">
                {mood.label}
              </h3>
              
              {/* Description */}
              <p className="text-white/80 text-sm group-hover:text-white/70 transition-colors">
                {mood.description}
              </p>

              {/* Selection Indicator */}
              {selectedMood === mood.name && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                >
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </motion.div>
              )}

              {/* Loading Indicator */}
              {isSelecting && selectedMood === mood.name && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center"
                >
                  <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                </motion.div>
              )}
            </div>

            {/* Pulse Effect for Selected */}
            {selectedMood === mood.name && (
              <motion.div
                className="absolute inset-0 border-2 border-white/30 rounded-2xl"
                animate={{
                  scale: [1, 1.02, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Footer Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="text-center mt-12"
      >
        <p className="text-premium-sm opacity-50">
          Don&apos;t see your exact mood? Pick the closest one – we&apos;ll fine-tune the perfect playlist for you.
        </p>
      </motion.div>
    </div>
  )
}