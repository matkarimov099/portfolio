"use client";

import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { DISTRICTS } from "../../constants/districts";

export function CityGround() {
  return (
    <group>
      {/* Main ground plane - grass */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[400, 0.5, 400]} position={[0, -0.5, 0]} />
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.01, 0]}
          receiveShadow
        >
          <planeGeometry args={[800, 800]} />
          <meshStandardMaterial color="#4a7c59" roughness={0.9} metalness={0} />
        </mesh>
      </RigidBody>

      {/* District ground patches - slightly above main ground */}
      {DISTRICTS.map((district) => {
        const width = district.bounds.x[1] - district.bounds.x[0];
        const depth = district.bounds.z[1] - district.bounds.z[0];
        const cx = (district.bounds.x[0] + district.bounds.x[1]) / 2;
        const cz = (district.bounds.z[0] + district.bounds.z[1]) / 2;

        return (
          <mesh
            key={`district-ground-${district.id}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[cx, 0.01, cz]}
            receiveShadow
          >
            <planeGeometry args={[width, depth]} />
            <meshStandardMaterial
              color={district.groundColor}
              roughness={0.9}
              metalness={0}
            />
          </mesh>
        );
      })}
    </group>
  );
}
