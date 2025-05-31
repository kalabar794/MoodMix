'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon, Monitor } from 'lucide-react'

type Theme = 'light' | 'dark' | 'auto'

interface ThemeToggleProps {
  className?: string
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>('auto')
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
    // Get stored theme or default to 'auto'
    const storedTheme = localStorage.getItem('theme') as Theme || 'auto'
    setTheme(storedTheme)
    applyTheme(storedTheme)
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    
    if (newTheme === 'auto') {
      root.setAttribute('data-theme', 'auto')
      localStorage.setItem('theme', 'auto')
    } else {
      root.setAttribute('data-theme', newTheme)
      localStorage.setItem('theme', newTheme)
    }
  }

  const toggleTheme = () => {
    const themeOrder: Theme[] = ['auto', 'light', 'dark']
    const currentIndex = themeOrder.indexOf(theme)
    const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length]
    
    setTheme(nextTheme)
    applyTheme(nextTheme)
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return Sun
      case 'dark':
        return Moon
      case 'auto':
      default:
        return Monitor
    }
  }

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light theme'
      case 'dark':
        return 'Dark theme'
      case 'auto':
      default:
        return 'Auto theme'
    }
  }

  if (!mounted) {
    // Return placeholder to prevent hydration mismatch
    return (
      <div className={`w-10 h-10 rounded-lg ${className}`}>
        <div className="w-full h-full bg-white/10 rounded-lg animate-pulse" />
      </div>
    )
  }

  const Icon = getIcon()

  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        relative group w-10 h-10 rounded-lg
        bg-white/5 hover:bg-white/10 
        border border-white/10 hover:border-white/20
        transition-all duration-300
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      title={getLabel()}
      aria-label={getLabel()}
    >
      {/* Icon */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        key={theme}
        initial={{ opacity: 0, rotate: -180, scale: 0.5 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        exit={{ opacity: 0, rotate: 180, scale: 0.5 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Icon className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
      </motion.div>

      {/* Hover effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-500/0 via-pink-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:via-pink-500/10 group-hover:to-blue-500/10 transition-all duration-500" />
      
      {/* Theme indicator dots */}
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
        {(['auto', 'light', 'dark'] as const).map((t) => (
          <motion.div
            key={t}
            className={`w-1 h-1 rounded-full transition-all duration-300 ${
              theme === t 
                ? 'bg-white/80 scale-125' 
                : 'bg-white/20 scale-100'
            }`}
            animate={{ 
              scale: theme === t ? 1.25 : 1,
              opacity: theme === t ? 0.8 : 0.2
            }}
          />
        ))}
      </div>
    </motion.button>
  )
}