"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { Text, Float, Sphere, Torus, Ring, Stars } from "@react-three/drei";
import * as THREE from "three";
import { Portal } from "../objects/Portal";
import { ZONE_PORTALS } from "../../constants/zones";
import { useWorldStore } from "../../stores/world.store";

// Mock GitHub stats - in real app, fetch from API
const GITHUB_STATS = {
  totalRepos: 42,
  totalStars: 256,
  totalForks: 89,
  followers: 128,
  following: 45,
  contributions: 1247,
  languages: [
    { name: "TypeScript", percentage: 45, color: "#3178c6" },
    { name: "JavaScript", percentage: 25, color: "#f7df1e" },
    { name: "Python", percentage: 15, color: "#3572A5" },
    { name: "CSS", percentage: 10, color: "#563d7c" },
    { name: "Other", percentage: 5, color: "#94a3b8" },
  ],
};

interface StatDisplayProps {
  label: string;
  value: number | string;
  position: [number, number, number];
  color: string;
  size?: number;
}

function StatDisplay({ label, value, position, color, size = 1 }: StatDisplayProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin((state.clock.elapsedTime) * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Holographic background */}
      <mesh>
        <planeGeometry args={[3 * size, 2 * size]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>

      {/* Border */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(3 * size, 2 * size)]} />
        <lineBasicMaterial color={color} transparent opacity={0.5} />
      </lineSegments>

      {/* Value */}
      <Text
        position={[0, 0.2 * size, 0.01]}
        fontSize={0.6 * size}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {typeof value === "number" ? value.toLocaleString() : value}
      </Text>

      {/* Label */}
      <Text
        position={[0, -0.5 * size, 0.01]}
        fontSize={0.2 * size}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

function LanguageRing() {
  const ringRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = (state.clock.elapsedTime) * 0.1;
    }
  });

  // Create ring segments for each language
  const segments = useMemo(() => {
    let startAngle = 0;
    return GITHUB_STATS.languages.map((lang) => {
      const angle = (lang.percentage / 100) * Math.PI * 2;
      const segment = {
        ...lang,
        startAngle,
        endAngle: startAngle + angle,
      };
      startAngle += angle;
      return segment;
    });
  }, []);

  return (
    <group ref={ringRef} position={[0, 5, 0]} rotation={[Math.PI / 4, 0, 0]}>
      {segments.map((segment, i) => (
        <group key={segment.name}>
          {/* Ring segment */}
          <mesh rotation={[0, 0, segment.startAngle]}>
            <ringGeometry
              args={[
                4,
                5,
                32,
                1,
                0,
                segment.endAngle - segment.startAngle,
              ]}
            />
            <meshBasicMaterial
              color={segment.color}
              side={THREE.DoubleSide}
              transparent
              opacity={0.7}
            />
          </mesh>

          {/* Language label */}
          <Float speed={0.5} rotationIntensity={0} floatIntensity={0.2}>
            <Text
              position={[
                Math.cos((segment.startAngle + segment.endAngle) / 2) * 6,
                Math.sin((segment.startAngle + segment.endAngle) / 2) * 6,
                0.5,
              ]}
              fontSize={0.25}
              color={segment.color}
              anchorX="center"
              anchorY="middle"
            >
              {`${segment.name} ${segment.percentage}%`}
            </Text>
          </Float>
        </group>
      ))}
    </group>
  );
}

export function StatsObservatory() {
  const groupRef = useRef<THREE.Group>(null);
  const platformRef = useRef<THREE.Mesh>(null);
  const setCurrentZone = useWorldStore((state) => state.setCurrentZone);

  // Get return portal
  const portals = ZONE_PORTALS.filter((p) => p.fromZone === "stats-observatory");

  // Slow platform rotation
  useFrame((state) => {
    if (platformRef.current) {
      platformRef.current.rotation.y = (state.clock.elapsedTime) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Deep space environment */}
      <ambientLight intensity={0.15} color="#F97316" />
      <pointLight position={[0, 20, 0]} intensity={1.5} color="#F97316" distance={50} />

      {/* Stars background */}
      <Stars
        radius={150}
        depth={100}
        count={8000}
        factor={5}
        saturation={0.3}
        fade
        speed={0.3}
      />

      {/* Observatory platform */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[20, 0.5, 20]} position={[0, -0.5, 0]} />
        <mesh
          ref={platformRef}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <cylinderGeometry args={[18, 20, 1, 8]} />
          <meshStandardMaterial
            color="#1a0a0a"
            metalness={0.8}
            roughness={0.2}
            emissive="#F97316"
            emissiveIntensity={0.05}
          />
        </mesh>
      </RigidBody>

      {/* Central pedestal */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[2, 2.5, 4, 8]} />
        <meshStandardMaterial
          color="#7c2d12"
          metalness={0.7}
          roughness={0.3}
          emissive="#F97316"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* GitHub avatar placeholder */}
      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <Sphere args={[1.5, 32, 32]} position={[0, 6, 0]}>
          <meshStandardMaterial
            color="#F97316"
            emissive="#F97316"
            emissiveIntensity={0.5}
            metalness={0.5}
            roughness={0.5}
          />
        </Sphere>
      </Float>

      {/* Language distribution ring */}
      <LanguageRing />

      {/* Stats displays arranged in circle */}
      <group position={[0, 3, 0]}>
        <StatDisplay
          label="Repositories"
          value={GITHUB_STATS.totalRepos}
          position={[0, 5, -10]}
          color="#F97316"
          size={1.2}
        />
        <StatDisplay
          label="Total Stars"
          value={GITHUB_STATS.totalStars}
          position={[-8, 5, -6]}
          color="#fbbf24"
          size={1.2}
        />
        <StatDisplay
          label="Forks"
          value={GITHUB_STATS.totalForks}
          position={[8, 5, -6]}
          color="#fb923c"
          size={1.2}
        />
        <StatDisplay
          label="Followers"
          value={GITHUB_STATS.followers}
          position={[-10, 5, 2]}
          color="#f97316"
        />
        <StatDisplay
          label="Following"
          value={GITHUB_STATS.following}
          position={[10, 5, 2]}
          color="#ea580c"
        />
        <StatDisplay
          label="Contributions"
          value={GITHUB_STATS.contributions}
          position={[0, 5, 10]}
          color="#c2410c"
          size={1.2}
        />
      </group>

      {/* Orbital rings */}
      {[8, 12, 16].map((radius, i) => (
        <Torus
          key={`ring-${i}`}
          args={[radius, 0.02, 8, 64]}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 0.5, 0]}
        >
          <meshBasicMaterial
            color="#F97316"
            transparent
            opacity={0.2 - i * 0.05}
          />
        </Torus>
      ))}

      {/* Zone title */}
      <Float speed={0.5} rotationIntensity={0} floatIntensity={0.3}>
        <Text
          position={[0, 15, 0]}
          fontSize={1.2}
          color="#F97316"
          anchorX="center"
          outlineWidth={0.04}
          outlineColor="#1a0a0a"
        >
          STATS OBSERVATORY
        </Text>
        <Text
          position={[0, 13.5, 0]}
          fontSize={0.35}
          color="#fb923c"
          anchorX="center"
        >
          View your GitHub universe from above
        </Text>
      </Float>

      {/* Username display */}
      <Float speed={0.3} rotationIntensity={0} floatIntensity={0.2}>
        <Text
          position={[0, 8, 0]}
          fontSize={0.4}
          color="white"
          anchorX="center"
        >
          @matkarimov099
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
