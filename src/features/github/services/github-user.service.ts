import { GITHUB_USERNAME } from "@/shared/config/constants";
import type { GitHubUser } from "../types";

const GITHUB_API = "https://api.github.com";

const headers: HeadersInit = {
  Accept: "application/vnd.github.v3+json",
  ...(process.env.GITHUB_TOKEN && {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  }),
};

interface GitHubUserData {
  user: GitHubUser;
  repoNames: string[];
}

export const githubUserService = {
  getUserData: async (
    username: string = GITHUB_USERNAME,
  ): Promise<GitHubUserData> => {
    const [userRes, reposRes] = await Promise.all([
      fetch(`${GITHUB_API}/users/${username}`, {
        headers,
        next: { revalidate: 3600 },
      }),
      fetch(
        `${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated&type=owner`,
        {
          headers,
          next: { revalidate: 3600 },
        },
      ),
    ]);

    if (!userRes.ok) {
      throw new Error(`GitHub API error: ${userRes.status}`);
    }
    if (!reposRes.ok) {
      throw new Error(`GitHub API error: ${reposRes.status}`);
    }

    const user: GitHubUser = await userRes.json();
    const repos: { name: string }[] = await reposRes.json();

    return {
      user,
      repoNames: repos.map((r) => r.name),
    };
  },
};
