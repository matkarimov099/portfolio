// City Theme - Realistic Low-Poly Colors

export const CITY_COLORS = {
  // Nature
  grass: "#4a7c59",
  grassLight: "#5a9a6a",
  treeTrunk: "#5D4037",
  treeCanopy: "#2E7D32",
  treeCanopyLight: "#388E3C",
  bush: "#388E3C",
  flowerRed: "#E53935",
  flowerYellow: "#FDD835",
  flowerWhite: "#FAFAFA",

  // Infrastructure
  road: "#666666",
  roadDark: "#555555",
  roadMarkingWhite: "#EEEEEE",
  roadMarkingYellow: "#FFC107",
  sidewalk: "#999999",
  sidewalkLight: "#AAAAAA",

  // Sky & Atmosphere
  sky: "#87CEEB",
  fog: "#B8D4E8",
  sunLight: "#FFF8E1",

  // Buildings
  buildingWhite: "#E8E8E8",
  buildingCream: "#F5F0E8",
  buildingWarm: "#D4A574",
  buildingGray: "#8B8B8B",
  buildingBrick: "#B74C4C",
  glass: "#3B82F6",
  glassDark: "#2563EB",
  door: "#4A3728",
  roofRed: "#B74C4C",
  roofGray: "#777777",
  roofBrown: "#6D4C41",

  // Furniture
  wood: "#8B6914",
  woodDark: "#5D4037",
  metal: "#777777",
  metalDark: "#555555",

  // Character
  skin: "#F5CBA7",
  skinShadow: "#E0B090",
  hair: "#5D4037",
  tshirt: "#3B82F6",
  jeans: "#3D3D5C",
  sneakers: "#F0F0F0",
  sneakerSole: "#888888",
  eyes: "#2C1810",

  // Traffic
  trafficPole: "#333333",
  trafficRed: "#E53935",
  trafficYellow: "#FFC107",
  trafficGreen: "#4CAF50",
  signWhite: "#FAFAFA",
  signBlue: "#1565C0",

  // Districts
  districtDowntown: "#4a7c59",
  districtBusiness: "#4a7c59",
  districtTechHarbor: "#3d6b4a",
  districtCultural: "#5a8a63",
  districtEntertainment: "#4a7c59",
  districtCentralPark: "#5a9a6a",

  // Landmarks
  landmarkSteel: "#A0A0A0",
  landmarkStone: "#C8BFA9",
  landmarkBrick: "#B74C4C",
  landmarkConcrete: "#999999",
  landmarkRedTower: "#CC3333",
  landmarkWhiteTower: "#F0F0F0",
  landmarkGoldAccent: "#D4A017",
  landmarkMarble: "#E8E0D0",
} as const;

export type CityColor = (typeof CITY_COLORS)[keyof typeof CITY_COLORS];

// Lighting configuration for daytime
export const CITY_LIGHTING = {
  directional: {
    color: "#FFF8E1",
    intensity: 1.5,
    position: [30, 50, 20] as [number, number, number],
  },
  hemisphere: {
    skyColor: "#87CEEB",
    groundColor: "#4a7c59",
    intensity: 0.6,
  },
  ambient: {
    color: "#ffffff",
    intensity: 0.3,
  },
} as const;

// Fog configuration
export const CITY_FOG = {
  color: "#B8D4E8",
  near: 80,
  far: 200,
} as const;
