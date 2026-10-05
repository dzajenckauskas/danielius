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
      { label: "Specialised workflows", detail: "Delivered purchase/sales orders and invoice approval, employee document submission with qualified and non-qualified e-signing, and time-tracking, with React PDF output for invoices, orders and HR processes and React Email notifications tied to workflow state." },
    ],
    caseStudy: {
      challenge:
        "As the sole front-end engineer, I had to modernise data-heavy workflows across 35 applications without fragmenting interaction patterns or breaking established OData and REST contracts.",
      decisions: [
        "Recurring resource behaviour moved into shared packages, so applications describe their domain instead of reimplementing forms and tables.",
        "Document, signing and financial workflows each got a screen built for their own needs, rather than being squeezed into one generic model.",
      ],
      quality: [
        "Strict typing, package boundaries and targeted Turborepo builds surface the blast radius of a shared-package change before it ships.",
        "Playwright smoke coverage runs across all 35 applications, with targeted specs for two-factor authentication, master-data flows, deep links and form field requests.",
      ],
      outcome:
        "A new resource adopts established forms, tables and actions through configuration alone. Specialised financial and document workflows extend the same shared foundation rather than reimplementing it.",
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
      { label: "Tool catalogue", detail: "Implemented the tool catalogue on Canvas, Web Crypto, fflate, markdown-it and QR generation, keeping conversion, parsing and file-processing logic outside React so it's directly testable." },
      { label: "Discovery system", detail: "Built one registry for the catalogue, command palette, navigation, sitemap and metadata, plus an Emotion design system shared across the interfaces." },
      { label: "Privacy boundary", detail: "Isolated the accessibility checker in a token-authenticated, localhost-only Playwright/axe-core service while keeping ordinary file processing on-device." },
      { label: "AI-assisted delivery", detail: "I use the repository as a public example of issue-driven engineering with Codex and Claude, backed by ADRs, review and CI gates." },
    ],
    caseStudy: {
      challenge:
        "Dozens of small tools tend to accumulate inconsistent interfaces, duplicated logic and unnecessary upload risk — and the one tool that genuinely needs a server (the accessibility checker) still has to fit that same trust model.",
      decisions: [
        "Pure tool logic sits apart from its Next.js presentation, and the registry is the single source of truth for discovery and metadata.",
        "Workspace packages won over runtime micro-frontends, since individual tools don't need independent deployment.",
        "Local processing is the default; only the accessibility audit crosses the network, and it's confined behind a narrow authenticated service.",
      ],
      quality: [
        "73 Vitest and Playwright files cover tool logic, safety boundaries and browser behaviour.",
        "Formatting, lint, type, test and production-build gates help keep main deployable.",
      ],
      outcome:
        "New tools follow one documented delivery path, and because the source is public, the privacy model isn't a claim you have to take on trust — it's readable.",
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
      { label: "Multi-brand front end", detail: "I lead the Lithuanian/English Next.js front end across three brands, resolving brand-specific themes, analytics and integrations from configuration so shared components never branch on the company they render." },
      { label: "Identity and forms", detail: "Delivered registration, account recovery and Dokobit e-identity sign-in, plus validated account, lead and checkout journeys." },
      { label: "Commerce and documents", detail: "Implemented subscriptions and orders with coupons, Braintree and invoice settlement, with React PDF documents and React Email messages matched to order state." },
    ],
    caseStudy: {
      challenge:
        "Three brands need to share one maintainable application, yet still weave multilingual marketing content, authentication, subscriptions, documents and payments into a single continuous self-service journey.",
      decisions: [
        "Brand identity resolves at build time, so shared components stay ignorant of which company they're rendering for.",
        "Editorial content lives in the CMS; authentication, commerce state and payments stay application concerns rather than bleeding into content.",
        "Checkout is modelled as explicit stages, letting card and invoice settlement share one customer journey despite completing differently.",
      ],
      quality: [
        "Payment stages line up with documents and transactional email, so the interface and the customer's inbox describe the same state.",
        "Clean routing, structured metadata and image optimisation keep the multilingual surface discoverable and fast.",
      ],
      outcome:
        "One front-end architecture carries three branded businesses. A customer can go from service discovery to identity, subscription, order, document and payment without ever leaving the product.",
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
      "The storefront is live and taking real seller applications, but it's still early: the catalogue and seller base are growing rather than at full scale, so the architecture below is proven in production, not yet under production-scale load.",
    ],
    contribution: [
      { label: "Marketplace foundation", detail: "Architected five applications—a storefront, seller, support and administration workspaces plus a Strapi 5 API—and six packages for shared domain and UI concerns." },
      { label: "Transactional integrity", detail: "Built Stripe and inventory services so a retried payment or a webhook delivered twice can never double-charge a customer or double-count stock, and modelled seller wallets as a running transaction history with payout, statement, reconciliation and dispute workflows." },
      { label: "Access, quality and operations", detail: "Added OTP/2FA and Turnstile-protected, Redis-throttled support forms; covered core domain and cross-role journeys with Vitest and Playwright; deployed all five services behind NGINX and PM2." },
    ],
    caseStudy: {
      challenge:
        "A multi-seller marketplace needs its role-specific applications to evolve independently, without ever letting that independence weaken the transactional integrity of payments, stock or seller balances.",
      decisions: [
        "Applications split by user role; authentication, domain types, forms, localisation and visual foundations stay centralised.",
        "Payment and fulfilment steps are written so re-running them causes no harm, and seller balances are calculated from the full transaction history rather than stored as a single number that gets overwritten.",
        "Rate limits, repeat-submission checks and valid-state transitions live inside the applications instead of being left to edge bot detection alone.",
      ],
      quality: [
        "Vitest checks that the transaction history stays correct through webhook replays and outages; Playwright exercises the high-value cross-role journeys.",
        "Worker metrics, automatic stock restoration and contextual failure messages are in place for support and finance users.",
      ],
      outcome:
        "The marketplace is live and onboarding its first sellers. Storefront, seller, support and administration users already get workflows shaped to their roles, and the shared contracts and the ledger's built-in checks are built to hold as the catalogue and transaction volume grow — the open question now is real usage at scale, not the architecture.",
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
      { label: "Backend, payments and verification", detail: "Extended Strapi with issue/update models, public and internal endpoints and tracking tokens, and integrated Stripe deposits and Firebase phone verification behind server-owned routes with explicit retry and failure states." },
      { label: "Support portal", detail: "Built a separate portal for customer reporting, tracking, evidence uploads and threaded conversations, plus staff assignment and reply workflows — protected throughout by Turnstile, upload allow-lists, rate limits and repeat-submission checks." },
    ],
    caseStudy: {
      challenge:
        "A live, conversion-focused moving journey needed the operational backbone to carry a customer issue all the way from public submission through staff ownership, conversation and resolution — without a rebuild that risked the conversion path itself.",
      decisions: [
        "The customer journey, API and support workspace stay separate, with business data and the logic that sends notifications living in the backend.",
        "Quotation and booking split into independently validated steps, each with its own schema, so a user never sees a validation error from a stage they haven't reached yet.",
        "Support is modelled as issues and threaded updates — public replies separated from internal notes — and tracking links stand in for customer accounts.",
      ],
      quality: [
        "Payment, verification, upload and email failures stay actionable and never discard work that already saved successfully.",
        "Shared rate-limit state, security events and a repeatable deployment pipeline cover all three services.",
      ],
      outcome:
        "Customers move through quotation, booking and post-booking support in one coherent service, and staff get an auditable workspace for ownership and resolution — each of the three surfaces can now evolve on its own timeline.",
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
      { label: "Content model", detail: "Modelled services, products, diagnoses, reimbursement-rate tables, reviews and pricing in Strapi, choosing static generation, revalidation or request-time rendering per page depending on how often its data changes." },
      { label: "PDF catalogue", detail: "Generated branded catalogues from live CMS data with React PDF, including embedded fonts, reimbursement tables, images and multi-page pagination." },
      { label: "Enquiries and delivery", detail: "Built validated enquiry forms and backend email delivery, covered the flow with focused tests and automated deployment of both applications." },
    ],
    caseStudy: {
      challenge:
        "A detailed healthcare service and orthopaedic aid catalogue has to stay understandable to patients, editable by clinic staff who aren't developers, and reliable in both web and print.",
      decisions: [
        "One Strapi model feeds the website and the printable catalogue, so clinic staff never maintain the same product information twice.",
        "The generated PDF streams from a server route instead of being assembled in the browser.",
        "Enquiries persist before the clinic notification goes out, so a failed email send never loses the submission.",
      ],
      quality: [
        "The enquiry flow is under test, and each page's rendering strategy matches how often its underlying content actually changes.",
        "Fonts, long medical tables, images and page breaks are handled explicitly so generated catalogues stay legible in print.",
      ],
      outcome:
        "Clinic staff maintain one structured source for services and products, and patients see the same information whether they're on the website, reading the generated catalogue, or following up on an enquiry.",
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
      { label: "Content model and discovery", detail: "Modelled properties, categories, articles, recommendations, galleries and SEO metadata in Strapi, and built server-rendered listing and editorial pages with sorting and filtering on top of it." },
      { label: "Adaptive enquiries", detail: "Created conditional contact and valuation forms whose fields adapt to the selected property type." },
      { label: "Backend delivery", detail: "Persisted enquiries through custom backend controllers, sent branded notifications and automated deployment of both applications." },
    ],
    caseStudy: {
      challenge:
        "A distinctive personal brand has to sit alongside current property inventory, broker-managed editorial content and lead capture detailed enough to support real valuation follow-up.",
      decisions: [
        "Listings, articles and metadata live in Strapi, so the broker updates the site without a front-end release.",
        "Server rendering covers current inventory, and the sitemap generates from that same content source.",
        "Property-type dependencies are centralised in form schemas, and enquiries persist before notifications go out.",
      ],
      quality: [
        "Routing runs on next-i18next, ready for additional locales; Lithuanian is the only one enabled in production today.",
        "Motion is used as optional visual polish, and front-end/API deployment is automated through GitHub Actions.",
      ],
      outcome:
        "The broker keeps inventory and articles current without developer involvement, and buyers and sellers get a clear path from discovery to enquiry.",
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
  {
    slug: "case1",
    name: "CASE1",
    domain: "case1.co.uk",
    url: "https://case1.co.uk",
    year: "2026",
    period: "October 2026 – Present",
    engagement: "Commercial client project",
    location: "United Kingdom · Remote",
    role: "Full-stack Developer",
    summary:
      "A website for a bespoke-crate workshop, built around a 3D crate that comes apart as you scroll.",
    cardOutcome:
      "A crate modelled in code runs smoothly from Retina desktops to old phones, and quote requests arrive ready to price.",
    about: [
      "CASE1 is a UK workshop that builds made-to-measure wooden crates, with fitted foam lining, for antiques, furniture and art. The website has two jobs: show why a crate built around one piece protects it better than a generic box, and collect enough detail in the first message to quote from.",
      "The centrepiece is a crate that takes itself apart as you scroll. The lid lifts, the panels, battens and screws come away, the foam moves aside and the packed vase is revealed. Below it, a quick-quote form takes every crate a customer needs in one request.",
      "The project gave me the chance to do real 3D modelling. Instead of modelling in Blender and exporting a mesh, I built the crate in code with Three.js, working with Claude as a pair programmer: describing how a real shipping crate goes together, then refining geometry, materials and lighting against the workshop's own photos until it read as the real thing. The site went from an empty Next.js app to a tested, continuously deployed production site in four days.",
    ],
    contribution: [
      { label: "Modelling in code", detail: "Modelled every board, batten, countersunk screw and foam block on Three.js geometry from one dimension spec, plus a lathe-turned porcelain vase. All textures are generated rather than photographed: wood grain with growth rings, knots and end grain, layered ply edges, CASE1 stencils and a crackled glaze." },
      { label: "Scroll story", detail: "Turned the model into a pinned five-step story that reassembles when you scroll back. Frames render only while something moves, and the stage warms toward the brand pink with each step so progress still reads on a phone." },
      { label: "Performance on every device", detail: "Profiled the scene with the CPU throttled 4× and split its start-up into short tasks, taking desktop Lighthouse from 73–86 to 99. Cut draw calls from about 400 to 110 a frame, and added quality tiers that step down one level at a time, ending in pre-rendered stills for phones that can't keep up." },
      { label: "Quote request", detail: "Built a quick-quote form that takes several crates with sizes, options and up to three photos each, compressed in the browser to fit as email attachments. The team gets a branded email they can reply to directly, behind Turnstile, a honeypot and rate limiting." },
    ],
    caseStudy: {
      challenge:
        "A realistic 3D scene had to look right and stay smooth on everything from a Retina desktop to an iPhone in Low Power Mode to an old Android phone, without ever slowing down the headline or the quote form, which are what actually win the workshop its work.",
      decisions: [
        "The crate lives in code rather than in an exported model, so geometry, textures and the animation share one spec, and every refinement is a small, reviewable change.",
        "The 3D scene is an enhancement, not a dependency: the headline renders from the server, a still poster of the crate shows first, and the live scene fades in only once its first frame is ready.",
        "Quality is set by measured frame rate rather than what a device claims, because iPhones under-report their cores and phones report desktop-class CPUs. Stills take over below 20 fps, well under the 30 fps cap of battery-saver modes, so a fast phone in Low Power Mode keeps the live scene.",
        "Requests arrive as ordinary emails addressed back to the customer, so the team quotes from the inbox they already use instead of learning a new back office.",
      ],
      quality: [
        "Rendering bugs were traced to their cause rather than hidden: white outlines around the crate came down to how the canvas handled transparency, and dashed board edges on Retina screens to rendering at 1.75× and stretching to 2×.",
        "Vitest and Playwright cover the quote form, spam checks, emails and the stills fallback against a production build, and every push to main is linted, tested and built before it deploys.",
      ],
      outcome:
        "The site is live. Visitors see how their piece will be protected on whatever device they use, the workshop receives requests with sizes and photos for every crate, and the crate itself shows that modelling in code with AI assistance can reach a production-quality 3D result.",
    },
    sourceAccess: {
      visibility: "private",
      note: "Client source code is private. I can demonstrate the live site and walk through the 3D scene and its performance fallbacks in a technical session.",
    },
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "React Three Fiber",
      "Three.js",
      "Tailwind CSS v4",
      "React Hook Form",
      "Zod",
      "Nodemailer",
      "Cloudflare Turnstile",
      "Vitest",
      "Playwright",
      "GitHub Actions",
      "PM2 / NGINX",
    ],
    accent: "lilac",
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
