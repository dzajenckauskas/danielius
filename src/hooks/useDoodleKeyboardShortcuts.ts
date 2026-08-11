"use client";

import { useEffect } from "react";

type KeyboardShortcutOptions = {
  active: boolean;
  sendOpen: boolean;
  historySize: number;
  closeSend: () => void;
  deactivate: () => void;
  undo: () => void;
};

export function useDoodleKeyboardShortcuts({
  active,
  sendOpen,
  historySize,
  closeSend,
  deactivate,
  undo,
}: KeyboardShortcutOptions) {
  useEffect(() => {
    if (!active) return;
    const handleKeyboardShortcut = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (sendOpen) closeSend();
        else deactivate();
        return;
      }

      const isUndo = (event.metaKey || event.ctrlKey)
        && !event.shiftKey
        && event.key.toLowerCase() === "z";
      if (!isUndo || sendOpen || historySize === 0) return;

      event.preventDefault();
      undo();
    };
    window.addEventListener("keydown", handleKeyboardShortcut);
    return () => window.removeEventListener("keydown", handleKeyboardShortcut);
  }, [active, closeSend, deactivate, historySize, sendOpen, undo]);
}
