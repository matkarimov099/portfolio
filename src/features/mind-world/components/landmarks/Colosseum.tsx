"use client";

import { Text } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { CITY_COLORS } from "../../constants/city-theme";
import { LANDMARKS } from "../../constants/landmarks";

const config = LANDMARKS.find((l) => l.id === "colosseum")!;
const STONE = CITY_COLORS.landmarkStone;
const STONE_DARK = "#A89880";
const SAND = "#D4C49A";
const ARCH_COLOR = "#6B5F4F";

// ==================== Types ====================

interface WallSegment {
  position: [number, number, number];
  rotation: [number, number, number];
  height: number;
}

// ==================== Colosseum ====================
// Height: 15m. Oval amphitheater with arch openings and partial ruins.

export function Colosseum() {
  // Generate outer wall segments arranged in an oval
  const outerSegments = useMemo<WallSegment[]>(() => {
    const segments: WallSegment[] = [];
    const count = 24;
    const radiusX = 14;
    const radiusZ = 11;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * radiusX;
      const z = Math.sin(angle) * radiusZ;

      // Make a few segments shorter for the "ruined" look (indices 8-11)
      const isRuined = i >= 8 && i <= 11;
      const height = isRuined ? 8 + Math.random() * 5 : 15;

      segments.push({
        position: [x, height / 2, z],
        rotation: [0, -angle + Math.PI / 2, 0],
        height,
      });
    }
    return segments;
  }, []);

  // Generate inner wall segments
  const innerSegments = useMemo<WallSegment[]>(() => {
    const segments: WallSegment[] = [];
    const count = 18;
    const radiusX = 10;
    const radiusZ = 8;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * radiusX;
      const z = Math.sin(angle) * radiusZ;

      // Match ruin pattern on inner wall
      const isRuined = i >= 6 && i <= 8;
      const height = isRuined ? 6 + Math.random() * 4 : 12;

      segments.push({
        position: [x, height / 2, z],
        rotation: [0, -angle + Math.PI / 2, 0],
        height,
      });
    }
    return segments;
  }, []);

  // Generate arch openings for outer wall
  const outerArches = useMemo(() => {
    const arches: { position: [number, number, number]; rotation: number }[] =
      [];
    const count = 24;
    const radiusX = 14;
    const radiusZ = 11;

    for (let i = 0; i < count; i++) {
      // Skip ruined sections
      if (i >= 8 && i <= 11) continue;

      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * radiusX;
      const z = Math.sin(angle) * radiusZ;

      arches.push({
        position: [x, 0, z],
        rotation: -angle + Math.PI / 2,
      });
    }
    return arches;
  }, []);

  return (
    <group position={config.position}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[15, 7.5, 12]} position={[0, 7.5, 0]} />

        {/* ==================== Arena Floor (oval via scaled cylinder) ==================== */}
        <mesh position={[0, 0.05, 0]} scale={[1, 1, 0.75]} receiveShadow>
          <cylinderGeometry args={[10, 10, 0.1, 32]} />
          <meshStandardMaterial color={SAND} roughness={0.95} metalness={0} />
        </mesh>

        {/* ==================== Outer Wall Segments ==================== */}
        {outerSegments.map((seg, i) => (
          <mesh
            key={`outer-${i}`}
            position={seg.position}
            rotation={seg.rotation}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[3, seg.height, 1.5]} />
            <meshStandardMaterial
              color={STONE}
              roughness={0.9}
              metalness={0.02}
            />
          </mesh>
        ))}

        {/* ==================== Outer Arch Openings (Lower Row y=3) ==================== */}
        {outerArches.map((arch, i) => (
          <group key={`arch-lower-${i}`}>
            {/* Lower arch */}
            <mesh
              position={[arch.position[0], 3, arch.position[2]]}
              rotation={[0, arch.rotation, 0]}
            >
              <boxGeometry args={[1.5, 3, 1.7]} />
              <meshStandardMaterial
                color={ARCH_COLOR}
                roughness={0.9}
                metalness={0.02}
              />
            </mesh>

            {/* Upper arch */}
            <mesh
              position={[arch.position[0], 9, arch.position[2]]}
              rotation={[0, arch.rotation, 0]}
            >
              <boxGeometry args={[1.2, 2.5, 1.7]} />
              <meshStandardMaterial
                color={ARCH_COLOR}
                roughness={0.9}
                metalness={0.02}
              />
            </mesh>
          </group>
        ))}

        {/* ==================== Inner Wall Segments ==================== */}
        {innerSegments.map((seg, i) => (
          <mesh
            key={`inner-${i}`}
            position={seg.position}
            rotation={seg.rotation}
            castShadow
          >
            <boxGeometry args={[2.5, seg.height, 1]} />
            <meshStandardMaterial
              color={STONE_DARK}
              roughness={0.9}
              metalness={0.02}
            />
          </mesh>
        ))}

        {/* ==================== Scattered Rubble (near ruined section) ==================== */}
        {/* A few fallen stone blocks for authenticity */}
        <mesh position={[14, 0.5, 3]} rotation={[0.2, 0.5, 0.1]}>
          <boxGeometry args={[2, 1, 1.2]} />
          <meshStandardMaterial color={STONE} roughness={0.95} metalness={0} />
        </mesh>
        <mesh position={[15, 0.4, -1]} rotation={[0.1, -0.3, 0.15]}>
          <boxGeometry args={[1.5, 0.8, 1]} />
          <meshStandardMaterial color={STONE} roughness={0.95} metalness={0} />
        </mesh>
        <mesh position={[13, 0.3, 1]} rotation={[-0.1, 0.7, 0]}>
          <boxGeometry args={[1, 0.6, 0.8]} />
          <meshStandardMaterial
            color={STONE_DARK}
            roughness={0.95}
            metalness={0}
          />
        </mesh>

        {/* ==================== Top Rim (Cornice) ==================== */}
        {/* Decorative band around top of non-ruined sections */}
        {outerSegments
          .filter((_, i) => i < 8 || i > 11)
          .map((seg, i) => (
            <mesh
              key={`cornice-${i}`}
              position={[seg.position[0], seg.height - 0.2, seg.position[2]]}
              rotation={seg.rotation}
            >
              <boxGeometry args={[3.3, 0.4, 1.7]} />
              <meshStandardMaterial
                color={STONE_DARK}
                roughness={0.85}
                metalness={0.05}
              />
            </mesh>
          ))}
      </RigidBody>

      {/* ==================== Label ==================== */}
      <Text
        position={[0, 20, 0]}
        fontSize={2.5}
        color="#333333"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.08}
        outlineColor="#ffffff"
      >
        COLOSSEUM
      </Text>
    </group>
  );
}
