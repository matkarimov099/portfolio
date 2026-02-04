"use client";

import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePlayerStore } from "../../stores/player.store";

const MOUSE_SENSITIVITY = 0.002;
const MAX_PITCH = Math.PI / 2 - 0.1;

export function PlayerCamera() {
  const { camera, gl } = useThree();
  const isLockedRef = useRef(false);
  const euler = useRef(new THREE.Euler(0, 0, 0, "YXZ"));

  const setRotation = usePlayerStore((state) => state.setRotation);

  useEffect(() => {
    const canvas = gl.domElement;

    const handleClick = () => {
      if (!isLockedRef.current) {
        canvas.requestPointerLock();
      }
    };

    const handlePointerLockChange = () => {
      isLockedRef.current = document.pointerLockElement === canvas;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isLockedRef.current) return;

      const { movementX, movementY } = event;

      euler.current.y -= movementX * MOUSE_SENSITIVITY;
      euler.current.x -= movementY * MOUSE_SENSITIVITY;
      euler.current.x = Math.max(
        -MAX_PITCH,
        Math.min(MAX_PITCH, euler.current.x)
      );

      camera.quaternion.setFromEuler(euler.current);
      setRotation(euler.current);
    };

    canvas.addEventListener("click", handleClick);
    document.addEventListener("pointerlockchange", handlePointerLockChange);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      canvas.removeEventListener("click", handleClick);
      document.removeEventListener("pointerlockchange", handlePointerLockChange);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [camera, gl.domElement, setRotation]);

  return null;
}
