"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Music, Heart, Zap, Leaf, Flame, Brain, Clock, Skull, Sparkles, Trophy, Shield, Mountain } from "lucide-react";
import { useMusic } from "@/lib/hooks/useMusic";
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts';
import { useIsMobile } from '@/lib/hooks/useTouchGestures';
import MusicResults from "@/components/MusicResults";
import ThemeToggle from '@/components/ThemeToggle';
import KeyboardShortcuts from '@/components/KeyboardShortcuts';
import BackgroundAnimation from '@/components/BackgroundAnimation';
import { MoodSelection } from '@/lib/types';

interface AnimatedTextCycleProps {
  words: string[];
  interval?: number;
  className?: string;
}

function AnimatedTextCycle({
  words,
  interval = 5000,
  className = "",
}: AnimatedTextCycleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [width, setWidth] = useState("auto");
  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (measureRef.current) {
      const elements = measureRef.current.children;
      if (elements.length > currentIndex) {
        const newWidth = elements[currentIndex].getBoundingClientRect().width;
        setWidth(`${newWidth}px`);
      }
    }
  }, [currentIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, words.length]);

  const containerVariants = {
    hidden: { 
      y: -20,
      opacity: 0,
      filter: "blur(8px)"
    },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      y: 20,
      opacity: 0,
      filter: "blur(8px)",
      transition: { 
        duration: 0.3, 
        ease: "easeIn"
      }
    },
  };

  return (
    <>
      <div 
        ref={measureRef} 
        aria-hidden="true"
        className="absolute opacity-0 pointer-events-none"
        style={{ visibility: "hidden" }}
      >
        {words.map((word, i) => (
          <span key={i} className={`font-bold ${className}`}>
            {word}
          </span>
        ))}
      </div>

      <motion.span 
        className="relative inline-block"
        animate={{ 
          width,
          transition: { 
            type: "spring",
            stiffness: 150,
            damping: 15,
            mass: 1.2,
          }
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={currentIndex}
            className={`inline-block font-bold ${className}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ whiteSpace: "nowrap" }}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </>
  );
}

interface MoodCardProps {
  mood: string;
  emoji: React.ReactNode;
  gradient: string;
  borderGradient: string;
  description: string;
  delay: number;
  onClick?: () => void;
}

function MoodCard({ mood, emoji, gradient, borderGradient, description, delay, onClick }: MoodCardProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotationX = (y - centerY) / 15;
      const rotationY = -(x - centerX) / 15;
      
      setRotation({ x: rotationX, y: rotationY });
    }
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: delay * 0.1,
        ease: [0.23, 1, 0.32, 1]
      }}
      className="perspective-1000"
    >
      <div
        ref={cardRef}
        className={`
          relative group cursor-pointer overflow-hidden rounded-2xl
          transition-all duration-500 ease-out
          hover:scale-105 hover:shadow-2xl
          transform-gpu
          ${gradient}
        `}
        style={{ 
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: "preserve-3d"
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        {/* Glassmorphic overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl" />
        
        {/* Gradient border */}
        <div className={`absolute inset-0 rounded-2xl p-[2px] ${borderGradient}`}>
          <div className="w-full h-full rounded-2xl bg-black/20" />
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-white/20 to-transparent blur-xl" />

        {/* Content */}
        <div className="relative z-10 p-6 h-48 flex flex-col justify-between">
          {/* Emoji with breathing animation */}
          <motion.div 
            className="text-4xl mb-3"
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {emoji}
          </motion.div>

          <div>
            <h3 className="text-white font-bold text-xl mb-2 tracking-wide">
              {mood}
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">
              {description}
            </p>
          </div>

          {/* Hover indicator */}
          <motion.div 
            className="absolute bottom-4 right-4 w-2 h-2 bg-white/60 rounded-full opacity-0 group-hover:opacity-100"
            animate={{
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Particle effects */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + i * 20}%`,
              }}
              animate={{
                y: [-10, -30, -10],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function FloatingOrb({ className, delay }: { className: string; delay: number }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-30 ${className}`}
      animate={{
        x: [0, 100, -50, 0],
        y: [0, -100, 50, 0],
        scale: [1, 1.2, 0.8, 1],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        delay: delay,
        ease: "linear"
      }}
    />
  );
}

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [currentMood, setCurrentMood] = useState<MoodSelection | null>(null);
  const { tracks, isLoading, fetchMusicForMood, clearMusic } = useMusic();
  
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [0.95, 1]);
  const headerBlur = useTransform(scrollY, [0, 100], [16, 24]);
  
  // Mobile detection
  const isMobile = useIsMobile();

  const moods = [
    {
      mood: "Euphoric",
      emoji: <Zap className="w-8 h-8" />,
      gradient: "bg-gradient-to-br from-orange-400 via-pink-500 to-yellow-500",
      borderGradient: "bg-gradient-to-r from-orange-400 to-yellow-500",
      description: "High energy beats that lift your spirits to the clouds"
    },
    {
      mood: "Melancholic",
      emoji: <Heart className="w-8 h-8" />,
      gradient: "bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800",
      borderGradient: "bg-gradient-to-r from-blue-500 to-purple-600",
      description: "Soulful melodies for introspective moments"
    },
    {
      mood: "Energetic",
      emoji: <Flame className="w-8 h-8" />,
      gradient: "bg-gradient-to-br from-red-500 via-pink-500 to-red-600",
      borderGradient: "bg-gradient-to-r from-red-500 to-pink-500",
      description: "Pump-up tracks that fuel your workout sessions"
    },
    {
      mood: "Serene",
      emoji: <Leaf className="w-8 h-8" />,
      gradient: "bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-500",
      borderGradient: "bg-gradient-to-r from-emerald-400 to-blue-500",
      description: "Peaceful sounds for meditation and relaxation"
    },
    {
      mood: "Passionate",
      emoji: <Heart className="w-8 h-8 text-red-300" />,
      gradient: "bg-gradient-to-br from-rose-600 via-red-600 to-rose-800",
      borderGradient: "bg-gradient-to-r from-rose-600 to-red-700",
      description: "Intense rhythms that ignite your inner fire"
    },
    {
      mood: "Contemplative",
      emoji: <Brain className="w-8 h-8" />,
      gradient: "bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800",
      borderGradient: "bg-gradient-to-r from-purple-600 to-indigo-600",
      description: "Deep compositions for thoughtful reflection"
    },
    {
      mood: "Nostalgic",
      emoji: <Clock className="w-8 h-8" />,
      gradient: "bg-gradient-to-br from-amber-600 via-orange-500 to-amber-700",
      borderGradient: "bg-gradient-to-r from-amber-600 to-orange-600",
      description: "Timeless classics that bring back memories"
    },
    {
      mood: "Rebellious",
      emoji: <Skull className="w-8 h-8" />,
      gradient: "bg-gradient-to-br from-red-600 via-black to-red-800",
      borderGradient: "bg-gradient-to-r from-red-600 to-black",
      description: "Raw power chords that break all the rules"
    },
    {
      mood: "Mystical",
      emoji: <Sparkles className="w-8 h-8" />,
      gradient: "bg-gradient-to-br from-purple-500 via-indigo-600 to-purple-900",
      borderGradient: "bg-gradient-to-r from-purple-500 to-indigo-600",
      description: "Ethereal soundscapes from otherworldly realms"
    },
    {
      mood: "Triumphant",
      emoji: <Trophy className="w-8 h-8" />,
      gradient: "bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600",
      borderGradient: "bg-gradient-to-r from-yellow-400 to-amber-500",
      description: "Victory anthems for your greatest achievements"
    },
    {
      mood: "Vulnerable",
      emoji: <Shield className="w-8 h-8" />,
      gradient: "bg-gradient-to-br from-pink-300 via-purple-300 to-pink-400",
      borderGradient: "bg-gradient-to-r from-pink-300 to-purple-300",
      description: "Gentle harmonies for your most tender moments"
    },
    {
      mood: "Adventurous",
      emoji: <Mountain className="w-8 h-8" />,
      gradient: "bg-gradient-to-br from-green-500 via-teal-600 to-blue-600",
      borderGradient: "bg-gradient-to-r from-green-500 to-blue-600",
      description: "Epic soundtracks for your next great journey"
    }
  ];

  const feelingWords = [
    "euphoric", "melancholic", "energetic", "serene", "passionate", 
    "contemplative", "nostalgic", "rebellious", "mystical", "triumphant"
  ];

  // Handle mood selection
  const handleMoodSelect = async (mood: string) => {
    setSelectedMood(mood);
    
    // Find the mood data to get the color
    const moodData = moods.find(m => m.mood === mood);
    const color = moodData?.gradient.includes('orange') ? '#FFA500' :
                  moodData?.gradient.includes('blue') ? '#4169E1' :
                  moodData?.gradient.includes('red') ? '#FF0000' :
                  moodData?.gradient.includes('emerald') ? '#50C878' :
                  moodData?.gradient.includes('purple') ? '#800080' :
                  moodData?.gradient.includes('amber') ? '#FFBF00' :
                  moodData?.gradient.includes('yellow') ? '#FFD700' :
                  moodData?.gradient.includes('pink') ? '#FFC0CB' :
                  moodData?.gradient.includes('green') ? '#00FF00' : '#8B00FF';
    
    // Convert mood string to MoodSelection object
    const moodSelection: MoodSelection = {
      primary: mood.toLowerCase(),
      color: color,
      intensity: 50,
      coordinates: { x: 0, y: 0 }
    };
    
    setCurrentMood(moodSelection);
    
    // Set mood class for styling
    if (typeof window !== 'undefined') {
      const moodClassMap: Record<string, string> = {
        'euphoric': 'mood-happy',
        'melancholic': 'mood-sad', 
        'energetic': 'mood-energetic',
        'serene': 'mood-calm',
        'passionate': 'mood-love',
        'contemplative': 'mood-calm',
        'nostalgic': 'mood-sad',
        'rebellious': 'mood-energetic',
        'mystical': 'mood-calm',
        'triumphant': 'mood-happy',
        'vulnerable': 'mood-sad',
        'adventurous': 'mood-energetic'
      };
      const mappedClass = moodClassMap[mood.toLowerCase()] || 'mood-happy';
      document.documentElement.className = mappedClass;
    }
    
    await fetchMusicForMood(moodSelection);
    
    // After 3 seconds (loading animation duration), show results
    setTimeout(() => {
      setShowResults(true);
      setSelectedMood(null);
    }, 3000);
  };

  // Reset when going back to mood selection
  const handleBackToMoods = () => {
    setShowResults(false);
    setSelectedMood(null);
    setCurrentMood(null);
    clearMusic();
    if (typeof window !== 'undefined') {
      document.documentElement.className = '';
    }
  };

  // Theme toggle functionality
  const toggleTheme = () => {
    if (typeof window !== 'undefined') {
      const currentTheme = localStorage.getItem('theme') || 'auto';
      const themeOrder = ['auto', 'light', 'dark'];
      const currentIndex = themeOrder.indexOf(currentTheme);
      const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length];
      
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('theme', nextTheme);
    }
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onThemeToggle: toggleTheme,
    onResetMood: handleBackToMoods,
    isEnabled: !selectedMood // Only enabled when not in modal
  });

  return (
    <main className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden ${isMobile ? 'mobile-full-height safe-area-padding' : ''}`}>
      {/* Animated background orbs */}
      <FloatingOrb 
        className="w-96 h-96 bg-purple-500 top-10 left-10" 
        delay={0} 
      />
      <FloatingOrb 
        className="w-64 h-64 bg-blue-500 top-1/2 right-20" 
        delay={5} 
      />
      <FloatingOrb 
        className="w-80 h-80 bg-teal-500 bottom-20 left-1/3" 
        delay={10} 
      />

      {/* Sound wave visualization */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              left: `${i * 5}%`,
              bottom: "20%",
              width: "2px",
            }}
            animate={{
              height: [20, 60, 20],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Dynamic background animation */}
      <BackgroundAnimation mood={currentMood} />

      {/* Modern Header */}
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-50 ${isMobile ? 'px-4 py-3' : 'px-6 py-4'}`}
        style={{ 
          opacity: headerOpacity,
          backdropFilter: `blur(${headerBlur}px)`
        }}
      >
        <div className="glass-card p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <motion.div
              className="flex items-center gap-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBackToMoods}
              style={{ cursor: 'pointer' }}
            >
              <Music className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                MoodMix
              </span>
            </motion.div>
            
            <div className="flex items-center gap-4">
              {currentMood && showResults && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  className="flex items-center gap-4"
                >
                  <div className="text-right">
                    <p className="text-small">Current Mood</p>
                    <p className="text-body font-medium capitalize">{currentMood.primary}</p>
                  </div>
                  <button
                    className="btn-secondary"
                    onClick={handleBackToMoods}
                  >
                    Change Mood
                  </button>
                </motion.div>
              )}
              <ThemeToggle />
              <KeyboardShortcuts />
            </div>
          </div>
        </div>
      </motion.header>

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key="mood-selection"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="container mx-auto px-6 py-12 pt-24"
            >
              {/* Hero Section */}
              <motion.div 
                className="text-center mb-16"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="mb-8">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                    Feeling{" "}
                    <AnimatedTextCycle 
                      words={feelingWords}
                      interval={2000}
                      className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
                    />
                    ?
                  </h1>

                  <motion.p 
                    className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    Let&apos;s find the perfect soundtrack for your current vibe. AI-curated playlists that match your energy and mood.
                  </motion.p>
                </div>
              </motion.div>

              {/* Mood Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {moods.map((moodData, index) => (
                  <MoodCard
                    key={moodData.mood}
                    {...moodData}
                    delay={index}
                    onClick={() => handleMoodSelect(moodData.mood)}
                  />
                ))}
              </div>

              {/* Selected Mood Display */}
              <AnimatePresence>
                {selectedMood && (
                  <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.9 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6"
                    onClick={() => setSelectedMood(null)}
                  >
                    <motion.div
                      className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-md w-full text-center"
                      onClick={(e) => e.stopPropagation()}
                      layoutId={selectedMood}
                    >
                      <motion.div
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="text-6xl mb-4"
                      >
                        🎵
                      </motion.div>
                      <h3 className="text-3xl font-bold text-white mb-4">
                        {selectedMood} Vibes
                      </h3>
                      <p className="text-white/80 mb-6">
                        Finding your perfect {selectedMood.toLowerCase()} tracks...
                      </p>
                      <motion.div
                        className="w-full bg-white/20 rounded-full h-2 mb-4 overflow-hidden"
                      >
                        <motion.div
                          className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 3, ease: "easeInOut" }}
                        />
                      </motion.div>
                      <div className="text-sm text-white/60 mt-2">
                        Loading your personalized playlist...
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="music-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="container mx-auto px-6 py-12 pt-24"
            >
              {/* Results header */}
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Your {currentMood?.primary || "Personalized"} Playlist
                </h2>
                <p className="text-white/60">
                  Discovered {tracks.length} tracks that match your mood
                </p>
              </motion.div>

              {/* Music Results */}
              <MusicResults 
                tracks={tracks} 
                isLoading={isLoading}
                moodDescription={`Perfect for when you're feeling ${(currentMood?.primary || "").toLowerCase()}`}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}