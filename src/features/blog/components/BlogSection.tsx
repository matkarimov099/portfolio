"use client";

import {
  IconArticle,
  IconExternalLink,
  IconHeart,
  IconMessageCircle,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { DEVTO_USERNAME } from "@/shared/config/constants";
import { useDevToArticles } from "../hooks/use-devto";
import { BlogCard } from "./BlogCard";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: "easeOut" as const },
  }),
};

export function BlogSection() {
  const t = useTranslations("blog");
  const { articles, totalReactions, totalComments, isLoading } =
    useDevToArticles(DEVTO_USERNAME);

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

  if (!articles || articles.length === 0) {
    return (
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-muted-foreground">{t("noArticles")}</p>
        </div>
      </section>
    );
  }

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
          <p className="font-mono text-sm text-primary">{"// dev.to-blog"}</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            {t("title")}
          </h2>
          <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          custom={1}
          variants={fadeUp}
        >
          <span className="flex items-center gap-1.5">
            <IconArticle size={16} className="text-primary" />
            {t("totalArticles", { count: articles.length })}
          </span>
          <span className="flex items-center gap-1.5">
            <IconHeart size={16} className="text-primary" />
            {t("totalReactions", { count: totalReactions })}
          </span>
          <span className="flex items-center gap-1.5">
            <IconMessageCircle size={16} className="text-primary" />
            {t("totalComments", { count: totalComments })}
          </span>
        </motion.div>

        {/* Articles Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <motion.div
              key={article.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              custom={i % 3}
              variants={fadeUp}
            >
              <BlogCard article={article} />
            </motion.div>
          ))}
        </div>

        {/* View on DEV.to */}
        <motion.div
          className="mt-10 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          custom={0}
          variants={fadeUp}
        >
          <a
            href={`https://dev.to/${DEVTO_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
          >
            {t("viewOnDevTo")}
            <IconExternalLink size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
