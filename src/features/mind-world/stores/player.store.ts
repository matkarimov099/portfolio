import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import * as THREE from "three";
import type { ZoneId, PlayerControls } from "../types";

interface PlayerStore {
  // Position and movement
  position: THREE.Vector3;
  rotation: THREE.Euler;
  velocity: THREE.Vector3;

  // State
  isGrounded: boolean;
  isSprinting: boolean;
  isJumping: boolean;
  currentZone: ZoneId;

  // Controls
  controls: PlayerControls;

  // Movement settings
  walkSpeed: number;
  sprintSpeed: number;
  jumpForce: number;

  // Actions
  setPosition: (position: THREE.Vector3 | [number, number, number]) => void;
  setRotation: (rotation: THREE.Euler | [number, number, number]) => void;
  setVelocity: (velocity: THREE.Vector3 | [number, number, number]) => void;
  setGrounded: (isGrounded: boolean) => void;
  setSprinting: (isSprinting: boolean) => void;
  setJumping: (isJumping: boolean) => void;
  setCurrentZone: (zone: ZoneId) => void;
  setControls: (controls: Partial<PlayerControls>) => void;
  resetControls: () => void;
  teleportTo: (position: [number, number, number], zone?: ZoneId) => void;

  // Computed
  getSpeed: () => number;
}

const DEFAULT_CONTROLS: PlayerControls = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  jump: false,
  sprint: false,
  interact: false,
};

export const usePlayerStore = create<PlayerStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    position: new THREE.Vector3(0, 2, 10),
    rotation: new THREE.Euler(0, 0, 0),
    velocity: new THREE.Vector3(0, 0, 0),

    isGrounded: false,
    isSprinting: false,
    isJumping: false,
    currentZone: "synapse-hub",

    controls: { ...DEFAULT_CONTROLS },

    walkSpeed: 5,
    sprintSpeed: 8,
    jumpForce: 5,

    // Actions
    setPosition: (position) => {
      const vec =
        position instanceof THREE.Vector3
          ? position
          : new THREE.Vector3(...position);
      set({ position: vec });
    },

    setRotation: (rotation) => {
      const euler =
        rotation instanceof THREE.Euler
          ? rotation
          : new THREE.Euler(...rotation);
      set({ rotation: euler });
    },

    setVelocity: (velocity) => {
      const vec =
        velocity instanceof THREE.Vector3
          ? velocity
          : new THREE.Vector3(...velocity);
      set({ velocity: vec });
    },

    setGrounded: (isGrounded) => set({ isGrounded }),
    setSprinting: (isSprinting) => set({ isSprinting }),
    setJumping: (isJumping) => set({ isJumping }),
    setCurrentZone: (zone) => set({ currentZone: zone }),

    setControls: (controls) =>
      set((state) => ({
        controls: { ...state.controls, ...controls },
      })),

    resetControls: () => set({ controls: { ...DEFAULT_CONTROLS } }),

    teleportTo: (position, zone) => {
      set({
        position: new THREE.Vector3(...position),
        velocity: new THREE.Vector3(0, 0, 0),
        ...(zone && { currentZone: zone }),
      });
    },

    // Computed
    getSpeed: () => {
      const { isSprinting, walkSpeed, sprintSpeed } = get();
      return isSprinting ? sprintSpeed : walkSpeed;
    },
  }))
);
