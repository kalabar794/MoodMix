'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MoodSelection } from '@/lib/types'

interface BackgroundAnimationProps {
  mood: MoodSelection | null
}

// Particle configuration for each mood
const MOOD_PARTICLES = {
  happy: {
    count: 30,
    color: 'rgba(255, 217, 61, 0.3)',
    speed: 2,
    size: { min: 2, max: 6 }
  },
  excited: {
    count: 40,
    color: 'rgba(255, 140, 66, 0.3)',
    speed: 3,
    size: { min: 3, max: 8 }
  },
  energetic: {
    count: 50,
    color: 'rgba(255, 107, 107, 0.3)',
    speed: 4,
    size: { min: 2, max: 10 }
  },
  love: {
    count: 25,
    color: 'rgba(240, 98, 146, 0.3)',
    speed: 1.5,
    size: { min: 4, max: 8 }
  },
  sad: {
    count: 20,
    color: 'rgba(77, 143, 172, 0.3)',
    speed: 1,
    size: { min: 2, max: 5 }
  },
  calm: {
    count: 15,
    color: 'rgba(77, 182, 172, 0.3)',
    speed: 0.5,
    size: { min: 3, max: 6 }
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
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 0.3,
                scale: 1,
                x: [0, 100, 0],
                y: [0, -50, 0],
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                opacity: { duration: 1 },
                scale: { duration: 1 },
                x: { duration: 20, repeat: Infinity, ease: "easeInOut" },
                y: { duration: 15, repeat: Infinity, ease: "easeInOut" }
              }}
              style={{
                width: `${300 + mood.intensity}px`,
                height: `${300 + mood.intensity}px`,
                left: '10%',
                top: '20%',
                background: `radial-gradient(circle, ${mood.color} 0%, transparent 70%)`
              }}
            />

            <motion.div
              key={`orb2-${mood.primary}`}
              className="floating-orb"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 0.25,
                scale: 1,
                x: [0, -80, 0],
                y: [0, 60, 0],
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                opacity: { duration: 1, delay: 0.2 },
                scale: { duration: 1, delay: 0.2 },
                x: { duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 },
                y: { duration: 22, repeat: Infinity, ease: "easeInOut", delay: 5 }
              }}
              style={{
                width: `${250 + mood.intensity * 0.8}px`,
                height: `${250 + mood.intensity * 0.8}px`,
                right: '15%',
                bottom: '25%',
                background: `radial-gradient(circle, ${mood.color} 0%, transparent 70%)`
              }}
            />

            <motion.div
              key={`orb3-${mood.primary}`}
              className="floating-orb"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 0.2,
                scale: 1,
                x: [0, 60, 0],
                y: [0, 80, 0],
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                opacity: { duration: 1, delay: 0.4 },
                scale: { duration: 1, delay: 0.4 },
                x: { duration: 25, repeat: Infinity, ease: "easeInOut", delay: 10 },
                y: { duration: 20, repeat: Infinity, ease: "easeInOut", delay: 10 }
              }}
              style={{
                width: `${200 + mood.intensity * 0.6}px`,
                height: `${200 + mood.intensity * 0.6}px`,
                left: '50%',
                top: '10%',
                background: `radial-gradient(circle, ${mood.color} 0%, transparent 70%)`
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