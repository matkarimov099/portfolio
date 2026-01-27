"use client";
import { TypewriterEffect } from "@/shared/components/aceternity/typewriter-effect";

export function SectionTitle({
  words,
}: {
  words: { text: string; className?: string }[];
}) {
  return (
    <TypewriterEffect
      words={words}
      className="mt-2 text-3xl font-bold tracking-tight"
      cursorClassName="bg-primary"
    />
  );
}
