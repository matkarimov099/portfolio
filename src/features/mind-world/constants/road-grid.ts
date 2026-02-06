import type { GridRoad, RoadType } from "../types";

export const ROAD_CONFIG = {
  boulevard: { width: 12, spacing: 160, color: "#555555" },
  secondary: { width: 8, spacing: 80, color: "#666666" },
} as const;

// Generate the full grid road network for 800x800 city
export function generateGridRoads(): GridRoad[] {
  const roads: GridRoad[] = [];
  const mapMin = -400;
  const mapMax = 400;
  let id = 0;

  // Generate roads along both axes
  for (const [type, config] of Object.entries(ROAD_CONFIG) as [
    RoadType,
    (typeof ROAD_CONFIG)[RoadType],
  ][]) {
    const spacing = config.spacing;

    // Roads running along X axis (fixed Z position)
    for (let z = mapMin; z <= mapMax; z += spacing) {
      // Skip if a boulevard already exists at this position for secondary roads
      if (type === "secondary" && z % ROAD_CONFIG.boulevard.spacing === 0)
        continue;

      roads.push({
        id: `road-x-${id++}`,
        type,
        axis: "x",
        position: z,
        start: mapMin,
        end: mapMax,
        width: config.width,
      });
    }

    // Roads running along Z axis (fixed X position)
    for (let x = mapMin; x <= mapMax; x += spacing) {
      if (type === "secondary" && x % ROAD_CONFIG.boulevard.spacing === 0)
        continue;

      roads.push({
        id: `road-z-${id++}`,
        type,
        axis: "z",
        position: x,
        start: mapMin,
        end: mapMax,
        width: config.width,
      });
    }
  }

  return roads;
}

// Pre-generated road list for import
export const GRID_ROADS = generateGridRoads();

// Helper: check if a point is on a road
export function isOnRoad(x: number, z: number): boolean {
  for (const road of GRID_ROADS) {
    const halfWidth = road.width / 2;
    if (road.axis === "x") {
      // Road runs along X, fixed Z
      if (
        Math.abs(z - road.position) <= halfWidth &&
        x >= road.start &&
        x <= road.end
      ) {
        return true;
      }
    } else {
      // Road runs along Z, fixed X
      if (
        Math.abs(x - road.position) <= halfWidth &&
        z >= road.start &&
        z <= road.end
      ) {
        return true;
      }
    }
  }
  return false;
}

// Helper: check if a rectangle overlaps any road
export function overlapsRoad(
  cx: number,
  cz: number,
  hw: number,
  hd: number,
): boolean {
  for (const road of GRID_ROADS) {
    const halfWidth = road.width / 2 + 2; // 2m buffer
    if (road.axis === "x") {
      if (
        cz + hd >= road.position - halfWidth &&
        cz - hd <= road.position + halfWidth &&
        cx + hw >= road.start &&
        cx - hw <= road.end
      ) {
        return true;
      }
    } else {
      if (
        cx + hw >= road.position - halfWidth &&
        cx - hw <= road.position + halfWidth &&
        cz + hd >= road.start &&
        cz - hd <= road.end
      ) {
        return true;
      }
    }
  }
  return false;
}
