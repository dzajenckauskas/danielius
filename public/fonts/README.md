# Fonts — Neris

The site is styled for the **Neris** typeface (the one used in the CV). Drop the
font files into this folder with these exact names and the whole site (headings,
body, buttons) will switch from the Poppins fallback to Neris automatically — no
code changes needed.

Preferred format is `.woff2` (smallest). `.woff`, `.otf` or `.ttf` also work —
if you use a different extension, update the `src` url in
`src/app/globals.css` (the `@font-face` block) to match.

Expected files:

| File                        | Weight | Style   |
|-----------------------------|--------|---------|
| `Neris-Light.woff2`         | 300    | normal  |
| `Neris-LightItalic.woff2`   | 300    | italic  |
| `Neris-SemiBold.woff2`      | 600    | normal  |
| `Neris-SemiBoldItalic.woff2`| 600    | italic  |
| `Neris-Black.woff2`         | 900    | normal  |

> Your **name** in the hero is an exact vector extracted from the CV, so it looks
> identical whether or not Neris is installed.

To convert `.otf`/`.ttf` → `.woff2`, use https://cloudconvert.com/ttf-to-woff2
or `npx ttf2woff2 Neris-Black.ttf > Neris-Black.woff2`.
