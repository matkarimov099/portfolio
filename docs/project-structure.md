# Portfolio Loyiha Strukturasi

## Texnologiyalar

| Texnologiya | Versiya | Maqsad |
|---|---|---|
| Next.js | 16 | App Router, SSR/SSG, Server Components |
| React | 19 | UI framework, React Compiler |
| TypeScript | 5 | Strict mode, type safety |
| Tailwind CSS | 4 | Styling (PostCSS orqali) |
| Biome | 2.x | Linting + formatting (ESLint/Prettier o'rniga) |
| next-intl | latest | i18n — 3 til (en, ru, uz) |
| motion | latest | Animatsiyalar (`import { motion } from "motion/react"`) |
| @tabler/icons-react | latest | Ikonkalar (2000+ icon) |
| clsx | latest | Conditional class names |
| tailwind-merge | latest | Tailwind class conflict resolver |
| shadcn/ui | latest | Radix-based UI komponentlar (copy-paste) |

### O'rnatish buyruqlari

```bash
# Asosiy kutubxonalar
pnpm add next-intl motion @tabler/icons-react clsx tailwind-merge

# shadcn/ui — mavjud loyihaga init qilish
pnpm dlx shadcn@latest init
```

> **Eslatma:** `pnpm dlx shadcn@latest create ...` buyrug'i yangi loyiha yaratadi. Mavjud loyihaga faqat `init` ishlatiladi. CLI o'zi konfiguratsiya so'raydi (style, base color, icon library va h.k.).

---

## Papka Strukturasi

```
portfolio/
├── public/                               # Statik fayllar
│   ├── images/
│   │   ├── avatar.webp                   # Profil rasmi (WebP format — optimallashtirilgan)
│   │   └── og-image.png                  # Open Graph rasmi (ijtimoiy tarmoqlar uchun)
│   └── fonts/                            # Lokal shriftlar (agar kerak bo'lsa)
│
├── src/
│   ├── app/                              # Next.js App Router
│   │   ├── [locale]/                     # i18n dynamic segment (en | ru | uz)
│   │   │   ├── layout.tsx                # Locale layout — NextIntlClientProvider, Header, Footer
│   │   │   ├── page.tsx                  # Bosh sahifa — Hero + About + Projects + Contact sectionlarni birlashtiradi
│   │   │   └── projects/
│   │   │       └── page.tsx              # Alohida loyihalar sahifasi — barcha GitHub repolar, filtr
│   │   ├── layout.tsx                    # Root layout — html lang, fonts, metadata, ThemeProvider
│   │   ├── not-found.tsx                 # 404 sahifa
│   │   └── robots.ts                     # SEO — robots.txt generatsiya
│   │
│   ├── core/                             # Loyiha yadro sozlamalari
│   │   └── providers/
│   │       ├── index.tsx                 # Barcha providerlarni compose qiladi
│   │       └── theme-provider.tsx        # Dark/light mode provider (class-based)
│   │
│   ├── features/                         # Feature-based modullar (har biri mustaqil)
│   │   │
│   │   ├── hero/                         # ══ Hero Section ══
│   │   │   ├── components/
│   │   │   │   ├── HeroSection.tsx       # Asosiy hero — ism, lavozim, CTA tugma, avatar
│   │   │   │   ├── HeroBackground.tsx    # Animatsion fon (gradient yoki particlelar)
│   │   │   │   └── SocialLinks.tsx       # GitHub, LinkedIn, Telegram ikonkalari
│   │   │   └── index.ts                  # export { HeroSection } from './components/HeroSection'
│   │   │
│   │   ├── about/                        # ══ About Section ══
│   │   │   ├── components/
│   │   │   │   ├── AboutSection.tsx      # Haqimda matn + tajriba + skill grid
│   │   │   │   ├── SkillCard.tsx         # Bitta skill — ikonka, nomi, daraja (progress bar)
│   │   │   │   └── ExperienceTimeline.tsx # Ish tajribasi timeline
│   │   │   ├── types/
│   │   │   │   └── index.ts             # Skill { name, icon, level }, Experience { company, role, period }
│   │   │   └── index.ts
│   │   │
│   │   ├── projects/                     # ══ GitHub Projects Section ══
│   │   │   ├── components/
│   │   │   │   ├── ProjectsSection.tsx   # Section wrapper — sarlavha + grid + filtr
│   │   │   │   ├── ProjectCard.tsx       # Bitta repo card — nomi, tavsif, til, stars, fork, linklar
│   │   │   │   └── ProjectFilter.tsx     # Filtr tugmalari — til bo'yicha (All, TypeScript, React, ...)
│   │   │   ├── hooks/
│   │   │   │   └── use-github-repos.ts   # GitHub datani boshqarish — fetch, filter, sort
│   │   │   ├── services/
│   │   │   │   └── github.service.ts     # GitHub REST API calls — repos endpoint
│   │   │   ├── types/
│   │   │   │   └── index.ts             # GitHubRepo, RepoFilter, RepoLanguage types
│   │   │   └── index.ts
│   │   │
│   │   ├── contact/                      # ══ Contact Section ══
│   │   │   ├── components/
│   │   │   │   ├── ContactSection.tsx    # Aloqa bo'limi — email, ijtimoiy tarmoqlar
│   │   │   │   └── ContactLink.tsx       # Bitta aloqa link — ikonka + matn + href
│   │   │   └── index.ts
│   │   │
│   │   └── layout/                       # ══ Layout Komponentlari ══
│   │       ├── components/
│   │       │   ├── Header.tsx            # Sticky header — logo, nav linklar, til, tema
│   │       │   ├── Footer.tsx            # Footer — copyright, ijtimoiy linklar
│   │       │   ├── Navigation.tsx        # Nav linklar — smooth scroll + active state
│   │       │   ├── LanguageSwitcher.tsx   # Til almashtirish — en/ru/uz dropdown yoki tugmalar
│   │       │   ├── ThemeToggle.tsx       # Dark/light mode toggle — Tabler icon bilan
│   │       │   └── MobileMenu.tsx        # Mobil navigatsiya — hamburger menu
│   │       └── index.ts
│   │
│   ├── shared/                           # Umumiy qayta ishlatiladigan resurslar
│   │   ├── components/
│   │   │   └── ui/                       # shadcn/ui komponentlar (pnpm dlx shadcn@latest add ...)
│   │   │       ├── button.tsx            # shadcn Button
│   │   │       ├── card.tsx              # shadcn Card
│   │   │       ├── badge.tsx             # shadcn Badge
│   │   │       ├── dropdown-menu.tsx     # shadcn DropdownMenu (til switcher uchun)
│   │   │       ├── separator.tsx         # shadcn Separator
│   │   │       └── tooltip.tsx           # shadcn Tooltip
│   │   ├── config/
│   │   │   ├── site.ts                   # Sayt metadata: name, description, url, ogImage
│   │   │   └── constants.ts             # GITHUB_USERNAME, SOCIAL_LINKS, SKILLS_DATA, NAV_ITEMS
│   │   ├── lib/
│   │   │   └── utils.ts                  # cn() — clsx + twMerge yordamchi funksiya
│   │   └── types/
│   │       └── index.ts                  # Umumiy types: NavItem, SocialLink, Locale
│   │
│   ├── i18n/                             # next-intl konfiguratsiya
│   │   ├── request.ts                    # getRequestConfig() — server tomonda locale aniqlash
│   │   └── routing.ts                    # defineRouting() — locales, defaultLocale
│   │
│   ├── messages/                         # Tarjima JSON fayllari
│   │   ├── en.json                       # English tarjimalar
│   │   ├── ru.json                       # Русский tarjimalar
│   │   └── uz.json                       # O'zbekcha tarjimalar
│   │
│   └── middleware.ts                     # next-intl middleware — locale routing + redirect
│
├── .env.local                            # GITHUB_TOKEN (server-side only, GITHUB_ prefiksi)
├── biome.json                            # Biome konfiguratsiya
├── components.json                       # shadcn/ui konfiguratsiya (init dan keyin paydo bo'ladi)
├── next.config.ts                        # Next.js konfiguratsiya
├── tailwind.config.ts                    # Tailwind konfiguratsiya (agar kerak bo'lsa)
├── tsconfig.json                         # TypeScript — strict, paths aliaslar
├── postcss.config.mjs                    # PostCSS — @tailwindcss/postcss
└── package.json
```

---

## GitHub Integratsiya Arxitekturasi (REST API)

GitHub REST API ishlatiladi — sodda, GraphQL token scope kerak emas, oddiy `fetch` bilan ishlaydi.

### Environment variable

```env
# .env.local
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
```

> `GITHUB_TOKEN` — faqat server tomondan o'qiladi. Public repolar uchun token ixtiyoriy, lekin rate limit oshirish uchun kerak (soatiga 60 → 5000 so'rov).

### Service

```typescript
// src/features/projects/services/github.service.ts

const GITHUB_API = "https://api.github.com";

interface GitHubApiRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  fork: boolean;
  archived: boolean;
  updated_at: string;
}

export const githubService = {
  /**
   * Foydalanuvchining public repolarini olish
   * Server Component yoki Route Handler ichida chaqiriladi
   */
  getRepos: async (username: string): Promise<GitHubApiRepo[]> => {
    const res = await fetch(
      `${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated&type=owner`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          }),
        },
        next: { revalidate: 3600 }, // 1 soat cache (ISR)
      }
    );

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const repos: GitHubApiRepo[] = await res.json();

    // Fork va arxivlangan repolarni chiqarib tashlash
    return repos.filter((repo) => !repo.fork && !repo.archived);
  },
};
```

### Types

```typescript
// src/features/projects/types/index.ts

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  url: string;           // html_url dan mapping
  homepage: string | null;
  stars: number;          // stargazers_count dan mapping
  forks: number;          // forks_count dan mapping
  language: string | null;
  topics: string[];
  updatedAt: string;
}

export interface RepoFilter {
  language: string | null; // "All" | "TypeScript" | "JavaScript" | ...
}
```

### Hook (client component uchun)

```typescript
// src/features/projects/hooks/use-github-repos.ts
"use client";

import { useState, useMemo } from "react";
import type { GitHubRepo, RepoFilter } from "../types";

export function useGithubRepos(repos: GitHubRepo[]) {
  const [filter, setFilter] = useState<RepoFilter>({ language: null });

  const filteredRepos = useMemo(() => {
    if (!filter.language) return repos;
    return repos.filter((repo) => repo.language === filter.language);
  }, [repos, filter.language]);

  const languages = useMemo(() => {
    const set = new Set(repos.map((r) => r.language).filter(Boolean));
    return Array.from(set) as string[];
  }, [repos]);

  return { filteredRepos, languages, filter, setFilter };
}
```

### Data oqimi

```
GitHub REST API (https://api.github.com/users/{username}/repos)
  ↓
githubService.getRepos()         — fetch + ISR cache (1 soat)
  ↓
Server Component (page.tsx)      — async component, data server tomondan keladi
  ↓
ProjectsSection (client)         — useGithubRepos() hook bilan filtr
  ↓
ProjectCard                      — bitta repo card UI
```

### Cache strategiyasi

| Qatlam | Mexanizm | Davomiyligi |
|---|---|---|
| Next.js fetch cache | `next: { revalidate: 3600 }` | 1 soat ISR |
| Browser | Avtomatik (Next.js boshqaradi) | — |

Server Component ichida `githubService.getRepos()` chaqiriladi — bu `fetch` ni ishlatadi va Next.js avtomatik cache qiladi. Client tomondan hech qanday API call yo'q.

---

## i18n Tuzilishi (next-intl)

### Routing konfiguratsiya

```typescript
// src/i18n/routing.ts
import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "ru", "uz"],
  defaultLocale: "en",
});

// Type-safe navigation helpers
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
```

### Request konfiguratsiya

```typescript
// src/i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

### Middleware

```typescript
// src/middleware.ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

### URL tuzilishi

```
/en              → English bosh sahifa
/ru              → Русский бош sahifa
/uz              → O'zbekcha bosh sahifa
/en/projects     → English loyihalar
/ru/projects     → Русский loyihalar
/uz/projects     → O'zbekcha loyihalar
```

`/` ga kirsa → avtomatik `/en` ga redirect (defaultLocale).

### Tarjima fayl strukturasi

```jsonc
// messages/en.json
{
  "hero": {
    "greeting": "Hi, I'm",
    "name": "Matkarim",
    "role": "Frontend Developer",
    "description": "I build modern web applications with React, Next.js, and TypeScript",
    "viewProjects": "View Projects",
    "contactMe": "Contact Me"
  },
  "about": {
    "title": "About Me",
    "description": "Frontend developer with experience in building scalable web apps...",
    "skillsTitle": "Skills & Technologies",
    "experienceTitle": "Experience"
  },
  "projects": {
    "title": "My Projects",
    "subtitle": "Open source projects from GitHub",
    "filterAll": "All",
    "stars": "{count} stars",
    "forks": "{count} forks",
    "viewCode": "Source Code",
    "liveDemo": "Live Demo",
    "noProjects": "No projects found"
  },
  "contact": {
    "title": "Get In Touch",
    "subtitle": "Feel free to reach out",
    "email": "Email",
    "telegram": "Telegram",
    "linkedin": "LinkedIn"
  },
  "nav": {
    "home": "Home",
    "about": "About",
    "projects": "Projects",
    "contact": "Contact"
  },
  "theme": {
    "light": "Light",
    "dark": "Dark",
    "system": "System"
  },
  "footer": {
    "builtWith": "Built with Next.js & TypeScript",
    "copyright": "© {year} Matkarim. All rights reserved."
  }
}
```

```jsonc
// messages/ru.json
{
  "hero": {
    "greeting": "Привет, я",
    "name": "Маткарим",
    "role": "Фронтенд разработчик",
    "description": "Создаю современные веб-приложения с React, Next.js и TypeScript",
    "viewProjects": "Мои проекты",
    "contactMe": "Связаться"
  },
  "about": {
    "title": "Обо мне",
    "description": "Фронтенд-разработчик с опытом создания масштабируемых веб-приложений...",
    "skillsTitle": "Навыки и технологии",
    "experienceTitle": "Опыт работы"
  },
  "projects": {
    "title": "Мои проекты",
    "subtitle": "Open source проекты с GitHub",
    "filterAll": "Все",
    "stars": "{count} звёзд",
    "forks": "{count} форков",
    "viewCode": "Исходный код",
    "liveDemo": "Демо",
    "noProjects": "Проекты не найдены"
  },
  "contact": {
    "title": "Связаться со мной",
    "subtitle": "Не стесняйтесь обращаться",
    "email": "Почта",
    "telegram": "Телеграм",
    "linkedin": "LinkedIn"
  },
  "nav": {
    "home": "Главная",
    "about": "Обо мне",
    "projects": "Проекты",
    "contact": "Контакт"
  },
  "theme": {
    "light": "Светлая",
    "dark": "Тёмная",
    "system": "Система"
  },
  "footer": {
    "builtWith": "Создано с Next.js и TypeScript",
    "copyright": "© {year} Маткарим. Все права защищены."
  }
}
```

```jsonc
// messages/uz.json
{
  "hero": {
    "greeting": "Salom, men",
    "name": "Matkarim",
    "role": "Frontend dasturchi",
    "description": "React, Next.js va TypeScript yordamida zamonaviy veb-ilovalar yarataman",
    "viewProjects": "Loyihalarim",
    "contactMe": "Bog'lanish"
  },
  "about": {
    "title": "Men haqimda",
    "description": "Kengaytiriladigan veb-ilovalar yaratish tajribasiga ega frontend dasturchi...",
    "skillsTitle": "Ko'nikma va texnologiyalar",
    "experienceTitle": "Ish tajribasi"
  },
  "projects": {
    "title": "Loyihalarim",
    "subtitle": "GitHub dagi open source loyihalar",
    "filterAll": "Barchasi",
    "stars": "{count} yulduz",
    "forks": "{count} fork",
    "viewCode": "Manba kodi",
    "liveDemo": "Demo",
    "noProjects": "Loyihalar topilmadi"
  },
  "contact": {
    "title": "Bog'lanish",
    "subtitle": "Bemalol murojaat qiling",
    "email": "Email",
    "telegram": "Telegram",
    "linkedin": "LinkedIn"
  },
  "nav": {
    "home": "Bosh sahifa",
    "about": "Men haqimda",
    "projects": "Loyihalar",
    "contact": "Bog'lanish"
  },
  "theme": {
    "light": "Yorug'",
    "dark": "Qorong'u",
    "system": "Tizim"
  },
  "footer": {
    "builtWith": "Next.js va TypeScript bilan yaratilgan",
    "copyright": "© {year} Matkarim. Barcha huquqlar himoyalangan."
  }
}
```

### Componentda ishlatish

```tsx
import { useTranslations } from "next-intl";

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section>
      <p>{t("greeting")}</p>
      <h1>{t("name")}</h1>
      <p>{t("role")}</p>
      <p>{t("description")}</p>
    </section>
  );
}
```

### Server Component da ishlatish

```
// src/app/[locale]/page.tsx
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}
```

---

## Animatsiya (motion)

```bash
pnpm add motion
```

```tsx
// Ishlatish
import { motion } from "motion/react";

export function ProjectCard({ repo }: { repo: GitHubRepo }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
    >
      {/* card content */}
    </motion.div>
  );
}
```

> **Muhim:** `framer-motion` emas, `motion` paketi o'rnatiladi. Import: `"motion/react"`.

---

## Ikonkalar (@tabler/icons-react)

```bash
pnpm add @tabler/icons-react
```

```tsx
import { IconBrandGithub, IconBrandLinkedin, IconMail, IconSun, IconMoon } from "@tabler/icons-react";

// Ishlatish
<IconBrandGithub size={24} stroke={1.5} />
<IconSun size={20} />
```

Tabler Icons — 5400+ bepul icon, stroke width sozlash mumkin, tree-shakeable.

---

## shadcn/ui Konfiguratsiya

### Init (mavjud loyihada)

```bash
pnpm dlx shadcn@latest init
```

CLI so'raydi:
- Style → maia (yoki default)
- Base color → gray
- Icon library → **tabler** (bu loyihada)
- CSS variables → ha

### Komponent qo'shish

```bash
# Kerakli komponentlarni birma-bir qo'shish
pnpm dlx shadcn@latest add button card badge dropdown-menu separator tooltip
```

Komponentlar `src/shared/components/ui/` papkasiga tushadi (components.json da sozlanadi).

### cn() utility

```typescript
// src/shared/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## Nomlash Konvensiyalari

### Fayllar

| Turi | Format | Misol |
|---|---|---|
| Papkalar | `kebab-case/` | `hero/`, `about/`, `projects/` |
| React komponentlar | `PascalCase.tsx` | `HeroSection.tsx`, `ProjectCard.tsx` |
| Hooks | `kebab-case.ts` | `use-github-repos.ts` |
| Services | `kebab-case.service.ts` | `github.service.ts` |
| Types | `index.ts` (papka ichida) | `types/index.ts` |
| Config | `kebab-case.ts` | `site.ts`, `constants.ts` |
| Utils | `kebab-case.ts` | `utils.ts` |
| Tarjimalar | `locale.json` | `en.json`, `ru.json`, `uz.json` |
| UI (shadcn) | `kebab-case.tsx` | `button.tsx`, `dropdown-menu.tsx` |

### Kodda

| Turi | Format | Misol |
|---|---|---|
| O'zgaruvchilar, funksiyalar | `camelCase` | `filteredRepos`, `handleClick` |
| React komponentlar | `PascalCase` | `ProjectCard`, `HeroSection` |
| Interface / Type | `PascalCase` | `GitHubRepo`, `RepoFilter` |
| Konstantalar | `UPPER_CASE` | `GITHUB_USERNAME`, `SOCIAL_LINKS` |
| CSS class (Tailwind) | `kebab-case` | Tailwind standart |

### Barrel exports

Har bir feature `index.ts` orqali eksport qiladi:

```typescript
// src/features/hero/index.ts
export { HeroSection } from "./components/HeroSection";
```

Tashqaridan import:

```typescript
import { HeroSection } from "@/features/hero";
```

---

## Feature Module Shabloni

Yangi feature yaratish ketma-ketligi:

```
features/[feature-name]/
├── components/          # UI komponentlar (PascalCase.tsx)
├── hooks/               # Custom hooks (kebab-case.ts) — ixtiyoriy
├── services/            # API/data calls (kebab-case.service.ts) — ixtiyoriy
├── types/
│   └── index.ts         # TypeScript types
└── index.ts             # Public barrel exports
```

**Qoidalar:**

1. Har bir feature mustaqil — o'z types, hooks, components
2. Feature tashqarisidan faqat `index.ts` orqali import
3. Shared/umumiy narsalar `shared/` papkasida
4. Service faqat data fetch qiladi, logika hook yoki componentda
5. `hooks/` va `services/` ixtiyoriy — oddiy featurelar uchun faqat `components/` yetarli

---

## Provider Tuzilishi

```tsx
// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "@/core/providers/theme-provider";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NextIntlClientProvider messages={messages} locale={locale}>
        {children}
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
```

---

## Muhim Patternlar Xulosa

| Pattern | Qo'llanishi |
|---|---|
| **Feature-Slice Design** | Har bir section (hero, about, projects, contact) alohida modul |
| **Server Components** | GitHub data server tomondan yuklanadi, client ga tayyor keladi |
| **ISR Cache** | `next: { revalidate: 3600 }` — GitHub data 1 soat cache |
| **Barrel Exports** | `index.ts` orqali toza import yo'llari |
| **cn() utility** | `clsx` + `tailwind-merge` — class conflict yechish |
| **i18n everywhere** | Barcha ko'rinadigan matnlar `messages/*.json` dan keladi |
| **Dark mode** | Tailwind `dark:` classlari + `next-themes` ThemeProvider |
| **motion** | Scroll-based animatsiyalar `whileInView` bilan |
| **Tabler Icons** | Barcha ikonkalar `@tabler/icons-react` dan |
| **shadcn/ui** | UI komponentlar — Radix-based, copy-paste, to'liq customize |
