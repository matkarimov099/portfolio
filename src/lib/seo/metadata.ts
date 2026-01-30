import type { Metadata } from "next";
import {
  BASE_URL,
  type Locale,
  locales,
  ogLocaleMap,
  seoConfig,
} from "./config";

interface GenerateMetadataOptions {
  title: string;
  description: string;
  path: string;
  locale: Locale;
  image?: string;
  type?: "website" | "article" | "profile";
  noindex?: boolean;
}

/**
 * Sahifa uchun to'liq metadata generatsiya qiladi
 * - Canonical URL
 * - Hreflang alternates (barcha tillar uchun)
 * - OpenGraph
 * - Twitter Card
 */
export function generatePageMetadata({
  title,
  description,
  path,
  locale,
  image = "/og/default.png",
  type = "website",
  noindex = false,
}: GenerateMetadataOptions): Metadata {
  const url = `${BASE_URL}/${locale}${path}`;
  const imageUrl = image.startsWith("http") ? image : `${BASE_URL}${image}`;

  // Hreflang uchun barcha til variantlari
  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[loc] = `${BASE_URL}/${loc}${path}`;
  }
  languages["x-default"] = `${BASE_URL}/${defaultLocale}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: seoConfig.siteName,
      locale: ogLocaleMap[locale],
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

// Default locale import qilish uchun
import { defaultLocale } from "./config";
