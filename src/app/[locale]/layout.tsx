import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Providers } from "@/core/providers";
import { routing } from "@/i18n/routing";
import { Header } from "@/features/layout/components/Header";
import { Footer } from "@/features/layout/components/Footer";
import { SocialDock } from "@/features/layout/components/SocialDock";

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
        <Header />
        {children}
        <Footer />
        <SocialDock />
      </NextIntlClientProvider>
    </Providers>
  );
}
