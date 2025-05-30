import { MoodSelection, MoodMusicParams } from './types'

// Mood to Spotify audio features mapping
const MOOD_MAPPINGS = {
  euphoric: {
    valence: { min: 0.8, max: 1.0 },
    energy: { min: 0.7, max: 0.9 },
    danceability: { min: 0.7, max: 0.9 },
    genres: ['pop', 'dance', 'electronic', 'happy']
  },
  melancholic: {
    valence: { min: 0.0, max: 0.3 },
    energy: { min: 0.1, max: 0.4 },
    danceability: { min: 0.2, max: 0.4 },
    genres: ['sad', 'indie', 'alternative', 'singer-songwriter']
  },
  energetic: {
    valence: { min: 0.6, max: 0.9 },
    energy: { min: 0.8, max: 1.0 },
    danceability: { min: 0.7, max: 1.0 },
    genres: ['rock', 'electronic', 'hip-hop', 'workout']
  },
  serene: {
    valence: { min: 0.4, max: 0.7 },
    energy: { min: 0.1, max: 0.3 },
    danceability: { min: 0.2, max: 0.4 },
    genres: ['ambient', 'chill', 'classical', 'new-age']
  },
  passionate: {
    valence: { min: 0.6, max: 0.9 },
    energy: { min: 0.5, max: 0.8 },
    danceability: { min: 0.5, max: 0.8 },
    genres: ['r-n-b', 'soul', 'latin', 'romance']
  },
  contemplative: {
    valence: { min: 0.3, max: 0.6 },
    energy: { min: 0.2, max: 0.5 },
    danceability: { min: 0.2, max: 0.4 },
    genres: ['classical', 'ambient', 'post-rock', 'jazz']
  },
  nostalgic: {
    valence: { min: 0.3, max: 0.6 },
    energy: { min: 0.3, max: 0.6 },
    danceability: { min: 0.4, max: 0.6 },
    genres: ['indie', 'folk', 'classic-rock', 'oldies']
  },
  rebellious: {
    valence: { min: 0.4, max: 0.7 },
    energy: { min: 0.7, max: 1.0 },
    danceability: { min: 0.6, max: 0.9 },
    genres: ['punk', 'rock', 'metal', 'alternative']
  },
  mystical: {
    valence: { min: 0.4, max: 0.7 },
    energy: { min: 0.3, max: 0.6 },
    danceability: { min: 0.3, max: 0.6 },
    genres: ['ambient', 'world', 'electronic', 'experimental']
  },
  triumphant: {
    valence: { min: 0.7, max: 1.0 },
    energy: { min: 0.6, max: 0.9 },
    danceability: { min: 0.5, max: 0.8 },
    genres: ['pop', 'rock', 'soundtrack', 'inspirational']
  },
  vulnerable: {
    valence: { min: 0.2, max: 0.5 },
    energy: { min: 0.2, max: 0.5 },
    danceability: { min: 0.2, max: 0.4 },
    genres: ['acoustic', 'folk', 'indie', 'singer-songwriter']
  },
  adventurous: {
    valence: { min: 0.6, max: 0.9 },
    energy: { min: 0.6, max: 0.8 },
    danceability: { min: 0.5, max: 0.8 },
    genres: ['world', 'electronic', 'pop', 'alternative']
  },
  // Legacy moods for backward compatibility
  happy: {
    valence: { min: 0.6, max: 0.9 },
    energy: { min: 0.5, max: 0.8 },
    danceability: { min: 0.6, max: 0.9 },
    genres: ['pop', 'indie-pop', 'dance', 'happy']
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
    euphoric: ['ecstatic', 'blissful', 'elated', 'joyous', 'radiant'],
    melancholic: ['melancholy', 'sorrowful', 'wistful', 'pensive', 'bittersweet'],
    energetic: ['high energy', 'pumped', 'dynamic', 'vigorous', 'intense'],
    serene: ['peaceful', 'tranquil', 'calm', 'zen', 'meditative'],
    passionate: ['intense', 'fiery', 'romantic', 'sensual', 'ardent'],
    contemplative: ['thoughtful', 'reflective', 'introspective', 'philosophical', 'deep'],
    nostalgic: ['memories', 'throwback', 'vintage', 'reminiscent', 'timeless'],
    rebellious: ['defiant', 'fierce', 'bold', 'revolutionary', 'edgy'],
    mystical: ['ethereal', 'spiritual', 'mysterious', 'transcendent', 'otherworldly'],
    triumphant: ['victorious', 'successful', 'powerful', 'conquering', 'winning'],
    vulnerable: ['tender', 'exposed', 'raw', 'honest', 'fragile'],
    adventurous: ['exploring', 'wanderlust', 'journey', 'discovery', 'freedom'],
    // Legacy moods
    happy: ['upbeat', 'cheerful', 'positive', 'joyful', 'bright'],
    sad: ['melancholy', 'sorrowful', 'emotional', 'heartbreak', 'lonely'],
    calm: ['peaceful', 'relaxing', 'serene', 'tranquil', 'soothing']
  }

  return keywordMap[mood.primary] || keywordMap.euphoric
}

// Get mood description for UI
export function getMoodDescription(mood: MoodSelection): string {
  const descriptions: Record<string, string> = {
    euphoric: "Blissful melodies that amplify your pure joy and elation",
    melancholic: "Contemplative soundscapes for your introspective moments",
    energetic: "High-octane tracks to fuel your dynamic spirit",
    serene: "Tranquil compositions for your peaceful state of mind",
    passionate: "Intense rhythms that match your fiery emotions",
    contemplative: "Thoughtful music for deep reflection and meditation",
    nostalgic: "Timeless melodies that transport you through cherished memories",
    rebellious: "Bold anthems for your defiant and revolutionary spirit",
    mystical: "Ethereal sounds that connect you to the otherworldly",
    triumphant: "Victorious compositions celebrating your achievements",
    vulnerable: "Tender music that honors your open and honest emotions",
    adventurous: "Exploratory soundtracks for your journey of discovery",
    // Legacy descriptions
    happy: "Uplifting tunes to match your joyful vibe",
    sad: "Emotional songs that understand your feelings",
    calm: "Peaceful sounds for your tranquil state"
  }

  return descriptions[mood.primary] || "Music perfectly matched to your emotional state"
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