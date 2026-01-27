import { setRequestLocale } from "next-intl/server";
import { GitHubSection } from "@/features/github";

export default async function GitHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="pt-24">
      <GitHubSection />
    </main>
  );
}
