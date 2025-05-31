'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Keyboard, X } from 'lucide-react'

interface KeyboardShortcutsProps {
  className?: string
}

export default function KeyboardShortcuts({ className = '' }: KeyboardShortcutsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showInitialHint, setShowInitialHint] = useState(false)

  // Show initial hint after page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialHint(true)
    }, 3000)

    const hideTimer = setTimeout(() => {
      setShowInitialHint(false)
    }, 8000)

    return () => {
      clearTimeout(timer)
      clearTimeout(hideTimer)
    }
  }, [])

  // Listen for ? key to toggle help
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '?' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault()
        setIsOpen(prev => !prev)
      }
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const shortcuts = [
    {
      category: 'Mood Selection',
      items: [
        { keys: ['1', '2', '3', '...', '9'], description: 'Select mood 1-9' },
        { keys: ['0'], description: 'Select mood 10 (Triumphant)' },
        { keys: ['-'], description: 'Select mood 11 (Vulnerable)' },
        { keys: ['='], description: 'Select mood 12 (Adventurous)' }
      ]
    },
    {
      category: 'Navigation',
      items: [
        { keys: ['↑', '↓', '←', '→'], description: 'Navigate mood cards' },
        { keys: ['Enter', 'Space'], description: 'Select focused mood' },
        { keys: ['Esc'], description: 'Reset mood / Go back' }
      ]
    },
    {
      category: 'Interface',
      items: [
        { keys: ['T'], description: 'Toggle theme (Dark/Light/Auto)' },
        { keys: ['?'], description: 'Show/hide keyboard shortcuts' }
      ]
    }
  ]

  return (
    <>
      {/* Keyboard shortcut button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`
          relative group w-10 h-10 rounded-lg
          bg-white/5 hover:bg-white/10 
          border border-white/10 hover:border-white/20
          transition-all duration-300
          ${className}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Keyboard shortcuts (?)"
        aria-label="Show keyboard shortcuts"
      >
        <Keyboard className="w-5 h-5 text-white/70 group-hover:text-white transition-colors mx-auto" />
        
        {/* Initial hint tooltip */}
        <AnimatePresence>
          {showInitialHint && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-50"
            >
              <div className="glass-card px-3 py-2 text-xs text-white/80 whitespace-nowrap">
                Press ? for shortcuts
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/10" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Keyboard shortcuts modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="glass-card p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Keyboard className="w-6 h-6 text-purple-400" />
                  <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                    Keyboard Shortcuts
                  </h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-white/70" />
                </button>
              </div>

              {/* Shortcuts list */}
              <div className="space-y-6">
                {shortcuts.map((category, categoryIndex) => (
                  <motion.div
                    key={category.category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: categoryIndex * 0.1 }}
                  >
                    <h3 className="text-sm font-medium text-purple-400 mb-3 uppercase tracking-wide">
                      {category.category}
                    </h3>
                    <div className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <motion.div
                          key={itemIndex}
                          className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: (categoryIndex * 0.1) + (itemIndex * 0.05) }}
                        >
                          <span className="text-sm text-[var(--text-secondary)]">
                            {item.description}
                          </span>
                          <div className="flex gap-1">
                            {item.keys.map((key, keyIndex) => (
                              <span
                                key={keyIndex}
                                className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-mono font-medium text-white/90 bg-white/10 border border-white/20 rounded"
                              >
                                {key}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer tip */}
              <motion.div
                className="mt-6 pt-4 border-t border-white/10 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-xs text-[var(--text-muted)]">
                  Press <span className="font-mono bg-white/10 px-1 py-0.5 rounded">?</span> anytime to toggle this help
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}