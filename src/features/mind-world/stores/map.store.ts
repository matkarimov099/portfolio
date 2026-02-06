import { create } from "zustand";
import type { ChunkId } from "../types";

interface MapState {
  isMinimapVisible: boolean;
  isFullScreenMapOpen: boolean;
  minimapZoom: number;
  discoveredChunks: ChunkId[];
}

interface MapActions {
  toggleMinimap: () => void;
  toggleFullScreenMap: () => void;
  setMinimapZoom: (zoom: number) => void;
  discoverChunk: (chunkId: ChunkId) => void;
}

export const useMapStore = create<MapState & MapActions>()((set, get) => ({
  // Initial state
  isMinimapVisible: true,
  isFullScreenMapOpen: false,
  minimapZoom: 1,
  discoveredChunks: [],

  // Actions
  toggleMinimap: () => set((s) => ({ isMinimapVisible: !s.isMinimapVisible })),

  toggleFullScreenMap: () =>
    set((s) => ({ isFullScreenMapOpen: !s.isFullScreenMapOpen })),

  setMinimapZoom: (zoom) =>
    set({ minimapZoom: Math.max(0.5, Math.min(3, zoom)) }),

  discoverChunk: (chunkId) => {
    const current = get().discoveredChunks;
    if (!current.includes(chunkId)) {
      set({ discoveredChunks: [...current, chunkId] });
    }
  },
}));
