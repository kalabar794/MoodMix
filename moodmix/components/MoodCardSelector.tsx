'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MoodSelection } from '@/lib/types'
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts'
import { useIsMobile, useIsTouchDevice } from '@/lib/hooks/useTouchGestures'
import { 
  Sun, CloudRain, Zap, Waves, Heart, 
  Brain, Clock, Flame, Sparkles, Trophy,
  ShieldOff, Compass 
} from 'lucide-react'

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

// Professional Icon Component using Lucide
function MoodIcon({ icon, className }: { icon: string; className?: string }) {
  const iconMap = {
    sun: Sun,
    'cloud-rain': CloudRain,
    zap: Zap,
    waves: Waves,
    heart: Heart,
    brain: Brain,
    clock: Clock,
    flame: Flame,
    sparkles: Sparkles,
    trophy: Trophy,
    'shield-off': ShieldOff,
    compass: Compass
  }

  const IconComponent = iconMap[icon as keyof typeof iconMap] || Heart
  
  return <IconComponent className={className} />
}

export default function MoodCardSelector({ onMoodSelect }: MoodCardSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [isSelecting, setIsSelecting] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [keyboardNavigation, setKeyboardNavigation] = useState(false)
  
  // Mobile detection
  const isMobile = useIsMobile()
  const isTouchDevice = useIsTouchDevice()

  const handleMoodSelect = async (mood: typeof MOOD_CARDS[0]) => {
    if (isSelecting) return
    
    try {
      setIsSelecting(true)
      setSelectedMood(mood.name)

      // Create mood selection object with error handling
      const colorMap: Record<string, string> = {
        'amber': '#fbbf24',
        'red': '#ef4444', 
        'teal': '#14b8a6',
        'rose': '#ec4899',
        'purple': '#8b5cf6',
        'emerald': '#10b981'
      }
      
      let color = '#6366f1' // default
      for (const [key, value] of Object.entries(colorMap)) {
        if (mood.gradient.includes(key)) {
          color = value
          break
        }
      }

      const selection: MoodSelection = {
        primary: mood.name,
        color,
        intensity: 75,
        coordinates: { x: 0, y: 0 }
      }

      // Small delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Call parent with error handling
      if (typeof onMoodSelect === 'function') {
        onMoodSelect(selection)
      }
    } catch (error) {
      console.error('Error selecting mood:', error)
      // Reset state on error
      setIsSelecting(false)
      setSelectedMood(null)
    }
  }

  // Keyboard navigation functions
  const handleNavigate = (direction: 'up' | 'down' | 'left' | 'right') => {
    setKeyboardNavigation(true)
    const cols = 4 // lg:grid-cols-4
    const rows = Math.ceil(MOOD_CARDS.length / cols)
    
    let newIndex = focusedIndex
    
    switch (direction) {
      case 'left':
        newIndex = focusedIndex > 0 ? focusedIndex - 1 : MOOD_CARDS.length - 1
        break
      case 'right':
        newIndex = focusedIndex < MOOD_CARDS.length - 1 ? focusedIndex + 1 : 0
        break
      case 'up':
        newIndex = focusedIndex - cols
        if (newIndex < 0) {
          // Go to last row, same column
          const col = focusedIndex % cols
          newIndex = Math.min(MOOD_CARDS.length - 1, (rows - 1) * cols + col)
        }
        break
      case 'down':
        newIndex = focusedIndex + cols
        if (newIndex >= MOOD_CARDS.length) {
          // Go to first row, same column
          newIndex = focusedIndex % cols
        }
        break
    }
    
    setFocusedIndex(Math.max(0, Math.min(MOOD_CARDS.length - 1, newIndex)))
  }

  const handleConfirm = () => {
    if (focusedIndex >= 0 && focusedIndex < MOOD_CARDS.length) {
      handleMoodSelect(MOOD_CARDS[focusedIndex])
    }
  }

  const handleMoodSelectByIndex = (index: number) => {
    if (index >= 0 && index < MOOD_CARDS.length) {
      setFocusedIndex(index)
      handleMoodSelect(MOOD_CARDS[index])
    }
  }

  // Set up keyboard shortcuts
  useKeyboardShortcuts({
    onMoodSelect: handleMoodSelectByIndex,
    onNavigate: handleNavigate,
    onConfirm: handleConfirm,
    isEnabled: !isSelecting
  })

  // Hide keyboard navigation indicator after mouse use
  useEffect(() => {
    const handleMouseMove = () => {
      setKeyboardNavigation(false)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])

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
        className={`grid gap-4 md:gap-6 ${
          isMobile 
            ? 'grid-cols-2 px-4' 
            : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
        }`}
      >
        {MOOD_CARDS.map((mood, index) => (
          <motion.button
            key={mood.name}
            variants={cardVariants}
            onClick={() => handleMoodSelect(mood)}
            disabled={isSelecting}
            className={`
              relative group overflow-hidden rounded-2xl text-left
              border backdrop-blur-xl transition-all duration-500
              ${mood.bgColor} ${mood.borderColor}
              ${selectedMood === mood.name ? 'ring-2 ring-white/50 scale-105' : (isTouchDevice ? '' : 'hover:scale-105')}
              ${isSelecting && selectedMood !== mood.name ? 'opacity-40' : ''}
              ${keyboardNavigation && focusedIndex === index ? 'ring-2 ring-purple-400/70 ring-offset-2 ring-offset-transparent scale-105' : ''}
              ${isMobile ? 'p-4 min-h-[120px] mood-card-touch' : 'p-6 min-h-[140px]'}
              ${isTouchDevice ? 'active:scale-95' : ''}
              disabled:cursor-not-allowed
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
                  <div className="w-6 h-6 text-white flex items-center justify-center">
                    <MoodIcon icon={mood.icon} className="w-full h-full" />
                  </div>
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