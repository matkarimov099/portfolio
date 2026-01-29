export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  type: string;
  company: string | null;
  location: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  total_private_repos?: number;
  owned_private_repos?: number;
}

export interface GitHubFollower {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  private: boolean;
  html_url: string;
  updated_at: string;
}

// Chart types
export interface LanguageData {
  name: string;
  value: number;
  color: string;
}

export interface RepoStarsData {
  name: string;
  stars: number;
  forks: number;
}

export interface ActivityData {
  month: string;
  repos: number;
}
