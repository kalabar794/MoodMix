# 06. Glass Card Component

## Create Reusable Glassmorphic Card Components

### Step 1: Create components/GlassCard.tsx

```tsx
'use client'

import { ReactNode } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode
  className?: string
  variant?: 'default' | 'hover' | 'interactive' | 'minimal'
  blur?: 'sm' | 'md' | 'lg' | 'xl'
  glow?: boolean
  gradient?: boolean
}

export default function GlassCard({
  children,
  className,
  variant = 'default',
  blur = 'md',
  glow = false,
  gradient = false,
  ...motionProps
}: GlassCardProps) {
  const blurValues = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  }

  const variants = {
    default: 'glass',
    hover: 'glass glass-hover',
    interactive: 'glass glass-hover cursor-pointer active:scale-[0.98]',
    minimal: 'glass-minimal'
  }

  return (
    <motion.div
      className={cn(
        variants[variant],
        blurValues[blur],
        glow && 'glass-glow',
        gradient && 'glass-gradient',
        className
      )}
      whileHover={variant === 'interactive' ? { scale: 1.02 } : undefined}
      whileTap={variant === 'interactive' ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      {...motionProps}
    >
      {gradient && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none" />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

// Specialized Music Card Component
interface MusicCardProps {
  track: {
    name: string
    artist: string
    album: string
    image_url: string
    preview_url: string | null
  }
  isPlaying?: boolean
  onPlay?: () => void
}

export function MusicCard({ track, isPlaying, onPlay }: MusicCardProps) {
  return (
    <GlassCard
      variant="interactive"
      gradient
      className="p-4 flex items-center gap-4 group"
      onClick={onPlay}
    >
      {/* Album Art */}
      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={track.image_url}
          alt={track.album}
          className="w-full h-full object-cover"
        />
        {track.preview_url && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.div
              animate={isPlaying ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {isPlaying ? (
                <PauseIcon className="w-6 h-6 text-white" />
              ) : (
                <PlayIcon className="w-6 h-6 text-white" />
              )}
            </motion.div>
          </div>
        )}
      </div>

      {/* Track Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white truncate">{track.name}</h3>
        <p className="text-sm text-white/60 truncate">{track.artist}</p>
        <p className="text-xs text-white/40 truncate">{track.album}</p>
      </div>

      {/* Play Indicator */}
      {isPlaying && (
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-1 bg-white/80 rounded-full"
              animate={{ height: ['12px', '20px', '12px'] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>
      )}
    </GlassCard>
  )
}

// Loading Card Component
export function LoadingCard() {
  return (
    <GlassCard className="p-4 flex items-center gap-4">
      <div className="w-16 h-16 rounded-lg bg-white/10 animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-white/10 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-white/10 rounded animate-pulse w-1/2" />
        <div className="h-2 bg-white/10 rounded animate-pulse w-2/3" />
      </div>
    </GlassCard>
  )
}

// Icons
function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
    </svg>
  )
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
    </svg>
  )
}
```

### Step 2: Create lib/utils.ts for Class Name Utility

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Step 3: Install Required Dependencies

```bash
npm install clsx tailwind-merge
```

### Step 4: Update globals.css with Additional Glass Styles

Add these styles to your `app/globals.css`:

```css
/* Add to the @layer components section */
@layer components {
  /* ... existing styles ... */

  .glass-minimal {
    @apply relative overflow-hidden rounded-xl;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .glass-glow {
    box-shadow: 
      0 8px 32px 0 rgba(31, 38, 135, 0.15),
      inset 0 0 0 1px rgba(255, 255, 255, 0.1),
      0 0 80px -20px hsl(var(--mood-primary) / 0.5);
  }

  .glass-gradient {
    position: relative;
    overflow: hidden;
  }

  .glass-gradient::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0) 100%
    );
    pointer-events: none;
  }
}
```

### Step 5: Test Glass Card Components

Create a test section in your `app/page.tsx`:

```tsx
// Add this import at the top
import GlassCard, { MusicCard, LoadingCard } from '@/components/GlassCard'

// Add this test section in your JSX (temporarily)
{/* Test Glass Cards - Remove this section later */}
<div className="grid gap-4 max-w-md mx-auto mt-8">
  <GlassCard variant="default" className="p-6">
    <h3 className="text-lg font-semibold mb-2">Default Glass Card</h3>
    <p className="text-white/60">This is a basic glass card</p>
  </GlassCard>

  <GlassCard variant="hover" blur="lg" gradient className="p-6">
    <h3 className="text-lg font-semibold mb-2">Hover Glass Card</h3>
    <p className="text-white/60">This card has hover effects</p>
  </GlassCard>

  <GlassCard variant="interactive" glow className="p-6">
    <h3 className="text-lg font-semibold mb-2">Interactive Card</h3>
    <p className="text-white/60">Click me!</p>
  </GlassCard>

  <MusicCard 
    track={{
      name: "Test Song",
      artist: "Test Artist",
      album: "Test Album",
      image_url: "https://via.placeholder.com/150",
      preview_url: "https://example.com"
    }}
  />

  <LoadingCard />
</div>
```

### Usage Examples

```tsx
// Basic glass card
<GlassCard className="p-6">
  <h2>Your content here</h2>
</GlassCard>

// Interactive card with glow
<GlassCard variant="interactive" glow className="p-4">
  <button>Click me</button>
</GlassCard>

// Minimal style with custom blur
<GlassCard variant="minimal" blur="xl" className="p-8">
  <div>Minimal design</div>
</GlassCard>

// With animation
<GlassCard
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <p>Animated content</p>
</GlassCard>
```

## Next Steps
Move on to `07-spotify-setup.md` to integrate the Spotify API.