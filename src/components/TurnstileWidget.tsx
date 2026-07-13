"use client";

import { useCallback, useEffect, useRef } from "react";
import Script from "next/script";

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

export function TurnstileWidget({ siteKey, onToken }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  const renderWidget = useCallback(() => {
    if (!siteKey || !containerRef.current || !window.turnstile || widgetIdRef.current) return;
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      action: "doodle-contact",
      theme: "auto",
      callback: (token: string) => onTokenRef.current(token),
      "expired-callback": () => onTokenRef.current(""),
      "error-callback": () => onTokenRef.current(""),
    });
  }, [siteKey]);

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
    </div>
  );
}
