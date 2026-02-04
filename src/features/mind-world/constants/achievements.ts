import type { Achievement, AchievementId } from "../types";

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "explorer",
    name: "Explorer",
    description: "Visit all 7 zones in the mind world",
    icon: "map",
    difficulty: "easy",
    unlocked: false,
    progress: 0,
    maxProgress: 7,
  },
  {
    id: "collector",
    name: "Collector",
    description: "Collect all 18 skill stars",
    icon: "stars",
    difficulty: "medium",
    unlocked: false,
    progress: 0,
    maxProgress: 18,
  },
  {
    id: "time-traveler",
    name: "Time Traveler",
    description: "Complete the Memory Lane journey",
    icon: "clock",
    difficulty: "easy",
    unlocked: false,
    progress: 0,
    maxProgress: 4,
  },
  {
    id: "social-butterfly",
    name: "Social Butterfly",
    description: "Discover all 5 contact portals",
    icon: "share",
    difficulty: "easy",
    unlocked: false,
    progress: 0,
    maxProgress: 5,
  },
  {
    id: "curious-mind",
    name: "Curious Mind",
    description: "Find 5 hidden secrets",
    icon: "search",
    difficulty: "hard",
    unlocked: false,
    progress: 0,
    maxProgress: 5,
  },
  {
    id: "stargazer",
    name: "Stargazer",
    description: "Complete the Skill Constellation zone",
    icon: "sparkles",
    difficulty: "medium",
    unlocked: false,
    progress: 0,
    maxProgress: 18,
  },
  {
    id: "speed-demon",
    name: "Speed Demon",
    description: "Achieve 60+ WPM in Typing Challenge",
    icon: "zap",
    difficulty: "hard",
    unlocked: false,
    progress: 0,
    maxProgress: 60,
  },
  {
    id: "bug-hunter",
    name: "Bug Hunter",
    description: "Catch 50 bugs in Bug Catcher",
    icon: "bug",
    difficulty: "medium",
    unlocked: false,
    progress: 0,
    maxProgress: 50,
  },
  {
    id: "memory-master",
    name: "Memory Master",
    description: "Complete Memory Match game",
    icon: "brain",
    difficulty: "medium",
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: "code-wizard",
    name: "Code Wizard",
    description: "Solve all Code Puzzles",
    icon: "wand",
    difficulty: "hard",
    unlocked: false,
    progress: 0,
    maxProgress: 3,
  },
];

export const ACHIEVEMENT_ICONS: Record<string, string> = {
  map: "IconMap",
  stars: "IconStars",
  clock: "IconClock",
  share: "IconShare",
  search: "IconSearch",
  sparkles: "IconSparkles",
  zap: "IconBolt",
  bug: "IconBug",
  brain: "IconBrain",
  wand: "IconWand",
};

export const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "#10B981",
  medium: "#F59E0B",
  hard: "#EF4444",
};

export const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

// Points awarded for each achievement
export const ACHIEVEMENT_POINTS: Record<AchievementId, number> = {
  explorer: 100,
  collector: 250,
  "time-traveler": 100,
  "social-butterfly": 100,
  "curious-mind": 500,
  stargazer: 200,
  "speed-demon": 300,
  "bug-hunter": 200,
  "memory-master": 150,
  "code-wizard": 400,
};

// Secrets that can be found
export const SECRETS = [
  {
    id: "secret-1",
    name: "Hidden Console",
    description: "Found the developer's secret console",
    location: "synapse-hub",
    hint: "Look behind the main neuron cluster",
  },
  {
    id: "secret-2",
    name: "Time Capsule",
    description: "Discovered a message from the past",
    location: "memory-lane",
    hint: "Check between 2020 and 2021",
  },
  {
    id: "secret-3",
    name: "Dark Star",
    description: "Found the hidden dark matter skill",
    location: "skill-constellation",
    hint: "Look at the edge of the universe",
  },
  {
    id: "secret-4",
    name: "Easter Egg",
    description: "Found the developer's easter egg",
    location: "project-gallery",
    hint: "Interact with the oldest project",
  },
  {
    id: "secret-5",
    name: "Ghost Message",
    description: "Received a message from nowhere",
    location: "chat-neuron",
    hint: "Wait in silence for 30 seconds",
  },
];
