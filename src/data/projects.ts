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
  cardOutcome: string;
  about: string[];
  contribution: Array<{ label: string; detail: string }>;
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
    cardOutcome:
      "New resources reuse established forms, tables and actions while specialised workflows extend the same foundation.",
    about: [
      "Lobasoft is a large enterprise software ecosystem composed of 35 React applications and 12 shared packages. Its products support data-heavy operational workflows across finance, accounting, payroll, HR, audit, document management and employee self-service.",
      "The front-end is organised as a Turborepo monorepo with reusable UI, form, data, document and domain packages. A config-driven architecture turns resource definitions into consistent forms, lists, filters, actions and detail views while still supporting specialised product workflows.",
    ],
    contribution: [
      { label: "Scope", detail: "As the sole front-end engineer, I own delivery from established OData/REST contracts to production workflows across accounting, payroll, HR and audit." },
      { label: "Platform foundation", detail: "Built and maintain 12 shared packages and a config-driven resource layer that produces consistent forms, tables, filters, actions and detail views across 35 applications." },
      { label: "Financial workflows", detail: "Delivered purchase and sales orders, invoice submission and approval, and on-demand financial documents alongside the shared platform work." },
      { label: "Document signing", detail: "Implemented employee document submission and qualified/non-qualified e-signing for employees and managers, with transactional React Email notifications aligned to workflow state." },
      { label: "Time and reporting", detail: "Developed time-tracking and timesheet interfaces plus React PDF documents for invoices, orders and HR processes, with targeted Playwright coverage across business-critical paths." },
    ],
    caseStudy: {
      challenge:
        "Modernise data-heavy workflows across dozens of applications as the sole front-end engineer, without fragmenting interaction patterns or breaking established OData and REST contracts.",
      decisions: [
        "I moved recurring resource behaviour into shared packages, leaving applications to describe their domain rather than reimplement forms and tables.",
        "Added composition points for document, signing and financial workflows instead of forcing them into one generic screen model.",
      ],
      quality: [
        "Used strict typing, package boundaries and targeted Turborepo builds to expose the impact of shared-package changes before release.",
        "Covered high-value workflows with Playwright and made loading, validation and backend failures explicit in business-critical interfaces.",
      ],
      outcome:
        "A new resource can adopt established forms, tables and actions through configuration, while specialised financial and document workflows extend the same foundation.",
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
      "An open-source hub of 49 privacy-conscious browser tools for image, text, developer, design, PDF and accessibility work.",
    cardOutcome:
      "New tools follow one documented path, and users can inspect the privacy model and implementation in public source.",
    about: [
      "I built Toolkit because small everyday tasks should not require uploads or ad-heavy services. It brings focused utilities into one searchable, keyboard-driven interface with no account or paywall.",
      "The documented exception is the accessibility checker, which sends a public URL to an isolated, localhost-only Playwright and axe-core runner. The product is organised as a Turborepo monorepo, and a typed registry drives discovery, navigation, the command palette, sitemap and per-tool metadata from one source of truth.",
    ],
    contribution: [
      { label: "Architecture", detail: "Designed a Turborepo workspace that separates the Next.js shell, design system, framework-independent tool logic and registry." },
      { label: "Tool catalogue", detail: "Implemented tools with Canvas, Web Crypto, fflate, markdown-it and QR generation, including a unified image editor for compression, resizing, cropping and rotation." },
      { label: "Testable logic", detail: "Kept tool algorithms outside React where practical, making conversion, parsing and file-processing behaviour directly testable." },
      { label: "Discovery system", detail: "Built one registry for the catalogue, command palette, navigation, sitemap and metadata, plus an Emotion design system shared across the interfaces." },
      { label: "Privacy boundary", detail: "Isolated the accessibility checker in a token-authenticated, localhost-only Playwright/axe-core service while keeping ordinary file processing on-device." },
      { label: "AI-assisted delivery", detail: "I use the repository as a public example of issue-driven engineering with Codex and Claude, backed by ADRs, review and CI gates." },
    ],
    caseStudy: {
      challenge:
        "Grow dozens of small tools without accumulating inconsistent interfaces, duplicated logic or unnecessary upload risk, while still supporting accessibility audits that require a controlled browser.",
      decisions: [
        "I separated pure tool logic from its Next.js presentation and made the registry the source of truth for discovery and metadata.",
        "Chose workspace packages over runtime micro-frontends because individual tools do not need independent deployment.",
        "Made local processing the default and isolated accessibility audits behind a narrow authenticated service.",
      ],
      quality: [
        "Covered tool logic, safety boundaries and browser behaviour with extensive Vitest and Playwright suites.",
        "Kept the main branch deployable behind formatting, lint, type, test and production-build gates.",
      ],
      outcome:
        "The result is a live, open-source product where new tools follow one documented delivery path and users can verify both the privacy model and implementation in public source code.",
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
    cardOutcome:
      "One front-end architecture carries customers across three brands from discovery through account, order, documents and payment.",
    about: [
      "Tezaurus is the web platform of UAB „Tezaurus auditas“, a Lithuanian audit, accounting and payroll group with more than three decades of practice. Beyond presenting services and generating leads, the platform lets clients register, subscribe to services, place orders and settle payments in authenticated self-service flows.",
      "The codebase is white-label by design: a single Next.js application powers tezaurus.lt and two sibling brands, with theming, analytics, push notifications and social integrations resolved per brand at build time. An in-house headless CMS owns editable content and exposes it through a typed Apollo GraphQL layer, while commerce and account state remain application concerns.",
    ],
    contribution: [
      { label: "Multi-brand front end", detail: "I lead the Lithuanian/English Next.js front end across three brands, integrating CMS-managed content through Apollo GraphQL." },
      { label: "White-label system", detail: "Designed the boundary so one component tree resolves brand-specific themes, analytics and integrations from configuration." },
      { label: "Identity and forms", detail: "Delivered registration, account recovery and Dokobit e-identity sign-in, plus validated account, lead and checkout journeys." },
      { label: "Commerce and documents", detail: "Implemented subscriptions and orders with coupons, Braintree and invoice settlement, with React PDF documents and React Email messages matched to order state." },
      { label: "Discovery and performance", detail: "Handled locale-aware metadata, per-brand analytics, image optimisation and bundle analysis for the multilingual content surface." },
    ],
    caseStudy: {
      challenge:
        "Serve three distinct brands from one maintainable application while joining multilingual marketing content, authentication, subscriptions, documents and payments into a continuous self-service journey.",
      decisions: [
        "I resolved brand identity at build time so shared components do not branch on the company they render.",
        "Kept editorial content in the CMS while authentication, commerce state and payments remained application concerns.",
        "Modelled checkout as explicit stages so card and invoice settlement could share one customer journey despite completing differently.",
      ],
      quality: [
        "Matched payment stages with documents and transactional email so the interface and customer communication describe the same state.",
        "Kept the multilingual surface discoverable and performant through clean routing, structured metadata and image optimisation.",
      ],
      outcome:
        "One front-end architecture supports three branded businesses, and customers can move from service discovery to identity, subscription, order, document and payment flows without leaving the product.",
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
    name: "Musės — Fly Tying Market",
    domain: "muses.lt",
    url: "https://muses.lt",
    year: "2025",
    period: "October 2025 – Present",
    engagement: "Independent product",
    location: "Remote",
    role: "Full-stack Engineer",
    summary:
      "A specialist fly-tying marketplace connecting a customer storefront with seller, support and administration workflows.",
    cardOutcome:
      "Five role-specific applications share payment, stock and seller-accounting rules without duplicating transactional logic.",
    about: [
      "Fly fishing is one of my own interests, so I built Musės around the specific needs of fly tiers and specialist buyers. Customer shopping, seller operations, support and internal administration are delivered through dedicated applications with a shared technical foundation.",
      "The platform is an npm-workspaces monorepo spanning five applications and six shared packages. A Node.js/Strapi 5 API and PostgreSQL data model sit behind role-specific Next.js surfaces, while domain types, authentication, forms, internationalisation, themes and back-office patterns evolve through versioned shared packages.",
    ],
    contribution: [
      { label: "Marketplace foundation", detail: "Architected five applications—a storefront, seller, support and administration workspaces plus a Strapi 5 API—and six packages for shared domain and UI concerns." },
      { label: "Payment and stock", detail: "Designed Stripe and inventory services around idempotency, deduplicated webhooks and replay-safe restoration to prevent retries from producing duplicate charges or inconsistent stock." },
      { label: "Seller accounting", detail: "Modelled seller wallets as an append-only ledger and built payout, statement, reconciliation and dispute workflows." },
      { label: "Access and abuse controls", detail: "Added OTP/2FA and layered support-form protection with Turnstile, upload controls and Redis-backed throttling and deduplication." },
      { label: "Quality and operations", detail: "Covered core domain and cross-role journeys with Vitest and Playwright, then deployed all five services behind NGINX and PM2." },
    ],
    caseStudy: {
      challenge:
        "Build a multi-seller marketplace whose role-specific applications can evolve independently without weakening the transactional integrity of payments, stock and seller balances.",
      decisions: [
        "I separated applications by user role while centralising authentication, domain contracts, forms, localisation and visual foundations.",
        "Treated payment and fulfilment as replayable events and derived seller balances from a ledger instead of mutable totals.",
        "Kept rate limits, deduplication and valid-state transitions inside the applications rather than relying only on edge bot detection.",
      ],
      quality: [
        "Covered ledger invariants, webhook replay and outage scenarios with Vitest, then exercised high-value cross-role journeys in Playwright.",
        "Added worker metrics, automatic stock restoration and contextual failures for support and finance users.",
      ],
      outcome:
        "Storefront, seller, support and administration users get workflows shaped to their roles, while shared contracts and backend invariants keep checkout, inventory and seller accounting consistent across the product.",
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
    role: "Full-stack Developer",
    summary:
      "An international-removals platform with instant quotes and multi-step booking across road, sea and air.",
    cardOutcome:
      "Customers move from quotation and booking into tracked support, while staff manage ownership and resolution in one workspace.",
    about: [
      "Deliver1 turns a complex international-moving service into a clear digital journey. Visitors can understand available transport options, request an estimate and progress through structured relocation workflows.",
      "The product is a three-part system: a customer-facing Next.js experience, a Node.js/Strapi API for content and operational data, and a dedicated support portal for customers and staff. I develop across all three, modernising a live conversion journey while building the backend workflows and support tooling around it.",
    ],
    contribution: [
      { label: "Customer journey", detail: "Rebuilt the customer-facing Next.js architecture and developed instant-quote, inventory and multi-step booking journeys with step-specific validation." },
      { label: "Operational backend", detail: "Extended Strapi with issue and update models, public and internal endpoints, tracking tokens, organised uploads and transactional email." },
      { label: "Payments and verification", detail: "Integrated Stripe deposits and Firebase phone verification behind server-owned routes with explicit retry and failure states." },
      { label: "Support portal", detail: "Built customer reporting, tracking, evidence uploads and threaded conversations alongside staff assignment, status, notes and reply workflows." },
      { label: "Abuse controls", detail: "Protected public writes with Turnstile, upload allow-lists, rate limits, deduplication and timeouts, and connected support actions to backend notifications." },
    ],
    caseStudy: {
      challenge:
        "Improve a live, conversion-focused moving journey while adding the operational backbone needed to carry customer issues from public submission through staff ownership, conversation and resolution.",
      decisions: [
        "I separated the customer journey, API and support workspace while keeping business data and notification orchestration in the backend.",
        "Split quotation and booking into independently validated steps, using a schema per step so users can progress without exposing irrelevant validation errors from later stages.",
        "Modelled support as issues and threaded updates, separating public replies from internal notes and using tracking links instead of customer accounts.",
      ],
      quality: [
        "Kept payment, verification, upload and email failures actionable without discarding successfully saved work.",
        "Added shared rate-limit state, security events and repeatable deployment for all three services.",
      ],
      outcome:
        "Customers now move through quotation, booking and post-booking support in one coherent service, while staff get an auditable workspace for ownership and resolution. The system can evolve each surface independently without duplicating operational rules.",
    },
    sourceAccess: {
      visibility: "private",
      note: "Client source code is private. I can discuss the architecture and demonstrate public workflows; repository access requires the client's permission.",
    },
    stack: [
      "Next.js 15 / 16",
      "React 18 / 19",
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
    role: "Full-stack Developer",
    summary:
      "A healthcare platform for an orthopaedic clinic — services and an orthopaedic aid catalogue with generated PDFs.",
    cardOutcome:
      "One managed catalogue supplies patient-facing pages and printable clinical material without duplicate product maintenance.",
    about: [
      "Ortopedijos Paslaugų Klinika makes specialist orthopaedic services and technical products easier to understand and navigate. The website combines clinic information, consultations, rehabilitation services and a structured catalogue of orthopaedic aids.",
      "I develop both sides of the platform: the public Next.js website and its Node.js/Strapi backend. Clinic staff maintain services, diagnoses, categories, pricing and products in PostgreSQL-backed content models, and the front end turns that source into responsive pages, enquiry journeys and printable clinical product material.",
    ],
    contribution: [
      { label: "Content model", detail: "Modelled services, products, diagnoses, reimbursement notes, reviews and pricing in Strapi and integrated them into responsive clinic and catalogue pages." },
      { label: "Rendering strategy", detail: "Chose static generation, revalidation or request-time rendering according to each page's data needs." },
      { label: "PDF catalogue", detail: "Generated branded catalogues from live CMS data with React PDF, including embedded fonts, reimbursement tables, images and multi-page pagination." },
      { label: "Enquiries and delivery", detail: "Built validated enquiry forms and backend email delivery, covered the flow with focused tests and automated deployment of both applications." },
    ],
    caseStudy: {
      challenge:
        "Make a detailed healthcare service and orthopaedic aid catalogue understandable to patients, editable by clinic staff and reliable in both web and print formats.",
      decisions: [
        "I used one Strapi model for the website and printable catalogue so clinic staff do not maintain the same product information twice.",
        "Streamed the generated PDF from a server route rather than assembling large documents in the browser.",
        "Persisted enquiries before sending clinic notifications, retaining a record if email delivery fails.",
      ],
      quality: [
        "Tested the enquiry flow and matched rendering strategy to how often each content surface changes.",
        "Handled fonts, long medical tables, images and page breaks so generated catalogues remain legible in print.",
      ],
      outcome:
        "Clinic staff maintain one structured source for services and products; patients receive consistent information across the website, generated catalogue and enquiry process without parallel manual document upkeep.",
    },
    sourceAccess: {
      visibility: "private",
      note: "Client source code is private. I can demonstrate the public product and explain the React PDF and Strapi architecture in a technical walkthrough.",
    },
    stack: [
      "Next.js 15",
      "React 18",
      "TypeScript",
      "Node.js",
      "Strapi",
      "Material UI",
      "Emotion",
      "PostgreSQL",
      "React PDF",
      "React Hook Form / Yup",
      "Nodemailer",
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
    role: "Full-stack Developer",
    summary:
      "A real estate website combining broker positioning, property discovery and structured enquiries.",
    cardOutcome:
      "The broker manages listings and articles directly, while buyers and sellers get clear discovery and enquiry paths.",
    about: [
      "Noreikis is a digital presence for a Lithuanian real estate broker, bringing personal positioning, active listings, sold properties, market content and client recommendations into one coherent experience.",
      "I develop both sides of the platform: a server-rendered Next.js website and its Node.js/Strapi backend. The broker controls listings, articles, testimonials and search metadata directly, while contextual contact and valuation journeys turn that content into structured leads.",
    ],
    contribution: [
      { label: "Content model", detail: "Modelled properties, categories, articles, recommendations, galleries and SEO metadata in Strapi." },
      { label: "Property discovery", detail: "Built server-rendered listing and editorial pages with property sorting, filtering and multilingual routing." },
      { label: "Adaptive enquiries", detail: "Created conditional contact and valuation forms whose fields adapt to the selected property type." },
      { label: "Backend delivery", detail: "Persisted enquiries through custom backend controllers, sent branded notifications and automated deployment of both applications." },
    ],
    caseStudy: {
      challenge:
        "Balance a distinctive personal brand with current property inventory, broker-managed editorial content and lead capture detailed enough to support real valuation follow-up.",
      decisions: [
        "I put listings, articles and metadata in Strapi so the broker can update the site without a front-end release.",
        "Used server rendering for current inventory and generated the sitemap from the same content source.",
        "Centralised property-type dependencies in form schemas and persisted enquiries before sending notifications.",
      ],
      quality: [
        "Kept Lithuanian and English navigation, content and metadata aligned through locale-aware routing and CMS queries.",
        "Used motion as optional visual polish and automated front-end/API deployment through GitHub Actions.",
      ],
      outcome:
        "The broker can keep inventory and articles current, while buyers and sellers get clear property discovery and enquiry paths.",
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
