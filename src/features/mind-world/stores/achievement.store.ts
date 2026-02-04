import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import type { Achievement, AchievementId } from "../types";
import { ACHIEVEMENTS, ACHIEVEMENT_POINTS } from "../constants/achievements";

interface AchievementNotification {
  id: string;
  achievement: Achievement;
  timestamp: number;
}

interface AchievementStore {
  // Achievements
  achievements: Achievement[];
  unlockedAchievements: AchievementId[];
  totalPoints: number;

  // Notifications
  notifications: AchievementNotification[];
  showNotification: boolean;
  currentNotification: AchievementNotification | null;

  // Actions - Progress
  updateProgress: (achievementId: AchievementId, progress: number) => void;
  incrementProgress: (achievementId: AchievementId, amount?: number) => void;
  unlockAchievement: (achievementId: AchievementId) => void;

  // Actions - Notifications
  addNotification: (achievement: Achievement) => void;
  dismissNotification: () => void;
  clearNotifications: () => void;

  // Actions - Reset
  resetAchievements: () => void;

  // Computed
  getAchievement: (id: AchievementId) => Achievement | undefined;
  isUnlocked: (id: AchievementId) => boolean;
  getProgress: (id: AchievementId) => number;
  getProgressPercentage: (id: AchievementId) => number;
  getUnlockedCount: () => number;
  getTotalCount: () => number;
}

export const useAchievementStore = create<AchievementStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // Initial state
        achievements: ACHIEVEMENTS.map((a) => ({ ...a })),
        unlockedAchievements: [],
        totalPoints: 0,

        notifications: [],
        showNotification: false,
        currentNotification: null,

        // Actions - Progress
        updateProgress: (achievementId, progress) =>
          set((state) => {
            const achievements = state.achievements.map((a) => {
              if (a.id === achievementId) {
                const newProgress = Math.min(progress, a.maxProgress);
                const shouldUnlock = newProgress >= a.maxProgress && !a.unlocked;

                if (shouldUnlock) {
                  // Trigger unlock in next tick to allow state update
                  setTimeout(() => get().unlockAchievement(achievementId), 0);
                }

                return { ...a, progress: newProgress };
              }
              return a;
            });
            return { achievements };
          }),

        incrementProgress: (achievementId, amount = 1) => {
          const achievement = get().getAchievement(achievementId);
          if (achievement && !achievement.unlocked) {
            get().updateProgress(achievementId, achievement.progress + amount);
          }
        },

        unlockAchievement: (achievementId) =>
          set((state) => {
            if (state.unlockedAchievements.includes(achievementId)) {
              return state;
            }

            const achievements = state.achievements.map((a) => {
              if (a.id === achievementId) {
                const unlockedAchievement = {
                  ...a,
                  unlocked: true,
                  unlockedAt: new Date(),
                  progress: a.maxProgress,
                };

                // Add notification
                get().addNotification(unlockedAchievement);

                return unlockedAchievement;
              }
              return a;
            });

            const points = ACHIEVEMENT_POINTS[achievementId] || 0;

            return {
              achievements,
              unlockedAchievements: [...state.unlockedAchievements, achievementId],
              totalPoints: state.totalPoints + points,
            };
          }),

        // Actions - Notifications
        addNotification: (achievement) =>
          set((state) => {
            const notification: AchievementNotification = {
              id: `${achievement.id}-${Date.now()}`,
              achievement,
              timestamp: Date.now(),
            };

            return {
              notifications: [...state.notifications, notification],
              showNotification: true,
              currentNotification:
                state.currentNotification || notification,
            };
          }),

        dismissNotification: () =>
          set((state) => {
            const remainingNotifications = state.notifications.slice(1);
            return {
              notifications: remainingNotifications,
              showNotification: remainingNotifications.length > 0,
              currentNotification: remainingNotifications[0] || null,
            };
          }),

        clearNotifications: () =>
          set({
            notifications: [],
            showNotification: false,
            currentNotification: null,
          }),

        // Actions - Reset
        resetAchievements: () =>
          set({
            achievements: ACHIEVEMENTS.map((a) => ({ ...a })),
            unlockedAchievements: [],
            totalPoints: 0,
            notifications: [],
            showNotification: false,
            currentNotification: null,
          }),

        // Computed
        getAchievement: (id) => get().achievements.find((a) => a.id === id),

        isUnlocked: (id) => get().unlockedAchievements.includes(id),

        getProgress: (id) => {
          const achievement = get().getAchievement(id);
          return achievement?.progress || 0;
        },

        getProgressPercentage: (id) => {
          const achievement = get().getAchievement(id);
          if (!achievement) return 0;
          return (achievement.progress / achievement.maxProgress) * 100;
        },

        getUnlockedCount: () => get().unlockedAchievements.length,

        getTotalCount: () => get().achievements.length,
      }),
      {
        name: "mind-world-achievements",
        partialize: (state) => ({
          achievements: state.achievements,
          unlockedAchievements: state.unlockedAchievements,
          totalPoints: state.totalPoints,
        }),
      }
    )
  )
);

// Achievement check utilities - use with world store subscriptions
export const checkExplorerAchievement = (visitedZones: string[]) => {
  const store = useAchievementStore.getState();
  if (!store.isUnlocked("explorer")) {
    store.updateProgress("explorer", visitedZones.length);
  }
};

export const checkCollectorAchievement = (collectedSkills: string[]) => {
  const store = useAchievementStore.getState();
  if (!store.isUnlocked("collector")) {
    store.updateProgress("collector", collectedSkills.length);
  }
  if (!store.isUnlocked("stargazer")) {
    store.updateProgress("stargazer", collectedSkills.length);
  }
};

export const checkTimeTravelerAchievement = (stationsVisited: number) => {
  const store = useAchievementStore.getState();
  if (!store.isUnlocked("time-traveler")) {
    store.updateProgress("time-traveler", stationsVisited);
  }
};

export const checkSocialButterflyAchievement = (contactsFound: number) => {
  const store = useAchievementStore.getState();
  if (!store.isUnlocked("social-butterfly")) {
    store.updateProgress("social-butterfly", contactsFound);
  }
};

export const checkCuriousMindAchievement = (secretsFound: string[]) => {
  const store = useAchievementStore.getState();
  if (!store.isUnlocked("curious-mind")) {
    store.updateProgress("curious-mind", secretsFound.length);
  }
};
