import type { AudioTrack } from "../types";

// Placeholder tracks - user will add their own mp3 files
export const DEFAULT_PLAYLIST: AudioTrack[] = [
  {
    id: "track-1",
    name: "Neural Waves",
    artist: "Mind World OST",
    src: "/mind-world/audio/music/track-1.mp3",
    duration: 180,
  },
  {
    id: "track-2",
    name: "Synapse Dreams",
    artist: "Mind World OST",
    src: "/mind-world/audio/music/track-2.mp3",
    duration: 210,
  },
  {
    id: "track-3",
    name: "Memory Flow",
    artist: "Mind World OST",
    src: "/mind-world/audio/music/track-3.mp3",
    duration: 195,
  },
  {
    id: "track-4",
    name: "Cosmic Code",
    artist: "Mind World OST",
    src: "/mind-world/audio/music/track-4.mp3",
    duration: 240,
  },
  {
    id: "track-5",
    name: "Digital Horizon",
    artist: "Mind World OST",
    src: "/mind-world/audio/music/track-5.mp3",
    duration: 225,
  },
];

// Sound Effects
export const SOUND_EFFECTS = {
  skillCollect: "/mind-world/audio/sfx/skill-collect.mp3",
  portalEnter: "/mind-world/audio/sfx/portal-enter.mp3",
  achievementUnlock: "/mind-world/audio/sfx/achievement-unlock.mp3",
  npcInteract: "/mind-world/audio/sfx/npc-interact.mp3",
  buttonClick: "/mind-world/audio/sfx/button-click.mp3",
  gameStart: "/mind-world/audio/sfx/game-start.mp3",
  gameWin: "/mind-world/audio/sfx/game-win.mp3",
  gameLose: "/mind-world/audio/sfx/game-lose.mp3",
  bugCatch: "/mind-world/audio/sfx/bug-catch.mp3",
  typing: "/mind-world/audio/sfx/typing.mp3",
  cardFlip: "/mind-world/audio/sfx/card-flip.mp3",
  cardMatch: "/mind-world/audio/sfx/card-match.mp3",
  footstep: "/mind-world/audio/sfx/footstep.mp3",
  jump: "/mind-world/audio/sfx/jump.mp3",
  secretFound: "/mind-world/audio/sfx/secret-found.mp3",
};

// Ambient Sounds per Zone
export const ZONE_AMBIENT: Record<string, string> = {
  "neon-plaza": "/mind-world/audio/ambient/neural-hum.mp3",
  "memory-street": "/mind-world/audio/ambient/time-flow.mp3",
  "code-district": "/mind-world/audio/ambient/cosmic-wind.mp3",
  "project-tower": "/mind-world/audio/ambient/digital-buzz.mp3",
  "comm-terminal": "/mind-world/audio/ambient/electric-pulse.mp3",
  "chat-hq": "/mind-world/audio/ambient/thought-waves.mp3",
  "data-bridge": "/mind-world/audio/ambient/data-stream.mp3",
};

// Audio Configuration
export const AUDIO_CONFIG = {
  defaultVolume: 0.7,
  sfxVolume: 0.5,
  ambientVolume: 0.3,
  fadeTransitionTime: 1000, // ms
  visualizerBars: 32,
  visualizerSmoothingTimeConstant: 0.8,
};
