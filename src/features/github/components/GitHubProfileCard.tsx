"use client";

import {
  IconBuilding,
  IconCalendar,
  IconExternalLink,
  IconMapPin,
  IconUser,
} from "@tabler/icons-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
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
    <div className="mt-8 flex justify-center">
      <GlareCard
        containerClassName="!w-full max-w-2xl !aspect-auto"
        className="flex flex-col items-center gap-6 p-8 sm:flex-row sm:items-start"
      >
        {/* Avatar */}
        <div className="shrink-0">
          <Image
            src={user.avatar_url}
            alt={user.name ?? user.login}
            width={100}
            height={100}
            className="rounded-full border-2 border-white/10"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col items-center sm:items-start">
          <h3 className="text-xl font-bold text-white">
            {user.name ?? user.login}
          </h3>
          <p className="font-mono text-sm text-primary">@{user.login}</p>

          {user.bio && (
            <p className="mt-2 text-center text-sm text-neutral-300 sm:text-left">
              {user.bio}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300 backdrop-blur-sm">
              <IconUser size={14} />
              {user.type}
            </span>
            {user.company && (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300 backdrop-blur-sm">
                <IconBuilding size={14} />
                {user.company}
              </span>
            )}
            {user.location && (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300 backdrop-blur-sm">
                <IconMapPin size={14} />
                {user.location}
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300 backdrop-blur-sm">
              <IconCalendar size={14} />
              {formatDate(user.created_at)}
            </span>
          </div>

          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("viewGithub")}
            <IconExternalLink size={16} />
          </a>
        </div>
      </GlareCard>
    </div>
  );
}
