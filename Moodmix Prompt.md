Project: MoodMix - Mood-Based Music Discovery App
I have a complete set of 16 .md documentation files for building MoodMix, a beautiful glassmorphic mood-based music discovery app.
CRITICAL: Before writing ANY code, you MUST:

Read and analyze ALL 16 .md files in order (01-setup through 13-deployment, plus critical-coding-rules and claude-code-automation)
Create a comprehensive implementation plan based on the full documentation
Follow the "Deep Thinking Protocol" from claude-code-automation-file.md

Project Approach:

Start with a SIMPLIFIED version that doesn't require Spotify API or any paid services
Use a mock music library with sample tracks instead of real API calls
Focus on perfecting the glassmorphic UI and mood wheel interaction first
Build with expansion in mind - structure code so Spotify can be added later

Core Features for v1:

Mood Wheel Component - Interactive circular selector with 6 moods (happy, excited, energetic, love, sad, calm)
Glassmorphic Design - Beautiful glass effects, dynamic gradients, floating orbs
Background Animations - Particle system that responds to mood selection
Mock Music Data - Create a library of ~100 songs with pre-assigned mood parameters
Music Results Display - Show matching tracks based on mood selection
Audio Preview - Use public domain music or generated audio URLs for previews

Technical Requirements:

Next.js 14 with App Router
TypeScript with EXPLICIT types (no implicit any)
Tailwind CSS with custom glassmorphic styles
Framer Motion for animations
Automated testing with Playwright
GitHub Actions CI/CD pipeline
Vercel deployment

Development Workflow:

Set up automated testing immediately
Use pnpm build before every commit
Fix ALL TypeScript and linting errors
Create E2E tests for the complete user flow
Deploy to Vercel with automated pipeline

REMEMBER:

NO mock components or simplified replacements unless explicitly requested
Work with the existing component structure from the docs
Find and fix root causes, don't create workarounds
Test everything automatically - no manual testing required

Mock Data Structure Example:
typescriptconst mockMusicLibrary = [
  {
    id: '1',
    name: 'Sunrise Symphony',
    artist: 'Digital Dreams',
    album: 'Morning Vibes',
    preview_url: '/audio/sample1.mp3',
    mood_params: {
      valence: 0.8,
      energy: 0.6,
      primary_mood: 'happy'
    }
  }
  // ... more tracks
]
Start by setting up the project structure, then implement the mood wheel, followed by the glassmorphic UI, and finally the music matching logic. Make it beautiful, functional, and ready for future Spotify integration.