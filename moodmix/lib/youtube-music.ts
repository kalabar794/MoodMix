// YouTube Music API Integration
// YouTube often has music videos and audio tracks with more liberal preview policies

interface YouTubeTrack {
  id: string
  title: string
  artist: string
  duration: string
  thumbnail: string
  embedUrl: string
}

class YouTubeMusicAPI {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async searchMusicByMood(mood: string, limit: number = 20): Promise<YouTubeTrack[]> {
    const searchQueries = this.generateMoodQueries(mood)
    const allTracks: YouTubeTrack[] = []

    for (const query of searchQueries) {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?` +
          `part=snippet&type=video&videoCategoryId=10&` + // Music category
          `q=${encodeURIComponent(query)}&` +
          `maxResults=${Math.ceil(limit / searchQueries.length)}&` +
          `key=${this.apiKey}`
        )

        const data = await response.json()
        
        const tracks: YouTubeTrack[] = data.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          artist: item.snippet.channelTitle,
          duration: 'Unknown', // Would need additional API call
          thumbnail: item.snippet.thumbnails.medium.url,
          embedUrl: `https://www.youtube.com/embed/${item.id.videoId}?autoplay=1&start=0`
        }))

        allTracks.push(...tracks)
      } catch (error) {
        console.error('YouTube search error:', error)
      }
    }

    return allTracks.slice(0, limit)
  }

  private generateMoodQueries(mood: string): string[] {
    const moodMap: Record<string, string[]> = {
      'Energetic': [
        'upbeat energetic music 2024',
        'high energy dance music',
        'motivational workout songs'
      ],
      'Melancholic': [
        'sad emotional music',
        'melancholic indie songs',
        'heartbreak ballads'
      ],
      'Serene': [
        'peaceful calm music',
        'relaxing ambient sounds',
        'chill instrumental music'
      ]
      // Add more moods...
    }

    return moodMap[mood] || [`${mood.toLowerCase()} music`]
  }

  // Create embeddable player component
  createEmbeddedPlayer(trackId: string, containerId: string): void {
    const iframe = document.createElement('iframe')
    iframe.src = `https://www.youtube.com/embed/${trackId}?autoplay=1&controls=1&rel=0`
    iframe.width = '100%'
    iframe.height = '80'
    iframe.frameBorder = '0'
    iframe.allow = 'autoplay; encrypted-media'
    
    const container = document.getElementById(containerId)
    if (container) {
      container.innerHTML = ''
      container.appendChild(iframe)
    }
  }
}

export { YouTubeMusicAPI, type YouTubeTrack }