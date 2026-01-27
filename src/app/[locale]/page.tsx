import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/features/hero";
import { ProfileCard } from "@/features/home/components/ProfileCard";
import { StatsCard } from "@/features/home/components/StatsCard";
import { WhatIDoSection } from "@/features/home/components/WhatIDoSection";
import { FeaturedProjects } from "@/features/home/components/FeaturedProjects";
import { CTASection } from "@/features/home/components/CTASection";
import { SectionTitle } from "@/features/home/components/SectionTitle";
import { githubUserService } from "@/features/github/services/github-user.service";
import { githubService } from "@/features/projects/services/github.service";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let user = null;
  let repos: Awaited<ReturnType<typeof githubService.getRepos>> = [];
  try {
    const [userData, reposData] = await Promise.all([
      githubUserService.getUserData(),
      githubService.getRepos(),
    ]);
    user = userData.user;
    repos = reposData;
  } catch {
    user = null;
    repos = [];
  }

  return (
    <main>
      <HeroSection />
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="font-mono text-sm text-primary">{"// about-me"}</p>
            <SectionTitle
              words={[{ text: "Developer" }, { text: "Profile" }]}
            />
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <ProfileCard user={user} />
            <StatsCard user={user} />
          </div>
        </div>
      </section>
      <WhatIDoSection />
      <FeaturedProjects repos={repos} />
      <CTASection />
    </main>
  );
}
