"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { Text, Float, Sphere, Torus } from "@react-three/drei";
import * as THREE from "three";
import { Portal } from "../objects/Portal";
import {
  CONNECTION_PORTALS,
  CONNECTION_CONFIG,
  PLATFORM_COLORS,
  PLATFORM_GLOW_COLORS,
} from "../../constants/connections";
import { ZONE_PORTALS } from "../../constants/zones";
import { useWorldStore } from "../../stores/world.store";
import { usePlayerStore } from "../../stores/player.store";

export function ConnectionPort() {
  const groupRef = useRef<THREE.Group>(null);
  const setCurrentZone = useWorldStore((state) => state.setCurrentZone);
  const playerPosition = usePlayerStore((state) => state.position);
  const [chargeStates, setChargeStates] = useState<Record<string, number>>(
    Object.fromEntries(CONNECTION_PORTALS.map((p) => [p.id, 0]))
  );

  // Get return portal
  const portals = ZONE_PORTALS.filter((p) => p.fromZone === "connection-port");

  // Update charge states based on player proximity
  useFrame((_, delta) => {
    const newStates = { ...chargeStates };
    let updated = false;

    CONNECTION_PORTALS.forEach((connection) => {
      const dx = playerPosition.x - connection.position[0];
      const dy = playerPosition.y - connection.position[1];
      const dz = playerPosition.z - connection.position[2];
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

      const currentCharge = newStates[connection.id];

      if (distance <= CONNECTION_CONFIG.proximityRadius) {
        // Charging
        const newCharge = Math.min(
          CONNECTION_CONFIG.maxChargeLevel,
          currentCharge + CONNECTION_CONFIG.chargeSpeed * delta * 60
        );
        if (newCharge !== currentCharge) {
          newStates[connection.id] = newCharge;
          updated = true;

          // Open link when fully charged
          if (newCharge >= CONNECTION_CONFIG.activationThreshold) {
            window.open(connection.url, "_blank");
            newStates[connection.id] = 0; // Reset after opening
          }
        }
      } else {
        // Decaying
        const newCharge = Math.max(
          0,
          currentCharge - CONNECTION_CONFIG.chargeDecay * delta * 60
        );
        if (newCharge !== currentCharge) {
          newStates[connection.id] = newCharge;
          updated = true;
        }
      }
    });

    if (updated) {
      setChargeStates(newStates);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Pinkish ambient lighting */}
      <ambientLight intensity={0.2} color="#EC4899" />
      <pointLight position={[0, 10, 0]} intensity={1} color="#EC4899" distance={30} />

      {/* Floor */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[25, 0.5, 25]} position={[0, -0.5, 0]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[25, 64]} />
          <meshStandardMaterial
            color="#1a0a1a"
            metalness={0.5}
            roughness={0.7}
          />
        </mesh>
      </RigidBody>

      {/* Neural network pattern on floor */}
      <gridHelper args={[50, 25, "#EC4899", "#831843"]} position={[0, 0.01, 0]} />

      {/* Central hub */}
      <group position={[0, 3, 0]}>
        <Sphere args={[1.5, 32, 32]}>
          <meshStandardMaterial
            color="#EC4899"
            emissive="#EC4899"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </Sphere>
        <Torus args={[2.5, 0.1, 16, 32]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial
            color="#f472b6"
            emissive="#f472b6"
            emissiveIntensity={0.3}
          />
        </Torus>
      </group>

      {/* Connection portals */}
      {CONNECTION_PORTALS.map((connection, i) => {
        const charge = chargeStates[connection.id];
        const chargePercent = charge / CONNECTION_CONFIG.maxChargeLevel;
        const color = PLATFORM_COLORS[connection.platform];
        const glowColor = PLATFORM_GLOW_COLORS[connection.platform];
        const angle = (i / CONNECTION_PORTALS.length) * Math.PI * 2;

        return (
          <group
            key={connection.id}
            position={connection.position}
          >
            {/* Platform */}
            <mesh position={[0, -0.5, 0]}>
              <cylinderGeometry args={[1.5, 1.8, 1, 6]} />
              <meshStandardMaterial
                color={color}
                emissive={glowColor}
                emissiveIntensity={0.2 + chargePercent * 0.5}
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>

            {/* Connection node */}
            <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
              <Sphere args={[0.5 + chargePercent * 0.2, 16, 16]}>
                <meshStandardMaterial
                  color={glowColor}
                  emissive={glowColor}
                  emissiveIntensity={0.5 + chargePercent}
                  metalness={0.5}
                  roughness={0.5}
                  transparent
                  opacity={0.8}
                />
              </Sphere>
            </Float>

            {/* Charge ring */}
            <Torus
              args={[1.2, 0.05, 8, 32, Math.PI * 2 * chargePercent]}
              rotation={[Math.PI / 2, 0, -Math.PI / 2]}
              position={[0, 0.1, 0]}
            >
              <meshBasicMaterial color={glowColor} />
            </Torus>

            {/* Platform name */}
            <Text
              position={[0, 2, 0]}
              fontSize={0.35}
              color="white"
              anchorX="center"
              outlineWidth={0.02}
              outlineColor={color}
            >
              {connection.name}
            </Text>

            {/* Charge indicator */}
            <Text
              position={[0, 1.5, 0]}
              fontSize={0.2}
              color={chargePercent > 0.5 ? glowColor : "#94a3b8"}
              anchorX="center"
            >
              {chargePercent >= 1
                ? "Connecting..."
                : chargePercent > 0
                  ? `${Math.round(chargePercent * 100)}%`
                  : "Approach to connect"}
            </Text>

            {/* Connection line to center */}
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[new Float32Array([
                    0, 0.5, 0,
                    -connection.position[0], 3 - connection.position[1], -connection.position[2],
                  ]), 3]}
                />
              </bufferGeometry>
              <lineBasicMaterial
                color={glowColor}
                transparent
                opacity={0.3 + chargePercent * 0.5}
              />
            </line>

            {/* Particle effect when charging */}
            {chargePercent > 0.1 && (
              <pointLight
                position={[0, 1, 0]}
                intensity={chargePercent}
                color={glowColor}
                distance={5}
              />
            )}
          </group>
        );
      })}

      {/* Zone title */}
      <Float speed={0.5} rotationIntensity={0} floatIntensity={0.3}>
        <Text
          position={[0, 8, 0]}
          fontSize={1.2}
          color="#EC4899"
          anchorX="center"
          outlineWidth={0.04}
          outlineColor="#1a0a1a"
        >
          CONNECTION PORT
        </Text>
        <Text
          position={[0, 6.5, 0]}
          fontSize={0.35}
          color="#f9a8d4"
          anchorX="center"
        >
          Link to the outside world
        </Text>
      </Float>

      {/* Instructions */}
      <Float speed={0.3} rotationIntensity={0} floatIntensity={0.2}>
        <Text
          position={[0, 5.5, 0]}
          fontSize={0.25}
          color="#94a3b8"
          anchorX="center"
        >
          Stand near a portal to charge and connect
        </Text>
      </Float>

      {/* Return portal */}
      {portals.map((portal) => (
        <Portal
          key={portal.id}
          position={portal.position}
          rotation={portal.rotation}
          targetZone={portal.toZone}
          onEnter={() => setCurrentZone(portal.toZone)}
        />
      ))}
    </group>
  );
}
