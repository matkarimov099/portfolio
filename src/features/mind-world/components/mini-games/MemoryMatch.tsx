"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconX, IconCards, IconTrophy, IconRefresh } from "@tabler/icons-react";
import { useWorldStore } from "../../stores/world.store";
import { useAchievementStore } from "../../stores/achievement.store";
import { MEMORY_CARDS } from "../../constants/mini-games";
import type { MemoryCard } from "../../types";

// Shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function MemoryMatch() {
  const activeMiniGame = useWorldStore((state) => state.activeMiniGame);
  const endMiniGame = useWorldStore((state) => state.endMiniGame);
  const updateProgress = useAchievementStore((state) => state.updateProgress);

  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const isActive = activeMiniGame === "memory-match";

  // Initialize game
  useEffect(() => {
    if (isActive) {
      initializeGame();
    }
  }, [isActive, initializeGame]);

  const initializeGame = () => {
    const initialCards: MemoryCard[] = shuffleArray(MEMORY_CARDS).map(
      (card) => ({
        ...card,
        isFlipped: false,
        isMatched: false,
      }),
    );
    setCards(initialCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setIsComplete(false);
  };

  const handleCardClick = useCallback(
    (cardId: string) => {
      if (isChecking) return;
      if (flippedCards.length >= 2) return;
      if (flippedCards.includes(cardId)) return;
      if (
        matchedPairs.some(
          (id) =>
            cards.find((c) => c.id === cardId)?.icon ===
            cards.find((c) => c.id === id)?.icon,
        )
      )
        return;

      const newFlipped = [...flippedCards, cardId];
      setFlippedCards(newFlipped);

      if (newFlipped.length === 2) {
        setMoves((m) => m + 1);
        setIsChecking(true);

        const [firstId, secondId] = newFlipped;
        const firstCard = cards.find((c) => c.id === firstId);
        const secondCard = cards.find((c) => c.id === secondId);

        if (firstCard?.icon === secondCard?.icon) {
          // Match!
          setTimeout(() => {
            setMatchedPairs((prev) => [...prev, firstId, secondId]);
            setCards((prev) =>
              prev.map((c) =>
                c.id === firstId || c.id === secondId
                  ? { ...c, isMatched: true }
                  : c,
              ),
            );
            setFlippedCards([]);
            setIsChecking(false);

            // Check completion
            if (matchedPairs.length + 2 === cards.length) {
              setIsComplete(true);
              updateProgress("memory-master", 1);
            }
          }, 500);
        } else {
          // No match
          setTimeout(() => {
            setFlippedCards([]);
            setIsChecking(false);
          }, 1000);
        }
      }
    },
    [cards, flippedCards, matchedPairs, isChecking, updateProgress],
  );

  const handleClose = () => {
    endMiniGame(matchedPairs.length);
  };

  const isCardFlipped = (cardId: string) => {
    return flippedCards.includes(cardId) || matchedPairs.includes(cardId);
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
          className="relative w-full max-w-2xl rounded-xl border border-yellow-500/30 bg-gray-900/95 p-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-yellow-500/20 p-2">
                <IconCards className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Memory Match</h2>
                <p className="text-sm text-gray-400">
                  Match the technology cards
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
          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-white/5 p-3 text-center">
              <p className="text-2xl font-bold text-yellow-400">{moves}</p>
              <p className="text-xs text-gray-400">Moves</p>
            </div>
            <div className="rounded-lg bg-white/5 p-3 text-center">
              <p className="text-2xl font-bold text-green-400">
                {matchedPairs.length / 2}
              </p>
              <p className="text-xs text-gray-400">Pairs Found</p>
            </div>
            <div className="rounded-lg bg-white/5 p-3 text-center">
              <p className="text-2xl font-bold text-purple-400">
                {cards.length / 2 - matchedPairs.length / 2}
              </p>
              <p className="text-xs text-gray-400">Remaining</p>
            </div>
          </div>

          {/* Card grid */}
          <div className="mb-6 grid grid-cols-4 gap-3">
            {cards.map((card) => (
              <motion.button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={isCardFlipped(card.id) || isChecking}
                className={`relative aspect-square rounded-lg border-2 transition-all ${
                  card.isMatched
                    ? "border-green-500/50 bg-green-500/20"
                    : flippedCards.includes(card.id)
                      ? "border-yellow-500 bg-yellow-500/20"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                }`}
                whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {isCardFlipped(card.id) ? (
                    <motion.div
                      key="front"
                      className="absolute inset-0 flex flex-col items-center justify-center"
                      initial={{ rotateY: -90 }}
                      animate={{ rotateY: 0 }}
                      exit={{ rotateY: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-2xl">
                        {getIconForCard(card.icon)}
                      </span>
                      <span className="mt-1 text-xs text-gray-400">
                        {card.name}
                      </span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="back"
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ rotateY: 90 }}
                      animate={{ rotateY: 0 }}
                      exit={{ rotateY: -90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-2xl text-gray-600">?</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>

          {/* Completion message */}
          {isComplete && (
            <motion.div
              className="mb-4 rounded-lg bg-green-500/20 p-4 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-center gap-2 text-green-400">
                <IconTrophy className="h-5 w-5" />
                <span className="font-medium">Completed in {moves} moves!</span>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={initializeGame}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-yellow-500 py-3 font-medium text-black transition-colors hover:bg-yellow-400"
            >
              <IconRefresh className="h-5 w-5" />
              {isComplete ? "Play Again" : "Restart"}
            </button>
            <button
              onClick={handleClose}
              className="rounded-lg bg-white/5 px-6 py-3 text-gray-300 transition-colors hover:bg-white/10"
            >
              Exit
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Simple icon mapping
function getIconForCard(icon: string): string {
  const icons: Record<string, string> = {
    react: "⚛️",
    nextjs: "▲",
    typescript: "🔷",
    nodejs: "🟢",
    docker: "🐳",
    postgresql: "🐘",
    git: "📦",
    tailwind: "🎨",
  };
  return icons[icon] || "💻";
}
