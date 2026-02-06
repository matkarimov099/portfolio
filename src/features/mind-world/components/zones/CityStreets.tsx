"use client";

import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { GRID_ROADS, ROAD_CONFIG } from "../../constants/road-grid";
import { CITY_COLORS } from "../../constants/city-theme";

// ==================== Precomputed Data ====================

interface RoadMeshData {
  id: string;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}

interface SidewalkData {
  id: string;
  position: [number, number, number];
  size: [number, number, number];
}

interface EdgeLineData {
  id: string;
  position: [number, number, number];
  size: [number, number, number];
}

interface DashTransform {
  position: THREE.Vector3;
  scale: THREE.Vector3;
}

interface CrosswalkData {
  id: string;
  position: [number, number, number];
  rotation: number;
}

const SIDEWALK_WIDTH = 2;
const SIDEWALK_HEIGHT = 0.12;
const SIDEWALK_Y = SIDEWALK_HEIGHT / 2;
const EDGE_LINE_THICKNESS = 0.08;
const DASH_LENGTH = 1;
const DASH_GAP = 2;
const DASH_SPACING = DASH_LENGTH + DASH_GAP; // 3m
const DASH_WIDTH = 0.12;
const ROAD_Y = 0.02;
const MARKING_Y = 0.04;
const CROSSWALK_STRIPE_COUNT = 5;
const CROSSWALK_STRIPE_WIDTH = 3;
const CROSSWALK_STRIPE_LENGTH = 0.4;
const CROSSWALK_STRIPE_SPACING = 1;

function computeRoadMeshes(): RoadMeshData[] {
  return GRID_ROADS.map((road) => {
    const length = road.end - road.start;
    const center = (road.start + road.end) / 2;
    const color =
      road.type === "boulevard"
        ? ROAD_CONFIG.boulevard.color
        : ROAD_CONFIG.secondary.color;

    if (road.axis === "x") {
      return {
        id: road.id,
        position: [center, ROAD_Y, road.position] as [number, number, number],
        size: [length, 0.04, road.width] as [number, number, number],
        color,
      };
    }
    return {
      id: road.id,
      position: [road.position, ROAD_Y, center] as [number, number, number],
      size: [road.width, 0.04, length] as [number, number, number],
      color,
    };
  });
}

function computeSidewalks(): SidewalkData[] {
  const sidewalks: SidewalkData[] = [];

  for (const road of GRID_ROADS) {
    const length = road.end - road.start;
    const center = (road.start + road.end) / 2;
    const halfRoad = road.width / 2;
    const offset = halfRoad + SIDEWALK_WIDTH / 2;

    if (road.axis === "x") {
      sidewalks.push({
        id: `${road.id}-sw-left`,
        position: [center, SIDEWALK_Y, road.position - offset],
        size: [length, SIDEWALK_HEIGHT, SIDEWALK_WIDTH],
      });
      sidewalks.push({
        id: `${road.id}-sw-right`,
        position: [center, SIDEWALK_Y, road.position + offset],
        size: [length, SIDEWALK_HEIGHT, SIDEWALK_WIDTH],
      });
    } else {
      sidewalks.push({
        id: `${road.id}-sw-left`,
        position: [road.position - offset, SIDEWALK_Y, center],
        size: [SIDEWALK_WIDTH, SIDEWALK_HEIGHT, length],
      });
      sidewalks.push({
        id: `${road.id}-sw-right`,
        position: [road.position + offset, SIDEWALK_Y, center],
        size: [SIDEWALK_WIDTH, SIDEWALK_HEIGHT, length],
      });
    }
  }

  return sidewalks;
}

function computeEdgeLines(): EdgeLineData[] {
  const lines: EdgeLineData[] = [];

  for (const road of GRID_ROADS) {
    const length = road.end - road.start;
    const center = (road.start + road.end) / 2;
    const halfRoad = road.width / 2;
    const edgeOffset = halfRoad - 0.15;

    if (road.axis === "x") {
      lines.push({
        id: `${road.id}-edge-left`,
        position: [center, MARKING_Y, road.position - edgeOffset],
        size: [length, 0.01, EDGE_LINE_THICKNESS],
      });
      lines.push({
        id: `${road.id}-edge-right`,
        position: [center, MARKING_Y, road.position + edgeOffset],
        size: [length, 0.01, EDGE_LINE_THICKNESS],
      });
    } else {
      lines.push({
        id: `${road.id}-edge-left`,
        position: [road.position - edgeOffset, MARKING_Y, center],
        size: [EDGE_LINE_THICKNESS, 0.01, length],
      });
      lines.push({
        id: `${road.id}-edge-right`,
        position: [road.position + edgeOffset, MARKING_Y, center],
        size: [EDGE_LINE_THICKNESS, 0.01, length],
      });
    }
  }

  return lines;
}

function computeDashTransforms(): {
  xDashes: DashTransform[];
  zDashes: DashTransform[];
} {
  const xDashes: DashTransform[] = [];
  const zDashes: DashTransform[] = [];
  const boulevards = GRID_ROADS.filter((r) => r.type === "boulevard");

  for (const road of boulevards) {
    const dashCount = Math.floor((road.end - road.start) / DASH_SPACING);

    if (road.axis === "x") {
      for (let i = 0; i < dashCount; i++) {
        const x = road.start + i * DASH_SPACING + DASH_SPACING / 2;
        xDashes.push({
          position: new THREE.Vector3(x, MARKING_Y, road.position),
          scale: new THREE.Vector3(DASH_LENGTH, 0.01, DASH_WIDTH),
        });
      }
    } else {
      for (let i = 0; i < dashCount; i++) {
        const z = road.start + i * DASH_SPACING + DASH_SPACING / 2;
        zDashes.push({
          position: new THREE.Vector3(road.position, MARKING_Y, z),
          scale: new THREE.Vector3(DASH_WIDTH, 0.01, DASH_LENGTH),
        });
      }
    }
  }

  return { xDashes, zDashes };
}

function computeCrosswalks(): CrosswalkData[] {
  const crosswalks: CrosswalkData[] = [];
  const boulevardSpacing = ROAD_CONFIG.boulevard.spacing;
  const mapMin = -400;
  const mapMax = 400;

  // Boulevard positions along each axis
  const positions: number[] = [];
  for (let p = mapMin; p <= mapMax; p += boulevardSpacing) {
    positions.push(p);
  }

  // At each intersection of two boulevards, add 4 crosswalks (one per approach)
  let id = 0;
  for (const xPos of positions) {
    for (const zPos of positions) {
      const halfWidth = ROAD_CONFIG.boulevard.width / 2;

      // Crosswalk on the north side (crosses the X-axis road approaching from north)
      crosswalks.push({
        id: `cw-${id++}`,
        position: [xPos, MARKING_Y, zPos - halfWidth - 2],
        rotation: 0,
      });
      // South side
      crosswalks.push({
        id: `cw-${id++}`,
        position: [xPos, MARKING_Y, zPos + halfWidth + 2],
        rotation: 0,
      });
      // West side
      crosswalks.push({
        id: `cw-${id++}`,
        position: [xPos - halfWidth - 2, MARKING_Y, zPos],
        rotation: Math.PI / 2,
      });
      // East side
      crosswalks.push({
        id: `cw-${id++}`,
        position: [xPos + halfWidth + 2, MARKING_Y, zPos],
        rotation: Math.PI / 2,
      });
    }
  }

  return crosswalks;
}

// ==================== Sub-components ====================

function RoadSurfaces({ roads }: { roads: RoadMeshData[] }) {
  return (
    <group>
      {roads.map((road) => (
        <mesh key={road.id} position={road.position} receiveShadow>
          <boxGeometry args={road.size} />
          <meshStandardMaterial
            color={road.color}
            roughness={0.85}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

function Sidewalks({ sidewalks }: { sidewalks: SidewalkData[] }) {
  return (
    <group>
      {sidewalks.map((sw) => (
        <mesh key={sw.id} position={sw.position} receiveShadow castShadow>
          <boxGeometry args={sw.size} />
          <meshStandardMaterial
            color={CITY_COLORS.sidewalk}
            roughness={0.8}
            metalness={0.05}
          />
        </mesh>
      ))}
    </group>
  );
}

function EdgeLines({ lines }: { lines: EdgeLineData[] }) {
  return (
    <group>
      {lines.map((line) => (
        <mesh key={line.id} position={line.position}>
          <boxGeometry args={line.size} />
          <meshStandardMaterial
            color={CITY_COLORS.roadMarkingWhite}
            roughness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

function CenterDashes({ dashes }: { dashes: DashTransform[] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (!meshRef.current || dashes.length === 0) return;

    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();

    for (let i = 0; i < dashes.length; i++) {
      const { position, scale } = dashes[i];
      matrix.compose(position, quaternion, scale);
      meshRef.current.setMatrixAt(i, matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [dashes]);

  if (dashes.length === 0) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, dashes.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={CITY_COLORS.roadMarkingWhite}
        roughness={0.5}
      />
    </instancedMesh>
  );
}

function Crosswalks({ crosswalks }: { crosswalks: CrosswalkData[] }) {
  return (
    <group>
      {crosswalks.map((cw) => (
        <group
          key={cw.id}
          position={cw.position}
          rotation={[0, cw.rotation, 0]}
        >
          {Array.from({ length: CROSSWALK_STRIPE_COUNT }, (_, i) => {
            const offset =
              -((CROSSWALK_STRIPE_COUNT - 1) * CROSSWALK_STRIPE_SPACING) / 2 +
              i * CROSSWALK_STRIPE_SPACING;
            return (
              <mesh key={i} position={[0, 0.001, offset]}>
                <boxGeometry
                  args={[CROSSWALK_STRIPE_WIDTH, 0.01, CROSSWALK_STRIPE_LENGTH]}
                />
                <meshStandardMaterial
                  color={CITY_COLORS.roadMarkingWhite}
                  roughness={0.5}
                />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}

// ==================== Main Component ====================

export function CityStreets() {
  const { roads, sidewalks, edgeLines, xDashes, zDashes, crosswalks } =
    useMemo(() => {
      const roadData = computeRoadMeshes();
      const sidewalkData = computeSidewalks();
      const edgeLineData = computeEdgeLines();
      const { xDashes: xd, zDashes: zd } = computeDashTransforms();
      const crosswalkData = computeCrosswalks();

      return {
        roads: roadData,
        sidewalks: sidewalkData,
        edgeLines: edgeLineData,
        xDashes: xd,
        zDashes: zd,
        crosswalks: crosswalkData,
      };
    }, []);

  return (
    <group>
      {/* Road asphalt surfaces */}
      <RoadSurfaces roads={roads} />

      {/* Sidewalks along each road */}
      <Sidewalks sidewalks={sidewalks} />

      {/* White edge lines */}
      <EdgeLines lines={edgeLines} />

      {/* Center dashes for boulevards (InstancedMesh for performance) */}
      <CenterDashes dashes={xDashes} />
      <CenterDashes dashes={zDashes} />

      {/* Crosswalks at boulevard intersections */}
      <Crosswalks crosswalks={crosswalks} />
    </group>
  );
}
