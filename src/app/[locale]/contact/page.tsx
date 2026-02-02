import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ContactSection } from "@/features/contact";
import type { Locale } from "@/lib/seo/config";
import { generatePageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

const seoData: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "Contact",
    description:
      "Get in touch with Matkarim Matkarimov for collaboration, job opportunities, or project inquiries. Email, Telegram, LinkedIn available.",
  },
  ru: {
    title: "Контакты",
    description:
      "Свяжитесь с Маткаримом Маткаримовым для сотрудничества, вакансий или проектов. Доступны Email, Telegram, LinkedIn.",
  },
  uz: {
    title: "Aloqa",
    description:
      "Matkarim Matkarimov bilan hamkorlik, ish takliflari yoki loyihalar uchun bog'laning. Email, Telegram, LinkedIn mavjud.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const data = seoData[loc] || seoData.en;

  return generatePageMetadata({
    title: data.title,
    description: data.description,
    path: "/contact",
    locale: loc,
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="h-screen overflow-hidden">
      <ContactSection />
    </main>
  );
}
