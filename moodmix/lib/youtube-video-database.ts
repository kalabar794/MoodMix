// Database of popular music videos with working YouTube IDs
// This bypasses the YouTube API quota entirely

interface MusicVideoEntry {
  artist: string
  track: string
  videoId: string
  title: string
  channelTitle: string
  duration: string
}

// Popular music videos that we know exist and work
export const MUSIC_VIDEO_DATABASE: MusicVideoEntry[] = [
  {
    artist: "The Weeknd",
    track: "Blinding Lights",
    videoId: "4NRXx6U8ABQ",
    title: "The Weeknd - Blinding Lights (Official Video)",
    channelTitle: "TheWeekndXO",
    duration: "3:20"
  },
  {
    artist: "Dua Lipa", 
    track: "Levitating",
    videoId: "TUVcZfQe-Kw",
    title: "Dua Lipa - Levitating (Official Music Video)",
    channelTitle: "Dua Lipa",
    duration: "3:23"
  },
  {
    artist: "Harry Styles",
    track: "As It Was", 
    videoId: "H5v3kku4y6Q",
    title: "Harry Styles - As It Was (Official Video)",
    channelTitle: "Harry Styles",
    duration: "2:47"
  },
  {
    artist: "Olivia Rodrigo",
    track: "good 4 u",
    videoId: "gNi_6U5Pm_o", 
    title: "Olivia Rodrigo - good 4 u (Official Video)",
    channelTitle: "Olivia Rodrigo",
    duration: "2:58"
  },
  {
    artist: "Bad Bunny",
    track: "Tití Me Preguntó",
    videoId: "kLIiF1BOU7E",
    title: "Bad Bunny - Tití Me Preguntó (Official Video)",
    channelTitle: "Bad Bunny",
    duration: "4:02"
  },
  {
    artist: "Taylor Swift",
    track: "Shake It Off",
    videoId: "nfWlot6h_JM",
    title: "Taylor Swift - Shake It Off",
    channelTitle: "Taylor Swift",
    duration: "3:39"
  },
  {
    artist: "Ed Sheeran",
    track: "Shape of You",
    videoId: "JGwWNGJdvx8",
    title: "Ed Sheeran - Shape of You (Official Video)",
    channelTitle: "Ed Sheeran", 
    duration: "3:53"
  },
  {
    artist: "Post Malone",
    track: "Circles",
    videoId: "wXhTHyIgQ_U",
    title: "Post Malone - Circles",
    channelTitle: "Post Malone",
    duration: "3:35"
  },
  {
    artist: "Billie Eilish",
    track: "bad guy",
    videoId: "DyDfgMOUjCI",
    title: "Billie Eilish - bad guy (Official Music Video)",
    channelTitle: "Billie Eilish",
    duration: "3:14"
  },
  {
    artist: "Bruno Mars",
    track: "Uptown Funk",
    videoId: "OPf0YbXqDm0",
    title: "Mark Ronson - Uptown Funk (Official Video) ft. Bruno Mars",
    channelTitle: "Mark Ronson",
    duration: "4:30"
  }
]

export function findMusicVideo(trackName: string, artistName: string): MusicVideoEntry | null {
  const normalizeString = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '')
  
  const normalizedTrack = normalizeString(trackName)
  const normalizedArtist = normalizeString(artistName)
  
  // First try exact match
  for (const entry of MUSIC_VIDEO_DATABASE) {
    if (normalizeString(entry.track) === normalizedTrack && 
        normalizeString(entry.artist) === normalizedArtist) {
      return entry
    }
  }
  
  // Then try partial matches
  for (const entry of MUSIC_VIDEO_DATABASE) {
    if (normalizeString(entry.track).includes(normalizedTrack) && 
        normalizeString(entry.artist).includes(normalizedArtist)) {
      return entry
    }
  }
  
  // Try artist match only
  for (const entry of MUSIC_VIDEO_DATABASE) {
    if (normalizeString(entry.artist).includes(normalizedArtist)) {
      return entry
    }
  }
  
  return null
}