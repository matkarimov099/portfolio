"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { NAV_ITEMS } from "@/shared/config/constants";
import { Link, usePathname } from "@/i18n/navigation";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarButton,
} from "@/shared/components/aceternity/resizable-navbar";

export function Header() {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navItems = NAV_ITEMS.map((item) => ({
    name: t(item.key),
    link: item.href,
  }));

  return (
    <Navbar>
      <NavBody>
        <Link
          href="/"
          className="relative z-20 flex items-center gap-1.5 text-lg font-bold text-foreground"
        >
          <span className="font-mono text-primary">&lt;/&gt;</span>
          <span>Frontend Developer</span>
        </Link>
        <NavItems items={navItems} />
        <div className="flex items-center gap-2">
          <NavbarButton href="/contact" variant="gradient">
            {t("contact")}
          </NavbarButton>
        </div>
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-lg font-bold text-foreground"
          >
            <span className="font-mono text-primary">&lt;/&gt;</span>
            <span>Frontend Developer</span>
          </Link>
          <MobileNavToggle
            isOpen={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
          />
        </MobileNavHeader>
        <MobileNavMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)}>
          {navItems.map((navItem) => (
            <Link
              key={navItem.link}
              href={navItem.link as any}
              onClick={() => setMobileOpen(false)}
              className={`text-sm ${
                pathname === navItem.link
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              {navItem.name}
            </Link>
          ))}
          <div className="flex w-full items-center justify-end">
            <NavbarButton href="/contact" variant="gradient">
              {t("contact")}
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
