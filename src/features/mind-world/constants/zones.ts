import type { Zone, ZoneId, PhysicsConfig } from "../types";

export const ZONES: Zone[] = [
  {
    id: "neon-plaza",
    name: "City Park",
    description: "The central park with a fountain - the heart of the city",
    position: [300, 0, 0],
    color: "#4a7c59",
    unlocked: true,
    visited: false,
  },
  {
    id: "code-district",
    name: "Tech Office",
    description:
      "A modern office building showcasing technical skills and expertise",
    position: [0, 0, -50],
    color: "#3B82F6",
    unlocked: true,
    visited: false,
  },
  {
    id: "project-tower",
    name: "Project Tower",
    description:
      "A tall office tower displaying portfolio projects on its facade",
    position: [100, 0, -100],
    color: "#6B7280",
    unlocked: true,
    visited: false,
  },
  {
    id: "data-bridge",
    name: "Data Center",
    description:
      "An industrial building housing GitHub statistics and data analytics",
    position: [-250, 0, -50],
    color: "#8B8B8B",
    unlocked: true,
    visited: false,
  },
  {
    id: "chat-hq",
    name: "Chat Cafe",
    description: "A cozy cafe where visitors can start a conversation",
    position: [100, 0, 250],
    color: "#D4A574",
    unlocked: true,
    visited: false,
  },
  {
    id: "comm-terminal",
    name: "Post Office",
    description:
      "A communication hub with contact information and social links",
    position: [-150, 0, -300],
    color: "#1565C0",
    unlocked: true,
    visited: false,
  },
  {
    id: "memory-street",
    name: "Career Museum",
    description:
      "A gallery building displaying the career journey and experience",
    position: [-250, 0, 250],
    color: "#F5F0E8",
    unlocked: true,
    visited: false,
  },
];

export const PHYSICS_CONFIG: PhysicsConfig = {
  gravity: { x: 0, y: -9.81, z: 0 },
  player: {
    height: 1.8,
    walkSpeed: 4,
    sprintSpeed: 8,
    jumpForce: 5,
    mass: 70,
  },
  skillZone: {
    gravity: { x: 0, y: -2, z: 0 },
    jumpForce: 10,
  },
};

export const ZONE_AMBIENT_COLORS: Record<ZoneId, string> = {
  "neon-plaza": "#4a7c59",
  "code-district": "#3B82F6",
  "project-tower": "#6B7280",
  "data-bridge": "#8B8B8B",
  "chat-hq": "#D4A574",
  "comm-terminal": "#1565C0",
  "memory-street": "#F5F0E8",
};

export const SPAWN_POSITIONS: Record<ZoneId, [number, number, number]> = {
  "neon-plaza": [300, 2, 10],
  "code-district": [0, 2, -40],
  "project-tower": [100, 2, -90],
  "data-bridge": [-250, 4, -40],
  "chat-hq": [100, 2, 260],
  "comm-terminal": [-150, 2, -290],
  "memory-street": [-250, 2, 260],
};
