"use client";

import { Text } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { CITY_COLORS } from "../../constants/city-theme";

// ==================== Constants ====================

const BUILDING_WIDTH = 16;
const BUILDING_HEIGHT = 10;
const BUILDING_DEPTH = 12;

const WINDOW_ROWS = 2;
const WINDOWS_PER_ROW = 4;
const WINDOW_WIDTH = 0.8;
const WINDOW_HEIGHT = 0.6;
const WINDOW_DEPTH = 0.1;

const STAT_BOARDS = [
  { label: "Repositories: 50+" },
  { label: "Commits: 2000+" },
  { label: "Language: TypeScript" },
  { label: "Open Source" },
] as const;

// Fence perimeter extends 2m beyond building on each side
const FENCE_OFFSET_X = BUILDING_WIDTH / 2 + 2;
const FENCE_OFFSET_Z = BUILDING_DEPTH / 2 + 2;
const FENCE_POST_SPACING = 2;
const FENCE_POST_RADIUS = 0.03;
const FENCE_POST_HEIGHT = 1.2;
const FENCE_BAR_HEIGHT_LOW = 0.4;
const FENCE_BAR_HEIGHT_HIGH = 0.8;

// ==================== Window Face ====================

interface WindowFaceProps {
  face: "front" | "back" | "left" | "right";
}

function WindowFace({ face }: WindowFaceProps) {
  const windows = useMemo(() => {
    const items: { position: [number, number, number] }[] = [];

    const faceWidth =
      face === "left" || face === "right" ? BUILDING_DEPTH : BUILDING_WIDTH;
    const spacing = faceWidth / (WINDOWS_PER_ROW + 1);

    // Row Y positions: evenly spaced within the building
    const rowYPositions = [BUILDING_HEIGHT * 0.3, BUILDING_HEIGHT * 0.7];

    for (let row = 0; row < WINDOW_ROWS; row++) {
      const y = rowYPositions[row];

      for (let col = 0; col < WINDOWS_PER_ROW; col++) {
        const offset = (col + 1) * spacing - faceWidth / 2;

        let position: [number, number, number];
        if (face === "front") {
          position = [offset, y, BUILDING_DEPTH / 2 + WINDOW_DEPTH / 2];
        } else if (face === "back") {
          position = [offset, y, -BUILDING_DEPTH / 2 - WINDOW_DEPTH / 2];
        } else if (face === "right") {
          position = [BUILDING_WIDTH / 2 + WINDOW_DEPTH / 2, y, offset];
        } else {
          position = [-BUILDING_WIDTH / 2 - WINDOW_DEPTH / 2, y, offset];
        }

        items.push({ position });
      }
    }
    return items;
  }, [face]);

  return (
    <>
      {windows.map((w, i) => (
        <mesh key={`win-${face}-${i}`} position={w.position}>
          <boxGeometry
            args={[
              face === "front" || face === "back" ? WINDOW_WIDTH : WINDOW_DEPTH,
              WINDOW_HEIGHT,
              face === "front" || face === "back" ? WINDOW_DEPTH : WINDOW_WIDTH,
            ]}
          />
          <meshStandardMaterial
            color={CITY_COLORS.glass}
            roughness={0.2}
            metalness={0.3}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </>
  );
}

// ==================== Wall Panel Details ====================

function WallPanels() {
  const panels = useMemo(() => {
    const items: {
      position: [number, number, number];
      size: [number, number, number];
    }[] = [];

    // Front face: 3 horizontal panel strips
    const panelWidth = BUILDING_WIDTH * 0.9;
    const heights = [2, 5, 8];
    for (const h of heights) {
      items.push({
        position: [0, h, BUILDING_DEPTH / 2 + 0.06],
        size: [panelWidth, 0.15, 0.08],
      });
    }

    // Side faces: vertical accent strips
    for (const side of [-1, 1]) {
      items.push({
        position: [side * (BUILDING_WIDTH / 2 + 0.06), BUILDING_HEIGHT / 2, -2],
        size: [0.08, BUILDING_HEIGHT * 0.8, 0.15],
      });
      items.push({
        position: [side * (BUILDING_WIDTH / 2 + 0.06), BUILDING_HEIGHT / 2, 2],
        size: [0.08, BUILDING_HEIGHT * 0.8, 0.15],
      });
    }

    return items;
  }, []);

  return (
    <>
      {panels.map((p, i) => (
        <mesh key={`panel-${i}`} position={p.position}>
          <boxGeometry args={p.size} />
          <meshStandardMaterial
            color={CITY_COLORS.metalDark}
            roughness={0.7}
            metalness={0.2}
          />
        </mesh>
      ))}
    </>
  );
}

// ==================== Stat Board ====================

interface StatBoardProps {
  label: string;
  position: [number, number, number];
}

function StatBoard({ label, position }: StatBoardProps) {
  return (
    <group position={position}>
      {/* Metal pole */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.2, 8]} />
        <meshStandardMaterial
          color={CITY_COLORS.metalDark}
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>

      {/* Board panel */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[1, 1.5, 0.1]} />
        <meshStandardMaterial
          color={CITY_COLORS.buildingWhite}
          roughness={0.6}
          metalness={0.05}
        />
      </mesh>

      {/* Text on board */}
      <Text
        position={[0, 1.5, 0.06]}
        fontSize={0.15}
        color="#333333"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.85}
      >
        {label}
      </Text>

      {/* Small decorative line */}
      <mesh position={[0, 1.1, 0.06]}>
        <boxGeometry args={[0.6, 0.03, 0.01]} />
        <meshStandardMaterial
          color={CITY_COLORS.glass}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

// ==================== Security Fence ====================

function SecurityFence() {
  const fenceParts = useMemo(() => {
    const posts: { position: [number, number, number] }[] = [];
    const bars: {
      position: [number, number, number];
      size: [number, number, number];
    }[] = [];

    // Front edge (z = +FENCE_OFFSET_Z)
    for (
      let x = -FENCE_OFFSET_X;
      x <= FENCE_OFFSET_X;
      x += FENCE_POST_SPACING
    ) {
      posts.push({ position: [x, FENCE_POST_HEIGHT / 2, FENCE_OFFSET_Z] });
    }
    bars.push({
      position: [0, FENCE_BAR_HEIGHT_LOW, FENCE_OFFSET_Z],
      size: [FENCE_OFFSET_X * 2, 0.03, 0.03],
    });
    bars.push({
      position: [0, FENCE_BAR_HEIGHT_HIGH, FENCE_OFFSET_Z],
      size: [FENCE_OFFSET_X * 2, 0.03, 0.03],
    });

    // Back edge (z = -FENCE_OFFSET_Z)
    for (
      let x = -FENCE_OFFSET_X;
      x <= FENCE_OFFSET_X;
      x += FENCE_POST_SPACING
    ) {
      posts.push({ position: [x, FENCE_POST_HEIGHT / 2, -FENCE_OFFSET_Z] });
    }
    bars.push({
      position: [0, FENCE_BAR_HEIGHT_LOW, -FENCE_OFFSET_Z],
      size: [FENCE_OFFSET_X * 2, 0.03, 0.03],
    });
    bars.push({
      position: [0, FENCE_BAR_HEIGHT_HIGH, -FENCE_OFFSET_Z],
      size: [FENCE_OFFSET_X * 2, 0.03, 0.03],
    });

    // Left edge (x = -FENCE_OFFSET_X)
    for (
      let z = -FENCE_OFFSET_Z;
      z <= FENCE_OFFSET_Z;
      z += FENCE_POST_SPACING
    ) {
      posts.push({ position: [-FENCE_OFFSET_X, FENCE_POST_HEIGHT / 2, z] });
    }
    bars.push({
      position: [-FENCE_OFFSET_X, FENCE_BAR_HEIGHT_LOW, 0],
      size: [0.03, 0.03, FENCE_OFFSET_Z * 2],
    });
    bars.push({
      position: [-FENCE_OFFSET_X, FENCE_BAR_HEIGHT_HIGH, 0],
      size: [0.03, 0.03, FENCE_OFFSET_Z * 2],
    });

    // Right edge (x = +FENCE_OFFSET_X)
    for (
      let z = -FENCE_OFFSET_Z;
      z <= FENCE_OFFSET_Z;
      z += FENCE_POST_SPACING
    ) {
      posts.push({ position: [FENCE_OFFSET_X, FENCE_POST_HEIGHT / 2, z] });
    }
    bars.push({
      position: [FENCE_OFFSET_X, FENCE_BAR_HEIGHT_LOW, 0],
      size: [0.03, 0.03, FENCE_OFFSET_Z * 2],
    });
    bars.push({
      position: [FENCE_OFFSET_X, FENCE_BAR_HEIGHT_HIGH, 0],
      size: [0.03, 0.03, FENCE_OFFSET_Z * 2],
    });

    return { posts, bars };
  }, []);

  return (
    <>
      {/* Fence posts */}
      {fenceParts.posts.map((post, i) => (
        <mesh key={`fence-post-${i}`} position={post.position}>
          <cylinderGeometry
            args={[FENCE_POST_RADIUS, FENCE_POST_RADIUS, FENCE_POST_HEIGHT, 6]}
          />
          <meshStandardMaterial
            color={CITY_COLORS.metalDark}
            roughness={0.6}
            metalness={0.3}
          />
        </mesh>
      ))}

      {/* Horizontal bars */}
      {fenceParts.bars.map((bar, i) => (
        <mesh key={`fence-bar-${i}`} position={bar.position}>
          <boxGeometry args={bar.size} />
          <meshStandardMaterial
            color={CITY_COLORS.metalDark}
            roughness={0.6}
            metalness={0.3}
          />
        </mesh>
      ))}
    </>
  );
}

// ==================== Main DataCenter Component ====================

export function DataCenter() {
  return (
    <group position={[-250, 0, -50]}>
      {/* ==================== Main Building ==================== */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider
          args={[BUILDING_WIDTH / 2, BUILDING_HEIGHT / 2, BUILDING_DEPTH / 2]}
          position={[0, BUILDING_HEIGHT / 2, 0]}
        />

        {/* Building walls */}
        <mesh position={[0, BUILDING_HEIGHT / 2, 0]} castShadow>
          <boxGeometry
            args={[BUILDING_WIDTH, BUILDING_HEIGHT, BUILDING_DEPTH]}
          />
          <meshStandardMaterial
            color={CITY_COLORS.buildingGray}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
      </RigidBody>

      {/* ==================== Windows ==================== */}
      <WindowFace face="front" />
      <WindowFace face="back" />
      <WindowFace face="left" />
      <WindowFace face="right" />

      {/* ==================== Wall Panel Details ==================== */}
      <WallPanels />

      {/* ==================== Roof Edge ==================== */}
      <mesh position={[0, BUILDING_HEIGHT + 0.15, 0]}>
        <boxGeometry args={[BUILDING_WIDTH + 0.4, 0.3, BUILDING_DEPTH + 0.4]} />
        <meshStandardMaterial
          color={CITY_COLORS.roofGray}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* ==================== Roof Equipment ==================== */}
      {/* HVAC Unit 1 */}
      <mesh position={[-4, BUILDING_HEIGHT + 0.8, -2]} castShadow>
        <boxGeometry args={[2, 1, 1.5]} />
        <meshStandardMaterial
          color={CITY_COLORS.metal}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* HVAC vent detail on unit 1 */}
      <mesh position={[-4, BUILDING_HEIGHT + 1.35, -1.24]}>
        <boxGeometry args={[1.6, 0.06, 0.06]} />
        <meshStandardMaterial
          color={CITY_COLORS.metalDark}
          roughness={0.6}
          metalness={0.3}
        />
      </mesh>

      {/* HVAC Unit 2 */}
      <mesh position={[4, BUILDING_HEIGHT + 0.8, 2]} castShadow>
        <boxGeometry args={[2, 1, 1.5]} />
        <meshStandardMaterial
          color={CITY_COLORS.metal}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* HVAC vent detail on unit 2 */}
      <mesh position={[4, BUILDING_HEIGHT + 1.35, 2.76]}>
        <boxGeometry args={[1.6, 0.06, 0.06]} />
        <meshStandardMaterial
          color={CITY_COLORS.metalDark}
          roughness={0.6}
          metalness={0.3}
        />
      </mesh>

      {/* Satellite Dish: pole + flattened sphere as dish */}
      {/* Dish pole */}
      <mesh position={[0, BUILDING_HEIGHT + 1, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 1.5, 8]} />
        <meshStandardMaterial
          color={CITY_COLORS.metalDark}
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>

      {/* Dish (flattened sphere) */}
      <mesh position={[0, BUILDING_HEIGHT + 2, 0]} scale={[1, 0.3, 1]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial
          color={CITY_COLORS.buildingWhite}
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>

      {/* ==================== Entrance Door ==================== */}
      {/* Industrial door */}
      <mesh position={[0, 1.8, BUILDING_DEPTH / 2 + 0.12]}>
        <boxGeometry args={[2.5, 3.6, 0.2]} />
        <meshStandardMaterial
          color={CITY_COLORS.metalDark}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Door sign */}
      <Text
        position={[0, 3.8, BUILDING_DEPTH / 2 + 0.24]}
        fontSize={0.2}
        color="#333333"
        anchorX="center"
        anchorY="middle"
      >
        DATA CENTER
      </Text>

      {/* ==================== Data Stat Boards ==================== */}
      {STAT_BOARDS.map((stat, i) => {
        const spacing = BUILDING_WIDTH / (STAT_BOARDS.length + 1);
        const x = (i + 1) * spacing - BUILDING_WIDTH / 2;
        return (
          <StatBoard
            key={stat.label}
            label={stat.label}
            position={[x, 0, BUILDING_DEPTH / 2 + 3]}
          />
        );
      })}

      {/* ==================== Security Fence ==================== */}
      <SecurityFence />

      {/* ==================== Loading Dock ==================== */}
      {/* Platform on the right side of the building */}
      <mesh position={[BUILDING_WIDTH / 2 + 1.5, 0.15, 0]} receiveShadow>
        <boxGeometry args={[3, 0.3, 2]} />
        <meshStandardMaterial
          color={CITY_COLORS.sidewalk}
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* Dock edge marking */}
      <mesh position={[BUILDING_WIDTH / 2 + 2.99, 0.16, 0]}>
        <boxGeometry args={[0.06, 0.32, 2]} />
        <meshStandardMaterial
          color={CITY_COLORS.roadMarkingYellow}
          roughness={0.6}
          metalness={0}
        />
      </mesh>

      {/* ==================== Building Sign ==================== */}
      <Text
        position={[0, BUILDING_HEIGHT - 1, BUILDING_DEPTH / 2 + 0.08]}
        fontSize={0.6}
        color="#333333"
        anchorX="center"
        anchorY="middle"
      >
        DATA CENTER
      </Text>

      {/* ==================== Front Sidewalk ==================== */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, BUILDING_DEPTH / 2 + 2]}
        receiveShadow
      >
        <boxGeometry args={[BUILDING_WIDTH + 4, 3, 0.04]} />
        <meshStandardMaterial
          color={CITY_COLORS.sidewalk}
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
}
