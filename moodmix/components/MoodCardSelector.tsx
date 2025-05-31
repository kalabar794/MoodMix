'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MoodSelection } from '@/lib/types'

interface MoodCardSelectorProps {
  onMoodSelect: (mood: MoodSelection) => void
}

const MOOD_CARDS = [
  { 
    name: 'euphoric', 
    label: 'Euphoric', 
    icon: 'sun',
    gradient: 'from-amber-400 via-orange-500 to-yellow-500',
    bgColor: 'bg-gradient-to-br from-amber-500/20 to-orange-500/20',
    borderColor: 'border-amber-400/30',
    description: 'Pure joy and elation'
  },
  { 
    name: 'melancholic', 
    label: 'Melancholic', 
    icon: 'cloud-rain',
    gradient: 'from-slate-400 via-blue-500 to-indigo-600',
    bgColor: 'bg-gradient-to-br from-slate-500/20 to-blue-500/20',
    borderColor: 'border-slate-400/30',
    description: 'Bittersweet contemplation'
  },
  { 
    name: 'energetic', 
    label: 'Energetic', 
    icon: 'zap',
    gradient: 'from-red-500 via-pink-500 to-rose-500',
    bgColor: 'bg-gradient-to-br from-red-500/20 to-pink-500/20',
    borderColor: 'border-red-400/30',
    description: 'High-octane intensity'
  },
  { 
    name: 'serene', 
    label: 'Serene', 
    icon: 'waves',
    gradient: 'from-teal-400 via-cyan-500 to-blue-500',
    bgColor: 'bg-gradient-to-br from-teal-500/20 to-cyan-500/20',
    borderColor: 'border-teal-400/30',
    description: 'Peaceful tranquility'
  },
  { 
    name: 'passionate', 
    label: 'Passionate', 
    icon: 'heart',
    gradient: 'from-rose-500 via-pink-500 to-fuchsia-500',
    bgColor: 'bg-gradient-to-br from-rose-500/20 to-pink-500/20',
    borderColor: 'border-rose-400/30',
    description: 'Intense romantic energy'
  },
  { 
    name: 'contemplative', 
    label: 'Contemplative', 
    icon: 'brain',
    gradient: 'from-purple-500 via-violet-500 to-indigo-500',
    bgColor: 'bg-gradient-to-br from-purple-500/20 to-violet-500/20',
    borderColor: 'border-purple-400/30',
    description: 'Deep introspective focus'
  },
  { 
    name: 'nostalgic', 
    label: 'Nostalgic', 
    icon: 'clock',
    gradient: 'from-amber-600 via-orange-600 to-red-600',
    bgColor: 'bg-gradient-to-br from-amber-600/20 to-orange-600/20',
    borderColor: 'border-amber-500/30',
    description: 'Wistful remembrance'
  },
  { 
    name: 'rebellious', 
    label: 'Rebellious', 
    icon: 'flame',
    gradient: 'from-orange-600 via-red-600 to-pink-600',
    bgColor: 'bg-gradient-to-br from-orange-600/20 to-red-600/20',
    borderColor: 'border-orange-500/30',
    description: 'Defiant and bold'
  },
  { 
    name: 'mystical', 
    label: 'Mystical', 
    icon: 'sparkles',
    gradient: 'from-indigo-500 via-purple-500 to-pink-500',
    bgColor: 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20',
    borderColor: 'border-indigo-400/30',
    description: 'Ethereal and otherworldly'
  },
  { 
    name: 'triumphant', 
    label: 'Triumphant', 
    icon: 'trophy',
    gradient: 'from-yellow-400 via-amber-500 to-orange-500',
    bgColor: 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20',
    borderColor: 'border-yellow-400/30',
    description: 'Victorious achievement'
  },
  { 
    name: 'vulnerable', 
    label: 'Vulnerable', 
    icon: 'shield-off',
    gradient: 'from-gray-400 via-slate-500 to-gray-600',
    bgColor: 'bg-gradient-to-br from-gray-500/20 to-slate-500/20',
    borderColor: 'border-gray-400/30',
    description: 'Open and exposed'
  },
  { 
    name: 'adventurous', 
    label: 'Adventurous', 
    icon: 'compass',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    bgColor: 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-400/30',
    description: 'Ready for exploration'
  }
]

// Clean SVG Icon Component
function MoodIcon({ icon, className }: { icon: string; className?: string }) {
  const renderIcon = () => {
    switch (icon) {
      case 'sun':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        )
      case 'cloud-rain':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/>
            <line x1="8" y1="19" x2="8" y2="21"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="16" y1="19" x2="16" y2="21"/>
          </svg>
        )
      case 'zap':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
          </svg>
        )
      case 'waves':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M2 12c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"/>
            <path d="M2 17c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"/>
          </svg>
        )
      case 'heart':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        )
      case 'brain':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="3"/>
            <path d="M12 14s-4 2-4 6h8c0-4-4-6-4-6z"/>
          </svg>
        )
      case 'clock':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
        )
      case 'flame':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
          </svg>
        )
      case 'sparkles':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0L9.937 15.5z"/>
          </svg>
        )
      case 'trophy':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
            <path d="M4 22h16"/>
            <path d="M10 14.66V17c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-2.34"/>
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
          </svg>
        )
      case 'shield-off':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.69 14a6.9 6.9 0 0 0 .31-2V5l-8-3-3.16 1.18"/>
            <path d="M4.73 4.73 4 5v7c0 6 8 10 8 10a20.29 20.29 0 0 0 5.62-4.38"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
        )
      case 'compass':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/>
            <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88"/>
          </svg>
        )
      default:
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3"/>
          </svg>
        )
    }
  }

  return renderIcon()
}

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
      color: mood.gradient.includes('amber') ? '#fbbf24' : 
             mood.gradient.includes('red') ? '#ef4444' :
             mood.gradient.includes('teal') ? '#14b8a6' :
             mood.gradient.includes('rose') ? '#ec4899' :
             mood.gradient.includes('purple') ? '#8b5cf6' :
             mood.gradient.includes('emerald') ? '#10b981' : '#6366f1',
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
    <div className="w-full max-w-5xl mx-auto">
      {/* Sophisticated Mood Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {MOOD_CARDS.map((mood) => (
          <motion.button
            key={mood.name}
            variants={cardVariants}
            onClick={() => handleMoodSelect(mood)}
            disabled={isSelecting}
            className={`
              relative group overflow-hidden rounded-2xl p-6 text-left
              border backdrop-blur-xl transition-all duration-500
              ${mood.bgColor} ${mood.borderColor}
              ${selectedMood === mood.name ? 'ring-2 ring-white/50 scale-105' : 'hover:scale-105'}
              ${isSelecting && selectedMood !== mood.name ? 'opacity-40' : ''}
              disabled:cursor-not-allowed min-h-[140px]
            `}
            whileHover={{ 
              y: -8,
              transition: { type: "spring", stiffness: 400, damping: 25 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${mood.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
            
            {/* Sophisticated Icon */}
            <div className="relative z-10">
              <div className="mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mood.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <MoodIcon icon={mood.icon} className="w-6 h-6 text-white" />
                </div>
              </div>
              
              {/* Mood Label */}
              <h3 className="text-lg font-semibold text-white mb-2">
                {mood.label}
              </h3>
              
              {/* Sophisticated Description */}
              <p className="text-sm text-white/70 leading-relaxed">
                {mood.description}
              </p>

              {/* Selection Indicator */}
              {selectedMood === mood.name && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg"
                >
                  <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              )}

              {/* Loading Indicator */}
              {isSelecting && selectedMood === mood.name && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/30 rounded-2xl flex items-center justify-center backdrop-blur-sm"
                >
                  <div className="w-8 h-8 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                </motion.div>
              )}
            </div>

            {/* Hover Effect Border */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/20 transition-colors duration-300" />
          </motion.button>
        ))}
      </motion.div>

      {/* Elegant Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="text-center mt-12"
      >
        <p className="text-sm text-white/60 max-w-2xl mx-auto leading-relaxed">
          Each emotion unlocks a carefully curated musical journey designed to complement and enhance your current state of mind
        </p>
      </motion.div>
    </div>
  )
}