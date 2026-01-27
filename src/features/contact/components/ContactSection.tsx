"use client";

import { useTranslations } from "next-intl";
import {
  IconMail,
  IconBrandTelegram,
  IconBrandLinkedin,
  IconBrandGithub,
} from "@tabler/icons-react";
import { BackgroundBeamsWithCollision } from "@/shared/components/aceternity/background-beams-with-collision";
import { Button } from "@/shared/components/aceternity/moving-border";
import { siteConfig } from "@/shared/config/site";

const CONTACT_CARDS = [
  {
    icon: IconMail,
    label: "Email",
    value: "matkarimov1099@gmail.com",
    href: siteConfig.links.email,
  },
  {
    icon: IconBrandTelegram,
    label: "Telegram",
    value: "@m_matkarimov",
    href: siteConfig.links.telegram,
  },
  {
    icon: IconBrandLinkedin,
    label: "LinkedIn",
    value: "Matkarim Matkarimov",
    href: siteConfig.links.linkedin,
  },
  {
    icon: IconBrandGithub,
    label: "GitHub",
    value: "matkarimov099",
    href: siteConfig.links.github,
  },
] as const;

export function ContactSection() {
  const t = useTranslations("contact");

  return (
    <BackgroundBeamsWithCollision className="min-h-[60vh]">
      <section id="contact" className="relative z-10 w-full py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>

          <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {CONTACT_CARDS.map((card) => (
              <Button
                key={card.label}
                as="a"
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                containerClassName="w-full h-auto"
                className="flex flex-col items-center gap-3 p-6 w-full"
              >
                <card.icon className="h-8 w-8 text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  {card.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {card.value}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </section>
    </BackgroundBeamsWithCollision>
  );
}
