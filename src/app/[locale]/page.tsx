import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/features/hero";
import { BASE_URL, type Locale } from "@/lib/seo/config";

type Props = {
  params: Promise<{ locale: string }>;
};

const seoData: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "Matkarim Matkarimov | Full Stack Developer",
    description:
      "Full Stack Developer with 6+ years of experience building production-grade web applications with React, Next.js, and TypeScript",
  },
  ru: {
    title: "Маткарим Маткаримов | Full Stack разработчик",
    description:
      "Full Stack разработчик с опытом 6+ лет в создании продакшн-уровневых веб-приложений на React, Next.js и TypeScript",
  },
  uz: {
    title: "Matkarim Matkarimov | Full Stack dasturchi",
    description:
      "6+ yillik tajribaga ega Full Stack dasturchi — React, Next.js va TypeScript bilan production darajadagi veb-ilovalar yarataman",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const data = seoData[loc] || seoData.en;
  const url = `${BASE_URL}/${locale}`;

  return {
    title: data.title,
    description: data.description,
    alternates: {
      canonical: url,
      languages: {
        en: `${BASE_URL}/en`,
        ru: `${BASE_URL}/ru`,
        uz: `${BASE_URL}/uz`,
        "x-default": `${BASE_URL}/en`,
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

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="h-screen overflow-hidden">
      <HeroSection />
    </main>
  );
}
