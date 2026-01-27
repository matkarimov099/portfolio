import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t py-8">
      <div className="mx-auto max-w-6xl px-6 text-center text-sm text-muted-foreground">
        <p>{t("builtWith")}</p>
        <p className="mt-1">
          {t("copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
