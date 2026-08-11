"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type DoodleStudioPlacement = {
  left: number;
  top: number;
  width: number;
  ready: boolean;
};

export function useDoodleStudioPlacement(
  active: boolean,
  pathname: string,
  doodleAnchor: HTMLElement | null,
) {
  const studioWidthRef = useRef(320);
  const studioWidthCapturedRef = useRef(false);
  const [placement, setPlacement] = useState<DoodleStudioPlacement>({
    left: 0,
    top: 0,
    width: 320,
    ready: false,
  });

  useEffect(() => {
    if (pathname !== "/") studioWidthCapturedRef.current = false;
  }, [pathname]);

  useEffect(() => {
    if (!active || !doodleAnchor) return;

    const updatePlacement = () => {
      const portrait = doodleAnchor.getBoundingClientRect();
      const studioWidth = Math.min(studioWidthRef.current, window.innerWidth - 24);

      setPlacement({
        left: Math.min(
          window.innerWidth - studioWidth - 12,
          Math.max(12, portrait.left),
        ) + window.scrollX,
        top: portrait.bottom + window.scrollY + 12,
        width: studioWidth,
        ready: true,
      });
    };

    updatePlacement();
    const observer = new ResizeObserver(updatePlacement);
    observer.observe(doodleAnchor);
    window.addEventListener("resize", updatePlacement);
    window.addEventListener("portrait-geometry-change", updatePlacement);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updatePlacement);
      window.removeEventListener("portrait-geometry-change", updatePlacement);
    };
  }, [active, doodleAnchor]);

  const prepareToOpen = useCallback(() => {
    if (!doodleAnchor) return false;
    if (!studioWidthCapturedRef.current) {
      studioWidthRef.current = Math.min(
        doodleAnchor.getBoundingClientRect().width,
        window.innerWidth - 24,
      );
      studioWidthCapturedRef.current = true;
    }
    setPlacement((current) => ({ ...current, ready: false }));
    return true;
  }, [doodleAnchor]);

  return { placement, prepareToOpen };
}
