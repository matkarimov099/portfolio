import type { MetadataRoute } from "next";
import { seoConfig } from "@/lib/seo/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${seoConfig.siteName} - ${seoConfig.author.jobTitle}`,
    short_name: seoConfig.siteNameShort,
    description: `${seoConfig.author.jobTitle} with 6+ years of experience in React, Next.js, TypeScript`,
    start_url: "/",
    display: "standalone",
    background_color: seoConfig.theme.backgroundColor,
    theme_color: seoConfig.theme.color,
    orientation: "portrait-primary",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    categories: ["portfolio", "developer", "technology"],
    lang: "en",
    dir: "ltr",
  };
}
