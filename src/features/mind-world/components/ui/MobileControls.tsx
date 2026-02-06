"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { usePlayerStore } from "../../stores/player.store";
import { useWorldStore } from "../../stores/world.store";

export function MobileControls() {
  const [isMobile, setIsMobile] = useState(false);
  const joystickRef = useRef<HTMLDivElement>(null);
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const setControls = usePlayerStore((state) => state.setControls);
  const _resetControls = usePlayerStore((state) => state.resetControls);
  const togglePause = useWorldStore((state) => state.togglePause);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        "ontouchstart" in window ||
          navigator.maxTouchPoints > 0 ||
          window.innerWidth < 768,
      );
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleJoystickStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
    },
    [],
  );

  const handleJoystickMove = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!isDragging || !joystickRef.current) return;

      const rect = joystickRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      let clientX: number;
      let clientY: number;

      if ("touches" in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const maxDistance = rect.width / 2 - 20;
      let deltaX = clientX - centerX;
      let deltaY = clientY - centerY;

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (distance > maxDistance) {
        deltaX = (deltaX / distance) * maxDistance;
        deltaY = (deltaY / distance) * maxDistance;
      }

      setJoystickPosition({ x: deltaX, y: deltaY });

      // Convert to movement
      const threshold = maxDistance * 0.3;
      setControls({
        forward: deltaY < -threshold,
        backward: deltaY > threshold,
        left: deltaX < -threshold,
        right: deltaX > threshold,
      });
    },
    [isDragging, setControls],
  );

  const handleJoystickEnd = useCallback(() => {
    setIsDragging(false);
    setJoystickPosition({ x: 0, y: 0 });
    setControls({
      forward: false,
      backward: false,
      left: false,
      right: false,
    });
  }, [setControls]);

  const handleJump = useCallback(() => {
    setControls({ jump: true });
    setTimeout(() => setControls({ jump: false }), 100);
  }, [setControls]);

  const handleInteract = useCallback(() => {
    setControls({ interact: true });
    setTimeout(() => setControls({ interact: false }), 100);
  }, [setControls]);

  if (!isMobile) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      {/* Joystick */}
      <div
        ref={joystickRef}
        className="pointer-events-auto absolute bottom-24 left-8 h-32 w-32 rounded-full border-2 border-white/20 bg-black/30"
        onTouchStart={handleJoystickStart}
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
        onMouseDown={handleJoystickStart}
        onMouseMove={handleJoystickMove}
        onMouseUp={handleJoystickEnd}
        onMouseLeave={handleJoystickEnd}
      >
        <motion.div
          className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30"
          animate={{
            x: joystickPosition.x,
            y: joystickPosition.y,
          }}
          transition={{ type: "spring", damping: 20 }}
        />
      </div>

      {/* Action buttons */}
      <div className="pointer-events-auto absolute bottom-24 right-8 flex flex-col gap-3">
        <button
          onTouchStart={handleJump}
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/20 bg-red-500/30 text-white active:bg-red-500/50"
        >
          <span className="text-sm font-bold">JUMP</span>
        </button>
        <button
          onTouchStart={handleInteract}
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/20 bg-blue-500/30 text-white active:bg-blue-500/50"
        >
          <span className="text-sm font-bold">E</span>
        </button>
      </div>

      {/* Turbo toggle */}
      <div className="pointer-events-auto absolute bottom-24 right-28">
        <button
          onTouchStart={() => setControls({ sprint: true })}
          onTouchEnd={() => setControls({ sprint: false })}
          className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/20 bg-orange-500/30 text-xs text-white active:bg-orange-500/50"
        >
          RUN
        </button>
      </div>

      {/* Pause button */}
      <div className="pointer-events-auto absolute right-4 top-4">
        <button
          onClick={togglePause}
          className="rounded-lg border border-white/20 bg-black/30 px-4 py-2 text-white"
        >
          Pause
        </button>
      </div>

      {/* Look sensitivity hint */}
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/50">
        Drag on screen to look around
      </p>
    </div>
  );
}
