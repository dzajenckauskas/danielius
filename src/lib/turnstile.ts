import "server-only";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_TEST_SECRET = "1x0000000000000000000000000000000AA";

type TurnstileResponse = {
  success: boolean;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
};

export async function verifyTurnstileToken(token: string, remoteIp?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) throw new Error("Turnstile is not configured.");
  if (process.env.NODE_ENV === "production" && secret === TURNSTILE_TEST_SECRET) {
    throw new Error("Turnstile test credentials cannot be used in production.");
  }

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Turnstile verification request failed.");

  const result = (await response.json()) as TurnstileResponse;
  const usesDevelopmentTestSecret = secret === TURNSTILE_TEST_SECRET && process.env.NODE_ENV !== "production";
  return {
    // Cloudflare's published pass-test credentials do not reliably echo custom
    // actions. Real production credentials must always match our form action.
    success: result.success && (usesDevelopmentTestSecret || result.action === "doodle-contact"),
    errorCodes: result["error-codes"] || [],
    hostname: result.hostname || null,
  };
}
