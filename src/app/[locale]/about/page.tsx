import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { AboutSection } from "@/features/about";
import { BASE_URL, type Locale } from "@/lib/seo/config";

type Props = {
  params: Promise<{ locale: string }>;
};

const seoData: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "About Me",
    description:
      "Learn about Matkarim Matkarimov - Full Stack Developer with 6+ years of experience. Skills, education, and professional journey.",
  },
  ru: {
    title: "Обо мне",
    description:
      "Узнайте о Маткариме Маткаримове - Full Stack разработчик с опытом 6+ лет. Навыки, образование и профессиональный путь.",
  },
  uz: {
    title: "Men haqimda",
    description:
      "Matkarim Matkarimov haqida - 6+ yillik tajribaga ega Full Stack dasturchi. Ko'nikmalar, ta'lim va professional yo'l.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const data = seoData[loc] || seoData.en;
  const path = "/about";
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
      type: "profile",
      locale: locale === "ru" ? "ru_RU" : locale === "uz" ? "uz_UZ" : "en_US",
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="pt-10">
      <AboutSection />
    </main>
  );
}
