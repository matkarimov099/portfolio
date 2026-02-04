"use client";

import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { RigidBody, CapsuleCollider, useRapier } from "@react-three/rapier";
import type { RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { usePlayerStore } from "../../stores/player.store";
import { useWorldStore } from "../../stores/world.store";
import { PlayerCamera } from "./PlayerCamera";
import { PHYSICS_CONFIG, SPAWN_POSITIONS } from "../../constants/zones";

const PLAYER_HEIGHT = PHYSICS_CONFIG.player.height;
const WALK_SPEED = PHYSICS_CONFIG.player.walkSpeed;
const SPRINT_SPEED = PHYSICS_CONFIG.player.sprintSpeed;
const JUMP_FORCE = PHYSICS_CONFIG.player.jumpForce;

export function PlayerController() {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const { camera } = useThree();
  const { rapier, world } = useRapier();

  const controls = usePlayerStore((state) => state.controls);
  const setPosition = usePlayerStore((state) => state.setPosition);
  const setGrounded = usePlayerStore((state) => state.setGrounded);
  const isSprinting = usePlayerStore((state) => state.isSprinting);
  const setSprinting = usePlayerStore((state) => state.setSprinting);
  const currentZone = usePlayerStore((state) => state.currentZone);

  const worldCurrentZone = useWorldStore((state) => state.currentZone);

  // Direction vectors
  const direction = useRef(new THREE.Vector3());
  const frontVector = useRef(new THREE.Vector3());
  const sideVector = useRef(new THREE.Vector3());
  const velocity = useRef(new THREE.Vector3());

  // Ground check
  const isGroundedRef = useRef(false);

  // Teleport when zone changes
  useEffect(() => {
    if (rigidBodyRef.current && worldCurrentZone !== currentZone) {
      const spawnPos = SPAWN_POSITIONS[worldCurrentZone] || [0, 2, 10];
      rigidBodyRef.current.setTranslation(
        { x: spawnPos[0], y: spawnPos[1], z: spawnPos[2] },
        true
      );
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      usePlayerStore.getState().setCurrentZone(worldCurrentZone);
    }
  }, [worldCurrentZone, currentZone]);

  // Update sprinting state
  useEffect(() => {
    setSprinting(controls.sprint);
  }, [controls.sprint, setSprinting]);

  useFrame(() => {
    if (!rigidBodyRef.current) return;

    const rb = rigidBodyRef.current;
    const translation = rb.translation();

    // Update camera position (first-person)
    camera.position.set(
      translation.x,
      translation.y + PLAYER_HEIGHT * 0.4,
      translation.z
    );

    // Update store position
    setPosition([translation.x, translation.y, translation.z]);

    // Ground check using raycast
    const rayOrigin = { x: translation.x, y: translation.y, z: translation.z };
    const rayDirection = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(rayOrigin, rayDirection);
    const hit = world.castRay(ray, PLAYER_HEIGHT * 0.6, true);
    isGroundedRef.current = hit !== null;
    setGrounded(isGroundedRef.current);

    // Calculate movement direction based on camera
    frontVector.current.set(0, 0, Number(controls.backward) - Number(controls.forward));
    sideVector.current.set(Number(controls.left) - Number(controls.right), 0, 0);

    direction.current
      .subVectors(frontVector.current, sideVector.current)
      .normalize()
      .multiplyScalar(isSprinting ? SPRINT_SPEED : WALK_SPEED)
      .applyEuler(new THREE.Euler(0, camera.rotation.y, 0));

    // Apply movement
    const currentVel = rb.linvel();
    velocity.current.set(direction.current.x, currentVel.y, direction.current.z);

    // Jump
    if (controls.jump && isGroundedRef.current) {
      velocity.current.y = JUMP_FORCE;
    }

    rb.setLinvel(
      { x: velocity.current.x, y: velocity.current.y, z: velocity.current.z },
      true
    );

    // Prevent falling through world
    if (translation.y < -50) {
      const spawnPos = SPAWN_POSITIONS[worldCurrentZone] || [0, 2, 10];
      rb.setTranslation(
        { x: spawnPos[0], y: spawnPos[1], z: spawnPos[2] },
        true
      );
      rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }
  });

  const spawnPos = SPAWN_POSITIONS[worldCurrentZone] || [0, 2, 10];

  return (
    <>
      <PlayerCamera />
      <RigidBody
        ref={rigidBodyRef}
        colliders={false}
        mass={PHYSICS_CONFIG.player.mass}
        type="dynamic"
        position={spawnPos}
        enabledRotations={[false, false, false]}
        linearDamping={0.5}
      >
        <CapsuleCollider args={[PLAYER_HEIGHT * 0.35, 0.3]} />
      </RigidBody>
    </>
  );
}
