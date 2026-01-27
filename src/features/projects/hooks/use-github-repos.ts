"use client";

import { useMemo, useState } from "react";
import type { GitHubRepo, RepoFilter } from "../types";

export function useGithubRepos(repos: GitHubRepo[]) {
  const [filter, setFilter] = useState<RepoFilter>({ language: null });

  const filteredRepos = useMemo(() => {
    if (!filter.language) return repos;
    return repos.filter((repo) => repo.language === filter.language);
  }, [repos, filter.language]);

  const languages = useMemo(() => {
    const set = new Set(repos.map((r) => r.language).filter(Boolean));
    return Array.from(set) as string[];
  }, [repos]);

  return { filteredRepos, languages, filter, setFilter };
}
