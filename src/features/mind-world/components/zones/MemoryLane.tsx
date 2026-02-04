"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { Text, Float } from "@react-three/drei";
import * as THREE from "three";
import { MemoryFrame } from "../objects/MemoryFrame";
import { Portal } from "../objects/Portal";
import { MEMORY_STATIONS, TIMELINE_CONFIG, MEMORY_LANE_COLORS } from "../../constants/memory-lane";
import { ZONE_PORTALS } from "../../constants/zones";
import { useWorldStore } from "../../stores/world.store";
import { usePlayerStore } from "../../stores/player.store";

export function MemoryLane() {
  const groupRef = useRef<THREE.Group>(null);
  const setCurrentZone = useWorldStore((state) => state.setCurrentZone);
  const playerPosition = usePlayerStore((state) => state.position);

  // Generate year markers
  const yearMarkers = useMemo(() => {
    const markers: { year: number; position: [number, number, number] }[] = [];
    const { startYear, endYear, corridorLength } = TIMELINE_CONFIG;
    const totalYears = endYear - startYear;

    for (let i = 0; i <= totalYears; i++) {
      const z = -(i / totalYears) * corridorLength + corridorLength / 2;
      markers.push({
        year: startYear + i,
        position: [0, 0.1, z],
      });
    }

    return markers;
  }, []);

  // Get return portal
  const portals = ZONE_PORTALS.filter((p) => p.fromZone === "memory-lane");

  // Determine active station based on player position
  const activeStationIndex = useMemo(() => {
    const playerZ = playerPosition.z;
    let closest = 0;
    let minDist = Infinity;

    MEMORY_STATIONS.forEach((station, i) => {
      const dist = Math.abs(station.position[2] - playerZ);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });

    return closest;
  }, [playerPosition.z]);

  return (
    <group ref={groupRef}>
      {/* Ambient lighting */}
      <ambientLight intensity={0.2} color="#F59E0B" />
      <fog attach="fog" args={["#1a1a0a", 10, 80]} />

      {/* Corridor floor */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider
          args={[TIMELINE_CONFIG.corridorWidth / 2, 0.5, TIMELINE_CONFIG.corridorLength / 2]}
          position={[0, -0.5, 0]}
        />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[TIMELINE_CONFIG.corridorWidth, TIMELINE_CONFIG.corridorLength]} />
          <meshStandardMaterial
            color={MEMORY_LANE_COLORS.floor}
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>
      </RigidBody>

      {/* Corridor walls */}
      {[-1, 1].map((side) => (
        <RigidBody key={`wall-${side}`} type="fixed" colliders={false}>
          <CuboidCollider
            args={[0.2, TIMELINE_CONFIG.corridorHeight / 2, TIMELINE_CONFIG.corridorLength / 2]}
            position={[(TIMELINE_CONFIG.corridorWidth / 2 + 0.2) * side, TIMELINE_CONFIG.corridorHeight / 2, 0]}
          />
          <mesh
            position={[(TIMELINE_CONFIG.corridorWidth / 2) * side, TIMELINE_CONFIG.corridorHeight / 2, 0]}
          >
            <boxGeometry args={[0.2, TIMELINE_CONFIG.corridorHeight, TIMELINE_CONFIG.corridorLength]} />
            <meshStandardMaterial
              color={MEMORY_LANE_COLORS.corridor}
              metalness={0.2}
              roughness={0.8}
              transparent
              opacity={0.5}
            />
          </mesh>
        </RigidBody>
      ))}

      {/* Year markers on floor */}
      {yearMarkers.map(({ year, position }) => (
        <group key={year} position={position}>
          {/* Glowing line */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[TIMELINE_CONFIG.corridorWidth - 1, 0.1]} />
            <meshStandardMaterial
              color={MEMORY_LANE_COLORS.yearMarker}
              emissive={MEMORY_LANE_COLORS.yearMarker}
              emissiveIntensity={0.5}
            />
          </mesh>

          {/* Year text */}
          <Text
            position={[-(TIMELINE_CONFIG.corridorWidth / 2 - 0.5), 0.5, 0]}
            rotation={[0, Math.PI / 2, 0]}
            fontSize={0.5}
            color={MEMORY_LANE_COLORS.yearMarker}
            anchorX="center"
            anchorY="middle"
          >
            {year.toString()}
          </Text>
        </group>
      ))}

      {/* Memory stations */}
      {MEMORY_STATIONS.map((station, i) => (
        <group key={station.id}>
          {/* Station lighting */}
          <pointLight
            position={[0, 4, station.position[2]]}
            intensity={i === activeStationIndex ? 1 : 0.3}
            color={MEMORY_LANE_COLORS.frameGold}
            distance={15}
          />

          {/* Memory frame - alternate sides */}
          <group position={[(i % 2 === 0 ? -1 : 1) * 3, 2, station.position[2]]} rotation={[0, (i % 2 === 0 ? 1 : -1) * Math.PI / 4, 0]}>
            <MemoryFrame
              station={station}
              active={i === activeStationIndex}
            />
          </group>
        </group>
      ))}

      {/* Timeline title */}
      <Float speed={0.5} rotationIntensity={0} floatIntensity={0.3}>
        <Text
          position={[0, 5, TIMELINE_CONFIG.corridorLength / 2 - 5]}
          fontSize={1}
          color="#F59E0B"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#1a1a0a"
        >
          MEMORY LANE
        </Text>
        <Text
          position={[0, 4, TIMELINE_CONFIG.corridorLength / 2 - 5]}
          fontSize={0.3}
          color="#fbbf24"
          anchorX="center"
          anchorY="middle"
        >
          Journey through time: 2018 → 2025
        </Text>
      </Float>

      {/* Direction indicators */}
      <Float speed={1} rotationIntensity={0} floatIntensity={0.5}>
        <Text
          position={[0, 1, TIMELINE_CONFIG.corridorLength / 2 - 10]}
          fontSize={0.5}
          color="#94a3b8"
          anchorX="center"
        >
          ← Past
        </Text>
      </Float>
      <Float speed={1} rotationIntensity={0} floatIntensity={0.5}>
        <Text
          position={[0, 1, -TIMELINE_CONFIG.corridorLength / 2 + 10]}
          fontSize={0.5}
          color="#94a3b8"
          anchorX="center"
        >
          Future →
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
