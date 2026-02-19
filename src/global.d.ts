declare global {
  interface Window {
    dataLayer: unknown[][];
    gtag: (...args: unknown[]) => void;
    ym: ((...args: unknown[]) => void) & { a?: unknown[]; l?: number };
  }
}

export {};
