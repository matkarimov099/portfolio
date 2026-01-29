import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import "@fontsource-variable/noto-sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "Matkarim | Frontend Developer",
  description: "Frontend developer portfolio — React, Next.js, TypeScript",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
