"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Torus, Sparkles, Text } from "@react-three/drei";
import * as THREE from "three";
import type { ZoneId } from "../../types";
import { ZONES } from "../../constants/zones";

interface PortalProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  targetZone: ZoneId;
  onEnter?: () => void;
  active?: boolean;
}

export function Portal({
  position,
  rotation = [0, 0, 0],
  targetZone,
  active = true,
}: PortalProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const zone = ZONES.find((z) => z.id === targetZone);
  const color = zone?.color || "#8B5CF6";

  // Create spiral particle positions
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(100 * 3);
    for (let i = 0; i < 100; i++) {
      const t = i / 100;
      const angle = t * Math.PI * 4;
      const radius = 1 + t * 0.5;
      positions[i * 3] = Math.cos(angle) * radius * 0.5;
      positions[i * 3 + 1] = Math.sin(angle) * radius * 0.5;
      positions[i * 3 + 2] = (t - 0.5) * 2;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (!groupRef.current || !active) return;

    const elapsedTime = state.clock.elapsedTime;

    // Rotate ring
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.01;
    }

    // Pulsing inner portal
    if (innerRef.current) {
      const scale = 1 + Math.sin(elapsedTime * 2) * 0.1;
      innerRef.current.scale.setScalar(scale);

      const mat = innerRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms) {
        mat.uniforms.time.value = elapsedTime;
      }
    }

    // Animate particles
    if (particlesRef.current) {
      particlesRef.current.rotation.z += 0.005;
    }
  });

  const portalShader = useMemo(
    () => ({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(color) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        varying vec2 vUv;

        void main() {
          vec2 center = vUv - 0.5;
          float dist = length(center);
          float angle = atan(center.y, center.x);

          float spiral = sin(angle * 3.0 + time * 2.0 - dist * 10.0) * 0.5 + 0.5;
          float glow = 1.0 - smoothstep(0.0, 0.5, dist);

          vec3 finalColor = color * spiral * glow;
          float alpha = glow * 0.8;

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
    }),
    [color]
  );

  if (!active) return null;

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
    >
      {/* Outer ring */}
      <Torus ref={ringRef} args={[1.2, 0.08, 16, 32]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </Torus>

      {/* Inner ring */}
      <Torus args={[1, 0.05, 16, 32]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </Torus>

      {/* Portal surface */}
      <mesh ref={innerRef}>
        <circleGeometry args={[0.95, 32]} />
        <shaderMaterial
          {...portalShader}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Swirling particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color={color}
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      {/* Sparkles around portal */}
      <Sparkles
        count={30}
        scale={3}
        size={3}
        speed={0.5}
        color={color}
      />

      {/* Zone name label */}
      <Text
        position={[0, -1.8, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {zone?.name || targetZone}
      </Text>

      {/* Instruction */}
      <Text
        position={[0, -2.1, 0]}
        fontSize={0.12}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
      >
        Walk through to enter
      </Text>
    </group>
  );
}
