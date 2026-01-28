"use client";

import {
  IconBrandGithub,
  IconExternalLink,
  IconGitFork,
  IconStar,
} from "@tabler/icons-react";
import Image from "next/image";
import type { GitHubRepo } from "@/features/projects/types";
import {
  EvervaultCard,
  Icon,
} from "@/shared/components/aceternity/evervault-card";
import { GITHUB_USERNAME } from "@/shared/config/constants";

interface ProjectCardProps {
  repo: GitHubRepo;
}

export function ProjectCard({ repo }: ProjectCardProps) {
  return (
    <div className="relative flex flex-col items-start border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
      <Icon className="absolute -top-3 -left-3 h-6 w-6 text-white" />
      <Icon className="absolute -bottom-3 -left-3 h-6 w-6 text-white" />
      <Icon className="absolute -top-3 -right-3 h-6 w-6 text-white" />
      <Icon className="absolute -bottom-3 -right-3 h-6 w-6 text-white" />

      <div className="relative aspect-[2/1] w-full">
        {/* OG Image as background */}
        <Image
          src={`https://opengraph.githubassets.com/1/${GITHUB_USERNAME}/${repo.name}`}
          alt={repo.name}
          fill
          className="object-cover"
        />
        {/* Evervault overlay on hover */}
        <div className="absolute inset-0 z-10">
          <EvervaultCard className="!aspect-auto h-full" />
        </div>
      </div>

      <div className="relative z-20 mt-3 w-full">
        <h3 className="text-lg font-bold text-foreground">{repo.name}</h3>
        <p className="mt-1.5 text-sm font-light text-muted-foreground line-clamp-2">
          {repo.description || "No description provided."}
        </p>

        <div className="mt-3 flex items-center gap-2 flex-wrap">
          {repo.language && (
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-primary backdrop-blur-sm">
              {repo.language}
            </span>
          )}
          <span className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-muted-foreground backdrop-blur-sm">
            <IconStar size={14} />
            {repo.stars}
          </span>
          <span className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-muted-foreground backdrop-blur-sm">
            <IconGitFork size={14} />
            {repo.forks}
          </span>
        </div>

        {repo.topics.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {repo.topics.slice(0, 4).map((topic) => (
              <span
                key={topic}
                className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-muted-foreground backdrop-blur-sm"
              >
                {topic}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center gap-3">
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-foreground backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            <IconBrandGithub size={14} />
            Source
          </a>
          {repo.homepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-primary/20 px-3 py-1 text-xs text-primary backdrop-blur-sm transition-colors hover:bg-primary/30"
            >
              <IconExternalLink size={14} />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
