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
export async function validateGenres(genres: string[], availableGenres: string[]): Promise<string[]> {
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