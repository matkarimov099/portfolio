"use client";

import { useTranslations } from "next-intl";
import type { GitHubUser } from "../types";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
}

interface Props {
  user: GitHubUser;
}

export function GitHubDetails({ user }: Props) {
  const t = useTranslations("github");

  const details = [
    { label: t("publicRepos"), value: String(user.public_repos) },
    { label: t("publicGists"), value: String(user.public_gists) },
    { label: t("memberSince"), value: formatDate(user.created_at) },
    { label: t("lastUpdated"), value: formatDate(user.updated_at) },
  ];

  return (
    <div className="mt-6 rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 font-mono text-sm font-semibold text-primary">
        {"// "}
        {t("moreDetails")}
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {details.map((item) => (
          <div key={item.label}>
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="text-lg font-medium text-foreground">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
