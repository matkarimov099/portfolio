"use client";

import { Text } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { CITY_COLORS } from "../../constants/city-theme";
import { LANDMARKS } from "../../constants/landmarks";

const config = LANDMARKS.find((l) => l.id === "tokyo-tower")!;
const RED = CITY_COLORS.landmarkRedTower;
const WHITE = CITY_COLORS.landmarkWhiteTower;

// ==================== Tokyo Tower ====================
// Height: 55m. Red and white lattice communications tower.
// Alternating red and white sections for the iconic color pattern.

export function TokyoTower() {
  return (
    <group position={config.position}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[6, 27.5, 6]} position={[0, 27.5, 0]} />

        {/* ==================== 4 Legs (Red) ==================== */}
        {/* Front-left */}
        <mesh position={[-4, 9, -4]} rotation={[0.1, 0, -0.1]} castShadow>
          <boxGeometry args={[1, 18, 1]} />
          <meshStandardMaterial color={RED} roughness={0.6} metalness={0.15} />
        </mesh>

        {/* Front-right */}
        <mesh position={[4, 9, -4]} rotation={[0.1, 0, 0.1]} castShadow>
          <boxGeometry args={[1, 18, 1]} />
          <meshStandardMaterial color={RED} roughness={0.6} metalness={0.15} />
        </mesh>

        {/* Back-left */}
        <mesh position={[-4, 9, 4]} rotation={[-0.1, 0, -0.1]} castShadow>
          <boxGeometry args={[1, 18, 1]} />
          <meshStandardMaterial color={RED} roughness={0.6} metalness={0.15} />
        </mesh>

        {/* Back-right */}
        <mesh position={[4, 9, 4]} rotation={[-0.1, 0, 0.1]} castShadow>
          <boxGeometry args={[1, 18, 1]} />
          <meshStandardMaterial color={RED} roughness={0.6} metalness={0.15} />
        </mesh>

        {/* ==================== Cross Braces (White) ==================== */}
        {/* Braces at y=4 */}
        <mesh position={[0, 4, -4]} castShadow>
          <boxGeometry args={[6, 0.3, 0.3]} />
          <meshStandardMaterial color={WHITE} roughness={0.6} metalness={0.1} />
        </mesh>
        <mesh position={[0, 4, 4]} castShadow>
          <boxGeometry args={[6, 0.3, 0.3]} />
          <meshStandardMaterial color={WHITE} roughness={0.6} metalness={0.1} />
        </mesh>
        <mesh position={[-4, 4, 0]} castShadow>
          <boxGeometry args={[0.3, 0.3, 6]} />
          <meshStandardMaterial color={WHITE} roughness={0.6} metalness={0.1} />
        </mesh>
        <mesh position={[4, 4, 0]} castShadow>
          <boxGeometry args={[0.3, 0.3, 6]} />
          <meshStandardMaterial color={WHITE} roughness={0.6} metalness={0.1} />
        </mesh>

        {/* Braces at y=9 */}
        <mesh position={[0, 9, -3]} castShadow>
          <boxGeometry args={[5, 0.3, 0.3]} />
          <meshStandardMaterial color={WHITE} roughness={0.6} metalness={0.1} />
        </mesh>
        <mesh position={[0, 9, 3]} castShadow>
          <boxGeometry args={[5, 0.3, 0.3]} />
          <meshStandardMaterial color={WHITE} roughness={0.6} metalness={0.1} />
        </mesh>
        <mesh position={[-3, 9, 0]} castShadow>
          <boxGeometry args={[0.3, 0.3, 5]} />
          <meshStandardMaterial color={WHITE} roughness={0.6} metalness={0.1} />
        </mesh>
        <mesh position={[3, 9, 0]} castShadow>
          <boxGeometry args={[0.3, 0.3, 5]} />
          <meshStandardMaterial color={WHITE} roughness={0.6} metalness={0.1} />
        </mesh>

        {/* Braces at y=13 */}
        <mesh position={[0, 13, -2.5]} castShadow>
          <boxGeometry args={[4.5, 0.3, 0.3]} />
          <meshStandardMaterial color={RED} roughness={0.6} metalness={0.15} />
        </mesh>
        <mesh position={[0, 13, 2.5]} castShadow>
          <boxGeometry args={[4.5, 0.3, 0.3]} />
          <meshStandardMaterial color={RED} roughness={0.6} metalness={0.15} />
        </mesh>
        <mesh position={[-2.5, 13, 0]} castShadow>
          <boxGeometry args={[0.3, 0.3, 4.5]} />
          <meshStandardMaterial color={RED} roughness={0.6} metalness={0.15} />
        </mesh>
        <mesh position={[2.5, 13, 0]} castShadow>
          <boxGeometry args={[0.3, 0.3, 4.5]} />
          <meshStandardMaterial color={RED} roughness={0.6} metalness={0.15} />
        </mesh>

        {/* ==================== Lower Observation Deck (White, y=16) ==================== */}
        <mesh position={[0, 16, 0]} castShadow receiveShadow>
          <boxGeometry args={[8, 1, 8]} />
          <meshStandardMaterial color={WHITE} roughness={0.6} metalness={0.1} />
        </mesh>

        {/* Deck railing */}
        <mesh position={[0, 16.8, 0]}>
          <boxGeometry args={[8.2, 0.3, 8.2]} />
          <meshStandardMaterial color={RED} roughness={0.6} metalness={0.15} />
        </mesh>

        {/* ==================== Middle Shaft (Red, y=16 to y=36) ==================== */}
        <mesh position={[0, 26, 0]} castShadow>
          <boxGeometry args={[3, 20, 3]} />
          <meshStandardMaterial color={RED} roughness={0.6} metalness={0.15} />
        </mesh>

        {/* White bands on middle shaft */}
        <mesh position={[0, 21, 0]}>
          <boxGeometry args={[3.1, 1, 3.1]} />
          <meshStandardMaterial color={WHITE} roughness={0.6} metalness={0.1} />
        </mesh>
        <mesh position={[0, 26, 0]}>
          <boxGeometry args={[3.1, 1, 3.1]} />
          <meshStandardMaterial color={WHITE} roughness={0.6} metalness={0.1} />
        </mesh>
        <mesh position={[0, 31, 0]}>
          <boxGeometry args={[3.1, 1, 3.1]} />
          <meshStandardMaterial color={WHITE} roughness={0.6} metalness={0.1} />
        </mesh>

        {/* ==================== Upper Observation Deck (White, y=36) ==================== */}
        <mesh position={[0, 36, 0]} castShadow receiveShadow>
          <boxGeometry args={[5, 0.8, 5]} />
          <meshStandardMaterial color={WHITE} roughness={0.6} metalness={0.1} />
        </mesh>

        {/* Upper deck railing */}
        <mesh position={[0, 36.7, 0]}>
          <boxGeometry args={[5.2, 0.3, 5.2]} />
          <meshStandardMaterial color={RED} roughness={0.6} metalness={0.15} />
        </mesh>

        {/* ==================== Upper Shaft (White, y=36 to y=48) ==================== */}
        <mesh position={[0, 42, 0]} castShadow>
          <boxGeometry args={[1.5, 12, 1.5]} />
          <meshStandardMaterial color={WHITE} roughness={0.6} metalness={0.1} />
        </mesh>

        {/* Red bands on upper shaft */}
        <mesh position={[0, 39, 0]}>
          <boxGeometry args={[1.6, 1, 1.6]} />
          <meshStandardMaterial color={RED} roughness={0.6} metalness={0.15} />
        </mesh>
        <mesh position={[0, 43, 0]}>
          <boxGeometry args={[1.6, 1, 1.6]} />
          <meshStandardMaterial color={RED} roughness={0.6} metalness={0.15} />
        </mesh>
        <mesh position={[0, 47, 0]}>
          <boxGeometry args={[1.6, 1, 1.6]} />
          <meshStandardMaterial color={RED} roughness={0.6} metalness={0.15} />
        </mesh>

        {/* ==================== Antenna (Red, y=48 to y=55) ==================== */}
        <mesh position={[0, 51.5, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.1, 7, 8]} />
          <meshStandardMaterial color={RED} roughness={0.6} metalness={0.15} />
        </mesh>

        {/* Antenna tip */}
        <mesh position={[0, 55.2, 0]}>
          <sphereGeometry args={[0.25, 8, 8]} />
          <meshStandardMaterial color={WHITE} roughness={0.5} metalness={0.1} />
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
        TOKYO TOWER
      </Text>
    </group>
  );
}
