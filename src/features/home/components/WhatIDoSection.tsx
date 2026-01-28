"use client";

import {
  IconApi,
  IconBraces,
  IconBrandNextjs,
  IconBrandReact,
  IconBrandTypescript,
  IconDeviceMobile,
} from "@tabler/icons-react";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/shared/components/aceternity/draggable-card";
import { TypewriterEffect } from "@/shared/components/aceternity/typewriter-effect";

const SERVICES = [
  {
    icon: IconBrandReact,
    title: "React Development",
    description:
      "Building complex UIs with React, state management, and modern hooks patterns.",
    color: "text-cyan-500",
  },
  {
    icon: IconBrandNextjs,
    title: "Next.js Applications",
    description:
      "Full-stack web apps with SSR, SSG, API routes, and optimized performance.",
    color: "text-foreground",
  },
  {
    icon: IconBrandTypescript,
    title: "TypeScript",
    description:
      "Type-safe code with advanced TypeScript patterns and strict configurations.",
    color: "text-blue-500",
  },
  {
    icon: IconDeviceMobile,
    title: "Responsive Design",
    description:
      "Pixel-perfect responsive layouts with Tailwind CSS and modern CSS features.",
    color: "text-pink-500",
  },
  {
    icon: IconApi,
    title: "API Integration",
    description:
      "RESTful and GraphQL API integration with robust error handling and caching.",
    color: "text-green-500",
  },
  {
    icon: IconBraces,
    title: "Clean Architecture",
    description:
      "Scalable code architecture, design patterns, and maintainable codebases.",
    color: "text-yellow-500",
  },
];

export function WhatIDoSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="font-mono text-sm text-primary">{"// what-i-do"}</p>
          <TypewriterEffect
            words={[{ text: "Skills" }, { text: "&" }, { text: "Expertise" }]}
            className="mt-2 text-3xl font-bold tracking-tight"
            cursorClassName="bg-primary"
          />
        </div>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <DraggableCardContainer key={service.title} className="w-full">
              <DraggableCardBody className="min-h-0 w-full rounded-xl border border-border bg-card p-6 shadow-none">
                <service.icon size={28} className={service.color} />
                <h3 className="mt-4 font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {service.description}
                </p>
              </DraggableCardBody>
            </DraggableCardContainer>
          ))}
        </div>
      </div>
    </section>
  );
}
