import type { NPCCharacter } from "../types";

export const NPC_CHARACTERS: NPCCharacter[] = [
  {
    id: "inner-voice",
    name: "Inner Voice",
    position: [0, 2, 5],
    rotation: [0, Math.PI, 0],
    zone: "synapse-hub",
    dialogues: [
      {
        id: "iv-welcome",
        text: "Welcome to your own mind, explorer. I am your Inner Voice, your guide through this neural landscape.",
        responses: [
          { text: "Tell me about this place", nextDialogueId: "iv-about" },
          { text: "What can I do here?", nextDialogueId: "iv-activities" },
        ],
      },
      {
        id: "iv-about",
        text: "This is the Developer's Mind - a 3D representation of your skills, memories, and achievements. Each zone represents a different aspect of who you are as a developer.",
        responses: [
          { text: "How do I navigate?", nextDialogueId: "iv-navigation" },
          { text: "What are the zones?", nextDialogueId: "iv-zones" },
        ],
      },
      {
        id: "iv-activities",
        text: "Explore zones, collect skill stars, play mini-games, and unlock achievements! There are secrets hidden throughout - can you find them all?",
        responses: [
          { text: "Tell me about achievements", nextDialogueId: "iv-achievements" },
          { text: "What about mini-games?", nextDialogueId: "iv-games" },
        ],
      },
      {
        id: "iv-navigation",
        text: "Use WASD to move, SPACE to jump, and SHIFT to sprint. Walk through the glowing portals to travel between zones.",
        nextDialogueId: "iv-welcome",
      },
      {
        id: "iv-zones",
        text: "There are 7 zones: Synapse Hub (here), Memory Lane, Skill Constellation, Project Gallery, Connection Port, Chat Neuron, and Stats Observatory. Each has unique experiences!",
        nextDialogueId: "iv-welcome",
      },
      {
        id: "iv-achievements",
        text: "There are 10 achievements to unlock. Visit all zones for 'Explorer', collect all skills for 'Collector', and more. Check the HUD to see your progress!",
        nextDialogueId: "iv-welcome",
      },
      {
        id: "iv-games",
        text: "Four mini-games await: Code Puzzle, Memory Match, Typing Challenge, and Bug Catcher. Complete them to earn achievements!",
        nextDialogueId: "iv-welcome",
      },
    ],
    currentDialogueIndex: 0,
  },
  {
    id: "robot-assistant",
    name: "Debug Bot",
    position: [5, 1.5, 5],
    rotation: [0, -Math.PI / 4, 0],
    zone: "synapse-hub",
    dialogues: [
      {
        id: "rb-greeting",
        text: "Beep boop! I'm Debug Bot. I can help you if you get stuck. What do you need?",
        responses: [
          { text: "How do I collect skills?", nextDialogueId: "rb-skills" },
          { text: "Where are the secrets?", nextDialogueId: "rb-secrets" },
          { text: "Never mind", nextDialogueId: "rb-bye" },
        ],
      },
      {
        id: "rb-skills",
        text: "Skills appear as glowing stars in the Skill Constellation zone. Get close to them (within 5 meters) to collect automatically!",
        nextDialogueId: "rb-greeting",
      },
      {
        id: "rb-secrets",
        text: "ERROR: SECRET_LOCATIONS.reveal() is forbidden! But... I heard some are in unexpected corners. Try looking where others wouldn't.",
        nextDialogueId: "rb-greeting",
      },
      {
        id: "rb-bye",
        text: "No problem! I'll be here if you need me. *powers down slightly*",
      },
    ],
    currentDialogueIndex: 0,
  },
];

export const NPC_CONFIG = {
  interactionRadius: 3,
  floatAmplitude: 0.1,
  floatSpeed: 1,
  rotateToPlayer: true,
  dialogueDisplayTime: 5000, // ms
};

export const NPC_APPEARANCE = {
  "inner-voice": {
    type: "ethereal",
    primaryColor: "#8B5CF6",
    secondaryColor: "#C4B5FD",
    size: 2,
    glow: true,
    particleEffect: "sparkle",
  },
  "past-self-junior": {
    type: "humanoid",
    primaryColor: "#4ade80",
    secondaryColor: "#86efac",
    size: 1.7,
    glow: false,
    particleEffect: "none",
  },
  "past-self-mid": {
    type: "humanoid",
    primaryColor: "#a78bfa",
    secondaryColor: "#c4b5fd",
    size: 1.8,
    glow: false,
    particleEffect: "subtle",
  },
  "past-self-senior": {
    type: "humanoid",
    primaryColor: "#f472b6",
    secondaryColor: "#f9a8d4",
    size: 1.8,
    glow: true,
    particleEffect: "glow",
  },
  "robot-assistant": {
    type: "robot",
    primaryColor: "#60a5fa",
    secondaryColor: "#93c5fd",
    size: 1.2,
    glow: true,
    particleEffect: "electric",
  },
};
