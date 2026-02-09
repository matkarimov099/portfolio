import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { BlogSection } from "@/features/blog";
import type { Locale } from "@/lib/seo/config";
import { generatePageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

const seoData: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "Blog",
    description:
      "Read Matkarim Matkarimov's latest articles about web development, React, Next.js, and TypeScript on DEV.to.",
  },
  ru: {
    title: "Блог",
    description:
      "Читайте последние статьи Маткарима Маткаримова о веб-разработке, React, Next.js и TypeScript на DEV.to.",
  },
  uz: {
    title: "Blog",
    description:
      "Matkarim Matkarimovning veb-dasturlash, React, Next.js va TypeScript haqidagi so'nggi maqolalarini DEV.to da o'qing.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const data = seoData[loc] || seoData.en;

  return generatePageMetadata({
    title: data.title,
    description: data.description,
    path: "/blog",
    locale: loc,
  });
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="pt-10">
      <BlogSection />
    </main>
  );
}
