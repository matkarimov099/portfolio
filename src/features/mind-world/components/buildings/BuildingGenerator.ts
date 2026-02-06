import type { BuildingConfig, BuildingType } from "../../types";
import { DISTRICTS } from "../../constants/districts";
import { LANDMARKS } from "../../constants/landmarks";
import { CITY_ZONES } from "../../constants/city-layout";
import { overlapsRoad } from "../../constants/road-grid";
import { BUILDING_TYPE_CONFIG, BUILDING_SPACING } from "./BuildingTypes";

// Seeded random for reproducible generation
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pickRandom<T>(arr: T[], random: () => number): T {
  return arr[Math.floor(random() * arr.length)];
}

function randomRange(min: number, max: number, random: () => number): number {
  return min + random() * (max - min);
}

function selectBuildingType(
  weights: Record<BuildingType, number>,
  random: () => number,
): BuildingType {
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  let r = random() * total;
  for (const [type, weight] of Object.entries(weights) as [
    BuildingType,
    number,
  ][]) {
    r -= weight;
    if (r <= 0) return type;
  }
  return "commercial"; // fallback
}

// Check if position overlaps with any reserved area (zones/landmarks)
function overlapsReserved(
  cx: number,
  cz: number,
  hw: number,
  hd: number,
): boolean {
  // Check portfolio zones
  for (const zone of CITY_ZONES) {
    const zb = zone.bounds;
    if (
      cx + hw > zb.x[0] - 5 &&
      cx - hw < zb.x[1] + 5 &&
      cz + hd > zb.z[0] - 5 &&
      cz - hd < zb.z[1] + 5
    ) {
      return true;
    }
  }

  // Check landmarks
  for (const lm of LANDMARKS) {
    const lx = lm.position[0];
    const lz = lm.position[2];
    const lhw = lm.footprint[0] / 2 + 10;
    const lhd = lm.footprint[1] / 2 + 10;
    if (
      cx + hw > lx - lhw &&
      cx - hw < lx + lhw &&
      cz + hd > lz - lhd &&
      cz - hd < lz + lhd
    ) {
      return true;
    }
  }

  return false;
}

export function generateBuildings(seed: number = 42): BuildingConfig[] {
  const random = seededRandom(seed);
  const buildings: BuildingConfig[] = [];
  const occupied: { cx: number; cz: number; hw: number; hd: number }[] = [];
  let id = 0;

  for (const district of DISTRICTS) {
    const { bounds, buildingDensity, buildingTypeWeights } = district;

    // Generate grid of potential building sites
    for (
      let x = bounds.x[0] + BUILDING_SPACING / 2;
      x < bounds.x[1];
      x += BUILDING_SPACING
    ) {
      for (
        let z = bounds.z[0] + BUILDING_SPACING / 2;
        z < bounds.z[1];
        z += BUILDING_SPACING
      ) {
        // Add some randomness to position (jitter)
        const jx = x + (random() - 0.5) * BUILDING_SPACING * 0.4;
        const jz = z + (random() - 0.5) * BUILDING_SPACING * 0.4;

        // Density check
        if (random() > buildingDensity) continue;

        // Select type
        const type = selectBuildingType(buildingTypeWeights, random);
        const config = BUILDING_TYPE_CONFIG[type];

        // Generate dimensions
        const width = randomRange(
          config.widthRange[0],
          config.widthRange[1],
          random,
        );
        const height = randomRange(
          config.heightRange[0],
          config.heightRange[1],
          random,
        );
        const depth = randomRange(
          config.depthRange[0],
          config.depthRange[1],
          random,
        );

        const hw = width / 2;
        const hd = depth / 2;

        // Skip if overlaps road
        if (overlapsRoad(jx, jz, hw + 2, hd + 2)) continue;

        // Skip if overlaps reserved area
        if (overlapsReserved(jx, jz, hw, hd)) continue;

        // Skip if overlaps another building
        const tooClose = occupied.some(
          (o) =>
            Math.abs(o.cx - jx) < o.hw + hw + 3 &&
            Math.abs(o.cz - jz) < o.hd + hd + 3,
        );
        if (tooClose) continue;

        occupied.push({ cx: jx, cz: jz, hw, hd });

        buildings.push({
          id: `bldg-${id++}`,
          type,
          position: [jx, height / 2, jz],
          width,
          height,
          depth,
          color: pickRandom(config.colors, random),
          roofColor: pickRandom(config.roofColors, random),
          roofType: pickRandom(config.roofTypes, random),
          windowColor: config.windowColor,
          districtId: district.id,
        });
      }
    }
  }

  return buildings;
}
