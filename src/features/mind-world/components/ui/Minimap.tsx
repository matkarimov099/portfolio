"use client";

import { useRef, useEffect, useCallback } from "react";
import { usePlayerStore } from "../../stores/player.store";
import { useMapStore } from "../../stores/map.store";
import { useWorldStore } from "../../stores/world.store";
import { GRID_ROADS } from "../../constants/road-grid";
import { CITY_ZONES } from "../../constants/city-layout";
import { LANDMARKS } from "../../constants/landmarks";
import { DISTRICTS } from "../../constants/districts";

const MINIMAP_SIZE = 180;
const MINIMAP_RADIUS = MINIMAP_SIZE / 2;
const VIEW_RADIUS = 250;
const SCALE = MINIMAP_SIZE / (VIEW_RADIUS * 2);

const ZONE_LABEL_MAP: Record<string, string> = {
  "neon-plaza": "PLZ",
  "code-district": "COD",
  "project-tower": "PRJ",
  "data-bridge": "DAT",
  "chat-hq": "CHT",
  "comm-terminal": "COM",
  "memory-street": "MEM",
};

const LANDMARK_COLORS: Record<string, string> = {
  "eiffel-tower": "#A0A0A0",
  "big-ben": "#C8BFA9",
  "empire-state": "#999999",
  "burj-al-arab": "#F0F0F0",
  colosseum: "#C8BFA9",
  "tokyo-tower": "#CC3333",
};

export function Minimap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isVisible = useMapStore((s) => s.isMinimapVisible);
  const rafRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { position, rotation } = usePlayerStore.getState();
    const px = position.x;
    const pz = position.z;
    const playerAngle = rotation.y;

    // Clear
    ctx.clearRect(0, 0, MINIMAP_SIZE, MINIMAP_SIZE);

    // Circular clip
    ctx.save();
    ctx.beginPath();
    ctx.arc(MINIMAP_RADIUS, MINIMAP_RADIUS, MINIMAP_RADIUS - 1, 0, Math.PI * 2);
    ctx.clip();

    // Background
    ctx.fillStyle = "rgba(20, 25, 30, 0.85)";
    ctx.fillRect(0, 0, MINIMAP_SIZE, MINIMAP_SIZE);

    // Helper: world coordinate to canvas coordinate (player-centered)
    const toCanvas = (wx: number, wz: number): [number, number] => {
      return [
        MINIMAP_RADIUS + (wx - px) * SCALE,
        MINIMAP_RADIUS + (wz - pz) * SCALE,
      ];
    };

    // Draw districts (subtle colored areas)
    for (const d of DISTRICTS) {
      const [x1, z1] = toCanvas(d.bounds.x[0], d.bounds.z[0]);
      const [x2, z2] = toCanvas(d.bounds.x[1], d.bounds.z[1]);
      ctx.fillStyle = `${d.groundColor}30`;
      ctx.fillRect(x1, z1, x2 - x1, z2 - z1);
    }

    // Draw roads
    for (const road of GRID_ROADS) {
      const lineWidth = road.type === "boulevard" ? 2 : 1;
      ctx.strokeStyle = road.type === "boulevard" ? "#555555" : "#3a3a3a";
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

    // Draw portfolio zones as colored dots with labels
    for (const zone of CITY_ZONES) {
      const [cx, cz] = toCanvas(zone.position[0], zone.position[2]);

      // Glow effect
      ctx.shadowColor = zone.color;
      ctx.shadowBlur = 6;
      ctx.fillStyle = zone.color;
      ctx.beginPath();
      ctx.arc(cx, cz, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Label
      ctx.fillStyle = "#ffffffcc";
      ctx.font = "bold 7px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(
        ZONE_LABEL_MAP[zone.id] || zone.id.slice(0, 3).toUpperCase(),
        cx,
        cz + 11,
      );
    }

    // Draw landmarks as triangles
    for (const lm of LANDMARKS) {
      const [cx, cz] = toCanvas(lm.position[0], lm.position[2]);
      ctx.fillStyle = LANDMARK_COLORS[lm.id] || "#ffffff";
      ctx.beginPath();
      ctx.moveTo(cx, cz - 5);
      ctx.lineTo(cx - 3.5, cz + 2.5);
      ctx.lineTo(cx + 3.5, cz + 2.5);
      ctx.closePath();
      ctx.fill();
    }

    // Player dot (always at center)
    ctx.fillStyle = "#4CAF50";
    ctx.shadowColor = "#4CAF50";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(MINIMAP_RADIUS, MINIMAP_RADIUS, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // White outline around player dot
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(MINIMAP_RADIUS, MINIMAP_RADIUS, 4.5, 0, Math.PI * 2);
    ctx.stroke();

    // Player direction indicator (triangle pointing in camera direction)
    const dirLen = 12;
    const dirAngle = -playerAngle; // negate for canvas coordinate system
    const tipX = MINIMAP_RADIUS + Math.sin(dirAngle) * dirLen;
    const tipZ = MINIMAP_RADIUS - Math.cos(dirAngle) * dirLen;
    const baseOffset = 4;
    const leftX = MINIMAP_RADIUS + Math.sin(dirAngle - 2.5) * baseOffset;
    const leftZ = MINIMAP_RADIUS - Math.cos(dirAngle - 2.5) * baseOffset;
    const rightX = MINIMAP_RADIUS + Math.sin(dirAngle + 2.5) * baseOffset;
    const rightZ = MINIMAP_RADIUS - Math.cos(dirAngle + 2.5) * baseOffset;

    ctx.fillStyle = "#4CAF50";
    ctx.beginPath();
    ctx.moveTo(tipX, tipZ);
    ctx.lineTo(leftX, leftZ);
    ctx.lineTo(rightX, rightZ);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // Border ring (outside clip)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(MINIMAP_RADIUS, MINIMAP_RADIUS, MINIMAP_RADIUS - 1, 0, Math.PI * 2);
    ctx.stroke();

    // Inner glow ring
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(MINIMAP_RADIUS, MINIMAP_RADIUS, MINIMAP_RADIUS - 4, 0, Math.PI * 2);
    ctx.stroke();

    // North indicator
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("N", MINIMAP_RADIUS, 4);

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isVisible, draw]);

  if (!isVisible) return null;

  const currentZone = useWorldStore.getState().currentZone;
  const zoneName = currentZone?.replace(/-/g, " ").toUpperCase() || "EXPLORING";

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-50">
      <canvas
        ref={canvasRef}
        width={MINIMAP_SIZE}
        height={MINIMAP_SIZE}
        className="rounded-full shadow-lg"
        style={{ width: MINIMAP_SIZE, height: MINIMAP_SIZE }}
      />
      <div className="mt-1 text-center">
        <span className="rounded-md bg-black/60 px-2 py-0.5 text-xs font-medium tracking-wide text-white">
          {zoneName}
        </span>
      </div>
    </div>
  );
}
