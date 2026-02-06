import type { ZoneId } from "../types";

// ==================== Zone Layout ====================

export interface ZoneBounds {
  x: [number, number];
  z: [number, number];
}

export interface ZoneLayout {
  id: ZoneId;
  position: [number, number, number];
  bounds: ZoneBounds;
  color: string;
}

export const CITY_ZONES: ZoneLayout[] = [
  {
    id: "neon-plaza",
    position: [300, 0, 0],
    bounds: { x: [280, 380], z: [-50, 50] },
    color: "#4a7c59",
  },
  {
    id: "code-district",
    position: [0, 0, -50],
    bounds: { x: [-25, 25], z: [-75, -25] },
    color: "#3B82F6",
  },
  {
    id: "project-tower",
    position: [100, 0, -100],
    bounds: { x: [75, 125], z: [-125, -75] },
    color: "#6B7280",
  },
  {
    id: "data-bridge",
    position: [-250, 0, -50],
    bounds: { x: [-275, -225], z: [-75, -25] },
    color: "#8B8B8B",
  },
  {
    id: "chat-hq",
    position: [100, 0, 250],
    bounds: { x: [75, 125], z: [225, 275] },
    color: "#D4A574",
  },
  {
    id: "comm-terminal",
    position: [-150, 0, -300],
    bounds: { x: [-175, -125], z: [-325, -275] },
    color: "#1565C0",
  },
  {
    id: "memory-street",
    position: [-250, 0, 250],
    bounds: { x: [-275, -225], z: [225, 275] },
    color: "#F5F0E8",
  },
] satisfies ZoneLayout[];

// ==================== Legacy Streets (deprecated) ====================
// Roads are now handled by the grid system in road-grid.ts.
// This empty array is kept for backward compatibility with existing components.

export interface Street {
  id: string;
  from: ZoneId;
  to: ZoneId;
  start: [number, number, number];
  end: [number, number, number];
  width: number;
}

/** @deprecated Use GRID_ROADS from road-grid.ts instead */
export const CITY_STREETS: Street[] = [];

// ==================== Spawn & Map Bounds ====================

export const SPAWN_POSITION: [number, number, number] = [80, 2, 80];

export const MAP_BOUNDS = {
  x: [-400, 400] as [number, number],
  z: [-400, 400] as [number, number],
} as const;

export const CHUNK_SIZE = 200;
export const CHUNK_GRID = { min: -2, max: 1 } as const; // 4x4 grid: -2, -1, 0, 1
