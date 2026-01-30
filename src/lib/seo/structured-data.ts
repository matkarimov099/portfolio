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
    url: BASE_URL,
    email: seoConfig.author.email,
    jobTitle: seoConfig.author.jobTitle,
    sameAs: [
      seoConfig.social.github,
      seoConfig.social.linkedin,
      seoConfig.social.telegram,
      seoConfig.social.instagram,
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
    description:
      "Full Stack Developer portfolio showcasing projects and expertise",
    publisher: {
      "@id": `${BASE_URL}/#person`,
    },
    inLanguage: ["en", "ru", "uz"],
  };
}

/**
 * Schema.org BreadcrumbList - Navigatsiya uchun
 */
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
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
