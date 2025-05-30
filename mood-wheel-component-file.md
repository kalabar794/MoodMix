# 04. Mood Wheel Component

## Create the Interactive Mood Selector

### Step 1: Create components/MoodWheel.tsx

```tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MoodSelection } from '@/lib/types'

interface MoodWheelProps {
  onMoodSelect: (mood: MoodSelection) => void
}

// Define mood segments
const MOODS = [
  { name: 'happy', label: 'Happy', color: '#FFD93D', angle: 0 },
  { name: 'excited', label: 'Excited', color: '#FF8C42', angle: 60 },
  { name: 'energetic', label: 'Energetic', color: '#FF6B6B', angle: 120 },
  { name: 'love', label: 'Love', color: '#F06292', angle: 180 },
  { name: 'sad', label: 'Sad', color: '#4D8FAC', angle: 240 },
  { name: 'calm', label: 'Calm', color: '#4DB6AC', angle: 300 },
]

export default function MoodWheel({ onMoodSelect }: MoodWheelProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [wheelRotation, setWheelRotation] = useState(0)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const wheelRef = useRef<HTMLDivElement>(null)

  const handleWheelInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
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
    const maxDistance = Math.min(centerX, centerY)
    const intensity = Math.min(100, (distance / maxDistance) * 100)

    setSelectedMood(closestMood.name)
    setCursorPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })

    // Create mood selection object
    const selection: MoodSelection = {
      primary: closestMood.name,
      color: closestMood.color,
      intensity: Math.round(intensity),
      coordinates: { x, y }
    }

    onMoodSelect(selection)
  }

  return (
    <div className="relative w-80 h-80 mx-auto">
      {/* Mood Wheel */}
      <motion.div
        ref={wheelRef}
        className="absolute inset-0 rounded-full cursor-pointer overflow-hidden"
        onClick={handleWheelInteraction}
        onMouseMove={handleWheelInteraction}
        animate={{ rotate: wheelRotation }}
        transition={{ type: "spring", stiffness: 60, damping: 20 }}
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 mood-wheel-gradient rounded-full" />
        
        {/* Glass Overlay */}
        <div className="absolute inset-0 rounded-full glass" 
             style={{ 
               background: 'rgba(255, 255, 255, 0.05)',
               backdropFilter: 'blur(8px)'
             }} />

        {/* Mood Segments */}
        {MOODS.map((mood, index) => (
          <motion.div
            key={mood.name}
            className="absolute inset-0"
            style={{
              clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((mood.angle - 30) * Math.PI / 180)}% ${50 + 50 * Math.sin((mood.angle - 30) * Math.PI / 180)}%, ${50 + 50 * Math.cos((mood.angle + 30) * Math.PI / 180)}% ${50 + 50 * Math.sin((mood.angle + 30) * Math.PI / 180)}%)`
            }}
            animate={{
              opacity: selectedMood === mood.name ? 0.8 : 0.3,
              scale: selectedMood === mood.name ? 1.05 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
        ))}

        {/* Center Circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full glass flex items-center justify-center">
          <span className="text-sm font-medium text-white/80">
            {selectedMood ? MOODS.find(m => m.name === selectedMood)?.label : 'Select'}
          </span>
        </div>

        {/* Cursor Indicator */}
        {selectedMood && (
          <motion.div
            className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 pointer-events-none"
            animate={{
              left: cursorPosition.x,
              top: cursorPosition.y,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </motion.div>

      {/* Mood Labels */}
      {MOODS.map((mood) => {
        const labelX = 50 + 45 * Math.cos(mood.angle * Math.PI / 180)
        const labelY = 50 + 45 * Math.sin(mood.angle * Math.PI / 180)
        
        return (
          <motion.div
            key={mood.name}
            className="absolute pointer-events-none"
            style={{
              left: `${labelX}%`,
              top: `${labelY}%`,
              transform: 'translate(-50%, -50%)'
            }}
            animate={{
              scale: selectedMood === mood.name ? 1.2 : 1,
              opacity: selectedMood === mood.name ? 1 : 0.6,
            }}
          >
            <span className="text-white font-medium text-sm drop-shadow-lg">
              {mood.label}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}
```

### Step 2: Update the Page to Use MoodWheel

Update `app/page.tsx`:

```tsx
'use client'

import { useState } from 'react'
import MoodWheel from '@/components/MoodWheel'
import { MoodSelection } from '@/lib/types'

export default function Home() {
  const [currentMood, setCurrentMood] = useState<MoodSelection | null>(null)

  const handleMoodSelect = (mood: MoodSelection) => {
    setCurrentMood(mood)
    // Update CSS variables for dynamic theming
    document.documentElement.className = `mood-${mood.primary}`
  }

  return (
    <main className="min-h-screen relative">
      {/* Dynamic Background */}
      <div className={`gradient-bg ${currentMood ? `mood-${currentMood.primary}` : ''}`} />
      <div className="floating-orb w-96 h-96 top-20 left-20" />
      <div className="floating-orb w-64 h-64 bottom-20 right-20" style={{ animationDelay: '10s' }} />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 gap-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2">MoodMix</h1>
          <p className="text-white/60 text-lg">How are you feeling today?</p>
        </div>

        {/* Mood Wheel */}
        <div className="glass p-8 rounded-3xl">
          <MoodWheel onMoodSelect={handleMoodSelect} />
        </div>

        {/* Selected Mood Display */}
        {currentMood && (
          <div className="glass glass-hover p-6 rounded-2xl text-center">
            <p className="text-sm text-white/60 mb-1">Current Mood</p>
            <p className="text-2xl font-semibold capitalize">{currentMood.primary}</p>
            <p className="text-sm text-white/60 mt-1">Intensity: {currentMood.intensity}%</p>
          </div>
        )}
      </div>
    </main>
  )
}
```

### Step 3: Test Your Mood Wheel

1. Run `npm run dev`
2. You should see:
   - An interactive circular mood wheel
   - Color gradients representing different moods
   - Hover effects and animations
   - Background that changes based on selected mood
   - Intensity based on distance from center

### Troubleshooting

If you see any errors:
- Make sure `lib/types.ts` exists with the MoodSelection interface
- Ensure all dependencies are installed (framer-motion)
- Check that globals.css has the mood-specific gradient classes

## Next Steps
Move on to `05-background-animation.md` to enhance the dynamic background animations.