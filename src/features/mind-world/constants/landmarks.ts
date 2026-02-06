import type { LandmarkConfig } from "../types";

export const LANDMARKS: LandmarkConfig[] = [
  {
    id: "eiffel-tower",
    name: "Eiffel Tower",
    position: [-200, 0, -300],
    scale: 1,
    districtId: "tech-harbor",
    height: 60,
    footprint: [20, 20],
  },
  {
    id: "big-ben",
    name: "Big Ben",
    position: [-300, 0, 250],
    scale: 1,
    districtId: "cultural-quarter",
    height: 45,
    footprint: [8, 8],
  },
  {
    id: "empire-state",
    name: "Empire State Building",
    position: [-300, 0, -50],
    scale: 1,
    districtId: "business-district",
    height: 55,
    footprint: [14, 14],
  },
  {
    id: "burj-al-arab",
    name: "Burj Al Arab",
    position: [-250, 0, 50],
    scale: 1,
    districtId: "business-district",
    height: 50,
    footprint: [16, 16],
  },
  {
    id: "colosseum",
    name: "Colosseum",
    position: [-200, 0, 300],
    scale: 1,
    districtId: "cultural-quarter",
    height: 15,
    footprint: [30, 25],
  },
  {
    id: "tokyo-tower",
    name: "Tokyo Tower",
    position: [200, 0, 300],
    scale: 1,
    districtId: "entertainment",
    height: 55,
    footprint: [12, 12],
  },
] satisfies LandmarkConfig[];

export const LANDMARK_MAP = new Map(LANDMARKS.map((l) => [l.id, l]));
