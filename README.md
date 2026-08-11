# zajenckauskas.lt

[![CI/CD](https://github.com/dzajenckauskas/danielius/actions/workflows/ci.yml/badge.svg)](https://github.com/dzajenckauskas/danielius/actions/workflows/ci.yml)

Personal website / portfolio for **Danielius Zajenckauskas** — Product Engineer.

🔗 **Live:** [zajenckauskas.lt](https://zajenckauskas.lt)

Built with Next.js 15 (App Router), TypeScript, Tailwind CSS v4 and next-themes. Motion is
hand-rolled CSS/canvas (see `Reveal.tsx`, `DoodleLayer.tsx`) rather than a motion library.

## Structure

```
src/
  app/          Routes (App Router): home, /projects, /experience, résumé and doodle APIs
  components/   UI — hero, nav, project explorers, the doodle studio, resume/PDF rendering
  data/         Single source of truth for site copy (profile.ts, projects.ts) and content
  hooks/        Shared client-side behaviour (e.g. portrait drag/resize geometry)
  lib/          Framework-free logic — doodle canvas drawing, stroke math, form validation
e2e/            Playwright smoke tests
```

## Development

```bash
npm install
npm run dev      # http://localhost:3000
```

## Testing

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # ESLint
npm test            # Vitest — unit tests for lib/ (doodle canvas, strokes, form validation)
npm run test:e2e    # Playwright — nav, mobile menu, reduced motion, project/résumé flows
```

`test:e2e` builds and boots a production server itself (see `playwright.config.ts`); run
`npx playwright install` once beforehand to fetch the browser binaries.

## Build

```bash
npm run build
npm start
```

## Doodle delivery

The page-wide doodle studio can email visitor drawings as PNG attachments. Copy
`.env.example` to `.env.local` and add the SMTP credentials for the sending
mailbox. The Nodemailer transport supports port 465 with immediate TLS or port
587 with STARTTLS. Delivery defaults to the email in `src/data/profile.ts`;
`DOODLE_RECIPIENT_EMAIL` can override it.

Anonymous submissions are protected with Cloudflare Turnstile, a honeypot,
minimum form dwell time, same-origin checks, validation, file-signature checks,
and basic rate limiting. The published Turnstile test keys in `.env.example` are
for local development only; configure keys for the production domain before
deployment.

## Editing content

All site copy lives in [`src/data/profile.ts`](src/data/profile.ts) and
[`src/data/projects.ts`](src/data/projects.ts) — name, tagline, about, skills,
experience, education, languages, interests and project case studies. Edit there;
the components read from it.

Profile photo: [`public/avatar.png`](public/avatar.png). Replace to swap the headshot.

To show a LinkedIn icon, set `linkedin` in `profile.ts` to your profile URL.

## Deploy

Zero-config on [Vercel](https://vercel.com): import the repo and deploy. Any static
Next.js host works too — `.github/workflows/ci.yml` in this repo deploys to a
self-managed VPS over SSH after lint/build pass on `main`.

## License

No license is granted. The code is public for review and reference — feel free to read it
and borrow patterns — but the personal content (`src/data/*`, `public/avatar.png`, the
name and copy throughout) isn't licensed for reuse.
