"use client";

import { motion } from "motion/react";
import {
  IconMap,
  IconStar,
  IconTrophy,
  IconMusic,
  IconSettings,
} from "@tabler/icons-react";
import { useWorldStore } from "../../stores/world.store";
import { usePlayerStore } from "../../stores/player.store";
import { useAchievementStore } from "../../stores/achievement.store";
import { ZONES } from "../../constants/zones";
import { SKILL_STARS } from "../../constants/skills";

export function HUD() {
  const currentZone = useWorldStore((state) => state.currentZone);
  const collectedSkills = useWorldStore((state) => state.collectedSkills);
  const togglePause = useWorldStore((state) => state.togglePause);
  const hud = useWorldStore((state) => state.hud);
  const setHUD = useWorldStore((state) => state.setHUD);

  const position = usePlayerStore((state) => state.position);
  const isSprinting = usePlayerStore((state) => state.isSprinting);

  const unlockedCount = useAchievementStore((state) => state.getUnlockedCount());
  const totalCount = useAchievementStore((state) => state.getTotalCount());
  const totalPoints = useAchievementStore((state) => state.totalPoints);

  const currentZoneData = ZONES.find((z) => z.id === currentZone);

  if (!hud.isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      {/* Top bar */}
      <div className="absolute left-0 right-0 top-0 flex items-start justify-between p-4">
        {/* Zone indicator */}
        <motion.div
          className="pointer-events-auto rounded-lg border border-white/10 bg-black/50 px-4 py-2 backdrop-blur-md"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-2">
            <IconMap className="h-5 w-5 text-purple-400" />
            <div>
              <p className="text-sm font-medium text-white">
                {currentZoneData?.name || currentZone}
              </p>
              <p className="text-xs text-gray-400">
                {currentZoneData?.description?.slice(0, 40)}...
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick stats */}
        <motion.div
          className="pointer-events-auto flex items-center gap-4 rounded-lg border border-white/10 bg-black/50 px-4 py-2 backdrop-blur-md"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          {/* Skills collected */}
          <div className="flex items-center gap-2">
            <IconStar className="h-5 w-5 text-yellow-400" />
            <span className="text-sm text-white">
              {collectedSkills.length}/{SKILL_STARS.length}
            </span>
          </div>

          {/* Achievements */}
          <div className="flex items-center gap-2">
            <IconTrophy className="h-5 w-5 text-orange-400" />
            <span className="text-sm text-white">
              {unlockedCount}/{totalCount}
            </span>
          </div>

          {/* Points */}
          <div className="text-sm font-medium text-purple-400">
            {totalPoints.toLocaleString()} pts
          </div>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4">
        {/* Controls hint */}
        <motion.div
          className="rounded-lg border border-white/10 bg-black/50 px-3 py-2 backdrop-blur-md"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>
              <kbd className="rounded bg-gray-700 px-1.5 py-0.5 font-mono">
                WASD
              </kbd>{" "}
              Move
            </span>
            <span>
              <kbd className="rounded bg-gray-700 px-1.5 py-0.5 font-mono">
                SPACE
              </kbd>{" "}
              Jump
            </span>
            <span>
              <kbd className="rounded bg-gray-700 px-1.5 py-0.5 font-mono">
                SHIFT
              </kbd>{" "}
              Sprint
            </span>
            <span>
              <kbd className="rounded bg-gray-700 px-1.5 py-0.5 font-mono">E</kbd>{" "}
              Interact
            </span>
            <span>
              <kbd className="rounded bg-gray-700 px-1.5 py-0.5 font-mono">
                ESC
              </kbd>{" "}
              Pause
            </span>
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div
          className="pointer-events-auto flex items-center gap-2"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <button
            onClick={() => setHUD({ showSkillInventory: !hud.showSkillInventory })}
            className="rounded-lg border border-white/10 bg-black/50 p-2 backdrop-blur-md transition-colors hover:bg-white/10"
          >
            <IconStar className="h-5 w-5 text-yellow-400" />
          </button>
          <button
            onClick={togglePause}
            className="rounded-lg border border-white/10 bg-black/50 p-2 backdrop-blur-md transition-colors hover:bg-white/10"
          >
            <IconSettings className="h-5 w-5 text-gray-400" />
          </button>
        </motion.div>
      </div>

      {/* Sprint indicator */}
      {isSprinting && (
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <div className="rounded-full border border-purple-500/50 bg-purple-500/20 px-4 py-1 text-sm text-purple-300">
            Sprinting
          </div>
        </motion.div>
      )}

      {/* Crosshair */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-1 w-1 rounded-full bg-white/50" />
      </div>

      {/* Debug info (only in development) */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute right-4 top-20 font-mono text-xs text-gray-500">
          <p>
            Pos: {position.x.toFixed(1)}, {position.y.toFixed(1)},{" "}
            {position.z.toFixed(1)}
          </p>
        </div>
      )}
    </div>
  );
}
