import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { githubService } from "../services/github.service";

const githubKeys = {
  all: ["github"] as const,
  user: (username: string) => [...githubKeys.all, "user", username] as const,
  repos: (username: string) => [...githubKeys.all, "repos", username] as const,
  followers: (username: string) =>
    [...githubKeys.all, "followers", username] as const,
};

const STALE_TIME = 60 * 60 * 1000; // 1 hour

export function useGitHubUser(username: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: githubKeys.user(username),
    queryFn: () => githubService.getUser(username),
    staleTime: STALE_TIME,
  });

  return useMemo(
    () => ({ user: data, isLoading, error }),
    [data, isLoading, error],
  );
}

export function useGitHubRepos(username: string) {
  const { data, isLoading } = useQuery({
    queryKey: githubKeys.repos(username),
    queryFn: () => githubService.getRepos(username),
    staleTime: STALE_TIME,
  });

  return useMemo(
    () => ({
      repos: data?.repos,
      repoNames: data?.repos?.map((r) => r.name),
      privateRepoCount: data?.privateCount ?? 0,
      isLoading,
    }),
    [data, isLoading],
  );
}

export function useGitHubFollowers(username: string) {
  const { data, isLoading } = useQuery({
    queryKey: githubKeys.followers(username),
    queryFn: () => githubService.getFollowers(username),
    staleTime: STALE_TIME,
  });

  return useMemo(() => ({ followers: data, isLoading }), [data, isLoading]);
}
