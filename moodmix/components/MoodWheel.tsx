'use client'

import { useState, useRef } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { MoodSelection } from '@/lib/types'

interface MoodWheelProps {
  onMoodSelect: (mood: MoodSelection) => void
}

// Premium mood segments with vibrant modern color palette
const MOODS = [
  { 
    name: 'happy', 
    label: 'Happy', 
    color: '#FFE055', 
    angle: 0,
    gradient: 'conic-gradient(from 0deg at 50% 50%, #FFE055 0deg, #FFB347 20deg, #FFA726 40deg, #FFE055 60deg)',
    description: 'Joyful & Bright'
  },
  { 
    name: 'excited', 
    label: 'Excited', 
    color: '#FF9D5C', 
    angle: 60,
    gradient: 'conic-gradient(from 60deg at 50% 50%, #FF9D5C 0deg, #FF7043 20deg, #FF5722 40deg, #FF9D5C 60deg)',
    description: 'Thrilled & Energized'
  },
  { 
    name: 'energetic', 
    label: 'Energetic', 
    color: '#FF7B7B', 
    angle: 120,
    gradient: 'conic-gradient(from 120deg at 50% 50%, #FF7B7B 0deg, #F44336 20deg, #E53935 40deg, #FF7B7B 60deg)',
    description: 'Powerful & Dynamic'
  },
  { 
    name: 'love', 
    label: 'Love', 
    color: '#F48FB1', 
    angle: 180,
    gradient: 'conic-gradient(from 180deg at 50% 50%, #F48FB1 0deg, #EC407A 20deg, #E91E63 40deg, #F48FB1 60deg)',
    description: 'Romantic & Tender'
  },
  { 
    name: 'sad', 
    label: 'Sad', 
    color: '#64B5F6', 
    angle: 240,
    gradient: 'conic-gradient(from 240deg at 50% 50%, #64B5F6 0deg, #42A5F5 20deg, #2196F3 40deg, #64B5F6 60deg)',
    description: 'Emotional & Deep'
  },
  { 
    name: 'calm', 
    label: 'Calm', 
    color: '#4DD0E1', 
    angle: 300,
    gradient: 'conic-gradient(from 300deg at 50% 50%, #4DD0E1 0deg, #26C6DA 20deg, #00BCD4 40deg, #4DD0E1 60deg)',
    description: 'Peaceful & Serene'
  },
]

export default function MoodWheel({ onMoodSelect }: MoodWheelProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [intensity, setIntensity] = useState(50)
  const [isHovering, setIsHovering] = useState(false)
  const wheelRef = useRef<HTMLDivElement>(null)
  
  // Advanced 3D motion values
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useTransform(mouseY, [-200, 200], [8, -8])
  const rotateY = useTransform(mouseX, [-200, 200], [-8, 8])
  const scale = useTransform(mouseY, [-200, 200], [0.98, 1.02])

  const handleWheelHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!wheelRef.current) return

    const rect = wheelRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const x = e.clientX - rect.left - centerX
    const y = e.clientY - rect.top - centerY

    // Calculate angle from center
    let angle = Math.atan2(y, x) * (180 / Math.PI)
    angle = (angle + 360) % 360 // Normalize to 0-360

    // Find closest mood
    const closestMood = MOODS.reduce((prev, curr) => {
      const prevDiff = Math.abs(((prev.angle - angle + 180) % 360) - 180)
      const currDiff = Math.abs(((curr.angle - angle + 180) % 360) - 180)
      return currDiff < prevDiff ? curr : prev
    })

    // Calculate intensity based on distance from center
    const distance = Math.sqrt(x * x + y * y)
    const maxDistance = Math.min(centerX, centerY) * 0.8 // 80% of radius for better UX
    const calculatedIntensity = Math.min(100, Math.max(10, (distance / maxDistance) * 100))

    // Update visual feedback without triggering selection
    setSelectedMood(closestMood.name)
    setIntensity(Math.round(calculatedIntensity))
    setCursorPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const handleWheelClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!wheelRef.current) return

    const rect = wheelRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const x = e.clientX - rect.left - centerX
    const y = e.clientY - rect.top - centerY

    // Calculate angle from center
    let angle = Math.atan2(y, x) * (180 / Math.PI)
    angle = (angle + 360) % 360 // Normalize to 0-360

    // Find closest mood
    const closestMood = MOODS.reduce((prev, curr) => {
      const prevDiff = Math.abs(((prev.angle - angle + 180) % 360) - 180)
      const currDiff = Math.abs(((curr.angle - angle + 180) % 360) - 180)
      return currDiff < prevDiff ? curr : prev
    })

    // Calculate intensity based on distance from center
    const distance = Math.sqrt(x * x + y * y)
    const maxDistance = Math.min(centerX, centerY) * 0.8 // 80% of radius for better UX
    const calculatedIntensity = Math.min(100, Math.max(10, (distance / maxDistance) * 100))

    // Create mood selection object
    const selection: MoodSelection = {
      primary: closestMood.name,
      color: closestMood.color,
      intensity: Math.round(calculatedIntensity),
      coordinates: { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    onMoodSelect(selection)
  }

  const handleMouseEnter = () => setIsHovering(true)
  const handleMouseLeave = () => {
    setIsHovering(false)
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div className="relative w-96 h-96 mx-auto">
      {/* Premium Container with Enhanced 3D Effects */}
      <motion.div
        className="relative w-full h-full"
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d',
        }}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Ambient Glow Effect */}
        <div className="absolute inset-0 rounded-full opacity-40 blur-3xl bg-gradient-to-br from-blue-400/30 via-purple-500/20 to-pink-400/30 animate-pulse" />
        
        {/* Main Wheel Container */}
        <motion.div
          ref={wheelRef}
          className="absolute inset-4 rounded-full cursor-pointer overflow-hidden"
          onClick={handleWheelClick}
          onMouseMove={(e) => {
            handleWheelHover(e)
            const rect = e.currentTarget.getBoundingClientRect()
            mouseX.set(e.clientX - rect.left - rect.width / 2)
            mouseY.set(e.clientY - rect.top - rect.height / 2)
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            scale,
            transformStyle: 'preserve-3d',
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Premium Base Layer */}
          <div className="absolute inset-0 rounded-full mood-wheel-premium" />
          
          {/* Advanced Glass Overlay */}
          <div className="absolute inset-0 rounded-full glass-ultra opacity-60" />
          
          {/* Dynamic Mood Gradient Layer */}
          <div 
            className="absolute inset-0 rounded-full transition-all duration-700 ease-out"
            style={{
              background: selectedMood 
                ? MOODS.find(m => m.name === selectedMood)?.gradient 
                : 'conic-gradient(from 0deg, #FFD93D, #FF8C42, #FF6B6B, #F06292, #4D8FAC, #4DB6AC, #FFD93D)',
              opacity: selectedMood ? 0.8 : 0.5,
              filter: 'blur(1px)',
            }}
          />

          {/* Inner Rings for Depth */}
          <div className="absolute inset-8 rounded-full border border-white/20 backdrop-blur-sm" />
          <div className="absolute inset-16 rounded-full border border-white/10 backdrop-blur-sm" />

          {/* Premium Center Hub */}
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full glass-premium flex flex-col items-center justify-center"
            animate={{
              scale: selectedMood ? 1.1 : 1,
              boxShadow: selectedMood 
                ? `0 0 60px ${MOODS.find(m => m.name === selectedMood)?.color}40`
                : '0 0 30px rgba(255, 255, 255, 0.1)'
            }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center">
              <div className="text-premium-sm opacity-60 mb-1">
                {selectedMood ? 'Selected' : 'Choose Mood'}
              </div>
              <div className="text-premium-md font-bold capitalize">
                {selectedMood ? MOODS.find(m => m.name === selectedMood)?.label : 'Your Vibe'}
              </div>
              {selectedMood && (
                <motion.div 
                  className="text-premium-sm opacity-80 mt-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {intensity}% intensity
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Enhanced Cursor Indicator */}
          {selectedMood && (
            <motion.div
              className="absolute pointer-events-none z-10"
              style={{
                left: cursorPosition.x,
                top: cursorPosition.y,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <div 
                className="w-6 h-6 rounded-full shadow-2xl border-2 border-white/80"
                style={{
                  background: `radial-gradient(circle, ${MOODS.find(m => m.name === selectedMood)?.color}, transparent)`,
                  boxShadow: `0 0 20px ${MOODS.find(m => m.name === selectedMood)?.color}80`,
                }}
              />
            </motion.div>
          )}

          {/* Premium Ripple Effect */}
          {isHovering && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/30"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: [0, 0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.div>

        {/* Enhanced Mood Labels */}
        {MOODS.map((mood, index) => {
          const labelX = Math.round((50 + 42 * Math.cos(mood.angle * Math.PI / 180)) * 100) / 100
          const labelY = Math.round((50 + 42 * Math.sin(mood.angle * Math.PI / 180)) * 100) / 100
          
          return (
            <motion.div
              key={mood.name}
              className="absolute pointer-events-none z-20"
              style={{
                left: `${labelX}%`,
                top: `${labelY}%`,
                transform: 'translate(-50%, -50%)'
              }}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ 
                opacity: 1, 
                scale: selectedMood === mood.name ? 1.3 : 1,
                y: 0,
                filter: selectedMood === mood.name ? 'brightness(1.2)' : 'brightness(0.8)'
              }}
              transition={{ 
                delay: index * 0.1,
                duration: 0.6,
                type: "spring",
                stiffness: 200
              }}
            >
              <div className="text-center">
                <motion.div 
                  className="text-premium-md font-bold mb-1 drop-shadow-lg"
                  style={{
                    color: selectedMood === mood.name ? mood.color : 'rgba(255, 255, 255, 0.9)',
                    textShadow: selectedMood === mood.name ? `0 0 10px ${mood.color}60` : 'none'
                  }}
                >
                  {mood.label}
                </motion.div>
                <motion.div 
                  className="text-premium-sm opacity-60"
                  animate={{
                    opacity: selectedMood === mood.name ? 1 : 0.5
                  }}
                >
                  {mood.description}
                </motion.div>
              </div>
            </motion.div>
          )
        })}

        {/* Interactive Intensity Indicator */}
        {selectedMood && (
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="glass-premium px-6 py-3 rounded-full text-center">
              <div className="text-premium-sm opacity-60 mb-1">Intensity Level</div>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${MOODS.find(m => m.name === selectedMood)?.color}60, ${MOODS.find(m => m.name === selectedMood)?.color})`
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${intensity}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-premium-md font-bold min-w-[3rem]">{intensity}%</span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}