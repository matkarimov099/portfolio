import axios from "axios";
import type { GitHubUser, GitHubFollower } from "../types";

const githubApi = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github.v3+json",
    ...(process.env.NEXT_PUBLIC_GITHUB_TOKEN && {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
    }),
  },
});

export const githubService = {
  getUser: async (username: string): Promise<GitHubUser> => {
    const { data } = await githubApi.get<GitHubUser>(`/users/${username}`);
    return data;
  },

  getRepos: async (username: string): Promise<string[]> => {
    const { data } = await githubApi.get<{ name: string }[]>(
      `/users/${username}/repos?per_page=100&sort=updated&type=owner`,
    );
    return data.map((r) => r.name);
  },

  getFollowers: async (username: string): Promise<GitHubFollower[]> => {
    const { data } = await githubApi.get<GitHubFollower[]>(
      `/users/${username}/followers?per_page=100`,
    );
    return data;
  },
};
