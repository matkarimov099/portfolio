import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import * as THREE from "three";
import type { ZoneId, PlayerControls } from "../types";

interface PlayerStore {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  velocity: THREE.Vector3;
  isGrounded: boolean;
  isSprinting: boolean;
  currentZone: ZoneId;
  controls: PlayerControls;

  setPosition: (position: THREE.Vector3 | [number, number, number]) => void;
  setRotation: (rotation: THREE.Euler | [number, number, number]) => void;
  setVelocity: (velocity: THREE.Vector3 | [number, number, number]) => void;
  setGrounded: (isGrounded: boolean) => void;
  setSprinting: (isSprinting: boolean) => void;
  setCurrentZone: (zone: ZoneId) => void;
  setControls: (controls: Partial<PlayerControls>) => void;
  resetControls: () => void;
  teleportTo: (position: [number, number, number], zone?: ZoneId) => void;
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
  subscribeWithSelector((set, _get) => ({
    position: new THREE.Vector3(0, 2, 10),
    rotation: new THREE.Euler(0, 0, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    isGrounded: false,
    isSprinting: false,
    currentZone: "neon-plaza",
    controls: { ...DEFAULT_CONTROLS },

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
  })),
);
