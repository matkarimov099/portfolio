// SEO Configuration - Markaziy sozlamalar
// Domenni o'zgartirish uchun faqat BASE_URL ni o'zgartiring

export const BASE_URL = "https://eduzen.uz";

export const locales = ["en", "ru", "uz"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

// OpenGraph locale kodlari
export const ogLocaleMap: Record<Locale, string> = {
  en: "en_US",
  ru: "ru_RU",
  uz: "uz_UZ",
};

// Til nomlari
export const localeNames: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
  uz: "O'zbek",
};

export const seoConfig = {
  siteName: "Matkarim Matkarimov",
  siteNameShort: "Matkarim",
  author: {
    name: "Matkarim Matkarimov",
    url: BASE_URL,
    email: "matkarimov1099@gmail.com",
    jobTitle: "Full Stack Developer",
  },
  social: {
    github: "https://github.com/matkarimov099",
    linkedin: "https://www.linkedin.com/in/matkarim-matkarimov/",
    telegram: "https://t.me/m_matkarimov",
    instagram: "https://www.instagram.com/matkarimov099",
  },
  theme: {
    color: "#10b981",
    backgroundColor: "#09090b",
  },
  keywords: [
    "Full Stack Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "Frontend Developer",
    "Matkarim Matkarimov",
    "Web Developer Uzbekistan",
    "Node.js Developer",
    "Tashkent Developer",
  ],
} as const;
