import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ProjectsSection } from "@/features/projects";
import { BASE_URL, type Locale } from "@/lib/seo/config";

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
  const path = "/projects";
  const url = `${BASE_URL}/${locale}${path}`;

  return {
    title: data.title,
    description: data.description,
    alternates: {
      canonical: url,
      languages: {
        en: `${BASE_URL}/en${path}`,
        ru: `${BASE_URL}/ru${path}`,
        uz: `${BASE_URL}/uz${path}`,
        "x-default": `${BASE_URL}/en${path}`,
      },
    },
    openGraph: {
      title: data.title,
      description: data.description,
      url,
      locale: locale === "ru" ? "ru_RU" : locale === "uz" ? "uz_UZ" : "en_US",
    },
  };
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="pt-10">
      <ProjectsSection />
    </main>
  );
}
