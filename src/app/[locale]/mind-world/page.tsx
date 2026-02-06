"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import {
  LoadingScreen,
  HUD,
  MusicPlayer,
  SkillInventory,
  AchievementPopup,
  PauseMenu,
  MobileControls,
} from "@/features/mind-world";
import { TypingChallenge } from "@/features/mind-world/components/mini-games/TypingChallenge";
import { MemoryMatch } from "@/features/mind-world/components/mini-games/MemoryMatch";
import { CodePuzzle } from "@/features/mind-world/components/mini-games/CodePuzzle";
import { BugCatcher } from "@/features/mind-world/components/mini-games/BugCatcher";
import { useWorldStore } from "@/features/mind-world/stores/world.store";

// Dynamic import for canvas to avoid SSR issues
const MindWorldCanvas = dynamic(
  () =>
    import("@/features/mind-world/components/canvas/MindWorldCanvas").then(
      (mod) => mod.MindWorldCanvas,
    ),
  {
    ssr: false,
    loading: () => <LoadingScreen />,
  },
);

export default function MindWorldPage() {
  const setPaused = useWorldStore((state) => state.setPaused);
  const isPaused = useWorldStore((state) => state.isPaused);

  // Handle pointer lock changes: lock = unpause, unlock = pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape" && !document.pointerLockElement) {
        setPaused(!useWorldStore.getState().isPaused);
      }
    };

    const handleLockChange = () => {
      if (document.pointerLockElement) {
        // Pointer lock acquired → unpause (start exploring!)
        setPaused(false);
      } else {
        // Pointer lock lost → pause
        setPaused(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerlockchange", handleLockChange);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerlockchange", handleLockChange);
    };
  }, [setPaused]);

  // Reset session on mount (client-side only)
  useEffect(() => {
    // Only run on client to avoid hydration mismatch
    if (typeof window !== "undefined") {
      useWorldStore.setState({
        sessionStartTime: Date.now(),
        isLoaded: false,
        loadingProgress: 0,
      });
    }
  }, []);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#87CEEB]">
      {/* 3D Canvas */}
      <MindWorldCanvas className="h-full w-full" />

      {/* UI Overlays */}
      <LoadingScreen />
      <HUD />
      <MusicPlayer />
      <SkillInventory />
      <AchievementPopup />
      <PauseMenu />
      <MobileControls />

      {/* Mini-games */}
      <TypingChallenge />
      <MemoryMatch />
      <CodePuzzle />
      <BugCatcher />

      {/* Click to start hint (shown when paused / no pointer lock) */}
      {isPaused && (
        <div className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center bg-black/30">
          <p className="rounded-xl bg-black/70 px-8 py-4 text-lg font-medium text-white shadow-lg">
            Click to explore
          </p>
        </div>
      )}
    </main>
  );
}
