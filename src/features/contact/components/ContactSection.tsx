"use client";

import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTelegram,
  IconGripVertical,
  IconMail,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/shared/components/aceternity/draggable-card";
import { Meteors } from "@/shared/components/aceternity/meteors";
import { siteConfig } from "@/shared/config/site";

const CONTACT_ITEMS = [
  {
    icon: IconBrandGithub,
    label: "GitHub",
    value: "matkarimov099",
    href: siteConfig.links.github,
    gradient: "from-[#333] to-[#555]",
    desktop:
      "md:top-[calc(50%-230px)] md:left-[calc(50%-350px)] md:rotate-[-8deg]",
    mobile: "top-[calc(50%-290px)] left-[calc(50%-120px)] rotate-[-6deg]",
    z: "z-[1]",
    wiggleDelay: 0.8,
  },
  {
    icon: IconBrandLinkedin,
    label: "LinkedIn",
    value: "Matkarim Matkarimov",
    href: siteConfig.links.linkedin,
    gradient: "from-[#0A66C2] to-[#0d8de8]",
    desktop:
      "md:top-[calc(50%-250px)] md:left-[calc(50%-130px)] md:rotate-[4deg]",
    mobile: "top-[calc(50%-180px)] left-[calc(50%-100px)] rotate-[3deg]",
    z: "z-[2]",
    wiggleDelay: 1.0,
  },
  {
    icon: IconBrandInstagram,
    label: "Instagram",
    value: "matkarimov099",
    href: siteConfig.links.instagram,
    gradient: "from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
    desktop:
      "md:top-[calc(50%-240px)] md:left-[calc(50%+100px)] md:rotate-[6deg]",
    mobile: "top-[calc(50%-70px)] left-[calc(50%-130px)] rotate-[5deg]",
    z: "z-[3]",
    wiggleDelay: 1.2,
  },
  {
    icon: IconMail,
    label: "Email",
    value: "matkarimov1099@gmail.com",
    href: siteConfig.links.email,
    gradient: "from-emerald-500 to-emerald-700",
    desktop:
      "md:top-[calc(50%-10px)] md:left-[calc(50%-280px)] md:rotate-[-2deg]",
    mobile: "top-[calc(50%+40px)] left-[calc(50%-90px)] rotate-[-2deg]",
    z: "z-[4]",
    wiggleDelay: 1.4,
  },
  {
    icon: IconBrandTelegram,
    label: "Telegram",
    value: "@m_matkarimov",
    href: siteConfig.links.telegram,
    gradient: "from-[#229ED9] to-[#34c0ff]",
    desktop: "md:top-[calc(50%)] md:left-[calc(50%+10px)] md:rotate-[-3deg]",
    mobile: "top-[calc(50%+150px)] left-[calc(50%-110px)] rotate-[-4deg]",
    z: "z-[5]",
    wiggleDelay: 1.6,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: "easeOut" as const },
  }),
};

const cardAppear = {
  hidden: { opacity: 0, scale: 0.8, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay,
      ease: "easeOut" as const,
    },
  }),
};

const wiggle = {
  initial: { rotate: 0 },
  animate: (delay: number) => ({
    rotate: [0, -3, 3, -2, 2, 0],
    transition: {
      delay: delay + 0.5,
      duration: 0.6,
      ease: "easeInOut" as const,
    },
  }),
};

export function ContactSection() {
  const t = useTranslations("contact");

  return (
    <section className="relative h-full">
      <Meteors number={30} />
      <DraggableCardContainer className="relative flex h-full w-full items-center justify-center overflow-clip">
        <motion.div
          className="pointer-events-none absolute top-1/2 mx-auto max-w-md -translate-y-1/2 text-center"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
          aria-hidden="true"
        >
          <p className="font-mono text-sm text-primary">{"// contact"}</p>
          <motion.h2
            className="mt-2 text-3xl font-bold tracking-tight text-muted-foreground/30 md:text-5xl"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
          >
            {t("title")}
          </motion.h2>
          <motion.p
            className="mt-3 text-lg text-muted-foreground/30"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
          >
            {t("subtitle")}
          </motion.p>
        </motion.div>
        {CONTACT_ITEMS.map((c, index) => (
          <motion.div
            key={c.label}
            initial="hidden"
            animate="visible"
            variants={cardAppear}
            custom={0.3 + index * 0.1}
            className={`absolute ${c.mobile} ${c.desktop} ${c.z}`}
          >
            <motion.div
              variants={wiggle}
              initial="initial"
              animate="animate"
              custom={c.wiggleDelay}
            >
              <DraggableCardBody className="min-h-0! w-auto! p-8!">
                <div className="relative z-10 flex h-48 w-48 flex-col items-center justify-center gap-4 md:h-56 md:w-56">
                  <div
                    className={`rounded-xl bg-linear-to-br ${c.gradient} p-4 shadow-lg`}
                  >
                    <c.icon size={36} className="text-white" />
                  </div>
                  <a
                    href={c.href}
                    target="_blank"
                    rel="me noopener noreferrer"
                    className="flex flex-col items-center gap-1 transition-colors hover:text-primary"
                  >
                    <h3 className="text-lg font-bold text-foreground transition-colors hover:text-primary">
                      {c.label}
                    </h3>
                    <p className="text-center text-xs text-muted-foreground transition-colors hover:text-primary">
                      {c.value}
                    </p>
                  </a>
                </div>
              </DraggableCardBody>
            </motion.div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.5 }}
          className="absolute top-8 flex items-center gap-2 text-sm text-muted-foreground"
        >
          <IconGripVertical size={16} className="rotate-90" />
          <span>{t("dragHint")}</span>
        </motion.div>
      </DraggableCardContainer>
    </section>
  );
}
