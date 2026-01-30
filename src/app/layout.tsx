import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import "@fontsource-variable/noto-sans";
import "./globals.css";
import { BASE_URL, seoConfig } from "@/lib/seo/config";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${seoConfig.siteName} | ${seoConfig.author.jobTitle}`,
    template: `%s | ${seoConfig.siteNameShort}`,
  },
  description: `${seoConfig.author.jobTitle} with 6+ years of experience building production-grade web applications with React, Next.js, TypeScript, and Node.js`,
  keywords: [...seoConfig.keywords],
  authors: [{ name: seoConfig.author.name, url: seoConfig.author.url }],
  creator: seoConfig.author.name,
  publisher: seoConfig.author.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ru_RU", "uz_UZ"],
    url: BASE_URL,
    siteName: seoConfig.siteName,
    title: `${seoConfig.siteName} | ${seoConfig.author.jobTitle}`,
    description: `${seoConfig.author.jobTitle} with 6+ years of experience in React, Next.js, TypeScript`,
    images: [
      {
        url: "/og/default.png",
        width: 1200,
        height: 630,
        alt: `${seoConfig.siteName} - ${seoConfig.author.jobTitle}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${seoConfig.siteName} | ${seoConfig.author.jobTitle}`,
    description: `${seoConfig.author.jobTitle} with 6+ years of experience in React, Next.js, TypeScript`,
    images: ["/og/default.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: seoConfig.theme.color },
    { media: "(prefers-color-scheme: dark)", color: seoConfig.theme.color },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {/* Placeholder - Next.js metadata orqali override qilinadi */}
        <title>Matkarim | Full Stack Developer</title>
      </head>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
