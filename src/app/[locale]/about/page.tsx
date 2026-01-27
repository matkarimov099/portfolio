import { setRequestLocale } from "next-intl/server";
import { AboutSection } from "@/features/about";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="pt-24">
      <AboutSection />
    </main>
  );
}
