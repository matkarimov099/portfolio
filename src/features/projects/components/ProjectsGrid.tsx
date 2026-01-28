"use client";

import { useMemo, useState } from "react";
import type { GitHubRepo } from "@/features/projects/types";
import { ProjectCard } from "./ProjectCard";

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
      <div className="mt-8 flex flex-wrap gap-2">
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
      </div>

      {filteredRepos.length === 0 ? (
        <p className="mt-12 text-center text-muted-foreground">
          No projects found.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredRepos.map((repo) => (
            <ProjectCard key={repo.id} repo={repo} />
          ))}
        </div>
      )}
    </div>
  );
}
