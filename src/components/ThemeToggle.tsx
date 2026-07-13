"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={mounted && isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="doodle-tool doodle-theme-toggle"
    >
      {/* Render a stable icon until mounted to avoid hydration mismatch */}
      <span className={`theme-toggle-icon ${mounted && !isDark ? "theme-toggle-sun" : "theme-toggle-moon"}`} aria-hidden="true">
        {mounted && !isDark ? (
          <Sun className="h-[18px] w-[18px] animate-[icon-in_.35s_ease-out]" />
        ) : (
          <Moon className="h-[18px] w-[18px] animate-[icon-in_.35s_ease-out]" />
        )}
      </span>
    </button>
  );
}
