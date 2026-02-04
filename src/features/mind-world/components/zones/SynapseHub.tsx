"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { Text, Stars, Float } from "@react-three/drei";
import * as THREE from "three";
import { Neuron } from "../objects/Neuron";
import { Portal } from "../objects/Portal";
import { ZONE_PORTALS } from "../../constants/zones";
import { useWorldStore } from "../../stores/world.store";

export function SynapseHub() {
  const floorRef = useRef<THREE.Mesh>(null);
  const setCurrentZone = useWorldStore((state) => state.setCurrentZone);

  // Generate neural network positions
  const neurons = useMemo(() => {
    const positions: [number, number, number][] = [];
    const count = 15;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 8 + Math.random() * 12;
      const height = Math.random() * 10 + 3;
      positions.push([
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius,
      ]);
    }

    return positions;
  }, []);

  // Get portals for this zone
  const portals = ZONE_PORTALS.filter((p) => p.fromZone === "synapse-hub");

  // Floating code snippets
  const codeSnippets = [
    "const mind = new Developer();",
    "while(true) { learn(); }",
    "export default Skills;",
    "function grow() { return experience++; }",
    "await fetchKnowledge();",
  ];

  return (
    <group>
      {/* Ambient lighting for the zone */}
      <ambientLight intensity={0.3} color="#8B5CF6" />
      <pointLight position={[0, 15, 0]} intensity={1} color="#8B5CF6" distance={50} />

      {/* Stars background */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Ground */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[50, 0.5, 50]} position={[0, -0.5, 0]} />
        <mesh ref={floorRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <circleGeometry args={[50, 64]} />
          <meshStandardMaterial
            color="#1a0a2e"
            metalness={0.5}
            roughness={0.8}
            emissive="#2d1b4e"
            emissiveIntensity={0.1}
          />
        </mesh>
      </RigidBody>

      {/* Grid pattern on floor */}
      <gridHelper args={[100, 50, "#4c1d95", "#2d1b4e"]} position={[0, 0.01, 0]} />

      {/* Central neuron cluster */}
      <Neuron
        position={[0, 8, 0]}
        size={3}
        color="#8B5CF6"
        pulseSpeed={0.5}
        connections={neurons.slice(0, 5)}
      />

      {/* Surrounding neurons */}
      {neurons.map((pos, i) => (
        <Neuron
          key={`neuron-${i}`}
          position={pos}
          size={1 + Math.random()}
          color={i % 2 === 0 ? "#a78bfa" : "#c4b5fd"}
          pulseSpeed={0.3 + Math.random() * 0.5}
        />
      ))}

      {/* Portals to other zones */}
      {portals.map((portal) => (
        <Portal
          key={portal.id}
          position={portal.position}
          rotation={portal.rotation}
          targetZone={portal.toZone}
          onEnter={() => setCurrentZone(portal.toZone)}
        />
      ))}

      {/* Floating code snippets */}
      {codeSnippets.map((code, i) => (
        <Float
          key={`code-${i}`}
          speed={0.5 + Math.random()}
          rotationIntensity={0.2}
          floatIntensity={0.5}
          position={[
            Math.cos((i / codeSnippets.length) * Math.PI * 2) * 12,
            5 + i * 2,
            Math.sin((i / codeSnippets.length) * Math.PI * 2) * 12,
          ]}
        >
          <Text
            fontSize={0.3}
            color="#a78bfa"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#1a0a2e"
          >
            {code}
          </Text>
        </Float>
      ))}

      {/* Welcome text */}
      <Text
        position={[0, 12, -20]}
        fontSize={1.5}
        color="#8B5CF6"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#1a0a2e"
      >
        SYNAPSE HUB
      </Text>
      <Text
        position={[0, 10.5, -20]}
        fontSize={0.4}
        color="#a78bfa"
        anchorX="center"
        anchorY="middle"
      >
        Welcome to the Developer's Mind
      </Text>

      {/* Zone indicators */}
      {portals.map((portal, i) => (
        <pointLight
          key={`light-${i}`}
          position={[portal.position[0], portal.position[1] + 2, portal.position[2]]}
          intensity={0.5}
          color={ZONE_PORTALS.find((z) => z.toZone === portal.toZone) ? "#8B5CF6" : "#fff"}
          distance={10}
        />
      ))}
    </group>
  );
}
