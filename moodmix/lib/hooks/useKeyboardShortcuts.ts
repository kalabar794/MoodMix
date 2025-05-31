'use client'

import { useEffect, useCallback } from 'react'

export interface KeyboardShortcuts {
  onMoodSelect?: (moodIndex: number) => void
  onThemeToggle?: () => void
  onResetMood?: () => void
  onNavigate?: (direction: 'up' | 'down' | 'left' | 'right') => void
  onConfirm?: () => void
  isEnabled?: boolean
}

export function useKeyboardShortcuts({
  onMoodSelect,
  onThemeToggle,
  onResetMood,
  onNavigate,
  onConfirm,
  isEnabled = true
}: KeyboardShortcuts) {
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isEnabled) return

    // Don't trigger shortcuts when user is typing in inputs
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement ||
      (event.target as HTMLElement).contentEditable === 'true'
    ) {
      return
    }

    const key = event.key.toLowerCase()
    const isCtrlOrCmd = event.ctrlKey || event.metaKey

    // Prevent default for our handled keys
    const handledKeys = [
      'escape', 'enter', ' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright',
      '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 't'
    ]
    
    if (handledKeys.includes(key) && !isCtrlOrCmd) {
      event.preventDefault()
    }

    switch (key) {
      // Mood selection shortcuts (1-9, 0 for 10th, then handle 11-12)
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        if (onMoodSelect) {
          const moodIndex = parseInt(key) - 1
          onMoodSelect(moodIndex)
        }
        break
      
      case '0':
        if (onMoodSelect) {
          onMoodSelect(9) // 10th mood (0-indexed)
        }
        break

      // Navigation
      case 'arrowup':
        if (onNavigate) onNavigate('up')
        break
      
      case 'arrowdown':
        if (onNavigate) onNavigate('down')
        break
      
      case 'arrowleft':
        if (onNavigate) onNavigate('left')
        break
      
      case 'arrowright':
        if (onNavigate) onNavigate('right')
        break

      // Actions
      case 'enter':
      case ' ':
        if (onConfirm) onConfirm()
        break

      case 'escape':
        if (onResetMood) onResetMood()
        break

      case 't':
        if (!isCtrlOrCmd && onThemeToggle) onThemeToggle()
        break

      // Additional mood shortcuts for 11th and 12th mood
      case '-':
        if (onMoodSelect) onMoodSelect(10) // 11th mood
        break
      
      case '=':
        if (onMoodSelect) onMoodSelect(11) // 12th mood
        break
    }
  }, [onMoodSelect, onThemeToggle, onResetMood, onNavigate, onConfirm, isEnabled])

  useEffect(() => {
    if (!isEnabled) return

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown, isEnabled])

  return {
    // Helper function to get mood shortcuts
    getMoodShortcuts: () => [
      '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='
    ],
    // Helper function to get all shortcuts
    getAllShortcuts: () => ({
      'Mood Selection': '1-9, 0, -, =',
      'Navigate': '← → ↑ ↓',
      'Select/Confirm': 'Enter, Space',
      'Reset': 'Escape',
      'Toggle Theme': 'T'
    })
  }
}