// Mood-related types
export interface MoodSelection {
  primary: string;
  color: string;
  intensity: number;
  coordinates: {
    x: number;
    y: number;
  };
}

// Spotify-related types
export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    id: string;
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
  duration_ms: number;
}

export interface MoodMusicParams {
  valence: number;
  energy: number;
  danceability: number;
  genres: string[];
  limit: number;
}

// Audio features for mood mapping
export interface AudioFeatures {
  valence: number;      // 0.0-1.0 (sad to happy)
  energy: number;       // 0.0-1.0 (calm to energetic)
  danceability: number; // 0.0-1.0 (not danceable to very danceable)
  tempo: number;        // BPM
  acousticness: number; // 0.0-1.0 (electronic to acoustic)
  instrumentalness: number; // 0.0-1.0 (vocal to instrumental)
}