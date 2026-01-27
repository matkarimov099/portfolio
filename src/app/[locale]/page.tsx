import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/features/hero";
import { AboutSection } from "@/features/about";
import { ProjectsSection } from "@/features/projects";
import { ContactSection } from "@/features/contact";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}
