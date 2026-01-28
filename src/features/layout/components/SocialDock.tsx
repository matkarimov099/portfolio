"use client";

import { useRef, useState } from "react";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTelegram,
  IconBrandInstagram,
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
import { siteConfig } from "@/shared/config/site";

const items = [
  { title: "GitHub", icon: <IconBrandGithub className="h-full w-full" />, href: siteConfig.links.github },
  { title: "LinkedIn", icon: <IconBrandLinkedin className="h-full w-full" />, href: siteConfig.links.linkedin },
  { title: "Telegram", icon: <IconBrandTelegram className="h-full w-full" />, href: siteConfig.links.telegram },
  { title: "Instagram", icon: <IconBrandInstagram className="h-full w-full" />, href: siteConfig.links.instagram },
  { title: "Email", icon: <IconMail className="h-full w-full" />, href: siteConfig.links.email },
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
  const iconSizeTransform = useTransform(distance, [-150, 0, 150], [20, 40, 20]);

  const size = useSpring(sizeTransform, { mass: 0.1, stiffness: 150, damping: 12 });
  const iconSize = useSpring(iconSizeTransform, { mass: 0.1, stiffness: 150, damping: 12 });

  const [hovered, setHovered] = useState(false);

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
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
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: iconSize, height: iconSize }}
          className="flex items-center justify-center"
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
      className="fixed left-4 top-1/2 z-50 hidden w-16 -translate-y-1/2 flex-col items-start gap-4 rounded-2xl border border-white/10 bg-white/5 py-4 pl-3 shadow-2xl backdrop-blur-xl md:flex"
    >
      {items.map((item) => (
        <SocialIconContainer mouseY={mouseY} key={item.title} {...item} />
      ))}
    </motion.div>
  );
}
