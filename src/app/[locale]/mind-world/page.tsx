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
      (mod) => mod.MindWorldCanvas
    ),
  {
    ssr: false,
    loading: () => <LoadingScreen />,
  }
);

export default function MindWorldPage() {
  const togglePause = useWorldStore((state) => state.togglePause);
  const isPaused = useWorldStore((state) => state.isPaused);
  const setShowInstructions = useWorldStore((state) => state.setShowInstructions);

  // Handle ESC key for pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        togglePause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePause]);

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
    <main className="relative h-screen w-screen overflow-hidden bg-[#0a0a1a]">
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

      {/* Cursor lock hint */}
      <div
        className={`pointer-events-none fixed inset-0 z-30 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
          isPaused ? "opacity-0" : "opacity-0"
        }`}
      >
        <p className="rounded-lg bg-black/70 px-6 py-3 text-white">
          Click to start
        </p>
      </div>
    </main>
  );
}
