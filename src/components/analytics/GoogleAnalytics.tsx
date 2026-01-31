"use client";

import Script from "next/script";
import { useEffect } from "react";

const GA_MEASUREMENT_ID = "G-0DVTK2SDPC";

export function GoogleAnalytics() {
  useEffect(() => {
    // Development modda analytics ishlamasligi kerak
    if (process.env.NODE_ENV === "development") return;

    // Window objectga gtag funktsiyasini qo'shish
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;

    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID);
  }, []);

  // Production da script yuklash
  if (process.env.NODE_ENV === "production") {
    return (
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
    );
  }

  return null;
}
