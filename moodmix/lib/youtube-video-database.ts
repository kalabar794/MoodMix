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

// Comprehensive database of popular music videos that we know exist and work
export const MUSIC_VIDEO_DATABASE: MusicVideoEntry[] = [
  // Original entries
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
  },

  // Massive expansion for better coverage
  // Pop Hits
  {
    artist: "Taylor Swift",
    track: "Anti-Hero",
    videoId: "b1kbLWvqugk",
    title: "Taylor Swift - Anti-Hero (Official Music Video)",
    channelTitle: "Taylor Swift",
    duration: "3:20"
  },
  {
    artist: "Ariana Grande",
    track: "positions",
    videoId: "tcYodQoapMg",
    title: "Ariana Grande - positions (official video)",
    channelTitle: "Ariana Grande",
    duration: "2:52"
  },
  {
    artist: "Justin Bieber",
    track: "Sorry",
    videoId: "fRh_vgS2dFE",
    title: "Justin Bieber - Sorry (Official Video)",
    channelTitle: "Justin Bieber",
    duration: "3:20"
  },
  {
    artist: "Selena Gomez",
    track: "Lose You To Love Me",
    videoId: "zlJDTxahav0",
    title: "Selena Gomez - Lose You To Love Me (Official Music Video)",
    channelTitle: "Selena Gomez",
    duration: "3:26"
  },
  {
    artist: "Shawn Mendes",
    track: "Stitches",
    videoId: "VbfpW0pbvaU",
    title: "Shawn Mendes - Stitches (Official Video)",
    channelTitle: "Shawn Mendes",
    duration: "3:26"
  },

  // Hip-Hop/Rap
  {
    artist: "Drake",
    track: "God's Plan",
    videoId: "xpVfcZ0ZcFM",
    title: "Drake - God's Plan (Official Music Video)",
    channelTitle: "Drake",
    duration: "4:36"
  },
  {
    artist: "Kendrick Lamar",
    track: "HUMBLE.",
    videoId: "tvTRZJ-4EyI",
    title: "Kendrick Lamar - HUMBLE. (Official Music Video)",
    channelTitle: "Kendrick Lamar",
    duration: "2:57"
  },
  {
    artist: "Travis Scott",
    track: "SICKO MODE",
    videoId: "6ONRf7h3Mdk",
    title: "Travis Scott - SICKO MODE ft. Drake (Official Music Video)",
    channelTitle: "Travis Scott",
    duration: "5:12"
  },

  // Electronic/Dance
  {
    artist: "Calvin Harris",
    track: "Summer",
    videoId: "ebXbLfLACGM",
    title: "Calvin Harris - Summer (Official Video)",
    channelTitle: "Calvin Harris",
    duration: "3:36"
  },
  {
    artist: "David Guetta",
    track: "Titanium",
    videoId: "JRfuAukYTKg",
    title: "David Guetta - Titanium ft. Sia (Official Video)",
    channelTitle: "David Guetta",
    duration: "4:04"
  },
  {
    artist: "Marshmello",
    track: "Happier",
    videoId: "m7Bc3pLyij0",
    title: "Marshmello ft. Bastille - Happier (Official Music Video)",
    channelTitle: "Marshmello",
    duration: "3:54"
  },

  // Rock/Alternative
  {
    artist: "Imagine Dragons",
    track: "Believer",
    videoId: "7wtfhZwyrcc",
    title: "Imagine Dragons - Believer (Official Music Video)",
    channelTitle: "Imagine Dragons",
    duration: "3:36"
  },
  {
    artist: "OneRepublic",
    track: "Counting Stars",
    videoId: "hT_nvWreIhg",
    title: "OneRepublic - Counting Stars (Official Music Video)",
    channelTitle: "OneRepublic",
    duration: "4:17"
  },
  {
    artist: "Coldplay",
    track: "Viva La Vida",
    videoId: "dvgZkm1xWPE",
    title: "Coldplay - Viva La Vida (Official Video)",
    channelTitle: "Coldplay",
    duration: "4:01"
  },

  // R&B/Soul
  {
    artist: "The Weeknd",
    track: "Can't Feel My Face",
    videoId: "KEI4qSrkPAs",
    title: "The Weeknd - Can't Feel My Face (Official Video)",
    channelTitle: "TheWeekndXO",
    duration: "3:35"
  },
  {
    artist: "SZA",
    track: "Good Days",
    videoId: "RF_913jqx6E",
    title: "SZA - Good Days (Official Video)",
    channelTitle: "SZA",
    duration: "4:39"
  },

  // Classic Hits
  {
    artist: "Queen",
    track: "Bohemian Rhapsody",
    videoId: "fJ9rUzIMcZQ",
    title: "Queen - Bohemian Rhapsody (Official Video Remastered)",
    channelTitle: "Queen Official",
    duration: "5:55"
  },
  {
    artist: "Michael Jackson",
    track: "Billie Jean",
    videoId: "Zi_XLOBDo_Y",
    title: "Michael Jackson - Billie Jean (Official Video)",
    channelTitle: "Michael Jackson",
    duration: "4:54"
  },

  // Recent Pop Hits
  {
    artist: "Doja Cat",
    track: "Paint The Town Red",
    videoId: "be7iNHzJzEU",
    title: "Doja Cat - Paint The Town Red (Official Video)",
    channelTitle: "Doja Cat",
    duration: "3:50"
  },
  {
    artist: "Lizzo",
    track: "About Damn Time",
    videoId: "nQwbnAmJWdY",
    title: "Lizzo - About Damn Time (Official Video)",
    channelTitle: "Lizzo",
    duration: "3:11"
  },
  {
    artist: "Miley Cyrus",
    track: "Flowers",
    videoId: "G7KNmW9a75Y",
    title: "Miley Cyrus - Flowers (Official Video)",
    channelTitle: "Miley Cyrus",
    duration: "3:20"
  },

  // More Artists for Better Coverage
  {
    artist: "Adele",
    track: "Someone Like You",
    videoId: "hLQl3WQQoQ0",
    title: "Adele - Someone Like You (Official Music Video)",
    channelTitle: "Adele",
    duration: "4:45"
  },
  {
    artist: "Sam Smith",
    track: "Stay With Me",
    videoId: "pB-5XG-DbAA",
    title: "Sam Smith - Stay With Me (Official Video)",
    channelTitle: "Sam Smith",
    duration: "2:52"
  },
  {
    artist: "Lewis Capaldi",
    track: "Someone You Loved",
    videoId: "zABLecsR5UE",
    title: "Lewis Capaldi - Someone You Loved (Official Video)",
    channelTitle: "Lewis Capaldi",
    duration: "3:02"
  },
  {
    artist: "Lorde",
    track: "Royals",
    videoId: "nlcIKh6sBtc",
    title: "Lorde - Royals (Official Video)",
    channelTitle: "Lorde",
    duration: "3:10"
  },
  {
    artist: "Hozier",
    track: "Take Me To Church",
    videoId: "PVjiKRfKpPI",
    title: "Hozier - Take Me To Church (Official Video)",
    channelTitle: "Hozier",
    duration: "4:01"
  },

  // Dance/Electronic Expansion
  {
    artist: "Avicii",
    track: "Wake Me Up",
    videoId: "IcrbM1l_BoI",
    title: "Avicii - Wake Me Up (Official Video)",
    channelTitle: "Avicii",
    duration: "4:07"
  },
  {
    artist: "Zedd",
    track: "Clarity",
    videoId: "IxxstCcJlsc",
    title: "Zedd - Clarity ft. Foxes (Official Music Video)",
    channelTitle: "Zedd",
    duration: "4:31"
  },

  // Hip-Hop Expansion
  {
    artist: "Eminem",
    track: "Lose Yourself",
    videoId: "_Yhyp-_hX2s",
    title: "Eminem - Lose Yourself (HD)",
    channelTitle: "Eminem",
    duration: "5:26"
  },
  {
    artist: "Kanye West",
    track: "Stronger",
    videoId: "PsO6ZnUZI0g",
    title: "Kanye West - Stronger",
    channelTitle: "Kanye West",
    duration: "5:11"
  },

  // Additional Popular Artists
  {
    artist: "Rihanna",
    track: "Diamonds",
    videoId: "lWA2pjMjpBs",
    title: "Rihanna - Diamonds",
    channelTitle: "Rihanna",
    duration: "4:45"
  },
  {
    artist: "Katy Perry",
    track: "Roar",
    videoId: "CevxZvSJLk8",
    title: "Katy Perry - Roar (Official Video)",
    channelTitle: "Katy Perry",
    duration: "4:02"
  },
  {
    artist: "Lady Gaga",
    track: "Shallow",
    videoId: "bo_efYhYU2A",
    title: "Lady Gaga, Bradley Cooper - Shallow (A Star Is Born)",
    channelTitle: "Lady Gaga",
    duration: "3:35"
  },

  // Additional dance/electronic tracks to match mood searches
  {
    artist: "Swedish House Mafia",
    track: "Don't You Worry Child",
    videoId: "1y6smkh6c-0",
    title: "Swedish House Mafia - Don't You Worry Child (Official Video)",
    channelTitle: "Swedish House Mafia",
    duration: "3:32"
  },
  {
    artist: "Skrillex",
    track: "Bangarang",
    videoId: "YJVmu6yttiw",
    title: "Skrillex - Bangarang (feat. Sirah) [Official Music Video]",
    channelTitle: "Skrillex",
    duration: "3:35"
  },
  {
    artist: "Diplo",
    track: "Lean On",
    videoId: "YqeW9_5kURI", 
    title: "Major Lazer & DJ Snake - Lean On (feat. MØ) (Official Music Video)",
    channelTitle: "Major Lazer",
    duration: "2:56"
  },

  // Party/Dance variations that might match mood searches
  {
    artist: "LMFAO",
    track: "Party Rock Anthem",
    videoId: "KQ6zr6kCPj8",
    title: "LMFAO - Party Rock Anthem ft. Lauren Bennett, GoonRock (Official Video)",
    channelTitle: "LMFAO",
    duration: "4:23"
  },
  {
    artist: "Flo Rida",
    track: "Good Feeling",
    videoId: "3OnnDqH6Wj8",
    title: "Flo Rida - Good Feeling [Official Video]",
    channelTitle: "Flo Rida",
    duration: "4:07"
  },
  {
    artist: "Pitbull",
    track: "Fireball",
    videoId: "HMqZ2PPOLik",
    title: "Pitbull - Fireball ft. John Ryan (Official Video)",
    channelTitle: "Pitbull",
    duration: "3:49"
  },

  // More pop hits that might match
  {
    artist: "Bruno Mars",
    track: "24K Magic",
    videoId: "UqyT8IEBkvY",
    title: "Bruno Mars - 24K Magic (Official Music Video)",
    channelTitle: "Bruno Mars",
    duration: "3:46"
  },
  {
    artist: "Justin Timberlake",
    track: "Can't Stop the Feeling",
    videoId: "ru0K8uYEZWw",
    title: "Justin Timberlake - CAN'T STOP THE FEELING! (Official Video)",
    channelTitle: "Justin Timberlake",
    duration: "3:56"
  },

  // Electronic/Synth tracks
  {
    artist: "Daft Punk",
    track: "Get Lucky",
    videoId: "5NV6Rdv1a3I",
    title: "Daft Punk - Get Lucky (Official Audio) ft. Pharrell Williams, Nile Rodgers",
    channelTitle: "Daft Punk",
    duration: "6:07"
  },
  {
    artist: "The Chainsmokers",
    track: "Closer",
    videoId: "PT2_F-1esPk",
    title: "The Chainsmokers - Closer (Official Video) ft. Halsey",
    channelTitle: "The Chainsmokers",
    duration: "4:04"
  },

  // More recent hits
  {
    artist: "Glass Animals",
    track: "Heat Waves",
    videoId: "mRD0-GxqHVo",
    title: "Glass Animals - Heat Waves (Official Video)",
    channelTitle: "Glass Animals",
    duration: "3:58"
  },
  {
    artist: "Tones and I",
    track: "Dance Monkey",
    videoId: "q0hyYWKXF0Q",
    title: "Tones and I - Dance Monkey (Official Video)",
    channelTitle: "Tones and I",
    duration: "3:29"
  },

  // Alternative/Indie that might appear in mood searches
  {
    artist: "Portugal. The Man",
    track: "Feel It Still",
    videoId: "pBkHHoOIIn8",
    title: "Portugal. The Man - Feel It Still (Official Music Video)",
    channelTitle: "Portugal. The Man",
    duration: "2:43"
  },
  {
    artist: "Foster the People",
    track: "Pumped Up Kicks",
    videoId: "SDTZ7iX4vTQ",
    title: "Foster The People - Pumped up Kicks (Official Music Video)",
    channelTitle: "Foster The People",
    duration: "4:14"
  },

  // Add variations of common words/artists that might appear
  {
    artist: "Maroon 5",
    track: "Sugar",
    videoId: "09R8_2nJtjg",
    title: "Maroon 5 - Sugar (Official Music Video)",
    channelTitle: "Maroon 5",
    duration: "5:02"
  },
  {
    artist: "Charlie Puth",
    track: "Attention",
    videoId: "nfs8NYg7yQM",
    title: "Charlie Puth - Attention (Official Video)",
    channelTitle: "Charlie Puth",
    duration: "3:51"
  },
  {
    artist: "Camila Cabello",
    track: "Havana",
    videoId: "BQ0mxQXmLsk",
    title: "Camila Cabello - Havana ft. Young Thug (Official Music Video)",
    channelTitle: "Camila Cabello",
    duration: "3:37"
  },
  {
    artist: "Panic! At The Disco",
    track: "High Hopes",
    videoId: "IPXIgEAGe4U",
    title: "Panic! At The Disco - High Hopes (Official Video)",
    channelTitle: "Panic! At The Disco",
    duration: "3:12"
  },
  {
    artist: "Jonas Brothers",
    track: "Sucker",
    videoId: "CnAmeh0-E-U",
    title: "Jonas Brothers - Sucker (Official Video)",
    channelTitle: "Jonas Brothers",
    duration: "3:01"
  },
  {
    artist: "Halsey",
    track: "Without Me",
    videoId: "ZAfAud_M_mg",
    title: "Halsey - Without Me (Official Music Video)",
    channelTitle: "Halsey",
    duration: "3:56"
  },
  {
    artist: "Bebe Rexha",
    track: "Meant to Be",
    videoId: "zDo0H8Fm7d0",
    title: "Bebe Rexha - Meant to Be (feat. Florida Georgia Line) (Official Music Video)",
    channelTitle: "Bebe Rexha",
    duration: "3:17"
  },
  {
    artist: "Machine Gun Kelly",
    track: "Bad Things",
    videoId: "QpbQ4I3Eidg",
    title: "Machine Gun Kelly, Camila Cabello - Bad Things (Official Music Video)",
    channelTitle: "Machine Gun Kelly",
    duration: "4:16"
  },
  {
    artist: "Twenty One Pilots",
    track: "Stressed Out",
    videoId: "pXRviuL6vMY",
    title: "Twenty One Pilots - Stressed Out (Official Video)",
    channelTitle: "Twenty One Pilots",
    duration: "3:45"
  },
  {
    artist: "Sia",
    track: "Cheap Thrills",
    videoId: "nYh-n7EOtMA",
    title: "Sia - Cheap Thrills (Lyric Video) ft. Sean Paul",
    channelTitle: "Sia",
    duration: "3:31"
  },
  {
    artist: "G-Eazy",
    track: "Me, Myself & I",
    videoId: "bSfpSOBD30U",
    title: "G-Eazy x Bebe Rexha - Me, Myself & I (Official Music Video)",
    channelTitle: "G-Eazy",
    duration: "4:17"
  },
  {
    artist: "Megan Thee Stallion",
    track: "Savage",
    videoId: "EOxj2ROIxok",
    title: "Megan Thee Stallion - Savage (Official Music Video)",
    channelTitle: "Megan Thee Stallion",
    duration: "3:05"
  },
  {
    artist: "Cardi B",
    track: "I Like It",
    videoId: "xTlNMmZKwpA",
    title: "Cardi B, Bad Bunny & J Balvin - I Like It (Official Music Video)",
    channelTitle: "Cardi B",
    duration: "4:13"
  },
  {
    artist: "DJ Khaled",
    track: "Wild Thoughts",
    videoId: "fyaI4-5849w",
    title: "DJ Khaled - Wild Thoughts ft. Rihanna, Bryson Tiller (Official Music Video)",
    channelTitle: "DJ Khaled",
    duration: "3:26"
  },
  {
    artist: "Jason Derulo",
    track: "Want to Want Me",
    videoId: "rClUOdS5Zyw",
    title: "Jason Derulo - Want To Want Me (Official Music Video)",
    channelTitle: "Jason Derulo",
    duration: "3:29"
  }
]

export function findMusicVideo(trackName: string, artistName: string): MusicVideoEntry | null {
  // STRICT MATCHING - NO FALSE POSITIVES
  const normalizeStrict = (str: string) => str.toLowerCase()
    .replace(/\s*\([^)]*\)/g, '') // Remove parentheses
    .replace(/\s*\[[^\]]*\]/g, '') // Remove brackets
    .replace(/\s*-\s*(feat|ft|featuring)\.?\s*.*/gi, '') // Remove featuring
    .replace(/\s*-\s*(remix|remaster|remastered|version|edit|mix|radio|acoustic|live|official).*$/gi, '') // Remove versions
    .replace(/[^a-z0-9]/g, '') // Remove all non-alphanumeric
    .trim()
  
  const trackNorm = normalizeStrict(trackName)
  const artistNorm = normalizeStrict(artistName)
  
  console.log(`🔍 Strict search: "${trackName}" by "${artistName}"`)
  console.log(`   Normalized: "${trackNorm}" by "${artistNorm}"`)
  
  // 1. Try exact match first
  for (const entry of MUSIC_VIDEO_DATABASE) {
    const entryTrack = normalizeStrict(entry.track)
    const entryArtist = normalizeStrict(entry.artist)
    
    if (entryTrack === trackNorm && entryArtist === artistNorm) {
      console.log(`✅ Exact match: ${entry.title}`)
      return entry
    }
  }
  
  // 2. Try exact track with artist containing search artist
  for (const entry of MUSIC_VIDEO_DATABASE) {
    const entryTrack = normalizeStrict(entry.track)
    const entryArtist = normalizeStrict(entry.artist)
    
    if (entryTrack === trackNorm && entryArtist.includes(artistNorm)) {
      console.log(`✅ Track match + artist contains: ${entry.title}`)
      return entry
    }
  }
  
  // 3. Try exact artist match only (but track must be reasonably similar)
  for (const entry of MUSIC_VIDEO_DATABASE) {
    const entryArtist = normalizeStrict(entry.artist)
    
    if (entryArtist === artistNorm) {
      // Check if track names share significant words
      const trackWords = trackNorm.match(/.{3,}/g) || [] // Words 3+ chars
      const entryTrackNorm = normalizeStrict(entry.track)
      
      let matchingWords = 0
      for (const word of trackWords) {
        if (entryTrackNorm.includes(word)) {
          matchingWords++
        }
      }
      
      // Require at least 50% of words to match
      if (trackWords.length > 0 && matchingWords >= Math.ceil(trackWords.length / 2)) {
        console.log(`✅ Artist match + partial track: ${entry.title}`)
        return entry
      }
    }
  }
  
  // NO FALLBACK - Return null if no good match
  console.log(`❌ No match for "${trackName}" by "${artistName}"`)
  return null
}

// Helper function for similarity (not used in main matching)
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1
  
  if (longer.length === 0) return 1.0
  
  const editDistance = (s1: string, s2: string): number => {
    const m = s1.length
    const n = s2.length
    const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))
    
    for (let i = 0; i <= m; i++) dp[i][0] = i
    for (let j = 0; j <= n; j++) dp[0][j] = j
    
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (s1[i - 1] === s2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1]
        } else {
          dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1
        }
      }
    }
    
    return dp[m][n]
  }
  
  const distance = editDistance(longer, shorter)
  return (longer.length - distance) / longer.length
}