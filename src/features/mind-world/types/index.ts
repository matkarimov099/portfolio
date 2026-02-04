import type * as THREE from "three";

// ==================== Player Types ====================
export interface PlayerState {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  velocity: THREE.Vector3;
  isGrounded: boolean;
  isSprinting: boolean;
  currentZone: ZoneId;
  health: number;
}

export interface PlayerControls {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  sprint: boolean;
  interact: boolean;
}

// ==================== Zone Types ====================
export type ZoneId =
  | "synapse-hub"
  | "memory-lane"
  | "skill-constellation"
  | "project-gallery"
  | "connection-port"
  | "chat-neuron"
  | "stats-observatory";

export interface Zone {
  id: ZoneId;
  name: string;
  description: string;
  position: [number, number, number];
  color: string;
  unlocked: boolean;
  visited: boolean;
}

export interface ZonePortal {
  id: string;
  fromZone: ZoneId;
  toZone: ZoneId;
  position: [number, number, number];
  rotation: [number, number, number];
}

// ==================== Skill Types ====================
export type SkillCategory = "frontend" | "state" | "backend" | "tools";

export interface SkillStar {
  id: string;
  name: string;
  icon: string;
  category: SkillCategory;
  position: [number, number, number];
  collected: boolean;
  description: string;
}

export interface SkillConstellation {
  category: SkillCategory;
  skills: SkillStar[];
  centerPosition: [number, number, number];
  color: string;
}

// ==================== Achievement Types ====================
export type AchievementId =
  | "explorer"
  | "collector"
  | "time-traveler"
  | "social-butterfly"
  | "curious-mind"
  | "stargazer"
  | "speed-demon"
  | "bug-hunter"
  | "memory-master"
  | "code-wizard";

export type AchievementDifficulty = "easy" | "medium" | "hard";

export interface Achievement {
  id: AchievementId;
  name: string;
  description: string;
  icon: string;
  difficulty: AchievementDifficulty;
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
}

// ==================== NPC Types ====================
export type NPCId = "inner-voice" | "past-self-junior" | "past-self-mid" | "past-self-senior" | "robot-assistant";

export interface NPCCharacter {
  id: NPCId;
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  zone: ZoneId;
  dialogues: NPCDialogue[];
  currentDialogueIndex: number;
}

export interface NPCDialogue {
  id: string;
  text: string;
  responses?: NPCResponse[];
  nextDialogueId?: string;
}

export interface NPCResponse {
  text: string;
  nextDialogueId: string;
}

// ==================== Mini-Game Types ====================
export type MiniGameId = "code-puzzle" | "memory-match" | "typing-challenge" | "bug-catcher";

export interface MiniGame {
  id: MiniGameId;
  name: string;
  description: string;
  zone: ZoneId;
  position: [number, number, number];
  highScore: number;
  completed: boolean;
}

export interface CodePuzzleState {
  blocks: CodeBlock[];
  correctOrder: string[];
  currentOrder: string[];
  isComplete: boolean;
  score: number;
}

export interface CodeBlock {
  id: string;
  code: string;
  position: number;
}

export interface MemoryMatchState {
  cards: MemoryCard[];
  flippedCards: string[];
  matchedPairs: string[];
  moves: number;
  isComplete: boolean;
}

export interface MemoryCard {
  id: string;
  icon: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface TypingChallengeState {
  currentSnippet: string;
  userInput: string;
  startTime: number | null;
  endTime: number | null;
  wpm: number;
  accuracy: number;
  isComplete: boolean;
}

export interface BugCatcherState {
  bugs: Bug[];
  caughtCount: number;
  missedCount: number;
  timeRemaining: number;
  isActive: boolean;
  score: number;
}

export interface Bug {
  id: string;
  type: "syntax" | "logic" | "runtime";
  position: [number, number, number];
  velocity: [number, number, number];
  isCaught: boolean;
}

// ==================== Audio Types ====================
export interface AudioTrack {
  id: string;
  name: string;
  artist: string;
  src: string;
  duration: number;
}

export interface AudioState {
  currentTrack: AudioTrack | null;
  playlist: AudioTrack[];
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  visualizerData: number[];
}

// ==================== Memory Lane Types ====================
export interface MemoryStation {
  id: string;
  year: string;
  period: string;
  title: string;
  company: string;
  description: string;
  position: [number, number, number];
  technologies: string[];
  photos: string[];
}

// ==================== Project Types ====================
export interface ProjectHologram {
  id: string;
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  language: string;
  position: [number, number, number];
  isExpanded: boolean;
}

// ==================== Connection Types ====================
export interface ConnectionPortal {
  id: string;
  platform: "github" | "linkedin" | "telegram" | "instagram" | "email";
  name: string;
  url: string;
  icon: string;
  position: [number, number, number];
  chargeLevel: number;
}

// ==================== World State Types ====================
export interface WorldState {
  isLoaded: boolean;
  loadingProgress: number;
  currentZone: ZoneId;
  visitedZones: ZoneId[];
  collectedSkills: string[];
  unlockedAchievements: AchievementId[];
  secretsFound: string[];
  totalPlayTime: number;
  sessionStartTime: number;
}

// ==================== UI Types ====================
export interface HUDState {
  isVisible: boolean;
  showMinimap: boolean;
  showSkillInventory: boolean;
  showPauseMenu: boolean;
  showNPCDialog: boolean;
  currentNPC: NPCId | null;
}

export interface LoadingState {
  isLoading: boolean;
  progress: number;
  currentAsset: string;
  tips: string[];
  currentTipIndex: number;
}

// ==================== Physics Types ====================
export interface PhysicsConfig {
  gravity: { x: number; y: number; z: number };
  player: {
    height: number;
    walkSpeed: number;
    sprintSpeed: number;
    jumpForce: number;
    mass: number;
  };
  skillZone: {
    gravity: { x: number; y: number; z: number };
    jumpForce: number;
  };
}

// ==================== Effect Types ====================
export interface NeuralGlowConfig {
  color: string;
  intensity: number;
  pulseSpeed: number;
  particleCount: number;
}

export interface PortalConfig {
  color: string;
  size: number;
  rotationSpeed: number;
  particleCount: number;
}
