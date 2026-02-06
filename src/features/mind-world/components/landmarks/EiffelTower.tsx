"use client";

import { Text } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { CITY_COLORS } from "../../constants/city-theme";
import { LANDMARKS } from "../../constants/landmarks";

const config = LANDMARKS.find((l) => l.id === "eiffel-tower")!;
const STEEL = CITY_COLORS.landmarkSteel;

// ==================== Eiffel Tower ====================
// Height: 60m. Iconic tapered lattice tower built from basic geometries.

export function EiffelTower() {
  return (
    <group position={config.position}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[10, 30, 10]} position={[0, 30, 0]} />

        {/* ==================== 4 Legs ==================== */}
        {/* Front-left leg */}
        <mesh position={[-6, 10, -6]} rotation={[0.12, 0, -0.12]} castShadow>
          <boxGeometry args={[2, 20, 2]} />
          <meshStandardMaterial color={STEEL} roughness={0.6} metalness={0.3} />
        </mesh>

        {/* Front-right leg */}
        <mesh position={[6, 10, -6]} rotation={[0.12, 0, 0.12]} castShadow>
          <boxGeometry args={[2, 20, 2]} />
          <meshStandardMaterial color={STEEL} roughness={0.6} metalness={0.3} />
        </mesh>

        {/* Back-left leg */}
        <mesh position={[-6, 10, 6]} rotation={[-0.12, 0, -0.12]} castShadow>
          <boxGeometry args={[2, 20, 2]} />
          <meshStandardMaterial color={STEEL} roughness={0.6} metalness={0.3} />
        </mesh>

        {/* Back-right leg */}
        <mesh position={[6, 10, 6]} rotation={[-0.12, 0, 0.12]} castShadow>
          <boxGeometry args={[2, 20, 2]} />
          <meshStandardMaterial color={STEEL} roughness={0.6} metalness={0.3} />
        </mesh>

        {/* ==================== Cross Beams (Lower) ==================== */}
        {/* Cross beams at y=5 */}
        <mesh position={[0, 5, -6]} castShadow>
          <boxGeometry args={[10, 0.4, 0.4]} />
          <meshStandardMaterial color={STEEL} roughness={0.6} metalness={0.3} />
        </mesh>
        <mesh position={[0, 5, 6]} castShadow>
          <boxGeometry args={[10, 0.4, 0.4]} />
          <meshStandardMaterial color={STEEL} roughness={0.6} metalness={0.3} />
        </mesh>
        <mesh position={[-6, 5, 0]} castShadow>
          <boxGeometry args={[0.4, 0.4, 10]} />
          <meshStandardMaterial color={STEEL} roughness={0.6} metalness={0.3} />
        </mesh>
        <mesh position={[6, 5, 0]} castShadow>
          <boxGeometry args={[0.4, 0.4, 10]} />
          <meshStandardMaterial color={STEEL} roughness={0.6} metalness={0.3} />
        </mesh>

        {/* Cross beams at y=10 */}
        <mesh position={[0, 10, -4.5]} castShadow>
          <boxGeometry args={[8, 0.4, 0.4]} />
          <meshStandardMaterial color={STEEL} roughness={0.6} metalness={0.3} />
        </mesh>
        <mesh position={[0, 10, 4.5]} castShadow>
          <boxGeometry args={[8, 0.4, 0.4]} />
          <meshStandardMaterial color={STEEL} roughness={0.6} metalness={0.3} />
        </mesh>
        <mesh position={[-4.5, 10, 0]} castShadow>
          <boxGeometry args={[0.4, 0.4, 8]} />
          <meshStandardMaterial color={STEEL} roughness={0.6} metalness={0.3} />
        </mesh>
        <mesh position={[4.5, 10, 0]} castShadow>
          <boxGeometry args={[0.4, 0.4, 8]} />
          <meshStandardMaterial color={STEEL} roughness={0.6} metalness={0.3} />
        </mesh>

        {/* ==================== First Platform (y=18) ==================== */}
        <mesh position={[0, 18, 0]} castShadow receiveShadow>
          <boxGeometry args={[12, 1, 12]} />
          <meshStandardMaterial color={STEEL} roughness={0.5} metalness={0.3} />
        </mesh>

        {/* ==================== Middle Section (4 Narrower Supports) ==================== */}
        <mesh position={[-3, 26, -3]} rotation={[0.04, 0, -0.04]} castShadow>
          <boxGeometry args={[1.5, 15, 1.5]} />
          <meshStandardMaterial color={STEEL} roughness={0.6} metalness={0.3} />
        </mesh>
        <mesh position={[3, 26, -3]} rotation={[0.04, 0, 0.04]} castShadow>
          <boxGeometry args={[1.5, 15, 1.5]} />
          <meshStandardMaterial color={STEEL} roughness={0.6} metalness={0.3} />
        </mesh>
        <mesh position={[-3, 26, 3]} rotation={[-0.04, 0, -0.04]} castShadow>
          <boxGeometry args={[1.5, 15, 1.5]} />
          <meshStandardMaterial color={STEEL} roughness={0.6} metalness={0.3} />
        </mesh>
        <mesh position={[3, 26, 3]} rotation={[-0.04, 0, 0.04]} castShadow>
          <boxGeometry args={[1.5, 15, 1.5]} />
          <meshStandardMaterial color={STEEL} roughness={0.6} metalness={0.3} />
        </mesh>

        {/* ==================== Second Platform (y=35) ==================== */}
        <mesh position={[0, 35, 0]} castShadow receiveShadow>
          <boxGeometry args={[8, 0.8, 8]} />
          <meshStandardMaterial color={STEEL} roughness={0.5} metalness={0.3} />
        </mesh>

        {/* ==================== Upper Section ==================== */}
        <mesh position={[0, 42.5, 0]} castShadow>
          <boxGeometry args={[3, 15, 3]} />
          <meshStandardMaterial color={STEEL} roughness={0.6} metalness={0.3} />
        </mesh>

        {/* ==================== Top Platform (y=50) ==================== */}
        <mesh position={[0, 50, 0]} castShadow>
          <boxGeometry args={[4, 0.5, 4]} />
          <meshStandardMaterial color={STEEL} roughness={0.5} metalness={0.3} />
        </mesh>

        {/* ==================== Antenna ==================== */}
        <mesh position={[0, 55, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 10, 8]} />
          <meshStandardMaterial color={STEEL} roughness={0.5} metalness={0.3} />
        </mesh>

        {/* Antenna tip */}
        <mesh position={[0, 60.2, 0]}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshStandardMaterial color={STEEL} roughness={0.5} metalness={0.3} />
        </mesh>
      </RigidBody>

      {/* ==================== Label ==================== */}
      <Text
        position={[0, 65, 0]}
        fontSize={2.5}
        color="#333333"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.08}
        outlineColor="#ffffff"
      >
        EIFFEL TOWER
      </Text>
    </group>
  );
}
