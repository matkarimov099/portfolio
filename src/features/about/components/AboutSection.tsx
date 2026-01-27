"use client";

import { useTranslations } from "next-intl";
import { WobbleCard } from "@/shared/components/aceternity/wobble-card";
import { SkillsMarquee } from "./SkillsMarquee";
import { ExperienceTimeline } from "./ExperienceTimeline";

export function AboutSection() {
  const t = useTranslations("about");

  return (
    <section id="about" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-4xl font-bold tracking-tight text-foreground">
          {t("title")}
        </h2>
        <p className="mt-4 text-center text-muted-foreground">
          {t("description")}
        </p>

        <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <WobbleCard containerClassName="col-span-1 lg:col-span-2 bg-blue-100 dark:bg-blue-900">
            <h3 className="text-xl font-bold text-blue-900 dark:text-white">
              Who I Am
            </h3>
            <p className="mt-2 text-blue-800 dark:text-neutral-200">
              I am a Senior Frontend Developer with over 4 years of professional
              experience building enterprise web applications. I specialize in
              React, Next.js, and TypeScript, focusing on clean architecture,
              performance optimization, and delivering polished user
              experiences. I thrive in team environments, having led frontend
              teams and mentored junior developers throughout my career.
            </p>
          </WobbleCard>

          <WobbleCard containerClassName="bg-pink-100 dark:bg-pink-800">
            <h3 className="text-xl font-bold text-pink-900 dark:text-white">
              Education
            </h3>
            <p className="mt-2 text-sm text-pink-800 dark:text-neutral-200">
              Bachelor&apos;s in Computer Engineering
            </p>
            <p className="text-sm text-pink-700 dark:text-neutral-300">
              TUIT (al-Khwarizmi branch), Urgench
            </p>
            <p className="text-sm text-pink-700 dark:text-neutral-300">
              2018 - 2022
            </p>
          </WobbleCard>

          <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-emerald-100 dark:bg-emerald-900">
            <h3 className="text-xl font-bold text-emerald-900 dark:text-white">
              Languages
            </h3>
            <div className="mt-3 flex flex-wrap gap-6">
              <div>
                <p className="font-semibold text-emerald-900 dark:text-white">
                  English
                </p>
                <p className="text-sm text-emerald-700 dark:text-neutral-300">
                  B2 - Upper Intermediate
                </p>
              </div>
              <div>
                <p className="font-semibold text-emerald-900 dark:text-white">
                  Russian
                </p>
                <p className="text-sm text-emerald-700 dark:text-neutral-300">
                  B1 - Intermediate
                </p>
              </div>
              <div>
                <p className="font-semibold text-emerald-900 dark:text-white">
                  Uzbek
                </p>
                <p className="text-sm text-emerald-700 dark:text-neutral-300">
                  Native
                </p>
              </div>
            </div>
          </WobbleCard>
        </div>

        <SkillsMarquee />
        <ExperienceTimeline />
      </div>
    </section>
  );
}
