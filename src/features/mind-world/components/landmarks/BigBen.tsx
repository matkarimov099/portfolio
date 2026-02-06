"use client";

import { Text } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { CITY_COLORS } from "../../constants/city-theme";
import { LANDMARKS } from "../../constants/landmarks";

const config = LANDMARKS.find((l) => l.id === "big-ben")!;
const STONE = CITY_COLORS.landmarkStone;
const STONE_DARK = "#A89880";
const CLOCK_WHITE = "#F5F5F0";
const CLOCK_RIM = "#333333";

// ==================== Clock Face ====================

interface ClockFaceProps {
  position: [number, number, number];
  rotation: [number, number, number];
}

function ClockFace({ position, rotation }: ClockFaceProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* White face */}
      <mesh>
        <cylinderGeometry args={[2.5, 2.5, 0.3, 16]} />
        <meshStandardMaterial
          color={CLOCK_WHITE}
          roughness={0.5}
          metalness={0.05}
        />
      </mesh>

      {/* Dark rim */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[2.6, 2.6, 0.15, 16]} />
        <meshStandardMaterial
          color={CLOCK_RIM}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Hour hand */}
      <mesh position={[0, 0, 0.2]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[0.2, 1.4, 0.1]} />
        <meshStandardMaterial
          color={CLOCK_RIM}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>

      {/* Minute hand */}
      <mesh position={[0, 0, 0.2]} rotation={[0, 0, -Math.PI / 3]}>
        <boxGeometry args={[0.12, 2.0, 0.08]} />
        <meshStandardMaterial
          color={CLOCK_RIM}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>

      {/* Center dot */}
      <mesh position={[0, 0, 0.22]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial
          color={CITY_COLORS.landmarkGoldAccent}
          roughness={0.3}
          metalness={0.3}
        />
      </mesh>
    </group>
  );
}

// ==================== Big Ben ====================
// Height: 45m. Gothic clock tower with pointed roof and spire.

export function BigBen() {
  const windowPositions = useMemo(() => {
    const windows: {
      pos: [number, number, number];
      rot: [number, number, number];
    }[] = [];
    const faces: {
      offset: [number, number, number];
      rot: [number, number, number];
    }[] = [
      { offset: [0, 0, -3.1], rot: [0, 0, 0] },
      { offset: [0, 0, 3.1], rot: [0, Math.PI, 0] },
      { offset: [-3.1, 0, 0], rot: [0, Math.PI / 2, 0] },
      { offset: [3.1, 0, 0], rot: [0, -Math.PI / 2, 0] },
    ];

    for (const face of faces) {
      for (let y = 5; y <= 23; y += 4) {
        windows.push({
          pos: [face.offset[0], y, face.offset[2]],
          rot: face.rot,
        });
      }
    }
    return windows;
  }, []);

  return (
    <group position={config.position}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[3.5, 22.5, 3.5]} position={[0, 22.5, 0]} />

        {/* ==================== Main Tower Body ==================== */}
        <mesh position={[0, 17.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[6, 35, 6]} />
          <meshStandardMaterial
            color={STONE}
            roughness={0.85}
            metalness={0.05}
          />
        </mesh>

        {/* ==================== Decorative Bands ==================== */}
        <mesh position={[0, 10, 0]} castShadow>
          <boxGeometry args={[6.2, 0.4, 6.2]} />
          <meshStandardMaterial
            color={STONE_DARK}
            roughness={0.8}
            metalness={0.05}
          />
        </mesh>
        <mesh position={[0, 20, 0]} castShadow>
          <boxGeometry args={[6.2, 0.4, 6.2]} />
          <meshStandardMaterial
            color={STONE_DARK}
            roughness={0.8}
            metalness={0.05}
          />
        </mesh>
        <mesh position={[0, 26, 0]} castShadow>
          <boxGeometry args={[6.3, 0.5, 6.3]} />
          <meshStandardMaterial
            color={STONE_DARK}
            roughness={0.8}
            metalness={0.05}
          />
        </mesh>

        {/* ==================== Windows ==================== */}
        {windowPositions.map((w, i) => (
          <mesh key={`window-${i}`} position={w.pos} rotation={w.rot}>
            <boxGeometry args={[1, 1.5, 0.15]} />
            <meshStandardMaterial
              color="#2A2A3A"
              roughness={0.3}
              metalness={0.1}
            />
          </mesh>
        ))}

        {/* ==================== Entrance Arch ==================== */}
        <mesh position={[0, 2, -3.1]} castShadow>
          <boxGeometry args={[2, 3.5, 0.3]} />
          <meshStandardMaterial
            color="#3D3428"
            roughness={0.9}
            metalness={0.05}
          />
        </mesh>

        {/* ==================== 4 Clock Faces (y=28) ==================== */}
        {/* Front */}
        <ClockFace position={[0, 28, -3.2]} rotation={[Math.PI / 2, 0, 0]} />
        {/* Back */}
        <ClockFace position={[0, 28, 3.2]} rotation={[-Math.PI / 2, 0, 0]} />
        {/* Left */}
        <ClockFace position={[-3.2, 28, 0]} rotation={[0, 0, Math.PI / 2]} />
        {/* Right */}
        <ClockFace position={[3.2, 28, 0]} rotation={[0, 0, -Math.PI / 2]} />

        {/* ==================== Gothic Pointed Roof ==================== */}
        <mesh position={[0, 39.5, 0]} castShadow>
          <coneGeometry args={[3.5, 10, 4]} />
          <meshStandardMaterial
            color={STONE}
            roughness={0.8}
            metalness={0.05}
          />
        </mesh>

        {/* ==================== Spire ==================== */}
        <mesh position={[0, 44.5, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 5, 8]} />
          <meshStandardMaterial
            color={CITY_COLORS.landmarkGoldAccent}
            roughness={0.4}
            metalness={0.3}
          />
        </mesh>

        {/* Spire tip */}
        <mesh position={[0, 47.2, 0]}>
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
        position={[0, 50, 0]}
        fontSize={2.5}
        color="#333333"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.08}
        outlineColor="#ffffff"
      >
        BIG BEN
      </Text>
    </group>
  );
}
