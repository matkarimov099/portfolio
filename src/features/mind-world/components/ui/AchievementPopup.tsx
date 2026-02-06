"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconTrophy, IconX } from "@tabler/icons-react";
import { useAchievementStore } from "../../stores/achievement.store";
import {
  DIFFICULTY_COLORS,
  ACHIEVEMENT_POINTS,
} from "../../constants/achievements";

export function AchievementPopup() {
  const showNotification = useAchievementStore(
    (state) => state.showNotification,
  );
  const currentNotification = useAchievementStore(
    (state) => state.currentNotification,
  );
  const dismissNotification = useAchievementStore(
    (state) => state.dismissNotification,
  );

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (showNotification && currentNotification) {
      const timer = setTimeout(() => {
        dismissNotification();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showNotification, currentNotification, dismissNotification]);

  const achievement = currentNotification?.achievement;

  return (
    <AnimatePresence>
      {showNotification && achievement && (
        <motion.div
          className="fixed right-4 top-20 z-50"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <div className="relative overflow-hidden rounded-lg border border-yellow-500/30 bg-gray-900/90 backdrop-blur-lg">
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent"
              animate={{ x: ["-200%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />

            <div className="relative p-4">
              {/* Header */}
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-yellow-500/20 p-1.5">
                    <IconTrophy className="h-4 w-4 text-yellow-400" />
                  </div>
                  <span className="text-xs font-medium text-yellow-400">
                    Achievement Unlocked!
                  </span>
                </div>
                <button
                  onClick={dismissNotification}
                  className="text-gray-500 transition-colors hover:text-white"
                >
                  <IconX className="h-4 w-4" />
                </button>
              </div>

              {/* Achievement info */}
              <div className="mb-2">
                <h3 className="font-bold text-white">{achievement.name}</h3>
                <p className="text-sm text-gray-400">
                  {achievement.description}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span
                  className="rounded-full px-2 py-0.5 text-xs"
                  style={{
                    backgroundColor: `${DIFFICULTY_COLORS[achievement.difficulty]}20`,
                    color: DIFFICULTY_COLORS[achievement.difficulty],
                  }}
                >
                  {achievement.difficulty.charAt(0).toUpperCase() +
                    achievement.difficulty.slice(1)}
                </span>
                <span className="text-sm font-medium text-yellow-400">
                  +{ACHIEVEMENT_POINTS[achievement.id]} pts
                </span>
              </div>
            </div>

            {/* Progress bar animation */}
            <motion.div
              className="h-1 bg-yellow-500"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
