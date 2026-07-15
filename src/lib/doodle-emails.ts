// Transactional email templates for the doodle flow. Both messages share one
// visual shell that mirrors the site's design system (globals.css): warm paper
// background, a white hairline-bordered card, the hero-blob gradient thread,
// editorial eyebrow + mono meta captions, and ink-coloured actions.

const SITE_URL = "https://zajenckauskas.lt";
const SITE_LABEL = "zajenckauskas.lt";

// Light-theme tokens from globals.css. Emails follow the printed-CV light
// theme; inline styles keep rendering predictable across clients.
const color = {
  bg: "#f7f5f2",
  surface: "#ffffff",
  surface2: "#f2efea",
  border: "#e5e1da",
  text: "#191a1c",
  muted: "#55585c",
  subtle: "#8b8e92",
  ink: "#4f736e",
  inkStrong: "#3d5b57",
  blobLilac: "#b59bd7",
  blobBlue: "#8fbccc",
  blobRose: "#d891aa",
  blobOchre: "#d2ae6c",
};

const fontStack = "'Neris','Helvetica Neue',Helvetica,Arial,sans-serif";
const monoStack = "'SFMono-Regular',Menlo,Consolas,'Liberation Mono',monospace";

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[character] ?? character);
}

function eyebrowRow(eyebrow: string) {
  return `
    <p style="margin:0;font-family:${fontStack};font-size:10px;font-weight:700;letter-spacing:.26em;text-transform:uppercase;color:${color.inkStrong}">${eyebrow}</p>`;
}

function button(href: string, label: string) {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;border-radius:12px;padding:13px 24px;background-color:${color.ink};color:#ffffff;font-family:${fontStack};font-size:14px;font-weight:600;letter-spacing:.01em;text-decoration:none">${label}</a>`;
}

function enclosedNote(items: string) {
  return `
    <p style="margin:26px 0 0;font-family:${monoStack};font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:${color.subtle}">Enclosed&nbsp;&mdash;&nbsp;${items}</p>`;
}

// Footer divider — a wide-gapped dashed rule drawn with a background
// gradient rather than border-style:dashed, so the dash/gap ratio is exact
// instead of left to each mail client's own rendering of "dashed".
const FOOTER_DIVIDER = `background-image:repeating-linear-gradient(to right, ${color.border} 0 6px, transparent 6px 20px);background-repeat:repeat-x;background-size:100% 1px;height:1px;line-height:1px;font-size:0`;

// Small crisp-edged accent shapes (near-zero blur), distinct from the big
// soft radial washes on the card — mirrors the site's low-blur accent blobs
// (hero-photo-blob-front-accent / -back-accent in globals.css).
function accentBlob(options: {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  width: string;
  height: string;
  radius: string;
  bg: string;
  opacity: number;
  rotate: string;
}) {
  const position = [
    options.top ? `top:${options.top};` : "",
    options.bottom ? `bottom:${options.bottom};` : "",
    options.left ? `left:${options.left};` : "",
    options.right ? `right:${options.right};` : "",
  ].join("");
  return `<div style="position:absolute;${position}width:${options.width};height:${options.height};border-radius:${options.radius};background-color:${options.bg};opacity:${options.opacity};filter:blur(2px);transform:rotate(${options.rotate});pointer-events:none"></div>`;
}

type ShellOptions = {
  preheader: string;
  eyebrow: string;
  content: string;
  footnote: string;
};

// One shared shell so both messages read as a pair. Table-based centring for
// older clients; the Neris @font-face degrades to Helvetica/Arial elsewhere.
function renderShell({ preheader, eyebrow, content, footnote }: ShellOptions) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<style>
  @font-face {
    font-family: "Neris";
    src: url("${SITE_URL}/fonts/neris/Neris-Light.woff2") format("woff2");
    font-weight: 300;
    font-style: normal;
  }
  @font-face {
    font-family: "Neris";
    src: url("${SITE_URL}/fonts/neris/Neris-SemiBold.woff2") format("woff2");
    font-weight: 600;
    font-style: normal;
  }
  @font-face {
    font-family: "Neris";
    src: url("${SITE_URL}/fonts/neris/Neris-Black.woff2") format("woff2");
    font-weight: 900;
    font-style: normal;
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:${color.bg}">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all">${escapeHtml(preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${color.bg}">
    <tr>
      <td align="center" style="padding:44px 16px 52px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px">
          <tr>
            <td style="position:relative;overflow:hidden;border:1px solid ${color.border};border-radius:24px;background-color:${color.surface};background-image:radial-gradient(circle at 96% 0%,rgba(181,155,215,0.18),transparent 32%),radial-gradient(circle at 0% 100%,rgba(95,149,125,0.12),transparent 36%);padding:38px 38px 32px">
              ${accentBlob({ top: "-16px", right: "-14px", width: "68px", height: "52px", radius: "71% 29% 58% 42% / 37% 66% 34% 63%", bg: color.blobRose, opacity: 0.3, rotate: "-14deg" })}
              ${accentBlob({ bottom: "-10px", left: "22px", width: "42px", height: "32px", radius: "26% 74% 37% 63% / 68% 32% 68% 32%", bg: color.blobOchre, opacity: 0.32, rotate: "12deg" })}
              <div style="position:relative;z-index:1">
                ${eyebrowRow(eyebrow)}
                ${content}
                <div style="margin-top:34px">
                  <div style="${FOOTER_DIVIDER}">&nbsp;</div>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:17px">
                    <tr>
                      <td style="font-family:${monoStack};font-size:10px;letter-spacing:.14em;line-height:1.8;text-transform:uppercase;color:${color.subtle}">Danielius Zajenčkauskas<br>Front-end Engineer</td>
                      <td align="right" valign="bottom"><a href="${SITE_URL}" style="font-family:${fontStack};font-size:12px;font-weight:600;color:${color.inkStrong};text-decoration:none">${SITE_LABEL}&nbsp;&#8599;</a></td>
                    </tr>
                  </table>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:18px 24px 0;font-family:${fontStack};font-size:11px;line-height:1.6;color:${color.subtle}">${footnote}</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function metaRow(label: string, value: string, last = false) {
  return `
    <tr>
      <td valign="top" style="padding:${last ? "10px 16px 0 0" : "10px 16px 10px 0"};${last ? "" : `border-bottom:1px solid ${color.border};`}font-family:${monoStack};font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:${color.subtle};white-space:nowrap">${label}</td>
      <td valign="top" style="padding:${last ? "10px 0 0" : "10px 0"};${last ? "" : `border-bottom:1px solid ${color.border};`}font-family:${fontStack};font-size:14px;line-height:1.5;color:${color.text}" align="right">${value}</td>
    </tr>`;
}

type OwnerEmailValues = {
  name: string;
  email: string;
  message: string;
  page?: string;
};

export function buildOwnerDoodleEmail({ name, email, message, page }: OwnerEmailValues) {
  const safeName = escapeHtml(name);
  const rows = [
    metaRow("From", safeName),
    metaRow(
      "Reply to",
      `<a href="mailto:${escapeHtml(email)}" style="color:${color.inkStrong};text-decoration:none">${escapeHtml(email)}</a>`,
      !page,
    ),
    page ? metaRow("Drawn on", escapeHtml(page), true) : "",
  ].join("");

  const content = `
    <h1 style="margin:20px 0 0;font-family:${fontStack};font-size:27px;font-weight:900;letter-spacing:-.02em;line-height:1.12;color:${color.text}">${safeName} left a doodle on your portrait.</h1>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:22px;border:1px solid ${color.border};border-radius:16px;background-color:${color.surface2}">
      <tr>
        <td style="padding:8px 20px 18px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>
        </td>
      </tr>
    </table>
    <p style="margin:26px 0 0;font-family:${monoStack};font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:${color.subtle}">Their note</p>
    <p style="margin:10px 0 0;font-family:${fontStack};font-size:15px;line-height:1.7;color:${color.muted};white-space:pre-wrap">${escapeHtml(message)}</p>
    ${enclosedNote("transparent doodle &middot; portrait preview &middot; portrait-card PDF")}
    <p style="margin:28px 0 0">${button(`mailto:${email}`, `Reply to ${name}`)}</p>`;

  return {
    subject: `[DOODLE] ${name} left you a doodle`,
    html: renderShell({
      preheader: message.slice(0, 140),
      eyebrow: "New doodle",
      content,
      footnote: `Sent by the doodle form on <a href="${SITE_URL}" style="color:${color.subtle}">${SITE_LABEL}</a>.`,
    }),
  };
}

type VisitorEmailValues = {
  name: string;
  portfolioUrl?: string;
};

export function buildVisitorDoodleEmail({ name, portfolioUrl }: VisitorEmailValues) {
  const destination = portfolioUrl || SITE_URL;
  const content = `
    <h1 style="margin:20px 0 0;font-family:${fontStack};font-size:27px;font-weight:900;letter-spacing:-.02em;line-height:1.12;color:${color.text}">Thank you for the doodle, ${escapeHtml(name)}.</h1>
    <p style="margin:18px 0 0;font-family:${fontStack};font-size:15px;line-height:1.7;color:${color.muted}">Your drawing arrived safely and now hangs in my inbox gallery. I've enclosed the finished piece &mdash; your linework over my portrait &mdash; as a small keepsake of your visit.</p>
    <p style="margin:14px 0 0;font-family:${fontStack};font-size:15px;line-height:1.7;color:${color.muted}">If there is a project behind the pen, simply reply to this note &mdash; it reaches me directly.</p>
    ${enclosedNote("the finished portrait, PDF")}
    <p style="margin:28px 0 0">${button(destination, "Visit the portfolio")}</p>`;

  return {
    subject: "Your doodle arrived — the portrait is enclosed",
    html: renderShell({
      preheader: "The finished portrait is enclosed as a keepsake.",
      eyebrow: "Doodle received",
      content,
      footnote: `You're receiving this one-time note because a doodle was sent from <a href="${SITE_URL}" style="color:${color.subtle}">${SITE_LABEL}</a>.`,
    }),
  };
}
