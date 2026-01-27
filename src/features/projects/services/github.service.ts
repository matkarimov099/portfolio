import { GITHUB_USERNAME } from "@/shared/config/constants";
import type { GitHubRepo } from "../types";

const GITHUB_API = "https://api.github.com";

interface GitHubApiRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  fork: boolean;
  archived: boolean;
  updated_at: string;
}

function mapRepo(repo: GitHubApiRepo): GitHubRepo {
  return {
    id: repo.id,
    name: repo.name,
    description: repo.description,
    url: repo.html_url,
    homepage: repo.homepage,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language,
    topics: repo.topics,
    updatedAt: repo.updated_at,
  };
}

export const githubService = {
  getRepos: async (
    username: string = GITHUB_USERNAME,
  ): Promise<GitHubRepo[]> => {
    const res = await fetch(
      `${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated&type=owner`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          }),
        },
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const repos: GitHubApiRepo[] = await res.json();

    return repos.filter((r) => !r.fork && !r.archived).map(mapRepo);
  },
};
