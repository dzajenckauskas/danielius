import * as yup from "yup";
import {
  DOODLE_MIN_DWELL_TIME_MS,
  DOODLE_TURNSTILE_FIELD,
  type DoodleFormValues,
  doodleFormSchema,
  getYupFieldErrors,
} from "@/lib/doodle-form";
import { parseDoodleAttachments, type DoodleAttachments } from "@/lib/doodle-attachments";

export type ValidDoodleSubmission = {
  values: DoodleFormValues;
  attachments: DoodleAttachments;
  turnstileToken: string;
  page: string;
};

type SubmissionResult =
  | { ok: true; value: ValidDoodleSubmission }
  | { ok: false; status: number; body: { error: string; fieldErrors?: ReturnType<typeof getYupFieldErrors> } };

export async function parseDoodleSubmission(
  body: Record<string, unknown>,
  now = Date.now(),
): Promise<SubmissionResult> {
  const issuedAtMs = Number(body.issuedAtMs);
  if (!Number.isFinite(issuedAtMs) || now - issuedAtMs < DOODLE_MIN_DWELL_TIME_MS) {
    return {
      ok: false,
      status: 400,
      body: { error: "Please take a moment to review your message before sending." },
    };
  }

  let values: DoodleFormValues;
  try {
    values = await doodleFormSchema.validate(
      { name: body.name, email: body.email, message: body.message },
      { abortEarly: false, stripUnknown: true },
    );
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return {
        ok: false,
        status: 400,
        body: {
          error: "Please check the highlighted fields.",
          fieldErrors: getYupFieldErrors(error),
        },
      };
    }
    return { ok: false, status: 400, body: { error: "The submitted details are invalid." } };
  }

  const attachments = parseDoodleAttachments(body);
  if (!attachments.ok) return { ok: false, status: 400, body: { error: attachments.error } };

  const turnstileToken = typeof body[DOODLE_TURNSTILE_FIELD] === "string"
    ? body[DOODLE_TURNSTILE_FIELD].trim()
    : "";
  if (!turnstileToken) {
    return { ok: false, status: 400, body: { error: "Complete the bot check before sending." } };
  }

  return {
    ok: true,
    value: {
      values,
      attachments: attachments.value,
      turnstileToken,
      page: typeof body.page === "string" ? body.page.slice(0, 500) : "",
    },
  };
}

export function getClientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
}
