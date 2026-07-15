# zajenckauskas.lt

Personal website / portfolio for **Danielius Zajenckauskas** — Front-End Developer.

Built with Next.js 15 (App Router), TypeScript, Tailwind CSS v4, next-themes and Framer Motion.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
```

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

All site copy lives in [`src/data/profile.ts`](src/data/profile.ts) — name, tagline,
about, skills, experience, education, languages and interests. Edit there; the
components read from it.

Profile photo: [`public/avatar.png`](public/avatar.png). Replace to swap the headshot.

To show a LinkedIn icon, set `linkedin` in `profile.ts` to your profile URL.

## Deploy

Zero-config on [Vercel](https://vercel.com): import the repo and deploy. Any static
Next.js host works too.
