"use client";

import { CHUNK_SIZE, CHUNK_GRID } from "../../constants/city-layout";
import { useChunkCulling } from "../../hooks/use-chunk-culling";
import type { ChunkId, ChunkConfig } from "../../types";

// Pre-generate all 16 chunk configs (4x4 grid)
const ALL_CHUNKS: ChunkConfig[] = [];

for (let gx = CHUNK_GRID.min; gx <= CHUNK_GRID.max; gx++) {
  for (let gz = CHUNK_GRID.min; gz <= CHUNK_GRID.max; gz++) {
    const cx = (gx - CHUNK_GRID.min) * CHUNK_SIZE - 400 + CHUNK_SIZE / 2;
    const cz = (gz - CHUNK_GRID.min) * CHUNK_SIZE - 400 + CHUNK_SIZE / 2;

    ALL_CHUNKS.push({
      id: `${gx}_${gz}` as ChunkId,
      gridX: gx,
      gridZ: gz,
      worldCenter: [cx, 0, cz],
      bounds: {
        x: [cx - CHUNK_SIZE / 2, cx + CHUNK_SIZE / 2],
        z: [cz - CHUNK_SIZE / 2, cz + CHUNK_SIZE / 2],
      },
    });
  }
}

interface CityChunkManagerProps {
  children?: React.ReactNode;
}

/**
 * Thin wrapper that holds the chunk grid data and re-exports
 * the useChunkCulling hook. Components that need active chunks
 * (e.g. InstancedBuildings, CityVegetation) call useChunkCulling directly.
 */
export function CityChunkManager({ children }: CityChunkManagerProps) {
  // Trigger chunk discovery side-effect even if no child reads activeChunks
  useChunkCulling();

  return <group>{children}</group>;
}

export { ALL_CHUNKS };
export { useChunkCulling } from "../../hooks/use-chunk-culling";
