"use client";

import { Text } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { CITY_COLORS } from "../../constants/city-theme";

// ==================== Constants ====================

const BUILDING_WIDTH = 22;
const BUILDING_HEIGHT = 8;
const BUILDING_DEPTH = 10;

const GALLERY_WINDOW_COUNT = 5;
const GALLERY_WINDOW_WIDTH = 2;
const GALLERY_WINDOW_HEIGHT = 4;
const GALLERY_WINDOW_DEPTH = 0.1;

const CAREER_MILESTONES = [
  { text: "2020-2021\nJunior Developer\nStartup" },
  { text: "2021-2022\nFrontend Developer\nTech Company" },
  { text: "2022-2023\nSenior Developer\nEnterprise" },
  { text: "2023-Present\nLead Developer\nFreelance" },
] as const;

// ==================== Gallery Windows ====================

function GalleryWindows() {
  const windows = useMemo(() => {
    const items: { position: [number, number, number] }[] = [];
    const spacing = BUILDING_WIDTH / (GALLERY_WINDOW_COUNT + 1);

    for (let i = 0; i < GALLERY_WINDOW_COUNT; i++) {
      const x = (i + 1) * spacing - BUILDING_WIDTH / 2;
      items.push({
        position: [
          x,
          BUILDING_HEIGHT / 2,
          BUILDING_DEPTH / 2 + GALLERY_WINDOW_DEPTH / 2,
        ],
      });
    }
    return items;
  }, []);

  return (
    <>
      {windows.map((w, i) => (
        <group key={`gallery-win-${i}`}>
          {/* Glass pane */}
          <mesh position={w.position}>
            <boxGeometry
              args={[
                GALLERY_WINDOW_WIDTH,
                GALLERY_WINDOW_HEIGHT,
                GALLERY_WINDOW_DEPTH,
              ]}
            />
            <meshStandardMaterial
              color={CITY_COLORS.glass}
              roughness={0.2}
              metalness={0.3}
              transparent
              opacity={0.25}
            />
          </mesh>

          {/* Window frame - top */}
          <mesh
            position={[
              w.position[0],
              w.position[1] + GALLERY_WINDOW_HEIGHT / 2 + 0.05,
              w.position[2] + 0.01,
            ]}
          >
            <boxGeometry args={[GALLERY_WINDOW_WIDTH + 0.15, 0.08, 0.04]} />
            <meshStandardMaterial
              color={CITY_COLORS.buildingGray}
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>

          {/* Window frame - bottom */}
          <mesh
            position={[
              w.position[0],
              w.position[1] - GALLERY_WINDOW_HEIGHT / 2 - 0.05,
              w.position[2] + 0.01,
            ]}
          >
            <boxGeometry args={[GALLERY_WINDOW_WIDTH + 0.15, 0.08, 0.04]} />
            <meshStandardMaterial
              color={CITY_COLORS.buildingGray}
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

// ==================== Career Display Stand ====================

interface CareerStandProps {
  text: string;
  position: [number, number, number];
}

function CareerStand({ text, position }: CareerStandProps) {
  return (
    <group position={position}>
      {/* Metal legs */}
      <mesh position={[-0.55, 0.6, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 1.2, 6]} />
        <meshStandardMaterial
          color={CITY_COLORS.metalDark}
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>
      <mesh position={[0.55, 0.6, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 1.2, 6]} />
        <meshStandardMaterial
          color={CITY_COLORS.metalDark}
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>

      {/* White display panel */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <boxGeometry args={[1.5, 2, 0.1]} />
        <meshStandardMaterial
          color={CITY_COLORS.signWhite}
          roughness={0.6}
          metalness={0.05}
        />
      </mesh>

      {/* Thin gray border */}
      <mesh position={[0, 1.8, 0.06]}>
        <boxGeometry args={[1.55, 2.05, 0.01]} />
        <meshStandardMaterial
          color={CITY_COLORS.buildingGray}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Career text */}
      <Text
        position={[0, 1.8, 0.07]}
        fontSize={0.12}
        color="#333333"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.3}
        textAlign="center"
      >
        {text}
      </Text>

      {/* Small decorative line under text */}
      <mesh position={[0, 1.15, 0.06]}>
        <boxGeometry args={[0.8, 0.03, 0.01]} />
        <meshStandardMaterial
          color={CITY_COLORS.glass}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

// ==================== Garden Flower Spheres ====================

function GardenArea() {
  const flowers = useMemo(() => {
    const colors = [
      CITY_COLORS.flowerRed,
      CITY_COLORS.flowerYellow,
      CITY_COLORS.flowerWhite,
    ];
    const items: {
      pos: [number, number, number];
      color: string;
      radius: number;
    }[] = [];

    // Cluster of decorative flower spheres near entrance
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2 + Math.random() * 0.3;
      const dist = 0.4 + Math.random() * 0.8;
      items.push({
        pos: [
          Math.cos(angle) * dist,
          0.05 + Math.random() * 0.04,
          Math.sin(angle) * dist,
        ],
        color: colors[i % colors.length],
        radius: 0.05 + Math.random() * 0.03,
      });
    }
    return items;
  }, []);

  return (
    <group position={[3, 0, BUILDING_DEPTH / 2 + 2]}>
      {/* Soil patch */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[1.2, 16]} />
        <meshStandardMaterial color="#5D4037" roughness={0.95} metalness={0} />
      </mesh>

      {/* Flower spheres */}
      {flowers.map((flower, i) => (
        <mesh key={`flower-${i}`} position={flower.pos}>
          <sphereGeometry args={[flower.radius, 8, 8]} />
          <meshStandardMaterial
            color={flower.color}
            roughness={0.7}
            metalness={0}
          />
        </mesh>
      ))}
    </group>
  );
}

// ==================== Main CareerMuseum Component ====================

export function CareerMuseum() {
  return (
    <group position={[-250, 0, 250]}>
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
            color={CITY_COLORS.buildingCream}
            roughness={0.6}
            metalness={0.05}
          />
        </mesh>
      </RigidBody>

      {/* ==================== Gallery Windows (Front Face) ==================== */}
      <GalleryWindows />

      {/* ==================== Entrance ==================== */}
      {/* Left column */}
      <mesh position={[-1.5, 2.5, BUILDING_DEPTH / 2 + 0.5]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 5, 16]} />
        <meshStandardMaterial
          color={CITY_COLORS.buildingWhite}
          roughness={0.6}
          metalness={0.05}
        />
      </mesh>

      {/* Left column capital (top) */}
      <mesh position={[-1.5, 5.1, BUILDING_DEPTH / 2 + 0.5]}>
        <boxGeometry args={[0.7, 0.2, 0.7]} />
        <meshStandardMaterial
          color={CITY_COLORS.buildingWhite}
          roughness={0.6}
          metalness={0.05}
        />
      </mesh>

      {/* Left column base */}
      <mesh position={[-1.5, 0.05, BUILDING_DEPTH / 2 + 0.5]}>
        <boxGeometry args={[0.65, 0.1, 0.65]} />
        <meshStandardMaterial
          color={CITY_COLORS.buildingWhite}
          roughness={0.6}
          metalness={0.05}
        />
      </mesh>

      {/* Right column */}
      <mesh position={[1.5, 2.5, BUILDING_DEPTH / 2 + 0.5]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 5, 16]} />
        <meshStandardMaterial
          color={CITY_COLORS.buildingWhite}
          roughness={0.6}
          metalness={0.05}
        />
      </mesh>

      {/* Right column capital (top) */}
      <mesh position={[1.5, 5.1, BUILDING_DEPTH / 2 + 0.5]}>
        <boxGeometry args={[0.7, 0.2, 0.7]} />
        <meshStandardMaterial
          color={CITY_COLORS.buildingWhite}
          roughness={0.6}
          metalness={0.05}
        />
      </mesh>

      {/* Right column base */}
      <mesh position={[1.5, 0.05, BUILDING_DEPTH / 2 + 0.5]}>
        <boxGeometry args={[0.65, 0.1, 0.65]} />
        <meshStandardMaterial
          color={CITY_COLORS.buildingWhite}
          roughness={0.6}
          metalness={0.05}
        />
      </mesh>

      {/* Crossbeam above columns */}
      <mesh position={[0, 5.3, BUILDING_DEPTH / 2 + 0.5]}>
        <boxGeometry args={[3.5, 0.25, 0.6]} />
        <meshStandardMaterial
          color={CITY_COLORS.buildingWhite}
          roughness={0.6}
          metalness={0.05}
        />
      </mesh>

      {/* Door */}
      <mesh position={[0, 1.5, BUILDING_DEPTH / 2 + 0.12]} castShadow>
        <boxGeometry args={[2, 3, 0.2]} />
        <meshStandardMaterial
          color={CITY_COLORS.door}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Door glass insert */}
      <mesh position={[0, 1.6, BUILDING_DEPTH / 2 + 0.24]}>
        <boxGeometry args={[1.6, 2.4, 0.02]} />
        <meshStandardMaterial
          color={CITY_COLORS.glassDark}
          roughness={0.15}
          metalness={0.2}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* ==================== Entrance Steps ==================== */}
      {/* Step 1 (bottom, widest) */}
      <mesh position={[0, 0.08, BUILDING_DEPTH / 2 + 1.2]} receiveShadow>
        <boxGeometry args={[4, 0.15, 1]} />
        <meshStandardMaterial
          color={CITY_COLORS.sidewalk}
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* Step 2 (middle) */}
      <mesh position={[0, 0.22, BUILDING_DEPTH / 2 + 0.9]} receiveShadow>
        <boxGeometry args={[3.6, 0.15, 0.7]} />
        <meshStandardMaterial
          color={CITY_COLORS.sidewalk}
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* Step 3 (top, narrowest) */}
      <mesh position={[0, 0.36, BUILDING_DEPTH / 2 + 0.6]} receiveShadow>
        <boxGeometry args={[3.2, 0.15, 0.4]} />
        <meshStandardMaterial
          color={CITY_COLORS.sidewalkLight}
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* ==================== Building Sign ==================== */}
      <Text
        position={[0, 5.6, BUILDING_DEPTH / 2 + 0.52]}
        fontSize={0.6}
        color={CITY_COLORS.metalDark}
        anchorX="center"
        anchorY="middle"
      >
        CAREER MUSEUM
      </Text>

      {/* ==================== Roof (Flat with Edge Trim) ==================== */}
      {/* Flat roof surface */}
      <mesh position={[0, BUILDING_HEIGHT + 0.1, 0]}>
        <boxGeometry args={[BUILDING_WIDTH + 0.3, 0.2, BUILDING_DEPTH + 0.3]} />
        <meshStandardMaterial
          color={CITY_COLORS.roofGray}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Roof edge trim - front */}
      <mesh position={[0, BUILDING_HEIGHT + 0.3, BUILDING_DEPTH / 2 + 0.2]}>
        <boxGeometry args={[BUILDING_WIDTH + 0.5, 0.2, 0.1]} />
        <meshStandardMaterial
          color={CITY_COLORS.buildingGray}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Roof edge trim - back */}
      <mesh position={[0, BUILDING_HEIGHT + 0.3, -BUILDING_DEPTH / 2 - 0.2]}>
        <boxGeometry args={[BUILDING_WIDTH + 0.5, 0.2, 0.1]} />
        <meshStandardMaterial
          color={CITY_COLORS.buildingGray}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Roof edge trim - left */}
      <mesh position={[-BUILDING_WIDTH / 2 - 0.2, BUILDING_HEIGHT + 0.3, 0]}>
        <boxGeometry args={[0.1, 0.2, BUILDING_DEPTH + 0.5]} />
        <meshStandardMaterial
          color={CITY_COLORS.buildingGray}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Roof edge trim - right */}
      <mesh position={[BUILDING_WIDTH / 2 + 0.2, BUILDING_HEIGHT + 0.3, 0]}>
        <boxGeometry args={[0.1, 0.2, BUILDING_DEPTH + 0.5]} />
        <meshStandardMaterial
          color={CITY_COLORS.buildingGray}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* ==================== Career Display Stands ==================== */}
      {CAREER_MILESTONES.map((milestone, i) => {
        const totalWidth = (CAREER_MILESTONES.length - 1) * 4;
        const x = -totalWidth / 2 + i * 4;
        return (
          <CareerStand
            key={`career-${i}`}
            text={milestone.text}
            position={[x, 0, BUILDING_DEPTH / 2 + 3.5]}
          />
        );
      })}

      {/* ==================== Garden Area ==================== */}
      <GardenArea />

      {/* Second flower cluster on the other side */}
      <group position={[-3, 0, BUILDING_DEPTH / 2 + 2]}>
        {/* Soil patch */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <circleGeometry args={[1, 16]} />
          <meshStandardMaterial
            color="#5D4037"
            roughness={0.95}
            metalness={0}
          />
        </mesh>

        {/* Decorative bush spheres */}
        <mesh position={[0, 0.25, 0]}>
          <sphereGeometry args={[0.3, 10, 10]} />
          <meshStandardMaterial
            color={CITY_COLORS.bush}
            roughness={0.8}
            metalness={0}
          />
        </mesh>
        <mesh position={[0.35, 0.2, 0.2]}>
          <sphereGeometry args={[0.25, 10, 10]} />
          <meshStandardMaterial
            color={CITY_COLORS.treeCanopy}
            roughness={0.8}
            metalness={0}
          />
        </mesh>
        <mesh position={[-0.3, 0.2, -0.15]}>
          <sphereGeometry args={[0.22, 10, 10]} />
          <meshStandardMaterial
            color={CITY_COLORS.treeCanopyLight}
            roughness={0.8}
            metalness={0}
          />
        </mesh>
      </group>

      {/* ==================== Bench Near Entrance ==================== */}
      <group position={[5, 0, BUILDING_DEPTH / 2 + 2]}>
        {/* Seat */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[1.2, 0.05, 0.4]} />
          <meshStandardMaterial
            color={CITY_COLORS.wood}
            roughness={0.8}
            metalness={0.05}
          />
        </mesh>

        {/* Backrest */}
        <mesh position={[0, 0.65, -0.18]} castShadow>
          <boxGeometry args={[1.2, 0.3, 0.05]} />
          <meshStandardMaterial
            color={CITY_COLORS.wood}
            roughness={0.8}
            metalness={0.05}
          />
        </mesh>

        {/* Left leg */}
        <mesh position={[-0.45, 0.22, 0]}>
          <boxGeometry args={[0.05, 0.44, 0.35]} />
          <meshStandardMaterial
            color={CITY_COLORS.metal}
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>

        {/* Right leg */}
        <mesh position={[0.45, 0.22, 0]}>
          <boxGeometry args={[0.05, 0.44, 0.35]} />
          <meshStandardMaterial
            color={CITY_COLORS.metal}
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>
      </group>

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
