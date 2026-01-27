"use client";

import { motion } from "motion/react";
import {
  IconGitFork,
  IconUsers,
  IconCode,
  IconStar,
} from "@tabler/icons-react";
import type { GitHubUser } from "@/features/github/types";
import { CometCard } from "@/shared/components/aceternity/comet-card";

type StatsField = "public_repos" | "public_gists" | "followers" | "following";

const STATS_CONFIG: {
  key: string;
  icon: typeof IconCode;
  label: string;
  field: StatsField;
}[] = [
  {
    key: "repos",
    icon: IconCode,
    label: "Repositories",
    field: "public_repos",
  },
  { key: "gists", icon: IconGitFork, label: "Gists", field: "public_gists" },
  { key: "followers", icon: IconUsers, label: "Followers", field: "followers" },
  { key: "following", icon: IconStar, label: "Following", field: "following" },
];

export function StatsCard({ user }: { user: GitHubUser | null }) {
  return (
    <CometCard className="w-full">
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 font-mono text-sm font-semibold text-primary">
          {"// GitHub Stats"}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {STATS_CONFIG.map((stat, index) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
              className="rounded-lg border border-border bg-muted/30 p-4 text-center"
            >
              <stat.icon size={20} className="mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold text-foreground">
                {user ? user[stat.field] : "\u2014"}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </CometCard>
  );
}
