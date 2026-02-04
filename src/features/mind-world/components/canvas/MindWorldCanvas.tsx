"use client";

import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

import { PhysicsWorld } from "./PhysicsWorld";
import { PlayerController } from "../player/PlayerController";
import { SynapseHub } from "../zones/SynapseHub";
import { MemoryLane } from "../zones/MemoryLane";
import { SkillConstellation } from "../zones/SkillConstellation";
import { ProjectGallery } from "../zones/ProjectGallery";
import { ConnectionPort } from "../zones/ConnectionPort";
import { ChatNeuron } from "../zones/ChatNeuron";
import { StatsObservatory } from "../zones/StatsObservatory";
import { useWorldStore } from "../../stores/world.store";
import { usePlayerControls } from "../../hooks/use-player-controls";

function Scene() {
  const currentZone = useWorldStore((state) => state.currentZone);
  const isPaused = useWorldStore((state) => state.isPaused);

  // Initialize keyboard controls
  usePlayerControls();

  return (
    <PhysicsWorld paused={isPaused}>
      {/* Player */}
      <PlayerController />

      {/* Zones - render based on current zone for performance */}
      {currentZone === "synapse-hub" && <SynapseHub />}
      {currentZone === "memory-lane" && <MemoryLane />}
      {currentZone === "skill-constellation" && <SkillConstellation />}
      {currentZone === "project-gallery" && <ProjectGallery />}
      {currentZone === "connection-port" && <ConnectionPort />}
      {currentZone === "chat-neuron" && <ChatNeuron />}
      {currentZone === "stats-observatory" && <StatsObservatory />}
    </PhysicsWorld>
  );
}

function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom
        intensity={0.5}
        luminanceThreshold={0.8}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <Vignette
        offset={0.3}
        darkness={0.5}
        eskil={false}
        blendFunction={BlendFunction.NORMAL}
      />
      <ChromaticAberration
        offset={new THREE.Vector2(0.0005, 0.0005)}
        blendFunction={BlendFunction.NORMAL}
        radialModulation={false}
        modulationOffset={0}
      />
    </EffectComposer>
  );
}

interface MindWorldCanvasProps {
  className?: string;
}

export function MindWorldCanvas({ className }: MindWorldCanvasProps) {
  const setLoaded = useWorldStore((state) => state.setLoaded);
  const setLoadingProgress = useWorldStore((state) => state.setLoadingProgress);

  useEffect(() => {
    // Simulate loading progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setLoadingProgress(progress, `Loading assets... ${progress}%`);
      if (progress >= 100) {
        clearInterval(interval);
        setLoaded(true);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [setLoaded, setLoadingProgress]);

  return (
    <Canvas
      className={className}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        alpha: false,
      }}
      camera={{
        fov: 75,
        near: 0.1,
        far: 1000,
        position: [0, 2, 10],
      }}
      shadows
      dpr={[1, 2]}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1;
      }}
    >
      {/* Adaptive performance */}
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />

      {/* Base lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={0.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      {/* Fog for atmosphere */}
      <fog attach="fog" args={["#0a0a1a", 30, 100]} />

      {/* Background */}
      <color attach="background" args={["#0a0a1a"]} />

      <Suspense fallback={null}>
        <Scene />
        <PostProcessing />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
