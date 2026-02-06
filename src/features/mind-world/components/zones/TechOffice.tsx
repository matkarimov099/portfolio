"use client";

import { Text } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { CITY_COLORS } from "../../constants/city-theme";

// ==================== Constants ====================

const BUILDING_WIDTH = 14;
const BUILDING_HEIGHT = 18;
const BUILDING_DEPTH = 10;

const FLOOR_COUNT = 5;
const WINDOWS_PER_FLOOR = 4;
const WINDOW_WIDTH = 1.5;
const WINDOW_HEIGHT = 1.2;
const WINDOW_DEPTH = 0.1;

// Window X positions: evenly spaced across the front face
const WINDOW_X_POSITIONS = [-4.5, -1.5, 1.5, 4.5];
// Window Y positions: one per floor
const WINDOW_Y_POSITIONS = [2, 5.6, 9.2, 12.8, 16.4];

const SKILL_BILLBOARDS = [
  { label: "React", color: CITY_COLORS.glass },
  { label: "TypeScript", color: CITY_COLORS.glass },
  { label: "Node.js", color: CITY_COLORS.glass },
] as const;

// ==================== Window Grid ====================

function WindowGrid() {
  const windows = useMemo(() => {
    const items: { position: [number, number, number] }[] = [];
    for (let floor = 0; floor < FLOOR_COUNT; floor++) {
      for (let col = 0; col < WINDOWS_PER_FLOOR; col++) {
        items.push({
          position: [
            WINDOW_X_POSITIONS[col],
            WINDOW_Y_POSITIONS[floor],
            BUILDING_DEPTH / 2 + WINDOW_DEPTH / 2,
          ],
        });
      }
    }
    return items;
  }, []);

  return (
    <>
      {windows.map((w, i) => (
        <mesh key={`window-${i}`} position={w.position}>
          <boxGeometry args={[WINDOW_WIDTH, WINDOW_HEIGHT, WINDOW_DEPTH]} />
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

// ==================== Skill Billboard ====================

interface SkillBillboardProps {
  label: string;
  color: string;
  position: [number, number, number];
}

function SkillBillboard({ label, color, position }: SkillBillboardProps) {
  return (
    <group position={position}>
      {/* Metal pole */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2.4, 8]} />
        <meshStandardMaterial
          color={CITY_COLORS.metalDark}
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>

      {/* Billboard panel */}
      <mesh position={[0, 2.6, 0]} castShadow>
        <boxGeometry args={[1.5, 2, 0.1]} />
        <meshStandardMaterial
          color={CITY_COLORS.buildingWhite}
          roughness={0.6}
          metalness={0.05}
        />
      </mesh>

      {/* Skill text */}
      <Text
        position={[0, 2.6, 0.06]}
        fontSize={0.35}
        color={color}
        anchorX="center"
        anchorY="middle"
        maxWidth={1.3}
      >
        {label}
      </Text>

      {/* Small decorative line under text */}
      <mesh position={[0, 2.2, 0.06]}>
        <boxGeometry args={[0.8, 0.03, 0.01]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </mesh>
    </group>
  );
}

// ==================== Parking Spot ====================

interface ParkingSpotProps {
  position: [number, number, number];
}

function ParkingSpot({ position }: ParkingSpotProps) {
  return (
    <group position={position}>
      {/* Parking surface */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
        receiveShadow
      >
        <boxGeometry args={[2.5, 4, 0.02]} />
        <meshStandardMaterial
          color={CITY_COLORS.roadDark}
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>

      {/* White line markings (left) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.2, 0.02, 0]}>
        <boxGeometry args={[0.06, 4, 0.01]} />
        <meshStandardMaterial
          color={CITY_COLORS.roadMarkingWhite}
          roughness={0.6}
          metalness={0}
        />
      </mesh>

      {/* White line markings (right) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.2, 0.02, 0]}>
        <boxGeometry args={[0.06, 4, 0.01]} />
        <meshStandardMaterial
          color={CITY_COLORS.roadMarkingWhite}
          roughness={0.6}
          metalness={0}
        />
      </mesh>
    </group>
  );
}

// ==================== Main TechOffice Component ====================

export function TechOffice() {
  return (
    <group position={[0, 0, -50]}>
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
            color={CITY_COLORS.buildingWhite}
            roughness={0.7}
            metalness={0.05}
          />
        </mesh>
      </RigidBody>

      {/* ==================== Windows (front face) ==================== */}
      <WindowGrid />

      {/* ==================== Entrance ==================== */}
      {/* Door frame */}
      <mesh position={[0, 1.5, BUILDING_DEPTH / 2 + 0.15]} castShadow>
        <boxGeometry args={[2, 3, 0.3]} />
        <meshStandardMaterial
          color={CITY_COLORS.door}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Door glass panel */}
      <mesh position={[0, 1.5, BUILDING_DEPTH / 2 + 0.32]}>
        <boxGeometry args={[1.6, 2.6, 0.02]} />
        <meshStandardMaterial
          color={CITY_COLORS.glassDark}
          roughness={0.15}
          metalness={0.2}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* ==================== Roof Details ==================== */}
      {/* Flat roof edge */}
      <mesh position={[0, BUILDING_HEIGHT + 0.15, 0]}>
        <boxGeometry args={[BUILDING_WIDTH + 0.4, 0.3, BUILDING_DEPTH + 0.4]} />
        <meshStandardMaterial
          color={CITY_COLORS.roofGray}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Ventilation box 1 */}
      <mesh position={[-3, BUILDING_HEIGHT + 0.8, -1]} castShadow>
        <boxGeometry args={[1.5, 1, 1]} />
        <meshStandardMaterial
          color={CITY_COLORS.metalDark}
          roughness={0.6}
          metalness={0.3}
        />
      </mesh>

      {/* Ventilation box 2 */}
      <mesh position={[3, BUILDING_HEIGHT + 0.7, 2]} castShadow>
        <boxGeometry args={[1.2, 0.8, 0.8]} />
        <meshStandardMaterial
          color={CITY_COLORS.metalDark}
          roughness={0.6}
          metalness={0.3}
        />
      </mesh>

      {/* ==================== Building Sign ==================== */}
      <Text
        position={[0, BUILDING_HEIGHT * 0.22, BUILDING_DEPTH / 2 + 0.35]}
        fontSize={0.6}
        color={CITY_COLORS.glass}
        anchorX="center"
        anchorY="middle"
      >
        TECH SKILLS
      </Text>

      {/* ==================== Floor Separator Lines ==================== */}
      {WINDOW_Y_POSITIONS.map((y, i) => (
        <mesh
          key={`floor-line-${i}`}
          position={[0, y - WINDOW_HEIGHT / 2 - 0.2, BUILDING_DEPTH / 2 + 0.01]}
        >
          <boxGeometry args={[BUILDING_WIDTH, 0.06, 0.01]} />
          <meshStandardMaterial
            color={CITY_COLORS.buildingGray}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
      ))}

      {/* ==================== Skill Billboards ==================== */}
      <SkillBillboard
        label={SKILL_BILLBOARDS[0].label}
        color={SKILL_BILLBOARDS[0].color}
        position={[-4, 0, BUILDING_DEPTH / 2 + 4]}
      />
      <SkillBillboard
        label={SKILL_BILLBOARDS[1].label}
        color={SKILL_BILLBOARDS[1].color}
        position={[0, 0, BUILDING_DEPTH / 2 + 5]}
      />
      <SkillBillboard
        label={SKILL_BILLBOARDS[2].label}
        color={SKILL_BILLBOARDS[2].color}
        position={[4, 0, BUILDING_DEPTH / 2 + 4]}
      />

      {/* ==================== Parking Area ==================== */}
      <ParkingSpot position={[-4, 0, BUILDING_DEPTH / 2 + 9]} />
      <ParkingSpot position={[0, 0, BUILDING_DEPTH / 2 + 9]} />
      <ParkingSpot position={[4, 0, BUILDING_DEPTH / 2 + 9]} />

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
