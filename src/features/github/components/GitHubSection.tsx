"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { GITHUB_USERNAME } from "@/shared/config/constants";
import {
  useGitHubFollowers,
  useGitHubRepos,
  useGitHubUser,
} from "../hooks/use-github";
import { GitHubCharts } from "./GitHubCharts";
import { GitHubDetails } from "./GitHubDetails";
import { GitHubFollowers } from "./GitHubFollowers";
import { GitHubProfileCard } from "./GitHubProfileCard";
import { GitHubRepoList } from "./GitHubRepoList";
import { GitHubStats } from "./GitHubStats";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: "easeOut" as const },
  }),
};

export function GitHubSection() {
  const t = useTranslations("github");
  const { user, isLoading: userLoading } = useGitHubUser(GITHUB_USERNAME);
  const {
    repos,
    privateRepoCount,
    isLoading: reposLoading,
  } = useGitHubRepos(GITHUB_USERNAME);
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
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          custom={0}
          variants={fadeUp}
        >
          <p className="font-mono text-sm text-primary">
            {"// github-profile"}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            {t("title")}
          </h2>
          <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={1}
          variants={fadeUp}
        >
          <GitHubProfileCard user={user} />
        </motion.div>

        <GitHubStats user={user} privateRepoCount={privateRepoCount} />

        <GitHubCharts repos={repos ?? []} />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={0}
          variants={fadeUp}
        >
          <GitHubFollowers followers={followers ?? []} />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={0}
          variants={fadeUp}
        >
          <GitHubDetails user={user} />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          custom={0}
          variants={fadeUp}
        >
          <GitHubRepoList repos={repos ?? []} />
        </motion.div>
      </div>
    </section>
  );
}
