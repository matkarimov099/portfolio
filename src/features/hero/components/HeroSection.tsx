import { useTranslations } from "next-intl";

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section
      id="hero"
      className="flex min-h-screen items-center justify-center"
    >
      <div className="text-center">
        <p className="text-lg text-muted-foreground">{t("greeting")}</p>
        <h1 className="mt-2 text-5xl font-bold tracking-tight">{t("name")}</h1>
        <p className="mt-4 text-xl text-muted-foreground">{t("role")}</p>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          {t("description")}
        </p>
      </div>
    </section>
  );
}
