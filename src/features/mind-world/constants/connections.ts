import type { ConnectionPortal } from "../types";

export const CONNECTION_PORTALS: ConnectionPortal[] = [
  {
    id: "github",
    platform: "github",
    name: "GitHub",
    url: "https://github.com/matkarimov099",
    icon: "github",
    position: [-8, 2, 0],
    chargeLevel: 0,
  },
  {
    id: "linkedin",
    platform: "linkedin",
    name: "LinkedIn",
    url: "https://linkedin.com/in/matkarim-matkarimov",
    icon: "linkedin",
    position: [-4, 2, -6],
    chargeLevel: 0,
  },
  {
    id: "telegram",
    platform: "telegram",
    name: "Telegram",
    url: "https://t.me/m_matkarimov",
    icon: "telegram",
    position: [0, 2, -8],
    chargeLevel: 0,
  },
  {
    id: "instagram",
    platform: "instagram",
    name: "Instagram",
    url: "https://instagram.com/matkarimov099",
    icon: "instagram",
    position: [4, 2, -6],
    chargeLevel: 0,
  },
  {
    id: "email",
    platform: "email",
    name: "Email",
    url: "mailto:matkarimov1099@gmail.com",
    icon: "mail",
    position: [8, 2, 0],
    chargeLevel: 0,
  },
];

export const CONNECTION_CONFIG = {
  chargeSpeed: 0.5, // Charge per second when near
  chargeDecay: 0.3, // Decay per second when away
  activationThreshold: 100, // Percentage needed to activate
  proximityRadius: 3, // Distance to start charging
  maxChargeLevel: 100,
};

export const PLATFORM_COLORS: Record<string, string> = {
  github: "#333333",
  linkedin: "#0077B5",
  telegram: "#0088CC",
  instagram: "#E4405F",
  email: "#EA4335",
};

export const PLATFORM_GLOW_COLORS: Record<string, string> = {
  github: "#6e5494",
  linkedin: "#00a0dc",
  telegram: "#34aadf",
  instagram: "#fd1d1d",
  email: "#ff6b6b",
};
