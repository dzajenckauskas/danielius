export type Project = {
  slug: string;
  name: string;
  domain: string;
  url: string;
  repository?: string;
  year: string;
  period: string;
  engagement: string;
  location: string;
  role: string;
  summary: string;
  about: string[];
  contribution: string[];
  stack: string[];
  accent: "lilac" | "sage" | "rose" | "sand" | "blue";
};

export const projects: Project[] = [
  {
    slug: "muses-shop",
    name: "Musės Shop",
    domain: "muses.lt",
    url: "https://muses.lt",
    repository: "https://github.com/dzajenckauskas/muses-shop",
    year: "2025",
    period: "October 2025 – Present",
    engagement: "Independent product",
    location: "Remote",
    role: "Full-Stack Engineer",
    summary:
      "A specialist fly-tying marketplace connecting a customer storefront with seller, support and administration workflows.",
    about: [
      "Musės Shop is a specialist marketplace for handcrafted fly-fishing flies, designed as a single product ecosystem rather than an isolated storefront. Customer shopping, seller operations, support and internal administration are delivered through dedicated applications with a shared technical foundation.",
      "The platform is structured as an npm-workspaces monorepo, allowing domain types, authentication, forms, internationalisation and back-office UI patterns to evolve consistently across eleven workspaces.",
    ],
    contribution: [
      "Designed and developed the Next.js storefront and operational applications for administrators, sellers and support teams.",
      "Built shared packages for domain types, authentication, forms, themes and reusable back-office components.",
      "Implemented catalogue, variants, stock management, cart and checkout workflows with Stripe payment integration.",
      "Established automated testing, pre-commit quality checks and CI workflows across the monorepo.",
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Strapi 5",
      "PostgreSQL",
      "Material UI",
      "Stripe",
      "Vitest",
      "Playwright",
      "npm Workspaces",
    ],
    accent: "lilac",
  },
  {
    slug: "deliver1",
    name: "Deliver1",
    domain: "deliver1.co.uk",
    url: "https://deliver1.co.uk",
    repository: "https://github.com/dzajenckauskas/deliver1",
    year: "2024",
    period: "March 2024 – Present",
    engagement: "Commercial client project",
    location: "United Kingdom · Remote",
    role: "Frontend Engineer",
    summary:
      "A customer-facing international removals platform supporting quotations and relocations by road, sea and air.",
    about: [
      "Deliver1 turns a complex international-moving service into a clear digital journey. Visitors can understand available transport options, request an estimate and progress through structured relocation workflows.",
      "The ongoing rebuild focuses on making the product easier to maintain and extend while preserving a conversion-oriented experience across desktop and mobile devices.",
    ],
    contribution: [
      "Reworked the front-end architecture and introduced typed, reusable patterns across the application.",
      "Developed multi-step quote and booking experiences with location, date and contact-data validation.",
      "Integrated CMS content, Stripe payments, transactional email and third-party service data.",
      "Improved responsive behaviour, content presentation and performance across media-heavy pages.",
    ],
    stack: [
      "Next.js 14",
      "React 18",
      "TypeScript",
      "Material UI",
      "Emotion",
      "React Hook Form",
      "SWR",
      "Stripe",
      "Strapi",
      "PostgreSQL",
    ],
    accent: "blue",
  },
  {
    slug: "relohub",
    name: "Relohub",
    domain: "relohub.co.uk",
    url: "https://relohub.co.uk",
    repository: "https://github.com/dzajenckauskas/relohub",
    year: "2024",
    period: "March 2024 – June 2025",
    engagement: "Commercial client project",
    location: "United Kingdom · Remote",
    role: "Frontend Engineer",
    summary:
      "A relocation-services platform built around clear service discovery, instant estimates and lead generation.",
    about: [
      "Relohub provides a focused entry point for customers planning moves across Europe and overseas. The interface communicates a broad logistics offering while guiding visitors toward a personalised estimate.",
      "The product combines service content, country data and enquiry workflows in a responsive Next.js application backed by a headless content platform.",
    ],
    contribution: [
      "Built responsive service and landing-page experiences from reusable React and Material UI components.",
      "Implemented a multi-step estimate flow with country, phone, date and customer-data validation.",
      "Connected lead-capture workflows to backend services and transactional email handling.",
      "Supported CMS-managed content and scalable page structures for international service coverage.",
    ],
    stack: [
      "Next.js 14",
      "React 18",
      "TypeScript",
      "Material UI",
      "Emotion",
      "React Hook Form",
      "Axios",
      "Stripe",
      "Strapi",
      "PostgreSQL",
    ],
    accent: "sage",
  },
  {
    slug: "noreikis",
    name: "Noreikis",
    domain: "noreikis.com",
    url: "https://www.noreikis.com",
    repository: "https://github.com/dzajenckauskas/noreikis",
    year: "2023",
    period: "December 2023 – Present",
    engagement: "Commercial client project",
    location: "Lithuania · Remote",
    role: "Frontend Engineer",
    summary:
      "A real-estate platform combining broker positioning, property discovery and qualified lead generation.",
    about: [
      "Noreikis is a digital presence for a Lithuanian real-estate broker, bringing personal positioning, active listings, sold properties, market content and client recommendations into one coherent experience.",
      "The platform is designed to support organic discovery and convert property owners and buyers through contextual forms and clear routes to contact.",
    ],
    contribution: [
      "Developed the responsive Next.js interface and reusable content sections across the public website.",
      "Integrated Strapi-managed property listings, articles, testimonials and page content.",
      "Built lead-generation and property-valuation forms with structured validation and API handling.",
      "Implemented multilingual content, motion details, technical SEO and VPS deployment workflows.",
    ],
    stack: [
      "Next.js 14",
      "React 18",
      "TypeScript",
      "Material UI",
      "Emotion",
      "Strapi",
      "PostgreSQL",
      "React Hook Form",
      "Framer Motion",
      "next-i18next",
    ],
    accent: "sand",
  },
  {
    slug: "opklinika",
    name: "OpKlinika",
    domain: "opklinika.lt",
    url: "https://www.opklinika.lt",
    repository: "https://github.com/dzajenckauskas/opklinika-front",
    year: "2023",
    period: "March 2023 – Present",
    engagement: "Commercial client project",
    location: "Vilnius, Lithuania",
    role: "Frontend Engineer",
    summary:
      "A healthcare content and product platform for an orthopaedic clinic, its services and technical-aid catalogue.",
    about: [
      "OpKlinika makes specialist orthopaedic services and technical products easier to understand and navigate. The website combines clinic information, consultations, rehabilitation services and a structured catalogue of orthopaedic aids.",
      "A headless CMS allows the clinic team to maintain detailed service, category and product information while the frontend keeps discovery consistent across a large content surface.",
    ],
    contribution: [
      "Built and maintained responsive service, category, product and informational page templates.",
      "Integrated structured Strapi content and API-driven catalogue search and navigation.",
      "Developed enquiry flows, PDF catalogue generation and email delivery integrations.",
      "Introduced component tests and modernised legacy layout patterns for maintainability.",
    ],
    stack: [
      "Next.js 13",
      "React 18",
      "TypeScript",
      "Material UI",
      "Emotion",
      "Strapi",
      "PostgreSQL",
      "React PDF",
      "SendGrid",
      "Vitest",
    ],
    accent: "rose",
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
