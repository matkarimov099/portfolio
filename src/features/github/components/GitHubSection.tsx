"use client";

import { useTranslations } from "next-intl";
import { GITHUB_USERNAME } from "@/shared/config/constants";
import {
  useGitHubUser,
  useGitHubRepos,
  useGitHubFollowers,
} from "../hooks/use-github";
import { GitHubProfileCard } from "./GitHubProfileCard";
import { GitHubStats } from "./GitHubStats";
import { GitHubDetails } from "./GitHubDetails";
import { GitHubRepoList } from "./GitHubRepoList";
import { GitHubFollowers } from "./GitHubFollowers";

export function GitHubSection() {
  const t = useTranslations("github");
  const { user, isLoading: userLoading } = useGitHubUser(GITHUB_USERNAME);
  const { repos, repoNames, privateRepoCount, isLoading: reposLoading } =
    useGitHubRepos(GITHUB_USERNAME);
  const { followers, isLoading: followersLoading } =
    useGitHubFollowers(GITHUB_USERNAME);

  const isLoading = userLoading || reposLoading || followersLoading;

  if (isLoading) {
    return (
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </div>
      </section>
    );
  }

  if (!user) return null;

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="font-mono text-sm text-primary">
            {"// github-profile"}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            {t("title")}
          </h2>
          <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        </div>
        <GitHubProfileCard user={user} />
        <GitHubStats user={user} privateRepoCount={privateRepoCount} />
        <GitHubFollowers followers={followers ?? []} />
        <GitHubDetails user={user} />
        <GitHubRepoList repos={repos ?? []} />
      </div>
    </section>
  );
}
