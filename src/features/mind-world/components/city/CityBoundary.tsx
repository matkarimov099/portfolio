"use client";

import { RigidBody, CuboidCollider } from "@react-three/rapier";

export function CityBoundary() {
  return (
    <group>
      {/* North wall */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[400, 15, 0.5]} position={[0, 7.5, -400]} />
      </RigidBody>
      {/* South wall */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[400, 15, 0.5]} position={[0, 7.5, 400]} />
      </RigidBody>
      {/* West wall */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[0.5, 15, 400]} position={[-400, 7.5, 0]} />
      </RigidBody>
      {/* East wall */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[0.5, 15, 400]} position={[400, 7.5, 0]} />
      </RigidBody>
    </group>
  );
}
