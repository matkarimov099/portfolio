"use client";

import { useRef, useEffect, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePlayerStore } from "../../stores/player.store";

// GTA Vice City style camera
const CAMERA_LERP = 0.15;
const MIN_DISTANCE = 3;
const MAX_DISTANCE = 30;
const DEFAULT_DISTANCE = 8;
const CAMERA_HEIGHT = 2.5;
const ORBIT_SENSITIVITY = 0.0015;
const SCROLL_SENSITIVITY = 1.5;
const MIN_PITCH = 0.05;
const MAX_PITCH = 1.2;
const DEFAULT_PITCH = 0.35;

export function PlayerCamera() {
  const { camera, gl } = useThree();

  const distanceRef = useRef(DEFAULT_DISTANCE);
  const angleRef = useRef(0);
  const pitchRef = useRef(DEFAULT_PITCH);
  const isLockedRef = useRef(false);
  const isFirstFrame = useRef(true);

  const requestLock = useCallback(() => {
    const canvas = gl.domElement;
    if (document.pointerLockElement !== canvas) {
      canvas.requestPointerLock();
    }
  }, [gl.domElement]);

  useEffect(() => {
    const canvas = gl.domElement;

    const handleClick = () => {
      requestLock();
    };

    const handleLockChange = () => {
      isLockedRef.current = document.pointerLockElement === canvas;
    };

    // Mouse orbit - ONLY way to change camera angle (GTA style)
    const handleMouseMove = (event: MouseEvent) => {
      if (!isLockedRef.current) return;
      angleRef.current -= event.movementX * ORBIT_SENSITIVITY;
      pitchRef.current = Math.max(
        MIN_PITCH,
        Math.min(
          MAX_PITCH,
          pitchRef.current + event.movementY * ORBIT_SENSITIVITY,
        ),
      );
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const delta = event.deltaY > 0 ? SCROLL_SENSITIVITY : -SCROLL_SENSITIVITY;
      distanceRef.current = Math.max(
        MIN_DISTANCE,
        Math.min(MAX_DISTANCE, distanceRef.current + delta),
      );
    };

    const handleContextMenu = (event: Event) => {
      event.preventDefault();
    };

    canvas.addEventListener("click", handleClick);
    document.addEventListener("pointerlockchange", handleLockChange);
    document.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("contextmenu", handleContextMenu);

    return () => {
      canvas.removeEventListener("click", handleClick);
      document.removeEventListener("pointerlockchange", handleLockChange);
      document.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("contextmenu", handleContextMenu);
      if (document.pointerLockElement === canvas) {
        document.exitPointerLock();
      }
    };
  }, [gl.domElement, requestLock]);

  useFrame(() => {
    const { position: playerPos } = usePlayerStore.getState();
    const distance = distanceRef.current;
    const pitch = pitchRef.current;
    const angle = angleRef.current;

    // Camera angle is controlled ONLY by mouse - no auto-chase!
    // Spherical coordinates around the player
    const horizontalDist = distance * Math.cos(pitch);
    const verticalDist = distance * Math.sin(pitch);

    const cameraTarget = new THREE.Vector3(
      playerPos.x + Math.sin(angle) * horizontalDist,
      playerPos.y + verticalDist + CAMERA_HEIGHT,
      playerPos.z + Math.cos(angle) * horizontalDist,
    );

    // First frame: snap; after that: smooth lerp
    if (isFirstFrame.current) {
      camera.position.copy(cameraTarget);
      isFirstFrame.current = false;
    } else {
      camera.position.lerp(cameraTarget, CAMERA_LERP);
    }

    // Always look at the player
    camera.lookAt(playerPos.x, playerPos.y + 1.2, playerPos.z);
  });

  return null;
}
