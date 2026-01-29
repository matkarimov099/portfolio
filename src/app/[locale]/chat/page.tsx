import { setRequestLocale } from "next-intl/server";
import { ChatSection } from "@/features/chat";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ChatPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="pt-10">
      <ChatSection />
    </main>
  );
}
