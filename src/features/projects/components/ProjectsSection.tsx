import { getTranslations } from "next-intl/server";
import { githubService } from "../services/github.service";
import { ProjectsGrid } from "./ProjectsGrid";
import { ProjectsTitle } from "./ProjectsTitle";

export async function ProjectsSection() {
  const t = await getTranslations("projects");

  let repos: Awaited<ReturnType<typeof githubService.getRepos>> = [];
  try {
    repos = await githubService.getRepos();
  } catch {
    repos = [];
  }

  return (
    <section className="py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="font-mono text-sm text-primary">{"// my-projects"}</p>
          <ProjectsTitle title={t("title")} />
          <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        </div>
        <ProjectsGrid repos={repos} />
      </div>
    </section>
  );
}
