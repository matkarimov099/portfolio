"use client";

import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTelegram,
  IconMail,
} from "@tabler/icons-react";
import {
  AnimatePresence,
  type MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";
import { siteConfig } from "@/shared/config/site";

function DevToIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
    >
      <title>DEV.to</title>
      <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6v4.36h.58c.37 0 .65-.08.83-.23.18-.16.27-.45.27-.85v-2.2c0-.4-.09-.68-.27-.85zM22 7.5v9c0 .83-.67 1.5-1.5 1.5h-17C2.67 18 2 17.33 2 16.5v-9C2 6.67 2.67 6 3.5 6h17c.83 0 1.5.67 1.5 1.5zM9.17 12.99c0-1.09-.27-1.86-.82-2.3-.55-.44-1.17-.66-1.85-.66H4.5v6h2c.68 0 1.3-.22 1.85-.66.55-.44.82-1.21.82-2.3v-.08zM13.5 9.03h-3v6h3v-1.2h-1.7v-1.23h1.7v-1.2h-1.7V10.2h1.7V9.03zm5.77.63c0-.1-.03-.2-.09-.29a.416.416 0 0 0-.23-.17c-.09-.04-.2-.06-.32-.06s-.25.02-.37.06l-1.15 3.96-1.16-3.96c-.12-.04-.24-.06-.37-.06s-.23.02-.32.06a.416.416 0 0 0-.23.17.44.44 0 0 0-.09.29l.72 4.89c.05.29.14.52.28.68.14.16.37.24.69.24h.3c.32 0 .55-.08.69-.24.14-.16.23-.39.28-.68l.72-4.89h.05z" />
    </svg>
  );
}

const items = [
  {
    title: "GitHub",
    icon: <IconBrandGithub className="h-full w-full" />,
    href: siteConfig.links.github,
  },
  {
    title: "LinkedIn",
    icon: <IconBrandLinkedin className="h-full w-full" />,
    href: siteConfig.links.linkedin,
  },
  {
    title: "Telegram",
    icon: <IconBrandTelegram className="h-full w-full" />,
    href: siteConfig.links.telegram,
  },
  {
    title: "Instagram",
    icon: <IconBrandInstagram className="h-full w-full" />,
    href: siteConfig.links.instagram,
  },
  {
    title: "DEV.to",
    icon: <DevToIcon className="h-full w-full" />,
    href: siteConfig.links.devto,
  },
  {
    title: "Email",
    icon: <IconMail className="h-full w-full" />,
    href: siteConfig.links.email,
  },
];

function SocialIconContainer({
  mouseY,
  title,
  icon,
  href,
}: {
  mouseY: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseY, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 };
    return val - bounds.y - bounds.height / 2;
  });

  const sizeTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const iconSizeTransform = useTransform(
    distance,
    [-150, 0, 150],
    [20, 40, 20],
  );

  const size = useSpring(sizeTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const iconSize = useSpring(iconSizeTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={title}>
      <motion.div
        ref={ref}
        style={{ width: size, height: size }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex aspect-square items-center justify-center rounded-full bg-white/10"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, x: 10, y: "-50%" }}
              animate={{ opacity: 1, x: 0, y: "-50%" }}
              exit={{ opacity: 0, x: 10, y: "-50%" }}
              className="absolute left-full top-1/2 ml-2 w-fit rounded-md border border-white/10 bg-white/10 px-2 py-0.5 text-xs whitespace-pre text-foreground backdrop-blur-xl"
              aria-hidden="true"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: iconSize, height: iconSize }}
          className="flex items-center justify-center"
          aria-hidden="true"
        >
          {icon}
        </motion.div>
      </motion.div>
    </a>
  );
}

export function SocialDock() {
  const mouseY = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseY.set(e.clientY)}
      onMouseLeave={() => mouseY.set(Infinity)}
      className="fixed left-2 top-1/2 z-50 hidden w-16 -translate-y-1/2 flex-col items-start gap-4 rounded-2xl border border-white/10 bg-white/5 py-4 pl-3 shadow-2xl backdrop-blur-xl md:flex"
    >
      {items.map((item) => (
        <SocialIconContainer mouseY={mouseY} key={item.title} {...item} />
      ))}
    </motion.div>
  );
}
