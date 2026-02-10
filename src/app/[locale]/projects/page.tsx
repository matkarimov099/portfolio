import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/seo";
import { ProjectsSection } from "@/features/projects";
import type { Locale } from "@/lib/seo/config";
import { generatePageMetadata } from "@/lib/seo/metadata";
import {
  generateBreadcrumbSchema,
  generateProjectsListSchema,
} from "@/lib/seo/structured-data";

type Props = {
  params: Promise<{ locale: string }>;
};

const seoData: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "Projects",
    description:
      "Explore open source projects and GitHub repositories by Matkarim Matkarimov. React, Next.js, TypeScript, and more.",
  },
  ru: {
    title: "Проекты",
    description:
      "Изучите open source проекты и репозитории GitHub от Маткарима Маткаримова. React, Next.js, TypeScript и другие.",
  },
  uz: {
    title: "Loyihalar",
    description:
      "Matkarim Matkarimovning open source loyihalari va GitHub repozitoriyalarini ko'ring. React, Next.js, TypeScript va boshqalar.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const data = seoData[loc] || seoData.en;

  return generatePageMetadata({
    title: data.title,
    description: data.description,
    path: "/projects",
    locale: loc,
  });
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="pt-10">
      <JsonLd data={generateProjectsListSchema(locale)} />
      <JsonLd
        data={generateBreadcrumbSchema(locale, [
          { name: "Projects", path: "/projects" },
        ])}
      />
      <ProjectsSection />
    </main>
  );
}
