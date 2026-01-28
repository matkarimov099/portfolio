"use client";

import { motion } from "motion/react";
import { useMemo, useState } from "react";
import type { GitHubRepo } from "@/features/projects/types";
import { ProjectCard } from "./ProjectCard";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

interface ProjectsGridProps {
  repos: GitHubRepo[];
}

export function ProjectsGrid({ repos }: ProjectsGridProps) {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const languages = useMemo(() => {
    const langs = new Set<string>();
    repos.forEach((repo) => {
      if (repo.language) langs.add(repo.language);
    });
    return ["All", ...Array.from(langs).sort()];
  }, [repos]);

  const filteredRepos = useMemo(() => {
    if (activeFilter === "All") return repos;
    return repos.filter((repo) => repo.language === activeFilter);
  }, [repos, activeFilter]);

  return (
    <div>
      <motion.div
        className="mt-8 flex flex-wrap gap-2"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        custom={0}
        variants={fadeUp}
      >
        {languages.map((lang) => (
          <button
            type="button"
            key={lang}
            onClick={() => setActiveFilter(lang)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              activeFilter === lang
                ? "bg-primary text-primary-foreground"
                : "border border-white/10 bg-white/5 text-muted-foreground backdrop-blur-sm hover:bg-white/10"
            }`}
          >
            {lang}
          </button>
        ))}
      </motion.div>

      {filteredRepos.length === 0 ? (
        <p className="mt-12 text-center text-muted-foreground">
          No projects found.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredRepos.map((repo, index) => (
            <motion.div
              key={repo.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={index % 3}
              variants={fadeUp}
            >
              <ProjectCard repo={repo} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
