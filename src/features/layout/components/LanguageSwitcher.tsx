"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { AnimatePresence, motion } from "motion/react";

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
    <div className="fixed bottom-6 right-6 z-50">
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
              transition={{ delay: (otherLocales.length - 1 - idx) * 0.05 }}
              className="absolute right-0"
              style={{ bottom: `${(otherLocales.length - idx) * 48 + 8}px` }}
            >
              <button
                onClick={() => switchLocale(loc)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-bold text-muted-foreground shadow-2xl backdrop-blur-xl transition-colors hover:bg-white/10 hover:text-foreground"
              >
                {LOCALE_LABELS[loc]}
              </button>
            </motion.div>
          ))}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-bold text-primary shadow-2xl backdrop-blur-xl transition-colors hover:bg-white/10"
      >
        {LOCALE_LABELS[locale]}
      </button>
    </div>
  );
}
