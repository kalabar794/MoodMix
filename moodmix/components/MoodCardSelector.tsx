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
    color: '#fbbf24'
  },
  { 
    name: 'energetic', 
    label: 'Energetic', 
    emoji: '⚡',
    color: '#ef4444'
  },
  { 
    name: 'calm', 
    label: 'Calm', 
    emoji: '😌',
    color: '#14b8a6'
  },
  { 
    name: 'romantic', 
    label: 'Romantic', 
    emoji: '💕',
    color: '#ec4899'
  },
  { 
    name: 'focused', 
    label: 'Focused', 
    emoji: '🎯',
    color: '#3b82f6'
  },
  { 
    name: 'chill', 
    label: 'Chill', 
    emoji: '🌊',
    color: '#10b981'
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
    <div className="w-full max-w-3xl mx-auto">
      {/* Mood Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
      >
        {MOOD_CARDS.map((mood) => (
          <motion.button
            key={mood.name}
            variants={cardVariants}
            onClick={() => handleMoodSelect(mood)}
            disabled={isSelecting}
            className={`
              mood-card relative group
              ${selectedMood === mood.name ? 'selected ring-2 ring-purple-500' : ''}
              ${isSelecting && selectedMood !== mood.name ? 'opacity-50' : ''}
              disabled:cursor-not-allowed
            `}
            style={{
              backgroundColor: selectedMood === mood.name ? `${mood.color}20` : undefined,
              borderColor: selectedMood === mood.name ? mood.color : undefined
            }}
            whileHover={{ 
              y: -4,
              transition: { type: "spring", stiffness: 400, damping: 25 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Content */}
            <div className="relative z-10">
              {/* Emoji */}
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {mood.emoji}
              </div>
              
              {/* Mood Name */}
              <h3 className="text-heading font-semibold mb-1">
                {mood.label}
              </h3>

              {/* Selection Indicator */}
              {selectedMood === mood.name && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute top-3 right-3 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center"
                >
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              )}

              {/* Loading Indicator */}
              {isSelecting && selectedMood === mood.name && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center"
                >
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Footer Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="text-center mt-8"
      >
        <p className="text-caption">
          Pick the mood that best matches how you&apos;re feeling right now
        </p>
      </motion.div>
    </div>
  )
}