"use client";

import { useMemo, Suspense } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import type * as THREE from "three";

const LOWPOLY_CITY_PATH = "/mind-world/models/lowpoly_city_compressed.glb";
const CITY_BUILDINGS_PATH = "/mind-world/models/city_buildings_compressed.glb";

function LowPolyCity() {
  const { scene } = useGLTF(LOWPOLY_CITY_PATH);

  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <primitive object={clonedScene} position={[0, 0, 0]} />
    </RigidBody>
  );
}

function CityBuildings() {
  const { scene } = useGLTF(CITY_BUILDINGS_PATH);

  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <primitive object={clonedScene} position={[0, 0, 0]} />
    </RigidBody>
  );
}

export function CityModels() {
  return (
    <group>
      <Suspense fallback={null}>
        <LowPolyCity />
      </Suspense>
      <Suspense fallback={null}>
        <CityBuildings />
      </Suspense>
    </group>
  );
}

useGLTF.preload(LOWPOLY_CITY_PATH);
useGLTF.preload(CITY_BUILDINGS_PATH);
