// Single source of truth for all site content, adapted from the CV.
// Tweak copy here — components read from these constants.

export const profile = {
  name: "Danielius Zajenčkauskas",
  firstName: "Danielius",
  role: "Frontend Engineer",
  tagline:
    "Frontend Engineer building maintainable enterprise platforms and customer-facing products with React, Next.js and TypeScript.",
  location: "Vilnius, Lithuania",
  availability: "Open to selected front-end opportunities",
  email: "danielius@zajenckauskas.lt",
  github: "https://github.com/dzajenckauskas",
  linkedin: "https://www.linkedin.com/in/danielius-zajenckauskas/",

  about: [
    "Frontend Engineer with commercial experience across enterprise ERP, finance, payroll and HR software, alongside e-commerce, healthcare and real-estate products. I turn complex workflows and domain rules into reliable, accessible interfaces with TypeScript, React and Next.js.",
    "I work beyond individual screens: designing shared component packages, config-driven forms and data tables, Strapi content models, REST and GraphQL integrations, PDF reports, transactional email templates and automated test coverage. Recent work spans a 35-app enterprise monorepo and an independently developed multi-application marketplace.",
    "My background in graphic design brings strong product judgement to information hierarchy, responsive behaviour and interaction details. I favour pragmatic architecture, explicit types and reusable patterns that help teams ship confidently and maintain products over time.",
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
      "Emotion",
      "Framer Motion",
    ],
  },
  {
    label: "Data & Integration",
    items: ["REST APIs", "OData", "GraphQL", "SWR", "Axios", "Stripe", "Firebase"],
  },
  {
    label: "Platforms & Content",
    items: ["Node.js", "Strapi", "PostgreSQL", "React PDF", "React Email", "Nodemailer"],
  },
  {
    label: "Quality & Delivery",
    items: ["Vitest", "Playwright", "React Testing Library", "Turborepo", "Docker", "Git", "CI/CD", "NGINX"],
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
      "Building and modernising a 35-application enterprise platform spanning ERP, financials, payroll, HR and audit. Develop shared TypeScript packages and config-driven form/list architecture; deliver PDF reporting, React Email notifications, document upload and signing workflows; and improve accessibility, error handling and automated coverage.",
    tags: [
      "React",
      "TypeScript",
      "Material-UI",
      "Vite",
      "React PDF",
      "React Email",
      "REST / OData",
      "Playwright",
    ],
  },
  {
    title: "Front-End Developer",
    org: "Ideaformus",
    period: "Nov 2021 – Mar 2024 · Vilnius",
    year: "2021",
    description:
      "Delivered customer-facing websites, bespoke e-commerce applications and CMS, ERP and CRM interfaces. Built reusable TypeScript and React systems, modelled content in Strapi, integrated REST and GraphQL services, and shipped multilingual lead-generation, checkout, PDF catalogue and transactional-email workflows.",
    tags: [
      "React",
      "Next.js",
      "TypeScript",
      "Redux",
      "Material-UI",
      "Strapi",
      "GraphQL",
      "REST",
      "React PDF",
    ],
  },
  {
    title: "Freelance Graphic Designer",
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
    org: "Mažeikių Gabijos Gimnazija",
    period: "2012 · Mažeikiai",
    description: "Focus on arts, mechanical drawing and mathematics.",
    year: "2012",
  },
  {
    title: "Fine Arts",
    org: "Mažeikių Dailės Mokykla",
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
  "Fly Fishing",
  "Digital Media",
];
