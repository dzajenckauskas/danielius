import * as yup from "yup";

export const DOODLE_TURNSTILE_FIELD = "turnstileToken";
export const DOODLE_HONEYPOT_FIELD = "website";
export const DOODLE_MIN_DWELL_TIME_MS = 3_000;

export type DoodleFormValues = {
  name: string;
  email: string;
  message: string;
};

export const doodleFormSchema: yup.ObjectSchema<DoodleFormValues> = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Please enter at least 2 characters.")
    .max(80, "Name must be 80 characters or less.")
    .required("Please add your name."),
  email: yup
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(160, "Email must be 160 characters or less.")
    .required("Please add your email address."),
  message: yup
    .string()
    .trim()
    .min(10, "Please add at least 10 characters of context.")
    .max(1_000, "Context must be 1,000 characters or less.")
    .required("Please add a little context for your doodle."),
});

export function getDoodleFormValues(formData: FormData): DoodleFormValues {
  return {
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    message: String(formData.get("message") || ""),
  };
}

export function getYupFieldErrors(error: yup.ValidationError) {
  const errors: Partial<Record<keyof DoodleFormValues, string>> = {};
  for (const issue of error.inner.length ? error.inner : [error]) {
    const path = issue.path as keyof DoodleFormValues | undefined;
    if (path && !errors[path]) errors[path] = issue.message;
  }
  return errors;
}
