import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ChatSection } from "@/features/chat";
import type { Locale } from "@/lib/seo/config";
import { generatePageMetadata } from "@/lib/seo/metadata";

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

  return generatePageMetadata({
    title: data.title,
    description: data.description,
    path: "/chat",
    locale: loc,
  });
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
