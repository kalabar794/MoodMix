'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MoodSelection } from '@/lib/types'

interface BackgroundAnimationProps {
  mood: MoodSelection | null
}

// Particle configuration for each mood - Enhanced for vibrancy
const MOOD_PARTICLES = {
  // Legacy mood names (for backward compatibility)
  happy: {
    count: 35,
    color: 'rgba(255, 224, 85, 0.4)',
    speed: 2.5,
    size: { min: 2, max: 7 }
  },
  excited: {
    count: 45,
    color: 'rgba(255, 157, 92, 0.4)',
    speed: 3.5,
    size: { min: 3, max: 9 }
  },
  energetic: {
    count: 55,
    color: 'rgba(255, 123, 123, 0.4)',
    speed: 4.5,
    size: { min: 2, max: 11 }
  },
  love: {
    count: 30,
    color: 'rgba(244, 143, 177, 0.4)',
    speed: 2,
    size: { min: 4, max: 9 }
  },
  sad: {
    count: 25,
    color: 'rgba(100, 181, 246, 0.4)',
    speed: 1.5,
    size: { min: 2, max: 6 }
  },
  calm: {
    count: 20,
    color: 'rgba(77, 208, 225, 0.4)',
    speed: 1,
    size: { min: 3, max: 7 }
  },
  // New sophisticated mood names
  euphoric: {
    count: 45,
    color: 'rgba(251, 191, 36, 0.4)',
    speed: 3.5,
    size: { min: 3, max: 9 }
  },
  melancholic: {
    count: 25,
    color: 'rgba(100, 181, 246, 0.4)',
    speed: 1.5,
    size: { min: 2, max: 6 }
  },
  serene: {
    count: 20,
    color: 'rgba(20, 184, 166, 0.4)',
    speed: 1,
    size: { min: 3, max: 7 }
  },
  passionate: {
    count: 35,
    color: 'rgba(236, 72, 153, 0.4)',
    speed: 2.8,
    size: { min: 4, max: 9 }
  },
  contemplative: {
    count: 22,
    color: 'rgba(139, 92, 246, 0.4)',
    speed: 1.2,
    size: { min: 3, max: 7 }
  },
  nostalgic: {
    count: 28,
    color: 'rgba(217, 119, 6, 0.4)',
    speed: 1.8,
    size: { min: 2, max: 6 }
  },
  rebellious: {
    count: 50,
    color: 'rgba(220, 38, 127, 0.4)',
    speed: 4,
    size: { min: 3, max: 10 }
  },
  mystical: {
    count: 30,
    color: 'rgba(168, 85, 247, 0.4)',
    speed: 2.2,
    size: { min: 3, max: 8 }
  },
  triumphant: {
    count: 40,
    color: 'rgba(245, 158, 11, 0.4)',
    speed: 3.2,
    size: { min: 4, max: 9 }
  },
  vulnerable: {
    count: 20,
    color: 'rgba(148, 163, 184, 0.4)',
    speed: 1.3,
    size: { min: 2, max: 6 }
  },
  adventurous: {
    count: 42,
    color: 'rgba(16, 185, 129, 0.4)',
    speed: 3.8,
    size: { min: 3, max: 10 }
  }
}

interface Particle {
  id: number
  x: number
  y: number
  size: number
  velocity: { x: number; y: number }
}

export default function BackgroundAnimation({ mood }: BackgroundAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number | undefined>(undefined)
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize particles
    const initParticles = () => {
      const config = mood ? MOOD_PARTICLES[mood.primary as keyof typeof MOOD_PARTICLES] : MOOD_PARTICLES.happy
      particlesRef.current = []

      for (let i = 0; i < config.count; i++) {
        particlesRef.current.push({
          id: i,
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * (config.size.max - config.size.min) + config.size.min,
          velocity: {
            x: (Math.random() - 0.5) * config.speed,
            y: (Math.random() - 0.5) * config.speed
          }
        })
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const config = mood ? MOOD_PARTICLES[mood.primary as keyof typeof MOOD_PARTICLES] : MOOD_PARTICLES.happy
      ctx.fillStyle = config.color

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.velocity.x
        particle.y += particle.velocity.y

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    initParticles()
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mood])

  return (
    <>
      {/* Canvas for particles */}
      {isClient && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-0"
          style={{ mixBlendMode: 'screen' }}
        />
      )}

      {/* Animated gradient orbs */}
      <AnimatePresence mode="wait">
        {mood && (
          <>
            <motion.div
              key={`orb1-${mood.primary}`}
              className="floating-orb"
              initial={{ opacity: 0, scale: 0.8, filter: "blur(80px)" }}
              animate={{ 
                opacity: [0.3, 0.5, 0.3],
                scale: [1, 1.1, 1],
                x: [0, 120, -40, 0],
                y: [0, -60, -20, 0],
                filter: ["blur(80px)", "blur(60px)", "blur(80px)"]
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                opacity: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                x: { duration: 25, repeat: Infinity, ease: "easeInOut" },
                y: { duration: 20, repeat: Infinity, ease: "easeInOut" },
                filter: { duration: 8, repeat: Infinity, ease: "easeInOut" }
              }}
              style={{
                width: `${320 + mood.intensity * 1.2}px`,
                height: `${320 + mood.intensity * 1.2}px`,
                left: '8%',
                top: '15%',
                background: `radial-gradient(circle, ${mood.color}80 0%, ${mood.color}40 40%, transparent 75%)`,
                mixBlendMode: 'screen'
              }}
            />

            <motion.div
              key={`orb2-${mood.primary}`}
              className="floating-orb"
              initial={{ opacity: 0, scale: 0.8, filter: "blur(70px)" }}
              animate={{ 
                opacity: [0.25, 0.4, 0.25],
                scale: [1, 1.05, 1],
                x: [0, -100, 20, 0],
                y: [0, 80, -10, 0],
                filter: ["blur(70px)", "blur(50px)", "blur(70px)"]
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                opacity: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 },
                scale: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 },
                x: { duration: 22, repeat: Infinity, ease: "easeInOut", delay: 8 },
                y: { duration: 28, repeat: Infinity, ease: "easeInOut", delay: 8 },
                filter: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }
              }}
              style={{
                width: `${280 + mood.intensity}px`,
                height: `${280 + mood.intensity}px`,
                right: '12%',
                bottom: '20%',
                background: `radial-gradient(circle, ${mood.color}70 0%, ${mood.color}35 45%, transparent 80%)`,
                mixBlendMode: 'screen'
              }}
            />

            <motion.div
              key={`orb3-${mood.primary}`}
              className="floating-orb"
              initial={{ opacity: 0, scale: 0.8, filter: "blur(60px)" }}
              animate={{ 
                opacity: [0.2, 0.35, 0.2],
                scale: [1, 1.08, 1],
                x: [0, 80, -30, 0],
                y: [0, 100, 40, 0],
                filter: ["blur(60px)", "blur(40px)", "blur(60px)"]
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                opacity: { duration: 9, repeat: Infinity, ease: "easeInOut", delay: 4 },
                scale: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 4 },
                x: { duration: 30, repeat: Infinity, ease: "easeInOut", delay: 15 },
                y: { duration: 24, repeat: Infinity, ease: "easeInOut", delay: 15 },
                filter: { duration: 9, repeat: Infinity, ease: "easeInOut", delay: 4 }
              }}
              style={{
                width: `${240 + mood.intensity * 0.8}px`,
                height: `${240 + mood.intensity * 0.8}px`,
                left: '45%',
                top: '8%',
                background: `radial-gradient(circle, ${mood.color}60 0%, ${mood.color}30 50%, transparent 85%)`,
                mixBlendMode: 'screen'
              }}
            />

            <motion.div
              key={`orb4-${mood.primary}`}
              className="floating-orb"
              initial={{ opacity: 0, scale: 0.8, filter: "blur(50px)" }}
              animate={{ 
                opacity: [0.15, 0.3, 0.15],
                scale: [1, 1.06, 1],
                x: [0, -60, 40, 0],
                y: [0, -40, 60, 0],
                filter: ["blur(50px)", "blur(30px)", "blur(50px)"]
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                opacity: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 6 },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 6 },
                x: { duration: 18, repeat: Infinity, ease: "easeInOut", delay: 20 },
                y: { duration: 16, repeat: Infinity, ease: "easeInOut", delay: 20 },
                filter: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 6 }
              }}
              style={{
                width: `${180 + mood.intensity * 0.6}px`,
                height: `${180 + mood.intensity * 0.6}px`,
                right: '35%',
                top: '35%',
                background: `radial-gradient(circle, ${mood.color}50 0%, ${mood.color}25 55%, transparent 90%)`,
                mixBlendMode: 'screen'
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Mood-based overlay */}
      <AnimatePresence>
        {mood && (
          <motion.div
            key={`overlay-${mood.primary}`}
            className="fixed inset-0 pointer-events-none z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{
              background: `radial-gradient(circle at ${50 + mood.coordinates.x / 10}% ${50 + mood.coordinates.y / 10}%, transparent 0%, rgba(0,0,0,0.3) 100%)`,
              mixBlendMode: 'multiply'
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}