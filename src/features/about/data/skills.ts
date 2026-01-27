export interface Skill {
  name: string;
  icon: string;
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export const SKILLS: Skill[] = [
  { name: "React", icon: "react" },
  { name: "Next.js", icon: "nextjs" },
  { name: "TypeScript", icon: "typescript" },
  { name: "JavaScript", icon: "javascript" },
  { name: "HTML", icon: "html" },
  { name: "CSS", icon: "css" },
  { name: "Tailwind CSS", icon: "tailwindcss" },
  { name: "Redux", icon: "redux" },
  { name: "Zustand", icon: "zustand" },
  { name: "React Query", icon: "reactquery" },
  { name: "Git", icon: "git" },
  { name: "REST API", icon: "restapi" },
  { name: "GraphQL", icon: "graphql" },
  { name: "Node.js", icon: "nodejs" },
  { name: "PostgreSQL", icon: "postgresql" },
  { name: "Docker", icon: "docker" },
  { name: "Figma", icon: "figma" },
  { name: "Linux", icon: "linux" },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Frontend",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "HTML",
      "CSS",
      "Tailwind CSS",
    ],
  },
  {
    title: "State Management",
    skills: ["Redux", "Zustand", "React Query"],
  },
  {
    title: "Backend & DevOps",
    skills: ["Node.js", "PostgreSQL", "Docker", "REST API", "GraphQL", "Git"],
  },
  {
    title: "Tools",
    skills: ["Figma", "Linux"],
  },
];
