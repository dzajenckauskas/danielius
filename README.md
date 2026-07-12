# danielius.dev

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

## Editing content

All site copy lives in [`src/data/profile.ts`](src/data/profile.ts) — name, tagline,
about, skills, experience, education, languages and interests. Edit there; the
components read from it.

Profile photo: [`public/avatar.jpg`](public/avatar.jpg). Replace to swap the headshot.

To show a LinkedIn icon, set `linkedin` in `profile.ts` to your profile URL.

## Deploy

Zero-config on [Vercel](https://vercel.com): import the repo and deploy. Any static
Next.js host works too.
