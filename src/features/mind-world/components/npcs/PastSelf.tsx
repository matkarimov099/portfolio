"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Cylinder, Sphere, Text, Billboard, Box } from "@react-three/drei";
import * as THREE from "three";
import { useWorldStore } from "../../stores/world.store";
import { usePlayerStore } from "../../stores/player.store";
import { PAST_SELF_CONFIGS } from "../../constants/memory-lane";
import { NPC_CONFIG } from "../../constants/npcs";

interface PastSelfProps {
  stationId: string;
}

export function PastSelf({ stationId }: PastSelfProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [isNear, setIsNear] = useState(false);

  const playerPosition = usePlayerStore((state) => state.position);
  const controls = usePlayerStore((state) => state.controls);
  const startNPCDialog = useWorldStore((state) => state.startNPCDialog);

  const config = PAST_SELF_CONFIGS.find((c) => c.stationId === stationId);
  if (!config) return null;

  const { name, appearance, npcId } = config;

  // Calculate position based on station
  const stationIndex = PAST_SELF_CONFIGS.findIndex((c) => c.stationId === stationId);
  const position: [number, number, number] = [
    (stationIndex % 2 === 0 ? -1 : 1) * 5,
    1,
    -stationIndex * 30,
  ];

  useFrame((state) => {
    if (!groupRef.current) return;

    const elapsedTime = state.clock.elapsedTime;

    // Check distance to player
    const dx = playerPosition.x - position[0];
    const dy = playerPosition.y - position[1];
    const dz = playerPosition.z - position[2];
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const near = distance <= NPC_CONFIG.interactionRadius;
    setIsNear(near);

    // Rotate towards player when near
    if (near) {
      const angle = Math.atan2(dx, dz);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        angle,
        0.1
      );
    }

    // Idle animation
    groupRef.current.position.y =
      position[1] + Math.sin(elapsedTime * 0.5) * 0.05;

    // Handle interaction
    if (near && controls.interact) {
      startNPCDialog(npcId);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Body */}
      <Cylinder args={[0.25, 0.3, appearance.height * 0.6, 8]} position={[0, appearance.height * 0.3, 0]}>
        <meshStandardMaterial
          color={appearance.color}
          emissive={appearance.color}
          emissiveIntensity={0.2}
          metalness={0.3}
          roughness={0.7}
        />
      </Cylinder>

      {/* Head */}
      <Sphere args={[0.2, 16, 16]} position={[0, appearance.height * 0.7, 0]}>
        <meshStandardMaterial
          color={appearance.color}
          emissive={appearance.color}
          emissiveIntensity={0.2}
          metalness={0.3}
          roughness={0.7}
        />
      </Sphere>

      {/* Eyes */}
      <group position={[0, appearance.height * 0.72, 0.15]}>
        <Sphere args={[0.03, 8, 8]} position={[-0.07, 0, 0]}>
          <meshBasicMaterial color="white" />
        </Sphere>
        <Sphere args={[0.03, 8, 8]} position={[0.07, 0, 0]}>
          <meshBasicMaterial color="white" />
        </Sphere>
        <Sphere args={[0.015, 8, 8]} position={[-0.07, 0, 0.02]}>
          <meshBasicMaterial color="#1a1a2e" />
        </Sphere>
        <Sphere args={[0.015, 8, 8]} position={[0.07, 0, 0.02]}>
          <meshBasicMaterial color="#1a1a2e" />
        </Sphere>
      </group>

      {/* Arms */}
      <Cylinder
        args={[0.05, 0.05, 0.4, 8]}
        position={[-0.35, appearance.height * 0.4, 0]}
        rotation={[0, 0, -Math.PI / 6]}
      >
        <meshStandardMaterial color={appearance.color} />
      </Cylinder>
      <Cylinder
        args={[0.05, 0.05, 0.4, 8]}
        position={[0.35, appearance.height * 0.4, 0]}
        rotation={[0, 0, Math.PI / 6]}
      >
        <meshStandardMaterial color={appearance.color} />
      </Cylinder>

      {/* Legs */}
      <Cylinder
        args={[0.08, 0.08, appearance.height * 0.3, 8]}
        position={[-0.12, -0.1, 0]}
      >
        <meshStandardMaterial color={appearance.color} />
      </Cylinder>
      <Cylinder
        args={[0.08, 0.08, appearance.height * 0.3, 8]}
        position={[0.12, -0.1, 0]}
      >
        <meshStandardMaterial color={appearance.color} />
      </Cylinder>

      {/* Name label */}
      <Billboard follow>
        <Text
          position={[0, appearance.height + 0.3, 0]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          outlineWidth={0.015}
          outlineColor="#1a1a2e"
        >
          {name}
        </Text>
      </Billboard>

      {/* Interaction prompt */}
      {isNear && (
        <Billboard follow>
          <group position={[0, appearance.height + 0.6, 0]}>
            <mesh>
              <planeGeometry args={[1, 0.3]} />
              <meshBasicMaterial color={appearance.color} transparent opacity={0.8} />
            </mesh>
            <Text
              position={[0, 0, 0.01]}
              fontSize={0.12}
              color="white"
              anchorX="center"
            >
              [E] Talk
            </Text>
          </group>
        </Billboard>
      )}

      {/* Ambient glow */}
      <pointLight
        color={appearance.color}
        intensity={isNear ? 1 : 0.5}
        distance={3}
        position={[0, appearance.height * 0.5, 0]}
      />
    </group>
  );
}
