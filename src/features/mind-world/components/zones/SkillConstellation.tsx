"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { Stars, Text, Float, Line } from "@react-three/drei";
import * as THREE from "three";
import { SkillStar } from "../objects/SkillStar";
import { Portal } from "../objects/Portal";
import {
  SKILL_STARS,
  SKILL_CONSTELLATIONS,
  SKILL_CATEGORY_NAMES,
} from "../../constants/skills";
import { ZONE_PORTALS, PHYSICS_CONFIG } from "../../constants/zones";
import { useWorldStore } from "../../stores/world.store";
import { useSkillCollection } from "../../hooks/use-skill-collection";
import { usePlayerStore } from "../../stores/player.store";

export function SkillConstellation() {
  const groupRef = useRef<THREE.Group>(null);
  const setCurrentZone = useWorldStore((state) => state.setCurrentZone);
  const collectedSkills = useWorldStore((state) => state.collectedSkills);
  const playerPosition = usePlayerStore((state) => state.position);
  const { tryCollectSkill } = useSkillCollection();

  // Get return portal
  const portals = ZONE_PORTALS.filter((p) => p.fromZone === "skill-constellation");

  // Check for skill collection on each frame
  useFrame(() => {
    const pos: [number, number, number] = [
      playerPosition.x,
      playerPosition.y,
      playerPosition.z,
    ];
    tryCollectSkill(pos);
  });

  // Generate constellation lines
  const constellationLines = SKILL_CONSTELLATIONS.map((constellation) => {
    const skillPositions = constellation.skills
      .filter((s) => !collectedSkills.includes(s.id))
      .map((s) => new THREE.Vector3(...s.position));

    // Connect skills in the constellation
    const lines: THREE.Vector3[][] = [];
    for (let i = 0; i < skillPositions.length - 1; i++) {
      lines.push([skillPositions[i], skillPositions[i + 1]]);
    }
    // Connect last to first to close the constellation
    if (skillPositions.length > 2) {
      lines.push([skillPositions[skillPositions.length - 1], skillPositions[0]]);
    }

    return { color: constellation.color, lines };
  });

  return (
    <group ref={groupRef}>
      {/* Deep space ambience */}
      <ambientLight intensity={0.1} color="#3B82F6" />
      <fog attach="fog" args={["#0a0a2e", 50, 200]} />

      {/* Dense star field */}
      <Stars
        radius={200}
        depth={100}
        count={10000}
        factor={6}
        saturation={0.5}
        fade
        speed={0.2}
      />

      {/* Invisible floor platform */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[50, 0.5, 50]} position={[0, -0.5, 0]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <circleGeometry args={[50, 64]} />
          <meshStandardMaterial
            color="#0a0a2e"
            transparent
            opacity={0.3}
            metalness={0.5}
            roughness={0.8}
          />
        </mesh>
      </RigidBody>

      {/* Hexagonal grid platform */}
      <gridHelper
        args={[100, 20, "#1e3a8a", "#1e3a8a"]}
        position={[0, 0.01, 0]}
      />

      {/* Skill Stars */}
      {SKILL_STARS.map((skill) => (
        <SkillStar
          key={skill.id}
          position={skill.position}
          name={skill.name}
          category={skill.category}
          collected={collectedSkills.includes(skill.id)}
        />
      ))}

      {/* Constellation connection lines */}
      {constellationLines.map((constellation, ci) =>
        constellation.lines.map((line, li) => (
          <Line
            key={`line-${ci}-${li}`}
            points={line}
            color={constellation.color}
            lineWidth={1}
            transparent
            opacity={0.3}
            dashed
            dashScale={5}
          />
        ))
      )}

      {/* Category labels */}
      {SKILL_CONSTELLATIONS.map((constellation) => (
        <Float
          key={constellation.category}
          speed={0.3}
          rotationIntensity={0}
          floatIntensity={0.2}
        >
          <Text
            position={[
              constellation.centerPosition[0],
              constellation.centerPosition[1] + 5,
              constellation.centerPosition[2],
            ]}
            fontSize={0.5}
            color={constellation.color}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#0a0a2e"
          >
            {SKILL_CATEGORY_NAMES[constellation.category]}
          </Text>
        </Float>
      ))}

      {/* Zone title */}
      <Float speed={0.5} rotationIntensity={0} floatIntensity={0.3}>
        <Text
          position={[0, 35, 0]}
          fontSize={2}
          color="#3B82F6"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#0a0a2e"
        >
          SKILL CONSTELLATION
        </Text>
        <Text
          position={[0, 32, 0]}
          fontSize={0.5}
          color="#60a5fa"
          anchorX="center"
          anchorY="middle"
        >
          Collect the stars of knowledge
        </Text>
      </Float>

      {/* Progress indicator */}
      <Float speed={0.3} rotationIntensity={0} floatIntensity={0.2}>
        <Text
          position={[0, 30, 0]}
          fontSize={0.4}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
        >
          {`${collectedSkills.length} / ${SKILL_STARS.length} Skills Collected`}
        </Text>
      </Float>

      {/* Nebula-like background elements */}
      {[...Array(5)].map((_, i) => (
        <mesh
          key={`nebula-${i}`}
          position={[
            Math.cos((i / 5) * Math.PI * 2) * 80,
            20 + Math.random() * 20,
            Math.sin((i / 5) * Math.PI * 2) * 80,
          ]}
        >
          <sphereGeometry args={[20 + Math.random() * 10, 16, 16]} />
          <meshBasicMaterial
            color={SKILL_CONSTELLATIONS[i % SKILL_CONSTELLATIONS.length].color}
            transparent
            opacity={0.05}
          />
        </mesh>
      ))}

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
