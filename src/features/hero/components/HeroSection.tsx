"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import {
  IconArrowDown,
  IconCode,
  IconBraces,
  IconTerminal2,
} from "@tabler/icons-react";

import { Link } from "@/i18n/navigation";
import { WebcamPixelGrid } from "@/shared/components/aceternity/webcam-pixel-grid";

const CODE_SNIPPETS = [
  { code: "const dev = 'Matkarim';", x: "10%", y: "15%", delay: 0 },
  { code: "<React.Fragment />", x: "75%", y: "20%", delay: 0.5 },
  { code: "export default App;", x: "5%", y: "70%", delay: 1 },
  { code: "interface Props { }", x: "80%", y: "65%", delay: 1.5 },
  { code: "npm run build", x: "15%", y: "85%", delay: 0.8 },
  { code: "git push origin main", x: "70%", y: "80%", delay: 1.2 },
];

const FLOATING_ICONS = [
  { Icon: IconCode, x: "20%", y: "25%", delay: 0.3 },
  { Icon: IconBraces, x: "85%", y: "40%", delay: 0.7 },
  { Icon: IconTerminal2, x: "10%", y: "50%", delay: 1.1 },
];

function FloatingCodeBlock({
  code,
  x,
  y,
  delay,
}: {
  code: string;
  x: string;
  y: string;
  delay: number;
}) {
  return (
    <motion.div
      className="absolute hidden md:block rounded-lg border border-primary/20 bg-card/60 px-3 py-1.5 font-mono text-xs text-primary/60 backdrop-blur-sm"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: [0, 0.7, 0.5, 0.7],
        scale: [0.8, 1, 0.95, 1],
        y: [0, -15, 5, -10],
        rotate: [-1, 1, -0.5, 1],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
    >
      {code}
    </motion.div>
  );
}

function FloatingIcon({
  Icon,
  x,
  y,
  delay,
}: {
  Icon: typeof IconCode;
  x: string;
  y: string;
  delay: number;
}) {
  return (
    <motion.div
      className="absolute hidden md:block text-primary/20"
      style={{ left: x, top: y }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 0.4, 0.2, 0.4],
        y: [0, -20, 10, -15],
        rotate: [0, 10, -5, 8],
      }}
      transition={{
        duration: 10,
        delay,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
    >
      <Icon size={32} />
    </motion.div>
  );
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Webcam pixel grid background */}
      <div className="absolute inset-0 opacity-30">
        <WebcamPixelGrid
          colorMode="monochrome"
          monochromeColor="#10b981"
          backgroundColor="transparent"
          gridCols={48}
          gridRows={36}
          maxElevation={8}
          darken={0.5}
          className="h-full w-full"
        />
      </div>

      {/* Animated gradient mesh background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]"
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -80, 60, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-cyan-500/8 blur-[100px]"
          animate={{
            x: [0, -80, 60, 0],
            y: [0, 100, -40, 0],
            scale: [1, 0.8, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/2 h-[350px] w-[350px] rounded-full bg-purple-500/8 blur-[100px]"
          animate={{
            x: [0, 50, -80, 0],
            y: [0, -60, 40, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating code snippets */}
      {CODE_SNIPPETS.map((snippet, i) => (
        <FloatingCodeBlock key={i} {...snippet} />
      ))}

      {/* Floating icons */}
      {FLOATING_ICONS.map((icon, i) => (
        <FloatingIcon key={i} {...icon} />
      ))}

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Main content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center gap-6 px-4 text-center"
      >
        {/* Terminal-style greeting */}
        <motion.div
          variants={item}
          className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 backdrop-blur-sm"
        >
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-xs text-primary">
            {t("greeting")}
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          variants={item}
          className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
        >
          <span className="bg-gradient-to-r from-primary via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            {t("name")}
          </span>
        </motion.h1>

        {/* Role with typing cursor */}
        <motion.div variants={item} className="flex items-center gap-2">
          <span className="font-mono text-lg text-muted-foreground md:text-xl">
            {">"} {t("role")}
          </span>
          <motion.span
            className="inline-block h-5 w-0.5 bg-primary"
            animate={{ opacity: [1, 0] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </motion.div>

        {/* Description */}
        <motion.p
          variants={item}
          className="max-w-lg text-sm text-muted-foreground md:text-base"
        >
          {t("description")}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={item}
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
        >
          <Link
            href="/projects"
            className="group relative inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25"
          >
            <IconCode size={16} />
            {t("viewProjects")}
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-all hover:bg-card hover:shadow-lg"
          >
            <IconTerminal2 size={16} />
            {t("contactMe")}
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <IconArrowDown className="size-5 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
}
