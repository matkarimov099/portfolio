"use client";

import { useRef, useMemo, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type * as THREE from "three";

const MODEL_PATH = "/mind-world/models/car_compressed.glb";

interface CarModelProps {
  speed?: number;
}

// Fallback car made from basic geometry (always visible)
function FallbackCar() {
  return (
    <group>
      {/* Car body */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[2, 0.6, 4]} />
        <meshStandardMaterial color="#E53935" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Car roof/cabin */}
      <mesh position={[0, 0.85, -0.2]} castShadow>
        <boxGeometry args={[1.6, 0.5, 2]} />
        <meshStandardMaterial color="#C62828" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Windshield */}
      <mesh position={[0, 0.85, 0.8]} rotation={[0.3, 0, 0]} castShadow>
        <boxGeometry args={[1.5, 0.45, 0.05]} />
        <meshStandardMaterial
          color="#90CAF9"
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>
      {/* Rear window */}
      <mesh position={[0, 0.85, -1.2]} rotation={[-0.3, 0, 0]} castShadow>
        <boxGeometry args={[1.5, 0.45, 0.05]} />
        <meshStandardMaterial
          color="#90CAF9"
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>
      {/* Headlights */}
      <mesh position={[-0.7, 0.35, 1.95]}>
        <boxGeometry args={[0.4, 0.2, 0.1]} />
        <meshStandardMaterial
          color="#FFF9C4"
          emissive="#FFF176"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[0.7, 0.35, 1.95]}>
        <boxGeometry args={[0.4, 0.2, 0.1]} />
        <meshStandardMaterial
          color="#FFF9C4"
          emissive="#FFF176"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Tail lights */}
      <mesh position={[-0.7, 0.35, -1.95]}>
        <boxGeometry args={[0.4, 0.15, 0.1]} />
        <meshStandardMaterial
          color="#F44336"
          emissive="#D32F2F"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh position={[0.7, 0.35, -1.95]}>
        <boxGeometry args={[0.4, 0.15, 0.1]} />
        <meshStandardMaterial
          color="#F44336"
          emissive="#D32F2F"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Wheels */}
      <Wheel position={[-1, 0.15, 1.2]} />
      <Wheel position={[1, 0.15, 1.2]} />
      <Wheel position={[-1, 0.15, -1.2]} />
      <Wheel position={[1, 0.15, -1.2]} />
    </group>
  );
}

function Wheel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 12]} />
        <meshStandardMaterial color="#333333" roughness={0.9} />
      </mesh>
      {/* Hub cap */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.22, 8]} />
        <meshStandardMaterial color="#999999" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// GLB model loader (wrapped in Suspense externally)
function GLBCarModel({ speed = 0 }: { speed: number }) {
  const { scene } = useGLTF(MODEL_PATH);
  const wheelsRef = useRef<THREE.Mesh[]>([]);

  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    const wheels: THREE.Mesh[] = [];

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const name = child.name.toLowerCase();
        if (
          name.includes("wheel") ||
          name.includes("tire") ||
          name.includes("tyre")
        ) {
          wheels.push(child as THREE.Mesh);
        }
      }
    });

    wheelsRef.current = wheels;
    return clone;
  }, [scene]);

  useFrame((_state, delta) => {
    if (speed === 0) return;
    for (const wheel of wheelsRef.current) {
      wheel.rotation.x += speed * delta;
    }
  });

  return <primitive object={clonedScene} />;
}

export function CarModel({ speed = 0 }: CarModelProps) {
  return (
    <Suspense fallback={<FallbackCar />}>
      <GLBCarModel speed={speed} />
    </Suspense>
  );
}

useGLTF.preload(MODEL_PATH);
