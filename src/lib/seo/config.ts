// SEO Configuration - Markaziy sozlamalar
// Domenni o'zgartirish uchun faqat BASE_URL ni o'zgartiring

export const BASE_URL = "https://www.matkarim.uz";

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
  siteName: "Matkarim Matkarimov | Маткарим Маткаримов",
  siteNameShort: "Matkarimov Matkarim | Маткаримов Маткарим",
  author: {
    name: "Matkarim Matkarimov | Маткаримов Маткарим",
    alternateName: "Matkarimov Matkarim | Маткарим Маткаримов",
    url: BASE_URL,
    email: "matkarimov1099@gmail.com",
    jobTitle: "Full Stack Developer | Software Engineer | Muhandis dasturchi",
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
    // Asosiy ism variantlari
    "Matkarimov Matkarim",
    "Matkarim Matkarimov",
    "Маткаримов Маткарим",
    "Маткарим Маткаримов",
    "Matkarimov",
    "Matkarim",
    "MuhammadKarim",
    "Muhammadkarim",
    // Lavozim
    "Full Stack Dasturchi",
    "Software Engineer",
    "Dasturchi",
    "Dasturlash",
    "Muhandis dasturchi",
    "Full Stack Developer",
    "Full Stack Developer Uzbekistan",
    "React Developer",
    "Next.js Developer",
    "TypeScript Developer",
    "Frontend Developer",
    "Backend Developer",
    "Web Developer",
    "Veb dasturchi",
    // Texnologiyalar
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "JavaScript",
    "PostgreSQL",
    // Joylashuv
    "Xorazm",
    "Urganch",
    "Xorazmlik dasturchi",
    "Tashkent Developer",
    "Urgench Developer",
    "O'zbek dasturchi",
    "Xorazm Guch",
    "Khorezm Developer",
    "Uzbekistan Developer",
    "Web Developer Uzbekistan",
    "Software Engineer Uzbekistan",
    // Kompaniya
    "UNICON-SOFT",
    "ITFORLEAD",
    "IT-FORELEAD",
    "UNIVERSITY",
  ],
} as const;
