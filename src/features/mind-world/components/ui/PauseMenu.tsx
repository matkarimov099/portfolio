"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  IconPlayerPlay,
  IconHome,
  IconRefresh,
  IconSettings,
  IconTrophy,
  IconStar,
  IconVolume,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useWorldStore } from "../../stores/world.store";
import { useAudioStore } from "../../stores/audio.store";
import { useAchievementStore } from "../../stores/achievement.store";
import { SKILL_STARS } from "../../constants/skills";

export function PauseMenu() {
  const router = useRouter();
  const isPaused = useWorldStore((state) => state.isPaused);
  const togglePause = useWorldStore((state) => state.togglePause);
  const resetProgress = useWorldStore((state) => state.resetProgress);
  const collectedSkills = useWorldStore((state) => state.collectedSkills);
  const visitedZones = useWorldStore((state) => state.visitedZones);
  const totalPlayTime = useWorldStore((state) => state.totalPlayTime);

  const masterVolume = useAudioStore((state) => state.masterVolume);
  const setMasterVolume = useAudioStore((state) => state.setMasterVolume);
  const musicVolume = useAudioStore((state) => state.musicVolume);
  const setMusicVolume = useAudioStore((state) => state.setMusicVolume);
  const sfxVolume = useAudioStore((state) => state.sfxVolume);
  const setSfxVolume = useAudioStore((state) => state.setSfxVolume);

  const unlockedCount = useAchievementStore((state) => state.getUnlockedCount());
  const totalCount = useAchievementStore((state) => state.getTotalCount());
  const totalPoints = useAchievementStore((state) => state.totalPoints);
  const resetAchievements = useAchievementStore((state) => state.resetAchievements);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      resetProgress();
      resetAchievements();
      togglePause();
    }
  };

  const handleExit = () => {
    if (confirm("Are you sure you want to exit? Your progress is automatically saved.")) {
      router.push("/");
    }
  };

  return (
    <AnimatePresence>
      {isPaused && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md rounded-xl border border-white/10 bg-gray-900/90 p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Header */}
            <h2 className="mb-6 text-center text-2xl font-bold text-white">
              Paused
            </h2>

            {/* Stats */}
            <div className="mb-6 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white/5 p-3">
                <div className="flex items-center gap-2 text-yellow-400">
                  <IconStar className="h-4 w-4" />
                  <span className="text-sm">Skills</span>
                </div>
                <p className="text-xl font-bold text-white">
                  {collectedSkills.length}/{SKILL_STARS.length}
                </p>
              </div>
              <div className="rounded-lg bg-white/5 p-3">
                <div className="flex items-center gap-2 text-orange-400">
                  <IconTrophy className="h-4 w-4" />
                  <span className="text-sm">Achievements</span>
                </div>
                <p className="text-xl font-bold text-white">
                  {unlockedCount}/{totalCount}
                </p>
              </div>
              <div className="rounded-lg bg-white/5 p-3">
                <p className="text-sm text-gray-400">Zones Visited</p>
                <p className="text-xl font-bold text-white">
                  {visitedZones.length}/7
                </p>
              </div>
              <div className="rounded-lg bg-white/5 p-3">
                <p className="text-sm text-gray-400">Total Points</p>
                <p className="text-xl font-bold text-purple-400">
                  {totalPoints.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Play time */}
            <p className="mb-6 text-center text-sm text-gray-400">
              Play Time: {formatTime(totalPlayTime)}
            </p>

            {/* Volume controls */}
            <div className="mb-6 space-y-3 rounded-lg bg-white/5 p-4">
              <div className="flex items-center gap-2 text-gray-300">
                <IconVolume className="h-4 w-4" />
                <span className="text-sm">Audio Settings</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="w-16 text-xs text-gray-400">Master</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={masterVolume}
                    onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                    className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-gray-700 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
                  />
                  <span className="w-10 text-right text-xs text-gray-500">
                    {Math.round(masterVolume * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-16 text-xs text-gray-400">Music</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={musicVolume}
                    onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                    className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-gray-700 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
                  />
                  <span className="w-10 text-right text-xs text-gray-500">
                    {Math.round(musicVolume * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-16 text-xs text-gray-400">SFX</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={sfxVolume}
                    onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                    className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-gray-700 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
                  />
                  <span className="w-10 text-right text-xs text-gray-500">
                    {Math.round(sfxVolume * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={togglePause}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-500 py-3 font-medium text-white transition-colors hover:bg-purple-600"
              >
                <IconPlayerPlay className="h-5 w-5" />
                Resume
              </button>

              <button
                onClick={handleReset}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/5 py-3 text-gray-300 transition-colors hover:bg-white/10"
              >
                <IconRefresh className="h-5 w-5" />
                Reset Progress
              </button>

              <button
                onClick={handleExit}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/5 py-3 text-gray-300 transition-colors hover:bg-white/10"
              >
                <IconHome className="h-5 w-5" />
                Exit to Portfolio
              </button>
            </div>

            {/* Hint */}
            <p className="mt-4 text-center text-xs text-gray-500">
              Press ESC to resume
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
