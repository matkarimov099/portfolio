"use client";

import { useEffect, useCallback } from "react";
import { usePlayerStore } from "../stores/player.store";
import { useWorldStore } from "../stores/world.store";
import { useMapStore } from "../stores/map.store";

export function usePlayerControls() {
  const setControls = usePlayerStore((state) => state.setControls);
  const resetControls = usePlayerStore((state) => state.resetControls);
  const isPaused = useWorldStore((state) => state.isPaused);
  const activeMiniGame = useWorldStore((state) => state.activeMiniGame);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Toggle full-screen map (works even when paused)
      if (event.code === "KeyM") {
        event.preventDefault();
        useMapStore.getState().toggleFullScreenMap();
        return;
      }

      // Don't process movement controls when paused or in mini-game
      if (isPaused || activeMiniGame) return;

      // Prevent default for game controls
      if (
        ["KeyW", "KeyA", "KeyS", "KeyD", "Space", "ShiftLeft", "KeyE"].includes(
          event.code,
        )
      ) {
        event.preventDefault();
      }

      switch (event.code) {
        case "KeyW":
        case "ArrowUp":
          setControls({ forward: true });
          break;
        case "KeyS":
        case "ArrowDown":
          setControls({ backward: true });
          break;
        case "KeyA":
        case "ArrowLeft":
          setControls({ left: true });
          break;
        case "KeyD":
        case "ArrowRight":
          setControls({ right: true });
          break;
        case "Space":
          setControls({ jump: true });
          break;
        case "ShiftLeft":
        case "ShiftRight":
          setControls({ sprint: true });
          break;
        case "KeyE":
        case "KeyF":
          setControls({ interact: true });
          break;
      }
    },
    [setControls, isPaused, activeMiniGame],
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyW":
        case "ArrowUp":
          setControls({ forward: false });
          break;
        case "KeyS":
        case "ArrowDown":
          setControls({ backward: false });
          break;
        case "KeyA":
        case "ArrowLeft":
          setControls({ left: false });
          break;
        case "KeyD":
        case "ArrowRight":
          setControls({ right: false });
          break;
        case "Space":
          setControls({ jump: false });
          break;
        case "ShiftLeft":
        case "ShiftRight":
          setControls({ sprint: false });
          break;
        case "KeyE":
        case "KeyF":
          setControls({ interact: false });
          break;
      }
    },
    [setControls],
  );

  // Handle window blur - reset all controls
  const handleBlur = useCallback(() => {
    resetControls();
  }, [resetControls]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [handleKeyDown, handleKeyUp, handleBlur]);

  // Reset controls when pausing
  useEffect(() => {
    if (isPaused) {
      resetControls();
    }
  }, [isPaused, resetControls]);

  return null;
}
