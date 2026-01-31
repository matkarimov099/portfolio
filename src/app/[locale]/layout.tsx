import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Toaster } from "sonner";
import { JsonLd } from "@/components/seo";
import { Providers } from "@/core/providers";
import { ChatProvider, ChatWidget } from "@/features/chat";
import { LanguageSwitcher } from "@/features/layout/components/LanguageSwitcher";
import { NavDock } from "@/features/layout/components/NavDock";
import { SocialDock } from "@/features/layout/components/SocialDock";
import { routing } from "@/i18n/routing";
import {
  generatePersonSchema,
  generateWebSiteSchema,
} from "@/lib/seo/structured-data";
import { OnlineCounter } from "@/shared/components/OnlineCounter";
import { CameraProvider } from "@/shared/context/CameraContext";
import { PresenceProvider } from "@/shared/context/PresenceContext";

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
        <PresenceProvider>
          <CameraProvider>
            <ChatProvider>
              {/* JSON-LD Structured Data */}
              <JsonLd data={generatePersonSchema()} />
              <JsonLd data={generateWebSiteSchema()} />

              {children}
              <NavDock />
              <SocialDock />
              <LanguageSwitcher />
              <ChatWidget />
              <Toaster
                position="top-center"
                richColors
                closeButton
                duration={4000}
                toastOptions={{
                  classNames: {
                    toast: "font-sans",
                    title: "text-foreground",
                    description: "text-muted-foreground",
                  },
                }}
              />
              {/* Online counter - chap yuqori burchak */}
              <div className="fixed left-4 top-4 z-40 rounded-full border border-white/10 bg-background/80 px-3 py-1.5 backdrop-blur-sm">
                <OnlineCounter />
              </div>
            </ChatProvider>
          </CameraProvider>
        </PresenceProvider>
      </NextIntlClientProvider>
    </Providers>
  );
}
