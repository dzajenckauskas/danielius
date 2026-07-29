// Single source of truth for all site content, adapted from the CV.
// Tweak copy here — components read from these constants.

export const profile = {
  name: "Danielius Zajenčkauskas",
  firstName: "Danielius",
  role: "Front-end / Product Engineer",
  tagline:
    "I turn complex business workflows into reliable, accessible products — and the shared systems that keep them maintainable.",
  location: "Vilnius, Lithuania",
  availability: "Open to full-time roles and select freelance work",
  email: "danielius@zajenckauskas.lt",
  github: "https://github.com/dzajenckauskas",
  linkedin: "https://www.linkedin.com/in/danielius-zajenckauskas/",

  about: [
    "Front-end / Product Engineer with 4+ years across enterprise ERP, finance, payroll and HR software, plus e-commerce, healthcare and real-estate products. I turn complex workflows and domain rules into reliable, accessible interfaces — then build the shared systems that keep them consistent at scale.",
    "Beyond individual screens, I design shared component packages, config-driven forms and data tables, Strapi content models, REST/GraphQL integrations, PDF reports and transactional email. Recent work spans a 35-app enterprise monorepo and an independently built marketplace. I also build with AI coding agents, holding their output to the same review, typing and test standards as any other code — my open-source Toolkit ships this way.",
    "A graphic design background shapes how I judge information hierarchy, responsive behaviour and interaction detail. I favour pragmatic architecture and reusable patterns that help teams ship confidently and maintain products over time.",
  ],
} as const;

export type SkillGroupData = {
  label: string;
  description: string;
  items: string[];
};

export const skillGroups: SkillGroupData[] = [
  {
    label: "Product Engineering",
    description: "Turning domain rules and user needs into clear, maintainable product workflows.",
    items: [
      "Workflow Design",
      "Information Architecture",
      "Responsive UX",
      "Conversion Journeys",
    ],
  },
  {
    label: "Front-end Architecture",
    description: "Building typed foundations that stay coherent across applications and teams.",
    items: ["TypeScript", "React", "Next.js", "Shared Packages", "Config-driven UI", "Monorepos"],
  },
  {
    label: "API & Data Orchestration",
    description: "Coordinating data contracts, asynchronous states and recoverable integration flows.",
    items: ["REST APIs", "GraphQL", "SWR", "Type-safe Contracts", "Failure States"],
  },
  {
    label: "Performance & Accessibility",
    description: "Keeping interfaces fast and usable across devices, content and assistive tech.",
    items: ["Semantic HTML", "Accessibility", "Web Performance", "Progressive Loading", "Payload Control", "Responsive Delivery"],
  },
  {
    label: "Reliability & Quality",
    description: "Making critical journeys testable, understandable and resilient when dependencies fail.",
    items: ["Playwright", "Vitest", "React Testing Library", "Error Handling", "CI/CD", "AI-assisted delivery"],
  },
  {
    label: "Content & Delivery Systems",
    description: "Connecting editable content, documents, communication and production infrastructure.",
    items: ["Strapi", "PostgreSQL", "React PDF", "React Email", "Stripe", "Docker", "NGINX"],
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
    title: "Front-end Engineer",
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
    title: "Front-end Developer",
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

export const interests = ["Visual Arts", "Minimalism", "Cooking", "Fly fishing"];
