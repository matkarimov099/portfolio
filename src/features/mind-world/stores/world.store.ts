import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import type { ZoneId, HUDState, NPCId, MiniGameId } from "../types";
import { CITY_ZONES } from "../constants/city-layout";

interface WorldStore {
  // Loading state
  isLoaded: boolean;
  loadingProgress: number;
  currentLoadingAsset: string;

  // World state
  currentZone: ZoneId;
  visitedZones: ZoneId[];
  collectedSkills: string[];
  secretsFound: string[];

  // Session
  sessionStartTime: number;
  totalPlayTime: number;

  // UI State
  hud: HUDState;
  isPaused: boolean;
  showInstructions: boolean;

  // NPC interaction
  currentNPC: NPCId | null;
  currentDialogueIndex: number;

  // Mini-game state
  activeMiniGame: MiniGameId | null;
  miniGameScores: Record<MiniGameId, number>;

  // Actions - Loading
  setLoaded: (isLoaded: boolean) => void;
  setLoadingProgress: (progress: number, asset?: string) => void;

  // Actions - World
  setCurrentZone: (zone: ZoneId) => void;
  visitZone: (zone: ZoneId) => void;
  collectSkill: (skillId: string) => void;
  findSecret: (secretId: string) => void;

  // Actions - UI
  setHUD: (hud: Partial<HUDState>) => void;
  togglePause: () => void;
  setPaused: (isPaused: boolean) => void;
  setShowInstructions: (show: boolean) => void;

  // Actions - NPC
  startNPCDialog: (npcId: NPCId) => void;
  endNPCDialog: () => void;
  nextDialogue: () => void;

  // Actions - Mini-games
  startMiniGame: (gameId: MiniGameId) => void;
  endMiniGame: (score?: number) => void;
  updateMiniGameScore: (gameId: MiniGameId, score: number) => void;

  // Actions - Session
  updatePlayTime: () => void;
  resetProgress: () => void;

  // Actions - Zone Detection
  detectZone: (x: number, z: number) => void;

  // Computed
  getVisitedZoneCount: () => number;
  getCollectedSkillCount: () => number;
  isZoneVisited: (zone: ZoneId) => boolean;
  isSkillCollected: (skillId: string) => boolean;
}

const DEFAULT_HUD: HUDState = {
  isVisible: true,
  showMinimap: true,
  showSkillInventory: false,
  showPauseMenu: false,
  showNPCDialog: false,
  currentNPC: null,
};

export const useWorldStore = create<WorldStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // Initial state
        isLoaded: false,
        loadingProgress: 0,
        currentLoadingAsset: "",

        currentZone: "neon-plaza",
        visitedZones: [],
        collectedSkills: [],
        secretsFound: [],

        sessionStartTime: Date.now(),
        totalPlayTime: 0,

        hud: { ...DEFAULT_HUD },
        isPaused: false,
        showInstructions: true,

        currentNPC: null,
        currentDialogueIndex: 0,

        activeMiniGame: null,
        miniGameScores: {
          "code-puzzle": 0,
          "memory-match": 0,
          "typing-challenge": 0,
          "bug-catcher": 0,
        },

        // Actions - Loading
        setLoaded: (isLoaded) => set({ isLoaded }),
        setLoadingProgress: (progress, asset) =>
          set({
            loadingProgress: progress,
            ...(asset && { currentLoadingAsset: asset }),
          }),

        // Actions - World
        setCurrentZone: (zone) => {
          set({ currentZone: zone });
          get().visitZone(zone);
        },

        visitZone: (zone) => {
          const { visitedZones } = get();
          if (!visitedZones.includes(zone)) {
            set({ visitedZones: [...visitedZones, zone] });
          }
        },

        collectSkill: (skillId) => {
          const { collectedSkills } = get();
          if (!collectedSkills.includes(skillId)) {
            set({ collectedSkills: [...collectedSkills, skillId] });
          }
        },

        findSecret: (secretId) => {
          const { secretsFound } = get();
          if (!secretsFound.includes(secretId)) {
            set({ secretsFound: [...secretsFound, secretId] });
          }
        },

        // Actions - UI
        setHUD: (hud) =>
          set((state) => ({
            hud: { ...state.hud, ...hud },
          })),

        togglePause: () =>
          set((state) => ({
            isPaused: !state.isPaused,
            hud: { ...state.hud, showPauseMenu: !state.isPaused },
          })),

        setPaused: (isPaused) =>
          set((state) => ({
            isPaused,
            hud: { ...state.hud, showPauseMenu: isPaused },
          })),

        setShowInstructions: (show) => set({ showInstructions: show }),

        // Actions - NPC
        startNPCDialog: (npcId) =>
          set((state) => ({
            currentNPC: npcId,
            currentDialogueIndex: 0,
            hud: { ...state.hud, showNPCDialog: true, currentNPC: npcId },
          })),

        endNPCDialog: () =>
          set((state) => ({
            currentNPC: null,
            currentDialogueIndex: 0,
            hud: { ...state.hud, showNPCDialog: false, currentNPC: null },
          })),

        nextDialogue: () =>
          set((state) => ({
            currentDialogueIndex: state.currentDialogueIndex + 1,
          })),

        // Actions - Mini-games
        startMiniGame: (gameId) =>
          set({
            activeMiniGame: gameId,
            isPaused: false,
          }),

        endMiniGame: (score) => {
          const { activeMiniGame } = get();
          if (activeMiniGame && score !== undefined) {
            get().updateMiniGameScore(activeMiniGame, score);
          }
          set({ activeMiniGame: null });
        },

        updateMiniGameScore: (gameId, score) =>
          set((state) => ({
            miniGameScores: {
              ...state.miniGameScores,
              [gameId]: Math.max(state.miniGameScores[gameId], score),
            },
          })),

        // Actions - Session
        updatePlayTime: () => {
          const { sessionStartTime, totalPlayTime } = get();
          const sessionTime = (Date.now() - sessionStartTime) / 1000;
          set({ totalPlayTime: totalPlayTime + sessionTime });
        },

        resetProgress: () =>
          set({
            visitedZones: [],
            collectedSkills: [],
            secretsFound: [],
            totalPlayTime: 0,
            miniGameScores: {
              "code-puzzle": 0,
              "memory-match": 0,
              "typing-challenge": 0,
              "bug-catcher": 0,
            },
          }),

        // Actions - Zone Detection
        detectZone: (x, z) => {
          const { currentZone } = get();

          // Check each zone's bounds to find which zone the player is in
          for (const zone of CITY_ZONES) {
            const { bounds } = zone;
            if (
              x >= bounds.x[0] &&
              x <= bounds.x[1] &&
              z >= bounds.z[0] &&
              z <= bounds.z[1]
            ) {
              if (zone.id !== currentZone) {
                set({ currentZone: zone.id });
                get().visitZone(zone.id);
              }
              return;
            }
          }

          // Player is on a street or between zones - keep current zone
        },

        // Computed
        getVisitedZoneCount: () => get().visitedZones.length,
        getCollectedSkillCount: () => get().collectedSkills.length,
        isZoneVisited: (zone) => get().visitedZones.includes(zone),
        isSkillCollected: (skillId) => get().collectedSkills.includes(skillId),
      }),
      {
        name: "mind-world-progress",
        partialize: (state) => ({
          visitedZones: state.visitedZones,
          collectedSkills: state.collectedSkills,
          secretsFound: state.secretsFound,
          totalPlayTime: state.totalPlayTime,
          miniGameScores: state.miniGameScores,
        }),
      },
    ),
  ),
);
