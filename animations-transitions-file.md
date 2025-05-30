# 12. Animations & Transitions - Final Polish

## Enhanced Animations with Framer Motion

### Step 1: Create lib/animations.ts (Animation Variants)

```typescript
import { Variants } from 'framer-motion'

// Page transition variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  in: {
    opacity: 1,
    scale: 1,
  },
  out: {
    opacity: 0,
    scale: 1.05,
  },
}

// Stagger children animations
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

export const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
}

// Floating animation for background elements
export const floatVariants: Variants = {
  animate: {
    y: [0, -20, 0],
    x: [0, 10, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// Pulse animation for interactive elements
export const pulseVariants: Variants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// Glow animation
export const glowVariants: Variants = {
  glow: {
    boxShadow: [
      '0 0 20px rgba(255,255,255,0.2)',
      '0 0 40px rgba(255,255,255,0.4)',
      '0 0 20px rgba(255,255,255,0.2)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
}
```

### Step 2: Create components/AnimatedLogo.tsx

```tsx
'use client'

import { motion } from 'framer-motion'

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg'
  animate?: boolean
}

export default function AnimatedLogo({ size = 'md', animate = true }: AnimatedLogoProps) {
  const sizes = {
    sm: 40,
    md: 60,
    lg: 80,
  }

  const dimension = sizes[size]

  return (
    <motion.svg
      width={dimension}
      height={dimension}
      viewBox="0 0 100 100"
      initial="initial"
      animate={animate ? "animate" : "initial"}
    >
      {/* Outer circle */}
      <motion.circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.3"
        variants={{
          initial: { pathLength: 0 },
          animate: {
            pathLength: 1,
            transition: { duration: 2, ease: "easeInOut" }
          }
        }}
      />

      {/* Sound waves */}
      {[20, 30, 40].map((radius, index) => (
        <motion.circle
          key={radius}
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          variants={{
            initial: { scale: 0, opacity: 0 },
            animate: {
              scale: [1, 1.2, 1],
              opacity: [0.6, 0.3, 0.6],
              transition: {
                duration: 3,
                repeat: Infinity,
                delay: index * 0.3,
                ease: "easeInOut"
              }
            }
          }}
        />
      ))}

      {/* Center dot */}
      <motion.circle
        cx="50"
        cy="50"
        r="5"
        fill="currentColor"
        variants={{
          initial: { scale: 0 },
          animate: {
            scale: [1, 1.3, 1],
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }
        }}
      />
    </motion.svg>
  )
}
```

### Step 3: Update MoodWheel with Enhanced Animations

Add these animations to your `components/MoodWheel.tsx`:

```tsx
// Add to the top of MoodWheel component
import { motion, useMotionValue, useTransform } from 'framer-motion'

// Inside the MoodWheel component, add these motion values
const mouseX = useMotionValue(0)
const mouseY = useMotionValue(0)

// Transform mouse position to rotation
const rotateX = useTransform(mouseY, [-150, 150], [5, -5])
const rotateY = useTransform(mouseX, [-150, 150], [-5, 5])

// Update the wheel container with 3D effects
<motion.div
  ref={wheelRef}
  className="absolute inset-0 rounded-full cursor-pointer overflow-hidden"
  onClick={handleWheelInteraction}
  onMouseMove={(e) => {
    handleWheelInteraction(e)
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left - rect.width / 2)
    mouseY.set(e.clientY - rect.top - rect.height / 2)
  }}
  onMouseLeave={() => {
    mouseX.set(0)
    mouseY.set(0)
  }}
  style={{
    rotateX,
    rotateY,
    transformStyle: 'preserve-3d',
  }}
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
>
```

### Step 4: Create components/LoadingAnimation.tsx

```tsx
'use client'

import { motion } from 'framer-motion'
import AnimatedLogo from './AnimatedLogo'

export default function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center gap-6">
      <AnimatedLogo size="lg" />
      
      <div className="flex gap-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-3 h-3 bg-white/60 rounded-full"
            animate={{
              y: [0, -10, 0],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      
      <motion.p
        className="text-white/60"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Loading your vibe...
      </motion.p>
    </div>
  )
}
```

### Step 5: Add Page Transitions (components/PageTransition.tsx)

```tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'
import { pageVariants } from '@/lib/animations'

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

export default function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={className}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={{ duration: 0.5, type: 'tween' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

### Step 6: Add Micro-interactions (lib/hooks/useHoverEffect.ts)

```typescript
import { useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'

export function useHoverEffect() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['1.5deg', '-1.5deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-1.5deg', '1.5deg'])

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return {
    rotateX,
    rotateY,
    handleMouseMove,
    handleMouseLeave,
  }
}
```

### Step 7: Update globals.css with Additional Animations

Add these to your `app/globals.css`:

```css
/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Page transitions */
.page-transition-enter {
  opacity: 0;
  transform: scale(0.95);
}

.page-transition-enter-active {
  opacity: 1;
  transform: scale(1);
  transition: opacity 500ms, transform 500ms;
}

.page-transition-exit {
  opacity: 1;
  transform: scale(1);
}

.page-transition-exit-active {
  opacity: 0;
  transform: scale(1.05);
  transition: opacity 500ms, transform 500ms;
}

/* Shimmer effect for loading states */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.shimmer {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}

/* Improved focus states */
:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Features Added

1. **3D Hover Effects**: Mood wheel tilts based on mouse position
2. **Loading Animations**: Custom loading states with logo
3. **Page Transitions**: Smooth transitions between views
4. **Micro-interactions**: Subtle hover effects on cards
5. **Performance**: Respects reduced motion preferences
6. **Polish**: Shimmer effects, focus states, smooth scrolling

### Testing Animations

1. Hover over the mood wheel - should tilt in 3D
2. Click between views - smooth page transitions
3. Loading states - animated logo and dots
4. Card hovers - subtle rotation effects
5. Background elements - continuous floating animation

## Next Steps
Move on to `13-deployment-guide.md` for deploying to Vercel.