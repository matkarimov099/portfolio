"use client";

import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTelegram,
  IconBrandInstagram,
  IconMail,
} from "@tabler/icons-react";
import { FloatingDock } from "@/shared/components/aceternity/floating-dock";
import { siteConfig } from "@/shared/config/site";

const items = [
  {
    title: "GitHub",
    icon: <IconBrandGithub className="h-full w-full" />,
    href: siteConfig.links.github,
  },
  {
    title: "LinkedIn",
    icon: <IconBrandLinkedin className="h-full w-full" />,
    href: siteConfig.links.linkedin,
  },
  {
    title: "Telegram",
    icon: <IconBrandTelegram className="h-full w-full" />,
    href: siteConfig.links.telegram,
  },
  {
    title: "Instagram",
    icon: <IconBrandInstagram className="h-full w-full" />,
    href: siteConfig.links.instagram,
  },
  {
    title: "Email",
    icon: <IconMail className="h-full w-full" />,
    href: siteConfig.links.email,
  },
];

export function SocialDock() {
  return (
    <FloatingDock items={items} desktopClassName="fixed bottom-6 left-6 z-50" />
  );
}
