# Matkarimov Matkarim Portfolio

![Next.js](https://img.shields.io/badge/Next.js-16.1.5-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green)

Official portfolio website of **Matkarimov Matkarim** - Full Stack Developer from Uzbekistan.

## [Live Preview](https://www.eduzen.uz)

---

## Features

- 🌍 **Multilingual** - English, Russian, Uzbek (next-intl)
- 🎨 **Modern UI** - Dark theme with glassmorphism effects
- 🌐 **3D Globe** - Interactive Three.js globe visualization
- 💬 **Real-time Chat** - WebSocket-based live chat with visitors
- 👥 **Online Counter** - Real-time visitor presence (Supabase)
- 🎯 **SEO Optimized** - Schema.org, OpenGraph, Twitter Cards, Sitemap
- 📱 **Responsive** - Mobile-first design
- ⚡ **Performance** - Optimized with React Compiler, Analytics

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5.0 |
| **Styling** | Tailwind CSS 4.0 |
| **3D Graphics** | Three.js, React Three Fiber, drei |
| **Database** | Supabase (PostgreSQL) |
| **Internationalization** | next-intl |
| **Animations** | Motion (Framer Motion) |
| **UI Components** | Radix UI |
| **Icons** | Tabler Icons |
| **Notifications** | Sonner |
| **Analytics** | Vercel Analytics, Speed Insights, Google Analytics |
| **Code Quality** | Biome |

---

## Project Structure

```
portfolio/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── [locale]/             # Localized routes
│   │   │   ├── about/            # About page
│   │   │   ├── projects/         # Projects showcase
│   │   │   ├── contact/          # Contact form
│   │   │   ├── chat/             # Chat page
│   │   │   └── github/           # GitHub projects
│   │   ├── api/                  # API routes
│   │   │   └── chat/             # Chat webhooks & notifications
│   │   ├── sitemap.ts            # Dynamic sitemap
│   │   ├── robots.ts             # Robots.txt
│   │   └── layout.tsx            # Root layout
│   │
│   ├── components/               # Reusable components
│   │   ├── analytics/            # Google Analytics
│   │   ├── seo/                  # JSON-LD structured data
│   │   └── ui/                   # UI components
│   │
│   ├── features/                 # Feature-based modules
│   │   ├── about/                # About section
│   │   ├── chat/                 # Chat widget & system
│   │   ├── hero/                 # Hero section with 3D globe
│   │   ├── layout/               # Layout components (NavDock, etc.)
│   │   └── projects/             # Projects showcase
│   │
│   ├── lib/                      # Utilities & configs
│   │   ├── seo/                  # SEO configuration & metadata
│   │   └── ...                   # Other utilities
│   │
│   ├── i18n/                     # Internationalization
│   │   └── routing.ts            # Locale routing config
│   │
│   └── shared/                   # Shared contexts & components
│
├── public/                       # Static assets
├── biome.json                    # Code quality config
├── tailwind.config.ts            # Tailwind configuration
└── tsconfig.json                 # TypeScript configuration
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended package manager)

### Installation

```bash
# Clone the repository
git clone https://github.com/matkarimov099/portfolio.git
cd portfolio

# Install dependencies
pnpm install
```

### Environment Variables

Create `.env.local` file:

```env
# Supabase (for chat & online counter)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Development

```bash
# Start development server
pnpm dev

# Open http://localhost:3000
```

### Build

```bash
# Production build
pnpm build

# Start production server
pnpm start
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Check code with Biome |
| `pnpm format` | Format code with Biome |
| `pnpm fix` | Fix lint issues & format |

---

## SEO

This project is SEO-optimized with:

- ✅ Dynamic Sitemap (`/sitemap.xml`)
- ✅ Robots.txt (`/robots.txt`)
- ✅ Schema.org structured data (Person, WebSite, ProfilePage)
- ✅ OpenGraph tags
- ✅ Twitter Cards
- ✅ Canonical URLs
- ✅ Hreflang tags (for multilingual)
- ✅ Meta descriptions
- ✅ Google Analytics integration

### Indexing

```bash
# Submit sitemap to Google Search Console
https://www.eduzen.uz/sitemap.xml

# Submit robots.txt
https://www.eduzen.uz/robots.txt
```

---

## Chat System

The chat system allows real-time communication with visitors:

- WebSocket-based real-time messaging
- Name validation (3+ characters, no special characters)
- Toast notifications for errors
- Supabase backend for message storage

### API Endpoints

- `/api/chat/webhook` - Chat webhook handler
- `/api/chat/notify` - Send notifications

---

## Performance

| Metric | Score |
|--------|-------|
| Performance | 95+ |
| Accessibility | 100 |
| Best Practices | 95+ |
| SEO | 100 |

Test your site: [PageSpeed Insights](https://pagespeed.web.dev)

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel
```

### Environment Variables on Vercel

Set the same variables as in `.env.local` in your Vercel project settings.

---

## Author

**Matkarimov Matkarim**

- GitHub: [@matkarimov099](https://github.com/matkarimov099)
- LinkedIn: [Matkarim Matkarimov](https://www.linkedin.com/in/matkarim-matkarimov/)
- Email: matkarimov1099@gmail.com
- Website: [eduzen.uz](https://www.eduzen.uz)

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Acknowledgments

- [Next.js](https://nextjs.org) - The React Framework
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- [Three.js](https://threejs.org) - 3D Graphics Library
- [Supabase](https://supabase.com) - Backend as a Service
- [Motion](https://motion.dev) - Animation Library
- [Radix UI](https://www.radix-ui.com) - UI Components
- [Tabler Icons](https://tabler-icons.io) - Icon Set
