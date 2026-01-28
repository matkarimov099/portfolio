"use client";

import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTelegram,
  IconCode,
  IconMapPin,
} from "@tabler/icons-react";
import Image from "next/image";
import type { GitHubUser } from "@/features/github/types";
import { CometCard } from "@/shared/components/aceternity/comet-card";
import { siteConfig } from "@/shared/config/site";

export function ProfileCard({ user }: { user: GitHubUser | null }) {
  return (
    <CometCard className="w-full">
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          {user?.avatar_url ? (
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-cyan-400 opacity-50 blur-sm" />
              <Image
                src={user.avatar_url}
                alt={user.name || user.login}
                width={80}
                height={80}
                className="relative rounded-full"
              />
            </div>
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <IconCode size={32} className="text-muted-foreground" />
            </div>
          )}
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold text-foreground">
              {user?.name || "Matkarim Matkarimov"}
            </h3>
            <p className="font-mono text-sm text-primary">
              @{user?.login || "matkarimov099"}
            </p>
            {(user?.bio || true) && (
              <p className="mt-2 text-sm text-muted-foreground">
                {user?.bio || "Senior Frontend Developer"}
              </p>
            )}
            {user?.location && (
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <IconMapPin size={12} />
                {user.location}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <IconBrandGithub size={14} />
            GitHub
          </a>
          <a
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <IconBrandLinkedin size={14} />
            LinkedIn
          </a>
          <a
            href={siteConfig.links.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <IconBrandTelegram size={14} />
            Telegram
          </a>
        </div>
      </div>
    </CometCard>
  );
}
