"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import * as yup from "yup";
import type { NormalizedStroke } from "@/lib/doodle-strokes";
import {
  DOODLE_HONEYPOT_FIELD,
  DOODLE_TURNSTILE_FIELD,
  type DoodleFormValues,
  doodleFormSchema,
  getDoodleFormValues,
  getYupFieldErrors,
} from "@/lib/doodle-form";
import type { DoodleSendState } from "@/components/doodle/DoodleSendPanel";

type DoodleSubmissionOptions = {
  pathname: string;
  historySize: number;
  exportArtwork: () => string;
  exportStrokes: () => NormalizedStroke[];
  exportPortraitComposite: () => Promise<string>;
  exportPortraitCard: (composite: string) => Promise<string>;
};

export function useDoodleSubmission({
  pathname,
  historySize,
  exportArtwork,
  exportStrokes,
  exportPortraitComposite,
  exportPortraitCard,
}: DoodleSubmissionOptions) {
  const pdfPreviewRequestedRef = useRef(false);
  const sendOpenedAtRef = useRef(0);
  const [sendOpen, setSendOpen] = useState(false);
  const [sendState, setSendState] = useState<DoodleSendState>("idle");
  const [sendError, setSendError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof DoodleFormValues, string>>>({});

  useEffect(() => {
    if (
      pathname !== "/"
      || historySize === 0
      || pdfPreviewRequestedRef.current
      || new URLSearchParams(window.location.search).get("doodlePdfPreview") !== "1"
    ) return;

    pdfPreviewRequestedRef.current = true;
    const generatePreview = async () => {
      try {
        const composite = await exportPortraitComposite();
        const portraitCard = await exportPortraitCard(composite);
        const response = await fetch("/api/doodles/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ portraitCard }),
        });
        if (!response.ok) throw new Error("The PDF preview could not be generated.");
        const previewUrl = URL.createObjectURL(await response.blob());
        window.location.replace(previewUrl);
      } catch (error) {
        document.body.textContent = error instanceof Error
          ? error.message
          : "The PDF preview could not be generated.";
      }
    };
    void generatePreview();
  }, [exportPortraitCard, exportPortraitComposite, historySize, pathname]);

  const validateField = async (field: keyof DoodleFormValues, value: string) => {
    try {
      await doodleFormSchema.validateAt(field, { [field]: value });
      setFieldErrors((current) => ({ ...current, [field]: undefined }));
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        setFieldErrors((current) => ({ ...current, [field]: error.message }));
      }
    }
  };

  const sendDoodle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSendState("sending");
    setSendError("");
    const form = new FormData(formElement);
    const values = getDoodleFormValues(form);

    try {
      await doodleFormSchema.validate(values, { abortEarly: false });
      setFieldErrors({});
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors = getYupFieldErrors(error);
        setFieldErrors(errors);
        setSendError("Please check the highlighted fields.");
        setSendState("idle");
        const firstInvalidField = Object.keys(errors)[0];
        if (firstInvalidField) {
          requestAnimationFrame(() => formElement.querySelector<HTMLElement>(`[name="${firstInvalidField}"]`)?.focus());
        }
        return;
      }
      setSendError("The form could not be validated. Please try again.");
      setSendState("error");
      return;
    }

    if (!turnstileToken) {
      setSendError("Please complete the bot check before sending.");
      setSendState("idle");
      return;
    }

    try {
      const artwork = exportArtwork();
      const composite = await exportPortraitComposite();
      const portraitCard = await exportPortraitCard(composite);
      const strokes = exportStrokes();
      const response = await fetch("/api/doodles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          [DOODLE_HONEYPOT_FIELD]: form.get(DOODLE_HONEYPOT_FIELD),
          issuedAtMs: sendOpenedAtRef.current,
          [DOODLE_TURNSTILE_FIELD]: turnstileToken,
          artwork,
          composite,
          portraitCard,
          strokes,
          page: window.location.href,
        }),
      });
      if (response.status === 413) {
        throw new Error("Your doodle is too large to send. Try a simpler drawing and send again.");
      }

      let result: { error?: string; fieldErrors?: Partial<Record<keyof DoodleFormValues, string>> } = {};
      try {
        result = await response.json();
      } catch {
        throw new Error("The doodle could not be sent. Please try again.");
      }
      if (result.fieldErrors) setFieldErrors(result.fieldErrors);
      if (!response.ok) throw new Error(result.error || "The doodle could not be sent.");
      setSendState("sent");
    } catch (error) {
      window.turnstile?.reset();
      setTurnstileToken("");
      setSendError(error instanceof Error ? error.message : "The doodle could not be sent.");
      setSendState("error");
    }
  };

  const openSend = useCallback(() => {
    sendOpenedAtRef.current = Date.now();
    setTurnstileToken("");
    setSendOpen(true);
    setSendState("idle");
    setSendError("");
    setFieldErrors({});
  }, []);

  const closeSend = useCallback(() => setSendOpen(false), []);

  return {
    sendOpen,
    sendState,
    sendError,
    turnstileToken,
    fieldErrors,
    openSend,
    closeSend,
    sendDoodle,
    validateField,
    clearFieldError: (field: keyof DoodleFormValues) => setFieldErrors((current) => ({ ...current, [field]: undefined })),
    setTurnstileToken,
  };
}
