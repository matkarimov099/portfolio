"use client";

import { useCallback } from "react";
import { useWorldStore } from "../stores/world.store";
import {
  checkCollectorAchievement,
} from "../stores/achievement.store";
import { SKILL_STARS, SKILL_COLLECTION_RADIUS } from "../constants/skills";

export function useSkillCollection() {
  const collectSkill = useWorldStore((state) => state.collectSkill);
  const collectedSkills = useWorldStore((state) => state.collectedSkills);
  const isSkillCollected = useWorldStore((state) => state.isSkillCollected);

  const tryCollectSkill = useCallback(
    (playerPosition: [number, number, number]) => {
      const [px, py, pz] = playerPosition;

      for (const skill of SKILL_STARS) {
        if (isSkillCollected(skill.id)) continue;

        const [sx, sy, sz] = skill.position;
        const distance = Math.sqrt(
          (px - sx) ** 2 + (py - sy) ** 2 + (pz - sz) ** 2,
        );

        if (distance <= SKILL_COLLECTION_RADIUS) {
          collectSkill(skill.id);
          checkCollectorAchievement([...collectedSkills, skill.id]);
          return skill; // Return collected skill for effects
        }
      }

      return null;
    },
    [collectSkill, collectedSkills, isSkillCollected],
  );

  const getUncollectedSkills = useCallback(() => {
    return SKILL_STARS.filter((skill) => !isSkillCollected(skill.id));
  }, [isSkillCollected]);

  const getCollectedSkillsByCategory = useCallback(() => {
    const collected = SKILL_STARS.filter((skill) =>
      collectedSkills.includes(skill.id),
    );

    return {
      frontend: collected.filter((s) => s.category === "frontend"),
      state: collected.filter((s) => s.category === "state"),
      backend: collected.filter((s) => s.category === "backend"),
      tools: collected.filter((s) => s.category === "tools"),
    };
  }, [collectedSkills]);

  const getCategoryProgress = useCallback(() => {
    const total = {
      frontend: SKILL_STARS.filter((s) => s.category === "frontend").length,
      state: SKILL_STARS.filter((s) => s.category === "state").length,
      backend: SKILL_STARS.filter((s) => s.category === "backend").length,
      tools: SKILL_STARS.filter((s) => s.category === "tools").length,
    };

    const collected = getCollectedSkillsByCategory();

    return {
      frontend: { collected: collected.frontend.length, total: total.frontend },
      state: { collected: collected.state.length, total: total.state },
      backend: { collected: collected.backend.length, total: total.backend },
      tools: { collected: collected.tools.length, total: total.tools },
    };
  }, [getCollectedSkillsByCategory]);

  return {
    tryCollectSkill,
    getUncollectedSkills,
    getCollectedSkillsByCategory,
    getCategoryProgress,
    collectedCount: collectedSkills.length,
    totalCount: SKILL_STARS.length,
    isComplete: collectedSkills.length === SKILL_STARS.length,
  };
}
