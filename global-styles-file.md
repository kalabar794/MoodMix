# 03. Global Styles & Glassmorphism Setup

## Update app/globals.css

Replace the entire contents of `app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* CSS Variables for Dynamic Theming */
@layer base {
  :root {
    --mood-primary: 200, 100%, 50%;
    --mood-secondary: 220, 100%, 60%;
    --glass-blur: 16px;
    --glass-opacity: 0.1;
    --border-opacity: 0.2;
  }
}

/* Glassmorphism Base Styles */
@layer components {
  .glass {
    @apply relative overflow-hidden rounded-2xl;
    background: rgba(255, 255, 255, var(--glass-opacity));
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    border: 1px solid rgba(255, 255, 255, var(--border-opacity));
    box-shadow: 
      0 8px 32px 0 rgba(31, 38, 135, 0.15),
      inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  }

  .glass-hover {
    @apply transition-all duration-300 cursor-pointer;
  }

  .glass-hover:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    box-shadow: 
      0 12px 40px 0 rgba(31, 38, 135, 0.25),
      inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  }

  .gradient-bg {
    @apply fixed inset-0 -z-10;
    background: linear-gradient(
      135deg,
      hsl(var(--mood-primary)) 0%,
      hsl(var(--mood-secondary)) 100%
    );
    transition: background 1s ease-in-out;
  }

  .floating-orb {
    @apply absolute rounded-full filter blur-3xl opacity-30 animate-float;
    background: radial-gradient(
      circle,
      hsl(var(--mood-primary)) 0%,
      transparent 70%
    );
  }
}

/* Custom Animations */
@layer utilities {
  @keyframes float {
    0%, 100% {
      transform: translateY(0) translateX(0) scale(1);
    }
    25% {
      transform: translateY(-20px) translateX(10px) scale(1.05);
    }
    50% {
      transform: translateY(-10px) translateX(-10px) scale(0.95);
    }
    75% {
      transform: translateY(-30px) translateX(5px) scale(1.02);
    }
  }

  @keyframes pulse-glow {
    0%, 100% {
      opacity: 0.6;
    }
    50% {
      opacity: 0.9;
    }
  }

  .animate-float {
    animation: float 20s ease-in-out infinite;
  }

  .animate-pulse-glow {
    animation: pulse-glow 3s ease-in-out infinite;
  }
}

/* Mood-Specific Gradients */
.mood-happy {
  --mood-primary: 45, 100%, 60%;
  --mood-secondary: 30, 100%, 50%;
}

.mood-sad {
  --mood-primary: 220, 70%, 50%;
  --mood-secondary: 240, 60%, 40%;
}

.mood-energetic {
  --mood-primary: 0, 85%, 60%;
  --mood-secondary: 330, 85%, 55%;
}

.mood-calm {
  --mood-primary: 160, 50%, 50%;
  --mood-secondary: 180, 40%, 40%;
}

.mood-angry {
  --mood-primary: 0, 90%, 50%;
  --mood-secondary: 15, 90%, 45%;
}

.mood-love {
  --mood-primary: 340, 80%, 60%;
  --mood-secondary: 320, 70%, 50%;
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Global Reset for Better Glassmorphism */
body {
  @apply min-h-screen text-white overflow-x-hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Utility Classes for Mood Wheel */
.mood-wheel-gradient {
  background: conic-gradient(
    from 0deg,
    hsl(45, 100%, 60%) 0deg,     /* Happy - Yellow */
    hsl(30, 100%, 50%) 60deg,    /* Excited - Orange */
    hsl(0, 85%, 60%) 120deg,     /* Energetic - Red */
    hsl(340, 80%, 60%) 180deg,   /* Love - Pink */
    hsl(220, 70%, 50%) 240deg,   /* Sad - Blue */
    hsl(160, 50%, 50%) 300deg,   /* Calm - Teal */
    hsl(45, 100%, 60%) 360deg    /* Back to Happy */
  );
}
```

## Update tailwind.config.ts

Update your `tailwind.config.ts` to include custom animations:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'float': 'float 20s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
```

## Test Your Styles

Create a temporary test in `app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main className="min-h-screen relative">
      <div className="gradient-bg mood-happy" />
      <div className="floating-orb w-96 h-96 top-20 left-20" />
      <div className="floating-orb w-64 h-64 bottom-20 right-20" style={{ animationDelay: '10s' }} />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="glass glass-hover p-8 max-w-md w-full">
          <h1 className="text-4xl font-bold mb-4">MoodMix</h1>
          <p className="text-white/80">Your glassmorphic design is working!</p>
        </div>
      </div>
    </main>
  )
}
```

Run `npm run dev` and you should see a beautiful glassmorphic card with animated gradient background!

## Next Steps
Move on to `04-mood-wheel-component.md` to create the interactive mood selector.