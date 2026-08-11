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
      "A 35-app enterprise platform for ERP, financials, payroll, HR and audit workflows.",
    about: [
      "Lobasoft is a large enterprise software ecosystem composed of 35 React applications and 12 shared packages. Its products support data-heavy operational workflows across finance, accounting, payroll, HR, audit, document management and employee self-service.",
      "The front-end is organised as a Turborepo monorepo with reusable UI, form, data, document and domain packages. A config-driven architecture turns resource definitions into consistent forms, lists, filters, actions and detail views while still supporting specialised product workflows.",
    ],
    contribution: [
      "As the platform's sole front-end engineer, owned delivery from established OData/REST contracts to production UI — config-driven React Hook Form workflows, data tables, filters, actions and detail views across accounting, payroll, HR and financial applications.",
      "Built the accounting workflows themselves: purchase/sales orders, invoice submission/approval and on-demand document rendering.",
      "Built employee self-service document workflows — submission, qualified and non-qualified e-signing by employees and managers — with matching React Email notifications.",
      "Developed time-tracking and timesheet interfaces alongside React PDF documents for invoices, orders and HR processes.",
      "Built and maintained the 12 shared packages for forms, tables, lists, documents, domain types and theming that all ~35 apps consume, with strict TypeScript, Turborepo task orchestration plus Playwright coverage controlling cross-application change risk.",
    ],
    caseStudy: {
      challenge:
        "Modernise data-heavy business workflows across dozens of applications, alone, without fragmenting interaction patterns or breaking compatibility with established backend contracts.",
      decisions: [
        "Moved repeated form, list, filter and action behaviour into shared TypeScript packages and declarative resource definitions, leaving each application to supply domain configuration instead of duplicating orchestration code.",
        "Kept specialised document, signing and financial workflows composable instead of forcing every product into one generic screen model.",
      ],
      quality: [
        "Used strict typing, package-level boundaries and targeted Turborepo application builds to control the blast radius of shared-package changes.",
        "Added focused Playwright coverage and clear loading, validation and backend-error states for the business-critical flows.",
      ],
      outcome:
        "As new apps and workflows join the platform, they extend the same shared patterns instead of reinventing forms and tables from scratch — while still preserving the domain-specific behaviour each product needs.",
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
    slug: "toolkit",
    name: "Toolkit",
    domain: "toolkit.zajenckauskas.lt",
    url: "https://toolkit.zajenckauskas.lt",
    repository: "https://github.com/dzajenckauskas/toolkit",
    year: "2026",
    period: "2026 – Present",
    engagement: "Open-source project",
    location: "Independent · Remote",
    role: "Creator & Maintainer",
    summary:
      "An open-source hub of 49 privacy-first browser tools for image, text, developer, design, PDF and accessibility work.",
    about: [
      "Toolkit puts 49 focused utilities under one searchable, keyboard-driven interface with no account or paywall. Nearly every tool runs on-device: Canvas handles image operations, Web Crypto handles hashing and encryption, and fflate creates archives without uploading user files.",
      "The documented exception is the accessibility checker, which sends a public URL to an isolated, localhost-only Playwright and axe-core runner. The product is organised as a Turborepo monorepo, and a typed registry drives discovery, navigation, the command palette, sitemap and per-tool metadata from one source of truth.",
    ],
    contribution: [
      "Designed a Turborepo/npm-workspaces architecture with separate UI, framework-free logic, tool-registry and shared TypeScript-config packages, consumed from source through compiler-enforced boundaries.",
      "Implemented 49 tools with Canvas, Web Crypto, fflate, markdown-it and QR generation, including a unified image editor for compression, resize, crop and rotation.",
      "Built the registry-driven catalogue and a typed Emotion design system with light/dark theming, keeping search, keyboard navigation, sitemap generation and SEO metadata in sync automatically.",
      "Added a token-authenticated, localhost-only Playwright/axe-core service for the one feature that requires a controlled remote browser, while keeping all file-processing tools client-side.",
      "Set up GitHub Actions CI/CD across lint, formatting, strict typechecking, unit tests, build and Playwright tests, followed by automated deployment to a self-managed VPS behind NGINX with PM2 process management.",
      "Recorded architecture decisions as ADRs, including the deliberate choice of a package monorepo over Module Federation micro-frontends.",
    ],
    caseStudy: {
      challenge:
        "Keep a broad, growing tool catalogue coherent and privacy-conscious while supporting one capability that genuinely requires controlled server-side browser execution.",
      decisions: [
        "Made a tool registry the single source of truth so the catalog, search, navigation and SEO stay in sync as tools are added.",
        "Chose a Turborepo package split (ui / lib / tools) over micro-frontends, keeping boundaries compiler-enforced without runtime fragility (ADR-009).",
        "Kept the accessibility runner as a separate localhost-only process with a shared secret, preserving a clear security and privacy boundary around server-assisted work (ADR-010).",
      ],
      quality: [
        "Covered pure logic and runner boundaries with 266 unit and safety tests, plus 95 Playwright end-to-end tests in real Chromium.",
        "Kept main continuously deployable behind a CI pipeline that must pass formatting, lint, strict types, tests and build before release.",
      ],
      outcome:
        "A live, open-source product that doubles as a public, readable code sample — new tools ship through one well-tested pattern.",
    },
    stack: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Turborepo",
      "Emotion",
      "Canvas API",
      "Web Crypto",
      "fflate",
      "axe-core",
      "Vitest",
      "Playwright",
      "GitHub Actions",
      "PM2",
      "NGINX",
    ],
    accent: "sand",
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
      "A multilingual self-service platform for an audit group — three branded sites from one codebase.",
    about: [
      "Tezaurus is the web platform of UAB „Tezaurus auditas“, a Lithuanian audit, accounting and payroll group with more than three decades of practice. Beyond presenting services and generating leads, the platform lets clients register, subscribe to services, place orders and settle payments in authenticated self-service flows.",
      "The codebase is white-label by design: a single Next.js application powers tezaurus.lt and two sibling brands, with theming, analytics, push notifications and social integrations resolved per brand at build time. An in-house headless CMS owns editable content and exposes it through a typed Apollo GraphQL layer, while commerce and account state remain application concerns.",
    ],
    contribution: [
      "Led the multilingual (LT/EN) Next.js App Router front-end, with locale-prefixed routing and CMS-managed services, pricing, team, career and article content.",
      "Implemented the white-label architecture that ships three branded websites from one component tree, each with its own theme, analytics and integration configuration.",
      "Developed account journeys covering registration, email confirmation, password recovery and Dokobit e-identity sign-in on top of next-auth.",
      "Built React Hook Form and Yup-validated account, lead and checkout flows, with Redux Toolkit handling persistent client-side commerce state where it needed to survive navigation.",
      "Implemented subscription/order checkout with coupons, Braintree payment methods and an invoice-payment fallback; React PDF renders the supporting proformas, invoices and contract conditions.",
      "Created a suite of React Email transactional templates — orders, subscriptions, expiration reminders, contract and termination notices — tied to explicit order-state transitions.",
      "Handled technical SEO, per-brand analytics via next/third-parties, image optimisation and bundle analysis for a content-heavy multilingual surface.",
    ],
    caseStudy: {
      challenge:
        "Serve three differently branded companies from one maintainable codebase while combining marketing content with authenticated subscription, ordering and payment self-service.",
      decisions: [
        "Resolved brand identity at build time — theme, analytics, push and social integrations — so shared components stay unaware of which site they render.",
        "Kept editable marketing content in the headless CMS over GraphQL, and modelled authentication, persisted commerce state, checkout and payment as typed application logic rather than CMS-driven pages.",
      ],
      quality: [
        "Tracked each order through four named payment stages — awaiting payment, awaiting contract, pending, paid — with a transactional email matched to every transition, so a client's inbox always reflects where their order stands.",
        "Kept a large, multilingual content surface fast and discoverable with default-locale-clean routing, structured metadata, image optimisation plus bundle analysis.",
      ],
      outcome:
        "One codebase now runs three branded businesses, and a visitor can go from a marketing page to a signed-in subscription, order or invoice without ever leaving the product.",
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
      "React Hook Form",
      "Yup",
      "Redux Toolkit",
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
      "The platform is an npm-workspaces monorepo spanning five applications and six shared packages. A Node.js/Strapi 5 API and PostgreSQL data model sit behind role-specific Next.js surfaces, while domain types, authentication, forms, internationalisation, themes and back-office patterns evolve through versioned shared packages.",
    ],
    contribution: [
      "Delivered a five-application marketplace — Next.js storefront, admin, seller and support surfaces plus a Node.js/Strapi 5 API — backed by custom content types, controllers, services and PostgreSQL migrations.",
      "Built shared packages for domain types, authentication, forms, localisation, themes and reusable back-office components.",
      "Standardised complex forms with React Hook Form and Yup, and isolated persistent cart state in Zustand instead of pushing all server data into a global client store.",
      "Implemented a generic product-variant model and stock service, then built Stripe checkout around idempotency keys, deduplicated webhooks, at-least-once workers and replay-safe stock restoration.",
      "Modelled seller wallets as an append-only ledger, with payout, immutable statement, reconciliation and dispute workflows guarded against duplicate financial side effects.",
      "Added OTP/2FA authentication; protected public support endpoints with Cloudflare Turnstile, honeypots, server-side validation plus Upstash Redis-backed rate limiting and deduplication.",
      "Built editable email templates and auditable notification-delivery records on top of Nodemailer, plus seller tooling with Tiptap rich text and client-side image editing/background removal.",
      "Automated Vitest and Playwright coverage and deployed the five production services to a self-managed VPS behind NGINX, with PM2 managing each application process.",
    ],
    caseStudy: {
      challenge:
        "Build a multi-seller marketplace as one coherent product while keeping storefront, seller, support and administration concerns independently maintainable.",
      decisions: [
        "Separated five applications around user roles while centralising authentication, domain contracts, validated form patterns, localisation and UI foundations in six packages.",
        "Treated payment and fulfilment as events with idempotent consumers, and seller balances as derived views over an append-only ledger rather than mutable totals.",
        "Used Cloudflare only at the public bot boundary; application-level rate limits, dedupe keys and transition guards still protect the underlying write operations.",
      ],
      quality: [
        "Covered domain services, ledger invariants, webhook replay and outage scenarios with Vitest, then used Playwright for high-value customer, seller and admin journeys.",
        "Added structured operational events/worker metrics, automatic stock restoration, shared abuse controls plus contextual failure states for support and finance teams.",
      ],
      outcome:
        "Customer, seller and admin surfaces can each keep evolving without duplicating the underlying business rules or putting checkout and inventory integrity at risk.",
    },
    sourceAccess: {
      visibility: "private",
      note: "The product repository is private. A guided walkthrough or focused, sanitised code sample can be shared for a relevant technical review.",
    },
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Node.js",
      "Strapi 5",
      "PostgreSQL",
      "Material UI",
      "React Hook Form / Yup",
      "Zustand",
      "Stripe",
      "Nodemailer",
      "Cloudflare Turnstile",
      "Upstash Redis",
      "Tiptap",
      "Vitest",
      "Playwright",
      "npm Workspaces",
      "PM2 / NGINX",
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
      "An international-removals platform with instant quotes and multi-step booking across road, sea and air.",
    about: [
      "Deliver1 turns a complex international-moving service into a clear digital journey. Visitors can understand available transport options, request an estimate and progress through structured relocation workflows.",
      "The product combines a Next.js App Router front-end, Node.js/Strapi API and a separate support portal. The ongoing rebuild replaces inherited, loosely structured screens with typed form, data-fetching and integration boundaries while preserving a live conversion journey.",
    ],
    contribution: [
      "Rebuilt the customer-facing architecture around reusable TypeScript and Material UI primitives, SWR/axios-hooks data boundaries and route-level metadata for CMS-driven pages.",
      "Developed instant-quote, inventory and multi-step booking experiences with React Hook Form. Step-specific Yup schemas validate location, date, phone, inventory and contact data.",
      "Kept sensitive integrations behind Next.js server routes: Stripe Payment Intents for deposits, Firebase OTP phone verification and Nodemailer SMTP delivery for transactional messages.",
      "Built a separate issue portal with secure tracking tokens, attachments, assignment and threaded status updates; Next.js proxy routes verify Cloudflare Turnstile and file allow-lists before forwarding accepted writes to Strapi.",
      "Added layered abuse controls to public support flows — honeypots, dwell-time checks, rate limits, request deduplication, timeouts and structured security events, with Upstash Redis used when shared production state is configured.",
      "Improved media performance with touch-friendly galleries, progressive loading and adjacent-image preloading.",
      "Maintained automated VPS releases for the Next.js and Strapi services, using PM2 for process management and NGINX as the production reverse proxy.",
    ],
    caseStudy: {
      challenge:
        "Simplify a high-friction international moving journey while incrementally improving a live, conversion-focused product with existing content and service integrations.",
      decisions: [
        "Split quotation and booking into independently validated steps, using a schema per step so users can progress without exposing irrelevant validation errors from later stages.",
        "Used Strapi for editable service content, while isolating payment, phone verification and issue submission behind server-owned API routes instead of exposing provider credentials or unrestricted CMS writes to the browser.",
        "Applied Cloudflare Turnstile only as the bot challenge layer and retained server-side rate limits, fingerprints and validation as the authoritative controls.",
      ],
      quality: [
        "Designed retry, cooldown, timeout and actionable error states around verification, email, upload and payment operations without discarding successful upstream work.",
        "Reduced media cost with progressive loading, responsive images, adjacent-image preloading and touch-friendly navigation rather than loading full galleries eagerly.",
      ],
      outcome:
        "The path from a first estimate to a booked, structured move is shorter and clearer for customers; the front-end is easier to extend across new service and support journeys.",
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
      "Yup",
      "SWR",
      "Node.js",
      "Stripe",
      "PostgreSQL",
      "Firebase",
      "Nodemailer",
      "Cloudflare Turnstile",
      "Upstash Redis",
      "GitHub Actions",
      "PM2 / NGINX",
    ],
    accent: "blue",
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
      "A healthcare platform for an orthopaedic clinic — services and a technical-aid catalogue with generated PDFs.",
    about: [
      "Ortopedijos Paslaugų Klinika makes specialist orthopaedic services and technical products easier to understand and navigate. The website combines clinic information, consultations, rehabilitation services and a structured catalogue of orthopaedic aids.",
      "A Node.js/Strapi API lets the clinic team maintain detailed services, diagnoses, categories and product data in PostgreSQL. The Next.js front-end turns the same structured source into responsive web pages and printable clinical product material.",
    ],
    contribution: [
      "Built responsive service, category, product and clinic-information templates with static generation and incremental revalidation for stable content, while retaining server rendering where filtered results must stay request-specific.",
      "Modelled and integrated structured Strapi content for services, product categories, diagnoses, reviews and pricing.",
      "Generated branded catalogues on demand through a Next.js API route with React PDF streaming, including custom fonts, diagnosis/reimbursement tables plus multi-page pagination.",
      "Built React Hook Form/Yup enquiry flows with SendGrid delivery; covered form/PDF behaviour with Vitest and React Testing Library.",
      "Deployed and maintained the Next.js/Strapi applications on a self-managed VPS. NGINX routes traffic, while PM2 keeps the Node.js processes available.",
    ],
    caseStudy: {
      challenge:
        "Make a large healthcare service and technical-aid catalogue understandable to patients while preserving detailed diagnosis and reimbursement information.",
      decisions: [
        "Modelled services, products, categories, diagnoses and pricing once in Strapi, so the same catalogue data drives both the website and the printed document — nothing is entered or maintained twice.",
        "Generated the printable catalogue from that same data model with React PDF, and streamed it from a server route so large documents do not need to be assembled in the browser.",
      ],
      quality: [
        "Tested enquiry and PDF-oriented components while combining incremental static regeneration with request-time rendering according to how frequently each content surface changes.",
        "Handled custom fonts, long tables and multi-page pagination by hand so the generated catalogue is still legible once it's printed or opened outside the browser.",
      ],
      outcome:
        "Clinic staff maintain one structured catalogue, and patients get the same product information whether they're browsing the site or holding a printed, branded document.",
    },
    sourceAccess: {
      visibility: "private",
      note: "Client source code is private. I can demonstrate the public product and explain the React PDF and Strapi architecture in a technical walkthrough.",
    },
    stack: [
      "Next.js 13",
      "React 18",
      "TypeScript",
      "Node.js",
      "Strapi",
      "Material UI",
      "Emotion",
      "PostgreSQL",
      "React PDF",
      "React Hook Form / Yup",
      "SendGrid",
      "Vitest",
      "React Testing Library",
      "GitHub Actions",
      "PM2 / NGINX",
    ],
    accent: "rose",
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
      "A Node.js/Strapi API gives the broker direct control over listings, articles and search metadata, while server-rendered Next.js pages keep changing inventory discoverable and contextual valuation forms turn that traffic into qualified leads.",
    ],
    contribution: [
      "Developed the responsive Next.js interface with reusable property, editorial and profile sections, using request-time rendering for live listings and articles.",
      "Modelled and integrated Strapi-managed listings, articles, FAQs, testimonials, galleries and SEO metadata.",
      "Built reusable React Hook Form primitives plus conditional Yup schemas for contact/property-price enquiries, including category-dependent fields and branded Nodemailer delivery through Strapi.",
      "Implemented multilingual content, property sorting and filtering, motion details and technical SEO.",
      "Automated VPS deployment for both the Next.js front-end and Strapi API, using NGINX as the reverse proxy and PM2 for Node.js process management.",
    ],
    caseStudy: {
      challenge:
        "Balance a distinctive personal brand with fast property discovery, editable content and reliable lead capture for buyers and sellers.",
      decisions: [
        "Put property listings, articles, testimonials and SEO metadata in Strapi so the broker updates the site directly, without waiting on a front-end release.",
        "Used server rendering for inventory that needs to reflect current CMS state, while keeping valuation and contact journeys contextual to the listing or content that triggered them.",
        "Encoded property-type dependencies in Yup schemas and useWatch-driven form behaviour instead of scattering conditional validation across individual inputs.",
      ],
      quality: [
        "Added next-i18next routing, CMS-controlled metadata, predictable property sorting and careful Framer Motion details that do not obscure primary actions.",
        "Automated front-end/API deployment through GitHub Actions; kept form or email failures visible and recoverable for prospective clients.",
      ],
      outcome:
        "The platform earns organic discovery on its own merits and converts a share of it into qualified enquiries, while staying maintainable for a small content-and-development workflow.",
    },
    sourceAccess: {
      visibility: "private",
      note: "Client source code is private. Product decisions and implementation patterns can be discussed without exposing proprietary content or credentials.",
    },
    stack: [
      "Next.js 14",
      "React 18",
      "TypeScript",
      "Node.js",
      "Strapi",
      "Material UI",
      "Emotion",
      "PostgreSQL",
      "React Hook Form",
      "Yup",
      "Nodemailer",
      "Framer Motion",
      "next-i18next",
      "GitHub Actions",
      "PM2 / NGINX",
    ],
    accent: "sand",
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
