// Single source of truth for all site content, adapted from the CV.
// Tweak copy here — components read from these constants.

export const profile = {
  name: "Danielius Zajenčkauskas",
  firstName: "Danielius",
  role: "Product Engineer",
  tagline:
    "I'm a full-stack engineer with a front-end focus, building complex products from interface to infrastructure.",
  location: "Vilnius, Lithuania",
  availability: "Available for freelance projects, agency partnerships and selected full-time roles",
  email: "danielius@zajenckauskas.lt",
  github: "https://github.com/dzajenckauskas",
  linkedin: "https://www.linkedin.com/in/danielius-zajenckauskas/",

  about: [
    "Front-end engineer with nearly five years of experience across enterprise ERP, finance, payroll, HR, e-commerce, healthcare and real estate products. I specialise in React architecture and complex product interfaces, and I also build the Node.js/Strapi services and integrations needed to deliver complete products.",
    "My current work ranges from shared packages used by 35 enterprise applications to an independently built five-application marketplace. I work with REST and GraphQL APIs, PostgreSQL, payments, PDF generation, transactional email and production delivery, backed by focused automated tests.",
    "A graphic design background shapes how I approach information hierarchy, responsive behaviour and interaction detail. I prefer pragmatic systems that are clear to use and straightforward to maintain.",
  ],
} as const;

export type SkillGroupData = {
  label: string;
  description: string;
  items: string[];
  resumeItems?: string[];
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
      "Domain Modelling",
      "Product Delivery",
    ],
    resumeItems: ["Workflow Design", "Domain Modelling", "Product Delivery"],
  },
  {
    label: "Front-end Architecture",
    description: "Building typed foundations that stay coherent across applications and teams.",
    items: ["TypeScript", "React", "Next.js", "React Hook Form", "Yup", "Redux Toolkit", "Zustand", "Shared Packages", "Config-driven UI", "Monorepos"],
    resumeItems: ["TypeScript", "React", "Next.js", "Shared Packages", "Config-driven UI", "Monorepos"],
  },
  {
    label: "API & Data Orchestration",
    description: "Coordinating data contracts, asynchronous states and recoverable integration flows.",
    items: ["Node.js", "Strapi", "PostgreSQL", "REST APIs", "GraphQL", "SWR", "Webhooks", "Type-safe Contracts"],
    resumeItems: ["Node.js", "Strapi", "PostgreSQL", "REST APIs", "GraphQL", "Webhooks"],
  },
  {
    label: "Performance & Accessibility",
    description: "Keeping interfaces fast and usable across devices, content and assistive tech.",
    items: ["Semantic HTML", "Accessibility", "Web Performance", "Progressive Loading", "Payload Control", "Responsive Delivery"],
  },
  {
    label: "Reliability & Quality",
    description: "Making critical journeys testable, understandable and resilient when dependencies fail.",
    items: ["Playwright", "Vitest", "React Testing Library", "Error Handling", "CI/CD", "AI-assisted development"],
    resumeItems: ["Playwright", "Vitest", "CI/CD", "AI-assisted development"],
  },
  {
    label: "Content & Delivery Systems",
    description: "Connecting editable content, documents, communication and production infrastructure.",
    items: ["Nodemailer", "React Email", "Stripe", "Docker", "PM2", "NGINX", "Cloudflare Turnstile"],
  },
];

export type HireCardData = {
  title: string;
  description: string;
  tags: string[];
};

export const hireCards: HireCardData[] = [
  {
    title: "Product Development",
    description:
      "React and Next.js products supported by the APIs, integrations and delivery systems they need.",
    tags: ["New products", "MVPs", "New features", "SaaS"],
  },
  {
    title: "Existing Product Support",
    description:
      "Join an existing codebase to ship features, fix front-end problems or improve architecture.",
    tags: ["Feature development", "Refactoring", "Performance", "Integrations"],
  },
  {
    title: "Agency Development Partner",
    description:
      "Additional front-end or full-stack product capacity for client work and busy internal teams.",
    tags: ["Figma → React", "Client projects", "Integrations", "White-label development"],
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
      "Sole front-end engineer for a 35-application enterprise platform spanning ERP, financials, payroll, HR and audit. Own shared TypeScript packages and config-driven resource interfaces, and deliver specialised accounting, reporting, document and signing workflows with focused Playwright coverage.",
    tags: [
      "React",
      "TypeScript",
      "Material UI",
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
      "Delivered customer websites, e-commerce products and CMS, ERP and CRM interfaces. Built reusable React systems and Strapi backends, integrated REST and GraphQL services, and shipped multilingual checkout, lead capture, PDF catalogue and email workflows.",
    tags: [
      "React",
      "Next.js",
      "TypeScript",
      "Redux",
      "Material UI",
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
      "Selective freelance work across branding, packaging, editorial and digital design.",
    tags: ["Branding", "Packaging", "Editorial", "Web Design"],
  },
  {
    title: "Graphic Design Intern",
    org: "TAPE studio · Not Perfect agency",
    period: "Summer 2014",
    year: "2014",
    description:
      "Contributed to work for Švyturys and Vaikystės Sodas and to the Lietuvos Paštas rebrand.",
    tags: ["Branding", "Graphic Design"],
  },
];

export const education: TimelineEntry[] = [
  {
    title: "Front-End Development Programme",
    org: "Baltic Institute of Technology",
    period: "2021 · Vilnius",
    year: "2021",
    description:
      "Intensive programme covering HTML, CSS/SCSS, JavaScript, AngularJS and Node.js, with SQL and NoSQL data management.",
  },
  {
    title: "Graphic Design, BA",
    org: "Vilnius College of Design",
    period: "2018 · Vilnius",
    year: "2018",
  },
];

export const languages = [
  { name: "Lithuanian", level: "Native" },
  { name: "English", level: "Fluent" },
];

export const interests = ["Visual Arts", "Minimalism", "Cooking", "Fly fishing"];
