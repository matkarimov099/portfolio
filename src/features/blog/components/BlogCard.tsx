"use client";

import {
  IconClock,
  IconExternalLink,
  IconHeart,
  IconMessageCircle,
} from "@tabler/icons-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { DevToArticle } from "../types";

interface Props {
  article: DevToArticle;
}

export function BlogCard({ article }: Props) {
  const t = useTranslations("blog");

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
    >
      {(article.cover_image ?? article.social_image) ? (
        <div className="relative aspect-[2/1] w-full overflow-hidden">
          <Image
            src={article.cover_image ?? article.social_image ?? ""}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="flex aspect-[2/1] w-full items-center justify-center bg-gradient-to-br from-emerald-900/40 to-cyan-900/40">
          <span className="font-mono text-4xl text-primary/30">{"</>"}</span>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap gap-1.5">
          {article.tag_list.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[10px] font-medium text-primary"
            >
              #{tag}
            </span>
          ))}
        </div>

        <h3 className="line-clamp-2 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
          {article.title}
        </h3>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {article.description}
        </p>

        <div className="mt-auto flex items-center gap-4 pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <IconClock size={13} />
            {t("readTime", { min: article.reading_time_minutes })}
          </span>
          <span className="flex items-center gap-1">
            <IconHeart size={13} />
            {article.public_reactions_count}
          </span>
          <span className="flex items-center gap-1">
            <IconMessageCircle size={13} />
            {article.comments_count}
          </span>
          <span className="ml-auto flex items-center gap-1 text-primary opacity-0 transition-opacity group-hover:opacity-100">
            {t("readMore")}
            <IconExternalLink size={13} />
          </span>
        </div>
      </div>
    </a>
  );
}
