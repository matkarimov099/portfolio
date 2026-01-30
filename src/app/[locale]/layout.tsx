import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Providers } from "@/core/providers";
import { ChatProvider, ChatWidget } from "@/features/chat";
import { LanguageSwitcher } from "@/features/layout/components/LanguageSwitcher";
import { NavDock } from "@/features/layout/components/NavDock";
import { SocialDock } from "@/features/layout/components/SocialDock";
import { routing } from "@/i18n/routing";
import { CameraProvider } from "@/shared/context/CameraContext";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <Providers>
      <NextIntlClientProvider messages={messages} locale={locale}>
        <CameraProvider>
          <ChatProvider>
            {children}
            <NavDock />
            <SocialDock />
            <LanguageSwitcher />
            <ChatWidget />
          </ChatProvider>
        </CameraProvider>
      </NextIntlClientProvider>
    </Providers>
  );
}
