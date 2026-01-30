import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ChatSection } from "@/features/chat";
import { BASE_URL, type Locale } from "@/lib/seo/config";

type Props = {
  params: Promise<{ locale: string }>;
};

const seoData: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "Chat",
    description:
      "Send a direct message to Matkarim Matkarimov through the live chat. Quick responses for inquiries and collaboration.",
  },
  ru: {
    title: "Чат",
    description:
      "Отправьте сообщение Маткариму Маткаримову через живой чат. Быстрые ответы на вопросы и предложения о сотрудничестве.",
  },
  uz: {
    title: "Chat",
    description:
      "Matkarim Matkarimovga jonli chat orqali xabar yuboring. Savollar va hamkorlik takliflari uchun tez javoblar.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const data = seoData[loc] || seoData.en;
  const path = "/chat";
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

export default async function ChatPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="h-screen overflow-hidden">
      <ChatSection />
    </main>
  );
}
