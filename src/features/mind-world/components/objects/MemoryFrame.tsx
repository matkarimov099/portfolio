"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { MemoryStation } from "../../types";

interface MemoryFrameProps {
  station: MemoryStation;
  active?: boolean;
}

export function MemoryFrame({ station, active = false }: MemoryFrameProps) {
  const groupRef = useRef<THREE.Group>(null);
  const frameRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const frameWidth = 4;
  const frameHeight = 3;
  const frameDepth = 0.1;

  useFrame((state) => {
    if (!groupRef.current) return;

    const elapsedTime = state.clock.elapsedTime;

    // Floating animation
    groupRef.current.position.y =
      station.position[1] + Math.sin(elapsedTime * 0.5) * 0.1;

    // Glow pulse when active
    if (glowRef.current && active) {
      const intensity = 0.5 + Math.sin(elapsedTime * 2) * 0.2;
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = intensity * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={station.position}>
      {/* Frame border */}
      <RoundedBox
        ref={frameRef}
        args={[frameWidth + 0.2, frameHeight + 0.2, frameDepth]}
        radius={0.1}
        smoothness={4}
      >
        <meshStandardMaterial
          color={active ? "#ffd700" : "#c0c0c0"}
          metalness={0.9}
          roughness={0.1}
          emissive={active ? "#ffd700" : "#333"}
          emissiveIntensity={active ? 0.3 : 0.1}
        />
      </RoundedBox>

      {/* Inner content area */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[frameWidth, frameHeight]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.5}
          roughness={0.8}
        />
      </mesh>

      {/* Year badge */}
      <group position={[0, frameHeight / 2 + 0.3, 0]}>
        <RoundedBox args={[2, 0.5, 0.1]} radius={0.05} smoothness={4}>
          <meshStandardMaterial
            color="#8B5CF6"
            emissive="#8B5CF6"
            emissiveIntensity={0.5}
          />
        </RoundedBox>
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          {station.year}
        </Text>
      </group>

      {/* Title */}
      <Text
        position={[0, 0.8, 0.1]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={frameWidth - 0.4}
        textAlign="center"
        font="/fonts/inter-bold.woff"
      >
        {station.title}
      </Text>

      {/* Company */}
      <Text
        position={[0, 0.4, 0.1]}
        fontSize={0.18}
        color="#a78bfa"
        anchorX="center"
        anchorY="middle"
        maxWidth={frameWidth - 0.4}
        textAlign="center"
      >
        {station.company}
      </Text>

      {/* Period label */}
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.15}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
      >
        {station.period}
      </Text>

      {/* Technologies */}
      <group position={[0, -0.6, 0.1]}>
        {station.technologies.slice(0, 4).map((tech, i) => (
          <group key={tech} position={[(i - 1.5) * 0.9, 0, 0]}>
            <RoundedBox args={[0.8, 0.25, 0.05]} radius={0.03} smoothness={2}>
              <meshStandardMaterial
                color="#10B981"
                emissive="#10B981"
                emissiveIntensity={0.3}
              />
            </RoundedBox>
            <Text
              position={[0, 0, 0.03]}
              fontSize={0.1}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {tech}
            </Text>
          </group>
        ))}
      </group>

      {/* Glow effect when active */}
      {active && (
        <mesh ref={glowRef} position={[0, 0, -0.1]}>
          <planeGeometry args={[frameWidth + 1, frameHeight + 1]} />
          <meshBasicMaterial
            color="#ffd700"
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
    </group>
  );
}
