"use client";

import { motion, AnimatePresence } from "motion/react";
import { IconX, IconStar } from "@tabler/icons-react";
import { useWorldStore } from "../../stores/world.store";
import {
  SKILL_STARS,
  SKILL_CATEGORY_NAMES,
  SKILL_CATEGORY_COLORS,
} from "../../constants/skills";
import type { SkillCategory } from "../../types";

export function SkillInventory() {
  const showSkillInventory = useWorldStore((state) => state.hud.showSkillInventory);
  const setHUD = useWorldStore((state) => state.setHUD);
  const collectedSkills = useWorldStore((state) => state.collectedSkills);

  const categories: SkillCategory[] = ["frontend", "state", "backend", "tools"];

  const getSkillsByCategory = (category: SkillCategory) => {
    return SKILL_STARS.filter((skill) => skill.category === category);
  };

  const isCollected = (skillId: string) => collectedSkills.includes(skillId);

  const getCategoryProgress = (category: SkillCategory) => {
    const skills = getSkillsByCategory(category);
    const collected = skills.filter((s) => isCollected(s.id)).length;
    return { collected, total: skills.length };
  };

  return (
    <AnimatePresence>
      {showSkillInventory && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setHUD({ showSkillInventory: false })}
        >
          <motion.div
            className="relative max-h-[80vh] w-full max-w-2xl overflow-auto rounded-xl border border-white/10 bg-gray-900/90 p-6 backdrop-blur-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Skill Inventory</h2>
                <p className="text-sm text-gray-400">
                  {collectedSkills.length} / {SKILL_STARS.length} skills
                  collected
                </p>
              </div>
              <button
                onClick={() => setHUD({ showSkillInventory: false })}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <IconX className="h-5 w-5" />
              </button>
            </div>

            {/* Overall progress */}
            <div className="mb-6">
              <div className="mb-2 h-3 overflow-hidden rounded-full bg-gray-800">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(collectedSkills.length / SKILL_STARS.length) * 100}%`,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-center text-xs text-gray-500">
                {Math.round((collectedSkills.length / SKILL_STARS.length) * 100)}
                % Complete
              </p>
            </div>

            {/* Categories */}
            <div className="space-y-6">
              {categories.map((category) => {
                const skills = getSkillsByCategory(category);
                const progress = getCategoryProgress(category);
                const color = SKILL_CATEGORY_COLORS[category];

                return (
                  <div key={category}>
                    {/* Category header */}
                    <div className="mb-3 flex items-center justify-between">
                      <h3
                        className="font-medium"
                        style={{ color }}
                      >
                        {SKILL_CATEGORY_NAMES[category]}
                      </h3>
                      <span className="text-sm text-gray-400">
                        {progress.collected}/{progress.total}
                      </span>
                    </div>

                    {/* Category progress */}
                    <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-gray-800">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: color }}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(progress.collected / progress.total) * 100}%`,
                        }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      />
                    </div>

                    {/* Skills grid */}
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {skills.map((skill) => {
                        const collected = isCollected(skill.id);
                        return (
                          <motion.div
                            key={skill.id}
                            className={`relative rounded-lg border p-3 transition-all ${
                              collected
                                ? "border-white/20 bg-white/5"
                                : "border-white/5 bg-black/20 opacity-50"
                            }`}
                            whileHover={{ scale: 1.05 }}
                          >
                            <div className="flex flex-col items-center">
                              <IconStar
                                className="mb-1 h-6 w-6"
                                style={{ color: collected ? color : "#4b5563" }}
                                fill={collected ? color : "none"}
                              />
                              <span
                                className={`text-center text-xs ${
                                  collected ? "text-white" : "text-gray-600"
                                }`}
                              >
                                {skill.name}
                              </span>
                            </div>
                            {collected && (
                              <motion.div
                                className="absolute -right-1 -top-1"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                              >
                                <div
                                  className="h-3 w-3 rounded-full"
                                  style={{ backgroundColor: color }}
                                />
                              </motion.div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hint */}
            <p className="mt-6 text-center text-xs text-gray-500">
              Visit the Skill Constellation zone to collect more skills
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
