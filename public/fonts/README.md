# Fonts — Neris

The site is styled for the **Neris** typeface (the one used in the CV). Drop the
font files into this folder with these exact names and the whole site (headings,
body, buttons) will switch from the Poppins fallback to Neris automatically — no
code changes needed.

Preferred format is `.woff2` (smallest). `.woff`, `.otf` or `.ttf` also work —
if you use a different extension, update the `src` list in the `localFont()`
call in `src/app/layout.tsx` to match. Fonts are self-hosted via `next/font`
(not a manual `@font-face` block), which inlines the font-face CSS into the
document head and preloads the files automatically.

Expected files (web, roman weights only — italic is never rendered in the UI):

| File                        | Weight | Style   |
|-----------------------------|--------|---------|
| `Neris-Light.woff2`         | 300    | normal  |
| `Neris-SemiBold.woff2`      | 600    | normal  |
| `Neris-Black.woff2`         | 900    | normal  |

The CV/resume PDF is generated separately (`src/components/resume/ResumeDocument.tsx`)
and reads `.otf` files directly, since `@react-pdf/renderer` can't embed woff2:
`Neris-Light.otf`, `Neris-SemiBold.otf`, `Neris-Black.otf`, `Neris-LightItalic.otf`
(the PDF's only italic use is the CV's date ranges).

> Your **name** in the hero is an exact vector extracted from the CV, so it looks
> identical whether or not Neris is installed.

To convert `.otf`/`.ttf` → `.woff2`, use https://cloudconvert.com/ttf-to-woff2
or `npx ttf2woff2 Neris-Black.ttf > Neris-Black.woff2`.
