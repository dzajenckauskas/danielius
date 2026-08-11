import { NextResponse } from "next/server";
import { DOODLE_HONEYPOT_FIELD } from "@/lib/doodle-form";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { getSafeRequestOrigin, verifySameOrigin } from "@/lib/request-origin";
import { getClientIp, parseDoodleSubmission } from "@/lib/doodle-submission";
import { DELIVERY_WINDOW_MS, doodleRateLimiter } from "@/lib/doodle-rate-limit";
import {
  deliverDoodle,
  DoodleDeliveryConfigurationError,
} from "@/lib/doodle-delivery";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!verifySameOrigin(request)) {
    return NextResponse.json({ error: "This submission origin is not allowed." }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Silently accept honeypot submissions so simple bots receive no useful signal.
  if (body[DOODLE_HONEYPOT_FIELD]) return NextResponse.json({ ok: true });

  const parsed = await parseDoodleSubmission(body);
  if (!parsed.ok) return NextResponse.json(parsed.body, { status: parsed.status });

  const clientIp = getClientIp(request);
  if (!doodleRateLimiter.isAllowed(clientIp)) {
    return NextResponse.json(
      { error: "A few doodles are already on their way. Please try again later." },
      { status: 429, headers: { "Retry-After": String(DELIVERY_WINDOW_MS / 1000) } },
    );
  }

  try {
    const verification = await verifyTurnstileToken(
      parsed.value.turnstileToken,
      clientIp === "unknown" ? undefined : clientIp,
    );
    if (!verification.success) {
      return NextResponse.json(
        { error: "Bot verification failed. Refresh the form and try again." },
        { status: 403 },
      );
    }
  } catch (error) {
    console.error("Doodle bot verification unavailable", error);
    return NextResponse.json({ error: "Bot protection is temporarily unavailable." }, { status: 503 });
  }

  const portfolioUrl = getSafeRequestOrigin(request);
  try {
    await deliverDoodle(parsed.value, portfolioUrl);
  } catch (error) {
    if (error instanceof DoodleDeliveryConfigurationError) {
      return NextResponse.json(
        { error: "Doodle delivery is not configured yet. Please use the email link on the page." },
        { status: 503 },
      );
    }
    console.error("Doodle SMTP delivery failed", error);
    return NextResponse.json(
      { error: "The doodle could not be delivered. Please try again." },
      { status: 502 },
    );
  }

  doodleRateLimiter.record(clientIp);
  return NextResponse.json({ ok: true });
}
