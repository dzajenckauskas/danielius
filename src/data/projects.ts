export type Project = {
  slug: string;
  name: string;
  domain: string;
  url?: string;
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
    slug: "lobasoft-enterprise-platform",
    name: "Lobasoft Enterprise Platform",
    domain: "Private commercial platform",
    year: "2024",
    period: "March 2024 – Present",
    engagement: "Commercial product development",
    location: "Vilnius, Lithuania · Hybrid",
    role: "Frontend Engineer",
    summary:
      "A multi-application business platform covering ERP, financials, payroll, HR, audit and employee self-service workflows.",
    about: [
      "Lobasoft is a large enterprise software ecosystem composed of 35 React applications and 12 shared packages. Its products support data-heavy operational workflows across finance, accounting, payroll, HR, audit, document management and employee self-service.",
      "The frontend is organised as a Turborepo monorepo with reusable UI, form, data, document and domain packages. A config-driven architecture turns resource definitions into consistent forms, lists, filters, actions and detail views while still supporting specialised product workflows.",
    ],
    contribution: [
      "Built and modernised config-driven forms, data tables, filters and action workflows shared across ERP, payroll, projects and financial applications.",
      "Developed React PDF reports and document previews for invoices, packing lists, audit requests and HR processes.",
      "Created React Email templates for approval, rejection, signing and employee-notification workflows across HR self-service products.",
      "Implemented document upload, qualified-signing and process-driven interfaces with detailed validation and backend error handling.",
      "Strengthened shared TypeScript packages, responsive behaviour and focused Playwright coverage across a large npm-workspaces codebase.",
    ],
    stack: [
      "React 18",
      "TypeScript",
      "Material UI",
      "React PDF",
      "React Email",
      "Vite",
      "Turborepo",
      "React Hook Form",
      "OData / REST APIs",
      "Playwright",
    ],
    accent: "sage",
  },
  {
    slug: "muses-fly-tying-market",
    name: "Musės - Fly Tying Market",
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
      "Musės - Fly Tying Market is a specialist marketplace for handcrafted fly-fishing flies, designed as a single product ecosystem rather than an isolated storefront. Customer shopping, seller operations, support and internal administration are delivered through dedicated applications with a shared technical foundation.",
      "The platform is structured as an npm-workspaces monorepo spanning five applications and six shared packages, allowing domain types, authentication, forms, internationalisation and back-office UI patterns to evolve consistently.",
    ],
    contribution: [
      "Designed the Next.js storefront and dedicated admin, seller and support applications, backed by custom Strapi content types and services.",
      "Built shared packages for domain types, authentication, forms, localisation, themes and reusable back-office components.",
      "Implemented multi-seller catalogue, variant and stock workflows plus Stripe checkout with webhook deduplication and stock restoration safeguards.",
      "Developed seller onboarding, wallets, payouts, statements, reconciliation and dispute-management workflows.",
      "Added OTP/2FA authentication, rate-limited public support flows, editable notification templates and automated Vitest/Playwright coverage.",
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
      "Reworked the front-end architecture and introduced typed, reusable patterns across the customer journey.",
      "Developed instant-quote, inventory and multi-step booking experiences with location, date, phone and contact-data validation.",
      "Integrated Strapi-managed content, Stripe payments, Firebase phone verification and Nodemailer transactional emails.",
      "Built an issue-tracking flow with secure customer tokens, attachments, assignment, status updates and branded notifications.",
      "Improved media performance with touch-friendly galleries, progressive loading and adjacent-image preloading.",
    ],
    stack: [
      "Next.js 14",
      "React 18",
      "TypeScript",
      "Strapi",
      "Material UI",
      "Emotion",
      "React Hook Form",
      "SWR",
      "Stripe",
      "PostgreSQL",
      "Firebase",
      "Nodemailer",
    ],
    accent: "blue",
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
      "Developed the responsive Next.js interface and reusable property, editorial and profile sections across the public website.",
      "Modelled and integrated Strapi-managed listings, articles, FAQs, testimonials, galleries and SEO metadata.",
      "Built validated contact and property-price enquiry flows with branded transactional email templates.",
      "Implemented multilingual content, property sorting and filtering, motion details, technical SEO and automated VPS deployment.",
    ],
    stack: [
      "Next.js 14",
      "React 18",
      "TypeScript",
      "Strapi",
      "Material UI",
      "Emotion",
      "PostgreSQL",
      "React Hook Form",
      "Framer Motion",
      "next-i18next",
    ],
    accent: "sand",
  },
  {
    slug: "opklinika",
    name: "Ortopedijos Paslaugų Klinika",
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
      "Ortopedijos Paslaugų Klinika makes specialist orthopaedic services and technical products easier to understand and navigate. The website combines clinic information, consultations, rehabilitation services and a structured catalogue of orthopaedic aids.",
      "A headless CMS allows the clinic team to maintain detailed service, category and product information while the frontend keeps discovery consistent across a large content surface.",
    ],
    contribution: [
      "Built responsive service, category, product and clinic-information templates for a content-rich healthcare website.",
      "Modelled and integrated structured Strapi content for services, product categories, diagnoses, reviews and pricing.",
      "Generated branded, data-driven product catalogues on demand with React PDF, including diagnosis and reimbursement tables.",
      "Delivered validated enquiry forms and SendGrid email handling, then added component tests and performance-focused data loading.",
    ],
    stack: [
      "Next.js 13",
      "React 18",
      "TypeScript",
      "Strapi",
      "Material UI",
      "Emotion",
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
