import axios from "axios";
import type { GitHubFollower, GitHubRepo, GitHubUser } from "../types";

const githubApi = axios.create();

export const githubService = {
  getUser: async (username: string): Promise<GitHubUser> => {
    const { data } = await githubApi.get<GitHubUser>(
      `/api/github/user?username=${username}`,
    );
    return data;
  },

  getRepos: async (
    username: string,
  ): Promise<{ repos: GitHubRepo[]; privateCount: number }> => {
    const { data } = await githubApi.get<GitHubRepo[]>(
      `/api/github/repos?username=${username}`,
    );
    return {
      repos: data,
      privateCount: data.filter((r) => r.private).length,
    };
  },

  getFollowers: async (username: string): Promise<GitHubFollower[]> => {
    const { data } = await githubApi.get<GitHubFollower[]>(
      `/api/github/followers?username=${username}`,
    );
    return data;
  },
};
