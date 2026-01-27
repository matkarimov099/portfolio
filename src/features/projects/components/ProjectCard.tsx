"use client";

import {
  CardContainer,
  CardBody,
  CardItem,
} from "@/shared/components/aceternity/3d-card";
import {
  IconStar,
  IconGitFork,
  IconExternalLink,
  IconBrandGithub,
} from "@tabler/icons-react";
import { GITHUB_USERNAME } from "@/shared/config/constants";
import type { GitHubRepo } from "@/features/projects/types";

const LANG_COLORS: Record<string, string> = {
  TypeScript: "from-blue-500/20 to-cyan-500/20",
  JavaScript: "from-yellow-500/20 to-orange-500/20",
  Python: "from-green-500/20 to-emerald-500/20",
  HTML: "from-red-500/20 to-orange-500/20",
  CSS: "from-purple-500/20 to-pink-500/20",
  Vue: "from-emerald-500/20 to-green-500/20",
  Dart: "from-cyan-500/20 to-blue-500/20",
};

interface ProjectCardProps {
  repo: GitHubRepo;
}

export function ProjectCard({ repo }: ProjectCardProps) {
  const gradientBg =
    LANG_COLORS[repo.language || ""] || "from-primary/20 to-cyan-500/20";

  return (
    <CardContainer containerClassName="py-4">
      <CardBody className="relative group/card dark:hover:shadow-2xl dark:hover:shadow-primary/[0.1] bg-card border-border w-full h-auto rounded-xl border overflow-hidden">
        {/* OG Image */}
        <CardItem translateZ={30} className="w-full">
          <div
            className={`aspect-[2/1] w-full bg-gradient-to-br ${gradientBg} overflow-hidden`}
          >
            <img
              src={`https://opengraph.githubassets.com/1/${GITHUB_USERNAME}/${repo.name}`}
              alt={repo.name}
              className="h-full w-full object-cover opacity-80 transition-transform group-hover/card:scale-105"
              loading="lazy"
            />
          </div>
        </CardItem>

        <div className="p-5">
          <CardItem
            translateZ={50}
            className="text-lg font-bold text-foreground"
          >
            {repo.name}
          </CardItem>

          <CardItem
            translateZ={40}
            className="mt-2 text-sm text-muted-foreground line-clamp-2"
          >
            {repo.description || "No description provided."}
          </CardItem>

          <CardItem translateZ={30} className="mt-3 flex items-center gap-3">
            {repo.language && (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
                {repo.language}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <IconStar size={14} />
              {repo.stars}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <IconGitFork size={14} />
              {repo.forks}
            </span>
          </CardItem>

          {repo.topics.length > 0 && (
            <CardItem translateZ={20} className="mt-3 flex flex-wrap gap-1">
              {repo.topics.slice(0, 4).map((topic) => (
                <span
                  key={topic}
                  className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {topic}
                </span>
              ))}
            </CardItem>
          )}

          <CardItem translateZ={60} className="mt-4 flex items-center gap-3">
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-muted/80"
            >
              <IconBrandGithub size={14} />
              Source Code
            </a>
            {repo.homepage && (
              <a
                href={repo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs text-primary-foreground"
              >
                <IconExternalLink size={14} />
                Live Demo
              </a>
            )}
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}
