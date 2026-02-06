"use client";

import { Text } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { CITY_COLORS } from "../../constants/city-theme";
import { LANDMARKS } from "../../constants/landmarks";

const config = LANDMARKS.find((l) => l.id === "burj-al-arab")!;
const WHITE = CITY_COLORS.landmarkWhiteTower;
const CONCRETE = CITY_COLORS.landmarkConcrete;
const GOLD = CITY_COLORS.landmarkGoldAccent;

// ==================== Burj Al Arab ====================
// Height: 50m. Iconic sail-shaped hotel on a platform.

export function BurjAlArab() {
  return (
    <group position={config.position}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[8, 25, 8]} position={[0, 25, 0]} />

        {/* ==================== Base Platform ==================== */}
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[12, 12, 3, 16]} />
          <meshStandardMaterial
            color={CONCRETE}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>

        {/* Platform rim accent */}
        <mesh position={[0, 2.8, 0]}>
          <cylinderGeometry args={[12.2, 12.2, 0.3, 16]} />
          <meshStandardMaterial color={GOLD} roughness={0.4} metalness={0.3} />
        </mesh>

        {/* ==================== Support Column (left side) ==================== */}
        <mesh position={[-4, 25, 0]} castShadow>
          <cylinderGeometry args={[2, 2.5, 45, 12]} />
          <meshStandardMaterial
            color={CONCRETE}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>

        {/* ==================== Main Sail ==================== */}
        <mesh
          position={[2, 25, 0]}
          rotation={[0, 0, 0.06]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[14, 45, 2]} />
          <meshStandardMaterial color={WHITE} roughness={0.5} metalness={0.1} />
        </mesh>

        {/* Sail surface detail - subtle vertical ribs */}
        {[-4, -1.5, 1.5, 4].map((x, i) => (
          <mesh key={`rib-${i}`} position={[x + 2, 25, 1.15]} castShadow>
            <boxGeometry args={[0.2, 42, 0.15]} />
            <meshStandardMaterial
              color="#E0E0E0"
              roughness={0.5}
              metalness={0.1}
            />
          </mesh>
        ))}

        {/* ==================== Cross Beams ==================== */}
        {/* Beam at y=12 */}
        <mesh position={[-1, 12, 0]} castShadow>
          <boxGeometry args={[6, 0.5, 1.5]} />
          <meshStandardMaterial
            color={CONCRETE}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>

        {/* Beam at y=22 */}
        <mesh position={[-1, 22, 0]} castShadow>
          <boxGeometry args={[6, 0.5, 1.5]} />
          <meshStandardMaterial
            color={CONCRETE}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>

        {/* Beam at y=32 */}
        <mesh position={[-1, 32, 0]} castShadow>
          <boxGeometry args={[5, 0.5, 1.5]} />
          <meshStandardMaterial
            color={CONCRETE}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>

        {/* Beam at y=40 */}
        <mesh position={[-1, 40, 0]} castShadow>
          <boxGeometry args={[4, 0.5, 1.5]} />
          <meshStandardMaterial
            color={CONCRETE}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>

        {/* ==================== Helipad ==================== */}
        <mesh position={[6, 46, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[4, 4, 0.3, 16]} />
          <meshStandardMaterial
            color="#4CAF50"
            roughness={0.7}
            metalness={0.05}
          />
        </mesh>

        {/* Helipad "H" marking - using two vertical bars and one horizontal */}
        <mesh position={[5, 46.18, 0]}>
          <boxGeometry args={[0.3, 0.05, 2]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.5} metalness={0} />
        </mesh>
        <mesh position={[7, 46.18, 0]}>
          <boxGeometry args={[0.3, 0.05, 2]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.5} metalness={0} />
        </mesh>
        <mesh position={[6, 46.18, 0]}>
          <boxGeometry args={[2.2, 0.05, 0.3]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.5} metalness={0} />
        </mesh>

        {/* ==================== Decorative Top Arc ==================== */}
        <mesh position={[2, 48, 0]} castShadow>
          <sphereGeometry args={[3, 12, 12, 0, Math.PI]} />
          <meshStandardMaterial color={WHITE} roughness={0.5} metalness={0.1} />
        </mesh>

        {/* Gold accent band at top */}
        <mesh position={[2, 47.5, 0]}>
          <boxGeometry args={[14.5, 0.4, 2.3]} />
          <meshStandardMaterial color={GOLD} roughness={0.4} metalness={0.3} />
        </mesh>

        {/* Gold accent band at bottom of sail */}
        <mesh position={[2, 3.2, 0]}>
          <boxGeometry args={[14.5, 0.4, 2.3]} />
          <meshStandardMaterial color={GOLD} roughness={0.4} metalness={0.3} />
        </mesh>
      </RigidBody>

      {/* ==================== Label ==================== */}
      <Text
        position={[0, 55, 0]}
        fontSize={2.5}
        color="#333333"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.08}
        outlineColor="#ffffff"
      >
        BURJ AL ARAB
      </Text>
    </group>
  );
}
