"use client";

import { TypewriterEffect } from "@/shared/components/aceternity/typewriter-effect";

export function ProjectsTitle({ title }: { title: string }) {
  return (
    <TypewriterEffect
      words={title.split(" ").map((word) => ({ text: word }))}
      className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight"
      cursorClassName="bg-primary h-5 md:h-7"
    />
  );
}
