import type { SkillStar, SkillConstellation, SkillCategory } from "../types";

// Skill Stars Data - 18 total skills
export const SKILL_STARS: SkillStar[] = [
  // Frontend (7)
  {
    id: "react",
    name: "React",
    icon: "react",
    category: "frontend",
    position: [-20, 15, -10],
    collected: false,
    description: "A JavaScript library for building user interfaces",
  },
  {
    id: "nextjs",
    name: "Next.js",
    icon: "nextjs",
    category: "frontend",
    position: [-15, 20, -5],
    collected: false,
    description: "The React Framework for Production",
  },
  {
    id: "typescript",
    name: "TypeScript",
    icon: "typescript",
    category: "frontend",
    position: [-25, 18, 0],
    collected: false,
    description: "Typed superset of JavaScript",
  },
  {
    id: "javascript",
    name: "JavaScript",
    icon: "javascript",
    category: "frontend",
    position: [-18, 12, 5],
    collected: false,
    description: "The language of the web",
  },
  {
    id: "html",
    name: "HTML",
    icon: "html",
    category: "frontend",
    position: [-22, 25, -8],
    collected: false,
    description: "HyperText Markup Language",
  },
  {
    id: "css",
    name: "CSS",
    icon: "css",
    category: "frontend",
    position: [-12, 22, -12],
    collected: false,
    description: "Cascading Style Sheets",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    icon: "tailwind",
    category: "frontend",
    position: [-28, 16, -3],
    collected: false,
    description: "A utility-first CSS framework",
  },

  // State Management (3)
  {
    id: "redux",
    name: "Redux",
    icon: "redux",
    category: "state",
    position: [5, 20, -15],
    collected: false,
    description: "Predictable state container for JS apps",
  },
  {
    id: "zustand",
    name: "Zustand",
    icon: "zustand",
    category: "state",
    position: [10, 15, -10],
    collected: false,
    description: "Small, fast, scalable state management",
  },
  {
    id: "react-query",
    name: "React Query",
    icon: "reactquery",
    category: "state",
    position: [0, 18, -20],
    collected: false,
    description: "Powerful data synchronization for React",
  },

  // Backend & DevOps (6)
  {
    id: "nodejs",
    name: "Node.js",
    icon: "nodejs",
    category: "backend",
    position: [20, 12, 5],
    collected: false,
    description: "JavaScript runtime built on Chrome's V8 engine",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    icon: "postgresql",
    category: "backend",
    position: [25, 18, 0],
    collected: false,
    description: "The world's most advanced open source database",
  },
  {
    id: "docker",
    name: "Docker",
    icon: "docker",
    category: "backend",
    position: [18, 22, -5],
    collected: false,
    description: "Container platform for modern applications",
  },
  {
    id: "restapi",
    name: "REST API",
    icon: "api",
    category: "backend",
    position: [28, 15, 8],
    collected: false,
    description: "REpresentational State Transfer architecture",
  },
  {
    id: "graphql",
    name: "GraphQL",
    icon: "graphql",
    category: "backend",
    position: [22, 25, 3],
    collected: false,
    description: "A query language for your API",
  },
  {
    id: "git",
    name: "Git",
    icon: "git",
    category: "backend",
    position: [15, 20, 10],
    collected: false,
    description: "Distributed version control system",
  },

  // Tools (2)
  {
    id: "figma",
    name: "Figma",
    icon: "figma",
    category: "tools",
    position: [0, 28, 15],
    collected: false,
    description: "Collaborative interface design tool",
  },
  {
    id: "linux",
    name: "Linux",
    icon: "linux",
    category: "tools",
    position: [5, 30, 20],
    collected: false,
    description: "Open-source Unix-like operating system",
  },
];

export const SKILL_CONSTELLATIONS: SkillConstellation[] = [
  {
    category: "frontend",
    skills: SKILL_STARS.filter((s) => s.category === "frontend"),
    centerPosition: [-20, 18, -5],
    color: "#3B82F6",
  },
  {
    category: "state",
    skills: SKILL_STARS.filter((s) => s.category === "state"),
    centerPosition: [5, 18, -15],
    color: "#8B5CF6",
  },
  {
    category: "backend",
    skills: SKILL_STARS.filter((s) => s.category === "backend"),
    centerPosition: [22, 18, 3],
    color: "#10B981",
  },
  {
    category: "tools",
    skills: SKILL_STARS.filter((s) => s.category === "tools"),
    centerPosition: [2, 29, 17],
    color: "#F59E0B",
  },
];

export const SKILL_CATEGORY_NAMES: Record<SkillCategory, string> = {
  frontend: "Frontend Development",
  state: "State Management",
  backend: "Backend & DevOps",
  tools: "Tools & Design",
};

export const SKILL_CATEGORY_COLORS: Record<SkillCategory, string> = {
  frontend: "#3B82F6",
  state: "#8B5CF6",
  backend: "#10B981",
  tools: "#F59E0B",
};

// Collection radius - player needs to be within this distance to collect
export const SKILL_COLLECTION_RADIUS = 5;

// Star visual properties
export const STAR_CONFIG = {
  baseSize: 0.5,
  glowIntensity: 2,
  rotationSpeed: 0.5,
  floatAmplitude: 0.3,
  floatSpeed: 1,
  trailLength: 20,
  trailOpacity: 0.5,
};
