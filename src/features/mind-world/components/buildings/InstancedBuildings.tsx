"use client";

import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import type { BuildingConfig, BuildingType } from "../../types";
import { CHUNK_SIZE } from "../../constants/city-layout";
import { generateBuildings } from "./BuildingGenerator";

// Generate buildings once at module level with seed=42 for reproducibility
const ALL_BUILDINGS = generateBuildings(42);

interface BuildingGroupProps {
  buildings: BuildingConfig[];
  type: BuildingType;
}

function BuildingGroup({ buildings, type }: BuildingGroupProps) {
  const bodyRef = useRef<THREE.InstancedMesh>(null);
  const roofRef = useRef<THREE.InstancedMesh>(null);
  const count = buildings.length;

  // Shared geometries for all instances in this group
  const bodyGeom = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const roofGeom = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);

  useEffect(() => {
    if (!bodyRef.current || !roofRef.current || count === 0) return;

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const b = buildings[i];

      // Building body: position Y = height/2 (center of box sits on ground)
      dummy.position.set(b.position[0], b.height / 2, b.position[2]);
      dummy.scale.set(b.width, b.height, b.depth);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      bodyRef.current.setMatrixAt(i, dummy.matrix);
      color.set(b.color);
      bodyRef.current.setColorAt(i, color);

      // Roof placement depends on roof type
      if (b.roofType === "peaked") {
        dummy.position.set(b.position[0], b.height + 1, b.position[2]);
        dummy.scale.set(b.width + 0.5, 2, b.depth + 0.5);
      } else if (b.roofType === "stepped") {
        dummy.position.set(b.position[0], b.height + 0.5, b.position[2]);
        dummy.scale.set(b.width * 0.7, 1, b.depth * 0.7);
      } else {
        // flat roof: thin slab slightly wider than the body
        dummy.position.set(b.position[0], b.height + 0.15, b.position[2]);
        dummy.scale.set(b.width + 0.3, 0.3, b.depth + 0.3);
      }
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      roofRef.current.setMatrixAt(i, dummy.matrix);
      color.set(b.roofColor);
      roofRef.current.setColorAt(i, color);
    }

    bodyRef.current.instanceMatrix.needsUpdate = true;
    if (bodyRef.current.instanceColor)
      bodyRef.current.instanceColor.needsUpdate = true;
    roofRef.current.instanceMatrix.needsUpdate = true;
    if (roofRef.current.instanceColor)
      roofRef.current.instanceColor.needsUpdate = true;
  }, [buildings, count]);

  if (count === 0) return null;

  return (
    <group name={`building-group-${type}`}>
      {/* Building bodies */}
      <instancedMesh
        ref={bodyRef}
        args={[bodyGeom, undefined, count]}
        castShadow={false}
        receiveShadow
      >
        <meshStandardMaterial vertexColors roughness={0.75} metalness={0.05} />
      </instancedMesh>

      {/* Rooftops */}
      <instancedMesh
        ref={roofRef}
        args={[roofGeom, undefined, count]}
        castShadow={false}
      >
        <meshStandardMaterial vertexColors roughness={0.8} metalness={0.1} />
      </instancedMesh>
    </group>
  );
}

interface InstancedBuildingsProps {
  activeChunks?: string[]; // Optional chunk-based visibility filtering
}

export function InstancedBuildings({ activeChunks }: InstancedBuildingsProps) {
  // Filter buildings by active chunks if provided, otherwise show all
  const visibleBuildings = useMemo(() => {
    if (!activeChunks) return ALL_BUILDINGS;

    return ALL_BUILDINGS.filter((b) => {
      // Map world position to chunk grid coordinates
      // City spans -400..+400, CHUNK_SIZE=200, grid min=-2
      const chunkX = Math.floor((b.position[0] + 400) / CHUNK_SIZE) - 2;
      const chunkZ = Math.floor((b.position[2] + 400) / CHUNK_SIZE) - 2;
      const chunkId = `${chunkX}_${chunkZ}`;
      return activeChunks.includes(chunkId);
    });
  }, [activeChunks]);

  // Group visible buildings by type for optimal instancing (one draw call per type per mesh)
  const groups = useMemo(() => {
    const map = new Map<BuildingType, BuildingConfig[]>();
    for (const b of visibleBuildings) {
      if (!map.has(b.type)) map.set(b.type, []);
      map.get(b.type)?.push(b);
    }
    return Array.from(map.entries());
  }, [visibleBuildings]);

  return (
    <group name="instanced-buildings">
      {/* Visual instances (chunk-filtered) */}
      {groups.map(([type, buildings]) => (
        <BuildingGroup key={type} type={type} buildings={buildings} />
      ))}

      {/* Physics colliders for ALL buildings (not chunk-filtered, single fixed body) */}
      <RigidBody type="fixed" colliders={false}>
        {ALL_BUILDINGS.map((b) => (
          <CuboidCollider
            key={b.id}
            args={[b.width / 2, b.height / 2, b.depth / 2]}
            position={[b.position[0], b.position[1], b.position[2]]}
          />
        ))}
      </RigidBody>
    </group>
  );
}
