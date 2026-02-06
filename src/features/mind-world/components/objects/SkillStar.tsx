"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Trail, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { STAR_CONFIG, SKILL_CATEGORY_COLORS } from "../../constants/skills";
import type { SkillCategory } from "../../types";

interface SkillStarProps {
  position: [number, number, number];
  name: string;
  category: SkillCategory;
  collected: boolean;
  onCollect?: () => void;
}

export function SkillStar({
  position,
  name,
  category,
  collected,
}: SkillStarProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const color = SKILL_CATEGORY_COLORS[category];

  const starGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const outerRadius = STAR_CONFIG.baseSize;
    const innerRadius = outerRadius * 0.4;
    const points = 5;

    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.1,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 2,
    });
  }, []);

  useFrame((state) => {
    if (!meshRef.current || collected) return;

    const elapsedTime = state.clock.elapsedTime;

    // Rotation
    meshRef.current.rotation.y += STAR_CONFIG.rotationSpeed * 0.01;
    meshRef.current.rotation.z =
      Math.sin(elapsedTime * STAR_CONFIG.floatSpeed) * 0.1;

    // Glow pulse
    if (glowRef.current) {
      const scale = 1 + Math.sin(elapsedTime * 2) * 0.1;
      glowRef.current.scale.setScalar(scale);
    }
  });

  if (collected) return null;

  return (
    <Float
      speed={STAR_CONFIG.floatSpeed}
      rotationIntensity={0.2}
      floatIntensity={STAR_CONFIG.floatAmplitude}
      position={position}
    >
      <group>
        {/* Trail effect */}
        <Trail
          width={1}
          length={STAR_CONFIG.trailLength}
          color={color}
          attenuation={(t) => t * t}
        >
          {/* Main star */}
          <mesh ref={meshRef} geometry={starGeometry} castShadow>
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={STAR_CONFIG.glowIntensity}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        </Trail>

        {/* Glow sphere */}
        <mesh ref={glowRef} scale={1.5}>
          <sphereGeometry args={[STAR_CONFIG.baseSize, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.2} />
        </mesh>

        {/* Sparkles */}
        <Sparkles count={20} scale={2} size={2} speed={0.5} color={color} />
      </group>
    </Float>
  );
}
