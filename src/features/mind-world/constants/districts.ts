import type { District } from "../types";

export const DISTRICTS: District[] = [
  {
    id: "downtown",
    name: "Downtown",
    center: [50, 0, -50],
    bounds: { x: [-100, 200], z: [-200, 100] },
    groundColor: "#4a7c59",
    buildingDensity: 0.7,
    buildingTypeWeights: {
      office: 0.6,
      residential: 0.1,
      commercial: 0.2,
      warehouse: 0.1,
    },
  },
  {
    id: "business-district",
    name: "Business District",
    center: [-250, 0, -50],
    bounds: { x: [-400, -100], z: [-200, 100] },
    groundColor: "#4a7c59",
    buildingDensity: 0.5,
    buildingTypeWeights: {
      office: 0.7,
      residential: 0.05,
      commercial: 0.15,
      warehouse: 0.1,
    },
  },
  {
    id: "tech-harbor",
    name: "Tech Harbor",
    center: [-150, 0, -300],
    bounds: { x: [-300, 0], z: [-400, -200] },
    groundColor: "#3d6b4a",
    buildingDensity: 0.4,
    buildingTypeWeights: {
      office: 0.2,
      residential: 0.1,
      commercial: 0.1,
      warehouse: 0.6,
    },
  },
  {
    id: "cultural-quarter",
    name: "Cultural Quarter",
    center: [-225, 0, 250],
    bounds: { x: [-400, -50], z: [100, 400] },
    groundColor: "#5a8a63",
    buildingDensity: 0.35,
    buildingTypeWeights: {
      office: 0.15,
      residential: 0.4,
      commercial: 0.35,
      warehouse: 0.1,
    },
  },
  {
    id: "entertainment",
    name: "Entertainment District",
    center: [175, 0, 250],
    bounds: { x: [-50, 400], z: [100, 400] },
    groundColor: "#4a7c59",
    buildingDensity: 0.45,
    buildingTypeWeights: {
      office: 0.1,
      residential: 0.3,
      commercial: 0.5,
      warehouse: 0.1,
    },
  },
  {
    id: "central-park",
    name: "Central Park",
    center: [300, 0, 0],
    bounds: { x: [200, 400], z: [-100, 100] },
    groundColor: "#5a9a6a",
    buildingDensity: 0.05,
    buildingTypeWeights: {
      office: 0,
      residential: 0,
      commercial: 1,
      warehouse: 0,
    },
  },
] satisfies District[];

export const DISTRICT_MAP = new Map(DISTRICTS.map((d) => [d.id, d]));
