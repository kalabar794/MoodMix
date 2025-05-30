# 08. Mood Mapping Logic

## Create Mood to Music Parameter Mapping

### Step 1: Create lib/moodMapping.ts

```typescript
import { MoodSelection, MoodMusicParams } from './types'

// Mood to Spotify audio features mapping
const MOOD_MAPPINGS = {
  happy: {
    valence: { min: 0.6, max: 0.9 },
    energy: { min: 0.5, max: 0.8 },
    danceability: { min: 0.6, max: 0.9 },
    genres: ['pop', 'indie-pop', 'dance', 'happy']
  },
  excited: {
    valence: { min: 0.7, max: 1.0 },
    energy: { min: 0.7, max: 1.0 },
    danceability: { min: 0.7, max: 1.0 },
    genres: ['edm', 'dance', 'electronic', 'power-pop']
  },
  energetic: {
    valence: { min: 0.5, max: 0.8 },
    energy: { min: 0.8, max: 1.0 },
    danceability: { min: 0.6, max: 0.9 },
    genres: ['rock', 'electronic', 'hip-hop', 'workout']
  },
  love: {
    valence: { min: 0.6, max: 0.9 },
    energy: { min: 0.3, max: 0.6 },
    danceability: { min: 0.4, max: 0.7 },
    genres: ['romance', 'r-n-b', 'soul', 'indie']
  },
  sad: {
    valence: { min: 0.0, max: 0.4 },
    energy: { min: 0.1, max: 0.5 },
    danceability: { min: 0.2, max: 0.5 },
    genres: ['sad', 'acoustic', 'indie', 'singer-songwriter']
  },
  calm: {
    valence: { min: 0.4, max: 0.7 },
    energy: { min: 0.1, max: 0.4 },
    danceability: { min: 0.2, max: 0.5 },
    genres: ['ambient', 'chill', 'acoustic', 'classical']
  },
  angry: {
    valence: { min: 0.1, max: 0.4 },
    energy: { min: 0.7, max: 1.0 },
    danceability: { min: 0.5, max: 0.8 },
    genres: ['metal', 'rock', 'punk', 'hard-rock']
  },
  anxious: {
    valence: { min: 0.2, max: 0.5 },
    energy: { min: 0.5, max: 0.8 },
    danceability: { min: 0.3, max: 0.6 },
    genres: ['electronic', 'ambient', 'post-rock', 'experimental']
  },
  focused: {
    valence: { min: 0.4, max: 0.6 },
    energy: { min: 0.4, max: 0.7 },
    danceability: { min: 0.3, max: 0.6 },
    genres: ['study', 'classical', 'ambient', 'lo-fi']
  },
  nostalgic: {
    valence: { min: 0.3, max: 0.6 },
    energy: { min: 0.3, max: 0.6 },
    danceability: { min: 0.4, max: 0.7 },
    genres: ['indie', 'folk', 'alternative', 'classic-rock']
  }
}

// Intensity affects the range of parameters
function adjustForIntensity(value: number, intensity: number): number {
  // Intensity 0-100, where 100 is most intense
  const factor = intensity / 100
  
  // For high intensity, push values to extremes
  if (value > 0.5) {
    return value + (1 - value) * factor * 0.3
  } else {
    return value - value * factor * 0.3
  }
}

// Convert mood selection to Spotify parameters
export function moodToMusicParams(mood: MoodSelection): MoodMusicParams {
  const mapping = MOOD_MAPPINGS[mood.primary as keyof typeof MOOD_MAPPINGS]
  
  if (!mapping) {
    // Fallback to happy if mood not found
    console.warn(`Mood ${mood.primary} not found, using happy as default`)
    return moodToMusicParams({ ...mood, primary: 'happy' })
  }

  // Calculate target values based on mood and intensity
  const valenceRange = mapping.valence
  const energyRange = mapping.energy
  const danceabilityRange = mapping.danceability

  // Use intensity to determine where in the range we fall
  const intensityFactor = mood.intensity / 100

  // Higher intensity = closer to max values
  const targetValence = valenceRange.min + (valenceRange.max - valenceRange.min) * intensityFactor
  const targetEnergy = energyRange.min + (energyRange.max - energyRange.min) * intensityFactor
  const targetDanceability = danceabilityRange.min + (danceabilityRange.max - danceabilityRange.min) * intensityFactor

  return {
    valence: adjustForIntensity(targetValence, mood.intensity),
    energy: adjustForIntensity(targetEnergy, mood.intensity),
    danceability: adjustForIntensity(targetDanceability, mood.intensity),
    genres: selectGenresForMood(mapping.genres, mood.intensity),
    limit: 20
  }
}

// Select appropriate genres based on intensity
function selectGenresForMood(baseGenres: string[], intensity: number): string[] {
  // For mirror mode, we want genres that match the mood
  // Higher intensity might mean more specific genre selection
  
  if (intensity > 70) {
    // High intensity - use more specific genres
    return baseGenres.slice(0, 2)
  } else if (intensity > 40) {
    // Medium intensity - balanced selection
    return baseGenres.slice(0, 3)
  } else {
    // Low intensity - broader selection
    return baseGenres
  }
}

// Get search keywords based on mood (for text-based search fallback)
export function getMoodKeywords(mood: MoodSelection): string[] {
  const keywordMap: Record<string, string[]> = {
    happy: ['upbeat', 'cheerful', 'positive', 'joyful', 'bright'],
    excited: ['energetic', 'thrilling', 'dynamic', 'intense', 'powerful'],
    energetic: ['high energy', 'pumped', 'active', 'vigorous', 'lively'],
    love: ['romantic', 'passionate', 'tender', 'intimate', 'heartfelt'],
    sad: ['melancholy', 'sorrowful', 'emotional', 'heartbreak', 'lonely'],
    calm: ['peaceful', 'relaxing', 'serene', 'tranquil', 'soothing'],
    angry: ['aggressive', 'intense', 'fierce', 'rage', 'furious'],
    anxious: ['tense', 'nervous', 'unsettled', 'worried', 'restless'],
    focused: ['concentration', 'study', 'productive', 'mindful', 'clear'],
    nostalgic: ['memories', 'throwback', 'classic', 'vintage', 'reminiscent']
  }

  return keywordMap[mood.primary] || keywordMap.happy
}

// Get mood description for UI
export function getMoodDescription(mood: MoodSelection): string {
  const descriptions: Record<string, string> = {
    happy: "Uplifting tunes to match your joyful vibe",
    excited: "High-energy tracks for your enthusiastic mood",
    energetic: "Powerful music to fuel your energy",
    love: "Romantic melodies for matters of the heart",
    sad: "Emotional songs that understand your feelings",
    calm: "Peaceful sounds for your tranquil state",
    angry: "Intense music to channel your emotions",
    anxious: "Rhythmic tracks to ease your mind",
    focused: "Concentration-enhancing soundscapes",
    nostalgic: "Timeless tunes for your reflective mood"
  }

  return descriptions[mood.primary] || "Music matched to your mood"
}

// Validate if genres are available on Spotify
export async function validateGenres(genres: string[], availableGenres: string[]): string[] {
  return genres.filter(genre => availableGenres.includes(genre))
}

// Get complementary moods (for future features)
export function getComplementaryMoods(primaryMood: string): string[] {
  const complementMap: Record<string, string[]> = {
    happy: ['excited', 'energetic', 'love'],
    sad: ['calm', 'nostalgic', 'love'],
    energetic: ['happy', 'excited', 'angry'],
    calm: ['focused', 'love', 'nostalgic'],
    angry: ['energetic', 'sad', 'anxious'],
    love: ['happy', 'calm', 'nostalgic'],
    excited: ['happy', 'energetic', 'love'],
    anxious: ['calm', 'focused', 'sad'],
    focused: ['calm', 'energetic', 'anxious'],
    nostalgic: ['sad', 'calm', 'love']
  }

  return complementMap[primaryMood] || ['happy', 'calm', 'energetic']
}
```

### Step 2: Create app/api/mood-to-music/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { searchTracksByMood, getAvailableGenres } from '@/lib/spotify'
import { moodToMusicParams, validateGenres, getMoodDescription } from '@/lib/moodMapping'
import { MoodSelection } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const moodSelection: MoodSelection = body

    if (!moodSelection.primary || !moodSelection.intensity) {
      return NextResponse.json(
        { error: 'Invalid mood selection' },
        { status: 400 }
      )
    }

    // Convert mood to music parameters
    const musicParams = moodToMusicParams(moodSelection)

    // Get available genres and validate
    const availableGenres = await getAvailableGenres()
    const validatedGenres = await validateGenres(musicParams.genres, availableGenres)

    // If no valid genres, use fallback
    if (validatedGenres.length === 0) {
      console.warn('No valid genres found, using pop as fallback')
      validatedGenres.push('pop')
    }

    // Search for tracks
    const tracks = await searchTracksByMood({
      ...musicParams,
      genres: validatedGenres
    })

    // Get mood description
    const description = getMoodDescription(moodSelection)

    return NextResponse.json({
      success: true,
      mood: moodSelection,
      description,
      tracks,
      params: {
        ...musicParams,
        genres: validatedGenres
      }
    })

  } catch (error) {
    console.error('Error in mood-to-music API:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get music recommendations',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
```

### Step 3: Test the Mood Mapping

Add a test function to your `app/page.tsx`:

```tsx
// Add this function to test mood mapping
const testMoodMapping = async () => {
  if (!currentMood) {
    alert('Please select a mood first!')
    return
  }

  try {
    const response = await fetch('/api/mood-to-music', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(currentMood),
    })

    const data = await response.json()
    console.log('Mood mapping result:', data)

    if (data.success) {
      alert(`Found ${data.tracks.length} tracks for ${currentMood.primary} mood!`)
    } else {
      alert(`Error: ${data.message}`)
    }
  } catch (error) {
    console.error('Test failed:', error)
    alert('Failed to test mood mapping')
  }
}

// Add this button temporarily
<button
  onClick={testMoodMapping}
  className="glass glass-hover px-4 py-2 rounded-lg"
>
  Test Mood Mapping
</button>
```

### Key Features of the Mood Mapping System

1. **Intensity-Based Adjustment**: Higher intensity pushes parameters to extremes
2. **Genre Selection**: Automatically selects appropriate genres per mood
3. **Fallback Handling**: Gracefully handles missing genres
4. **Descriptive Text**: Provides mood-appropriate descriptions
5. **Complementary Moods**: Can suggest related moods for exploration

### Mood Parameter Ranges

| Mood | Valence | Energy | Danceability | Example Genres |
|------|---------|---------|--------------|----------------|
| Happy | 0.6-0.9 | 0.5-0.8 | 0.6-0.9 | pop, indie-pop, dance |
| Sad | 0.0-0.4 | 0.1-0.5 | 0.2-0.5 | acoustic, indie |
| Energetic | 0.5-0.8 | 0.8-1.0 | 0.6-0.9 | rock, electronic |
| Calm | 0.4-0.7 | 0.1-0.4 | 0.2-0.5 | ambient, chill |

## Next Steps
Move on to `09-music-results-component.md` to display the music recommendations.