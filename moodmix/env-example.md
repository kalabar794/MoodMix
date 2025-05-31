# Environment Variables Setup

## Required Variables

```env
# Spotify API Configuration
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
```

## Optional Variables (for Enhanced Features)

```env
# YouTube Data API Configuration
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key_here
```

## YouTube API Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the "YouTube Data API v3"
4. Create credentials (API Key)
5. Add the API key to your environment variables

**Note**: Without YouTube API key, the app will still work but will use fallback YouTube search URLs instead of embedded videos.