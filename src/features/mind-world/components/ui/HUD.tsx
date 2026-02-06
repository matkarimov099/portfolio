"use client";

import { motion } from "motion/react";
import {
  IconMap,
  IconStar,
  IconTrophy,
  IconSettings,
} from "@tabler/icons-react";
import { useWorldStore } from "../../stores/world.store";
import { usePlayerStore } from "../../stores/player.store";
import { useAchievementStore } from "../../stores/achievement.store";
import { ZONES } from "../../constants/zones";
import { SKILL_STARS } from "../../constants/skills";
import { Minimap } from "./Minimap";
import { FullScreenMap } from "./FullScreenMap";

export function HUD() {
  const currentZone = useWorldStore((state) => state.currentZone);
  const collectedSkills = useWorldStore((state) => state.collectedSkills);
  const togglePause = useWorldStore((state) => state.togglePause);
  const hud = useWorldStore((state) => state.hud);
  const setHUD = useWorldStore((state) => state.setHUD);

  const position = usePlayerStore((state) => state.position);

  const unlockedCount = useAchievementStore((state) =>
    state.getUnlockedCount(),
  );
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
          className="pointer-events-auto rounded-xl border border-gray-200/60 bg-white/85 px-4 py-3 shadow-lg backdrop-blur-md"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
              <IconMap className="h-4 w-4 text-green-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {currentZoneData?.name || "Unknown Zone"}
              </p>
              <p className="text-xs text-gray-500">
                {currentZoneData?.description?.slice(0, 40)}...
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick stats */}
        <motion.div
          className="pointer-events-auto flex items-center gap-4 rounded-xl border border-gray-200/60 bg-white/85 px-4 py-2.5 shadow-lg backdrop-blur-md"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-1.5">
            <IconStar className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium text-gray-700">
              {collectedSkills.length}/{SKILL_STARS.length}
            </span>
          </div>
          <div className="h-4 w-px bg-gray-200" />
          <div className="flex items-center gap-1.5">
            <IconTrophy className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium text-gray-700">
              {unlockedCount}/{totalCount}
            </span>
          </div>
          <div className="h-4 w-px bg-gray-200" />
          <div className="text-sm font-semibold text-blue-600">
            {totalPoints.toLocaleString()} pts
          </div>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4">
        {/* Controls hint */}
        <motion.div
          className="rounded-xl border border-gray-200/60 bg-white/85 px-3 py-2 shadow-lg backdrop-blur-md"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <span>
              <kbd className="rounded-md bg-gray-100 px-1.5 py-0.5 font-mono text-gray-800 shadow-sm">
                WASD
              </kbd>{" "}
              Move
            </span>
            <span>
              <kbd className="rounded-md bg-orange-100 px-1.5 py-0.5 font-mono text-orange-800 shadow-sm">
                SHIFT
              </kbd>{" "}
              Sprint
            </span>
            <span>
              <kbd className="rounded-md bg-blue-100 px-1.5 py-0.5 font-mono text-blue-800 shadow-sm">
                SPACE
              </kbd>{" "}
              Jump
            </span>
            <span>
              <kbd className="rounded-md bg-gray-100 px-1.5 py-0.5 font-mono text-gray-800 shadow-sm">
                MOUSE
              </kbd>{" "}
              Look
            </span>
            <span>
              <kbd className="rounded-md bg-blue-100 px-1.5 py-0.5 font-mono text-blue-800 shadow-sm">
                M
              </kbd>{" "}
              Map
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
            onClick={() =>
              setHUD({ showSkillInventory: !hud.showSkillInventory })
            }
            className="rounded-xl border border-gray-200/60 bg-white/85 p-2.5 shadow-lg backdrop-blur-md transition-colors hover:bg-gray-50"
          >
            <IconStar className="h-5 w-5 text-amber-500" />
          </button>
          <button
            onClick={togglePause}
            className="rounded-xl border border-gray-200/60 bg-white/85 p-2.5 shadow-lg backdrop-blur-md transition-colors hover:bg-gray-50"
          >
            <IconSettings className="h-5 w-5 text-gray-500" />
          </button>
        </motion.div>
      </div>

      {/* Crosshair */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-1.5 w-1.5 rounded-full bg-gray-800/40 shadow-sm" />
      </div>

      {/* Debug info (only in development) */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute right-4 top-20 rounded-lg bg-white/70 px-2 py-1 font-mono text-xs text-gray-500 backdrop-blur-sm">
          <p>
            Pos: {position.x.toFixed(1)}, {position.y.toFixed(1)},{" "}
            {position.z.toFixed(1)}
          </p>
        </div>
      )}

      {/* Minimap */}
      <Minimap />

      {/* Full-screen map overlay */}
      <FullScreenMap />
    </div>
  );
}
