"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, RoundedBox, } from "@react-three/drei";
import * as THREE from "three";

interface HologramProps {
  position: [number, number, number];
  title: string;
  description?: string;
  stats?: {
    stars?: number;
    forks?: number;
    language?: string;
  };
  url?: string;
  color?: string;
  isExpanded?: boolean;
  onInteract?: () => void;
}

export function Hologram({
  position,
  title,
  description,
  stats,
  url,
  color = "#10B981",
  isExpanded = false,
}: HologramProps) {
  const groupRef = useRef<THREE.Group>(null);
  const scanLineRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const width = isExpanded ? 4 : 2.5;
  const height = isExpanded ? 3 : 2;

  useFrame((state) => {
    if (!groupRef.current) return;

    const elapsedTime = state.clock.elapsedTime;

    // Holographic flicker
    const flicker = Math.random() > 0.98 ? 0.5 : 1;
    groupRef.current.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material as THREE.MeshBasicMaterial;
        if (mat.opacity !== undefined) {
          mat.opacity = (hovered ? 0.9 : 0.7) * flicker;
        }
      }
    });

    // Scan line animation
    if (scanLineRef.current) {
      scanLineRef.current.position.y =
        (((elapsedTime * 0.5) % 1) - 0.5) * height;
    }

    // Gentle rotation when not expanded
    if (!isExpanded) {
      groupRef.current.rotation.y = Math.sin(elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Base hologram panel */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Border */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(width, height)]} />
        <lineBasicMaterial color={color} transparent opacity={0.8} />
      </lineSegments>

      {/* Scan line effect */}
      <mesh ref={scanLineRef} position={[0, 0, 0.01]}>
        <planeGeometry args={[width, 0.02]} />
        <meshBasicMaterial color="white" transparent opacity={0.5} />
      </mesh>

      {/* Title */}
      <Text
        position={[0, height / 2 - 0.3, 0.01]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={width - 0.4}
      >
        {title}
      </Text>

      {/* Description (when expanded) */}
      {isExpanded && description && (
        <Text
          position={[0, 0.2, 0.01]}
          fontSize={0.12}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
          maxWidth={width - 0.4}
          textAlign="center"
        >
          {description}
        </Text>
      )}

      {/* Stats */}
      {stats && (
        <group position={[0, -height / 2 + 0.4, 0.01]}>
          {stats.stars !== undefined && (
            <group position={[-0.6, 0, 0]}>
              <Text fontSize={0.12} color={color} anchorX="center">
                {`★ ${stats.stars}`}
              </Text>
            </group>
          )}
          {stats.forks !== undefined && (
            <group position={[0.6, 0, 0]}>
              <Text fontSize={0.12} color={color} anchorX="center">
                {`⑂ ${stats.forks}`}
              </Text>
            </group>
          )}
          {stats.language && (
            <group position={[0, -0.3, 0]}>
              <RoundedBox args={[1, 0.25, 0.02]} radius={0.02}>
                <meshBasicMaterial color={color} transparent opacity={0.3} />
              </RoundedBox>
              <Text
                fontSize={0.1}
                color="white"
                anchorX="center"
                position={[0, 0, 0.02]}
              >
                {stats.language}
              </Text>
            </group>
          )}
        </group>
      )}

      {/* Corner decorations */}
      {[
        [-1, 1],
        [1, 1],
        [-1, -1],
        [1, -1],
      ].map(([x, y], i) => (
        <group key={i} position={[(x * width) / 2, (y * height) / 2, 0]}>
          <mesh>
            <planeGeometry args={[0.15, 0.02]} />
            <meshBasicMaterial color={color} transparent opacity={0.8} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <planeGeometry args={[0.15, 0.02]} />
            <meshBasicMaterial color={color} transparent opacity={0.8} />
          </mesh>
        </group>
      ))}

      {/* Interaction indicator */}
      {hovered && (
        <group position={[0, -height / 2 - 0.3, 0]}>
          <Text fontSize={0.1} color="#94a3b8" anchorX="center">
            [E] to interact
          </Text>
        </group>
      )}
    </group>
  );
}
