"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useChunkCulling } from "../../hooks/use-chunk-culling";
import { CITY_COLORS } from "../../constants/city-theme";
import { overlapsRoad } from "../../constants/road-grid";
import { CITY_ZONES } from "../../constants/city-layout";
import { LANDMARKS } from "../../constants/landmarks";
import type { ChunkId } from "../../types";

// ==================== Seeded Random ====================

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function getChunkId(x: number, z: number): ChunkId {
  const gx = Math.floor((x + 400) / 200) - 2;
  const gz = Math.floor((z + 400) / 200) - 2;
  return `${gx}_${gz}` as ChunkId;
}

// ==================== Tree Data ====================

interface TreeData {
  x: number;
  z: number;
  heightScale: number;
  canopyScale: number;
  seed: number;
  chunkId: ChunkId;
}

function isInsideZone(x: number, z: number): boolean {
  for (const zone of CITY_ZONES) {
    if (
      x >= zone.bounds.x[0] &&
      x <= zone.bounds.x[1] &&
      z >= zone.bounds.z[0] &&
      z <= zone.bounds.z[1]
    ) {
      return true;
    }
  }
  return false;
}

function isInsideLandmark(x: number, z: number): boolean {
  for (const lm of LANDMARKS) {
    const hw = lm.footprint[0] / 2 + 3;
    const hd = lm.footprint[1] / 2 + 3;
    if (
      Math.abs(x - lm.position[0]) < hw &&
      Math.abs(z - lm.position[2]) < hd
    ) {
      return true;
    }
  }
  return false;
}

function generateTrees(): TreeData[] {
  const random = seededRandom(42);
  const rand = (min: number, max: number) => min + random() * (max - min);
  const trees: TreeData[] = [];

  // Helper: try to add a tree at (x, z), skip if on road, inside zone, or inside landmark
  const tryAdd = (
    x: number,
    z: number,
    hMin: number,
    hMax: number,
    cMin: number,
    cMax: number,
  ): boolean => {
    if (overlapsRoad(x, z, 5, 5)) return false;
    if (isInsideZone(x, z)) return false;
    if (isInsideLandmark(x, z)) return false;
    trees.push({
      x,
      z,
      heightScale: rand(hMin, hMax),
      canopyScale: rand(cMin, cMax),
      seed: rand(0, 100),
      chunkId: getChunkId(x, z),
    });
    return true;
  };

  // 1. Central park area trees (~40 dense trees in a park-like area near center)
  // Central Park district at the origin area: [-50, 50] x [-50, 50]
  for (let i = 0; i < 40; i++) {
    const angle = random() * Math.PI * 2;
    const radius = rand(8, 45);
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    tryAdd(x, z, 0.9, 1.4, 0.8, 1.3);
  }

  // 3. Scattered decoration trees across the map (~40 more)
  let scatterAttempts = 0;
  let scatterAdded = 0;
  while (scatterAdded < 40 && scatterAttempts < 200) {
    scatterAttempts++;
    const x = rand(-380, 380);
    const z = rand(-380, 380);
    if (tryAdd(x, z, 0.8, 1.3, 0.7, 1.2)) {
      scatterAdded++;
    }
  }

  return trees;
}

// ==================== Bush Data ====================

interface BushData {
  x: number;
  z: number;
  scale: number;
  chunkId: ChunkId;
}

function generateBushes(): BushData[] {
  const random = seededRandom(789);
  const rand = (min: number, max: number) => min + random() * (max - min);
  const bushes: BushData[] = [];

  const tryAddBush = (
    x: number,
    z: number,
    sMin: number,
    sMax: number,
  ): boolean => {
    if (overlapsRoad(x, z, 5, 5)) return false;
    if (isInsideZone(x, z)) return false;
    if (isInsideLandmark(x, z)) return false;
    bushes.push({
      x,
      z,
      scale: rand(sMin, sMax),
      chunkId: getChunkId(x, z),
    });
    return true;
  };

  // Park area bushes (near center)
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2 + rand(-0.3, 0.3);
    const radius = rand(6, 20);
    tryAddBush(Math.cos(angle) * radius, Math.sin(angle) * radius, 0.6, 1.0);
  }

  return bushes;
}

// ==================== Flower Data ====================

interface FlowerData {
  x: number;
  z: number;
  colorIndex: number;
  chunkId: ChunkId;
}

function generateFlowers(): FlowerData[] {
  const random = seededRandom(456);
  const rand = (min: number, max: number) => min + random() * (max - min);
  const flowers: FlowerData[] = [];

  // Park flowers near center (25 clusters)
  for (let i = 0; i < 25; i++) {
    const angle = random() * Math.PI * 2;
    const radius = rand(4, 35);
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    if (!overlapsRoad(x, z, 0.5, 0.5)) {
      flowers.push({
        x,
        z,
        colorIndex: i % 3,
        chunkId: getChunkId(x, z),
      });
    }
  }

  // Scattered flowers throughout the map
  let attempts = 0;
  while (flowers.length < 40 && attempts < 100) {
    attempts++;
    const x = rand(-300, 300);
    const z = rand(-300, 300);
    if (
      !overlapsRoad(x, z, 0.5, 0.5) &&
      !isInsideZone(x, z) &&
      !isInsideLandmark(x, z)
    ) {
      flowers.push({
        x,
        z,
        colorIndex: flowers.length % 3,
        chunkId: getChunkId(x, z),
      });
    }
  }

  return flowers;
}

// ==================== Pre-generate all data once (module level) ====================

const ALL_TREES = generateTrees();
const ALL_BUSHES = generateBushes();
const ALL_FLOWERS = generateFlowers();

const MAX_TREES = ALL_TREES.length;
const MAX_BUSHES = ALL_BUSHES.length;

const FLOWER_COLORS = [
  CITY_COLORS.flowerRed,
  CITY_COLORS.flowerYellow,
  CITY_COLORS.flowerWhite,
];

// ==================== Flower Cluster Component ====================

function FlowerClusterMesh({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) {
  const offsets: [number, number, number][] = [
    [0, 0, 0],
    [0.1, 0.02, 0.08],
    [-0.08, 0.01, 0.1],
  ];

  return (
    <group position={position}>
      {offsets.map((offset, i) => (
        <mesh key={`petal-${i}`} position={offset} castShadow>
          <sphereGeometry args={[0.06, 5, 4]} />
          <meshStandardMaterial color={color} roughness={0.8} metalness={0} />
        </mesh>
      ))}
      <mesh position={[0, -0.03, 0.03]}>
        <sphereGeometry args={[0.08, 4, 3]} />
        <meshStandardMaterial
          color={CITY_COLORS.bush}
          roughness={0.9}
          metalness={0}
        />
      </mesh>
    </group>
  );
}

// ==================== Main Component ====================

export function CityVegetation() {
  const trunkRef = useRef<THREE.InstancedMesh>(null);
  const canopyRef = useRef<THREE.InstancedMesh>(null);
  const bushRef = useRef<THREE.InstancedMesh>(null);

  const activeChunks = useChunkCulling();

  // Pre-create shared geometries and materials
  const trunkGeometry = useMemo(
    () => new THREE.CylinderGeometry(0.12, 0.15, 2, 6),
    [],
  );
  const trunkMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: CITY_COLORS.treeTrunk,
        roughness: 0.9,
        metalness: 0,
      }),
    [],
  );
  const canopyGeometry = useMemo(() => new THREE.SphereGeometry(1, 8, 6), []);
  const canopyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: CITY_COLORS.treeCanopy,
        roughness: 0.85,
        metalness: 0,
      }),
    [],
  );
  const bushGeometry = useMemo(() => new THREE.SphereGeometry(0.4, 6, 4), []);
  const bushMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: CITY_COLORS.bush,
        roughness: 0.85,
        metalness: 0,
      }),
    [],
  );

  // Filter trees/bushes by active chunks
  const visibleTrees = useMemo(() => {
    const chunkSet = new Set(activeChunks);
    return ALL_TREES.filter((t) => chunkSet.has(t.chunkId));
  }, [activeChunks]);

  const visibleBushes = useMemo(() => {
    const chunkSet = new Set(activeChunks);
    return ALL_BUSHES.filter((b) => chunkSet.has(b.chunkId));
  }, [activeChunks]);

  const visibleFlowers = useMemo(() => {
    const chunkSet = new Set(activeChunks);
    return ALL_FLOWERS.filter((f) => chunkSet.has(f.chunkId));
  }, [activeChunks]);

  // Zero matrix for hiding instances
  const zeroMatrix = useMemo(() => {
    const m = new THREE.Matrix4();
    m.makeScale(0, 0, 0);
    return m;
  }, []);

  // Update tree InstancedMesh transforms when visible trees change
  useEffect(() => {
    if (!trunkRef.current || !canopyRef.current) return;

    const dummy = new THREE.Object3D();

    // First, zero out ALL instances
    for (let i = 0; i < MAX_TREES; i++) {
      trunkRef.current.setMatrixAt(i, zeroMatrix);
      canopyRef.current.setMatrixAt(i, zeroMatrix);
    }

    // Then set visible tree transforms
    for (let i = 0; i < visibleTrees.length; i++) {
      const tree = visibleTrees[i];

      // Trunk
      dummy.position.set(tree.x, 1 * tree.heightScale, tree.z);
      dummy.scale.set(1, tree.heightScale, 1);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      trunkRef.current.setMatrixAt(i, dummy.matrix);

      // Canopy
      dummy.position.set(
        tree.x,
        2 * tree.heightScale + tree.canopyScale * 0.5,
        tree.z,
      );
      dummy.scale.set(
        tree.canopyScale,
        tree.canopyScale * 0.8,
        tree.canopyScale,
      );
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      canopyRef.current.setMatrixAt(i, dummy.matrix);
    }

    trunkRef.current.instanceMatrix.needsUpdate = true;
    canopyRef.current.instanceMatrix.needsUpdate = true;
  }, [visibleTrees, zeroMatrix]);

  // Update bush InstancedMesh transforms
  useEffect(() => {
    if (!bushRef.current) return;

    const dummy = new THREE.Object3D();

    // Zero out all
    for (let i = 0; i < MAX_BUSHES; i++) {
      bushRef.current.setMatrixAt(i, zeroMatrix);
    }

    // Set visible bushes
    for (let i = 0; i < visibleBushes.length; i++) {
      const bush = visibleBushes[i];
      dummy.position.set(bush.x, 0.3, bush.z);
      dummy.scale.setScalar(bush.scale);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      bushRef.current.setMatrixAt(i, dummy.matrix);
    }

    bushRef.current.instanceMatrix.needsUpdate = true;
  }, [visibleBushes, zeroMatrix]);

  // Gentle canopy sway animation (only for visible trees)
  useFrame((state) => {
    if (!canopyRef.current) return;

    const time = state.clock.elapsedTime;
    const dummy = new THREE.Object3D();

    for (let i = 0; i < visibleTrees.length; i++) {
      const tree = visibleTrees[i];

      dummy.position.set(
        tree.x,
        2 * tree.heightScale + tree.canopyScale * 0.5,
        tree.z,
      );
      dummy.scale.set(
        tree.canopyScale,
        tree.canopyScale * 0.8,
        tree.canopyScale,
      );

      // Subtle wind sway
      const swayAngle = Math.sin(time * 0.5 + tree.seed) * 0.02;
      dummy.rotation.set(0, 0, swayAngle);
      dummy.updateMatrix();

      canopyRef.current.setMatrixAt(i, dummy.matrix);
    }

    canopyRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Tree trunks (instanced, max allocation) */}
      <instancedMesh
        ref={trunkRef}
        args={[trunkGeometry, trunkMaterial, MAX_TREES]}
        castShadow
        frustumCulled={false}
      />

      {/* Tree canopies (instanced, max allocation) */}
      <instancedMesh
        ref={canopyRef}
        args={[canopyGeometry, canopyMaterial, MAX_TREES]}
        castShadow
        frustumCulled={false}
      />

      {/* Bushes (instanced, max allocation) */}
      <instancedMesh
        ref={bushRef}
        args={[bushGeometry, bushMaterial, MAX_BUSHES]}
        castShadow
        frustumCulled={false}
      />

      {/* Flower clusters (individual meshes, chunk-filtered) */}
      {visibleFlowers.map((flower, _i) => (
        <FlowerClusterMesh
          key={`flower-${flower.x.toFixed(1)}-${flower.z.toFixed(1)}`}
          position={[flower.x, 0.06, flower.z]}
          color={FLOWER_COLORS[flower.colorIndex]}
        />
      ))}
    </group>
  );
}
