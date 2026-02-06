"use client";

import { Howl } from "howler";
import { useCallback, useEffect, useRef } from "react";
import { AUDIO_CONFIG, SOUND_EFFECTS, ZONE_AMBIENT } from "../constants/audio";
import { useAudioStore } from "../stores/audio.store";
import type { ZoneId } from "../types";

// Sound effect cache
const sfxCache = new Map<string, Howl>();

export function useAudio() {
  const musicRef = useRef<Howl | null>(null);
  const ambientRef = useRef<Howl | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const {
    currentTrack,
    isPlaying,
    masterVolume,
    musicVolume,
    sfxVolume,
    ambientVolume,
    isMuted,
    currentAmbient,
    isVisualizerEnabled,
    play,
    pause,
    nextTrack,
    setCurrentTime,
    setDuration,
    setVisualizerData,
  } = useAudioStore();

  // Initialize music player
  useEffect(() => {
    if (!currentTrack) return;

    // Clean up previous
    if (musicRef.current) {
      musicRef.current.unload();
    }

    const effectiveVolume = isMuted ? 0 : masterVolume * musicVolume;

    musicRef.current = new Howl({
      src: [currentTrack.src],
      volume: effectiveVolume,
      html5: true,
      onload: () => {
        if (musicRef.current) {
          setDuration(musicRef.current.duration());
        }
      },
      onplay: () => {
        // Update current time periodically
        const updateTime = () => {
          if (musicRef.current?.playing()) {
            setCurrentTime(musicRef.current.seek() as number);
            requestAnimationFrame(updateTime);
          }
        };
        updateTime();
      },
      onend: () => {
        nextTrack();
      },
      onloaderror: (_, error) => {
        console.warn("Music load error:", error);
      },
    });

    if (isPlaying) {
      musicRef.current.play();
    }

    return () => {
      if (musicRef.current) {
        musicRef.current.unload();
      }
    };
  }, [
    currentTrack?.id,
    currentTrack?.src,
    isMuted,
    isPlaying,
    masterVolume,
    musicVolume,
    nextTrack,
    setCurrentTime,
    currentTrack,
    setDuration,
  ]);

  // Handle play/pause
  useEffect(() => {
    if (!musicRef.current) return;

    if (isPlaying) {
      musicRef.current.play();
    } else {
      musicRef.current.pause();
    }
  }, [isPlaying]);

  // Handle volume changes
  useEffect(() => {
    if (!musicRef.current) return;
    const effectiveVolume = isMuted ? 0 : masterVolume * musicVolume;
    musicRef.current.volume(effectiveVolume);
  }, [masterVolume, musicVolume, isMuted]);

  // Handle ambient sound changes
  useEffect(() => {
    if (ambientRef.current) {
      ambientRef.current.fade(ambientRef.current.volume(), 0, 500);
      setTimeout(() => {
        ambientRef.current?.unload();
        ambientRef.current = null;
      }, 500);
    }

    if (!currentAmbient) return;

    const ambientSrc = ZONE_AMBIENT[currentAmbient];
    if (!ambientSrc) return;

    const effectiveVolume = isMuted ? 0 : masterVolume * ambientVolume;

    ambientRef.current = new Howl({
      src: [ambientSrc],
      volume: 0,
      loop: true,
      html5: true,
    });

    ambientRef.current.play();
    ambientRef.current.fade(
      0,
      effectiveVolume,
      AUDIO_CONFIG.fadeTransitionTime,
    );

    return () => {
      if (ambientRef.current) {
        ambientRef.current.unload();
      }
    };
  }, [currentAmbient, ambientVolume, isMuted, masterVolume]);

  // Update ambient volume
  useEffect(() => {
    if (!ambientRef.current) return;
    const effectiveVolume = isMuted ? 0 : masterVolume * ambientVolume;
    ambientRef.current.volume(effectiveVolume);
  }, [masterVolume, ambientVolume, isMuted]);

  // Play sound effect
  const playSfx = useCallback(
    (sfxName: keyof typeof SOUND_EFFECTS) => {
      const src = SOUND_EFFECTS[sfxName];
      if (!src) return;

      let sfx = sfxCache.get(src);
      if (!sfx) {
        sfx = new Howl({
          src: [src],
          volume: isMuted ? 0 : masterVolume * sfxVolume,
        });
        sfxCache.set(src, sfx);
      } else {
        sfx.volume(isMuted ? 0 : masterVolume * sfxVolume);
      }

      sfx.play();
    },
    [masterVolume, sfxVolume, isMuted],
  );

  // Set ambient for zone
  const setZoneAmbient = useCallback((zone: ZoneId) => {
    useAudioStore.getState().setCurrentAmbient(zone);
  }, []);

  // Seek to position
  const seekTo = useCallback(
    (time: number) => {
      if (musicRef.current) {
        musicRef.current.seek(time);
        setCurrentTime(time);
      }
    },
    [setCurrentTime],
  );

  // Audio visualizer setup
  useEffect(() => {
    if (!isVisualizerEnabled || !isPlaying) {
      setVisualizerData(new Array(AUDIO_CONFIG.visualizerBars).fill(0));
      return;
    }

    // Create audio context for visualization
    if (!audioContextRef.current) {
      audioContextRef.current = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      )();
    }

    const analyser = audioContextRef.current.createAnalyser();
    analyser.fftSize = 64;
    analyser.smoothingTimeConstant =
      AUDIO_CONFIG.visualizerSmoothingTimeConstant;
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const updateVisualizer = () => {
      if (!analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArray);
      const normalizedData = Array.from(dataArray)
        .slice(0, AUDIO_CONFIG.visualizerBars)
        .map((v) => v / 255);
      setVisualizerData(normalizedData);

      if (isPlaying && isVisualizerEnabled) {
        requestAnimationFrame(updateVisualizer);
      }
    };

    updateVisualizer();

    return () => {
      analyserRef.current = null;
    };
  }, [isPlaying, isVisualizerEnabled, setVisualizerData]);

  return {
    playSfx,
    setZoneAmbient,
    seekTo,
    play,
    pause,
    nextTrack,
  };
}
