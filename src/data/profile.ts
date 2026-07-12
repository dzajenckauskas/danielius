// Single source of truth for all site content, adapted from the CV.
// Tweak copy here — components read from these constants.

export const profile = {
  name: "Danielius Zajenckauskas",
  firstName: "Danielius",
  role: "Front-End Developer",
  tagline:
    "Front-End Developer building clean, scalable web apps with React, Next.js & TypeScript — with a visual-design background.",
  location: "Vilnius, Lithuania",
  availability: "Open to front-end opportunities",
  email: "d.zajenckauskas@gmail.com",
  github: "https://github.com/dzajenckauskas",
  // No LinkedIn in the CV — fill in to show the icon, or leave empty to hide it.
  linkedin: "",

  about: [
    "My path as a front-end developer began during the COVID-19 lockdowns — starting with simple HTML/CSS courses and quickly turning into a deep passion for building for the web. I sharpened that foundation on the Front-End Developer program at the Baltic Institute of Technology, covering HTML, CSS/SCSS, JavaScript, Angular, Node.js and both SQL and NoSQL data handling.",
    "That dedication, paired with a keen eye for detail and a background in visual design, paid off when I joined Ideaformus as a front-end developer. There I dove deep into functional programming with TypeScript, React and Next.js, and data handling with REST and GraphQL — shipping everything from representative websites to custom e-commerce apps and complex management systems (CMS, ERP, CRM).",
    "I care about writing clean, reusable code and following best practices — and I can take a project all the way to production, deploying on Linux (Ubuntu) VPS with NGINX and PM2. I'm looking to keep growing on exciting projects alongside a strong team.",
  ],
} as const;

export type SkillGroupData = {
  label: string;
  items: string[];
};

export const skillGroups: SkillGroupData[] = [
  { label: "Languages", items: ["HTML5", "JavaScript", "TypeScript"] },
  {
    label: "Front-End",
    items: [
      "React",
      "Next.js",
      "Redux",
      "Material-UI",
      "Styled Components",
      "CSS / SCSS",
      "Bootstrap",
    ],
  },
  { label: "APIs", items: ["GraphQL", "RESTful"] },
  {
    label: "Additional",
    items: ["Node.js", "SQL", "Strapi", "Shopify", "WordPress", "NGINX", "PM2"],
  },
  {
    label: "UI / UX Design",
    items: ["Figma", "Adobe XD", "Illustrator", "Photoshop"],
  },
  {
    label: "Practices",
    items: [
      "Problem Solving & Debugging",
      "Git",
      "Agile",
      "Web Performance",
      "Cross-Browser Compatibility",
    ],
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
    title: "Front-End Developer",
    org: "Ideaformus",
    period: "Nov 2021 – Present",
    year: "2021",
    description:
      "Crafting clean, scalable code across projects ranging from representative websites to complex e-commerce and management systems. Deep functional-programming work with React & Next.js, plus RESTful and GraphQL data handling.",
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
