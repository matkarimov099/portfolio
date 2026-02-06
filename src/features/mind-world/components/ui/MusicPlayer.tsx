"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconPlayerSkipForward,
  IconPlayerSkipBack,
  IconVolume,
  IconVolumeOff,
  IconChevronUp,
  IconChevronDown,
  IconMusic,
} from "@tabler/icons-react";
import { useAudioStore } from "../../stores/audio.store";

export function MusicPlayer() {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    masterVolume,
    isMuted,
    visualizerData,
    isVisualizerEnabled,
    toggle,
    nextTrack,
    prevTrack,
    setMasterVolume,
    toggleMute,
    toggleVisualizer,
  } = useAudioStore();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      className="fixed bottom-20 left-4 z-40"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1 }}
    >
      <div className="overflow-hidden rounded-lg border border-white/10 bg-black/70 backdrop-blur-md">
        {/* Collapsed header - always visible */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between px-3 py-2 transition-colors hover:bg-white/5"
        >
          <div className="flex items-center gap-2">
            <IconMusic className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-white">
              {currentTrack?.name || "No track"}
            </span>
          </div>
          {isExpanded ? (
            <IconChevronDown className="h-4 w-4 text-gray-400" />
          ) : (
            <IconChevronUp className="h-4 w-4 text-gray-400" />
          )}
        </button>

        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-white/10"
            >
              <div className="p-3">
                {/* Track info */}
                <div className="mb-3">
                  <p className="text-sm font-medium text-white">
                    {currentTrack?.name || "No track loaded"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {currentTrack?.artist || "Unknown artist"}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="mb-1 h-1.5 overflow-hidden rounded-full bg-gray-700">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="mb-3 flex items-center justify-center gap-4">
                  <button
                    onClick={prevTrack}
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    <IconPlayerSkipBack className="h-5 w-5" />
                  </button>
                  <button
                    onClick={toggle}
                    className="rounded-full bg-purple-500 p-2 text-white transition-colors hover:bg-purple-600"
                  >
                    {isPlaying ? (
                      <IconPlayerPause className="h-5 w-5" />
                    ) : (
                      <IconPlayerPlay className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={nextTrack}
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    <IconPlayerSkipForward className="h-5 w-5" />
                  </button>
                </div>

                {/* Volume control */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    {isMuted ? (
                      <IconVolumeOff className="h-4 w-4" />
                    ) : (
                      <IconVolume className="h-4 w-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : masterVolume}
                    onChange={(e) =>
                      setMasterVolume(parseFloat(e.target.value))
                    }
                    className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-gray-700 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
                  />
                  <span className="w-8 text-right text-xs text-gray-500">
                    {Math.round(masterVolume * 100)}%
                  </span>
                </div>

                {/* Visualizer toggle */}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-400">Visualizer</span>
                  <button
                    onClick={toggleVisualizer}
                    className={`rounded-full px-2 py-0.5 text-xs transition-colors ${
                      isVisualizerEnabled
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-gray-700 text-gray-500"
                    }`}
                  >
                    {isVisualizerEnabled ? "ON" : "OFF"}
                  </button>
                </div>

                {/* Visualizer bars */}
                {isVisualizerEnabled && (
                  <div className="mt-2 flex h-8 items-end justify-center gap-0.5">
                    {visualizerData.slice(0, 16).map((value, i) => (
                      <div
                        key={i}
                        className="w-1.5 rounded-t bg-gradient-to-t from-purple-500 to-pink-500 transition-all duration-75"
                        style={{ height: `${Math.max(2, value * 100)}%` }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
