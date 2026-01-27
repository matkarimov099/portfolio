"use client";

import { Timeline } from "@/shared/components/aceternity/timeline";
import { EXPERIENCE } from "@/features/about/data/experience";

export function ExperienceTimeline() {
  const data = EXPERIENCE.map((exp) => ({
    title: exp.period,
    content: (
      <div>
        <div className="flex items-center gap-2">
          {exp.isEducation && (
            <span className="rounded bg-pink-100 px-2 py-0.5 text-xs text-pink-800 dark:bg-pink-900 dark:text-pink-200">
              Education
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
