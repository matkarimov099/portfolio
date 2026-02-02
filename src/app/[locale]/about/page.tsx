import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/seo";
import { AboutSection } from "@/features/about";
import type { Locale } from "@/lib/seo/config";
import { generatePageMetadata } from "@/lib/seo/metadata";
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

  return generatePageMetadata({
    title: data.title,
    description: data.description,
    path: "/about",
    locale: loc,
    type: "profile",
  });
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
