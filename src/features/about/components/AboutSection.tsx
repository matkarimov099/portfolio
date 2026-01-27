import { useTranslations } from "next-intl";

export function AboutSection() {
  const t = useTranslations("about");

  return (
    <section id="about" className="py-24">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
        <p className="mt-4 text-muted-foreground">{t("description")}</p>
      </div>
    </section>
  );
}
