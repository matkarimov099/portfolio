import { useMemo, useEffect } from "react";
import { usePlayerStore } from "../stores/player.store";
import { useMapStore } from "../stores/map.store";
import { CHUNK_SIZE, CHUNK_GRID } from "../constants/city-layout";
import type { ChunkId } from "../types";

export function useChunkCulling(): ChunkId[] {
  const position = usePlayerStore((state) => state.position);

  // Derive which chunk the player is currently in
  const playerChunkX =
    Math.floor((position.x + 400) / CHUNK_SIZE) + CHUNK_GRID.min;
  const playerChunkZ =
    Math.floor((position.z + 400) / CHUNK_SIZE) + CHUNK_GRID.min;

  // Build active chunk list: player's chunk + 8 neighbors (3x3 grid)
  // Only recalculates when the player crosses a chunk boundary
  const activeChunks = useMemo(() => {
    const chunks: ChunkId[] = [];

    for (let dx = -1; dx <= 1; dx++) {
      for (let dz = -1; dz <= 1; dz++) {
        const gx = playerChunkX + dx;
        const gz = playerChunkZ + dz;
        if (
          gx >= CHUNK_GRID.min &&
          gx <= CHUNK_GRID.max &&
          gz >= CHUNK_GRID.min &&
          gz <= CHUNK_GRID.max
        ) {
          chunks.push(`${gx}_${gz}` as ChunkId);
        }
      }
    }

    return chunks;
  }, [playerChunkX, playerChunkZ]);

  // Discover the current chunk on the minimap as the player moves through it
  const discoverChunk = useMapStore((state) => state.discoverChunk);

  useEffect(() => {
    const currentChunk = `${playerChunkX}_${playerChunkZ}` as ChunkId;
    discoverChunk(currentChunk);
  }, [playerChunkX, playerChunkZ, discoverChunk]);

  return activeChunks;
}
