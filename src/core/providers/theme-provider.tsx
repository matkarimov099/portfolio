"use client";

import { type ReactNode } from "react";

export function useTheme() {
  return { theme: "dark" as const, setTheme: () => {} };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
