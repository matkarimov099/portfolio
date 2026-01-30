import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ContactSection } from "@/features/contact";
import { BASE_URL, type Locale } from "@/lib/seo/config";

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
  const path = "/contact";
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

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="h-screen overflow-hidden">
      <ContactSection />
    </main>
  );
}
