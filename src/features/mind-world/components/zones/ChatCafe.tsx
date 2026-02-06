"use client";

import { Text } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { CITY_COLORS } from "../../constants/city-theme";

// ==================== Constants ====================

const BUILDING_WIDTH = 10;
const BUILDING_HEIGHT = 6;
const BUILDING_DEPTH = 8;

const TABLE_COUNT = 4;
const TABLE_SPACING = 2.4;

// ==================== Outdoor Table ====================

interface OutdoorTableProps {
  position: [number, number, number];
}

function OutdoorTable({ position }: OutdoorTableProps) {
  return (
    <group position={position}>
      {/* Table leg (cylinder) */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.7, 8]} />
        <meshStandardMaterial
          color={CITY_COLORS.metal}
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>

      {/* Table base */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 12]} />
        <meshStandardMaterial
          color={CITY_COLORS.metal}
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>

      {/* Table top */}
      <mesh position={[0, 0.72, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.05, 16]} />
        <meshStandardMaterial
          color={CITY_COLORS.wood}
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>

      {/* Chair 1 (left) */}
      <group position={[-0.7, 0, 0]}>
        {/* Seat */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[0.35, 0.05, 0.35]} />
          <meshStandardMaterial
            color={CITY_COLORS.wood}
            roughness={0.8}
            metalness={0.05}
          />
        </mesh>

        {/* Backrest */}
        <mesh position={[0.18, 0.6, 0]} castShadow>
          <boxGeometry args={[0.05, 0.35, 0.3]} />
          <meshStandardMaterial
            color={CITY_COLORS.wood}
            roughness={0.8}
            metalness={0.05}
          />
        </mesh>

        {/* Legs */}
        <mesh position={[-0.12, 0.2, -0.12]}>
          <boxGeometry args={[0.04, 0.4, 0.04]} />
          <meshStandardMaterial
            color={CITY_COLORS.metal}
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>
        <mesh position={[-0.12, 0.2, 0.12]}>
          <boxGeometry args={[0.04, 0.4, 0.04]} />
          <meshStandardMaterial
            color={CITY_COLORS.metal}
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>
        <mesh position={[0.12, 0.2, -0.12]}>
          <boxGeometry args={[0.04, 0.4, 0.04]} />
          <meshStandardMaterial
            color={CITY_COLORS.metal}
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>
        <mesh position={[0.12, 0.2, 0.12]}>
          <boxGeometry args={[0.04, 0.4, 0.04]} />
          <meshStandardMaterial
            color={CITY_COLORS.metal}
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>
      </group>

      {/* Chair 2 (right) */}
      <group position={[0.7, 0, 0]}>
        {/* Seat */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[0.35, 0.05, 0.35]} />
          <meshStandardMaterial
            color={CITY_COLORS.wood}
            roughness={0.8}
            metalness={0.05}
          />
        </mesh>

        {/* Backrest */}
        <mesh position={[-0.18, 0.6, 0]} castShadow>
          <boxGeometry args={[0.05, 0.35, 0.3]} />
          <meshStandardMaterial
            color={CITY_COLORS.wood}
            roughness={0.8}
            metalness={0.05}
          />
        </mesh>

        {/* Legs */}
        <mesh position={[-0.12, 0.2, -0.12]}>
          <boxGeometry args={[0.04, 0.4, 0.04]} />
          <meshStandardMaterial
            color={CITY_COLORS.metal}
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>
        <mesh position={[-0.12, 0.2, 0.12]}>
          <boxGeometry args={[0.04, 0.4, 0.04]} />
          <meshStandardMaterial
            color={CITY_COLORS.metal}
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>
        <mesh position={[0.12, 0.2, -0.12]}>
          <boxGeometry args={[0.04, 0.4, 0.04]} />
          <meshStandardMaterial
            color={CITY_COLORS.metal}
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>
        <mesh position={[0.12, 0.2, 0.12]}>
          <boxGeometry args={[0.04, 0.4, 0.04]} />
          <meshStandardMaterial
            color={CITY_COLORS.metal}
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>
      </group>
    </group>
  );
}

// ==================== Side Windows ====================

function SideWindows() {
  const windows = useMemo(() => {
    const items: {
      position: [number, number, number];
      size: [number, number, number];
    }[] = [];

    // Left side (-X face): 2 windows
    for (let i = 0; i < 2; i++) {
      const z = -1.5 + i * 3;
      items.push({
        position: [-BUILDING_WIDTH / 2 - 0.06, 3.5, z],
        size: [0.1, 1.5, 1],
      });
    }

    // Right side (+X face): 2 windows
    for (let i = 0; i < 2; i++) {
      const z = -1.5 + i * 3;
      items.push({
        position: [BUILDING_WIDTH / 2 + 0.06, 3.5, z],
        size: [0.1, 1.5, 1],
      });
    }

    return items;
  }, []);

  return (
    <>
      {windows.map((w, i) => (
        <mesh key={`side-win-${i}`} position={w.position}>
          <boxGeometry args={w.size} />
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

// ==================== Main ChatCafe Component ====================

export function ChatCafe() {
  // Generate table positions in front of the cafe
  const tables = useMemo(() => {
    const items: { position: [number, number, number] }[] = [];
    const startX = -(TABLE_COUNT - 1) * TABLE_SPACING * 0.5;

    for (let i = 0; i < TABLE_COUNT; i++) {
      items.push({
        position: [startX + i * TABLE_SPACING, 0, BUILDING_DEPTH / 2 + 3],
      });
    }
    return items;
  }, []);

  return (
    <group position={[100, 0, 250]}>
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
            color={CITY_COLORS.buildingWarm}
            roughness={0.7}
            metalness={0.05}
          />
        </mesh>
      </RigidBody>

      {/* ==================== Large Front Window (Vitrina) ==================== */}
      <mesh position={[0, 3.5, BUILDING_DEPTH / 2 + 0.06]}>
        <boxGeometry args={[6, 3, 0.1]} />
        <meshStandardMaterial
          color={CITY_COLORS.glass}
          roughness={0.2}
          metalness={0.3}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Window frame (thin border around vitrina) */}
      {/* Top frame */}
      <mesh position={[0, 5.05, BUILDING_DEPTH / 2 + 0.07]}>
        <boxGeometry args={[6.2, 0.08, 0.05]} />
        <meshStandardMaterial
          color={CITY_COLORS.woodDark}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      {/* Bottom frame */}
      <mesh position={[0, 1.95, BUILDING_DEPTH / 2 + 0.07]}>
        <boxGeometry args={[6.2, 0.08, 0.05]} />
        <meshStandardMaterial
          color={CITY_COLORS.woodDark}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* ==================== Side Windows ==================== */}
      <SideWindows />

      {/* ==================== Entrance Door ==================== */}
      <mesh position={[-3.5, 1.25, BUILDING_DEPTH / 2 + 0.12]}>
        <boxGeometry args={[1.5, 2.5, 0.2]} />
        <meshStandardMaterial
          color={CITY_COLORS.door}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Door handle */}
      <mesh position={[-3.0, 1.25, BUILDING_DEPTH / 2 + 0.24]}>
        <boxGeometry args={[0.08, 0.3, 0.06]} />
        <meshStandardMaterial
          color={CITY_COLORS.metal}
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>

      {/* ==================== Roof ==================== */}
      {/* Main roof slab (slightly wider for eaves) */}
      <mesh position={[0, BUILDING_HEIGHT + 0.4, 0]} castShadow>
        <boxGeometry args={[BUILDING_WIDTH + 1, 0.8, BUILDING_DEPTH + 1]} />
        <meshStandardMaterial
          color={CITY_COLORS.roofRed}
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>

      {/* Roof peak (narrower box on top) */}
      <mesh position={[0, BUILDING_HEIGHT + 1.1, 0]}>
        <boxGeometry args={[BUILDING_WIDTH * 0.6, 0.6, BUILDING_DEPTH + 0.5]} />
        <meshStandardMaterial
          color={CITY_COLORS.roofRed}
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>

      {/* ==================== Awning / Markiza ==================== */}
      <group
        position={[-3.5, 3.2, BUILDING_DEPTH / 2 + 0.8]}
        rotation={[-0.15, 0, 0]}
      >
        <mesh castShadow>
          <boxGeometry args={[4, 0.05, 1.5]} />
          <meshStandardMaterial
            color={CITY_COLORS.treeCanopy}
            roughness={0.7}
            metalness={0.05}
          />
        </mesh>

        {/* Awning support bars */}
        <mesh position={[-1.8, 0, -0.7]}>
          <cylinderGeometry args={[0.03, 0.03, 0.6, 6]} />
          <meshStandardMaterial
            color={CITY_COLORS.metal}
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>
        <mesh position={[1.8, 0, -0.7]}>
          <cylinderGeometry args={[0.03, 0.03, 0.6, 6]} />
          <meshStandardMaterial
            color={CITY_COLORS.metal}
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>
      </group>

      {/* ==================== Outdoor Seating ==================== */}
      {tables.map((table, i) => (
        <OutdoorTable key={`table-${i}`} position={table.position} />
      ))}

      {/* ==================== Cafe Sign ==================== */}
      <Text
        position={[-3.5, 4, BUILDING_DEPTH / 2 + 0.15]}
        fontSize={0.5}
        color={CITY_COLORS.door}
        anchorX="center"
        anchorY="middle"
      >
        CHAT CAFE
      </Text>

      {/* ==================== Menu Board ==================== */}
      <group position={[-1.5, 0, BUILDING_DEPTH / 2 + 0.5]}>
        {/* Board stand */}
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[0.06, 1.2, 0.06]} />
          <meshStandardMaterial
            color={CITY_COLORS.woodDark}
            roughness={0.8}
            metalness={0.05}
          />
        </mesh>

        {/* Blackboard */}
        <mesh position={[0, 1.3, 0]} castShadow>
          <boxGeometry args={[0.8, 1.2, 0.05]} />
          <meshStandardMaterial color="#2A2A2A" roughness={0.9} metalness={0} />
        </mesh>

        {/* Board frame */}
        <mesh position={[0, 1.3, 0.03]}>
          <boxGeometry args={[0.85, 1.25, 0.01]} />
          <meshStandardMaterial
            color={CITY_COLORS.woodDark}
            roughness={0.8}
            metalness={0.05}
          />
        </mesh>

        {/* Menu text */}
        <Text
          position={[0, 1.55, 0.04]}
          fontSize={0.18}
          color={CITY_COLORS.signWhite}
          anchorX="center"
          anchorY="middle"
        >
          Menu
        </Text>

        <Text
          position={[0, 1.25, 0.04]}
          fontSize={0.1}
          color="#CCCCCC"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.65}
        >
          {"Coffee\nTea\nPastry"}
        </Text>
      </group>

      {/* ==================== Warm Lights ==================== */}
      <pointLight
        position={[-4.5, 3.5, BUILDING_DEPTH / 2 + 1]}
        color="#FFF5E6"
        intensity={0.3}
        distance={6}
      />
      <pointLight
        position={[-2.5, 3.5, BUILDING_DEPTH / 2 + 1]}
        color="#FFF5E6"
        intensity={0.3}
        distance={6}
      />

      {/* Light fixture meshes (small cylinders) */}
      <mesh position={[-4.5, 3.3, BUILDING_DEPTH / 2 + 0.3]}>
        <cylinderGeometry args={[0.08, 0.12, 0.15, 8]} />
        <meshStandardMaterial
          color="#FFF5E6"
          roughness={0.3}
          metalness={0.1}
          emissive="#FFF5E6"
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh position={[-2.5, 3.3, BUILDING_DEPTH / 2 + 0.3]}>
        <cylinderGeometry args={[0.08, 0.12, 0.15, 8]} />
        <meshStandardMaterial
          color="#FFF5E6"
          roughness={0.3}
          metalness={0.1}
          emissive="#FFF5E6"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* ==================== Front Sidewalk ==================== */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, BUILDING_DEPTH / 2 + 2]}
        receiveShadow
      >
        <boxGeometry args={[BUILDING_WIDTH + 2, 3, 0.04]} />
        <meshStandardMaterial
          color={CITY_COLORS.sidewalk}
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
}
