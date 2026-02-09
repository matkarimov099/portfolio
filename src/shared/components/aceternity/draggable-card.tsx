// @ts-nocheck
"use client";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type React from "react";
import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/shared/lib/utils";

const FRICTION = 0.988;
const BOUNCE_DAMPING = 0.7;
const WALL_PADDING = 2;
const MAX_VELOCITY = 50;
const STOP_THRESHOLD = 0.2;
const SPIN_FACTOR = 0.05;

export const DraggableCardBody = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const spinRef = useRef(0);

  const springConfig = {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  };

  const rotateX = useSpring(
    useTransform(mouseY, [-300, 300], [25, -25]),
    springConfig,
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-300, 300], [-25, 25]),
    springConfig,
  );

  const opacity = useSpring(
    useTransform(mouseX, [-300, 0, 300], [0.8, 1, 0.8]),
    springConfig,
  );

  const glareOpacity = useSpring(
    useTransform(mouseX, [-300, 0, 300], [0.2, 0, 0.2]),
    springConfig,
  );

  const rotate = useMotionValue(0);

  const cancelPhysics = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const startPhysics = (vxPerFrame: number, vyPerFrame: number) => {
    cancelPhysics();

    // Reset 3D tilt since mouse is not hovering during bounce
    mouseX.set(0);
    mouseY.set(0);

    let vx = vxPerFrame;
    let vy = vyPerFrame;

    const tick = () => {
      const card = cardRef.current;
      if (!card) return;

      // Apply friction
      vx *= FRICTION;
      vy *= FRICTION;

      // Update position
      x.set(x.get() + vx);
      y.set(y.get() + vy);

      // Accumulate spin based on horizontal velocity
      spinRef.current += vx * SPIN_FACTOR;
      rotate.set(spinRef.current);

      // Wall collision detection
      const rect = card.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Left wall
      if (rect.left < WALL_PADDING) {
        x.set(x.get() + (WALL_PADDING - rect.left));
        vx = Math.abs(vx) * BOUNCE_DAMPING;
      }

      // Right wall
      if (rect.right > vw - WALL_PADDING) {
        x.set(x.get() - (rect.right - (vw - WALL_PADDING)));
        vx = -Math.abs(vx) * BOUNCE_DAMPING;
      }

      // Top wall
      if (rect.top < WALL_PADDING) {
        y.set(y.get() + (WALL_PADDING - rect.top));
        vy = Math.abs(vy) * BOUNCE_DAMPING;
      }

      // Bottom wall
      if (rect.bottom > vh - WALL_PADDING) {
        y.set(y.get() - (rect.bottom - (vh - WALL_PADDING)));
        vy = -Math.abs(vy) * BOUNCE_DAMPING;
      }

      // Stop when velocity is negligible
      if (Math.abs(vx) < STOP_THRESHOLD && Math.abs(vy) < STOP_THRESHOLD) {
        rafRef.current = null;
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => cancelPhysics();
  }, [cancelPhysics]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { width, height, left, top } =
      cardRef.current?.getBoundingClientRect() ?? {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      };
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    mouseX.set(deltaX);
    mouseY.set(deltaY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => {
        cancelPhysics();
        document.body.style.cursor = "grabbing";
      }}
      onDragEnd={(_event, info) => {
        document.body.style.cursor = "default";

        // Convert velocity from px/s to px/frame (60fps)
        const clamp = (v: number) =>
          Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, v));
        const vxPerFrame = clamp(info.velocity.x / 60);
        const vyPerFrame = clamp(info.velocity.y / 60);

        startPhysics(vxPerFrame, vyPerFrame);
      }}
      style={{
        x,
        y,
        rotateX,
        rotateY,
        rotate,
        opacity,
        willChange: "transform",
      }}
      whileHover={{ scale: 1.02 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative min-h-96 w-80 cursor-grab overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl transform-3d active:cursor-grabbing",
        className,
      )}
    >
      {children}
      <motion.div
        style={{
          opacity: glareOpacity,
        }}
        className="pointer-events-none absolute inset-0 bg-white/10 select-none"
      />
    </motion.div>
  );
};

export const DraggableCardContainer = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className={cn("perspective-[3000px]", className)}>{children}</div>
  );
};
