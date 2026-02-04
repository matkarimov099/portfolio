import type { MemoryStation } from "../types";

export const MEMORY_STATIONS: MemoryStation[] = [
  {
    id: "station-1",
    year: "2018-2022",
    period: "Student Era",
    title: "Computer Science Student",
    company: "TUIT - Tashkent University of Information Technologies",
    description:
      "Started my journey into the world of programming. Learned fundamentals of computer science, algorithms, and data structures. Built my first web applications.",
    position: [0, 2, 0],
    technologies: ["HTML", "CSS", "JavaScript", "Python", "C++"],
    photos: [],
  },
  {
    id: "station-2",
    year: "2021-2022",
    period: "First Job",
    title: "Junior Developer",
    company: "Urgench State University",
    description:
      "My first professional experience as a developer. Worked on university web projects and learned about real-world software development practices.",
    position: [0, 2, -30],
    technologies: ["React", "JavaScript", "HTML", "CSS", "Git"],
    photos: [],
  },
  {
    id: "station-3",
    year: "2023-2025",
    period: "Growth Era",
    title: "Frontend Developer",
    company: "IT-FORLEAD",
    description:
      "Significant professional growth. Mastered modern frontend technologies, worked on complex projects, and developed expertise in React ecosystem.",
    position: [0, 2, -60],
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux", "React Query"],
    photos: [],
  },
  {
    id: "station-4",
    year: "2025-Present",
    period: "Current",
    title: "Full Stack Developer",
    company: "UNICON-SOFT",
    description:
      "Current position where I apply all my accumulated knowledge and continue to grow as a full-stack developer, working on enterprise-level applications.",
    position: [0, 2, -90],
    technologies: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Docker", "GraphQL"],
    photos: [],
  },
];

export const TIMELINE_CONFIG = {
  startYear: 2018,
  endYear: 2025,
  corridorLength: 120,
  corridorWidth: 10,
  corridorHeight: 8,
  stationSpacing: 30,
  yearMarkerInterval: 1,
};

export const MEMORY_LANE_COLORS = {
  corridor: "#1a1a2e",
  floor: "#16213e",
  yearMarker: "#e94560",
  stationGlow: "#0f3460",
  frameGold: "#ffd700",
  frameSilver: "#c0c0c0",
};

// Past-Self NPC configurations for each station
export const PAST_SELF_CONFIGS = [
  {
    stationId: "station-1",
    npcId: "past-self-junior" as const,
    name: "Junior Matkarim",
    age: "18-22",
    appearance: {
      height: 1.7,
      color: "#4ade80",
    },
    dialogues: [
      {
        id: "junior-1",
        text: "Hey! I'm just starting out. Everything seems so complex, but I'm determined to learn!",
      },
      {
        id: "junior-2",
        text: "Did you know I spent hours debugging my first 'Hello World' program? Good times...",
      },
      {
        id: "junior-3",
        text: "My dream is to build something that people actually use. Will I ever get there?",
      },
    ],
  },
  {
    stationId: "station-2",
    npcId: "past-self-junior" as const,
    name: "Working Matkarim",
    age: "21-22",
    appearance: {
      height: 1.75,
      color: "#60a5fa",
    },
    dialogues: [
      {
        id: "working-1",
        text: "First real job! The imposter syndrome is real, but I'm pushing through.",
      },
      {
        id: "working-2",
        text: "I learned more in 3 months here than in a year of studying. Hands-on experience is invaluable.",
      },
    ],
  },
  {
    stationId: "station-3",
    npcId: "past-self-mid" as const,
    name: "Growing Matkarim",
    age: "23-25",
    appearance: {
      height: 1.8,
      color: "#a78bfa",
    },
    dialogues: [
      {
        id: "growing-1",
        text: "TypeScript changed everything for me. Can't imagine going back to plain JavaScript.",
      },
      {
        id: "growing-2",
        text: "I've started mentoring juniors now. Teaching others helps me learn too.",
      },
      {
        id: "growing-3",
        text: "The React ecosystem is vast. Every day there's something new to explore!",
      },
    ],
  },
  {
    stationId: "station-4",
    npcId: "past-self-senior" as const,
    name: "Current Matkarim",
    age: "25+",
    appearance: {
      height: 1.8,
      color: "#f472b6",
    },
    dialogues: [
      {
        id: "current-1",
        text: "Welcome to the present! I'm now comfortable with the full stack.",
      },
      {
        id: "current-2",
        text: "Looking back, every struggle was worth it. Each bug taught me something valuable.",
      },
      {
        id: "current-3",
        text: "The journey continues. There's always more to learn in this field!",
      },
    ],
  },
];
