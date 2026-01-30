import type { MetadataRoute } from "next";
import { BASE_URL, locales } from "@/lib/seo/config";

// Barcha statik sahifalar
const staticPages = [
  { path: "", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/projects", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/github", priority: 0.8, changeFrequency: "daily" as const },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/chat", priority: 0.7, changeFrequency: "monthly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of staticPages) {
    for (const locale of locales) {
      const url = `${BASE_URL}/${locale}${page.path}`;

      // Har bir til uchun alternates
      const alternates: Record<string, string> = {};
      for (const loc of locales) {
        alternates[loc] = `${BASE_URL}/${loc}${page.path}`;
      }

      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: alternates,
        },
      });
    }
  }

  return entries;
}
