import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { devtoService } from "../services/devto.service";

const devtoKeys = {
  all: ["devto"] as const,
  articles: (username: string) =>
    [...devtoKeys.all, "articles", username] as const,
};

const STALE_TIME = 60 * 60 * 1000; // 1 hour

export function useDevToArticles(username: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: devtoKeys.articles(username),
    queryFn: () => devtoService.getArticles(username),
    staleTime: STALE_TIME,
  });

  return useMemo(
    () => ({
      articles: data,
      totalReactions:
        data?.reduce((sum, a) => sum + a.public_reactions_count, 0) ?? 0,
      totalComments: data?.reduce((sum, a) => sum + a.comments_count, 0) ?? 0,
      isLoading,
      error,
    }),
    [data, isLoading, error],
  );
}
