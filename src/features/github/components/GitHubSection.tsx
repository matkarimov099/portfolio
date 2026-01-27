import { getTranslations } from "next-intl/server";
import { githubUserService } from "../services/github-user.service";
import { GitHubProfileCard } from "./GitHubProfileCard";
import { GitHubStats } from "./GitHubStats";
import { GitHubDetails } from "./GitHubDetails";
import { GitHubRepoList } from "./GitHubRepoList";

export async function GitHubSection() {
  const t = await getTranslations("github");
  const { user, repoNames } = await githubUserService.getUserData();

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="font-mono text-sm text-primary">
            {"// github-profile"}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            {t("title")}
          </h2>
          <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        </div>
        <GitHubProfileCard user={user} />
        <GitHubStats user={user} />
        <GitHubDetails user={user} />
        <GitHubRepoList repoNames={repoNames} />
      </div>
    </section>
  );
}
