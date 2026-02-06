"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Sphere, Text, Billboard } from "@react-three/drei";
import type * as THREE from "three";
import { useWorldStore } from "../../stores/world.store";
import { usePlayerStore } from "../../stores/player.store";
import { NPC_CONFIG, NPC_CHARACTERS } from "../../constants/npcs";

export function InnerVoice() {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [isNear, setIsNear] = useState(false);

  const playerPosition = usePlayerStore((state) => state.position);
  const controls = usePlayerStore((state) => state.controls);
  const startNPCDialog = useWorldStore((state) => state.startNPCDialog);

  const npc = NPC_CHARACTERS.find((n) => n.id === "inner-voice");
  const position = npc?.position || [0, 2, 5];

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

    // Floating animation
    groupRef.current.position.y =
      position[1] +
      Math.sin(elapsedTime * NPC_CONFIG.floatSpeed) * NPC_CONFIG.floatAmplitude;

    // Rotate towards player when near
    if (near && NPC_CONFIG.rotateToPlayer) {
      const angle = Math.atan2(dx, dz);
      groupRef.current.rotation.y = angle;
    }

    // Glow pulse
    if (glowRef.current) {
      const scale = 1 + Math.sin(elapsedTime * 2) * 0.1;
      glowRef.current.scale.setScalar(scale);
    }

    // Handle interaction
    if (near && controls.interact) {
      startNPCDialog("inner-voice");
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Main ethereal body */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        <Sphere args={[0.8, 32, 32]}>
          <meshStandardMaterial
            color="#8B5CF6"
            emissive="#8B5CF6"
            emissiveIntensity={0.8}
            transparent
            opacity={0.7}
            metalness={0.3}
            roughness={0.7}
          />
        </Sphere>
      </Float>

      {/* Inner glow */}
      <Sphere ref={glowRef} args={[1.2, 16, 16]}>
        <meshBasicMaterial color="#C4B5FD" transparent opacity={0.2} />
      </Sphere>

      {/* Outer aura */}
      <Sphere args={[1.5, 16, 16]}>
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.1} />
      </Sphere>

      {/* Orbiting particles */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 1;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle * 2) * 0.3,
              Math.sin(angle) * radius,
            ]}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="#C4B5FD" />
          </mesh>
        );
      })}

      {/* Name label */}
      <Billboard follow lockX={false} lockY={false} lockZ={false}>
        <Text
          position={[0, 1.8, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#1a0a2e"
        >
          Inner Voice
        </Text>
      </Billboard>

      {/* Interaction prompt */}
      {isNear && (
        <Billboard follow>
          <group position={[0, 2.2, 0]}>
            <mesh>
              <planeGeometry args={[1.5, 0.4]} />
              <meshBasicMaterial color="#8B5CF6" transparent opacity={0.8} />
            </mesh>
            <Text
              position={[0, 0, 0.01]}
              fontSize={0.15}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              [E] Talk
            </Text>
          </group>
        </Billboard>
      )}

      {/* Point light for glow effect */}
      <pointLight color="#8B5CF6" intensity={isNear ? 2 : 1} distance={5} />
    </group>
  );
}
