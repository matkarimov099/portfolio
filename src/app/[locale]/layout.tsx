import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Providers } from "@/core/providers";
import { LanguageSwitcher } from "@/features/layout/components/LanguageSwitcher";
import { NavDock } from "@/features/layout/components/NavDock";
import { SocialDock } from "@/features/layout/components/SocialDock";
import { routing } from "@/i18n/routing";

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
        {children}
        <NavDock />
        <SocialDock />
        <LanguageSwitcher />
      </NextIntlClientProvider>
    </Providers>
  );
}
