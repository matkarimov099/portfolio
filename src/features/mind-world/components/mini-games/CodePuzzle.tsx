"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "motion/react";
import { IconX, IconPuzzle, IconTrophy, IconRefresh } from "@tabler/icons-react";
import { useWorldStore } from "../../stores/world.store";
import { useAchievementStore } from "../../stores/achievement.store";
import { CODE_PUZZLE_LEVELS } from "../../constants/mini-games";
import type { CodeBlock } from "../../types";

export function CodePuzzle() {
  const activeMiniGame = useWorldStore((state) => state.activeMiniGame);
  const endMiniGame = useWorldStore((state) => state.endMiniGame);
  const updateProgress = useAchievementStore((state) => state.updateProgress);

  const [currentLevel, setCurrentLevel] = useState(0);
  const [blocks, setBlocks] = useState<CodeBlock[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);

  const isActive = activeMiniGame === "code-puzzle";

  // Initialize game
  useEffect(() => {
    if (isActive) {
      loadLevel(0);
    }
  }, [isActive]);

  const loadLevel = (level: number) => {
    const levelData = CODE_PUZZLE_LEVELS[level];
    if (!levelData) return;

    // Shuffle blocks
    const shuffled = [...levelData.blocks].sort(() => Math.random() - 0.5);
    setBlocks(shuffled);
    setCurrentLevel(level);
    setIsCorrect(false);
    setAttempts(0);
  };

  const checkOrder = () => {
    const levelData = CODE_PUZZLE_LEVELS[currentLevel];
    const currentOrder = blocks.map((b) => b.id);
    const isOrderCorrect = currentOrder.every(
      (id, index) => id === levelData.correctOrder[index]
    );

    setAttempts((a) => a + 1);

    if (isOrderCorrect) {
      setIsCorrect(true);
      if (!completedLevels.includes(currentLevel)) {
        setCompletedLevels((prev) => [...prev, currentLevel]);
        updateProgress("code-wizard", completedLevels.length + 1);
      }
    }
  };

  const handleNextLevel = () => {
    if (currentLevel < CODE_PUZZLE_LEVELS.length - 1) {
      loadLevel(currentLevel + 1);
    }
  };

  const handleClose = () => {
    endMiniGame(completedLevels.length);
  };

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-xl rounded-xl border border-green-500/30 bg-gray-900/95 p-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-500/20 p-2">
                <IconPuzzle className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Code Puzzle</h2>
                <p className="text-sm text-gray-400">
                  Arrange the code blocks in correct order
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

          {/* Level indicator */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex gap-2">
              {CODE_PUZZLE_LEVELS.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-8 rounded-full transition-colors ${
                    completedLevels.includes(i)
                      ? "bg-green-500"
                      : i === currentLevel
                        ? "bg-green-500/50"
                        : "bg-gray-700"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-400">
              Level {currentLevel + 1} of {CODE_PUZZLE_LEVELS.length}
            </span>
          </div>

          {/* Puzzle area */}
          <div className="mb-6 rounded-lg bg-black/50 p-4">
            <Reorder.Group
              axis="y"
              values={blocks}
              onReorder={setBlocks}
              className="space-y-2"
            >
              {blocks.map((block) => (
                <Reorder.Item
                  key={block.id}
                  value={block}
                  className="cursor-grab rounded-lg border border-white/10 bg-gray-800 px-4 py-2 font-mono text-sm text-green-400 active:cursor-grabbing"
                  whileDrag={{
                    scale: 1.02,
                    boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)",
                  }}
                >
                  {block.code}
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>

          {/* Result feedback */}
          {isCorrect && (
            <motion.div
              className="mb-4 rounded-lg bg-green-500/20 p-4 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-center gap-2 text-green-400">
                <IconTrophy className="h-5 w-5" />
                <span className="font-medium">Correct! Well done!</span>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {isCorrect ? (
              currentLevel < CODE_PUZZLE_LEVELS.length - 1 ? (
                <button
                  onClick={handleNextLevel}
                  className="flex-1 rounded-lg bg-green-500 py-3 font-medium text-black transition-colors hover:bg-green-400"
                >
                  Next Level
                </button>
              ) : (
                <button
                  onClick={() => loadLevel(0)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-500 py-3 font-medium text-black transition-colors hover:bg-green-400"
                >
                  <IconRefresh className="h-5 w-5" />
                  Play Again
                </button>
              )
            ) : (
              <button
                onClick={checkOrder}
                className="flex-1 rounded-lg bg-green-500 py-3 font-medium text-black transition-colors hover:bg-green-400"
              >
                Check Order
              </button>
            )}
            <button
              onClick={handleClose}
              className="rounded-lg bg-white/5 px-6 py-3 text-gray-300 transition-colors hover:bg-white/10"
            >
              Exit
            </button>
          </div>

          {/* Stats */}
          <div className="mt-4 flex justify-between text-xs text-gray-500">
            <span>Attempts: {attempts}</span>
            <span>Completed: {completedLevels.length}/{CODE_PUZZLE_LEVELS.length}</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
