import type { Zone, ZonePortal, PhysicsConfig } from "../types";

export const ZONES: Zone[] = [
  {
    id: "synapse-hub",
    name: "Synapse Hub",
    description: "The central neural network - your mind's command center",
    position: [0, 0, 0],
    color: "#8B5CF6",
    unlocked: true,
    visited: false,
  },
  {
    id: "memory-lane",
    name: "Memory Lane",
    description: "Walk through your career journey from 2018 to present",
    position: [0, 0, -100],
    color: "#F59E0B",
    unlocked: true,
    visited: false,
  },
  {
    id: "skill-constellation",
    name: "Skill Constellation",
    description: "Collect skill stars floating in cosmic space",
    position: [-100, 50, 0],
    color: "#3B82F6",
    unlocked: true,
    visited: false,
  },
  {
    id: "project-gallery",
    name: "Project Gallery",
    description: "Explore your projects as holographic displays",
    position: [100, 0, 0],
    color: "#10B981",
    unlocked: true,
    visited: false,
  },
  {
    id: "connection-port",
    name: "Connection Port",
    description: "Connect with the outside world through neural links",
    position: [-50, 0, 100],
    color: "#EC4899",
    unlocked: true,
    visited: false,
  },
  {
    id: "chat-neuron",
    name: "Chat Neuron",
    description: "Communicate through thought impulses",
    position: [50, 0, 100],
    color: "#06B6D4",
    unlocked: true,
    visited: false,
  },
  {
    id: "stats-observatory",
    name: "Stats Observatory",
    description: "View your GitHub statistics from above",
    position: [0, 100, -50],
    color: "#F97316",
    unlocked: true,
    visited: false,
  },
];

export const ZONE_PORTALS: ZonePortal[] = [
  // From Synapse Hub to all zones
  {
    id: "hub-to-memory",
    fromZone: "synapse-hub",
    toZone: "memory-lane",
    position: [0, 1, -15],
    rotation: [0, 0, 0],
  },
  {
    id: "hub-to-skills",
    fromZone: "synapse-hub",
    toZone: "skill-constellation",
    position: [-15, 1, 0],
    rotation: [0, Math.PI / 2, 0],
  },
  {
    id: "hub-to-projects",
    fromZone: "synapse-hub",
    toZone: "project-gallery",
    position: [15, 1, 0],
    rotation: [0, -Math.PI / 2, 0],
  },
  {
    id: "hub-to-connection",
    fromZone: "synapse-hub",
    toZone: "connection-port",
    position: [-10, 1, 15],
    rotation: [0, Math.PI, 0],
  },
  {
    id: "hub-to-chat",
    fromZone: "synapse-hub",
    toZone: "chat-neuron",
    position: [10, 1, 15],
    rotation: [0, Math.PI, 0],
  },
  {
    id: "hub-to-stats",
    fromZone: "synapse-hub",
    toZone: "stats-observatory",
    position: [0, 5, -10],
    rotation: [-Math.PI / 4, 0, 0],
  },
  // Return portals
  {
    id: "memory-to-hub",
    fromZone: "memory-lane",
    toZone: "synapse-hub",
    position: [0, 1, 15],
    rotation: [0, Math.PI, 0],
  },
  {
    id: "skills-to-hub",
    fromZone: "skill-constellation",
    toZone: "synapse-hub",
    position: [15, 1, 0],
    rotation: [0, -Math.PI / 2, 0],
  },
  {
    id: "projects-to-hub",
    fromZone: "project-gallery",
    toZone: "synapse-hub",
    position: [-15, 1, 0],
    rotation: [0, Math.PI / 2, 0],
  },
  {
    id: "connection-to-hub",
    fromZone: "connection-port",
    toZone: "synapse-hub",
    position: [0, 1, -15],
    rotation: [0, 0, 0],
  },
  {
    id: "chat-to-hub",
    fromZone: "chat-neuron",
    toZone: "synapse-hub",
    position: [0, 1, -15],
    rotation: [0, 0, 0],
  },
  {
    id: "stats-to-hub",
    fromZone: "stats-observatory",
    toZone: "synapse-hub",
    position: [0, 1, 15],
    rotation: [0, Math.PI, 0],
  },
];

export const PHYSICS_CONFIG: PhysicsConfig = {
  gravity: { x: 0, y: -9.81, z: 0 },
  player: {
    height: 1.8,
    walkSpeed: 5,
    sprintSpeed: 8,
    jumpForce: 5,
    mass: 70,
  },
  skillZone: {
    gravity: { x: 0, y: -2, z: 0 },
    jumpForce: 10,
  },
};

export const ZONE_AMBIENT_COLORS: Record<string, string> = {
  "synapse-hub": "#1a0a2e",
  "memory-lane": "#1a1a0a",
  "skill-constellation": "#0a0a2e",
  "project-gallery": "#0a1a1a",
  "connection-port": "#1a0a1a",
  "chat-neuron": "#0a1a2e",
  "stats-observatory": "#1a0a0a",
};

export const SPAWN_POSITIONS: Record<string, [number, number, number]> = {
  "synapse-hub": [0, 2, 10],
  "memory-lane": [0, 2, 50],
  "skill-constellation": [0, 10, 0],
  "project-gallery": [-30, 2, 0],
  "connection-port": [0, 2, -30],
  "chat-neuron": [0, 2, -30],
  "stats-observatory": [0, 5, 30],
};
