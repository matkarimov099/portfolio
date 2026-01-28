"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { GitHubFollower } from "../types";

interface Props {
  followers: GitHubFollower[];
}

export function GitHubFollowers({ followers }: Props) {
  const t = useTranslations("github");

  if (followers.length === 0) return null;

  return (
    <div className="mt-6 border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <h3 className="mb-4 font-mono text-sm font-semibold text-primary">
        {"// "}
        {t("followers")} ({followers.length})
      </h3>
      <div className="flex flex-wrap gap-3">
        {followers.map((f) => (
          <a
            key={f.login}
            href={f.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3 text-sm backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/10"
          >
            <Image
              src={f.avatar_url}
              alt={f.login}
              width={28}
              height={28}
              className="rounded-full"
            />
            <span className="text-xs text-muted-foreground transition-colors group-hover:text-foreground">
              {f.login}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
