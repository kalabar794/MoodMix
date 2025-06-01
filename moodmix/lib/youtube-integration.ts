// YouTube Music Video Integration for MoodMix
// Provides full-length music videos for every track

interface YouTubeVideoResult {
  id: string
  title: string
  channelTitle: string
  thumbnail: string
  duration: string
  publishedAt: string
  viewCount?: string
  embeddable?: boolean
  embedUrl: string
  watchUrl: string
}

interface YouTubeSearchResponse {
  success: boolean
  videos: YouTubeVideoResult[]
  totalResults: number
  searchQuery: string
}

class YouTubeMusicIntegration {
  private apiKey: string
  private baseUrl = 'https://www.googleapis.com/youtube/v3'

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || ''
  }

  // Main search function - finds music videos for Spotify tracks
  async searchMusicVideo(trackName: string, artistName: string): Promise<YouTubeSearchResponse> {
    if (!this.apiKey) {
      console.warn('YouTube API key not available')
      return this.quotaExceededResponse(trackName, artistName)
    }

    try {
      // Create optimized search query for music videos
      const searchQueries = this.generateSearchQueries(trackName, artistName)
      const allVideos: YouTubeVideoResult[] = []

      for (const query of searchQueries) {
        const videos = await this.performSearch(query)
        allVideos.push(...videos)
        
        // Continue searching until we have at least 1 embeddable video
        if (videos.length >= 1) break
      }
      
      // If we still don't have embeddable videos, try broader searches
      if (allVideos.length === 0) {
        console.log(`🔍 No embeddable videos found for "${trackName}" by "${artistName}". Trying broader search...`)
        const broadQueries = [
          `${trackName} ${artistName}`,
          `${artistName} ${trackName}`,
          `${trackName} music video`,
          `${artistName} official`
        ]
        
        for (const query of broadQueries) {
          const videos = await this.performSearch(query)
          allVideos.push(...videos)
          if (videos.length >= 1) break
        }
      }

      // Remove duplicates and sort by relevance
      const uniqueVideos = this.deduplicateAndRank(allVideos, trackName, artistName)

      // If no embeddable videos found, return empty result (hide YouTube button)
      if (uniqueVideos.length === 0) {
        console.log(`⚠️ No embeddable videos found for "${trackName}" by "${artistName}". Hiding YouTube button.`)
        return this.quotaExceededResponse(trackName, artistName)
      }

      return {
        success: true,
        videos: uniqueVideos.slice(0, 5), // Return top 5 results
        totalResults: uniqueVideos.length,
        searchQuery: `${trackName} ${artistName}`
      }
    } catch (error) {
      console.error('YouTube search error:', error)
      
      // Check if this is a quota exceeded error
      if (error instanceof Error && (error.message.includes('quota') || error.message.includes('403'))) {
        console.log(`💔 YouTube API quota exceeded for "${trackName}" by "${artistName}". Hiding YouTube button.`)
        return this.quotaExceededResponse(trackName, artistName)
      }
      
      return this.quotaExceededResponse(trackName, artistName)
    }
  }

  private generateSearchQueries(trackName: string, artistName: string): string[] {
    // Clean and optimize track/artist names for search
    const cleanTrack = this.cleanSearchTerm(trackName)
    const cleanArtist = this.cleanSearchTerm(artistName)

    return [
      `"${cleanTrack}" "${cleanArtist}" official music video`,
      `"${cleanTrack}" "${cleanArtist}" official video`,
      `${cleanTrack} ${cleanArtist} music video`,
      `${cleanTrack} ${cleanArtist} official`,
      `${cleanTrack} ${cleanArtist}` // Fallback broad search
    ]
  }

  private cleanSearchTerm(term: string): string {
    return term
      .replace(/\([^)]*\)/g, '') // Remove parentheses content
      .replace(/\[[^\]]*\]/g, '') // Remove bracket content
      .replace(/feat\.|ft\.|featuring/gi, '') // Remove featuring
      .replace(/remix|remaster|remastered/gi, '') // Remove remix/remaster
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim()
  }

  private async performSearch(query: string): Promise<YouTubeVideoResult[]> {
    const searchUrl = `${this.baseUrl}/search`
    const params = new URLSearchParams({
      part: 'snippet',
      q: query,
      type: 'video',
      videoCategoryId: '10', // Music category
      videoEmbeddable: 'true', // Only embeddable videos
      maxResults: '15', // Increased to find more embeddable options
      order: 'relevance',
      key: this.apiKey
    })

    const response = await fetch(`${searchUrl}?${params}`)
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Get video details including duration
    const videoIds = data.items.map((item: any) => item.id.videoId).join(',')
    const videoDetails = await this.getVideoDetails(videoIds)

    return data.items.map((item: any) => {
      const videoId = item.id.videoId
      const details = videoDetails[videoId] || {}
      
      return {
        id: videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        duration: this.formatDuration(details.duration || 'PT0S'),
        publishedAt: item.snippet.publishedAt,
        viewCount: details.viewCount,
        embeddable: details.embeddable,
        embedUrl: details.embeddable ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1` : '',
        watchUrl: `https://www.youtube.com/watch?v=${videoId}`
      }
    }).filter((video: any) => video.embeddable) // Only return embeddable videos
  }

  private async getVideoDetails(videoIds: string): Promise<Record<string, any>> {
    if (!videoIds) return {}

    const detailsUrl = `${this.baseUrl}/videos`
    const params = new URLSearchParams({
      part: 'contentDetails,statistics,status',
      id: videoIds,
      key: this.apiKey
    })

    try {
      const response = await fetch(`${detailsUrl}?${params}`)
      const data = await response.json()
      
      const details: Record<string, any> = {}
      data.items?.forEach((item: any) => {
        details[item.id] = {
          duration: item.contentDetails?.duration,
          viewCount: item.statistics?.viewCount,
          embeddable: item.status?.embeddable !== false
        }
      })
      
      return details
    } catch (error) {
      console.error('Error fetching video details:', error)
      return {}
    }
  }

  private formatDuration(isoDuration: string): string {
    // Convert ISO 8601 duration (PT4M13S) to readable format (4:13)
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    if (!match) return '0:00'

    const hours = parseInt(match[1] || '0')
    const minutes = parseInt(match[2] || '0')
    const seconds = parseInt(match[3] || '0')

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  private deduplicateAndRank(videos: YouTubeVideoResult[], trackName: string, artistName: string): YouTubeVideoResult[] {
    // Remove duplicates based on video ID
    const unique = videos.filter((video, index, self) => 
      index === self.findIndex(v => v.id === video.id)
    )

    // Rank by relevance to the original track
    return unique.sort((a, b) => {
      const scoreA = this.calculateRelevanceScore(a, trackName, artistName)
      const scoreB = this.calculateRelevanceScore(b, trackName, artistName)
      return scoreB - scoreA
    })
  }

  private calculateRelevanceScore(video: YouTubeVideoResult, trackName: string, artistName: string): number {
    let score = 0
    const title = video.title.toLowerCase()
    const channel = video.channelTitle.toLowerCase()
    const cleanTrack = trackName.toLowerCase()
    const cleanArtist = artistName.toLowerCase()

    // Title relevance
    if (title.includes(cleanTrack)) score += 10
    if (title.includes(cleanArtist)) score += 10
    if (title.includes('official')) score += 5
    if (title.includes('music video')) score += 5
    if (title.includes('mv')) score += 3

    // Channel relevance
    if (channel.includes(cleanArtist)) score += 8
    if (channel.includes('official')) score += 3
    if (channel.includes('vevo')) score += 7
    if (channel.includes('records')) score += 2

    // Duration preference (prefer 2-8 minute videos)
    const duration = this.parseDuration(video.duration)
    if (duration >= 120 && duration <= 480) score += 5 // 2-8 minutes
    if (duration >= 60 && duration <= 600) score += 2  // 1-10 minutes

    // Penalize very long videos (likely not music)
    if (duration > 900) score -= 5 // Over 15 minutes

    return score
  }

  private parseDuration(durationStr: string): number {
    // Parse duration string like "4:13" to seconds
    const parts = durationStr.split(':').map(p => parseInt(p))
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1] // minutes:seconds
    }
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2] // hours:minutes:seconds
    }
    return 0
  }

  // Response when quota exceeded or no API key - hides YouTube buttons
  private async quotaExceededResponse(trackName: string, artistName: string): Promise<YouTubeSearchResponse> {
    console.log(`💔 YouTube unavailable for "${trackName}" by "${artistName}" - hiding YouTube button`)
    
    return {
      success: false, // This will hide the YouTube button
      videos: [],
      totalResults: 0,
      searchQuery: `${trackName} ${artistName}`
    }
  }

  // Batch search for multiple tracks (optimized for API quota)
  async searchMultipleTracks(tracks: Array<{name: string, artist: string}>): Promise<Record<string, YouTubeSearchResponse>> {
    const results: Record<string, YouTubeSearchResponse> = {}
    
    // Process in batches to avoid rate limiting
    const batchSize = 5
    for (let i = 0; i < tracks.length; i += batchSize) {
      const batch = tracks.slice(i, i + batchSize)
      
      const batchPromises = batch.map(async (track) => {
        const key = `${track.name}-${track.artist}`
        const result = await this.searchMusicVideo(track.name, track.artist)
        return { key, result }
      })
      
      const batchResults = await Promise.all(batchPromises)
      batchResults.forEach(({ key, result }) => {
        results[key] = result
      })
      
      // Small delay between batches
      if (i + batchSize < tracks.length) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
    
    return results
  }
}

export { YouTubeMusicIntegration, type YouTubeVideoResult, type YouTubeSearchResponse }