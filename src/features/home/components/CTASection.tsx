"use client";

import { motion } from "motion/react";
import { TypewriterEffect } from "@/shared/components/aceternity/typewriter-effect";
import { IconTerminal2, IconMail } from "@tabler/icons-react";
import { Meteors } from "@/shared/components/aceternity/meteors";
import { Link } from "@/i18n/navigation";

export function CTASection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl border border-border bg-card p-12 text-center"
        >
          <Meteors number={20} />
          <div className="relative z-10">
            <p className="font-mono text-sm text-primary">
              {"// let's-connect"}
            </p>
            <TypewriterEffect
              words={[
                { text: "Let's" },
                { text: "Work" },
                { text: "Together" },
              ]}
              className="mt-4 text-3xl font-bold"
              cursorClassName="bg-primary"
            />
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">
              I&apos;m always open to new opportunities and interesting
              projects. Let&apos;s build something amazing together.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25"
              >
                <IconMail size={16} />
                Get In Touch
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted"
              >
                <IconTerminal2 size={16} />
                View Projects
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
