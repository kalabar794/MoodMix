# Glassmorphism Design System

## Overview
Complete implementation of glassmorphism design principles for MoodMix, featuring frosted glass effects, multi-layered styling, dynamic backgrounds, and enhanced visual depth.

## Core CSS System (`/app/globals.css`)

### 1. CSS Variables & Theme System
```css
:root {
  /* Glassmorphism Variables */
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-blur: 12px;
  
  /* Enhanced Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.15);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.2);
  
  /* Color Palette */
  --primary-purple: #6366f1;
  --primary-dark: #4f46e5;
  --accent-teal: #14b8a6;
  --accent-pink: #ec4899;
}

/* Light Theme Override */
[data-theme="light"] {
  --glass-bg: rgba(255, 255, 255, 0.8);
  --glass-border: rgba(0, 0, 0, 0.1);
  --glass-blur: 12px;
}
```

### 2. Dynamic Glassmorphism Background System
```css
/* Dynamic Glassmorphism Background System */
.modern-bg {
  position: fixed;
  inset: 0;
  z-index: -10;
  background: 
    radial-gradient(ellipse 150% 100% at 50% 0%, rgba(120, 119, 198, 0.15) 0%, transparent 60%),
    radial-gradient(ellipse 150% 100% at 80% 50%, rgba(255, 119, 198, 0.12) 0%, transparent 60%),
    radial-gradient(ellipse 150% 100% at 20% 100%, rgba(119, 255, 198, 0.12) 0%, transparent 60%),
    linear-gradient(135deg, #0f0f23 0%, #1a1a3a 25%, #2a2a4a 75%, #0f0f23 100%);
  animation: glassmorphism-drift 25s ease-in-out infinite;
}

.gradient-overlay {
  position: fixed;
  inset: 0;
  z-index: -5;
  background: 
    radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(236, 72, 153, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.06) 0%, transparent 70%);
  opacity: 0.95;
  backdrop-filter: blur(0.5px);
  animation: gradient-shift 30s ease-in-out infinite;
}

@keyframes glassmorphism-drift {
  0%, 100% { transform: translateX(0px) translateY(0px) scale(1); }
  25% { transform: translateX(15px) translateY(-12px) scale(1.02); }
  50% { transform: translateX(-8px) translateY(15px) scale(0.98); }
  75% { transform: translateX(-12px) translateY(-8px) scale(1.01); }
}

@keyframes gradient-shift {
  0%, 100% { 
    transform: translateX(0px) translateY(0px) rotate(0deg);
    filter: hue-rotate(0deg) brightness(1);
  }
  25% { 
    transform: translateX(5px) translateY(-8px) rotate(1deg);
    filter: hue-rotate(15deg) brightness(1.1);
  }
  50% { 
    transform: translateX(-3px) translateY(5px) rotate(-1deg);
    filter: hue-rotate(30deg) brightness(0.9);
  }
  75% { 
    transform: translateX(-5px) translateY(-3px) rotate(0.5deg);
    filter: hue-rotate(45deg) brightness(1.05);
  }
}
```

### 3. Mood-Based Dynamic Backgrounds
```css
/* Dynamic Mood-Based Backgrounds */
.mood-euphoric .gradient-overlay {
  background: 
    radial-gradient(circle at 30% 30%, rgba(255, 215, 0, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 70% 70%, rgba(255, 140, 0, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 50% 80%, rgba(255, 69, 0, 0.1) 0%, transparent 70%);
}

.mood-energetic .gradient-overlay {
  background: 
    radial-gradient(circle at 20% 30%, rgba(255, 69, 0, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(255, 20, 147, 0.18) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(255, 0, 255, 0.15) 0%, transparent 70%);
}

.mood-serene .gradient-overlay {
  background: 
    radial-gradient(circle at 30% 40%, rgba(0, 255, 127, 0.15) 0%, transparent 60%),
    radial-gradient(circle at 70% 60%, rgba(64, 224, 208, 0.12) 0%, transparent 50%),
    radial-gradient(circle at 50% 20%, rgba(72, 209, 204, 0.1) 0%, transparent 70%);
}

.mood-passionate .gradient-overlay {
  background: 
    radial-gradient(circle at 40% 30%, rgba(220, 20, 60, 0.22) 0%, transparent 50%),
    radial-gradient(circle at 60% 70%, rgba(255, 69, 0, 0.18) 0%, transparent 50%),
    radial-gradient(circle at 30% 80%, rgba(255, 20, 147, 0.15) 0%, transparent 70%);
}

/* Add similar definitions for:
   - .mood-melancholic (blues, purples)
   - .mood-contemplative (deep purples, indigos)
   - .mood-nostalgic (soft pinks, lavenders)
   - .mood-rebellious (reds, dark oranges)
   - .mood-mystical (purples, magentas)
   - .mood-triumphant (golds, oranges)
   - .mood-vulnerable (soft blues, grays)
   - .mood-adventurous (greens, oranges)
*/
```

### 4. Enhanced Glassmorphism Components
```css
/* Enhanced Glassmorphism System */
.glass {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.08) 0%, 
    rgba(255, 255, 255, 0.04) 50%, 
    rgba(255, 255, 255, 0.02) 100%);
  backdrop-filter: blur(24px) saturate(200%) brightness(1.1);
  -webkit-backdrop-filter: blur(24px) saturate(200%) brightness(1.1);
  border: 1px solid transparent;
  border-image: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.2), 
    rgba(255, 255, 255, 0.05)) 1;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 -1px 0 rgba(255, 255, 255, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.1);
}

.glass::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.3), 
    transparent);
  opacity: 0.8;
}

.glass-card {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.1) 0%, 
    rgba(255, 255, 255, 0.05) 50%, 
    rgba(255, 255, 255, 0.03) 100%);
  backdrop-filter: blur(28px) saturate(180%) brightness(1.05);
  -webkit-backdrop-filter: blur(28px) saturate(180%) brightness(1.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.25),
    inset 0 -1px 0 rgba(255, 255, 255, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.1);
}

.glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.4), 
    transparent);
  opacity: 0.6;
}

.glass-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.1) 0%, 
    transparent 50%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.glass-card:hover {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.15) 0%, 
    rgba(255, 255, 255, 0.08) 50%, 
    rgba(255, 255, 255, 0.05) 100%);
  border-color: rgba(255, 255, 255, 0.25);
  box-shadow: 
    0 16px 64px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.35),
    inset 0 -1px 0 rgba(255, 255, 255, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.2),
    0 0 20px rgba(139, 92, 246, 0.1);
  transform: translateY(-6px) scale(1.01);
}

.glass-card:hover::after {
  opacity: 1;
}
```

### 5. Enhanced Music Track Cards
```css
/* Enhanced Glassmorphism Music Track Cards */
.track-card {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.12) 0%, 
    rgba(255, 255, 255, 0.06) 50%, 
    rgba(255, 255, 255, 0.04) 100%);
  backdrop-filter: blur(20px) saturate(180%) brightness(1.02);
  -webkit-backdrop-filter: blur(20px) saturate(180%) brightness(1.02);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  box-shadow: 
    0 6px 24px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    inset 0 -1px 0 rgba(255, 255, 255, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}

.track-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.5), 
    transparent);
  opacity: 0.7;
}

.track-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.08) 0%, 
    transparent 40%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.track-card:hover {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.18) 0%, 
    rgba(255, 255, 255, 0.1) 50%, 
    rgba(255, 255, 255, 0.06) 100%);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 12px 48px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    inset 0 -1px 0 rgba(255, 255, 255, 0.12),
    0 0 0 1px rgba(255, 255, 255, 0.15),
    0 0 24px rgba(139, 92, 246, 0.08);
  transform: translateY(-4px) scale(1.005);
}

.track-card:hover::after {
  opacity: 1;
}

.track-card:hover .album-art {
  transform: scale(1.08) rotate(1deg);
}
```

### 6. Enhanced Multi-Layered Floating Elements
```css
/* Enhanced Multi-Layered Floating Elements */
.floating-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.4;
  animation: float-enhanced 25s ease-in-out infinite;
  background: radial-gradient(circle, var(--primary-purple) 0%, transparent 80%);
  will-change: transform, filter;
}

.floating-orb:nth-child(odd) {
  animation-delay: -8s;
  filter: blur(40px) hue-rotate(30deg);
}

.floating-orb:nth-child(even) {
  animation-delay: -15s;
  filter: blur(80px) hue-rotate(-30deg);
}

/* Layered floating orbs */
.floating-orb-layer-1 {
  z-index: -8;
  opacity: 0.3;
  filter: blur(80px);
  animation-duration: 30s;
}

.floating-orb-layer-2 {
  z-index: -9;
  opacity: 0.5;
  filter: blur(60px);
  animation-duration: 25s;
}

.floating-orb-layer-3 {
  z-index: -10;
  opacity: 0.7;
  filter: blur(40px);
  animation-duration: 20s;
}

@keyframes float-enhanced {
  0%, 100% { 
    transform: translateY(0px) translateX(0px) scale(1) rotate(0deg); 
    filter: blur(60px) hue-rotate(0deg);
  }
  25% { 
    transform: translateY(-30px) translateX(15px) scale(1.1) rotate(90deg); 
    filter: blur(50px) hue-rotate(60deg);
  }
  50% { 
    transform: translateY(-60px) translateX(-15px) scale(0.9) rotate(180deg); 
    filter: blur(70px) hue-rotate(120deg);
  }
  75% { 
    transform: translateY(-30px) translateX(8px) scale(1.05) rotate(270deg); 
    filter: blur(45px) hue-rotate(180deg);
  }
}
```

### 7. Enhanced Button System with Border Highlighting
```css
/* Enhanced Glassmorphism Button System with Border Highlighting */
.btn-primary {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(124, 58, 237, 0.95) 100%);
  color: white;
  border: 1px solid transparent;
  border-radius: 16px;
  padding: 14px 28px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(16px) saturate(150%);
  -webkit-backdrop-filter: blur(16px) saturate(150%);
  box-shadow: 
    0 8px 32px rgba(139, 92, 246, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    inset 0 -1px 0 rgba(255, 255, 255, 0.1),
    0 0 0 1px rgba(139, 92, 246, 0.4);
}

.btn-primary::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.btn-primary::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.6), 
    transparent);
  opacity: 0.8;
}

.btn-primary:hover {
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.95) 0%, rgba(109, 40, 217, 1) 100%);
  transform: translateY(-3px) scale(1.02);
  box-shadow: 
    0 16px 48px rgba(139, 92, 246, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    inset 0 -1px 0 rgba(255, 255, 255, 0.15),
    0 0 0 1px rgba(139, 92, 246, 0.6),
    0 0 24px rgba(139, 92, 246, 0.3);
}

.btn-primary:hover::before {
  opacity: 1;
}

.btn-secondary {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.08) 0%, 
    rgba(255, 255, 255, 0.04) 100%);
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 14px 28px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(20px) saturate(120%);
  -webkit-backdrop-filter: blur(20px) saturate(120%);
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 6px 24px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 -1px 0 rgba(255, 255, 255, 0.05),
    0 0 0 1px rgba(255, 255, 255, 0.1);
}

.btn-secondary::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.4), 
    transparent);
  opacity: 0.6;
}

.btn-secondary:hover {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.12) 0%, 
    rgba(255, 255, 255, 0.08) 100%);
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-3px) scale(1.01);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    inset 0 -1px 0 rgba(255, 255, 255, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.2),
    0 0 16px rgba(255, 255, 255, 0.1);
}
```

## Implementation in React Components

### 1. Main Page Layout (`/app/page.tsx`)
```typescript
export default function Home() {
  const [currentMood, setCurrentMood] = useState<MoodSelection | null>(null)
  
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Dynamic Glassmorphism Background System */}
      <div className="modern-bg" />
      <div className={`gradient-overlay ${currentMood ? `mood-${currentMood.primary}` : ''}`} />
      
      {/* Enhanced Multi-Layered Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="floating-orb floating-orb-layer-3 w-96 h-96 -top-48 -left-48" 
             style={{background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)'}} />
        <div className="floating-orb floating-orb-layer-2 w-80 h-80 -bottom-40 -right-40" 
             style={{background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)'}} />
        <div className="floating-orb floating-orb-layer-1 w-64 h-64 top-1/3 -left-32" 
             style={{background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)'}} />
        <div className="floating-orb floating-orb-layer-2 w-72 h-72 bottom-1/4 -right-36" 
             style={{background: 'radial-gradient(circle, rgba(34, 197, 94, 0.25) 0%, transparent 70%)'}} />
        <div className="floating-orb floating-orb-layer-3 w-56 h-56 top-1/4 right-1/4" 
             style={{background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)'}} />
      </div>
      
      {/* Main Content with Glassmorphism Cards */}
      <div className="relative z-10">
        <motion.header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
          <div className="glass-card p-4">
            {/* Header content */}
          </div>
        </motion.header>
        
        <div className="min-h-screen flex flex-col px-6 pt-24">
          <div className="max-w-4xl mx-auto w-full">
            {/* Mood selection or results */}
          </div>
        </div>
        
        <motion.footer className="relative z-20 px-6 py-4">
          <div className="glass-card p-4">
            {/* Footer content */}
          </div>
        </motion.footer>
      </div>
    </main>
  )
}
```

### 2. Glass Card Component (`/components/GlassCard.tsx`)
```typescript
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
```

## Key Features

1. **Dynamic Mood Backgrounds**: 12+ unique color schemes that change based on mood selection
2. **Multi-Layered Depth**: 3-layer floating orb system with different blur and animation speeds
3. **Enhanced Glass Effects**: Improved blur, saturation, and brightness for better visual depth
4. **Border Highlighting**: Subtle gradient borders that enhance on hover
5. **Responsive Animations**: Smooth transitions and micro-interactions
6. **Performance Optimized**: Uses CSS transforms and will-change for smooth animations
7. **Cross-Browser Support**: Includes -webkit- prefixes for Safari compatibility

## Color Themes by Mood

- **Euphoric**: Golden yellows and bright oranges
- **Energetic**: Vibrant reds and magentas  
- **Serene**: Calming teals and aqua blues
- **Passionate**: Deep crimsons and hot pinks
- **Melancholic**: Soft blues and purples
- **Contemplative**: Deep purples and indigos
- **Nostalgic**: Soft pinks and lavenders
- **Rebellious**: Bold reds and dark oranges
- **Mystical**: Rich purples and magentas
- **Triumphant**: Golden yellows and oranges
- **Vulnerable**: Soft blues and subtle grays
- **Adventurous**: Vibrant greens and oranges

## Performance Considerations

- Uses `will-change` property for smooth animations
- Employs CSS transforms instead of layout changes
- Optimized blur values for performance
- Debounced animations to prevent excessive reflows
- Hardware acceleration with transform3d when needed

## Browser Support

- Modern browsers with backdrop-filter support
- Graceful fallback for older browsers
- -webkit- prefixes for Safari compatibility
- Tested on Chrome, Firefox, Safari, and Edge