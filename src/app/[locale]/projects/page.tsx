import { setRequestLocale } from "next-intl/server";
import { ProjectsSection } from "@/features/projects";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="pt-10">
      <ProjectsSection />
    </main>
  );
}
