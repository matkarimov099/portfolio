"use client";

import {
  IconBrandGit,
  IconCode,
  IconLock,
  IconStar,
  IconUsers,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import type { GitHubUser } from "../types";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

interface Props {
  user: GitHubUser;
  privateRepoCount: number;
}

export function GitHubStats({ user, privateRepoCount }: Props) {
  const t = useTranslations("github");

  const stats = [
    {
      label: t("publicRepos"),
      value: user.public_repos,
      description: t("codeProjects"),
      icon: IconCode,
      color: "border-l-blue-500 text-blue-500",
    },
    ...(privateRepoCount > 0
      ? [
          {
            label: t("privateRepos"),
            value: privateRepoCount,
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
    <div className="mt-6 flex flex-wrap justify-center gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className={`w-full rounded-xl border border-l-4 border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] ${stat.color.split(" ")[0]}`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          custom={index}
          variants={fadeUp}
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
        </motion.div>
      ))}
    </div>
  );
}
