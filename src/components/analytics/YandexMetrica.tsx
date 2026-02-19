"use client";

import Script from "next/script";
import { useEffect } from "react";

const YM_COUNTER_ID = 106911718;

export function YandexMetrica() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") return;

    window.ym =
      window.ym ||
      ((...args: unknown[]) => {
        if (!window.ym.a) window.ym.a = [];
        window.ym.a.push(args);
      });
    window.ym.l = Date.now();

    window.ym(YM_COUNTER_ID, "init", {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
    });
  }, []);

  if (process.env.NODE_ENV === "production") {
    return (
      <>
        <Script
          src={`https://mc.yandex.ru/metrika/tag.js?id=${YM_COUNTER_ID}`}
          strategy="afterInteractive"
        />
        <noscript>
          <div>
            {/* biome-ignore lint/performance/noImgElement: tracking pixel, not a real image */}
            <img
              src={`https://mc.yandex.ru/watch/${YM_COUNTER_ID}`}
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
      </>
    );
  }

  return null;
}
