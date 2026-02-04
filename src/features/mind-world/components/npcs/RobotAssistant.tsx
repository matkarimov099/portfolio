"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Cylinder, Sphere, Box, Text, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { useWorldStore } from "../../stores/world.store";
import { usePlayerStore } from "../../stores/player.store";
import { NPC_CONFIG, NPC_CHARACTERS } from "../../constants/npcs";

export function RobotAssistant() {
  const groupRef = useRef<THREE.Group>(null);
  const antennaRef = useRef<THREE.Mesh>(null);
  const [isNear, setIsNear] = useState(false);

  const playerPosition = usePlayerStore((state) => state.position);
  const controls = usePlayerStore((state) => state.controls);
  const startNPCDialog = useWorldStore((state) => state.startNPCDialog);

  const npc = NPC_CHARACTERS.find((n) => n.id === "robot-assistant");
  const position = npc?.position || [5, 1.5, 5];

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

    // Hovering animation
    groupRef.current.position.y =
      position[1] + Math.sin(elapsedTime * 2) * 0.1;

    // Rotate towards player when near
    if (near) {
      const angle = Math.atan2(dx, dz);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        angle,
        0.1
      );
    } else {
      // Idle rotation
      groupRef.current.rotation.y = elapsedTime * 0.3;
    }

    // Antenna animation
    if (antennaRef.current) {
      antennaRef.current.rotation.z =
        Math.sin(elapsedTime * 3) * 0.2;
    }

    // Handle interaction
    if (near && controls.interact) {
      startNPCDialog("robot-assistant");
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Main body - cube */}
      <Box args={[0.6, 0.6, 0.4]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#60a5fa"
          emissive="#60a5fa"
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </Box>

      {/* Screen/Face */}
      <mesh position={[0, 0.05, 0.21]}>
        <planeGeometry args={[0.4, 0.3]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>

      {/* Eyes on screen */}
      <group position={[0, 0.08, 0.22]}>
        <mesh position={[-0.08, 0, 0]}>
          <planeGeometry args={[0.08, 0.08]} />
          <meshBasicMaterial color="#60a5fa" />
        </mesh>
        <mesh position={[0.08, 0, 0]}>
          <planeGeometry args={[0.08, 0.08]} />
          <meshBasicMaterial color="#60a5fa" />
        </mesh>
      </group>

      {/* Mouth indicator */}
      <mesh position={[0, -0.05, 0.22]}>
        <planeGeometry args={[0.15, 0.03]} />
        <meshBasicMaterial color="#60a5fa" />
      </mesh>

      {/* Antenna */}
      <group ref={antennaRef} position={[0, 0.4, 0]}>
        <Cylinder args={[0.02, 0.02, 0.2, 8]}>
          <meshStandardMaterial color="#93c5fd" metalness={0.8} roughness={0.2} />
        </Cylinder>
        <Sphere args={[0.05, 8, 8]} position={[0, 0.12, 0]}>
          <meshStandardMaterial
            color="#60a5fa"
            emissive="#60a5fa"
            emissiveIntensity={1}
          />
        </Sphere>
      </group>

      {/* Arms */}
      <group position={[-0.4, 0, 0]}>
        <Cylinder args={[0.04, 0.04, 0.3, 8]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#93c5fd" metalness={0.8} roughness={0.2} />
        </Cylinder>
        <Sphere args={[0.06, 8, 8]} position={[-0.15, 0, 0]}>
          <meshStandardMaterial color="#60a5fa" metalness={0.8} roughness={0.2} />
        </Sphere>
      </group>
      <group position={[0.4, 0, 0]}>
        <Cylinder args={[0.04, 0.04, 0.3, 8]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#93c5fd" metalness={0.8} roughness={0.2} />
        </Cylinder>
        <Sphere args={[0.06, 8, 8]} position={[0.15, 0, 0]}>
          <meshStandardMaterial color="#60a5fa" metalness={0.8} roughness={0.2} />
        </Sphere>
      </group>

      {/* Hover jets */}
      {[[-0.15, -0.4, -0.1], [0.15, -0.4, -0.1], [0, -0.4, 0.1]].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <Cylinder args={[0.08, 0.05, 0.1, 8]}>
            <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} />
          </Cylinder>
          <pointLight
            position={[0, -0.1, 0]}
            color="#60a5fa"
            intensity={0.5}
            distance={1}
          />
        </group>
      ))}

      {/* Name label */}
      <Billboard follow>
        <Text
          position={[0, 0.7, 0]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          outlineWidth={0.015}
          outlineColor="#1a1a2e"
        >
          Debug Bot
        </Text>
      </Billboard>

      {/* Interaction prompt */}
      {isNear && (
        <Billboard follow>
          <group position={[0, 1, 0]}>
            <mesh>
              <planeGeometry args={[1, 0.3]} />
              <meshBasicMaterial color="#60a5fa" transparent opacity={0.8} />
            </mesh>
            <Text
              position={[0, 0, 0.01]}
              fontSize={0.12}
              color="white"
              anchorX="center"
            >
              [E] Ask for help
            </Text>
          </group>
        </Billboard>
      )}

      {/* Electric particles when near */}
      {isNear && (
        <>
          {[...Array(5)].map((_, i) => (
            <mesh
              key={i}
              position={[
                Math.sin(i * 1.2) * 0.5,
                Math.cos(i * 0.8) * 0.5,
                Math.sin(i * 0.5) * 0.3,
              ]}
            >
              <sphereGeometry args={[0.02, 4, 4]} />
              <meshBasicMaterial color="#60a5fa" />
            </mesh>
          ))}
        </>
      )}

      {/* Main glow */}
      <pointLight
        color="#60a5fa"
        intensity={isNear ? 1.5 : 0.8}
        distance={4}
      />
    </group>
  );
}
