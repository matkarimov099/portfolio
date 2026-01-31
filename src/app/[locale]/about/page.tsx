import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/seo";
import { AboutSection } from "@/features/about";
import { BASE_URL, type Locale } from "@/lib/seo/config";
import { generateProfilePageSchema } from "@/lib/seo/structured-data";

type Props = {
  params: Promise<{ locale: string }>;
};

const seoData: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "About Matkarimov Matkarim - Full Stack Developer",
    description:
      "About Matkarim Matkarimov (Matkarimov Matkarim) - Full Stack Developer from Uzbekistan with 6+ years of experience. Expert in React, Next.js, TypeScript, Node.js. Graduate of TUIT, currently working at UNICON-SOFT in Tashkent.",
  },
  ru: {
    title: "О Маткаримове Маткариме - Full Stack разработчик",
    description:
      "О Маткариме Маткаримове - Full Stack разработчик из Узбекистана с опытом 6+ лет. Эксперт в React, Next.js, TypeScript, Node.js. Выпускник ТУИТ, работает в UNICON-SOFT в Ташкенте.",
  },
  uz: {
    title: "Matkarimov Matkarim haqida - Full Stack dasturchi",
    description:
      "Matkarim Matkarimov (Matkarimov Matkarim) haqida - O'zbekistondan 6+ yillik tajribaga ega Full Stack dasturchi. React, Next.js, TypeScript, Node.js bo'yicha ekspert. TUIT bitiruvchisi, Toshkentda UNICON-SOFTda ishlaydi.",
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
      <JsonLd data={generateProfilePageSchema(locale)} />
      <AboutSection />
    </main>
  );
}
