"use client";

import { useTranslations } from "next-intl";
import { GITHUB_USERNAME } from "@/shared/config/constants";
import { IconBrandGithub } from "@tabler/icons-react";

interface Props {
  repoNames: string[];
}

export function GitHubRepoList({ repoNames }: Props) {
  const t = useTranslations("github");

  return (
    <div className="mt-6 rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 font-mono text-sm font-semibold text-primary">
        {"// "}
        {t("repositories")}
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {repoNames.map((name) => (
          <a
            key={name}
            href={`https://github.com/${GITHUB_USERNAME}/${name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
          >
            <IconBrandGithub size={14} className="text-primary" />
            {name}
          </a>
        ))}
      </div>
    </div>
  );
}
