"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useTheme } from "next-themes";
import { LoaderCircle, ShieldAlert, ShieldCheck } from "lucide-react";

type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type TurnstileWidgetProps = {
  siteKey?: string;
  onToken: (token: string) => void;
};

type VerificationState = "checking" | "verified" | "error";

function TurnstileStatus({ state }: { state: VerificationState }) {
  const content = {
    checking: { icon: <LoaderCircle aria-hidden="true" />, label: "Checking with Cloudflare…" },
    verified: { icon: <ShieldCheck aria-hidden="true" />, label: "Verified by Cloudflare" },
    error: { icon: <ShieldAlert aria-hidden="true" />, label: "Cloudflare check unavailable" },
  }[state];

  return (
    <div className={`doodle-captcha-status is-${state}`} role="status" aria-live="polite">
      {content.icon}
      <span>{content.label}</span>
    </div>
  );
}

export function TurnstileWidget({ siteKey, onToken }: TurnstileWidgetProps) {
  const { resolvedTheme } = useTheme();
  const [verificationState, setVerificationState] = useState<VerificationState>("checking");
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  const renderWidget = useCallback(() => {
    if (!siteKey || !containerRef.current || !window.turnstile || widgetIdRef.current) return;
    setVerificationState("checking");
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      action: "doodle-contact",
      // Match the site's selected theme rather than the operating-system theme.
      theme: resolvedTheme === "dark" ? "dark" : "light",
      size: "normal",
      appearance: "interaction-only",
      callback: (token: string) => {
        setVerificationState("verified");
        onTokenRef.current(token);
      },
      "expired-callback": () => {
        setVerificationState("checking");
        onTokenRef.current("");
      },
      "error-callback": () => {
        setVerificationState("error");
        onTokenRef.current("");
      },
    });
  }, [resolvedTheme, siteKey]);

  useEffect(() => {
    renderWidget();
    return () => {
      if (widgetIdRef.current && window.turnstile) window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
      onTokenRef.current("");
    };
  }, [renderWidget]);

  if (!siteKey) {
    return <p className="doodle-captcha-error" role="alert">Bot protection is temporarily unavailable.</p>;
  }

  return (
    <div className="doodle-captcha">
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" async defer onReady={renderWidget} />
      <div ref={containerRef} />
      <TurnstileStatus state={verificationState} />
    </div>
  );
}
