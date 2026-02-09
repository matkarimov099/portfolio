"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconX, IconKeyboard, IconTrophy } from "@tabler/icons-react";
import { useWorldStore } from "../../stores/world.store";
import { useAchievementStore } from "../../stores/achievement.store";
import { TYPING_SNIPPETS } from "../../constants/mini-games";

export function TypingChallenge() {
  const activeMiniGame = useWorldStore((state) => state.activeMiniGame);
  const endMiniGame = useWorldStore((state) => state.endMiniGame);
  const updateMiniGameScore = useWorldStore(
    (state) => state.updateMiniGameScore,
  );
  const updateProgress = useAchievementStore((state) => state.updateProgress);

  const [currentSnippet, setCurrentSnippet] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isComplete, setIsComplete] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  const isActive = activeMiniGame === "typing-challenge";

  // Initialize game
  useEffect(() => {
    if (isActive) {
      startNewRound();
    }
  }, [isActive]);

  function startNewRound() {
    const randomSnippet =
      TYPING_SNIPPETS[Math.floor(Math.random() * TYPING_SNIPPETS.length)];
    setCurrentSnippet(randomSnippet);
    setUserInput("");
    setStartTime(null);
    setIsComplete(false);
    setWpm(0);
    setAccuracy(100);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  const calculateWPM = useCallback((input: string, startMs: number) => {
    const timeInMinutes = (Date.now() - startMs) / 60000;
    const wordsTyped = input.length / 5; // Standard: 5 chars = 1 word
    return Math.round(wordsTyped / timeInMinutes);
  }, []);

  const calculateAccuracy = useCallback((input: string, target: string) => {
    let correct = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === target[i]) correct++;
    }
    return Math.round((correct / input.length) * 100) || 100;
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Start timer on first input
    if (!startTime && value.length === 1) {
      setStartTime(Date.now());
    }

    setUserInput(value);

    if (startTime) {
      const currentWpm = calculateWPM(value, startTime);
      const currentAccuracy = calculateAccuracy(value, currentSnippet);
      setWpm(currentWpm);
      setAccuracy(currentAccuracy);
    }

    // Check completion
    if (value === currentSnippet) {
      setIsComplete(true);
      const finalWpm = calculateWPM(value, startTime!);
      const _finalAccuracy = calculateAccuracy(value, currentSnippet);

      if (finalWpm > highScore) {
        setHighScore(finalWpm);
        updateMiniGameScore("typing-challenge", finalWpm);
      }

      // Check achievement
      if (finalWpm >= 60) {
        updateProgress("speed-demon", finalWpm);
      }
    }
  };

  const handleClose = () => {
    endMiniGame(wpm);
  };

  const getCharacterClass = (index: number) => {
    if (index >= userInput.length) return "text-gray-500";
    if (userInput[index] === currentSnippet[index]) return "text-green-400";
    return "text-red-400 bg-red-400/20";
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
          className="relative w-full max-w-2xl rounded-xl border border-purple-500/30 bg-gray-900/95 p-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-500/20 p-2">
                <IconKeyboard className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Typing Challenge
                </h2>
                <p className="text-sm text-gray-400">
                  Type the code snippet as fast as you can
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
              <p className="text-2xl font-bold text-purple-400">{wpm}</p>
              <p className="text-xs text-gray-400">WPM</p>
            </div>
            <div className="rounded-lg bg-white/5 p-3 text-center">
              <p className="text-2xl font-bold text-green-400">{accuracy}%</p>
              <p className="text-xs text-gray-400">Accuracy</p>
            </div>
            <div className="rounded-lg bg-white/5 p-3 text-center">
              <p className="text-2xl font-bold text-yellow-400">{highScore}</p>
              <p className="text-xs text-gray-400">Best WPM</p>
            </div>
          </div>

          {/* Code display */}
          <div className="mb-4 rounded-lg bg-black/50 p-4 font-mono">
            <div className="text-lg leading-relaxed tracking-wide">
              {currentSnippet.split("").map((char, i) => (
                <span key={i} className={getCharacterClass(i)}>
                  {char}
                </span>
              ))}
            </div>
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            disabled={isComplete}
            className="mb-4 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-mono text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            placeholder={isComplete ? "Completed!" : "Start typing..."}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />

          {/* Completion message */}
          {isComplete && (
            <motion.div
              className="mb-4 rounded-lg bg-green-500/20 p-4 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-center gap-2 text-green-400">
                <IconTrophy className="h-5 w-5" />
                <span className="font-medium">
                  {wpm >= 60
                    ? `Amazing! ${wpm} WPM!`
                    : wpm >= 40
                      ? `Good job! ${wpm} WPM`
                      : `Completed at ${wpm} WPM`}
                </span>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={startNewRound}
              className="flex-1 rounded-lg bg-purple-500 py-3 font-medium text-white transition-colors hover:bg-purple-600"
            >
              {isComplete ? "Try Again" : "New Snippet"}
            </button>
            <button
              onClick={handleClose}
              className="rounded-lg bg-white/5 px-6 py-3 text-gray-300 transition-colors hover:bg-white/10"
            >
              Exit
            </button>
          </div>

          {/* Achievement hint */}
          <p className="mt-4 text-center text-xs text-gray-500">
            Reach 60+ WPM to unlock the "Speed Demon" achievement
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
