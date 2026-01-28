"use client";

import { SKILL_CATEGORIES } from "@/features/about/data/skills";
import { InfiniteMovingCards } from "@/shared/components/aceternity/infinite-moving-cards";
import { TypewriterEffect } from "@/shared/components/aceternity/typewriter-effect";

const skillDescriptions: Record<string, string> = {
  React: "Building modern, interactive UIs with component-driven architecture",
  "Next.js":
    "Server-rendered React apps with file-based routing and API routes",
  TypeScript: "Type-safe JavaScript for scalable, maintainable codebases",
  JavaScript: "Core language powering dynamic web experiences",
  HTML: "Semantic markup for accessible, well-structured content",
  CSS: "Crafting responsive layouts and pixel-perfect designs",
  "Tailwind CSS": "Utility-first styling for rapid UI development",
  Redux: "Predictable global state management for complex apps",
  Zustand: "Lightweight, hook-based state management",
  "React Query": "Powerful server state synchronization and caching",
  "Node.js": "Server-side JavaScript for backend services and APIs",
  PostgreSQL: "Relational database design and query optimization",
  Docker: "Containerized deployments for consistent environments",
  "REST API": "Designing and consuming RESTful web services",
  GraphQL: "Flexible data fetching with typed query language",
  Git: "Version control and collaborative development workflows",
  Figma: "Translating designs into pixel-perfect implementations",
  Linux: "Command-line proficiency and server administration",
};

function buildItems() {
  return SKILL_CATEGORIES.flatMap((category) =>
    category.skills.map((skill) => ({
      quote: skillDescriptions[skill] ?? skill,
      name: skill,
      title: category.title,
    })),
  );
}

export function SkillsMarquee() {
  const items = buildItems();
  const mid = Math.ceil(items.length / 2);
  const rowOne = items.slice(0, mid);
  const rowTwo = items.slice(mid);

  return (
    <div className="mt-16 space-y-4">
      <TypewriterEffect
        words={[{ text: "Skills" }, { text: "&" }, { text: "Technologies" }]}
        className="mb-6 text-xl sm:text-2xl font-bold"
        cursorClassName="bg-primary h-4 md:h-6"
      />
      <InfiniteMovingCards items={rowOne} direction="left" speed="slow" />
      <InfiniteMovingCards items={rowTwo} direction="right" speed="slow" />
    </div>
  );
}
