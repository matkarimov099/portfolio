"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  IconUser,
  IconBuilding,
  IconMapPin,
  IconCalendar,
  IconExternalLink,
} from "@tabler/icons-react";
import { GlareCard } from "@/shared/components/aceternity/glare-card";
import type { GitHubUser } from "../types";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
}

interface Props {
  user: GitHubUser;
}

export function GitHubProfileCard({ user }: Props) {
  const t = useTranslations("github");

  return (
    <div className="mt-8 flex flex-col items-center gap-8 md:flex-row md:items-start">
      <GlareCard className="flex flex-col items-center justify-center gap-4 p-6">
        <Image
          src={user.avatar_url}
          alt={user.name ?? user.login}
          width={80}
          height={80}
          className="rounded-full"
        />
        <h3 className="text-xl font-bold text-foreground">
          {user.name ?? user.login}
        </h3>
        <p className="font-mono text-sm text-primary">@{user.login}</p>
        {user.bio && (
          <p className="text-center text-xs text-muted-foreground">
            {user.bio}
          </p>
        )}
      </GlareCard>

      <div className="flex-1 space-y-4">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
              <IconUser size={14} />
              {user.type}
            </span>
            {user.company && (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                <IconBuilding size={14} />
                {user.company}
              </span>
            )}
            {user.location && (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                <IconMapPin size={14} />
                {user.location}
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
              <IconCalendar size={14} />
              {formatDate(user.created_at)}
            </span>
          </div>

          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("viewGithub")}
            <IconExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
