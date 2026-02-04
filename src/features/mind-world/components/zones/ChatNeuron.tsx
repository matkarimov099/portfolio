"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { Text, Float, Sphere, Html } from "@react-three/drei";
import * as THREE from "three";
import { Neuron } from "../objects/Neuron";
import { Portal } from "../objects/Portal";
import { ZONE_PORTALS } from "../../constants/zones";
import { useWorldStore } from "../../stores/world.store";

// Sample chat messages for visualization
const SAMPLE_MESSAGES = [
  { id: 1, text: "Hello! Welcome to my portfolio", sender: "bot", time: 0 },
  { id: 2, text: "Tell me about your projects", sender: "user", time: 1 },
  { id: 3, text: "I've built several web applications...", sender: "bot", time: 2 },
  { id: 4, text: "What technologies do you use?", sender: "user", time: 3 },
  { id: 5, text: "React, Next.js, TypeScript...", sender: "bot", time: 4 },
];

interface MessageBubbleProps {
  text: string;
  sender: "user" | "bot";
  position: [number, number, number];
  delay: number;
}

function MessageBubble({ text, sender, position, delay }: MessageBubbleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [visible, setVisible] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;

    const elapsedTime = state.clock.elapsedTime;

    // Delayed appearance
    if (!visible && elapsedTime > delay) {
      setVisible(true);
    }

    // Float animation
    if (visible) {
      groupRef.current.position.y =
        position[1] + Math.sin(elapsedTime * 0.5 + delay) * 0.2;
    }
  });

  if (!visible) return null;

  const isUser = sender === "user";
  const color = isUser ? "#3B82F6" : "#06B6D4";

  return (
    <group ref={groupRef} position={position}>
      {/* Bubble background */}
      <mesh position={[isUser ? 1 : -1, 0, 0]}>
        <boxGeometry args={[4, 1, 0.1]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.3}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Message text */}
      <Text
        position={[isUser ? 1 : -1, 0, 0.1]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={3.5}
        textAlign={isUser ? "right" : "left"}
      >
        {text}
      </Text>

      {/* Connection line to center */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([
              isUser ? -1 : 1, 0, 0,
              isUser ? -3 : 3, 0, 0,
            ]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.5} />
      </line>
    </group>
  );
}

export function ChatNeuron() {
  const groupRef = useRef<THREE.Group>(null);
  const centralNeuronRef = useRef<THREE.Group>(null);
  const setCurrentZone = useWorldStore((state) => state.setCurrentZone);

  // Get return portal
  const portals = ZONE_PORTALS.filter((p) => p.fromZone === "chat-neuron");

  // Generate message positions
  const messagePositions = useMemo(() => {
    return SAMPLE_MESSAGES.map((msg, i) => {
      const side = msg.sender === "user" ? 1 : -1;
      return {
        ...msg,
        position: [side * 8, 5 + i * 2, 0] as [number, number, number],
      };
    });
  }, []);

  // Synapse pulse animation
  useFrame((state) => {
    if (centralNeuronRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime) * 0.05;
      centralNeuronRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Cyan ambient lighting */}
      <ambientLight intensity={0.2} color="#06B6D4" />
      <pointLight position={[0, 15, 0]} intensity={1} color="#06B6D4" distance={40} />

      {/* Floor */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[25, 0.5, 25]} position={[0, -0.5, 0]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[25, 64]} />
          <meshStandardMaterial
            color="#0a1a2e"
            metalness={0.5}
            roughness={0.7}
          />
        </mesh>
      </RigidBody>

      {/* Grid pattern */}
      <gridHelper args={[50, 25, "#06B6D4", "#164e63"]} position={[0, 0.01, 0]} />

      {/* Central giant neuron */}
      <group ref={centralNeuronRef} position={[0, 8, 0]}>
        <Neuron
          position={[0, 0, 0]}
          size={4}
          color="#06B6D4"
          pulseSpeed={0.8}
          connections={[]}
        />
      </group>

      {/* Message bubbles as synaptic signals */}
      {messagePositions.map((msg) => (
        <MessageBubble
          key={msg.id}
          text={msg.text}
          sender={msg.sender as "user" | "bot"}
          position={msg.position}
          delay={msg.time}
        />
      ))}

      {/* Surrounding smaller neurons */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 15;
        return (
          <Neuron
            key={`neuron-${i}`}
            position={[
              Math.cos(angle) * radius,
              4 + Math.random() * 4,
              Math.sin(angle) * radius,
            ]}
            size={1}
            color={i % 2 === 0 ? "#22d3ee" : "#67e8f9"}
            pulseSpeed={0.5 + Math.random() * 0.5}
          />
        );
      })}

      {/* Electric impulse lines */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const innerRadius = 5;
        const outerRadius = 20;
        return (
          <line key={`impulse-${i}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[new Float32Array([
                  Math.cos(angle) * innerRadius, 8, Math.sin(angle) * innerRadius,
                  Math.cos(angle) * outerRadius, 4, Math.sin(angle) * outerRadius,
                ]), 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color="#06B6D4"
              transparent
              opacity={0.3}
            />
          </line>
        );
      })}

      {/* Zone title */}
      <Float speed={0.5} rotationIntensity={0} floatIntensity={0.3}>
        <Text
          position={[0, 18, 0]}
          fontSize={1.2}
          color="#06B6D4"
          anchorX="center"
          outlineWidth={0.04}
          outlineColor="#0a1a2e"
        >
          CHAT NEURON
        </Text>
        <Text
          position={[0, 16.5, 0]}
          fontSize={0.35}
          color="#67e8f9"
          anchorX="center"
        >
          Communication through thought impulses
        </Text>
      </Float>

      {/* Instructions */}
      <Float speed={0.3} rotationIntensity={0} floatIntensity={0.2}>
        <Text
          position={[0, 15, 0]}
          fontSize={0.25}
          color="#94a3b8"
          anchorX="center"
        >
          Messages flow as electrical signals
        </Text>
      </Float>

      {/* Interaction prompt */}
      <group position={[0, 2, 10]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2, 2.5, 32]} />
          <meshBasicMaterial color="#06B6D4" transparent opacity={0.3} />
        </mesh>
        <Float speed={1} rotationIntensity={0} floatIntensity={0.5}>
          <Text position={[0, 1, 0]} fontSize={0.3} color="#06B6D4" anchorX="center">
            Chat Portal
          </Text>
          <Text position={[0, 0.5, 0]} fontSize={0.15} color="#94a3b8" anchorX="center">
            Press [E] to open chat
          </Text>
        </Float>
      </group>

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
