"use client";

import {
  IconBrandGithub,
  IconCode,
  IconHome,
  IconLayoutNavbarCollapse,
  IconMail,
  IconUser,
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
import { Link } from "@/i18n/navigation";

const NAV_ITEMS = [
  {
    title: "Home",
    icon: <IconHome className="h-full w-full" />,
    href: "/" as const,
  },
  {
    title: "About",
    icon: <IconUser className="h-full w-full" />,
    href: "/about" as const,
  },
  {
    title: "Projects",
    icon: <IconCode className="h-full w-full" />,
    href: "/projects" as const,
  },
  {
    title: "GitHub",
    icon: <IconBrandGithub className="h-full w-full" />,
    href: "/github" as const,
  },
  {
    title: "Contact",
    icon: <IconMail className="h-full w-full" />,
    href: "/contact" as const,
  },
];

function NavIconContainer({
  mouseX,
  title,
  icon,
  href,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: "/" | "/about" | "/projects" | "/github" | "/contact";
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

  const widthTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [20, 40, 20],
  );
  const heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [20, 40, 20],
  );

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <Link href={href}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex aspect-square items-center justify-center rounded-full bg-white/10"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="absolute -top-8 left-1/2 w-fit rounded-md border border-white/10 bg-white/10 px-2 py-0.5 text-xs whitespace-pre text-foreground backdrop-blur-xl"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
      </motion.div>
    </Link>
  );
}

export function NavDock() {
  const mouseX = useMotionValue(Infinity);
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop */}
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="fixed bottom-6 left-1/2 z-50 mx-auto hidden h-16 -translate-x-1/2 items-end gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 pb-3 shadow-2xl backdrop-blur-xl md:flex"
      >
        {NAV_ITEMS.map((item) => (
          <NavIconContainer mouseX={mouseX} key={item.title} {...item} />
        ))}
      </motion.div>

      {/* Mobile */}
      <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 block md:hidden">
        <AnimatePresence>
          {open && (
            <motion.div
              layoutId="nav-dock"
              className="absolute inset-x-0 bottom-full mb-2 flex flex-col items-center gap-2"
            >
              {NAV_ITEMS.map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    y: 10,
                    transition: { delay: idx * 0.05 },
                  }}
                  transition={{ delay: (NAV_ITEMS.length - 1 - idx) * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-xl"
                    onClick={() => setOpen(false)}
                  >
                    <div className="h-4 w-4">{item.icon}</div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-xl"
        >
          <IconLayoutNavbarCollapse className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
    </>
  );
}
