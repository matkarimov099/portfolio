"use client";

import { useTranslations } from "next-intl";
import {
  IconBrandGithub,
  IconStar,
  IconGitFork,
  IconLock,
  IconWorld,
  IconPointFilled,
} from "@tabler/icons-react";
import type { GitHubRepo } from "../types";

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

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

interface Props {
  repos: GitHubRepo[];
}

export function GitHubRepoList({ repos }: Props) {
  const t = useTranslations("github");

  if (repos.length === 0) return null;

  return (
    <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <h3 className="mb-4 font-mono text-sm font-semibold text-primary">
        {"// "}
        {t("repositories")} ({repos.length})
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {repos.map((repo) => (
          <a
            key={repo.name}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-3 rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
          >
            <div className="flex items-center gap-2">
              <IconBrandGithub size={16} className="shrink-0 text-primary" />
              <span className="truncate font-medium text-foreground">
                {repo.name}
              </span>
              {repo.private ? (
                <span className="ml-auto flex shrink-0 items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-[10px] text-yellow-400">
                  <IconLock size={10} />
                  Private
                </span>
              ) : (
                <span className="ml-auto flex shrink-0 items-center gap-1 rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-[10px] text-green-400">
                  <IconWorld size={10} />
                  Public
                </span>
              )}
            </div>

            {repo.description && (
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {repo.description}
              </p>
            )}

            <div className="mt-auto flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {repo.language && (
                <span className="flex items-center gap-1">
                  <IconPointFilled
                    size={12}
                    style={{ color: LANGUAGE_COLORS[repo.language] ?? "#8b8b8b" }}
                  />
                  {repo.language}
                </span>
              )}
              {repo.stargazers_count > 0 && (
                <span className="flex items-center gap-1">
                  <IconStar size={12} />
                  {repo.stargazers_count}
                </span>
              )}
              {repo.forks_count > 0 && (
                <span className="flex items-center gap-1">
                  <IconGitFork size={12} />
                  {repo.forks_count}
                </span>
              )}
              <span className="ml-auto text-[10px]">
                {timeAgo(repo.updated_at)}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
