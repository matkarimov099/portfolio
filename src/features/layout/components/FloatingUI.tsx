"use client";

import { usePathname } from "next/navigation";

interface FloatingUIProps {
  children: React.ReactNode;
}

export function FloatingUI({ children }: FloatingUIProps) {
  const pathname = usePathname();

  // Hide floating UI elements on the mind-world 3D page
  if (pathname?.includes("/mind-world")) {
    return null;
  }

  return <>{children}</>;
}
