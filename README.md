# 🎵 MoodMix - Premium Mood-Based Music Discovery

MoodMix is a sophisticated web application that discovers the perfect music for your current mood. With its premium glassmorphic interface and seamless Spotify integration, it creates personalized playlists that resonate with your emotions.

![MoodMix Screenshot](https://via.placeholder.com/1200x600/1a1a2e/ffffff?text=MoodMix+Premium+Interface)

## ✨ Features

- **Interactive Mood Wheel**: Beautiful 3D mood selection with click-to-select behavior
- **Spotify Integration**: Discovers music through Spotify's vast catalog
- **Premium UI Design**: Sophisticated glassmorphic effects with multi-layer blur
- **Real-time Preview**: Hover to preview moods, click to select
- **Intensity Control**: Adjust mood intensity based on distance from center
- **Responsive Design**: Works beautifully on all devices
- **Advanced Animations**: Smooth transitions powered by Framer Motion

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Spotify Developer Account
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kalabar794/MoodMix.git
cd MoodMix/moodmix
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Spotify credentials to `.env.local`:
```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎨 Design Philosophy

MoodMix features a premium, sophisticated interface that moves away from typical "childish" music app designs:

- **Glassmorphism**: Multi-layer glass effects with varying opacity and blur
- **3D Interactions**: Perspective transforms and depth perception
- **Professional Typography**: Inter font with careful weight hierarchy
- **Subtle Animations**: Smooth, purposeful transitions
- **Dark Theme**: Elegant dark interface with careful contrast ratios

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **API**: Spotify Web API
- **Testing**: Playwright
- **Deployment**: Vercel/Netlify ready

## 📱 Mood Options

- 😊 **Happy** - Uplifting and joyful tracks
- 🎉 **Excited** - High-energy, thrilling music
- ⚡ **Energetic** - Powerful, dynamic songs
- 💕 **Love** - Romantic and tender melodies
- 😢 **Sad** - Emotional, contemplative music
- 🧘 **Calm** - Peaceful, relaxing sounds

## 🔧 Configuration

### Spotify Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add `http://localhost:3000/api/spotify-auth` as redirect URI
4. Copy Client ID and Client Secret to your `.env.local`

### Customization

The app is highly customizable through:
- CSS variables in `globals.css`
- Mood mappings in `lib/moodMapping.ts`
- Theme colors for each mood state
- Animation timings and effects

## 📦 Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run test       # Run Playwright tests
```

## 🧪 Testing

Run the test suite:
```bash
npm run test
```

Run specific test:
```bash
npm run test mood-wheel-interaction
```

## 🚀 Deployment

### Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kalabar794/MoodMix)

### Environment Variables
Remember to set these in your deployment platform:
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Spotify for their amazing Web API
- The Framer Motion team for smooth animations
- Next.js team for the fantastic framework
- All the music lovers who inspired this project

---

Made with ❤️ and 🎵 by the MoodMix team

🚀 **Live Demo**: [https://mood-mix-theta.vercel.app/](https://mood-mix-theta.vercel.app/)