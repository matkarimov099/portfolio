"use client";

import { Physics } from "@react-three/rapier";
import { PHYSICS_CONFIG } from "../../constants/zones";
import type { ReactNode } from "react";

interface PhysicsWorldProps {
  children: ReactNode;
  paused?: boolean;
}

export function PhysicsWorld({ children, paused = false }: PhysicsWorldProps) {
  return (
    <Physics
      gravity={[
        PHYSICS_CONFIG.gravity.x,
        PHYSICS_CONFIG.gravity.y,
        PHYSICS_CONFIG.gravity.z,
      ]}
      paused={paused}
      timeStep="vary"
      updatePriority={-50}
    >
      {children}
    </Physics>
  );
}
