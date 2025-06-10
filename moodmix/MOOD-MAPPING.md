# Mood Mapping System

## Overview
The mood mapping system converts user emotional selections into precise Spotify Web API parameters for accurate music recommendations.

## Core Files

### 1. `/lib/moodMapping.ts`
Main mood-to-music conversion logic:

```typescript
import { MoodSelection, MoodMusicParams } from './types'

// Convert mood selection to Spotify Web API parameters
export function moodToMusicParams(mood: MoodSelection): MoodMusicParams {
  const params: MoodMusicParams = {
    valence: 0.5,      // Emotional positivity (0.0 = negative, 1.0 = positive)
    energy: 0.5,       // Energy level (0.0 = calm, 1.0 = energetic)
    danceability: 0.5, // How suitable for dancing
    acousticness: 0.3, // Acoustic vs electronic preference
    genres: [],
    limit: 20
  }

  // Intensity factor (0-100 -> 0.0-1.0)
  const intensity = mood.intensity / 100

  switch (mood.primary) {
    case 'euphoric':
      params.valence = 0.8 + (intensity * 0.2)      // Very positive
      params.energy = 0.7 + (intensity * 0.3)       // High energy
      params.danceability = 0.8 + (intensity * 0.2) // Very danceable
      params.acousticness = 0.1 + (intensity * 0.2) // Electronic preference
      params.genres = ['pop', 'dance', 'electronic', 'house', 'disco']
      break

    case 'energetic':
      params.valence = 0.6 + (intensity * 0.3)      // Positive
      params.energy = 0.8 + (intensity * 0.2)       // Very high energy
      params.danceability = 0.7 + (intensity * 0.3) // Danceable
      params.acousticness = 0.2 + (intensity * 0.1) // Mostly electronic
      params.genres = ['rock', 'pop-rock', 'punk', 'alternative', 'electronic']
      break

    case 'serene':
      params.valence = 0.6 + (intensity * 0.2)      // Moderately positive
      params.energy = 0.2 - (intensity * 0.1)       // Low energy
      params.danceability = 0.3 - (intensity * 0.2) // Not very danceable
      params.acousticness = 0.6 + (intensity * 0.3) // Acoustic preference
      params.genres = ['ambient', 'chill', 'acoustic', 'folk', 'new-age']
      break

    case 'passionate':
      params.valence = 0.7 + (intensity * 0.2)      // Positive
      params.energy = 0.6 + (intensity * 0.3)       // Medium-high energy
      params.danceability = 0.6 + (intensity * 0.3) // Danceable
      params.acousticness = 0.3 - (intensity * 0.2) // Mixed acoustic/electronic
      params.genres = ['r-n-b', 'soul', 'funk', 'latin', 'romantic']
      break

    case 'melancholic':
      params.valence = 0.2 + (intensity * 0.2)      // Low positivity
      params.energy = 0.3 + (intensity * 0.2)       // Low-medium energy
      params.danceability = 0.3 - (intensity * 0.1) // Not very danceable
      params.acousticness = 0.5 + (intensity * 0.3) // Acoustic preference
      params.genres = ['indie', 'alternative', 'folk', 'acoustic', 'sad']
      break

    case 'contemplative':
      params.valence = 0.4 + (intensity * 0.3)      // Neutral to positive
      params.energy = 0.3 + (intensity * 0.2)       // Low-medium energy
      params.danceability = 0.2 + (intensity * 0.2) // Not danceable
      params.acousticness = 0.6 + (intensity * 0.2) // Acoustic preference
      params.genres = ['classical', 'ambient', 'post-rock', 'instrumental', 'meditation']
      break

    case 'nostalgic':
      params.valence = 0.5 + (intensity * 0.2)      // Neutral to positive
      params.energy = 0.4 + (intensity * 0.3)       // Medium energy
      params.danceability = 0.5 + (intensity * 0.2) // Moderately danceable
      params.acousticness = 0.4 + (intensity * 0.3) // Mixed preference
      params.genres = ['oldies', 'classic-rock', 'retro', 'vintage', '80s']
      break

    case 'rebellious':
      params.valence = 0.3 + (intensity * 0.4)      // Low to medium positivity
      params.energy = 0.8 + (intensity * 0.2)       // Very high energy
      params.danceability = 0.4 + (intensity * 0.3) // Moderately danceable
      params.acousticness = 0.1 + (intensity * 0.2) // Electronic/loud preference
      params.genres = ['punk', 'metal', 'hard-rock', 'grunge', 'alternative']
      break

    case 'mystical':
      params.valence = 0.5 + (intensity * 0.3)      // Neutral to positive
      params.energy = 0.4 + (intensity * 0.3)       // Medium energy
      params.danceability = 0.4 + (intensity * 0.3) // Moderately danceable
      params.acousticness = 0.3 + (intensity * 0.4) // Mixed preference
      params.genres = ['psychedelic', 'ambient', 'world-music', 'electronic', 'experimental']
      break

    case 'triumphant':
      params.valence = 0.8 + (intensity * 0.2)      // Very positive
      params.energy = 0.7 + (intensity * 0.3)       // High energy
      params.danceability = 0.6 + (intensity * 0.3) // Danceable
      params.acousticness = 0.2 + (intensity * 0.2) // Electronic preference
      params.genres = ['anthemic', 'rock', 'pop', 'orchestral', 'epic']
      break

    case 'vulnerable':
      params.valence = 0.3 + (intensity * 0.3)      // Low to medium positivity
      params.energy = 0.2 + (intensity * 0.3)       // Low energy
      params.danceability = 0.2 + (intensity * 0.2) // Not very danceable
      params.acousticness = 0.7 + (intensity * 0.2) // Strong acoustic preference
      params.genres = ['singer-songwriter', 'acoustic', 'indie-folk', 'emotional', 'ballad']
      break

    case 'adventurous':
      params.valence = 0.6 + (intensity * 0.3)      // Positive
      params.energy = 0.6 + (intensity * 0.3)       // Medium-high energy
      params.danceability = 0.5 + (intensity * 0.3) // Moderately danceable
      params.acousticness = 0.3 + (intensity * 0.2) // Mixed preference
      params.genres = ['world-music', 'reggae', 'folk', 'country', 'bluegrass']
      break

    default:
      // Neutral/unknown mood
      params.valence = 0.5
      params.energy = 0.5
      params.danceability = 0.5
      params.acousticness = 0.4
      params.genres = ['pop', 'rock', 'indie', 'alternative']
  }

  // Ensure values stay within Spotify's 0.0-1.0 range
  params.valence = Math.max(0.0, Math.min(1.0, params.valence))
  params.energy = Math.max(0.0, Math.min(1.0, params.energy))
  params.danceability = Math.max(0.0, Math.min(1.0, params.danceability))
  params.acousticness = Math.max(0.0, Math.min(1.0, params.acousticness))

  return params
}

// Validate genres against Spotify's available genres
export async function validateGenres(requestedGenres: string[], availableGenres: string[]): Promise<string[]> {
  const validGenres = requestedGenres.filter(genre => 
    availableGenres.includes(genre)
  )
  
  // If no valid genres, return popular fallbacks
  if (validGenres.length === 0) {
    const fallbacks = ['pop', 'rock', 'indie', 'alternative', 'electronic']
    return fallbacks.filter(genre => availableGenres.includes(genre))
  }
  
  return validGenres.slice(0, 5) // Spotify API limit
}

// Generate mood description for UI
export function getMoodDescription(mood: MoodSelection): string {
  const descriptions: Record<string, string> = {
    euphoric: `Pure joy and exhilaration! Here are uplifting tracks that capture your ${mood.intensity}% euphoric energy.`,
    energetic: `High-energy vibes incoming! These dynamic tracks match your ${mood.intensity}% energetic mood perfectly.`,
    serene: `Peaceful and tranquil sounds to complement your ${mood.intensity}% serene state of mind.`,
    passionate: `Intense and romantic melodies that fuel your ${mood.intensity}% passionate feelings.`,
    melancholic: `Beautifully emotional tracks that understand your ${mood.intensity}% melancholic mood.`,
    contemplative: `Thoughtful and introspective music for your ${mood.intensity}% contemplative mindset.`,
    nostalgic: `Memory-evoking classics that perfectly capture your ${mood.intensity}% nostalgic feelings.`,
    rebellious: `Bold and defiant tracks that channel your ${mood.intensity}% rebellious spirit.`,
    mystical: `Ethereal and otherworldly sounds that match your ${mood.intensity}% mystical state.`,
    triumphant: `Victory anthems and celebratory tracks for your ${mood.intensity}% triumphant mood!`,
    vulnerable: `Tender and heartfelt songs that embrace your ${mood.intensity}% vulnerable emotions.`,
    adventurous: `Bold and explorative tracks for your ${mood.intensity}% adventurous spirit.`
  }

  return descriptions[mood.primary] || `Beautiful tracks curated for your ${mood.primary} mood at ${mood.intensity}% intensity.`
}

// Generate search keywords for fallback searches
export function getMoodKeywords(mood: MoodSelection): string[] {
  const keywordMap: Record<string, string[]> = {
    euphoric: ['happy', 'uplifting', 'joyful', 'celebratory', 'positive', 'energetic'],
    energetic: ['upbeat', 'energetic', 'powerful', 'dynamic', 'intense', 'driving'],
    serene: ['calm', 'peaceful', 'relaxing', 'tranquil', 'soothing', 'meditation'],
    passionate: ['romantic', 'intense', 'emotional', 'love', 'passionate', 'sultry'],
    melancholic: ['sad', 'emotional', 'melancholy', 'heartbreak', 'blues', 'longing'],
    contemplative: ['thoughtful', 'introspective', 'ambient', 'minimal', 'reflective', 'quiet'],
    nostalgic: ['nostalgic', 'vintage', 'classic', 'retro', 'memories', 'timeless'],
    rebellious: ['aggressive', 'rebel', 'punk', 'defiant', 'raw', 'powerful'],
    mystical: ['ethereal', 'mystical', 'otherworldly', 'ambient', 'spiritual', 'transcendent'],
    triumphant: ['victory', 'triumphant', 'epic', 'powerful', 'uplifting', 'anthemic'],
    vulnerable: ['tender', 'vulnerable', 'gentle', 'acoustic', 'intimate', 'heartfelt'],
    adventurous: ['adventure', 'journey', 'exploration', 'world', 'travel', 'discovery']
  }

  return keywordMap[mood.primary] || ['music', 'popular', 'trending']
}

// Map mood to color schemes (for UI theming)
export function getMoodColorScheme(mood: string): { primary: string; secondary: string; accent: string } {
  const colorSchemes: Record<string, { primary: string; secondary: string; accent: string }> = {
    euphoric: { primary: '#FFD700', secondary: '#FFA500', accent: '#FF6347' },
    energetic: { primary: '#FF4500', secondary: '#FF1493', accent: '#FF00FF' },
    serene: { primary: '#00FF7F', secondary: '#40E0D0', accent: '#48D1CC' },
    passionate: { primary: '#DC143C', secondary: '#FF4500', accent: '#FF1493' },
    melancholic: { primary: '#4682B4', secondary: '#6495ED', accent: '#7B68EE' },
    contemplative: { primary: '#8A2BE2', secondary: '#4B0082', accent: '#483D8B' },
    nostalgic: { primary: '#FFB6C1', secondary: '#DDA0DD', accent: '#E6E6FA' },
    rebellious: { primary: '#FF0000', secondary: '#8B0000', accent: '#FF4500' },
    mystical: { primary: '#9300D3', secondary: '#4B0082', accent: '#8A2BE2' },
    triumphant: { primary: '#FFD700', secondary: '#FF8C00', accent: '#FFA500' },
    vulnerable: { primary: '#B0C4DE', secondary: '#AFEEEE', accent: '#E6E6FA' },
    adventurous: { primary: '#228B22', secondary: '#FF8C00', accent: '#FFD700' }
  }

  return colorSchemes[mood] || { primary: '#6366f1', secondary: '#8b5cf6', accent: '#ec4899' }
}

// Generate mood-specific playlist names
export function generatePlaylistName(mood: MoodSelection): string {
  const templates: Record<string, string[]> = {
    euphoric: [
      `Pure Joy Mix`,
      `Euphoric Vibes ${mood.intensity}%`,
      `Blissful Beats`,
      `Cloud Nine Playlist`
    ],
    energetic: [
      `High Energy Mix`,
      `Power ${mood.intensity}% Playlist`,
      `Adrenaline Rush`,
      `Dynamic Beats`
    ],
    serene: [
      `Peaceful Moments`,
      `Serenity ${mood.intensity}%`,
      `Tranquil Tracks`,
      `Calm Waters`
    ],
    passionate: [
      `Passionate Playlist`,
      `Fire & Desire`,
      `Intense ${mood.intensity}%`,
      `Romantic Rhythms`
    ],
    melancholic: [
      `Melancholy Mix`,
      `Blue ${mood.intensity}%`,
      `Emotional Journey`,
      `Heartfelt Harmonies`
    ],
    contemplative: [
      `Deep Thoughts`,
      `Contemplative ${mood.intensity}%`,
      `Reflective Sounds`,
      `Mindful Music`
    ],
    nostalgic: [
      `Memory Lane`,
      `Nostalgic ${mood.intensity}%`,
      `Throwback Tracks`,
      `Golden Memories`
    ],
    rebellious: [
      `Rebel Playlist`,
      `Defiant ${mood.intensity}%`,
      `Revolution Mix`,
      `Raw Power`
    ],
    mystical: [
      `Mystical Journey`,
      `Ethereal ${mood.intensity}%`,
      `Otherworldly Mix`,
      `Cosmic Sounds`
    ],
    triumphant: [
      `Victory Anthems`,
      `Triumphant ${mood.intensity}%`,
      `Champion Mix`,
      `Epic Wins`
    ],
    vulnerable: [
      `Tender Moments`,
      `Vulnerable ${mood.intensity}%`,
      `Gentle Hearts`,
      `Intimate Playlist`
    ],
    adventurous: [
      `Adventure Awaits`,
      `Wanderlust ${mood.intensity}%`,
      `Journey Mix`,
      `Explorer's Soundtrack`
    ]
  }

  const options = templates[mood.primary] || [`${mood.primary} Mix`, `Mood ${mood.intensity}%`]
  return options[Math.floor(Math.random() * options.length)]
}
```

### 2. `/lib/types.ts`
Type definitions for mood system:

```typescript
export interface MoodSelection {
  primary: string      // Main mood (euphoric, energetic, etc.)
  intensity: number    // 0-100 intensity level
  color: string        // Hex color representation
  coordinates: {       // Position on mood wheel
    x: number
    y: number
  }
}

export interface MoodMusicParams {
  valence: number      // 0.0-1.0 (negative to positive)
  energy: number       // 0.0-1.0 (low to high energy)
  danceability: number // 0.0-1.0 (not danceable to very danceable)
  acousticness: number // 0.0-1.0 (electronic to acoustic)
  genres: string[]     // Array of Spotify genre seeds
  limit: number        // Number of tracks to return
}

export interface MoodTheme {
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
  }
  audio: {
    valence: [number, number]     // min, max range
    energy: [number, number]      // min, max range
    danceability: [number, number] // min, max range
    acousticness: [number, number] // min, max range
  }
  genres: string[]
  keywords: string[]
}
```

### 3. Mood Wheel Component (`/components/MoodCardSelector.tsx`)
```typescript
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MoodSelection } from '@/lib/types'
import { getMoodColorScheme } from '@/lib/moodMapping'

const MOODS = [
  { name: 'euphoric', emoji: '😄', description: 'Pure joy and excitement' },
  { name: 'energetic', emoji: '⚡', description: 'High energy and drive' },
  { name: 'serene', emoji: '🧘', description: 'Calm and peaceful' },
  { name: 'passionate', emoji: '❤️', description: 'Intense and romantic' },
  { name: 'melancholic', emoji: '💭', description: 'Thoughtfully sad' },
  { name: 'contemplative', emoji: '🤔', description: 'Deep in thought' },
  { name: 'nostalgic', emoji: '📸', description: 'Longing for the past' },
  { name: 'rebellious', emoji: '🔥', description: 'Defiant and bold' },
  { name: 'mystical', emoji: '✨', description: 'Otherworldly and ethereal' },
  { name: 'triumphant', emoji: '🏆', description: 'Victorious and proud' },
  { name: 'vulnerable', emoji: '🌙', description: 'Open and tender' },
  { name: 'adventurous', emoji: '🌍', description: 'Ready to explore' }
]

interface MoodCardSelectorProps {
  onMoodSelect: (mood: MoodSelection) => void
}

export default function MoodCardSelector({ onMoodSelect }: MoodCardSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [intensity, setIntensity] = useState(75)

  const handleMoodClick = (moodName: string) => {
    setSelectedMood(moodName)
    
    const colorScheme = getMoodColorScheme(moodName)
    const moodSelection: MoodSelection = {
      primary: moodName,
      intensity,
      color: colorScheme.primary,
      coordinates: { x: 0, y: 0 } // Simplified for card selector
    }
    
    // Small delay for visual feedback
    setTimeout(() => {
      onMoodSelect(moodSelection)
    }, 300)
  }

  return (
    <div className="space-y-8">
      {/* Intensity Slider */}
      <div className="glass-card p-6 text-center">
        <h3 className="text-heading mb-4">Intensity Level</h3>
        <div className="flex items-center gap-4">
          <span className="text-small">Mild</span>
          <div className="flex-1 relative">
            <input
              type="range"
              min="10"
              max="100"
              value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 
                         [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-400"
            />
          </div>
          <span className="text-small">Intense</span>
        </div>
        <div className="mt-2 text-caption">{intensity}%</div>
      </div>

      {/* Mood Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {MOODS.map((mood) => (
          <motion.button
            key={mood.name}
            onClick={() => handleMoodClick(mood.name)}
            className={`glass-card p-6 text-center transition-all duration-300 ${
              selectedMood === mood.name ? 'ring-2 ring-purple-400' : ''
            }`}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: MOODS.indexOf(mood) * 0.1 }}
          >
            <div className="text-4xl mb-3">{mood.emoji}</div>
            <h3 className="text-body font-semibold mb-2 capitalize">{mood.name}</h3>
            <p className="text-caption text-white/70">{mood.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
```

## Key Features

1. **Precise Mapping**: Each mood maps to specific Spotify audio features
2. **Intensity Scaling**: User intensity (0-100%) adjusts all parameters proportionally
3. **Genre Validation**: Validates requested genres against Spotify's available genres
4. **Fallback Keywords**: Provides search keywords when API recommendations fail
5. **Color Theming**: Maps moods to UI color schemes for visual consistency
6. **Playlist Naming**: Generates appropriate playlist names based on mood
7. **Range Constraints**: Ensures all values stay within Spotify's 0.0-1.0 range

## Spotify Audio Features Explained

- **Valence**: Emotional positivity (sad songs = low, happy songs = high)
- **Energy**: Perceived intensity and activity (ballads = low, rock = high)  
- **Danceability**: How suitable for dancing (classical = low, dance music = high)
- **Acousticness**: Whether track is acoustic (electric guitar = low, acoustic guitar = high)

## Mood Categories

### High Energy, Positive
- **Euphoric**: Maximum positivity and energy
- **Energetic**: High energy with moderate positivity
- **Triumphant**: Victory and celebration themes

### Low Energy, Positive  
- **Serene**: Peaceful and calming
- **Contemplative**: Thoughtful and introspective
- **Adventurous**: Exploratory but not aggressive

### High Energy, Negative
- **Rebellious**: Aggressive and defiant
- **Passionate**: Intense emotions (love/anger)

### Low Energy, Negative
- **Melancholic**: Beautifully sad
- **Vulnerable**: Tender and exposed
- **Nostalgic**: Longing for the past

### Mystical
- **Mystical**: Otherworldly and ethereal (neutral energy/valence)

## Usage Examples

```typescript
// Convert mood to Spotify parameters
const mood: MoodSelection = {
  primary: 'energetic',
  intensity: 80,
  color: '#FF4500',
  coordinates: { x: 0.8, y: 0.6 }
}

const musicParams = moodToMusicParams(mood)
// Results in: { valence: 0.84, energy: 0.96, danceability: 0.94, ... }

// Generate description
const description = getMoodDescription(mood)
// "High-energy vibes incoming! These dynamic tracks match your 80% energetic mood perfectly."

// Get color scheme for UI
const colors = getMoodColorScheme('energetic')
// { primary: '#FF4500', secondary: '#FF1493', accent: '#FF00FF' }
```

## Calibration Notes

- Values are calibrated based on Spotify's audio feature distributions
- Intensity scaling provides smooth transitions from mild to extreme
- Genre selections prioritize mood-appropriate styles
- Fallback keywords ensure results even when API limits are reached