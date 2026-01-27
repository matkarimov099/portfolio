"use client";

import { useTranslations } from "next-intl";
import {
  IconCode,
  IconBrandGit,
  IconUsers,
  IconStar,
  IconLock,
} from "@tabler/icons-react";
import type { GitHubUser } from "../types";

interface Props {
  user: GitHubUser;
}

export function GitHubStats({ user }: Props) {
  const t = useTranslations("github");

  const stats = [
    {
      label: t("publicRepos"),
      value: user.public_repos,
      description: t("codeProjects"),
      icon: IconCode,
      color: "border-l-blue-500 text-blue-500",
    },
    ...(user.owned_private_repos != null
      ? [
          {
            label: t("privateRepos"),
            value: user.owned_private_repos,
            description: t("privateProjects"),
            icon: IconLock,
            color: "border-l-purple-500 text-purple-500",
          },
        ]
      : []),
    {
      label: t("publicGists"),
      value: user.public_gists,
      description: t("codeSnippets"),
      icon: IconBrandGit,
      color: "border-l-green-500 text-green-500",
    },
    {
      label: t("followers"),
      value: user.followers,
      description: t("community"),
      icon: IconUsers,
      color: "border-l-orange-500 text-orange-500",
    },
    {
      label: t("following"),
      value: user.following,
      description: t("connections"),
      icon: IconStar,
      color: "border-l-red-500 text-red-500",
    },
  ];

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-xl border border-l-4 border-border bg-card p-5 ${stat.color.split(" ")[0]}`}
        >
          <div className="flex items-center gap-2">
            <stat.icon size={20} className={stat.color.split(" ")[1]} />
            <span className="text-sm text-muted-foreground">{stat.label}</span>
          </div>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {stat.value}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {stat.description}
          </p>
        </div>
      ))}
    </div>
  );
}
