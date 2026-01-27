import { setRequestLocale } from "next-intl/server";
import { ContactSection } from "@/features/contact";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="pt-24">
      <ContactSection />
    </main>
  );
}
