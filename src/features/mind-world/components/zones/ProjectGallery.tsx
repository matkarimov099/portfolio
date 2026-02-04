"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { Text, Float } from "@react-three/drei";
import * as THREE from "three";
import { Hologram } from "../objects/Hologram";
import { Portal } from "../objects/Portal";
import { ZONE_PORTALS } from "../../constants/zones";
import { useWorldStore } from "../../stores/world.store";

// Mock project data - in real app, fetch from GitHub API
const PROJECTS = [
  {
    id: "portfolio",
    name: "3D Portfolio",
    description: "Interactive 3D portfolio with React Three Fiber",
    stars: 45,
    forks: 12,
    language: "TypeScript",
  },
  {
    id: "ecommerce",
    name: "E-Commerce Platform",
    description: "Full-stack e-commerce with Next.js and Supabase",
    stars: 89,
    forks: 34,
    language: "TypeScript",
  },
  {
    id: "dashboard",
    name: "Admin Dashboard",
    description: "Modern admin dashboard with data visualization",
    stars: 156,
    forks: 67,
    language: "TypeScript",
  },
  {
    id: "api",
    name: "REST API Service",
    description: "Scalable Node.js REST API with PostgreSQL",
    stars: 78,
    forks: 23,
    language: "JavaScript",
  },
  {
    id: "mobile",
    name: "Mobile App",
    description: "Cross-platform mobile app with React Native",
    stars: 112,
    forks: 45,
    language: "TypeScript",
  },
  {
    id: "cli",
    name: "Developer CLI",
    description: "Command-line tool for developer productivity",
    stars: 234,
    forks: 89,
    language: "TypeScript",
  },
];

export function ProjectGallery() {
  const groupRef = useRef<THREE.Group>(null);
  const setCurrentZone = useWorldStore((state) => state.setCurrentZone);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  // Get return portal
  const portals = ZONE_PORTALS.filter((p) => p.fromZone === "project-gallery");

  // Arrange projects in a circular gallery
  const projectPositions = PROJECTS.map((_, i) => {
    const angle = (i / PROJECTS.length) * Math.PI * 2;
    const radius = 12;
    return {
      x: Math.cos(angle) * radius,
      y: 3,
      z: Math.sin(angle) * radius,
      rotY: -angle + Math.PI,
    };
  });

  return (
    <group ref={groupRef}>
      {/* Museum-like lighting */}
      <ambientLight intensity={0.2} color="#10B981" />
      <spotLight
        position={[0, 20, 0]}
        intensity={1}
        angle={Math.PI / 4}
        penumbra={0.5}
        color="#10B981"
        castShadow
      />

      {/* Floor */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[30, 0.5, 30]} position={[0, -0.5, 0]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[30, 64]} />
          <meshStandardMaterial
            color="#0a1a1a"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </RigidBody>

      {/* Reflective floor effect */}
      <gridHelper args={[60, 30, "#10B981", "#064e3b"]} position={[0, 0.01, 0]} />

      {/* Central pillar */}
      <group position={[0, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[2, 2.5, 6, 8]} />
          <meshStandardMaterial
            color="#064e3b"
            metalness={0.5}
            roughness={0.5}
            emissive="#10B981"
            emissiveIntensity={0.1}
          />
        </mesh>
        <Float speed={0.5} rotationIntensity={0.5} floatIntensity={0.3}>
          <Text
            position={[0, 5, 0]}
            fontSize={0.8}
            color="#10B981"
            anchorX="center"
            rotation={[0, 0, 0]}
          >
            PROJECTS
          </Text>
        </Float>
      </group>

      {/* Project holograms */}
      {PROJECTS.map((project, i) => {
        const pos = projectPositions[i];
        return (
          <group
            key={project.id}
            position={[pos.x, pos.y, pos.z]}
            rotation={[0, pos.rotY, 0]}
          >
            {/* Pedestal */}
            <mesh position={[0, -1.5, 0]}>
              <cylinderGeometry args={[1, 1.2, 1, 6]} />
              <meshStandardMaterial
                color="#064e3b"
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>

            {/* Spotlight for each project */}
            <spotLight
              position={[0, 5, 0]}
              intensity={0.5}
              angle={Math.PI / 6}
              penumbra={0.5}
              color="#10B981"
              target-position={[0, 0, 0]}
            />

            <Hologram
              position={[0, 0, 0]}
              title={project.name}
              description={project.description}
              stats={{
                stars: project.stars,
                forks: project.forks,
                language: project.language,
              }}
              color="#10B981"
              isExpanded={expandedProject === project.id}
              onInteract={() =>
                setExpandedProject(
                  expandedProject === project.id ? null : project.id
                )
              }
            />
          </group>
        );
      })}

      {/* Floating code particles */}
      {[...Array(20)].map((_, i) => (
        <Float
          key={`particle-${i}`}
          speed={0.5 + Math.random()}
          rotationIntensity={0.2}
          floatIntensity={1}
          position={[
            (Math.random() - 0.5) * 40,
            Math.random() * 10 + 2,
            (Math.random() - 0.5) * 40,
          ]}
        >
          <Text
            fontSize={0.15}
            color="#10B98180"
            anchorX="center"
          >
            {["</>", "{}", "[]", "=>", "//", "&&", "||", "++"][i % 8]}
          </Text>
        </Float>
      ))}

      {/* Zone title */}
      <Text
        position={[0, 10, -20]}
        fontSize={1.5}
        color="#10B981"
        anchorX="center"
        outlineWidth={0.04}
        outlineColor="#0a1a1a"
      >
        PROJECT GALLERY
      </Text>
      <Text
        position={[0, 8.5, -20]}
        fontSize={0.4}
        color="#34d399"
        anchorX="center"
      >
        Explore the creations of the mind
      </Text>

      {/* Bug Catcher game area indicator */}
      <group position={[-15, 0, 0]}>
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4, 5, 32]} />
          <meshBasicMaterial color="#EF4444" transparent opacity={0.3} />
        </mesh>
        <Float speed={1} rotationIntensity={0} floatIntensity={0.5}>
          <Text position={[0, 2, 0]} fontSize={0.4} color="#EF4444" anchorX="center">
            Bug Catcher Arena
          </Text>
          <Text position={[0, 1.5, 0]} fontSize={0.2} color="#94a3b8" anchorX="center">
            Press [E] to start
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
