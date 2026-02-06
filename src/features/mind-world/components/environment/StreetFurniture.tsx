"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useChunkCulling } from "../../hooks/use-chunk-culling";
import { usePlayerStore } from "../../stores/player.store";
import { CITY_COLORS } from "../../constants/city-theme";
import { GRID_ROADS, overlapsRoad } from "../../constants/road-grid";
import { CITY_ZONES } from "../../constants/city-layout";
import { LANDMARKS } from "../../constants/landmarks";
import type { ChunkId } from "../../types";

// ==================== Helpers ====================

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

// ==================== Types ====================

interface LampData {
  x: number;
  z: number;
  rotation: number;
  chunkId: ChunkId;
}

interface BenchData {
  x: number;
  z: number;
  rotation: number;
  chunkId: ChunkId;
}

interface TrashCanData {
  x: number;
  z: number;
  chunkId: ChunkId;
}

// ==================== Data Generators ====================

function generateLamps(): LampData[] {
  const lamps: LampData[] = [];

  for (const road of GRID_ROADS) {
    // Only place lamps along boulevards (every 25m) and secondary (every 40m)
    const spacing = road.type === "boulevard" ? 25 : 40;
    const sideOffset = road.width / 2 + 2;

    if (road.axis === "x") {
      const angle = 0;
      for (let x = road.start + 15; x < road.end - 15; x += spacing) {
        const side = Math.floor((x - road.start) / spacing) % 2 === 0 ? 1 : -1;
        const px = x;
        const pz = road.position + sideOffset * side;
        if (!isInsideZone(px, pz) && !isInsideLandmark(px, pz)) {
          lamps.push({
            x: px,
            z: pz,
            rotation: angle + (side === 1 ? 0 : Math.PI),
            chunkId: getChunkId(px, pz),
          });
        }
      }
    } else {
      const angle = Math.PI / 2;
      for (let z = road.start + 15; z < road.end - 15; z += spacing) {
        const side = Math.floor((z - road.start) / spacing) % 2 === 0 ? 1 : -1;
        const px = road.position + sideOffset * side;
        const pz = z;
        if (!isInsideZone(px, pz) && !isInsideLandmark(px, pz)) {
          lamps.push({
            x: px,
            z: pz,
            rotation: angle + (side === 1 ? 0 : Math.PI),
            chunkId: getChunkId(px, pz),
          });
        }
      }
    }
  }

  // Limit to ~100 lamp posts (keep first 100)
  if (lamps.length > 100) lamps.length = 100;
  return lamps;
}

function generateBenches(): BenchData[] {
  const random = seededRandom(321);
  const rand = (min: number, max: number) => min + random() * (max - min);
  const benches: BenchData[] = [];

  // Benches around central park area
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const radius = rand(8, 25);
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    if (!overlapsRoad(x, z, 1, 0.5)) {
      benches.push({
        x,
        z,
        rotation: angle + Math.PI,
        chunkId: getChunkId(x, z),
      });
    }
  }

  // Benches along boulevard sidewalks
  for (const road of GRID_ROADS) {
    if (road.type !== "boulevard") continue;
    const sideOffset = road.width / 2 + 1;
    const spacing = 80;

    if (road.axis === "x") {
      for (let x = road.start + 40; x < road.end - 40; x += spacing) {
        const side = Math.floor((x - road.start) / spacing) % 2 === 0 ? 1 : -1;
        const bx = x + rand(-2, 2);
        const bz = road.position + sideOffset * side;
        if (!isInsideZone(bx, bz) && !isInsideLandmark(bx, bz)) {
          benches.push({
            x: bx,
            z: bz,
            rotation: road.axis === "x" ? (Math.PI / 2) * side : 0,
            chunkId: getChunkId(bx, bz),
          });
        }
      }
    } else {
      for (let z = road.start + 40; z < road.end - 40; z += spacing) {
        const side = Math.floor((z - road.start) / spacing) % 2 === 0 ? 1 : -1;
        const bx = road.position + sideOffset * side;
        const bz = z + rand(-2, 2);
        if (!isInsideZone(bx, bz) && !isInsideLandmark(bx, bz)) {
          benches.push({
            x: bx,
            z: bz,
            rotation: side === 1 ? -Math.PI / 2 : Math.PI / 2,
            chunkId: getChunkId(bx, bz),
          });
        }
      }
    }
  }

  // Keep max 30 benches
  if (benches.length > 30) benches.length = 30;
  return benches;
}

function generateTrashCans(): TrashCanData[] {
  const trashCans: TrashCanData[] = [];

  // Place trash cans at boulevard intersections
  const boulevardPositions: number[] = [];
  for (const road of GRID_ROADS) {
    if (road.type === "boulevard") {
      boulevardPositions.push(road.position);
    }
  }

  // X-axis boulevards and Z-axis boulevards form intersections
  const xBoulevards = GRID_ROADS.filter(
    (r) => r.type === "boulevard" && r.axis === "x",
  );
  const zBoulevards = GRID_ROADS.filter(
    (r) => r.type === "boulevard" && r.axis === "z",
  );

  for (const xRoad of xBoulevards) {
    for (const zRoad of zBoulevards) {
      // Intersection at (zRoad.position, xRoad.position)
      const ix = zRoad.position;
      const iz = xRoad.position;
      // Place trash can at corner of intersection
      const offset = Math.max(xRoad.width, zRoad.width) / 2 + 2;
      const tx = ix + offset;
      const tz = iz + offset;
      if (!isInsideZone(tx, tz) && !isInsideLandmark(tx, tz)) {
        trashCans.push({
          x: tx,
          z: tz,
          chunkId: getChunkId(tx, tz),
        });
      }
      if (trashCans.length >= 20) break;
    }
    if (trashCans.length >= 20) break;
  }

  return trashCans;
}

// ==================== Pre-generate data (module level) ====================

const ALL_LAMPS = generateLamps();
const ALL_BENCHES = generateBenches();
const ALL_TRASH_CANS = generateTrashCans();

const MAX_LAMPS = ALL_LAMPS.length;

// ==================== Bench Sub-Component ====================

function Bench({
  position,
  rotation = 0,
}: {
  position: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Wooden seat */}
      <mesh castShadow receiveShadow position={[0, 0.45, 0]}>
        <boxGeometry args={[1.2, 0.06, 0.4]} />
        <meshStandardMaterial
          color={CITY_COLORS.wood}
          roughness={0.85}
          metalness={0}
        />
      </mesh>

      {/* Wooden backrest */}
      <mesh
        castShadow
        receiveShadow
        position={[0, 0.65, -0.17]}
        rotation={[-0.1, 0, 0]}
      >
        <boxGeometry args={[1.2, 0.4, 0.06]} />
        <meshStandardMaterial
          color={CITY_COLORS.wood}
          roughness={0.85}
          metalness={0}
        />
      </mesh>

      {/* Left metal leg */}
      <mesh castShadow position={[-0.5, 0.225, 0]}>
        <boxGeometry args={[0.06, 0.45, 0.35]} />
        <meshStandardMaterial
          color={CITY_COLORS.metalDark}
          roughness={0.6}
          metalness={0.3}
        />
      </mesh>

      {/* Right metal leg */}
      <mesh castShadow position={[0.5, 0.225, 0]}>
        <boxGeometry args={[0.06, 0.45, 0.35]} />
        <meshStandardMaterial
          color={CITY_COLORS.metalDark}
          roughness={0.6}
          metalness={0.3}
        />
      </mesh>
    </group>
  );
}

// ==================== Trash Can Sub-Component ====================

function TrashCan({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Green cylinder body */}
      <mesh castShadow receiveShadow position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.18, 0.2, 0.6, 8]} />
        <meshStandardMaterial
          color={CITY_COLORS.treeCanopy}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Gray lid */}
      <mesh castShadow position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.04, 8]} />
        <meshStandardMaterial
          color={CITY_COLORS.metalDark}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
}

// ==================== Nearby Lights Component ====================
// Renders ~8 PointLights near the player position (faking lamp illumination)

function NearbyLights() {
  const lightsRef = useRef<THREE.Group>(null);
  const playerPosition = usePlayerStore((state) => state.position);

  // Find the 8 nearest lamps to the player
  const nearbyLamps = useMemo(() => {
    const px = playerPosition.x;
    const pz = playerPosition.z;

    const withDist = ALL_LAMPS.map((lamp) => ({
      lamp,
      dist: (lamp.x - px) ** 2 + (lamp.z - pz) ** 2,
    }));

    withDist.sort((a, b) => a.dist - b.dist);
    return withDist.slice(0, 8).map((d) => d.lamp);
  }, [playerPosition.x, playerPosition.z
  ]);

  return (
    <group ref={lightsRef}>
      {nearbyLamps.map((lamp, i) => (
        <pointLight
          key={`light-${i}`}
          position={[lamp.x + 0.7, 3.5, lamp.z]}
          color="#FFF5E6"
          intensity={0.3}
          distance={12}
        />
      ))}
    </group>
  );
}

// ==================== Main Component ====================

export function StreetFurniture() {
  const lampPoleRef = useRef<THREE.InstancedMesh>(null);
  const lampArmRef = useRef<THREE.InstancedMesh>(null);
  const lampFixtureRef = useRef<THREE.InstancedMesh>(null);

  const activeChunks = useChunkCulling();

  // Shared geometries for lamp post instancing
  const poleGeometry = useMemo(
    () => new THREE.CylinderGeometry(0.05, 0.05, 4, 6),
    [],
  );
  const poleMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: CITY_COLORS.metal,
        roughness: 0.6,
        metalness: 0.3,
      }),
    [],
  );

  const armGeometry = useMemo(() => new THREE.BoxGeometry(0.8, 0.04, 0.04), []);

  const fixtureGeometry = useMemo(
    () => new THREE.BoxGeometry(0.15, 0.08, 0.15),
    [],
  );
  const fixtureMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#DDDDDD",
        roughness: 0.5,
        metalness: 0.2,
        emissive: "#FFF5E6",
        emissiveIntensity: 0.1,
      }),
    [],
  );

  // Chunk-filtered data
  const visibleLamps = useMemo(() => {
    const chunkSet = new Set(activeChunks);
    return ALL_LAMPS.filter((l) => chunkSet.has(l.chunkId));
  }, [activeChunks]);

  const visibleBenches = useMemo(() => {
    const chunkSet = new Set(activeChunks);
    return ALL_BENCHES.filter((b) => chunkSet.has(b.chunkId));
  }, [activeChunks]);

  const visibleTrashCans = useMemo(() => {
    const chunkSet = new Set(activeChunks);
    return ALL_TRASH_CANS.filter((t) => chunkSet.has(t.chunkId));
  }, [activeChunks]);

  // Zero matrix for hiding instances
  const zeroMatrix = useMemo(() => {
    const m = new THREE.Matrix4();
    m.makeScale(0, 0, 0);
    return m;
  }, []);

  // Update lamp InstancedMesh transforms
  useEffect(() => {
    if (!lampPoleRef.current || !lampArmRef.current || !lampFixtureRef.current)
      return;

    const dummy = new THREE.Object3D();

    // Zero out all instances
    for (let i = 0; i < MAX_LAMPS; i++) {
      lampPoleRef.current.setMatrixAt(i, zeroMatrix);
      lampArmRef.current.setMatrixAt(i, zeroMatrix);
      lampFixtureRef.current.setMatrixAt(i, zeroMatrix);
    }

    // Set visible lamp transforms
    for (let i = 0; i < visibleLamps.length; i++) {
      const lamp = visibleLamps[i];
      const rot = lamp.rotation;

      // Pole: centered at y=2 (half of 4m height)
      dummy.position.set(lamp.x, 2, lamp.z);
      dummy.scale.set(1, 1, 1);
      dummy.rotation.set(0, rot, 0);
      dummy.updateMatrix();
      lampPoleRef.current.setMatrixAt(i, dummy.matrix);

      // Arm: offset from pole top
      const armOffsetX = Math.sin(rot) * 0.4;
      const armOffsetZ = Math.cos(rot) * 0.4;
      dummy.position.set(lamp.x + armOffsetX, 3.8, lamp.z + armOffsetZ);
      dummy.rotation.set(0, rot, -0.3);
      dummy.updateMatrix();
      lampArmRef.current.setMatrixAt(i, dummy.matrix);

      // Fixture: at end of arm
      const fixtureOffsetX = Math.sin(rot) * 0.7;
      const fixtureOffsetZ = Math.cos(rot) * 0.7;
      dummy.position.set(lamp.x + fixtureOffsetX, 3.7, lamp.z + fixtureOffsetZ);
      dummy.rotation.set(0, rot, 0);
      dummy.updateMatrix();
      lampFixtureRef.current.setMatrixAt(i, dummy.matrix);
    }

    lampPoleRef.current.instanceMatrix.needsUpdate = true;
    lampArmRef.current.instanceMatrix.needsUpdate = true;
    lampFixtureRef.current.instanceMatrix.needsUpdate = true;
  }, [visibleLamps, zeroMatrix]);

  return (
    <group>
      {/* Lamp post poles (instanced) */}
      <instancedMesh
        ref={lampPoleRef}
        args={[poleGeometry, poleMaterial, MAX_LAMPS]}
        castShadow
        frustumCulled={false}
      />

      {/* Lamp post arms (instanced, same material as poles) */}
      <instancedMesh
        ref={lampArmRef}
        args={[armGeometry, poleMaterial, MAX_LAMPS]}
        frustumCulled={false}
      />

      {/* Lamp post fixtures (instanced) */}
      <instancedMesh
        ref={lampFixtureRef}
        args={[fixtureGeometry, fixtureMaterial, MAX_LAMPS]}
        frustumCulled={false}
      />

      {/* Dynamic point lights near player (only ~8) */}
      <NearbyLights />

      {/* Benches (individual meshes, chunk-filtered) */}
      {visibleBenches.map((bench, _i) => (
        <Bench
          key={`bench-${bench.x.toFixed(0)}-${bench.z.toFixed(0)}`}
          position={[bench.x, 0, bench.z]}
          rotation={bench.rotation}
        />
      ))}

      {/* Trash cans (individual meshes, chunk-filtered) */}
      {visibleTrashCans.map((tc, _i) => (
        <TrashCan
          key={`trash-${tc.x.toFixed(0)}-${tc.z.toFixed(0)}`}
          position={[tc.x, 0, tc.z]}
        />
      ))}
    </group>
  );
}
