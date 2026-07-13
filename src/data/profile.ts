// Single source of truth for all site content, adapted from the CV.
// Tweak copy here — components read from these constants.

export const profile = {
  name: "Danielius Zajenčkauskas",
  firstName: "Danielius",
  role: "Front-End Developer",
  tagline:
    "Front-End Developer delivering scalable, maintainable digital products with React, Next.js and TypeScript.",
  location: "Vilnius, Lithuania",
  availability: "Open to selected front-end opportunities",
  email: "d.zajenckauskas@gmail.com",
  github: "https://github.com/dzajenckauskas",
  linkedin: "https://www.linkedin.com/in/danielius-zajenckauskas/",

  about: [
    "Front-End Developer with commercial experience delivering responsive, scalable web applications and business-critical interfaces. I work primarily with TypeScript, React and Next.js, translating product requirements and complex workflows into reliable, accessible user experiences.",
    "My experience spans e-commerce platforms, internal administration tools, CMS, ERP and CRM solutions, supported by REST and GraphQL integrations, structured state management and automated testing. I contribute across the delivery lifecycle—from technical planning and reusable component architecture to performance, quality assurance and production deployment.",
    "A professional background in visual design complements my engineering practice with strong attention to information hierarchy, consistency and usability. I value pragmatic technical decisions, maintainable code and clear collaboration with product, design and engineering stakeholders.",
  ],
} as const;

export type SkillGroupData = {
  label: string;
  items: string[];
};

export const skillGroups: SkillGroupData[] = [
  { label: "Core", items: ["TypeScript", "JavaScript", "HTML5", "CSS / SCSS"] },
  {
    label: "Front-End",
    items: [
      "React",
      "Next.js",
      "Redux",
      "React Hook Form",
      "Material-UI",
      "Tailwind CSS",
      "Styled Components",
      "Emotion",
    ],
  },
  {
    label: "Data & Integration",
    items: ["REST APIs", "GraphQL", "SWR", "Axios", "Stripe", "next-intl"],
  },
  {
    label: "Full-Stack",
    items: ["Node.js", "Next.js API Routes", "Strapi", "Prisma", "PostgreSQL", "NextAuth.js"],
  },
  {
    label: "Quality & Delivery",
    items: ["Jest", "Vitest", "Playwright", "React Testing Library", "Docker", "Git", "CI/CD", "NGINX"],
  },
  {
    label: "Product & Design",
    items: ["Responsive Design", "Accessibility", "Web Performance", "Figma", "Adobe Creative Suite", "Agile Delivery"],
  },
];

export type TimelineEntry = {
  title: string;
  org?: string;
  period: string;
  year: string;
  description?: string;
  tags?: string[];
};

export const experience: TimelineEntry[] = [
  {
    title: "Frontend Engineer",
    org: "Lobasoft",
    period: "Mar 2024 – Present · Hybrid",
    year: "2024",
    description:
      "Developing and maintaining production web applications with an emphasis on scalable front-end architecture, dependable integrations and high-quality user experiences. Contributing to technical delivery across implementation, testing, performance and ongoing product improvement.",
    tags: [
      "React",
      "Next.js",
      "TypeScript",
      "Material-UI",
      "REST APIs",
      "Testing",
    ],
  },
  {
    title: "Front-End Developer",
    org: "Ideaformus",
    period: "Nov 2021 – Mar 2024 · Vilnius",
    year: "2021",
    description:
      "Delivered customer-facing websites, bespoke e-commerce applications and complex CMS, ERP and CRM interfaces. Built reusable TypeScript and React components, integrated REST and GraphQL services, and supported applications through deployment and production maintenance.",
    tags: [
      "React",
      "Next.js",
      "TypeScript",
      "Redux",
      "Material-UI",
      "GraphQL",
      "REST",
      "Node.js",
      "SQL",
    ],
  },
  {
    title: "Freelance Visual Designer",
    period: "2016 – Present",
    year: "2016",
    description:
      "Working across branding, packaging, editorial and web design — which also grew into hands-on web-development knowledge.",
    tags: ["Branding", "Packaging", "Editorial", "Web Design"],
  },
  {
    title: "Graphic Design Intern",
    org: "TAPE studio · Not Perfect agency",
    period: "Summer 2014",
    year: "2014",
    description:
      "Worked on projects for well-known brands including Švyturys and Vaikystės Sodas, and contributed to the Lietuvos Paštas rebrand alongside a highly professional team.",
    tags: ["Branding", "Graphic Design"],
  },
];

export const education: TimelineEntry[] = [
  {
    title: "Front-End Developer, Course",
    org: "Baltic Institute of Technology",
    period: "2021 · Vilnius",
    year: "2021",
    description:
      "Intensive program covering HTML, CSS/SCSS, JavaScript, Angular.js and Node.js, with SQL and NoSQL data management.",
  },
  {
    title: "Graphic Design, BA",
    org: "Vilnius College of Design",
    period: "2018 · Vilnius",
    year: "2018",
  },
  {
    title: "Secondary Education",
    org: "Mažeikiai Gymnasium of Gabija",
    period: "2012 · Mažeikiai",
    description: "Focus on arts, mechanical drawing and mathematics.",
    year: "2012",
  },
  {
    title: "Fine Arts",
    org: "Mažeikiai School of Fine Arts",
    period: "2009 · Mažeikiai",
    description:
      "Drawing, graphics, composition, color studies and art history.",
    year: "2009",
  },
];

export const languages = [
  { name: "Lithuanian", level: "Native" },
  { name: "English", level: "Fluent" },
];

export const interests = [
  "Cooking",
  "Minimalism",
  "Drawing",
  "Visual Arts",
  "Biking",
  "Photography",
  "Food Design",
  "Digital Media",
];
