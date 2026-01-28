"use client";

import {
  IconBrandGithub,
  IconExternalLink,
  IconGitFork,
  IconStar,
} from "@tabler/icons-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  CardBody,
  CardContainer,
  CardItem,
} from "@/shared/components/aceternity/3d-card";
import { TypewriterEffect } from "@/shared/components/aceternity/typewriter-effect";
import { GITHUB_USERNAME } from "@/shared/config/constants";

interface Repo {
  id: number;
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "from-blue-500 to-cyan-500",
  JavaScript: "from-yellow-500 to-orange-500",
  Python: "from-green-500 to-emerald-500",
  HTML: "from-red-500 to-orange-500",
  CSS: "from-purple-500 to-pink-500",
  Vue: "from-emerald-500 to-green-500",
  Dart: "from-cyan-500 to-blue-500",
};

export function FeaturedProjects({ repos }: { repos: Repo[] }) {
  const featured = repos.slice(0, 3);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-sm text-primary">
              {"// featured-projects"}
            </p>
            <TypewriterEffect
              words={[{ text: "Featured" }, { text: "Projects" }]}
              className="mt-2 text-3xl font-bold tracking-tight"
              cursorClassName="bg-primary"
            />
          </div>
          <Link
            href="/projects"
            className="hidden items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground sm:inline-flex"
          >
            View All
            <IconExternalLink size={14} />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {featured.map((repo) => (
            <CardContainer containerClassName="py-0" key={repo.id}>
              <CardBody className="relative group/card dark:hover:shadow-2xl dark:hover:shadow-primary/[0.1] bg-card border-border w-full h-auto rounded-xl border overflow-hidden">
                <CardItem translateZ={30} className="w-full">
                  <div
                    className={`aspect-video w-full bg-gradient-to-br ${LANG_COLORS[repo.language || ""] || "from-primary to-cyan-500"} relative overflow-hidden`}
                  >
                    <Image
                      src={`https://opengraph.githubassets.com/1/${GITHUB_USERNAME}/${repo.name}`}
                      alt={repo.name}
                      fill
                      className="object-cover opacity-90 transition-transform group-hover/card:scale-105"
                    />
                  </div>
                </CardItem>
                <div className="p-5">
                  <CardItem
                    translateZ={50}
                    className="text-lg font-semibold text-foreground"
                  >
                    {repo.name}
                  </CardItem>
                  <CardItem
                    translateZ={40}
                    className="mt-1 line-clamp-2 text-sm text-muted-foreground"
                  >
                    {repo.description || "No description"}
                  </CardItem>
                  <CardItem
                    translateZ={30}
                    className="mt-3 flex items-center gap-3"
                  >
                    {repo.language && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <IconStar size={12} /> {repo.stars}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <IconGitFork size={12} /> {repo.forks}
                    </span>
                  </CardItem>
                  <CardItem translateZ={60} className="mt-4 flex gap-2">
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-muted/80"
                    >
                      <IconBrandGithub size={14} /> Code
                    </a>
                    {repo.homepage && (
                      <a
                        href={repo.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground"
                      >
                        <IconExternalLink size={14} /> Demo
                      </a>
                    )}
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground"
          >
            View All Projects
            <IconExternalLink size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
