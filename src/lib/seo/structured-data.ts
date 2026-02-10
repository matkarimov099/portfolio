import { BASE_URL, seoConfig } from "./config";

/**
 * Schema.org Person - Portfolio egasi haqida
 * Google Knowledge Panel va AI Overview uchun to'liq ma'lumot
 */
export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${BASE_URL}/#person`,
    name: "Matkarim Matkarimov",
    givenName: "Matkarim",
    familyName: "Matkarimov",
    alternateName: [
      "Matkarimov Matkarim",
      "Маткаримов Маткарим",
      "Маткарим Маткаримов",
      "MuhammadKarim Matkarimov",
      "Matkarim dasturchi",
    ],
    url: BASE_URL,
    image: `${BASE_URL}/en/opengraph-image`,
    email: seoConfig.author.email,
    jobTitle: "Full Stack Developer",
    description:
      "Matkarim Matkarimov - Full Stack Developer va Software Engineer O'zbekistondan. 6+ yillik tajribaga ega. React, Next.js, TypeScript, Node.js, PostgreSQL texnologiyalarida mutaxassis. Hozirda UNICON-SOFT kompaniyasida ishlaydi.",
    nationality: {
      "@type": "Country",
      name: "Uzbekistan",
    },
    sameAs: [
      seoConfig.social.github,
      seoConfig.social.linkedin,
      seoConfig.social.telegram,
      seoConfig.social.instagram,
      "https://dev.to/matkarimov099",
    ],
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Node.js",
      "PostgreSQL",
      "Full Stack Development",
      "Frontend Development",
      "Backend Development",
      "Web Development",
      "REST APIs",
      "GraphQL",
      "Redux",
      "Zustand",
      "TailwindCSS",
      "HTML",
      "CSS",
      "Git",
      "Docker",
    ],
    knowsLanguage: [
      { "@type": "Language", name: "Uzbek", alternateName: "uz" },
      { "@type": "Language", name: "English", alternateName: "en" },
      { "@type": "Language", name: "Russian", alternateName: "ru" },
    ],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Tashkent University of Information Technologies (TUIT)",
      alternateName: "TUIT - al-Khwarizmi branch",
      url: "https://tuit.uz",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Urgench",
        addressRegion: "Xorazm",
        addressCountry: "UZ",
      },
    },
    hasOccupation: [
      {
        "@type": "Occupation",
        name: "Software Engineer",
        occupationLocation: {
          "@type": "City",
          name: "Tashkent",
        },
        skills: "React, Next.js, TypeScript, Node.js, PostgreSQL",
      },
    ],
    worksFor: {
      "@type": "Organization",
      name: "UNICON-SOFT",
      url: "https://unicon-soft.uz",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Tashkent",
        addressCountry: "UZ",
      },
    },
    homeLocation: {
      "@type": "Place",
      name: "Xorazm, Uzbekistan",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Urgench",
        addressRegion: "Xorazm",
        addressCountry: "UZ",
      },
    },
    workLocation: {
      "@type": "Place",
      name: "Tashkent, Uzbekistan",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Tashkent",
        addressCountry: "UZ",
      },
    },
  };
}

/**
 * Schema.org WebSite - Sayt haqida umumiy ma'lumot
 */
export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: BASE_URL,
    name: "Matkarim Matkarimov - Portfolio",
    alternateName: [
      "Matkarimov Matkarim Portfolio",
      "Маткарим Маткаримов - Портфолио",
    ],
    description:
      "Official portfolio website of Matkarim Matkarimov - Full Stack Developer from Uzbekistan. Expert in React, Next.js, TypeScript, Node.js, PostgreSQL.",
    publisher: {
      "@id": `${BASE_URL}/#person`,
    },
    author: {
      "@id": `${BASE_URL}/#person`,
    },
    inLanguage: ["en", "ru", "uz"],
    copyrightHolder: {
      "@id": `${BASE_URL}/#person`,
    },
  };
}

/**
 * Schema.org ProfilePage - About sahifasi uchun
 */
export function generateProfilePageSchema(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${BASE_URL}/${locale}/about/#profilepage`,
    mainEntity: {
      "@id": `${BASE_URL}/#person`,
    },
    name: "About Matkarim Matkarimov",
    description:
      "Learn about Matkarim Matkarimov - Full Stack Developer from Uzbekistan with 6+ years of experience in React, Next.js, TypeScript, Node.js.",
    dateCreated: "2024-01-01T00:00:00Z",
    dateModified: new Date().toISOString(),
    inLanguage: locale,
  };
}

/**
 * Schema.org BreadcrumbList - Navigatsiya uchun
 */
export function generateBreadcrumbSchema(
  locale: string,
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${BASE_URL}/${locale}`,
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.name,
        item: `${BASE_URL}/${locale}${item.path}`,
      })),
    ],
  };
}

/**
 * Schema.org ItemList - Loyihalar ro'yxati uchun
 */
export function generateProjectsListSchema(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/${locale}/projects/#collection`,
    name: "Projects by Matkarim Matkarimov",
    description:
      "Portfolio of web development projects built by Matkarim Matkarimov using React, Next.js, TypeScript, Node.js, and PostgreSQL.",
    author: {
      "@id": `${BASE_URL}/#person`,
    },
    inLanguage: locale,
  };
}
