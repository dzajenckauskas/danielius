/**
 * Accept requests with no Origin/Host metadata (for non-browser clients), but
 * reject malformed or cross-origin browser submissions.
 */
export function verifySameOrigin(request: Request): boolean {
  const host = request.headers.get("host");
  const origin = request.headers.get("origin");

  if (!origin || !host) return true;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function getSafeRequestOrigin(request: Request): string {
  const origin = request.headers.get("origin");
  if (!origin) return "";

  try {
    return new URL(origin).origin;
  } catch {
    return "";
  }
}
