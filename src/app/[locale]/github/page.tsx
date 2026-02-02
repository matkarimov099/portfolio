import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { GitHubSection } from "@/features/github";
import type { Locale } from "@/lib/seo/config";
import { generatePageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

const seoData: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "GitHub Profile",
    description:
      "View Matkarim Matkarimov's GitHub activity, repositories, contributions, and coding statistics.",
  },
  ru: {
    title: "GitHub Профиль",
    description:
      "Посмотрите GitHub активность, репозитории, вклады и статистику программирования Маткарима Маткаримова.",
  },
  uz: {
    title: "GitHub Profil",
    description:
      "Matkarim Matkarimovning GitHub faoliyati, repozitoriyalari, hissalari va dasturlash statistikasini ko'ring.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const data = seoData[loc] || seoData.en;

  return generatePageMetadata({
    title: data.title,
    description: data.description,
    path: "/github",
    locale: loc,
  });
}

export default async function GitHubPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="pt-10">
      <GitHubSection />
    </main>
  );
}
