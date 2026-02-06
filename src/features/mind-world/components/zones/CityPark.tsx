"use client";

import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useMemo, useRef } from "react";
import type * as THREE from "three";
import { CITY_COLORS } from "../../constants/city-theme";

// ==================== Constants ====================

const BENCH_COUNT = 6;
const BENCH_RADIUS = 6;
const PATH_LENGTH = 12;
const PATH_WIDTH = 2;
const PATH_THICKNESS = 0.08;

// ==================== Bench ====================

interface BenchProps {
  position: [number, number, number];
  rotation: [number, number, number];
}

function Bench({ position, rotation }: BenchProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Seat */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[1.2, 0.05, 0.4]} />
        <meshStandardMaterial
          color={CITY_COLORS.wood}
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>

      {/* Backrest */}
      <mesh position={[0, 0.65, -0.18]} castShadow>
        <boxGeometry args={[1.2, 0.3, 0.05]} />
        <meshStandardMaterial
          color={CITY_COLORS.wood}
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>

      {/* Left leg */}
      <mesh position={[-0.45, 0.22, 0]}>
        <boxGeometry args={[0.05, 0.44, 0.35]} />
        <meshStandardMaterial
          color={CITY_COLORS.metal}
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>

      {/* Right leg */}
      <mesh position={[0.45, 0.22, 0]}>
        <boxGeometry args={[0.05, 0.44, 0.35]} />
        <meshStandardMaterial
          color={CITY_COLORS.metal}
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>
    </group>
  );
}

// ==================== Flower Bed ====================

interface FlowerBedProps {
  position: [number, number, number];
  count: number;
  spread: number;
}

function FlowerBed({ position, count, spread }: FlowerBedProps) {
  const flowers = useMemo(() => {
    const colors = [
      CITY_COLORS.flowerRed,
      CITY_COLORS.flowerYellow,
      CITY_COLORS.flowerWhite,
    ];
    const items: {
      pos: [number, number, number];
      color: string;
      radius: number;
    }[] = [];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const dist = Math.random() * spread;
      items.push({
        pos: [
          Math.cos(angle) * dist,
          0.05 + Math.random() * 0.03,
          Math.sin(angle) * dist,
        ],
        color: colors[i % colors.length],
        radius: 0.05 + Math.random() * 0.03,
      });
    }
    return items;
  }, [count, spread]);

  return (
    <group position={position}>
      {/* Soil patch */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[spread + 0.2, 16]} />
        <meshStandardMaterial color="#5D4037" roughness={0.95} metalness={0} />
      </mesh>

      {/* Flower spheres */}
      {flowers.map((flower, i) => (
        <mesh key={`flower-${i}`} position={flower.pos}>
          <sphereGeometry args={[flower.radius, 8, 8]} />
          <meshStandardMaterial
            color={flower.color}
            roughness={0.7}
            metalness={0}
          />
        </mesh>
      ))}
    </group>
  );
}

// ==================== Walking Path ====================

interface WalkingPathProps {
  direction: "north" | "south" | "east" | "west";
}

function WalkingPath({ direction }: WalkingPathProps) {
  const position: [number, number, number] = useMemo(() => {
    switch (direction) {
      case "north":
        return [0, PATH_THICKNESS / 2, -PATH_LENGTH / 2 - 2];
      case "south":
        return [0, PATH_THICKNESS / 2, PATH_LENGTH / 2 + 2];
      case "east":
        return [PATH_LENGTH / 2 + 2, PATH_THICKNESS / 2, 0];
      case "west":
        return [-PATH_LENGTH / 2 - 2, PATH_THICKNESS / 2, 0];
    }
  }, [direction]);

  const isVertical = direction === "north" || direction === "south";

  return (
    <mesh position={position} receiveShadow>
      <boxGeometry
        args={
          isVertical
            ? [PATH_WIDTH, PATH_THICKNESS, PATH_LENGTH]
            : [PATH_LENGTH, PATH_THICKNESS, PATH_WIDTH]
        }
      />
      <meshStandardMaterial
        color={CITY_COLORS.sidewalkLight}
        roughness={0.85}
        metalness={0.05}
      />
    </mesh>
  );
}

// ==================== Main CityPark Component ====================

export function CityPark() {
  const waterSphereRef = useRef<THREE.Mesh>(null);

  // Gentle bob animation for the water sphere on top of the fountain
  useFrame((state) => {
    if (!waterSphereRef.current) return;
    const t = state.clock.elapsedTime;
    waterSphereRef.current.position.y = 2.0 + Math.sin(t * 1.5) * 0.15;
  });

  // Generate bench positions in a circle
  const benches = useMemo(() => {
    const items: {
      position: [number, number, number];
      rotation: [number, number, number];
    }[] = [];
    for (let i = 0; i < BENCH_COUNT; i++) {
      const angle = (i / BENCH_COUNT) * Math.PI * 2;
      const x = Math.cos(angle) * BENCH_RADIUS;
      const z = Math.sin(angle) * BENCH_RADIUS;
      items.push({
        position: [x, 0, z],
        rotation: [0, -angle + Math.PI, 0],
      });
    }
    return items;
  }, []);

  return (
    <group position={[300, 0, 0]}>
      {/* ==================== Fountain ==================== */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[2, 1.2, 2]} position={[0, 0.6, 0]} />

        {/* Stone base */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[2, 2.2, 0.5, 32]} />
          <meshStandardMaterial
            color={CITY_COLORS.sidewalk}
            roughness={0.85}
            metalness={0.05}
          />
        </mesh>

        {/* Water basin */}
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[1.8, 1.8, 0.3, 32]} />
          <meshStandardMaterial
            color={CITY_COLORS.glass}
            roughness={0.2}
            metalness={0.1}
            transparent
            opacity={0.5}
          />
        </mesh>

        {/* Center pillar */}
        <mesh position={[0, 1.25, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 1.5, 16]} />
          <meshStandardMaterial
            color={CITY_COLORS.sidewalk}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
      </RigidBody>

      {/* Water sphere on top (animated) */}
      <mesh ref={waterSphereRef} position={[0, 2.0, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={CITY_COLORS.glass}
          roughness={0.1}
          metalness={0.1}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* ==================== Benches ==================== */}
      {benches.map((bench, i) => (
        <Bench
          key={`bench-${i}`}
          position={bench.position}
          rotation={bench.rotation}
        />
      ))}

      {/* ==================== Walking Paths ==================== */}
      <WalkingPath direction="north" />
      <WalkingPath direction="south" />
      <WalkingPath direction="east" />
      <WalkingPath direction="west" />

      {/* ==================== Park Entrance Sign ==================== */}
      <Text
        position={[0, 3, 12]}
        fontSize={0.8}
        color="#333333"
        anchorX="center"
        anchorY="middle"
      >
        DEVELOPER'S PARK
      </Text>

      {/* Subtitle under sign */}
      <Text
        position={[0, 2.3, 12]}
        fontSize={0.3}
        color="#666666"
        anchorX="center"
        anchorY="middle"
      >
        Welcome to the City Center
      </Text>

      {/* ==================== Flower Beds ==================== */}
      {/* Flower beds at the four corners between paths */}
      <FlowerBed position={[4, 0, 4]} count={12} spread={1.2} />
      <FlowerBed position={[-4, 0, 4]} count={10} spread={1.0} />
      <FlowerBed position={[4, 0, -4]} count={11} spread={1.1} />
      <FlowerBed position={[-4, 0, -4]} count={9} spread={1.0} />

      {/* Smaller beds closer to the fountain */}
      <FlowerBed position={[3, 0, 0]} count={6} spread={0.6} />
      <FlowerBed position={[-3, 0, 0]} count={6} spread={0.6} />
      <FlowerBed position={[0, 0, 3]} count={6} spread={0.6} />
      <FlowerBed position={[0, 0, -3]} count={6} spread={0.6} />

      {/* ==================== Decorative Stone Edge ==================== */}
      {/* Low stone border around the fountain area */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.3, 2.5, 32]} />
        <meshStandardMaterial
          color={CITY_COLORS.sidewalk}
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
}
