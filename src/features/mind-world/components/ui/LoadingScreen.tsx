"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useWorldStore } from "../../stores/world.store";

const LOADING_TIPS = [
  "Use WASD to move around",
  "Press SPACE to jump",
  "Hold SHIFT to sprint",
  "Click to look around",
  "Press E to interact",
  "Collect skill stars to fill your inventory",
  "Visit all 7 zones to unlock achievements",
  "Walk through portals to travel between zones",
  "Find hidden secrets for bonus points",
  "Press ESC to pause the game",
];

// Pre-computed particle positions to avoid hydration mismatch
const PARTICLES = [
  { id: 0, size: 4, left: 10, top: 15, duration: 2.5, delay: 0.2 },
  { id: 1, size: 3, left: 25, top: 30, duration: 3.1, delay: 0.8 },
  { id: 2, size: 5, left: 45, top: 10, duration: 2.8, delay: 1.2 },
  { id: 3, size: 2, left: 60, top: 50, duration: 3.5, delay: 0.5 },
  { id: 4, size: 4, left: 75, top: 25, duration: 2.2, delay: 1.5 },
  { id: 5, size: 3, left: 85, top: 70, duration: 3.8, delay: 0.3 },
  { id: 6, size: 5, left: 15, top: 80, duration: 2.9, delay: 1.1 },
  { id: 7, size: 2, left: 35, top: 60, duration: 3.3, delay: 0.7 },
  { id: 8, size: 4, left: 55, top: 85, duration: 2.6, delay: 1.8 },
  { id: 9, size: 3, left: 70, top: 40, duration: 3.0, delay: 0.4 },
  { id: 10, size: 5, left: 90, top: 20, duration: 2.4, delay: 1.3 },
  { id: 11, size: 2, left: 5, top: 45, duration: 3.6, delay: 0.9 },
  { id: 12, size: 4, left: 40, top: 75, duration: 2.7, delay: 1.6 },
  { id: 13, size: 3, left: 65, top: 5, duration: 3.2, delay: 0.1 },
  { id: 14, size: 5, left: 80, top: 55, duration: 2.3, delay: 1.4 },
  { id: 15, size: 2, left: 20, top: 90, duration: 3.4, delay: 0.6 },
  { id: 16, size: 4, left: 50, top: 35, duration: 2.1, delay: 1.7 },
  { id: 17, size: 3, left: 95, top: 65, duration: 3.7, delay: 0.0 },
  { id: 18, size: 5, left: 30, top: 95, duration: 2.0, delay: 1.0 },
  { id: 19, size: 2, left: 10, top: 55, duration: 3.9, delay: 1.9 },
];

export function LoadingScreen() {
  const isLoaded = useWorldStore((state) => state.isLoaded);
  const loadingProgress = useWorldStore((state) => state.loadingProgress);
  const [currentTip, setCurrentTip] = useState(0);
  const [showContent, setShowContent] = useState(true);

  // Rotate tips
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % LOADING_TIPS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Hide after loaded
  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => setShowContent(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  if (!showContent) return null;

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a1a]"
        >
          {/* Neural network background animation */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-transparent to-blue-900/50" />
            {PARTICLES.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full bg-purple-500"
                style={{
                  width: particle.size,
                  height: particle.size,
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                }}
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  delay: particle.delay,
                }}
              />
            ))}
          </div>

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Title */}
            <motion.h1
              className="mb-2 text-4xl font-bold text-white md:text-6xl"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                Developer's Mind
              </span>
            </motion.h1>

            <motion.p
              className="mb-8 text-lg text-gray-400"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              3D Portfolio Experience
            </motion.p>

            {/* Loading bar */}
            <div className="mb-6 h-2 w-64 overflow-hidden rounded-full bg-gray-800 md:w-96">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Progress percentage */}
            <motion.p
              className="mb-8 font-mono text-sm text-gray-400"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading neural pathways... {Math.round(loadingProgress)}%
            </motion.p>

            {/* Tips */}
            <div className="h-8">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentTip}
                  className="text-center text-sm text-gray-500"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  💡 {LOADING_TIPS[currentTip]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Decorative elements */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-600"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Press any key to continue when loaded
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
