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

// Sophisticated SVG Icon Component
function MoodIcon({ icon, className }: { icon: string; className?: string }) {
  const icons = {
    sun: (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
      </svg>
    ),
    'cloud-rain': (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M7.5 9.5a5 5 0 1110 0c.654 0 1.25.423 1.25 1.25s-.596 1.25-1.25 1.25h-10C6.846 12 6.25 11.577 6.25 10.75S6.846 9.5 7.5 9.5z"/>
        <path d="M8 15.25a.75.75 0 01.75.75v2a.75.75 0 01-1.5 0v-2a.75.75 0 01.75-.75zm4 0a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75zm4 0a.75.75 0 01.75.75v2a.75.75 0 01-1.5 0v-2a.75.75 0 01.75-.75z"/>
      </svg>
    ),
    zap: (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd"/>
      </svg>
    ),
    waves: (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M2.5 12c.956-1.026 2.061-1.866 3.25-2.5 1.315-.7 2.685-.7 4 0 1.315.7 2.685.7 4 0 1.315-.7 2.685-.7 4 0 1.189.634 2.294 1.474 3.25 2.5v6H2.5v-6zM2.5 6c.956-1.026 2.061-1.866 3.25-2.5 1.315-.7 2.685-.7 4 0 1.315.7 2.685.7 4 0 1.315-.7 2.685-.7 4 0 1.189.634 2.294 1.474 3.25 2.5v2c-.956-1.026-2.061-1.866-3.25-2.5-1.315-.7-2.685-.7-4 0-1.315.7-2.685.7-4 0-1.315-.7-2.685-.7-4 0C4.561 6.134 3.456 6.974 2.5 8V6z"/>
      </svg>
    ),
    heart: (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"/>
      </svg>
    ),
    brain: (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2c-1.1 0-2 .9-2 2 0 .74.4 1.38 1 1.73v.27c0 .83-.67 1.5-1.5 1.5S8 6.83 8 6V4c0-1.1-.9-2-2-2s-2 .9-2 2v2c0 2.21 1.79 4 4 4h.5c.28 0 .5.22.5.5S8.78 11 8.5 11H8c-2.21 0-4 1.79-4 4v3c0 1.1.9 2 2 2s2-.9 2-2v-3c0-.83.67-1.5 1.5-1.5S11 14.17 11 15v3c0 1.1.9 2 2 2s2-.9 2-2v-3c0-.83.67-1.5 1.5-1.5S18 14.17 18 15v3c0 1.1.9 2 2 2s2-.9 2-2v-3c0-2.21-1.79-4-4-4h-.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5H18c2.21 0 4-1.79 4-4V4c0-1.1-.9-2-2-2s-2 .9-2 2v2c0 .83-.67 1.5-1.5 1.5S15 6.83 15 6v-.27c.6-.35 1-.99 1-1.73 0-1.1-.9-2-2-2z"/>
      </svg>
    ),
    clock: (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd"/>
      </svg>
    ),
    flame: (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z" clipRule="evenodd"/>
      </svg>
    ),
    sparkles: (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd"/>
      </svg>
    ),
    trophy: (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h2.25a.75.75 0 000-1.5h-.75a.75.75 0 01-.75-.75c0-.414.336-.75.75-.75h.75v-1.5c0-.621.504-1.125 1.125-1.125h6.75c.621 0 1.125.504 1.125 1.125V21h.75c.414 0 .75.336.75.75s-.336.75-.75.75h2.25a.75.75 0 000-1.5h-.75a2.25 2.25 0 00-2.25-2.25V16.875c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 013.16 5.337a45.6 45.6 0 012.006-.343v.256zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 01-2.863 3.207 6.72 6.72 0 00.857-3.294z" clipRule="evenodd"/>
      </svg>
    ),
    'shield-off': (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM20.25 5.507v6.468c0 1.029-.282 2.044-.776 2.976l-1.83-1.83c.095-.381.106-.778.106-1.146V5.507a49.255 49.255 0 00-6-1.238 49.255 49.255 0 00-6 1.238v4.789l-1.5-1.5V5.507c0-.9.683-1.71 1.612-1.876a51.196 51.196 0 0111.776 0c.929.166 1.612.976 1.612 1.876z"/>
        <path d="M9.06 9.06L3.678 14.442a49.17 49.17 0 01-1.439-4.467c-.173-.717.22-1.584.887-1.987.609-.37 1.3-.621 2.017-.821L9.06 9.06zM17.803 15.932c.229-.28.43-.571.601-.87l-11.322-11.322A51.196 51.196 0 0112 2.25c2.87 0 5.73.206 8.548.631.929.166 1.612.976 1.612 1.876v6.468c0 1.029-.282 2.044-.776 2.976a49.17 49.17 0 01-3.581 1.731z"/>
      </svg>
    ),
    compass: (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M10.5 3.798v5.02a3 3 0 01-.879 2.121l-2.377 2.377a9.845 9.845 0 015.091 1.013 8.315 8.315 0 005.713.636l.285-.071-3.954-3.955a3 3 0 01-.879-2.121v-5.02a23.614 23.614 0 00-3 0zm4.5.138a.75.75 0 00.093-1.495A24.837 24.837 0 0012 2.25a24.837 24.837 0 00-3.093.191A.75.75 0 009 3.936v4.882a1.5 1.5 0 01-.44 1.06l-6.293 6.294c-1.62 1.621-.903 4.475 1.471 4.88 2.686.46 5.447.698 8.262.698 2.816 0 5.576-.239 8.262-.697 2.373-.406 3.092-3.26 1.47-4.881L15.44 9.879A1.5 1.5 0 0115 8.818V3.936z" clipRule="evenodd"/>
      </svg>
    )
  }
  
  return icons[icon as keyof typeof icons] || icons.heart
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