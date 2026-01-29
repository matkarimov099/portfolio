"use client";

import { useMemo } from "react";
import type {
  ActivityData,
  GitHubRepo,
  LanguageData,
  RepoStarsData,
} from "../types";

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Dart: "#00B4AB",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Ruby: "#701516",
  PHP: "#4F5D95",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  Shell: "#89e051",
  SCSS: "#c6538c",
};

export function useLanguageDistribution(
  repos: GitHubRepo[] | undefined,
): LanguageData[] {
  return useMemo(() => {
    if (!repos || repos.length === 0) return [];

    const languageCount: Record<string, number> = {};

    repos.forEach((repo) => {
      if (repo.language) {
        languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
      }
    });

    return Object.entries(languageCount)
      .map(([name, value]) => ({
        name,
        value,
        color: LANGUAGE_COLORS[name] || "#8b8b8b",
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [repos]);
}

export function useRepoStars(repos: GitHubRepo[] | undefined): RepoStarsData[] {
  return useMemo(() => {
    if (!repos || repos.length === 0) return [];

    return repos
      .filter((repo) => !repo.private)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 8)
      .map((repo) => ({
        name:
          repo.name.length > 15 ? `${repo.name.slice(0, 15)}...` : repo.name,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
      }));
  }, [repos]);
}

export function useRepoActivity(
  repos: GitHubRepo[] | undefined,
): ActivityData[] {
  return useMemo(() => {
    if (!repos || repos.length === 0) return [];

    const monthCount: Record<string, number> = {};
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Get last 6 months
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      monthCount[key] = 0;
    }

    repos.forEach((repo) => {
      const date = new Date(repo.updated_at);
      const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      if (key in monthCount) {
        monthCount[key]++;
      }
    });

    return Object.entries(monthCount).map(([month, repos]) => ({
      month: month.split(" ")[0],
      repos,
    }));
  }, [repos]);
}
