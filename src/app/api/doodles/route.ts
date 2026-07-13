import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import * as yup from "yup";
import { profile } from "@/data/profile";
import {
  DOODLE_MIN_DWELL_TIME_MS,
  DoodleFormValues,
  doodleFormSchema,
  getYupFieldErrors,
} from "@/lib/doodle-form";
import { verifyTurnstileToken } from "@/lib/turnstile";

export const runtime = "nodejs";

const deliveryWindows = new Map<string, number[]>();
const DELIVERY_LIMIT = 5;
const DELIVERY_WINDOW_MS = 10 * 60 * 1000;
const MAX_ARTWORK_BYTES = 3_000_000;

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[character] ?? character);
}

function getClientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
}

function isPng(buffer: Buffer) {
  return buffer.length >= 8
    && buffer[0] === 0x89
    && buffer[1] === 0x50
    && buffer[2] === 0x4e
    && buffer[3] === 0x47
    && buffer[4] === 0x0d
    && buffer[5] === 0x0a
    && buffer[6] === 0x1a
    && buffer[7] === 0x0a;
}

export async function POST(request: Request) {
  const host = request.headers.get("host");
  const origin = request.headers.get("origin");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return NextResponse.json({ error: "This submission origin is not allowed." }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "This submission origin is not allowed." }, { status: 403 });
    }
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Silently accept honeypot submissions so simple bots receive no useful signal.
  if (body.website) return NextResponse.json({ ok: true });

  const issuedAtMs = Number(body.issuedAtMs);
  if (!Number.isFinite(issuedAtMs) || Date.now() - issuedAtMs < DOODLE_MIN_DWELL_TIME_MS) {
    return NextResponse.json({ error: "Please take a moment to review your message before sending." }, { status: 400 });
  }

  let values: DoodleFormValues;
  try {
    values = await doodleFormSchema.validate({
      name: body.name,
      email: body.email,
      message: body.message,
    }, { abortEarly: false, stripUnknown: true });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return NextResponse.json({
        error: "Please check the highlighted fields.",
        fieldErrors: getYupFieldErrors(error),
      }, { status: 400 });
    }
    return NextResponse.json({ error: "The submitted details are invalid." }, { status: 400 });
  }

  const artwork = typeof body.artwork === "string" ? body.artwork : "";
  if (!artwork.startsWith("data:image/png;base64,")) {
    return NextResponse.json({ error: "The drawing is missing or invalid." }, { status: 400 });
  }
  const artworkBuffer = Buffer.from(artwork.slice("data:image/png;base64,".length), "base64");
  if (!isPng(artworkBuffer) || artworkBuffer.length > MAX_ARTWORK_BYTES) {
    return NextResponse.json({ error: "The drawing is invalid or too large to send." }, { status: 400 });
  }

  const turnstileToken = typeof body.turnstileToken === "string" ? body.turnstileToken.trim() : "";
  if (!turnstileToken) {
    return NextResponse.json({ error: "Complete the bot check before sending." }, { status: 400 });
  }

  const clientIp = getClientIp(request);
  const now = Date.now();
  const recentDeliveries = (deliveryWindows.get(clientIp) || []).filter((time) => now - time < DELIVERY_WINDOW_MS);
  if (recentDeliveries.length >= DELIVERY_LIMIT) {
    return NextResponse.json(
      { error: "A few doodles are already on their way. Please try again later." },
      { status: 429, headers: { "Retry-After": String(DELIVERY_WINDOW_MS / 1000) } },
    );
  }

  try {
    const verification = await verifyTurnstileToken(turnstileToken, clientIp === "unknown" ? undefined : clientIp);
    if (!verification.success) {
      return NextResponse.json({ error: "Bot verification failed. Refresh the form and try again." }, { status: 403 });
    }
  } catch (error) {
    console.error("Doodle bot verification unavailable", error);
    return NextResponse.json({ error: "Bot protection is temporarily unavailable." }, { status: 503 });
  }

  const smtpHost = process.env.SMTP_HOST?.trim();
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS;
  if (!smtpHost || !smtpUser || !smtpPass) {
    return NextResponse.json(
      { error: "Doodle delivery is not configured yet. Please use the email link on the page." },
      { status: 503 },
    );
  }

  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === "true"
    : smtpPort === 465;
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure,
    requireTLS: process.env.SMTP_REQUIRE_TLS
      ? process.env.SMTP_REQUIRE_TLS === "true"
      : smtpPort === 587,
    connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT || 10_000),
    greetingTimeout: Number(process.env.SMTP_GREETING_TIMEOUT || 10_000),
    socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT || 10_000),
    tls: { rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED !== "false" },
    auth: { user: smtpUser, pass: smtpPass },
  });

  const page = typeof body.page === "string" ? body.page.slice(0, 500) : "";
  const recipient = process.env.DOODLE_RECIPIENT_EMAIL?.trim() || profile.email;
  const from = process.env.SMTP_FROM?.trim() || `Doodle Post <${smtpUser}>`;

  try {
    await transporter.sendMail({
      from,
      to: recipient,
      replyTo: values.email,
      subject: `A doodle from ${values.name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#191a1c">
          <p style="color:#4f736e;font-size:12px;letter-spacing:.16em;text-transform:uppercase">Creative contact</p>
          <h1 style="font-size:28px">${escapeHtml(values.name)} sent you a doodle</h1>
          <p><strong>Reply to:</strong> ${escapeHtml(values.email)}</p>
          <p style="white-space:pre-wrap">${escapeHtml(values.message)}</p>
          ${page ? `<p style="color:#777;font-size:12px">Drawn on ${escapeHtml(page)}</p>` : ""}
          <p>The full-resolution artwork is attached.</p>
        </div>`,
      attachments: [{
        filename: `doodle-${Date.now()}.png`,
        content: artworkBuffer,
        contentType: "image/png",
      }],
    });
  } catch (error) {
    console.error("Doodle SMTP delivery failed", error);
    return NextResponse.json({ error: "The doodle could not be delivered. Please try again." }, { status: 502 });
  }

  deliveryWindows.set(clientIp, [...recentDeliveries, now]);
  return NextResponse.json({ ok: true });
}
