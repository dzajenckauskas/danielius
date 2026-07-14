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
  caseStudy: {
    challenge: string;
    decisions: string[];
    quality: string[];
    outcome: string;
  };
  sourceAccess?: {
    visibility: "private";
    note: string;
  };
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
    role: "Front-end Engineer",
    summary:
      "A multi-application business platform covering ERP, financials, payroll, HR, audit and employee self-service workflows.",
    about: [
      "Lobasoft is a large enterprise software ecosystem composed of 35 React applications and 12 shared packages. Its products support data-heavy operational workflows across finance, accounting, payroll, HR, audit, document management and employee self-service.",
      "The front-end is organised as a Turborepo monorepo with reusable UI, form, data, document and domain packages. A config-driven architecture turns resource definitions into consistent forms, lists, filters, actions and detail views while still supporting specialised product workflows.",
    ],
    contribution: [
      "Built and modernised config-driven forms, data tables, filters and action workflows shared across ERP, payroll, projects and financial applications.",
      "Developed React PDF reports and document previews for invoices, packing lists, audit requests and HR processes.",
      "Created React Email templates for approval, rejection, signing and employee-notification workflows across HR self-service products.",
      "Implemented document upload, qualified-signing and process-driven interfaces with detailed validation and backend error handling.",
      "Strengthened shared TypeScript packages, responsive behaviour and focused Playwright coverage across a large npm-workspaces codebase.",
    ],
    caseStudy: {
      challenge:
        "Modernise data-heavy business workflows across dozens of applications without fragmenting interaction patterns or breaking compatibility with established backend contracts.",
      decisions: [
        "Moved repeated form, list, filter and action behaviour into shared TypeScript packages and configuration-driven resource definitions.",
        "Kept specialised document, signing and financial workflows composable instead of forcing every product into one generic screen model.",
      ],
      quality: [
        "Used strict typing and targeted application builds to control the blast radius of shared-package changes.",
        "Added focused Playwright checks and explicit loading, validation and structured backend-error states for business-critical flows.",
      ],
      outcome:
        "Teams can extend related ERP, payroll and financial workflows through consistent patterns while preserving the domain-specific behaviour each product requires.",
    },
    sourceAccess: {
      visibility: "private",
      note: "Commercial source code is confidential. I can provide an architecture walkthrough and discuss selected implementation decisions where client agreements allow.",
    },
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
    slug: "tezaurus",
    name: "Tezaurus",
    domain: "tezaurus.lt",
    url: "https://tezaurus.lt",
    year: "2024",
    period: "2024 – Present",
    engagement: "Commercial product development",
    location: "Vilnius, Lithuania · Hybrid",
    role: "Front-end Engineer",
    summary:
      "A multilingual corporate and client self-service platform for an audit and accounting group, serving three branded websites from one codebase.",
    about: [
      "Tezaurus is the web platform of UAB „Tezaurus auditas“, a Lithuanian audit, accounting and payroll group with more than three decades of practice. Beyond presenting services and generating leads, the platform lets clients register, subscribe to services, place orders and settle payments in authenticated self-service flows.",
      "The codebase is white-label by design: a single Next.js application powers tezaurus.lt and two sibling brands, with theming, analytics, push notifications and social integrations resolved per brand at build time. Marketing content is managed in an in-house headless CMS and delivered over GraphQL.",
    ],
    contribution: [
      "Built the multilingual (LT/EN) Next.js App Router front-end with locale-prefixed routing and CMS-managed services, pricing, team, career and article content.",
      "Implemented the white-label architecture that ships three branded websites from one component tree, each with its own theme, analytics and integration configuration.",
      "Developed account journeys covering registration, email confirmation, password recovery and Dokobit e-identity sign-in on top of next-auth.",
      "Built subscription and order checkout with coupons, Braintree payment methods and an invoice-payment fallback, plus proforma, invoice and contract-conditions PDFs rendered with React PDF.",
      "Created a suite of React Email transactional templates — orders, subscriptions, expiration reminders, contract and termination notices — alongside validated lead-generation forms.",
      "Handled technical SEO, per-brand analytics via next/third-parties, image optimisation and bundle analysis for a content-heavy multilingual surface.",
    ],
    caseStudy: {
      challenge:
        "Serve three differently branded companies from one maintainable codebase while combining marketing content with authenticated subscription, ordering and payment self-service.",
      decisions: [
        "Resolved brand identity at build time — theme, analytics, push and social integrations — so shared components stay unaware of which site they render.",
        "Kept editable marketing content in the headless CMS over GraphQL while modelling account, checkout and payment journeys as explicit application workflows.",
      ],
      quality: [
        "Modelled payment progress as explicit states (awaiting payment, awaiting contract, pending, paid) with matching transactional email templates for each transition.",
        "Used default-locale-clean multilingual routing, structured metadata and image and bundle optimisation to keep a large content surface fast and discoverable.",
      ],
      outcome:
        "The group operates three branded web products from a single front-end codebase, and clients move from marketing pages into signed-in subscription, ordering and invoicing flows without leaving the product.",
    },
    sourceAccess: {
      visibility: "private",
      note: "Commercial source code is confidential. I can walk through the white-label architecture and selected checkout and account flows where client agreements allow.",
    },
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Material UI",
      "Emotion",
      "next-intl",
      "Apollo GraphQL",
      "next-auth",
      "MySQL",
      "Braintree",
      "React PDF",
      "React Email",
    ],
    accent: "blue",
  },
  {
    slug: "muses-fly-tying-market",
    name: "Musės - Fly Tying Market",
    domain: "muses.lt",
    url: "https://muses.lt",
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
    caseStudy: {
      challenge:
        "Build a multi-seller marketplace as one coherent product while keeping storefront, seller, support and administration concerns independently maintainable.",
      decisions: [
        "Separated five applications around user roles while sharing authentication, domain types, forms, localisation and UI foundations through six packages.",
        "Modelled payment, stock and seller-finance transitions explicitly so Stripe retries and failed checkout paths could be handled safely.",
      ],
      quality: [
        "Covered domain services and payment edge cases with Vitest, then used Playwright for high-value customer and operational journeys.",
        "Added webhook deduplication, stock restoration, rate limiting and visible action-level error states rather than treating failure paths as secondary UI.",
      ],
      outcome:
        "The product can evolve across customer and operational surfaces without duplicating core business rules or compromising checkout and inventory integrity.",
    },
    sourceAccess: {
      visibility: "private",
      note: "The product repository is private. A guided walkthrough or focused, sanitised code sample can be shared for a relevant technical review.",
    },
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
    year: "2024",
    period: "March 2024 – Present",
    engagement: "Commercial client project",
    location: "United Kingdom · Remote",
    role: "Front-end Engineer",
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
    caseStudy: {
      challenge:
        "Simplify a high-friction international moving journey while incrementally improving a live, conversion-focused product with existing content and service integrations.",
      decisions: [
        "Split quotation and booking into validated steps that keep location, inventory, date, identity and payment concerns understandable.",
        "Used Strapi for editable service content while keeping payment, phone verification and customer issue tracking in explicit application workflows.",
      ],
      quality: [
        "Designed retry, cooldown, loading and actionable error states around verification, email and payment operations.",
        "Reduced media cost with progressive loading, adjacent-image preloading and touch-friendly navigation rather than loading full galleries eagerly.",
      ],
      outcome:
        "Customers receive a clearer path from initial estimate to structured booking, while the front-end is easier to extend across service and support journeys.",
    },
    sourceAccess: {
      visibility: "private",
      note: "Client source code is private. I can discuss the architecture and demonstrate public workflows; repository access requires the client's permission.",
    },
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
    year: "2023",
    period: "December 2023 – Present",
    engagement: "Commercial client project",
    location: "Lithuania · Remote",
    role: "Front-end Engineer",
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
    caseStudy: {
      challenge:
        "Balance a distinctive personal brand with fast property discovery, editable content and reliable lead capture for buyers and sellers.",
      decisions: [
        "Structured property, editorial, testimonial and SEO content in Strapi so the broker could update the site without front-end releases.",
        "Kept valuation and contact journeys contextual to the content that triggered them, with reusable validated form primitives.",
      ],
      quality: [
        "Added multilingual routing and metadata, predictable property sorting and careful motion that does not obscure primary actions.",
        "Automated deployment and kept form submission failures visible and recoverable for prospective clients.",
      ],
      outcome:
        "The platform supports both organic discovery and qualified enquiries while remaining maintainable by a small content and development workflow.",
    },
    sourceAccess: {
      visibility: "private",
      note: "Client source code is private. Product decisions and implementation patterns can be discussed without exposing proprietary content or credentials.",
    },
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
    year: "2023",
    period: "March 2023 – Present",
    engagement: "Commercial client project",
    location: "Vilnius, Lithuania",
    role: "Front-end Engineer",
    summary:
      "A healthcare content and product platform for an orthopaedic clinic, its services and technical-aid catalogue.",
    about: [
      "Ortopedijos Paslaugų Klinika makes specialist orthopaedic services and technical products easier to understand and navigate. The website combines clinic information, consultations, rehabilitation services and a structured catalogue of orthopaedic aids.",
      "A headless CMS allows the clinic team to maintain detailed service, category and product information while the front-end keeps discovery consistent across a large content surface.",
    ],
    contribution: [
      "Built responsive service, category, product and clinic-information templates for a content-rich healthcare website.",
      "Modelled and integrated structured Strapi content for services, product categories, diagnoses, reviews and pricing.",
      "Generated branded, data-driven product catalogues on demand with React PDF, including diagnosis and reimbursement tables.",
      "Delivered validated enquiry forms and SendGrid email handling, then added component tests and performance-focused data loading.",
    ],
    caseStudy: {
      challenge:
        "Make a large healthcare service and technical-aid catalogue understandable to patients while preserving detailed diagnosis and reimbursement information.",
      decisions: [
        "Modelled services, products, categories, diagnoses and pricing as structured Strapi content rather than embedding medical catalogue data in page components.",
        "Generated the printable catalogue from the same data model with React PDF so web and document outputs stay aligned.",
      ],
      quality: [
        "Tested enquiry behaviour and PDF-oriented components while reducing payloads and prioritising content needed for the first render.",
        "Handled custom fonts, long tables and multi-page layout explicitly so generated catalogues remain usable outside the browser.",
      ],
      outcome:
        "Clinic staff can maintain one structured catalogue while patients receive consistent product information online and in a branded downloadable document.",
    },
    sourceAccess: {
      visibility: "private",
      note: "Client source code is private. I can demonstrate the public product and explain the React PDF and Strapi architecture in a technical walkthrough.",
    },
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
