"use client";

import { useRef, useEffect, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import type { RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { usePlayerStore } from "../../stores/player.store";
import { useWorldStore } from "../../stores/world.store";
import { PlayerCamera } from "./PlayerCamera";
import { PHYSICS_CONFIG } from "../../constants/zones";
import { SPAWN_POSITION } from "../../constants/city-layout";

const CHARACTER_MODEL_PATH = "/mind-world/models/cool_man.glb";
const TARGET_HEIGHT = 1.8;

// ==================== Bone finder ====================

interface LimbBones {
  leftUpperLeg: THREE.Object3D | null;
  rightUpperLeg: THREE.Object3D | null;
  leftLowerLeg: THREE.Object3D | null;
  rightLowerLeg: THREE.Object3D | null;
  leftUpperArm: THREE.Object3D | null;
  rightUpperArm: THREE.Object3D | null;
  leftLowerArm: THREE.Object3D | null;
  rightLowerArm: THREE.Object3D | null;
  spine: THREE.Object3D | null;
}

interface OriginalRotations {
  [name: string]: THREE.Euler;
}

function findBone(
  root: THREE.Object3D,
  patterns: string[],
): THREE.Object3D | null {
  let found: THREE.Object3D | null = null;
  root.traverse((child) => {
    if (found) return;
    const name = child.name.toLowerCase();
    for (const pattern of patterns) {
      if (name.includes(pattern)) {
        found = child;
        return;
      }
    }
  });
  return found;
}

function findLimbBones(root: THREE.Object3D): LimbBones {
  return {
    leftUpperLeg: findBone(root, [
      "leftupleg",
      "left_upleg",
      "left_thigh",
      "lefthip",
      "leg.l",
      "thigh.l",
      "upperleg.l",
      "l_thigh",
      "l_upleg",
    ]),
    rightUpperLeg: findBone(root, [
      "rightupleg",
      "right_upleg",
      "right_thigh",
      "righthip",
      "leg.r",
      "thigh.r",
      "upperleg.r",
      "r_thigh",
      "r_upleg",
    ]),
    leftLowerLeg: findBone(root, [
      "leftleg",
      "left_leg",
      "left_shin",
      "leftknee",
      "shin.l",
      "lowerleg.l",
      "calf.l",
      "l_leg",
      "l_shin",
    ]),
    rightLowerLeg: findBone(root, [
      "rightleg",
      "right_leg",
      "right_shin",
      "rightknee",
      "shin.r",
      "lowerleg.r",
      "calf.r",
      "r_leg",
      "r_shin",
    ]),
    leftUpperArm: findBone(root, [
      "leftarm",
      "left_arm",
      "leftshoulder_child",
      "leftupperarm",
      "arm.l",
      "upperarm.l",
      "l_arm",
      "l_upperarm",
    ]),
    rightUpperArm: findBone(root, [
      "rightarm",
      "right_arm",
      "rightshoulder_child",
      "rightupperarm",
      "arm.r",
      "upperarm.r",
      "r_arm",
      "r_upperarm",
    ]),
    leftLowerArm: findBone(root, [
      "leftforearm",
      "left_forearm",
      "leftelbow",
      "forearm.l",
      "lowerarm.l",
      "l_forearm",
    ]),
    rightLowerArm: findBone(root, [
      "rightforearm",
      "right_forearm",
      "rightelbow",
      "forearm.r",
      "lowerarm.r",
      "r_forearm",
    ]),
    spine: findBone(root, ["spine", "spine1", "torso", "chest"]),
  };
}

function saveOriginalRotations(bones: LimbBones): OriginalRotations {
  const originals: OriginalRotations = {};
  for (const [key, bone] of Object.entries(bones)) {
    if (bone) {
      originals[key] = bone.rotation.clone();
    }
  }
  return originals;
}

// ==================== Box fallback ====================

function BoxPerson() {
  return (
    <group>
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[0.5, 0.8, 0.3]} />
        <meshStandardMaterial color="#3B82F6" roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[0, 1.35, 0]} castShadow>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#FBD38D" roughness={0.5} />
      </mesh>
      {[
        [-0.12, 0.2, 0],
        [0.12, 0.2, 0],
      ].map((pos, i) => (
        <mesh key={`leg-${i}`} position={pos as [number, number, number]}>
          <boxGeometry args={[0.15, 0.4, 0.2]} />
          <meshStandardMaterial color="#1E3A5F" roughness={0.7} />
        </mesh>
      ))}
      {[
        [-0.35, 0.75, 0],
        [0.35, 0.75, 0],
      ].map((pos, i) => (
        <mesh key={`arm-${i}`} position={pos as [number, number, number]}>
          <boxGeometry args={[0.12, 0.5, 0.15]} />
          <meshStandardMaterial
            color="#3B82F6"
            roughness={0.6}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

// ==================== Character Visual ====================

interface CharacterData {
  scene: THREE.Group;
  scale: number;
  offset: [number, number, number];
}

function CharacterVisual() {
  const [charData, setCharData] = useState<CharacterData | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionsRef = useRef<Map<string, THREE.AnimationAction>>(new Map());
  const currentAnimRef = useRef<string>("idle");
  const hasGLBAnimsRef = useRef(false);
  const bonesRef = useRef<LimbBones | null>(null);
  const originalRotationsRef = useRef<OriginalRotations>({});
  const bobGroupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    let cancelled = false;

    import("three/examples/jsm/loaders/GLTFLoader.js")
      .then(({ GLTFLoader }: any) => {
        if (cancelled) return;
        const loader = new GLTFLoader();
        loader.load(
          CHARACTER_MODEL_PATH,
          (gltf: any) => {
            if (cancelled) return;
            const scene = gltf.scene as THREE.Group;
            scene.traverse((child: THREE.Object3D) => {
              if ((child as THREE.Mesh).isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });

            const box = new THREE.Box3().setFromObject(scene);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            const scale = TARGET_HEIGHT / size.y;

            // Try GLB built-in animations first
            if (gltf.animations && gltf.animations.length > 0) {
              const mixer = new THREE.AnimationMixer(scene);
              mixerRef.current = mixer;
              hasGLBAnimsRef.current = true;

              const actionMap = new Map<string, THREE.AnimationAction>();
              for (const clip of gltf.animations as THREE.AnimationClip[]) {
                const action = mixer.clipAction(clip);
                actionMap.set(clip.name.toLowerCase(), action);
              }
              actionsRef.current = actionMap;

              const idleAction =
                actionMap.get("idle") ||
                actionMap.get("standing") ||
                actionMap.values().next().value;
              if (idleAction) {
                idleAction.play();
                currentAnimRef.current = "idle";
              }
            }

            // Find skeleton bones for procedural animation
            const bones = findLimbBones(scene);
            bonesRef.current = bones;
            originalRotationsRef.current = saveOriginalRotations(bones);

            // Log found bones for debugging
            const foundBones = Object.entries(bones)
              .filter(([, b]) => b !== null)
              .map(([k, b]) => `${k}: ${b?.name}`);
            if (foundBones.length > 0) {
              console.log("Found character bones:", foundBones);
            }

            setCharData({
              scene,
              scale,
              offset: [-center.x, -box.min.y, -center.z],
            });
          },
          undefined,
          (err: any) => console.error("Failed to load character model:", err),
        );
      })
      .catch((err) => console.error("Failed to import GLTFLoader:", err));

    return () => {
      cancelled = true;
    };
  }, []);

  useFrame((state, delta) => {
    const { controls } = usePlayerStore.getState();
    const isMoving =
      controls.forward || controls.backward || controls.left || controls.right;
    const isSprinting = controls.sprint && isMoving;

    // ---- GLB built-in animations ----
    if (hasGLBAnimsRef.current && mixerRef.current) {
      mixerRef.current.update(delta);

      let targetAnim = "idle";
      if (isMoving) targetAnim = isSprinting ? "run" : "walk";

      if (targetAnim !== currentAnimRef.current) {
        const actions = actionsRef.current;
        const findAction = (
          target: string,
        ): THREE.AnimationAction | undefined => {
          if (actions.has(target)) return actions.get(target);
          const vars: Record<string, string[]> = {
            idle: ["idle", "standing", "tpose", "rest"],
            walk: ["walk", "walking", "locomotion"],
            run: ["run", "running", "sprint", "jog"],
          };
          for (const name of vars[target] || [target]) {
            for (const [key, action] of actions) {
              if (key.includes(name)) return action;
            }
          }
          return undefined;
        };

        const curr = findAction(currentAnimRef.current);
        let next = findAction(targetAnim);
        if (!next && targetAnim !== "idle") {
          for (const [k, a] of actions) {
            if (!k.includes("idle") && !k.includes("tpose")) {
              next = a;
              break;
            }
          }
        }
        if (!next && targetAnim === "idle")
          next = actions.values().next().value;

        if (next) {
          if (curr) curr.fadeOut(0.2);
          next.reset().fadeIn(0.2).play();
          next.timeScale = isSprinting ? 2.0 : 1.0;
        }
        currentAnimRef.current = targetAnim;
      }

      // Dynamic timeScale update
      if (isMoving) {
        for (const [, action] of actionsRef.current) {
          if (action.isRunning()) action.timeScale = isSprinting ? 2.0 : 1.0;
        }
      }
    }

    // ---- Procedural bone animation (always runs if bones found, unless GLB anims exist) ----
    const bones = bonesRef.current;
    const originals = originalRotationsRef.current;

    if (bones && !hasGLBAnimsRef.current) {
      const time = state.clock.elapsedTime;

      if (isMoving) {
        // Walking: freq=7, Running: freq=14
        const freq = isSprinting ? 14 : 7;
        // Walking: leg ±0.5 rad, Running: leg ±0.9 rad
        const legSwing = isSprinting ? 0.9 : 0.5;
        // Walking: arm ±0.3 rad, Running: arm ±0.7 rad
        const armSwing = isSprinting ? 0.7 : 0.3;
        // Knee bend during swing
        const kneeBend = isSprinting ? 1.2 : 0.5;
        // Elbow bend
        const elbowBend = isSprinting ? 0.6 : 0.3;

        const phase = Math.sin(time * freq);
        const absPhase = Math.abs(phase);

        // Upper legs swing forward/backward (X-axis rotation)
        if (bones.leftUpperLeg) {
          const orig = originals.leftUpperLeg;
          bones.leftUpperLeg.rotation.x = (orig?.x ?? 0) + phase * legSwing;
        }
        if (bones.rightUpperLeg) {
          const orig = originals.rightUpperLeg;
          bones.rightUpperLeg.rotation.x = (orig?.x ?? 0) - phase * legSwing;
        }

        // Lower legs (knees) - bend backward when leg is forward
        if (bones.leftLowerLeg) {
          const orig = originals.leftLowerLeg;
          const bend = phase > 0 ? phase * kneeBend : 0;
          bones.leftLowerLeg.rotation.x = (orig?.x ?? 0) + bend;
        }
        if (bones.rightLowerLeg) {
          const orig = originals.rightLowerLeg;
          const bend = -phase > 0 ? -phase * kneeBend : 0;
          bones.rightLowerLeg.rotation.x = (orig?.x ?? 0) + bend;
        }

        // Arms swing opposite to legs (natural gait)
        if (bones.leftUpperArm) {
          const orig = originals.leftUpperArm;
          bones.leftUpperArm.rotation.x = (orig?.x ?? 0) - phase * armSwing;
        }
        if (bones.rightUpperArm) {
          const orig = originals.rightUpperArm;
          bones.rightUpperArm.rotation.x = (orig?.x ?? 0) + phase * armSwing;
        }

        // Forearms bend when arm swings forward
        if (bones.leftLowerArm) {
          const orig = originals.leftLowerArm;
          const bend = -phase > 0 ? elbowBend : elbowBend * 0.3;
          bones.leftLowerArm.rotation.x = (orig?.x ?? 0) - bend;
        }
        if (bones.rightLowerArm) {
          const orig = originals.rightLowerArm;
          const bend = phase > 0 ? elbowBend : elbowBend * 0.3;
          bones.rightLowerArm.rotation.x = (orig?.x ?? 0) - bend;
        }

        // Spine: slight lean forward + subtle twist
        if (bones.spine) {
          const orig = originals.spine;
          const leanForward = isSprinting ? 0.12 : 0.05;
          const twist = phase * (isSprinting ? 0.06 : 0.03);
          bones.spine.rotation.x = (orig?.x ?? 0) + leanForward;
          bones.spine.rotation.y = (orig?.y ?? 0) + twist;
        }

        // Body bob
        if (bobGroupRef.current) {
          const bobAmount = isSprinting ? 0.08 : 0.04;
          bobGroupRef.current.position.y = absPhase * bobAmount;
        }
      } else {
        // Idle: smoothly return to original rotations
        const lerpSpeed = 0.1;
        for (const [key, bone] of Object.entries(bones)) {
          if (bone && originals[key]) {
            bone.rotation.x += (originals[key].x - bone.rotation.x) * lerpSpeed;
            bone.rotation.y += (originals[key].y - bone.rotation.y) * lerpSpeed;
            bone.rotation.z += (originals[key].z - bone.rotation.z) * lerpSpeed;
          }
        }
        if (bobGroupRef.current) {
          bobGroupRef.current.position.y *= 0.9;
        }
      }
    }

    // Fallback if no bones and no GLB animations: whole-body bob
    if (
      !bones?.leftUpperLeg &&
      !hasGLBAnimsRef.current &&
      bobGroupRef.current
    ) {
      const time = state.clock.elapsedTime;
      if (isMoving) {
        const freq = isSprinting ? 14 : 8;
        const bob = isSprinting ? 0.1 : 0.05;
        bobGroupRef.current.position.y = Math.abs(Math.sin(time * freq)) * bob;
        bobGroupRef.current.rotation.x = isSprinting ? 0.15 : 0.06;
        bobGroupRef.current.rotation.z =
          Math.sin(time * freq * 0.5) * (isSprinting ? 0.08 : 0.03);
      } else {
        bobGroupRef.current.position.y *= 0.85;
        bobGroupRef.current.rotation.x *= 0.85;
        bobGroupRef.current.rotation.z *= 0.85;
      }
    }
  });

  if (charData) {
    const { scene, scale, offset } = charData;
    return (
      <group ref={bobGroupRef}>
        <group scale={scale}>
          <primitive object={scene} position={offset} />
        </group>
      </group>
    );
  }

  return <BoxPerson />;
}

// ==================== PersonController ====================

export function PersonController() {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const characterRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (!rigidBodyRef.current) return;

    const rb = rigidBodyRef.current;
    const { controls } = usePlayerStore.getState();
    const translation = rb.translation();
    const linvel = rb.linvel();

    usePlayerStore
      .getState()
      .setPosition([translation.x, translation.y, translation.z]);
    useWorldStore.getState().detectZone(translation.x, translation.z);

    const isGrounded = Math.abs(linvel.y) < 0.5;
    usePlayerStore.getState().setGrounded(isGrounded);
    usePlayerStore.getState().setSprinting(controls.sprint);

    const PLAYER = PHYSICS_CONFIG.player;
    const speed = controls.sprint ? PLAYER.sprintSpeed : PLAYER.walkSpeed;

    // GTA-style camera-relative movement
    const cameraDir = new THREE.Vector3();
    camera.getWorldDirection(cameraDir);
    cameraDir.y = 0;
    cameraDir.normalize();

    const cameraRight = new THREE.Vector3();
    cameraRight.crossVectors(cameraDir, new THREE.Vector3(0, 1, 0)).normalize();

    let moveX = 0;
    let moveZ = 0;
    if (controls.forward) {
      moveX += cameraDir.x;
      moveZ += cameraDir.z;
    }
    if (controls.backward) {
      moveX -= cameraDir.x;
      moveZ -= cameraDir.z;
    }
    if (controls.left) {
      moveX -= cameraRight.x;
      moveZ -= cameraRight.z;
    }
    if (controls.right) {
      moveX += cameraRight.x;
      moveZ += cameraRight.z;
    }

    const moveLen = Math.sqrt(moveX * moveX + moveZ * moveZ);
    if (moveLen > 0) {
      moveX /= moveLen;
      moveZ /= moveLen;
    }

    rb.setLinvel({ x: moveX * speed, y: linvel.y, z: moveZ * speed }, true);

    if (controls.jump && isGrounded) {
      rb.applyImpulse({ x: 0, y: PLAYER.jumpForce * PLAYER.mass, z: 0 }, true);
    }

    // Rotate character to face movement direction
    if (moveLen > 0.1 && characterRef.current) {
      const targetAngle = Math.atan2(moveX, moveZ);
      const currentY = characterRef.current.rotation.y;
      let diff = targetAngle - currentY;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      characterRef.current.rotation.y += diff * 0.15;
    }

    usePlayerStore
      .getState()
      .setRotation(
        new THREE.Euler(0, characterRef.current?.rotation.y ?? 0, 0),
      );

    if (translation.y < -50) {
      rb.setTranslation(
        { x: SPAWN_POSITION[0], y: SPAWN_POSITION[1], z: SPAWN_POSITION[2] },
        true,
      );
      rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }
  });

  return (
    <>
      <PlayerCamera />
      <RigidBody
        ref={rigidBodyRef}
        colliders={false}
        mass={PHYSICS_CONFIG.player.mass}
        type="dynamic"
        position={SPAWN_POSITION}
        enabledRotations={[false, false, false]}
        linearDamping={0.5}
        angularDamping={5}
        ccd
      >
        <CapsuleCollider args={[0.5, 0.35]} position={[0, 0.85, 0]} />
        <group ref={characterRef}>
          <CharacterVisual />
        </group>
      </RigidBody>
    </>
  );
}
