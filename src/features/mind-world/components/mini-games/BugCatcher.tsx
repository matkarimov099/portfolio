"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconX, IconBug, IconTrophy, IconRefresh } from "@tabler/icons-react";
import { useWorldStore } from "../../stores/world.store";
import { useAchievementStore } from "../../stores/achievement.store";
import { BUG_CATCHER_CONFIG } from "../../constants/mini-games";

interface Bug {
  id: string;
  type: "syntax" | "logic" | "runtime";
  x: number;
  y: number;
  vx: number;
  vy: number;
  isCaught: boolean;
}

export function BugCatcher() {
  const activeMiniGame = useWorldStore((state) => state.activeMiniGame);
  const endMiniGame = useWorldStore((state) => state.endMiniGame);
  const updateProgress = useAchievementStore((state) => state.updateProgress);

  const [bugs, setBugs] = useState<Bug[]>([]);
  const [caughtCount, setCaughtCount] = useState(0);
  const [missedCount, setMissedCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(
    BUG_CATCHER_CONFIG.gameDuration,
  );
  const [isActive, setIsActive] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastSpawnRef = useRef(0);

  const isOpen = activeMiniGame === "bug-catcher";

  // Start game
  const startGame = () => {
    setBugs([]);
    setCaughtCount(0);
    setMissedCount(0);
    setTimeRemaining(BUG_CATCHER_CONFIG.gameDuration);
    setIsActive(true);
    setIsGameOver(false);
    lastSpawnRef.current = Date.now();
  };

  // Spawn bug
  const spawnBug = useCallback(() => {
    const types = BUG_CATCHER_CONFIG.bugTypes;
    const type = types[Math.floor(Math.random() * types.length)];
    const speed =
      BUG_CATCHER_CONFIG.bugSpeed.min +
      Math.random() *
        (BUG_CATCHER_CONFIG.bugSpeed.max - BUG_CATCHER_CONFIG.bugSpeed.min);

    const newBug: Bug = {
      id: `bug-${Date.now()}-${Math.random()}`,
      type: type.type,
      x: Math.random() * 80 + 10, // 10-90%
      y: -10, // Start above
      vx: (Math.random() - 0.5) * speed,
      vy: speed,
      isCaught: false,
    };

    setBugs((prev) => [...prev.slice(-BUG_CATCHER_CONFIG.maxBugs + 1), newBug]);
  }, []);

  // Game loop
  useEffect(() => {
    if (!isActive || isGameOver) return;

    const gameLoop = () => {
      const now = Date.now();

      // Spawn bugs
      if (now - lastSpawnRef.current > BUG_CATCHER_CONFIG.spawnInterval) {
        spawnBug();
        lastSpawnRef.current = now;
      }

      // Update bug positions
      setBugs((prev) =>
        prev
          .map((bug) => {
            if (bug.isCaught) return bug;
            return {
              ...bug,
              x: bug.x + bug.vx * 0.1,
              y: bug.y + bug.vy * 0.1,
              // Bounce off walls
              vx: bug.x < 5 || bug.x > 95 ? -bug.vx : bug.vx,
            };
          })
          .filter((bug) => {
            // Remove bugs that escape
            if (!bug.isCaught && bug.y > 110) {
              setMissedCount((c) => c + 1);
              return false;
            }
            return true;
          }),
      );

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, isGameOver, spawnBug]);

  // Timer
  useEffect(() => {
    if (!isActive || isGameOver) return;

    const timer = setInterval(() => {
      setTimeRemaining((t) => {
        if (t <= 1) {
          setIsActive(false);
          setIsGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, isGameOver]);

  // Handle game over
  useEffect(() => {
    if (isGameOver && caughtCount > 0) {
      if (caughtCount > highScore) {
        setHighScore(caughtCount);
      }
      updateProgress("bug-hunter", caughtCount);
    }
  }, [isGameOver, caughtCount, highScore, updateProgress]);

  // Catch bug
  const catchBug = (bugId: string) => {
    setBugs((prev) =>
      prev.map((bug) => (bug.id === bugId ? { ...bug, isCaught: true } : bug)),
    );

    const bug = bugs.find((b) => b.id === bugId);
    if (bug) {
      const _type = BUG_CATCHER_CONFIG.bugTypes.find((t) => t.type === bug.type);
      setCaughtCount((c) => c + 1);
    }

    // Remove caught bug after animation
    setTimeout(() => {
      setBugs((prev) => prev.filter((b) => b.id !== bugId));
    }, 300);
  };

  const handleClose = () => {
    setIsActive(false);
    endMiniGame(caughtCount);
  };

  const getBugColor = (type: string) => {
    const typeConfig = BUG_CATCHER_CONFIG.bugTypes.find((t) => t.type === type);
    return typeConfig?.color || "#EF4444";
  };

  const _getScore = () => {
    return bugs.reduce((score, bug) => {
      if (!bug.isCaught) return score;
      const type = BUG_CATCHER_CONFIG.bugTypes.find((t) => t.type === bug.type);
      return score + (type?.points || 10);
    }, 0);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-2xl rounded-xl border border-red-500/30 bg-gray-900/95 p-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-500/20 p-2">
                <IconBug className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Bug Catcher</h2>
                <p className="text-sm text-gray-400">
                  Click to catch the bugs!
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <IconX className="h-5 w-5" />
            </button>
          </div>

          {/* Stats */}
          <div className="mb-4 grid grid-cols-4 gap-3">
            <div className="rounded-lg bg-white/5 p-2 text-center">
              <p className="text-xl font-bold text-green-400">{caughtCount}</p>
              <p className="text-xs text-gray-400">Caught</p>
            </div>
            <div className="rounded-lg bg-white/5 p-2 text-center">
              <p className="text-xl font-bold text-red-400">{missedCount}</p>
              <p className="text-xs text-gray-400">Missed</p>
            </div>
            <div className="rounded-lg bg-white/5 p-2 text-center">
              <p className="text-xl font-bold text-yellow-400">
                {timeRemaining}s
              </p>
              <p className="text-xs text-gray-400">Time</p>
            </div>
            <div className="rounded-lg bg-white/5 p-2 text-center">
              <p className="text-xl font-bold text-purple-400">{highScore}</p>
              <p className="text-xs text-gray-400">Best</p>
            </div>
          </div>

          {/* Game area */}
          <div
            ref={containerRef}
            className="relative mb-4 h-80 overflow-hidden rounded-lg border border-white/10 bg-black/50"
          >
            {!isActive && !isGameOver && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={startGame}
                  className="rounded-lg bg-red-500 px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-red-600"
                >
                  Start Game
                </button>
              </div>
            )}

            {isGameOver && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                <IconTrophy className="mb-2 h-12 w-12 text-yellow-400" />
                <p className="text-2xl font-bold text-white">Game Over!</p>
                <p className="mb-4 text-gray-400">
                  You caught {caughtCount} bugs
                </p>
                <button
                  onClick={startGame}
                  className="flex items-center gap-2 rounded-lg bg-red-500 px-6 py-2 font-medium text-white transition-colors hover:bg-red-600"
                >
                  <IconRefresh className="h-5 w-5" />
                  Play Again
                </button>
              </div>
            )}

            {/* Bugs */}
            {bugs.map((bug) => (
              <motion.button
                key={bug.id}
                className="absolute cursor-pointer"
                style={{
                  left: `${bug.x}%`,
                  top: `${bug.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onClick={() => !bug.isCaught && catchBug(bug.id)}
                animate={
                  bug.isCaught
                    ? { scale: 0, opacity: 0 }
                    : { scale: 1, opacity: 1 }
                }
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.2 }}
              >
                <IconBug
                  className="h-8 w-8"
                  style={{ color: getBugColor(bug.type) }}
                />
              </motion.button>
            ))}
          </div>

          {/* Bug types legend */}
          <div className="flex justify-center gap-6 text-xs text-gray-400">
            {BUG_CATCHER_CONFIG.bugTypes.map((type) => (
              <div key={type.type} className="flex items-center gap-1">
                <IconBug className="h-4 w-4" style={{ color: type.color }} />
                <span>
                  {type.type}: {type.points}pts
                </span>
              </div>
            ))}
          </div>

          {/* Exit button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleClose}
              className="rounded-lg bg-white/5 px-6 py-2 text-gray-300 transition-colors hover:bg-white/10"
            >
              Exit
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
