"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import {
  IconBrandReact,
  IconBrandNextjs,
  IconBrandTypescript,
  IconBrandTailwind,
  IconBrandGithub,
  IconBrandTelegram,
  IconBrandLinkedin,
  IconTerminal2,
  IconHeart,
} from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";
import { NAV_ITEMS, SOCIAL_LINKS } from "@/shared/config/constants";
import { siteConfig } from "@/shared/config/site";

const TECH_STACK = [
  { icon: IconBrandReact, name: "React" },
  { icon: IconBrandNextjs, name: "Next.js" },
  { icon: IconBrandTypescript, name: "TypeScript" },
  { icon: IconBrandTailwind, name: "Tailwind" },
];

const SOCIAL_ICONS: Record<string, typeof IconBrandGithub> = {
  github: IconBrandGithub,
  linkedin: IconBrandLinkedin,
  telegram: IconBrandTelegram,
};

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="relative border-t border-border bg-card/50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Terminal block */}
          <div>
            <div className="rounded-lg border border-border bg-background p-4 font-mono text-sm">
              <div className="flex items-center gap-2 border-b border-border pb-2 mb-3">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <span className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs text-muted-foreground">
                  terminal
                </span>
              </div>
              <p className="text-muted-foreground">
                <span className="text-primary">$</span> matkarim --version
              </p>
              <p className="text-foreground">{t("version")}</p>
              <p className="mt-2 text-muted-foreground">
                <span className="text-primary">$</span> matkarim --status
              </p>
              <p className="text-emerald-500">{t("status")}</p>
              <motion.span
                className="inline-block h-4 w-1.5 bg-primary"
                animate={{ opacity: [1, 0] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 font-mono text-sm font-semibold text-primary">
              {"// Navigation"}
            </h3>
            <nav className="flex flex-col gap-2">
              {NAV_ITEMS.map((navItem) => (
                <Link
                  key={navItem.key}
                  href={navItem.href as any}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {tNav(navItem.key)}
                </Link>
              ))}
            </nav>
          </div>

          {/* Tech stack + socials */}
          <div>
            <h3 className="mb-4 font-mono text-sm font-semibold text-primary">
              {"// Tech Stack"}
            </h3>
            <div className="flex flex-wrap gap-3">
              {TECH_STACK.map((tech) => (
                <div
                  key={tech.name}
                  className="flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2.5 py-1 text-xs text-muted-foreground"
                >
                  <tech.icon size={14} />
                  {tech.name}
                </div>
              ))}
            </div>

            <h3 className="mb-3 mt-6 font-mono text-sm font-semibold text-primary">
              {"// Connect"}
            </h3>
            <div className="flex gap-3">
              {SOCIAL_LINKS.filter((s) => SOCIAL_ICONS[s.icon]).map(
                (social) => {
                  const SocialIcon = SOCIAL_ICONS[social.icon];
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md border border-border p-2 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      <SocialIcon size={18} />
                    </a>
                  );
                },
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 md:flex-row">
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            {t("builtWith")} <IconHeart size={12} className="text-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
