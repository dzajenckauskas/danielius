import nodemailer from "nodemailer";
import { buildOwnerDoodleEmail, buildVisitorDoodleEmail } from "@/lib/doodle-emails";
import type { ValidDoodleSubmission } from "@/lib/doodle-submission";
import { generateDoodlePortraitPdf } from "@/lib/generateDoodlePortraitPdf";

const DEFAULT_DOODLE_RECIPIENT = "danielius@zajenckauskas.lt";

export class DoodleDeliveryConfigurationError extends Error {}

export async function deliverDoodle(
  submission: ValidDoodleSubmission,
  portfolioUrl: string,
) {
  const smtpHost = process.env.SMTP_HOST?.trim();
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS;
  if (!smtpHost || !smtpUser || !smtpPass) {
    throw new DoodleDeliveryConfigurationError("Doodle delivery is not configured.");
  }

  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : smtpPort === 465,
    requireTLS: process.env.SMTP_REQUIRE_TLS ? process.env.SMTP_REQUIRE_TLS === "true" : smtpPort === 587,
    connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT || 10_000),
    greetingTimeout: Number(process.env.SMTP_GREETING_TIMEOUT || 10_000),
    socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT || 10_000),
    tls: { rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED !== "false" },
    auth: { user: smtpUser, pass: smtpPass },
  });

  const recipient = process.env.DOODLE_RECIPIENT_EMAIL?.trim() || DEFAULT_DOODLE_RECIPIENT;
  const from = process.env.SMTP_FROM?.trim() || `Doodle Post <${smtpUser}>`;
  const { values, attachments, page } = submission;
  const portraitPdf = await generateDoodlePortraitPdf(attachments.portraitCard);
  const attachmentTimestamp = Date.now();
  const ownerEmail = buildOwnerDoodleEmail({ ...values, page });

  await transporter.sendMail({
    from,
    to: recipient,
    replyTo: values.email,
    subject: ownerEmail.subject,
    headers: { "X-Doodle-Submission": "true" },
    html: ownerEmail.html,
    attachments: [
      { filename: `doodle-transparent-${attachmentTimestamp}.png`, content: attachments.artwork, contentType: "image/png" },
      { filename: `doodle-on-portrait-${attachmentTimestamp}.jpg`, content: attachments.composite, contentType: "image/jpeg" },
      { filename: `Danielius-Zajenckauskas-doodle-${attachmentTimestamp}.pdf`, content: portraitPdf, contentType: "application/pdf" },
      ...(attachments.strokes
        ? [{ filename: `doodle-source-${attachmentTimestamp}.json`, content: attachments.strokes, contentType: "application/json" }]
        : []),
    ],
  });

  try {
    const visitorEmail = buildVisitorDoodleEmail({ name: values.name, portfolioUrl });
    await transporter.sendMail({
      from,
      to: values.email,
      replyTo: recipient,
      subject: visitorEmail.subject,
      headers: {
        "Auto-Submitted": "auto-replied",
        "X-Auto-Response-Suppress": "All",
        Precedence: "bulk",
      },
      html: visitorEmail.html,
      attachments: [{
        filename: `your-doodle-with-Danielius-${attachmentTimestamp}.pdf`,
        content: portraitPdf,
        contentType: "application/pdf",
      }],
    });
  } catch (error) {
    // The original doodle has arrived; don't invite a duplicate submission if
    // only the optional keepsake reply fails.
    console.error("Doodle sender auto-reply failed", error);
  }
}
