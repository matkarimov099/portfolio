"use client";

import { Text } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { CITY_COLORS } from "../../constants/city-theme";
import { LANDMARKS } from "../../constants/landmarks";

const config = LANDMARKS.find((l) => l.id === "empire-state")!;
const CONCRETE = CITY_COLORS.landmarkConcrete;
const CONCRETE_LIGHT = "#AAAAAA";
const CONCRETE_LIGHTER = "#BBBBBB";
const CONCRETE_LIGHTEST = "#CCCCCC";
const WINDOW_COLOR = "#2A2A3A";

// ==================== Window Grid ====================

interface WindowGridProps {
  width: number;
  height: number;
  depth: number;
  position: [number, number, number];
  columns: number;
  rows: number;
}

function WindowGrid({
  width,
  height,
  depth,
  position,
  columns,
  rows,
}: WindowGridProps) {
  const windows = useMemo(() => {
    const items: [number, number, number][] = [];
    const spacingX = (width - 1) / Math.max(columns - 1, 1);
    const spacingY = (height - 2) / Math.max(rows - 1, 1);
    const startX = -(width - 1) / 2;
    const startY = -(height - 2) / 2;

    for (let col = 0; col < columns; col++) {
      for (let row = 0; row < rows; row++) {
        items.push([startX + col * spacingX, startY + row * spacingY, 0]);
      }
    }
    return items;
  }, [width, height, columns, rows]);

  return (
    <group position={position}>
      {/* Front face */}
      <group position={[0, 0, depth / 2 + 0.05]}>
        {windows.map((pos, i) => (
          <mesh key={`wf-${i}`} position={pos}>
            <boxGeometry args={[0.6, 0.8, 0.1]} />
            <meshStandardMaterial
              color={WINDOW_COLOR}
              roughness={0.3}
              metalness={0.1}
            />
          </mesh>
        ))}
      </group>

      {/* Back face */}
      <group position={[0, 0, -depth / 2 - 0.05]}>
        {windows.map((pos, i) => (
          <mesh key={`wb-${i}`} position={pos}>
            <boxGeometry args={[0.6, 0.8, 0.1]} />
            <meshStandardMaterial
              color={WINDOW_COLOR}
              roughness={0.3}
              metalness={0.1}
            />
          </mesh>
        ))}
      </group>

      {/* Left face */}
      <group
        position={[-depth / 2 - 0.05, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        {windows.map((pos, i) => (
          <mesh key={`wl-${i}`} position={pos}>
            <boxGeometry args={[0.6, 0.8, 0.1]} />
            <meshStandardMaterial
              color={WINDOW_COLOR}
              roughness={0.3}
              metalness={0.1}
            />
          </mesh>
        ))}
      </group>

      {/* Right face */}
      <group position={[depth / 2 + 0.05, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        {windows.map((pos, i) => (
          <mesh key={`wr-${i}`} position={pos}>
            <boxGeometry args={[0.6, 0.8, 0.1]} />
            <meshStandardMaterial
              color={WINDOW_COLOR}
              roughness={0.3}
              metalness={0.1}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ==================== Empire State Building ====================
// Height: 55m. Art Deco stepped skyscraper with antenna.

export function EmpireState() {
  return (
    <group position={config.position}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[7, 27.5, 7]} position={[0, 27.5, 0]} />

        {/* ==================== Base (y=0 to y=25) ==================== */}
        <mesh position={[0, 12.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[14, 25, 14]} />
          <meshStandardMaterial
            color={CONCRETE}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>

        {/* Art deco vertical lines on base */}
        {[-5, -2.5, 0, 2.5, 5].map((x, i) => (
          <mesh key={`deco-f-${i}`} position={[x, 12.5, 7.1]} castShadow>
            <boxGeometry args={[0.2, 24, 0.15]} />
            <meshStandardMaterial
              color={CONCRETE_LIGHT}
              roughness={0.7}
              metalness={0.15}
            />
          </mesh>
        ))}
        {[-5, -2.5, 0, 2.5, 5].map((x, i) => (
          <mesh key={`deco-b-${i}`} position={[x, 12.5, -7.1]} castShadow>
            <boxGeometry args={[0.2, 24, 0.15]} />
            <meshStandardMaterial
              color={CONCRETE_LIGHT}
              roughness={0.7}
              metalness={0.15}
            />
          </mesh>
        ))}

        {/* Entrance */}
        <mesh position={[0, 2, 7.15]} castShadow>
          <boxGeometry args={[4, 3.5, 0.3]} />
          <meshStandardMaterial
            color="#3D3428"
            roughness={0.9}
            metalness={0.05}
          />
        </mesh>

        {/* Windows on base */}
        <WindowGrid
          width={14}
          height={25}
          depth={14}
          position={[0, 12.5, 0]}
          columns={6}
          rows={8}
        />

        {/* ==================== Step 1 (y=25 to y=37) ==================== */}
        <mesh position={[0, 31, 0]} castShadow receiveShadow>
          <boxGeometry args={[10, 12, 10]} />
          <meshStandardMaterial
            color={CONCRETE_LIGHT}
            roughness={0.75}
            metalness={0.1}
          />
        </mesh>

        {/* Windows on step 1 */}
        <WindowGrid
          width={10}
          height={12}
          depth={10}
          position={[0, 31, 0]}
          columns={4}
          rows={4}
        />

        {/* ==================== Step 2 (y=37 to y=47) ==================== */}
        <mesh position={[0, 42, 0]} castShadow receiveShadow>
          <boxGeometry args={[6, 10, 6]} />
          <meshStandardMaterial
            color={CONCRETE_LIGHTER}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>

        {/* Windows on step 2 */}
        <WindowGrid
          width={6}
          height={10}
          depth={6}
          position={[0, 42, 0]}
          columns={3}
          rows={3}
        />

        {/* ==================== Step 3 (y=47 to y=52) ==================== */}
        <mesh position={[0, 49.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[3, 5, 3]} />
          <meshStandardMaterial
            color={CONCRETE_LIGHTEST}
            roughness={0.65}
            metalness={0.1}
          />
        </mesh>

        {/* ==================== Antenna ==================== */}
        <mesh position={[0, 53.5, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.1, 5, 8]} />
          <meshStandardMaterial
            color={CONCRETE_LIGHT}
            roughness={0.5}
            metalness={0.2}
          />
        </mesh>

        {/* Antenna sphere tip */}
        <mesh position={[0, 56.2, 0]}>
          <sphereGeometry args={[0.35, 8, 8]} />
          <meshStandardMaterial
            color={CITY_COLORS.landmarkGoldAccent}
            roughness={0.3}
            metalness={0.3}
          />
        </mesh>
      </RigidBody>

      {/* ==================== Label ==================== */}
      <Text
        position={[0, 60, 0]}
        fontSize={2.5}
        color="#333333"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.08}
        outlineColor="#ffffff"
      >
        EMPIRE STATE
      </Text>
    </group>
  );
}
