import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import type { AudioTrack, ZoneId } from "../types";
import { DEFAULT_PLAYLIST, AUDIO_CONFIG } from "../constants/audio";

interface AudioStore {
  // Playlist state
  playlist: AudioTrack[];
  currentTrackIndex: number;
  currentTrack: AudioTrack | null;

  // Playback state
  isPlaying: boolean;
  currentTime: number;
  duration: number;

  // Volume
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  ambientVolume: number;
  isMuted: boolean;

  // Visualizer
  visualizerData: number[];
  isVisualizerEnabled: boolean;

  // Zone ambient
  currentAmbient: ZoneId | null;

  // Actions - Playlist
  setPlaylist: (playlist: AudioTrack[]) => void;
  addTrack: (track: AudioTrack) => void;
  removeTrack: (trackId: string) => void;

  // Actions - Playback
  play: () => void;
  pause: () => void;
  toggle: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setTrack: (index: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;

  // Actions - Volume
  setMasterVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  setAmbientVolume: (volume: number) => void;
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;

  // Actions - Visualizer
  setVisualizerData: (data: number[]) => void;
  toggleVisualizer: () => void;

  // Actions - Ambient
  setCurrentAmbient: (zone: ZoneId | null) => void;

  // Computed
  getEffectiveMusicVolume: () => number;
  getEffectiveSfxVolume: () => number;
  getEffectiveAmbientVolume: () => number;
}

export const useAudioStore = create<AudioStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // Initial state
        playlist: DEFAULT_PLAYLIST,
        currentTrackIndex: 0,
        currentTrack: DEFAULT_PLAYLIST[0] || null,

        isPlaying: false,
        currentTime: 0,
        duration: 0,

        masterVolume: AUDIO_CONFIG.defaultVolume,
        musicVolume: 1,
        sfxVolume: AUDIO_CONFIG.sfxVolume,
        ambientVolume: AUDIO_CONFIG.ambientVolume,
        isMuted: false,

        visualizerData: new Array(AUDIO_CONFIG.visualizerBars).fill(0),
        isVisualizerEnabled: true,

        currentAmbient: null,

        // Actions - Playlist
        setPlaylist: (playlist) =>
          set({
            playlist,
            currentTrackIndex: 0,
            currentTrack: playlist[0] || null,
          }),

        addTrack: (track) =>
          set((state) => ({
            playlist: [...state.playlist, track],
          })),

        removeTrack: (trackId) =>
          set((state) => {
            const newPlaylist = state.playlist.filter((t) => t.id !== trackId);
            const newIndex = Math.min(
              state.currentTrackIndex,
              newPlaylist.length - 1
            );
            return {
              playlist: newPlaylist,
              currentTrackIndex: Math.max(0, newIndex),
              currentTrack: newPlaylist[newIndex] || null,
            };
          }),

        // Actions - Playback
        play: () => set({ isPlaying: true }),
        pause: () => set({ isPlaying: false }),
        toggle: () => set((state) => ({ isPlaying: !state.isPlaying })),

        nextTrack: () =>
          set((state) => {
            const nextIndex =
              (state.currentTrackIndex + 1) % state.playlist.length;
            return {
              currentTrackIndex: nextIndex,
              currentTrack: state.playlist[nextIndex] || null,
              currentTime: 0,
            };
          }),

        prevTrack: () =>
          set((state) => {
            // If more than 3 seconds in, restart current track
            if (state.currentTime > 3) {
              return { currentTime: 0 };
            }
            const prevIndex =
              state.currentTrackIndex === 0
                ? state.playlist.length - 1
                : state.currentTrackIndex - 1;
            return {
              currentTrackIndex: prevIndex,
              currentTrack: state.playlist[prevIndex] || null,
              currentTime: 0,
            };
          }),

        setTrack: (index) =>
          set((state) => ({
            currentTrackIndex: index,
            currentTrack: state.playlist[index] || null,
            currentTime: 0,
          })),

        setCurrentTime: (time) => set({ currentTime: time }),
        setDuration: (duration) => set({ duration }),

        // Actions - Volume
        setMasterVolume: (volume) =>
          set({ masterVolume: Math.max(0, Math.min(1, volume)) }),
        setMusicVolume: (volume) =>
          set({ musicVolume: Math.max(0, Math.min(1, volume)) }),
        setSfxVolume: (volume) =>
          set({ sfxVolume: Math.max(0, Math.min(1, volume)) }),
        setAmbientVolume: (volume) =>
          set({ ambientVolume: Math.max(0, Math.min(1, volume)) }),

        toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
        setMuted: (muted) => set({ isMuted: muted }),

        // Actions - Visualizer
        setVisualizerData: (data) => set({ visualizerData: data }),
        toggleVisualizer: () =>
          set((state) => ({ isVisualizerEnabled: !state.isVisualizerEnabled })),

        // Actions - Ambient
        setCurrentAmbient: (zone) => set({ currentAmbient: zone }),

        // Computed
        getEffectiveMusicVolume: () => {
          const { masterVolume, musicVolume, isMuted } = get();
          return isMuted ? 0 : masterVolume * musicVolume;
        },

        getEffectiveSfxVolume: () => {
          const { masterVolume, sfxVolume, isMuted } = get();
          return isMuted ? 0 : masterVolume * sfxVolume;
        },

        getEffectiveAmbientVolume: () => {
          const { masterVolume, ambientVolume, isMuted } = get();
          return isMuted ? 0 : masterVolume * ambientVolume;
        },
      }),
      {
        name: "mind-world-audio",
        partialize: (state) => ({
          masterVolume: state.masterVolume,
          musicVolume: state.musicVolume,
          sfxVolume: state.sfxVolume,
          ambientVolume: state.ambientVolume,
          isMuted: state.isMuted,
          isVisualizerEnabled: state.isVisualizerEnabled,
        }),
      }
    )
  )
);
