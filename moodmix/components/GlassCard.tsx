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