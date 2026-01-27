export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
  isEducation?: boolean;
}

export const EXPERIENCE: Experience[] = [
  {
    title: "Senior Frontend Developer",
    company: "UNICON-SOFT, Tashkent",
    period: "2024 - Present",
    description:
      "Building enterprise-grade web applications with React and Next.js. Driving frontend architecture decisions and mentoring junior developers to maintain high code quality across the team.",
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Frontend Team Lead",
    company: "IT-FORLEAD, Tashkent",
    period: "2021 - 2024",
    description:
      "Led a frontend team for over 2.5 years, delivering multiple web applications from scratch. Conducted code reviews, established development workflows, and collaborated closely with backend and design teams to ship reliable products.",
    technologies: ["React", "Next.js", "TypeScript", "Redux", "REST API"],
  },
  {
    title: "Bachelor's in Computer Engineering",
    company: "TUIT (al-Khwarizmi branch), Urgench",
    period: "2018 - 2022",
    description:
      "Earned a Bachelor's degree in Computer Engineering, building a strong foundation in software development, algorithms, and system design.",
    technologies: [],
    isEducation: true,
  },
];
