import { BASE_URL, seoConfig } from "./config";

/**
 * Schema.org Person - Portfolio egasi haqida
 */
export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${BASE_URL}/#person`,
    name: seoConfig.author.name,
    alternateName: seoConfig.author.alternateName,
    url: BASE_URL,
    email: seoConfig.author.email,
    jobTitle: seoConfig.author.jobTitle,
    description: `${seoConfig.author.name} - ${seoConfig.author.jobTitle} from Uzbekistan. Expert in React, Next.js, TypeScript, Node.js. Currently working at UNICON-SOFT.`,
    sameAs: [
      seoConfig.social.github,
      seoConfig.social.linkedin,
      seoConfig.social.telegram,
      seoConfig.social.instagram,
    ],
    knowsAbout: [
      "Xorazm",
      "Urganch",
      "Xorazmlik dasturchi",
      "Urganch tumani",
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
      "PostgreSQL",
      "O'zbek dasturchi",
      "Xorazm Guch",
      "Khorezm Developer",
    ],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "TUIT (al-Khwarizmi branch)",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Urgench",
        addressCountry: "UZ",
      },
    },
    worksFor: {
      "@type": "Organization",
      name: "UNICON-SOFT",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Tashkent",
        addressCountry: "UZ",
      },
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tashkent",
      addressCountry: "Uzbekistan",
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
    name: seoConfig.siteName,
    alternateName: seoConfig.siteNameShort,
    description: `Official portfolio website of ${seoConfig.author.name}, ${seoConfig.author.jobTitle} from Uzbekistan. Expertise in React, Next.js, TypeScript, Node.js, and PostgreSQL.`,
    publisher: {
      "@id": `${BASE_URL}/#person`,
    },
    inLanguage: ["en", "ru", "uz"],
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
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
    mainEntity: {
      "@id": `${BASE_URL}/#person`,
    },
    dateCreated: "2024-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    inLanguage: locale,
  };
}
