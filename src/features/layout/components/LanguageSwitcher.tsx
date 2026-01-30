"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLocale } from "next-intl";
import { useState } from "react";
import { routing, usePathname, useRouter } from "@/i18n/routing";

const LOCALE_LABELS: Record<string, string> = {
  en: "EN",
  ru: "RU",
  uz: "UZ",
};

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const otherLocales = routing.locales.filter((loc) => loc !== locale);

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setOpen(false);
  };

  return (
    <div className="fixed bottom-6 left-4 z-50">
      <AnimatePresence>
        {open &&
          otherLocales.map((loc, idx) => (
            <motion.div
              key={loc}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: 10,
                transition: { delay: idx * 0.05 },
              }}
              transition={{ delay: (otherLocales.length - 1 - idx) * 0.08 }}
              className="absolute left-0"
              style={{ bottom: `${(otherLocales.length - idx) * 56 + 8}px` }}
            >
              <button
                type="button"
                onClick={() => switchLocale(loc)}
                aria-label={`Switch to ${loc === "en" ? "English" : loc === "ru" ? "Russian" : "Uzbek"}`}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-bold text-muted-foreground shadow-2xl backdrop-blur-xl transition-colors hover:bg-white/10 hover:text-foreground"
              >
                {LOCALE_LABELS[loc]}
              </button>
            </motion.div>
          ))}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={`Current language: ${locale === "en" ? "English" : locale === "ru" ? "Russian" : "Uzbek"}. Click to change`}
        aria-expanded={open}
        className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-bold text-primary shadow-2xl backdrop-blur-xl transition-colors hover:bg-white/10"
      >
        {LOCALE_LABELS[locale]}
      </button>
    </div>
  );
}
