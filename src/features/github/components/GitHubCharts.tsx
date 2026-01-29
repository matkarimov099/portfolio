"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import {
  useLanguageDistribution,
  useRepoActivity,
  useRepoStars,
} from "../hooks/use-github-charts";
import type { GitHubRepo } from "../types";
import { ActivityChart, LanguageChart, StarsChart } from "./charts";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: "easeOut" as const },
  }),
};

interface Props {
  repos: GitHubRepo[];
}

export function GitHubCharts({ repos }: Props) {
  const t = useTranslations("github");
  const languageData = useLanguageDistribution(repos);
  const starsData = useRepoStars(repos);
  const activityData = useRepoActivity(repos);

  if (repos.length === 0) return null;

  return (
    <motion.div
      className="mt-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.h3
        className="mb-6 font-mono text-sm font-semibold text-primary"
        custom={0}
        variants={fadeUp}
      >
        {"// "}
        {t("charts")}
      </motion.h3>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <motion.div
          className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
          custom={1}
          variants={fadeUp}
        >
          <h4 className="mb-4 text-sm font-medium text-foreground">
            {t("languageDistribution")}
          </h4>
          <LanguageChart data={languageData} />
        </motion.div>

        <motion.div
          className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
          custom={2}
          variants={fadeUp}
        >
          <h4 className="mb-4 text-sm font-medium text-foreground">
            {t("starsComparison")}
          </h4>
          <StarsChart data={starsData} />
        </motion.div>

        <motion.div
          className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
          custom={3}
          variants={fadeUp}
        >
          <h4 className="mb-4 text-sm font-medium text-foreground">
            {t("commitActivity")}
          </h4>
          <ActivityChart data={activityData} />
        </motion.div>
      </div>
    </motion.div>
  );
}
