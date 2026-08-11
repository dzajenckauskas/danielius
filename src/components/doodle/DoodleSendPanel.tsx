import type { FormEventHandler, PointerEventHandler } from "react";
import { Send, Sparkles, X } from "lucide-react";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { DOODLE_HONEYPOT_FIELD, type DoodleFormValues } from "@/lib/doodle-form";

export type DoodleSendState = "idle" | "sending" | "sent" | "error";

type DoodleSendPanelProps = {
  state: DoodleSendState;
  error: string;
  fieldErrors: Partial<Record<keyof DoodleFormValues, string>>;
  turnstileToken: string;
  turnstileSiteKey?: string;
  onBackdropPointerDown: PointerEventHandler<HTMLDivElement>;
  onClose: () => void;
  onDone: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onValidateField: (field: keyof DoodleFormValues, value: string) => void;
  onClearFieldError: (field: keyof DoodleFormValues) => void;
  onTurnstileToken: (token: string) => void;
};

export function DoodleSendPanel({
  state,
  error,
  fieldErrors,
  turnstileToken,
  turnstileSiteKey,
  onBackdropPointerDown,
  onClose,
  onDone,
  onSubmit,
  onValidateField,
  onClearFieldError,
  onTurnstileToken,
}: DoodleSendPanelProps) {
  return (
    <div className="doodle-send-backdrop" role="presentation" onPointerDown={onBackdropPointerDown}>
      <section className="doodle-send-panel" role="dialog" aria-modal="true" aria-labelledby="doodle-send-title">
        <button type="button" className="doodle-send-close" onClick={onClose} aria-label="Close send panel"><X /></button>
        {state === "sent" ? (
          <div className="doodle-send-success">
            <Sparkles />
            <p className="eyebrow">Doodle delivered</p>
            <h2>That made my inbox better.</h2>
            <p>Thanks for saying hello in your own way. A keepsake PDF is on its way to your inbox, and I’ll reply to the email you shared.</p>
            <button type="button" className="primary-button" onClick={onDone}>Done</button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <p className="eyebrow">Creative contact</p>
            <h2 id="doodle-send-title">Send your doodle</h2>
            <p>I’ll receive your transparent doodle and a portrait preview. Add an email so I can draw—or write—back.</p>
            <div className="doodle-form-grid">
              <label>
                <span>Your name</span>
                <input name="name" maxLength={80} autoComplete="name" required aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? "doodle-name-error" : undefined} onBlur={(event) => onValidateField("name", event.currentTarget.value)} onChange={() => onClearFieldError("name")} />
                {fieldErrors.name && <small id="doodle-name-error" className="doodle-field-error">{fieldErrors.name}</small>}
              </label>
              <label>
                <span>Your email</span>
                <input name="email" type="email" maxLength={160} autoComplete="email" required aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? "doodle-email-error" : undefined} onBlur={(event) => onValidateField("email", event.currentTarget.value)} onChange={() => onClearFieldError("email")} />
                {fieldErrors.email && <small id="doodle-email-error" className="doodle-field-error">{fieldErrors.email}</small>}
              </label>
            </div>
            <label>
              <span>A little context</span>
              <textarea name="message" rows={3} maxLength={1000} placeholder="A project, an idea, or just hello…" required aria-invalid={Boolean(fieldErrors.message)} aria-describedby={fieldErrors.message ? "doodle-message-error" : undefined} onBlur={(event) => onValidateField("message", event.currentTarget.value)} onChange={() => onClearFieldError("message")} />
              {fieldErrors.message && <small id="doodle-message-error" className="doodle-field-error">{fieldErrors.message}</small>}
            </label>
            <label className="doodle-honeypot" aria-hidden="true"><span>Website</span><input name={DOODLE_HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" /></label>
            <TurnstileWidget siteKey={turnstileSiteKey} onToken={onTurnstileToken} />
            {error && <p className="doodle-form-error" role="alert">{error}</p>}
            <button type="submit" className="primary-button" disabled={state === "sending" || !turnstileSiteKey || !turnstileToken}>
              <Send />{state === "sending" ? "Sending…" : "Send doodle"}
            </button>
            <small className="doodle-privacy-note">Your details are only used to reply to this message.</small>
          </form>
        )}
      </section>
    </div>
  );
}
