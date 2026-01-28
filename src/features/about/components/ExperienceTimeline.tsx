"use client";

import { useTranslations } from "next-intl";
import { Timeline } from "@/shared/components/aceternity/timeline";

const TECHNOLOGIES = {
  uniconsoft: ["React", "Next.js", "TypeScript", "Tailwind CSS", "REST API"],
  itforlead: [
    "React",
    "Next.js",
    "TypeScript",
    "Redux",
    "Zustand",
    "REST API",
    "GraphQL",
  ],
  university: ["React", "JavaScript", "CSS", "HTML"],
};

export function ExperienceTimeline() {
  const t = useTranslations("about");

  const experiences = [
    {
      title: t("experience1Title"),
      company: t("experience1Company"),
      period: t("experience1Period"),
      description: t("experience1Description"),
      technologies: TECHNOLOGIES.uniconsoft,
    },
    {
      title: t("experience2Title"),
      company: t("experience2Company"),
      period: t("experience2Period"),
      description: t("experience2Description"),
      technologies: TECHNOLOGIES.itforlead,
    },
    {
      title: t("experience3Title"),
      company: t("experience3Company"),
      period: t("experience3Period"),
      description: t("experience3Description"),
      technologies: TECHNOLOGIES.university,
    },
    {
      title: t("experience4Title"),
      company: t("experience4Company"),
      period: t("experience4Period"),
      description: t("experience4Description"),
      technologies: [],
      isEducation: true,
    },
  ];

  const data = experiences.map((exp) => ({
    title: exp.period,
    content: (
      <div>
        <div className="flex items-center gap-2">
          {exp.isEducation && (
            <span className="rounded bg-pink-100 px-2 py-0.5 text-xs text-pink-800 dark:bg-pink-900 dark:text-pink-200">
              {t("education")}
            </span>
          )}
          <h4 className="text-lg font-bold text-foreground">{exp.company}</h4>
        </div>
        <p className="text-sm text-muted-foreground">{exp.title}</p>
        <p className="mt-2 text-muted-foreground">{exp.description}</p>
        {exp.technologies.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {exp.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    ),
  }));

  return (
    <div className="mt-16">
      <Timeline data={data} />
    </div>
  );
}
