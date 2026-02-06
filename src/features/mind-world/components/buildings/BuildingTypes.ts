import type { BuildingType } from "../../types";

interface BuildingTypeConfig {
  widthRange: [number, number];
  heightRange: [number, number];
  depthRange: [number, number];
  colors: string[];
  roofColors: string[];
  roofTypes: ("flat" | "peaked" | "stepped")[];
  windowColor: string;
}

export const BUILDING_TYPE_CONFIG: Record<BuildingType, BuildingTypeConfig> = {
  office: {
    widthRange: [10, 16],
    heightRange: [20, 45],
    depthRange: [10, 16],
    colors: ["#D5D5D5", "#C0C0C0", "#E0E0E0", "#B8C4D0", "#CED4DA"],
    roofColors: ["#888888", "#777777", "#999999"],
    roofTypes: ["flat", "stepped"],
    windowColor: "#3B82F6",
  },
  residential: {
    widthRange: [8, 14],
    heightRange: [10, 20],
    depthRange: [8, 14],
    colors: ["#E8D5B7", "#D4A574", "#C9B896", "#DDD0B4", "#F0E6D3"],
    roofColors: ["#B74C4C", "#8B6914", "#6D4C41"],
    roofTypes: ["flat", "peaked"],
    windowColor: "#87CEEB",
  },
  commercial: {
    widthRange: [10, 18],
    heightRange: [6, 12],
    depthRange: [8, 14],
    colors: ["#E8E8E8", "#F0E6D3", "#D4A574", "#C0D4E8", "#E0D0C0"],
    roofColors: ["#B74C4C", "#777777", "#6D4C41"],
    roofTypes: ["flat", "peaked"],
    windowColor: "#3B82F6",
  },
  warehouse: {
    widthRange: [14, 22],
    heightRange: [6, 10],
    depthRange: [12, 18],
    colors: ["#8B8B8B", "#999999", "#A0A0A0", "#888888"],
    roofColors: ["#777777", "#666666", "#888888"],
    roofTypes: ["flat", "flat", "peaked"], // mostly flat
    windowColor: "#87CEEB",
  },
};

export const BUILDING_SPACING = 25; // minimum spacing between building centers
