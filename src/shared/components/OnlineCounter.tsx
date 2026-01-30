"use client";

import { motion } from "motion/react";
import { usePresence } from "@/shared/context/PresenceContext";

interface Props {
  className?: string;
  showLabel?: boolean;
}

export function OnlineCounter({ className = "", showLabel = true }: Props) {
  const { onlineCount, isConnected } = usePresence();

  if (!isConnected) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center gap-2 ${className}`}
    >
      {/* Pulsing dot */}
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
      </span>

      {/* Count */}
      <span className="text-sm text-muted-foreground">
        <motion.span
          key={onlineCount}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block font-medium text-foreground"
        >
          {onlineCount}
        </motion.span>
        {showLabel && <span className="ml-1">online</span>}
      </span>
    </motion.div>
  );
}
