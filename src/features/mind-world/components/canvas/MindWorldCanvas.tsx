"use client";

import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { EffectComposer, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

import { PhysicsWorld } from "./PhysicsWorld";
import { PersonController } from "../player/PersonController";
import { CityMap } from "../zones/CityMap";
import { useWorldStore } from "../../stores/world.store";
import { usePlayerControls } from "../../hooks/use-player-controls";

function Scene() {
  const isPaused = useWorldStore((state) => state.isPaused);
  usePlayerControls();

  return (
    <PhysicsWorld paused={isPaused}>
      <PersonController />
      <CityMap />
    </PhysicsWorld>
  );
}

function PostProcessing() {
  return (
    <EffectComposer>
      <Vignette
        offset={0.5}
        darkness={0.3}
        eskil={false}
        blendFunction={BlendFunction.NORMAL}
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
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setLoadingProgress(progress, `Loading city... ${progress}%`);
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
        far: 2000,
        position: [0, 10, 15],
      }}
      shadows
      dpr={[1, 2]}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.2;
      }}
    >
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />

      {/* Daytime lighting */}
      <ambientLight intensity={0.3} color="#ffffff" />
      <hemisphereLight args={["#87CEEB", "#4a7c59", 0.6]} />
      <directionalLight
        position={[30, 50, 20]}
        intensity={1.5}
        color="#FFF8E1"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-200}
        shadow-camera-right={200}
        shadow-camera-top={200}
        shadow-camera-bottom={-200}
        shadow-camera-near={0.1}
        shadow-camera-far={500}
      />

      {/* Soft distance fog */}
      <fog attach="fog" args={["#B8D4E8", 150, 500]} />

      {/* Sky blue background */}
      <color attach="background" args={["#87CEEB"]} />

      <Suspense fallback={null}>
        <Scene />
        <PostProcessing />
      </Suspense>
    </Canvas>
  );
}
