"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconX } from "@tabler/icons-react";
import { useMapStore } from "../../stores/map.store";
import { usePlayerStore } from "../../stores/player.store";
import { GRID_ROADS } from "../../constants/road-grid";
import { CITY_ZONES } from "../../constants/city-layout";
import { LANDMARKS } from "../../constants/landmarks";
import { DISTRICTS } from "../../constants/districts";
import { ZONES } from "../../constants/zones";

const MAP_SIZE = 600;
const WORLD_SIZE = 800;
const SCALE = MAP_SIZE / WORLD_SIZE;
const MAP_CENTER = MAP_SIZE / 2;

// Convert world coordinates [-400, 400] to canvas [0, MAP_SIZE]
function toCanvas(wx: number, wz: number): [number, number] {
  return [MAP_CENTER + wx * SCALE, MAP_CENTER + wz * SCALE];
}

// Zone name lookup from ZONES constant
const ZONE_NAMES = new Map(ZONES.map((z) => [z.id, z.name]));

const LANDMARK_COLORS: Record<string, string> = {
  "eiffel-tower": "#A0A0A0",
  "big-ben": "#C8BFA9",
  "empire-state": "#999999",
  "burj-al-arab": "#F0F0F0",
  colosseum: "#C8BFA9",
  "tokyo-tower": "#CC3333",
};

export function FullScreenMap() {
  const isOpen = useMapStore((s) => s.isFullScreenMapOpen);
  const toggleMap = useMapStore((s) => s.toggleFullScreenMap);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { position } = usePlayerStore.getState();
    const px = position.x;
    const pz = position.z;

    // Clear
    ctx.clearRect(0, 0, MAP_SIZE, MAP_SIZE);

    // Background
    ctx.fillStyle = "rgba(15, 20, 25, 0.95)";
    ctx.fillRect(0, 0, MAP_SIZE, MAP_SIZE);

    // Draw districts (colored regions)
    for (const d of DISTRICTS) {
      const [x1, z1] = toCanvas(d.bounds.x[0], d.bounds.z[0]);
      const [x2, z2] = toCanvas(d.bounds.x[1], d.bounds.z[1]);
      const w = x2 - x1;
      const h = z2 - z1;

      // District fill
      ctx.fillStyle = `${d.groundColor}25`;
      ctx.fillRect(x1, z1, w, h);

      // District border
      ctx.strokeStyle = `${d.groundColor}40`;
      ctx.lineWidth = 1;
      ctx.strokeRect(x1, z1, w, h);

      // District name (large faded text in center)
      const centerX = x1 + w / 2;
      const centerZ = z1 + h / 2;
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(d.name.toUpperCase(), centerX, centerZ);
    }

    // Draw roads
    for (const road of GRID_ROADS) {
      const lineWidth = road.type === "boulevard" ? 2 : 0.8;
      ctx.strokeStyle = road.type === "boulevard" ? "#555555" : "#333333";
      ctx.lineWidth = lineWidth;

      const startX = road.axis === "x" ? road.start : road.position;
      const startZ = road.axis === "x" ? road.position : road.start;
      const endX = road.axis === "x" ? road.end : road.position;
      const endZ = road.axis === "x" ? road.position : road.end;

      const [cx1, cz1] = toCanvas(startX, startZ);
      const [cx2, cz2] = toCanvas(endX, endZ);

      ctx.beginPath();
      ctx.moveTo(cx1, cz1);
      ctx.lineTo(cx2, cz2);
      ctx.stroke();
    }

    // Draw portfolio zones as colored dots with full labels
    for (const zone of CITY_ZONES) {
      const [cx, cz] = toCanvas(zone.position[0], zone.position[2]);

      // Glow
      ctx.shadowColor = zone.color;
      ctx.shadowBlur = 10;

      // Outer ring
      ctx.strokeStyle = zone.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cz, 8, 0, Math.PI * 2);
      ctx.stroke();

      // Inner dot
      ctx.fillStyle = zone.color;
      ctx.beginPath();
      ctx.arc(cx, cz, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;

      // Zone name label
      const name = ZONE_NAMES.get(zone.id) || zone.id;
      ctx.fillStyle = "#ffffffdd";
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(name, cx, cz + 13);
    }

    // Draw landmarks as triangles with labels
    for (const lm of LANDMARKS) {
      const [cx, cz] = toCanvas(lm.position[0], lm.position[2]);
      const color = LANDMARK_COLORS[lm.id] || "#ffffff";

      // Triangle marker
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx, cz - 7);
      ctx.lineTo(cx - 5, cz + 4);
      ctx.lineTo(cx + 5, cz + 4);
      ctx.closePath();
      ctx.fill();

      // Outline
      ctx.strokeStyle = "#ffffff40";
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Label
      ctx.fillStyle = "#ffffffaa";
      ctx.font = "9px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(lm.name, cx, cz + 8);
    }

    // Player position marker
    const [playerCX, playerCZ] = toCanvas(px, pz);

    // Pulsing outer ring
    const pulse = Math.sin(Date.now() / 300) * 0.3 + 0.7;
    ctx.strokeStyle = `rgba(76, 175, 80, ${pulse})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(playerCX, playerCZ, 10, 0, Math.PI * 2);
    ctx.stroke();

    // Player dot
    ctx.fillStyle = "#4CAF50";
    ctx.shadowColor = "#4CAF50";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(playerCX, playerCZ, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // White outline
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(playerCX, playerCZ, 5, 0, Math.PI * 2);
    ctx.stroke();

    // "YOU" label
    ctx.fillStyle = "#4CAF50";
    ctx.font = "bold 9px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("YOU", playerCX, playerCZ + 14);

    // Map border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, MAP_SIZE, MAP_SIZE);

    // Compass indicators
    ctx.fillStyle = "#ffffff88";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("N", MAP_CENTER, 6);
    ctx.textBaseline = "bottom";
    ctx.fillText("S", MAP_CENTER, MAP_SIZE - 6);
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillText("W", 6, MAP_CENTER);
    ctx.textAlign = "right";
    ctx.fillText("E", MAP_SIZE - 6, MAP_CENTER);

    // Coordinate labels at corners
    ctx.fillStyle = "#ffffff33";
    ctx.font = "9px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("-400, -400", 4, 4);
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText("400, 400", MAP_SIZE - 4, MAP_SIZE - 4);

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  // Close on Escape or M key
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Escape" || e.code === "KeyM") {
        e.preventDefault();
        toggleMap();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, toggleMap]);

  // Animation loop
  useEffect(() => {
    if (!isOpen) return;
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isOpen, draw]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="pointer-events-auto fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Map container */}
          <motion.div
            className="relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Title */}
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-wider text-white/90">
                CITY MAP
              </h2>
              <button
                onClick={toggleMap}
                className="rounded-lg bg-white/10 p-1.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
              >
                <IconX size={18} />
              </button>
            </div>

            {/* Canvas */}
            <canvas
              ref={canvasRef}
              width={MAP_SIZE}
              height={MAP_SIZE}
              className="rounded-xl border border-white/10 shadow-2xl"
              style={{ width: MAP_SIZE, height: MAP_SIZE }}
            />

            {/* Legend */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-white/60">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                <span>You</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                <span>Zones</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className="h-0 w-0"
                  style={{
                    borderLeft: "4px solid transparent",
                    borderRight: "4px solid transparent",
                    borderBottom: "6px solid #A0A0A0",
                  }}
                />
                <span>Landmarks</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-0.5 w-4 bg-gray-400" />
                <span>Roads</span>
              </div>
              <div className="ml-auto text-white/40">
                Press{" "}
                <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono">
                  M
                </kbd>{" "}
                or{" "}
                <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono">
                  ESC
                </kbd>{" "}
                to close
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
