import { useTranslations } from "next-intl";

export function ContactSection() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="py-24">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      </div>
    </section>
  );
}
