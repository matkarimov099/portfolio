import type { MiniGame, CodeBlock, MemoryCard } from "../types";

export const MINI_GAMES: MiniGame[] = [
  {
    id: "code-puzzle",
    name: "Code Puzzle",
    description: "Arrange code blocks in the correct order",
    zone: "project-gallery",
    position: [10, 2, 0],
    highScore: 0,
    completed: false,
  },
  {
    id: "memory-match",
    name: "Memory Match",
    description: "Match technology cards to reveal pairs",
    zone: "memory-lane",
    position: [0, 2, -45],
    highScore: 0,
    completed: false,
  },
  {
    id: "typing-challenge",
    name: "Typing Challenge",
    description: "Type code snippets as fast as you can",
    zone: "synapse-hub",
    position: [-5, 2, -5],
    highScore: 0,
    completed: false,
  },
  {
    id: "bug-catcher",
    name: "Bug Catcher",
    description: "Catch floating bugs before they escape",
    zone: "project-gallery",
    position: [-10, 2, 0],
    highScore: 0,
    completed: false,
  },
];

// Code Puzzle Levels
export const CODE_PUZZLE_LEVELS: { blocks: CodeBlock[]; correctOrder: string[] }[] = [
  {
    blocks: [
      { id: "cp1-1", code: "function greet(name) {", position: 0 },
      { id: "cp1-2", code: "  return `Hello, ${name}!`;", position: 0 },
      { id: "cp1-3", code: "}", position: 0 },
    ],
    correctOrder: ["cp1-1", "cp1-2", "cp1-3"],
  },
  {
    blocks: [
      { id: "cp2-1", code: "const fetchData = async () => {", position: 0 },
      { id: "cp2-2", code: "  const response = await fetch(url);", position: 0 },
      { id: "cp2-3", code: "  const data = await response.json();", position: 0 },
      { id: "cp2-4", code: "  return data;", position: 0 },
      { id: "cp2-5", code: "};", position: 0 },
    ],
    correctOrder: ["cp2-1", "cp2-2", "cp2-3", "cp2-4", "cp2-5"],
  },
  {
    blocks: [
      { id: "cp3-1", code: "const useCounter = () => {", position: 0 },
      { id: "cp3-2", code: "  const [count, setCount] = useState(0);", position: 0 },
      { id: "cp3-3", code: "  const increment = () => setCount(c => c + 1);", position: 0 },
      { id: "cp3-4", code: "  const decrement = () => setCount(c => c - 1);", position: 0 },
      { id: "cp3-5", code: "  return { count, increment, decrement };", position: 0 },
      { id: "cp3-6", code: "};", position: 0 },
    ],
    correctOrder: ["cp3-1", "cp3-2", "cp3-3", "cp3-4", "cp3-5", "cp3-6"],
  },
];

// Memory Match Cards (8 pairs = 16 cards)
export const MEMORY_CARDS: Omit<MemoryCard, "isFlipped" | "isMatched">[] = [
  { id: "mc-react-1", icon: "react", name: "React" },
  { id: "mc-react-2", icon: "react", name: "React" },
  { id: "mc-nextjs-1", icon: "nextjs", name: "Next.js" },
  { id: "mc-nextjs-2", icon: "nextjs", name: "Next.js" },
  { id: "mc-ts-1", icon: "typescript", name: "TypeScript" },
  { id: "mc-ts-2", icon: "typescript", name: "TypeScript" },
  { id: "mc-node-1", icon: "nodejs", name: "Node.js" },
  { id: "mc-node-2", icon: "nodejs", name: "Node.js" },
  { id: "mc-docker-1", icon: "docker", name: "Docker" },
  { id: "mc-docker-2", icon: "docker", name: "Docker" },
  { id: "mc-postgres-1", icon: "postgresql", name: "PostgreSQL" },
  { id: "mc-postgres-2", icon: "postgresql", name: "PostgreSQL" },
  { id: "mc-git-1", icon: "git", name: "Git" },
  { id: "mc-git-2", icon: "git", name: "Git" },
  { id: "mc-tailwind-1", icon: "tailwind", name: "Tailwind" },
  { id: "mc-tailwind-2", icon: "tailwind", name: "Tailwind" },
];

// Typing Challenge Snippets
export const TYPING_SNIPPETS = [
  "const sum = (a, b) => a + b;",
  "function fibonacci(n) { return n <= 1 ? n : fibonacci(n-1) + fibonacci(n-2); }",
  "const arr = [1, 2, 3].map(x => x * 2);",
  "export default function App() { return <div>Hello World</div>; }",
  "const [state, setState] = useState(null);",
  "useEffect(() => { fetchData(); }, []);",
  "const data = await fetch(url).then(r => r.json());",
  "Object.keys(obj).forEach(key => console.log(key));",
  "const unique = [...new Set(array)];",
  "const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };",
];

// Bug Catcher Config
export const BUG_CATCHER_CONFIG = {
  gameDuration: 60, // seconds
  spawnInterval: 1500, // ms
  maxBugs: 15,
  bugSpeed: {
    min: 1,
    max: 3,
  },
  bugTypes: [
    { type: "syntax" as const, color: "#EF4444", points: 10 },
    { type: "logic" as const, color: "#F59E0B", points: 20 },
    { type: "runtime" as const, color: "#8B5CF6", points: 30 },
  ],
  arenaSize: {
    width: 20,
    height: 10,
    depth: 20,
  },
};

// Game Rewards
export const GAME_REWARDS = {
  "code-puzzle": {
    completion: 100,
    perfectScore: 50,
    speedBonus: 25,
  },
  "memory-match": {
    completion: 100,
    minMoves: 50,
    speedBonus: 25,
  },
  "typing-challenge": {
    wpm60: 100,
    wpm80: 150,
    wpm100: 200,
    perfectAccuracy: 50,
  },
  "bug-catcher": {
    completion: 100,
    catch50: 150,
    noMiss: 200,
  },
};
