"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Line } from "@react-three/drei";
import * as THREE from "three";

interface NeuronProps {
  position: [number, number, number];
  size?: number;
  color?: string;
  pulseSpeed?: number;
  connections?: [number, number, number][];
}

export function Neuron({
  position,
  size = 1,
  color = "#8B5CF6",
  pulseSpeed = 1,
  connections = [],
}: NeuronProps) {
  const neuronRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef(0);

  // Generate dendrite positions
  const dendrites = useMemo(() => {
    const count = 8;
    const points: THREE.Vector3[][] = [];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const length = size * (1.5 + Math.random() * 0.5);
      const segments: THREE.Vector3[] = [];

      // Create curved dendrite
      for (let j = 0; j <= 10; j++) {
        const t = j / 10;
        const x = Math.cos(angle) * length * t + Math.sin(t * 3) * 0.2;
        const y =
          Math.sin(angle * 0.5) * length * t * 0.3 + Math.cos(t * 2) * 0.1;
        const z = Math.sin(angle) * length * t + Math.cos(t * 3) * 0.2;
        segments.push(new THREE.Vector3(x, y, z));
      }

      points.push(segments);
    }

    return points;
  }, [size]);

  useFrame((state) => {
    if (!neuronRef.current) return;

    pulseRef.current =
      Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.5 + 0.5;

    // Pulse glow
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + pulseRef.current * 0.2);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.2 + pulseRef.current * 0.1;
    }
  });

  return (
    <group ref={neuronRef} position={position}>
      {/* Nucleus (cell body) */}
      <Sphere args={[size * 0.4, 32, 32]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.3}
          roughness={0.7}
        />
      </Sphere>

      {/* Glow */}
      <Sphere ref={glowRef} args={[size * 0.6, 16, 16]}>
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </Sphere>

      {/* Dendrites */}
      {dendrites.map((points, i) => (
        <Line
          key={`dendrite-${i}`}
          points={points}
          color={color}
          lineWidth={2}
          transparent
          opacity={0.8}
        />
      ))}

      {/* Synaptic connections */}
      {connections.map((target, i) => {
        const start = new THREE.Vector3(0, 0, 0);
        const end = new THREE.Vector3(
          target[0] - position[0],
          target[1] - position[1],
          target[2] - position[2],
        );

        // Create curved connection
        const mid = start.clone().lerp(end, 0.5);
        mid.y += 2;

        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const points = curve.getPoints(20);

        return (
          <Line
            key={`connection-${i}`}
            points={points}
            color={color}
            lineWidth={1}
            transparent
            opacity={0.4}
          />
        );
      })}

      {/* End bulbs on dendrites */}
      {dendrites.map((points, i) => {
        const endPoint = points[points.length - 1];
        return (
          <Sphere
            key={`bulb-${i}`}
            args={[size * 0.08, 8, 8]}
            position={[endPoint.x, endPoint.y, endPoint.z]}
          >
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.8}
            />
          </Sphere>
        );
      })}
    </group>
  );
}
