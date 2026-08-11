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
      "As the platform's sole front-end engineer, own delivery from established OData/REST contracts to production workflows across accounting, payroll, HR, audit and financial applications.",
      "Built and maintain 12 shared packages for forms, tables, resource lists, documents, domain types and theming, giving roughly 35 applications one typed implementation of recurring enterprise UI behaviour.",
      "Created the config-driven resource layer that turns domain definitions into React Hook Form screens, filters, data tables, actions and detail views while retaining extension points for specialised workflows.",
      "Delivered purchase and sales orders, invoice submission and approval, and on-demand financial document rendering rather than limiting the work to generic platform components.",
      "Implemented employee document submission and qualified/non-qualified e-signing for employees and managers, with transactional React Email notifications aligned to workflow state.",
      "Developed time-tracking and timesheet interfaces plus React PDF documents for invoices, orders and HR processes, with targeted Playwright coverage across business-critical paths.",
    ],
    caseStudy: {
      challenge:
        "Modernise data-heavy workflows across dozens of applications as the sole front-end engineer, without fragmenting interaction patterns or breaking established OData and REST contracts.",
      decisions: [
        "Moved form, list, filter and action orchestration into shared TypeScript packages, leaving applications to describe domain resources instead of reimplementing the same mechanics.",
        "Kept backend contracts behind typed data boundaries so shared UI behaviour can evolve without every application learning transport-specific details.",
        "Provided explicit composition points for document, signing and financial workflows instead of forcing domain-specific behaviour into an over-generalised screen model.",
      ],
      quality: [
        "Use strict typing, package boundaries and targeted Turborepo builds to expose the cross-application impact of shared-package changes before release.",
        "Cover high-value workflows with Playwright and make loading, validation and backend failures explicit in interfaces where silent failure would interrupt business operations.",
      ],
      outcome:
        "New applications and resources start from established, tested interaction patterns rather than rebuilding enterprise forms and tables, while specialised workflows remain free to express their own domain rules.",
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
      "Designed a Turborepo/npm-workspaces architecture that separates the Next.js product shell, typed design system, framework-independent tool logic, registry and shared compiler configuration.",
      "Implemented 49 tools with Canvas, Web Crypto, fflate, markdown-it and QR generation, including a unified image editor for compression, resizing, cropping and rotation.",
      "Kept tool algorithms outside React where practical, making conversion, parsing, validation and file-processing behaviour directly testable and reusable.",
      "Built a typed registry as the source of truth for the catalogue, command palette, navigation, sitemap and per-tool metadata, so adding a tool updates every discovery surface through one contract.",
      "Created an Emotion design system with typed tokens, accessible interaction states and light/dark theming shared across the catalogue and 49 focused interfaces.",
      "Isolated the accessibility checker in a token-authenticated, localhost-only Playwright/axe-core service while keeping ordinary file processing on-device.",
      "Established issue-driven delivery, ADRs and GitHub Actions gates for formatting, lint, strict types, unit tests, build and Playwright, followed by automated PM2/NGINX deployment.",
    ],
    caseStudy: {
      challenge:
        "Grow dozens of small tools without accumulating inconsistent interfaces, duplicated logic or unnecessary upload risk, while still supporting accessibility audits that require a controlled browser.",
      decisions: [
        "Made the typed tool registry the single source of truth for discovery and metadata, and separated pure tool logic from its Next.js presentation.",
        "Chose compiler-enforced workspace packages over runtime micro-frontends because the product needs clear ownership boundaries, not independent deployment of individual utilities.",
        "Made local processing the default and isolated the only server-assisted capability behind a narrow, authenticated runner with no general-purpose file storage.",
      ],
      quality: [
        "Cover pure logic and runner boundaries with 266 unit and safety tests, plus 95 Playwright tests exercising the tools in real Chromium.",
        "Keep the main branch deployable behind a CI pipeline that must pass formatting, lint, strict types, unit tests, production build and browser tests before release.",
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
    about: [
      "Tezaurus is the web platform of UAB „Tezaurus auditas“, a Lithuanian audit, accounting and payroll group with more than three decades of practice. Beyond presenting services and generating leads, the platform lets clients register, subscribe to services, place orders and settle payments in authenticated self-service flows.",
      "The codebase is white-label by design: a single Next.js application powers tezaurus.lt and two sibling brands, with theming, analytics, push notifications and social integrations resolved per brand at build time. An in-house headless CMS owns editable content and exposes it through a typed Apollo GraphQL layer, while commerce and account state remain application concerns.",
    ],
    contribution: [
      "Lead the Lithuanian/English Next.js App Router front end across three brands, integrating CMS-managed services, pricing, teams, careers and articles through typed Apollo GraphQL queries.",
      "Designed the white-label boundary so one component tree resolves brand-specific themes, analytics, push and social integrations from configuration rather than conditional UI forks.",
      "Delivered registration, email confirmation, password recovery and Dokobit e-identity sign-in on top of next-auth, with account state carried consistently into self-service flows.",
      "Built reusable React Hook Form/Yup patterns for account, lead and checkout journeys, using Redux Toolkit only for commerce state that must persist across routes.",
      "Implemented subscription and order checkout with coupons, Braintree payment methods and invoice fallback, plus React PDF generation for proformas, invoices and contract terms.",
      "Created transactional React Email templates for orders, subscriptions, expirations, contracts and terminations, mapping communication to explicit order-state transitions.",
      "Implemented locale-aware metadata, per-brand analytics, image optimisation and bundle analysis for a multilingual, content-heavy surface.",
    ],
    caseStudy: {
      challenge:
        "Serve three distinct brands from one maintainable application while joining multilingual marketing content, authentication, subscriptions, documents and payments into a continuous self-service journey.",
      decisions: [
        "Resolved brand identity at build time so shared components consume a stable theme and integration contract without branching on the company they render.",
        "Kept editorial ownership in the headless CMS, while authentication, persisted commerce state and payment orchestration remain typed application concerns.",
        "Modelled checkout as explicit order and payment stages, allowing Braintree and invoice settlement to share one customer journey without pretending they complete synchronously.",
      ],
      quality: [
        "Match the four named payment stages—awaiting payment, awaiting contract, pending and paid—with documents and transactional email so the interface and customer communication describe the same state.",
        "Keep the multilingual surface discoverable and performant through clean default-locale routing, structured metadata, image optimisation and bundle analysis.",
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
    name: "Musės - Fly Tying Market",
    domain: "muses.lt",
    url: "https://muses.lt",
    year: "2025",
    period: "October 2025 – Present",
    engagement: "Independent product",
    location: "Remote",
    role: "Full-stack Engineer",
    summary:
      "A specialist fly-tying marketplace connecting a customer storefront with seller, support and administration workflows.",
    about: [
      "Musės - Fly Tying Market is a specialist marketplace for handcrafted fly-fishing flies, designed as a single product ecosystem rather than an isolated storefront. Customer shopping, seller operations, support and internal administration are delivered through dedicated applications with a shared technical foundation.",
      "The platform is an npm-workspaces monorepo spanning five applications and six shared packages. A Node.js/Strapi 5 API and PostgreSQL data model sit behind role-specific Next.js surfaces, while domain types, authentication, forms, internationalisation, themes and back-office patterns evolve through versioned shared packages.",
    ],
    contribution: [
      "Architected and delivered five applications—a Next.js storefront, seller, support and administration workspaces plus a Strapi 5 API—on a shared PostgreSQL domain model.",
      "Built six packages for domain contracts, authentication, validated forms, localisation, brand theming and back-office UI so role-specific applications reuse behaviour without sharing page-level concerns.",
      "Implemented catalogue, product variants, cart, account and checkout flows, keeping persistent cart state in Zustand while server-owned data remains behind typed API boundaries.",
      "Designed stock and Stripe payment services around idempotency keys, deduplicated webhooks, at-least-once workers and replay-safe restoration so retries cannot silently double-charge or corrupt inventory.",
      "Modelled seller wallets as an append-only ledger and built payout, immutable statement, reconciliation and dispute workflows with guards against duplicate financial side effects.",
      "Added OTP/2FA authentication and layered public-support protection with Turnstile, honeypots, server validation, upload controls and Redis-backed throttling and deduplication.",
      "Created editable email templates and auditable delivery records, plus seller content tooling with Tiptap and client-side image editing and background removal.",
      "Automated domain-level Vitest and cross-role Playwright coverage, then deployed and operate all five services on a self-managed VPS behind NGINX and PM2.",
    ],
    caseStudy: {
      challenge:
        "Build a multi-seller marketplace whose role-specific applications can evolve independently without weakening the transactional integrity of payments, stock and seller balances.",
      decisions: [
        "Separated applications by user role while centralising authentication, domain contracts, form behaviour, localisation and visual foundations in focused packages.",
        "Treated payment and fulfilment as replayable events with idempotent consumers, and derived seller balances from an append-only ledger instead of mutable totals.",
        "Used edge bot detection as one public boundary while keeping rate limits, deduplication and valid-state transitions authoritative inside the applications.",
      ],
      quality: [
        "Cover domain services, ledger invariants, webhook replay and outage scenarios with Vitest, then exercise high-value customer, seller, support and admin journeys in Playwright.",
        "Emit structured operational events and worker metrics, restore stock automatically after failed flows, and surface contextual failures to support and finance users.",
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
    about: [
      "Deliver1 turns a complex international-moving service into a clear digital journey. Visitors can understand available transport options, request an estimate and progress through structured relocation workflows.",
      "The product is a three-part system: a customer-facing Next.js experience, a Node.js/Strapi API for content and operational data, and a dedicated support portal for customers and staff. I develop across all three, modernising a live conversion journey while building the backend workflows and support tooling around it.",
    ],
    contribution: [
      "Rebuilt the customer-facing architecture around reusable TypeScript and Material UI primitives, SWR/axios-hooks data boundaries and route-level metadata for CMS-driven pages.",
      "Developed instant-quote, inventory and multi-step booking experiences with React Hook Form. Step-specific Yup schemas validate location, date, phone, inventory and contact data.",
      "Extended the Strapi backend beyond editable service content with issue and update models, custom public and internal endpoints, non-guessable tracking tokens, organised media uploads and centralised transactional email delivery.",
      "Kept payment and verification credentials server-side, integrating Stripe Payment Intents for deposits, Firebase OTP phone verification and SMTP email with explicit success, failure and retry states.",
      "Built the support portal end to end: customers can report and track issues, upload evidence and continue threaded conversations; staff can authenticate, filter and assign cases, change status, add internal notes and reply in context.",
      "Protected public support writes with server-side Turnstile verification, honeypots, dwell-time checks, upload allow-lists, rate limits, deduplication and upstream timeouts. Security events use shared Redis state and webhook alerting when configured.",
      "Connected support actions to backend notification workflows for submission receipts, tracking links, customer updates, assignments and operations alerts, without rolling back saved work when email delivery fails.",
      "Improved media performance with touch-friendly galleries, progressive loading and adjacent-image preloading.",
      "Maintained automated VPS releases across the customer, API and support services, with PM2 process management and NGINX routing.",
    ],
    caseStudy: {
      challenge:
        "Improve a live, conversion-focused moving journey while adding the operational backbone needed to carry customer issues from public submission through staff ownership, conversation and resolution.",
      decisions: [
        "Separated the customer journey, content and operational API, and support workspace into independently deployable applications, while keeping business data and notification orchestration in the backend.",
        "Split quotation and booking into independently validated steps, using a schema per step so users can progress without exposing irrelevant validation errors from later stages.",
        "Modelled support as issues plus threaded updates, separating customer-visible replies from internal notes and using non-guessable tokens for public tracking instead of customer accounts.",
        "Put public support writes behind Next.js proxy routes and treated Turnstile as one signal within layered server-side validation, throttling and upload controls.",
      ],
      quality: [
        "Designed retry, cooldown, timeout and actionable error states around verification, email, uploads and payments; notification failures remain visible without discarding a successfully saved issue or update.",
        "Added structured security events, configurable shared rate-limit state and alert webhooks so abuse controls remain observable when the support service runs across processes.",
        "Reduced media cost with responsive images, progressive loading and adjacent-image preloading, and automated repeatable deployment for all three services.",
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
      "A healthcare platform for an orthopaedic clinic — services and a technical-aid catalogue with generated PDFs.",
    about: [
      "Ortopedijos Paslaugų Klinika makes specialist orthopaedic services and technical products easier to understand and navigate. The website combines clinic information, consultations, rehabilitation services and a structured catalogue of orthopaedic aids.",
      "I develop both sides of the platform: the public Next.js website and its Node.js/Strapi backend. Clinic staff maintain services, diagnoses, categories, pricing and products in PostgreSQL-backed content models, and the front end turns that source into responsive pages, enquiry journeys and printable clinical product material.",
    ],
    contribution: [
      "Designed the Strapi content model and API relationships for services, product categories, diagnoses, reimbursement notes, reviews, pricing and company information.",
      "Built responsive service, category, product and clinic-information templates, choosing static generation, incremental revalidation or request-time rendering according to each page's data needs.",
      "Generated branded catalogues on demand from live CMS data through a Next.js API route with React PDF streaming, including embedded fonts, diagnosis and reimbursement tables, images and multi-page pagination.",
      "Built React Hook Form/Yup enquiry flows and the backend submission workflow, persisting enquiries and delivering clinic notifications through server-owned email integrations.",
      "Covered the enquiry flow and shared data helpers with Vitest and React Testing Library, then automated deployment of both applications to a self-managed VPS behind NGINX and PM2.",
    ],
    caseStudy: {
      challenge:
        "Make a detailed healthcare service and technical-aid catalogue understandable to patients, editable by clinic staff and reliable in both web and print formats.",
      decisions: [
        "Modelled services, products, categories, diagnoses and pricing once in Strapi, so the same catalogue data drives both the website and the printed document — nothing is entered or maintained twice.",
        "Generated the printable catalogue from that same data model with React PDF, and streamed it from a server route so large documents do not need to be assembled in the browser.",
        "Kept enquiry persistence and email delivery behind the API, giving the clinic a stored record even though the public interaction begins as a lightweight website form.",
      ],
      quality: [
        "Tested the enquiry flow and shared data helpers, and matched rendering strategy to content volatility to avoid request-time work for stable pages while keeping filtered data current.",
        "Handled embedded fonts, long medical tables, images and page breaks explicitly so generated catalogues remain legible when downloaded, shared or printed.",
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
      "A real-estate platform combining broker positioning, property discovery and qualified lead generation.",
    about: [
      "Noreikis is a digital presence for a Lithuanian real-estate broker, bringing personal positioning, active listings, sold properties, market content and client recommendations into one coherent experience.",
      "I develop both sides of the platform: a server-rendered Next.js website and its Node.js/Strapi backend. The broker controls listings, articles, testimonials and search metadata directly, while contextual contact and valuation journeys turn that content into structured leads.",
    ],
    contribution: [
      "Modelled the Strapi backend for properties, statuses, categories, building attributes, articles, FAQs, recommendations, galleries and page-level SEO metadata.",
      "Developed reusable property, editorial and profile interfaces, using server rendering for live listings and articles plus predictable sorting and property-type filtering.",
      "Built reusable React Hook Form primitives and conditional Yup schemas for contact and valuation enquiries, including property-category-dependent fields and contextual source data.",
      "Implemented custom backend controllers that persist leads and send branded HTML notifications for general contact and detailed valuation requests.",
      "Delivered multilingual routing, server-generated sitemap and metadata, restrained Framer Motion details, and automated VPS deployment of both applications behind NGINX and PM2.",
    ],
    caseStudy: {
      challenge:
        "Balance a distinctive personal brand with current property inventory, broker-managed editorial content and lead capture detailed enough to support real valuation follow-up.",
      decisions: [
        "Put listings, property taxonomies, articles, recommendations and SEO metadata in Strapi so the broker can update the experience without a front-end release.",
        "Used server rendering for inventory and editorial pages that need current CMS state, and generated the sitemap from the same content source.",
        "Encoded property-type dependencies in Yup schemas and useWatch-driven form behaviour instead of scattering conditional validation across individual inputs.",
        "Persisted each enquiry before triggering branded email notifications, keeping lead capture as a backend workflow rather than a browser-only message send.",
      ],
      quality: [
        "Kept Lithuanian and English navigation, content and metadata aligned through locale-aware routing and CMS queries, with motion used as progressive visual polish rather than required interaction.",
        "Centralised complex valuation rules in schemas and reusable form controls, and automated repeatable front-end/API deployment through GitHub Actions.",
      ],
      outcome:
        "The broker can keep inventory and market content current independently, while buyers and sellers get fast property discovery and structured enquiry paths that deliver actionable lead details to the business.",
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
