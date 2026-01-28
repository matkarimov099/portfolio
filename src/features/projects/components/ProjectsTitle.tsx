"use client";

import { motion } from "motion/react";
import { TypewriterEffect } from "@/shared/components/aceternity/typewriter-effect";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: "easeOut" as const },
  }),
};

interface Props {
  title: string;
  subtitle: string;
}

export function ProjectsTitle({ title, subtitle }: Props) {
  return (
    <motion.div
      className="text-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      custom={0}
      variants={fadeUp}
    >
      <p className="font-mono text-sm text-primary">{"// my-projects"}</p>
      <TypewriterEffect
        words={title.split(" ").map((word) => ({ text: word }))}
        className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight"
        cursorClassName="bg-primary h-5 md:h-7"
      />
      <motion.p
        className="mt-2 text-muted-foreground"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        custom={1}
        variants={fadeUp}
      >
        {subtitle}
      </motion.p>
    </motion.div>
  );
}
