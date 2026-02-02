import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/features/hero";
import type { Locale } from "@/lib/seo/config";
import { generatePageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

const seoData: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "Matkarimov Matkarim | Full Stack Developer Uzbekistan",
    description:
      "Matkarimov Matkarim (Matkarim Matkarimov) - Full Stack Developer from Uzbekistan with 6+ years of experience. Expert in React, Next.js, TypeScript, Node.js, PostgreSQL. Building modern web applications at UNICON-SOFT, Tashkent.",
  },
  ru: {
    title: "Маткаримов Маткарим | Full Stack разработчик Узбекистан",
    description:
      "Маткаримов Маткарим (Маткарим Маткаримов) - Full Stack разработчик из Узбекистана с опытом 6+ лет. Эксперт в React, Next.js, TypeScript, Node.js, PostgreSQL. Разработка современных веб-приложений в UNICON-SOFT, Ташкент.",
  },
  uz: {
    title: "Matkarimov Matkarim | Full Stack dasturchi O'zbekiston",
    description:
      "Matkarimov Matkarim (Matkarim Matkarimov) - O'zbekistondan 6+ yillik tajribaga ega Full Stack dasturchi. React, Next.js, TypeScript, Node.js, PostgreSQL bo'yicha ekspert. Zamonaviy veb-ilovalar ishlab chiqish, UNICON-SOFT, Toshkent.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const data = seoData[loc] || seoData.en;

  return generatePageMetadata({
    title: data.title,
    description: data.description,
    path: "",
    locale: loc,
  });
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
