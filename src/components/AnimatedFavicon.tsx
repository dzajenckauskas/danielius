"use client";

import { useEffect } from "react";

const FRAMES = [
  { y: 0, scaleX: 1, scaleY: 1 },
  { y: 3, scaleX: 1.2, scaleY: 0.78 },
  { y: -2, scaleX: 0.95, scaleY: 0.98 },
  { y: -7, scaleX: 0.82, scaleY: 0.86 },
  { y: -12, scaleX: 0.64, scaleY: 0.64 },
  { y: -7, scaleX: 0.82, scaleY: 0.86 },
  { y: -2, scaleX: 0.95, scaleY: 0.98 },
  { y: 3, scaleX: 1.22, scaleY: 0.76 },
  { y: 0, scaleX: 1.04, scaleY: 0.96 },
  { y: 0, scaleX: 1, scaleY: 1 },
  { y: 1, scaleX: 1.08, scaleY: 0.92 },
  { y: -1, scaleX: 0.98, scaleY: 1.02 },
  { y: -4, scaleX: 0.92, scaleY: 0.94 },
  { y: -1, scaleX: 0.98, scaleY: 1.02 },
  { y: 1, scaleX: 1.1, scaleY: 0.9 },
] as const;
const HIGH_BOUNCE_ORDER = [0, 1, 1, 2, 3, 4, 5, 6, 7, 7, 8, 9];
const LOW_BOUNCE_ORDER = [0, 10, 11, 12, 13, 14, 9];

const WORKER_SOURCE = `
  const animations = {
    high: {
      frames: ${JSON.stringify(HIGH_BOUNCE_ORDER)},
      frameDuration: 90,
      minGap: 700,
      gapRange: 700,
    },
    low: {
      frames: ${JSON.stringify(LOW_BOUNCE_ORDER)},
      frameDuration: 85,
      minGap: 5000,
      gapRange: 3000,
    },
  };
  let running = false;
  let mode = "high";
  let timer;

  function stop() {
    running = false;
    clearTimeout(timer);
  }

  function bounce(step = 0) {
    if (!running) return;
    const animation = animations[mode];
    postMessage({ mode, frameIndex: animation.frames[step] });

    if (step < animation.frames.length - 1) {
      timer = setTimeout(() => bounce(step + 1), animation.frameDuration);
    } else {
      timer = setTimeout(
        () => bounce(0),
        animation.minGap + Math.random() * animation.gapRange,
      );
    }
  }

  onmessage = ({ data }) => {
    if (data === "start-high" || data === "start-low") {
      stop();
      mode = data === "start-high" ? "high" : "low";
      running = true;
      bounce();
    } else if (data === "stop") {
      stop();
    }
  };
`;

export function AnimatedFavicon() {
  useEffect(() => {
    // The favicon animation is pure decoration — spinning up the Web Worker,
    // fetching the SVG and building the blob-URL frames during the load window
    // would compete with hydration and inflate Total Blocking Time. Defer the
    // whole setup to idle time so it never touches the critical path.
    let cleanup: (() => void) | undefined;
    let idleId: number | undefined;
    const win = window as typeof window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const start = () => {
      idleId = undefined;
      cleanup = setup();
    };
    if (typeof win.requestIdleCallback === "function") {
      idleId = win.requestIdleCallback(start, { timeout: 2000 });
    } else {
      idleId = window.setTimeout(start, 1200);
    }

    return () => {
      if (idleId !== undefined) {
        if (typeof win.cancelIdleCallback === "function") win.cancelIdleCallback(idleId);
        else window.clearTimeout(idleId);
      }
      cleanup?.();
    };

    function setup() {
    const darkMode = window.matchMedia("(prefers-color-scheme: dark)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Take over from the server-rendered SVG favicon links. Recent Chrome
    // versions prefer a media-matched static <link rel="icon"> over a
    // dynamically-updated one, which silently ignores our per-frame href swaps
    // (the animation appears dead). These links are part of React's own head
    // metadata tree (via the Metadata API), so detaching them from the DOM
    // directly (e.g. .remove()) desyncs React's fiber from the real DOM: the
    // next client-side navigation that reconciles the head — any route change,
    // since each page's title differs — throws "Cannot read properties of
    // null (reading 'removeChild')" trying to remove a node whose parent is
    // already gone, silently aborting that navigation's commit. Neutralising
    // them with a non-matching `media` instead keeps the nodes in place for
    // React while still losing the browser's tab-icon tie-break.
    const staticIcons = Array.from(
      document.querySelectorAll<HTMLLinkElement>(
        'link[rel~="icon"][type="image/svg+xml"]:not([data-animated-favicon])',
      ),
    );
    const staticIconMedia = staticIcons.map((link) => link.media);
    staticIcons.forEach((link) => { link.media = "not all"; });

    function createIconLink() {
      const link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/svg+xml";
      link.dataset.animatedFavicon = "true";
      return link;
    }

    let icon = createIconLink();
    document.head.appendChild(icon);

    // Some Chromium versions stop repainting the tab icon once a <link> has
    // already been painted, even though its href keeps changing — mutating
    // icon.href in place silently goes nowhere. Swapping in a brand-new
    // <link> element per frame instead of mutating the existing one forces
    // the repaint reliably.
    function setIconHref(href: string) {
      const next = createIconLink();
      next.href = href;
      document.head.appendChild(next);
      icon.remove();
      icon = next;
    }

    let generation = 0;
    let frameUrls: string[] = [];
    let returnTimer: number | undefined;
    const workerUrl = URL.createObjectURL(
      new Blob([WORKER_SOURCE], { type: "text/javascript" }),
    );
    const animationWorker = new Worker(workerUrl);

    animationWorker.onmessage = ({
      data,
    }: MessageEvent<{ mode: "high" | "low"; frameIndex: number }>) => {
      const expectedMode = document.hidden ? "high" : "low";
      if (data.mode !== expectedMode || reducedMotion.matches) return;
      if (frameUrls[data.frameIndex]) setIconHref(frameUrls[data.frameIndex]);
    };

    function cancelReturnBounce() {
      if (returnTimer !== undefined) window.clearTimeout(returnTimer);
      returnTimer = undefined;
    }

    function revokeFrames() {
      frameUrls.forEach((url) => URL.revokeObjectURL(url));
      frameUrls = [];
    }

    function updateAnimation() {
      const shouldAnimate = !reducedMotion.matches && frameUrls.length > 0;
      const mode = document.hidden ? "start-high" : "start-low";
      animationWorker.postMessage(shouldAnimate ? mode : "stop");
      if (!shouldAnimate && frameUrls[0]) setIconHref(frameUrls[0]);
    }

    function playReturnBounce(step = 0) {
      cancelReturnBounce();
      animationWorker.postMessage("stop");

      if (reducedMotion.matches || !frameUrls.length) {
        if (frameUrls[0]) setIconHref(frameUrls[0]);
        return;
      }

      const frameIndex = HIGH_BOUNCE_ORDER[step];
      if (frameUrls[frameIndex]) setIconHref(frameUrls[frameIndex]);

      if (step < HIGH_BOUNCE_ORDER.length - 1) {
        returnTimer = window.setTimeout(() => playReturnBounce(step + 1), 90);
      } else {
        returnTimer = undefined;
        animationWorker.postMessage("start-low");
      }
    }

    async function loadTheme() {
      const currentGeneration = ++generation;
      animationWorker.postMessage("stop");
      const theme = darkMode.matches ? "dark" : "light";
      try {
        const response = await fetch(`/favicon-${theme}.svg?v=6`);
        if (!response.ok) return;
        const source = await response.text();
        if (currentGeneration !== generation) return;
        revokeFrames();
        frameUrls = FRAMES.map(({ y, scaleX, scaleY }) => {
          const transform = [
            "translate(32 30)",
            `translate(0 ${y})`,
            `scale(${scaleX} ${scaleY})`,
            "translate(-32 -30)",
          ].join(" ");
          const frame = source.replace(
            '<g id="favicon-ball">',
            `<g id="favicon-ball" transform="${transform}">`,
          );
          return URL.createObjectURL(new Blob([frame], { type: "image/svg+xml" }));
        });
        setIconHref(frameUrls[0]);
        updateAnimation();
      } catch {
        setIconHref(`/favicon-${theme}.svg?v=6`);
      }
    }

    function handleVisibility() {
      cancelReturnBounce();
      if (document.hidden) updateAnimation();
      else playReturnBounce();
    }

    function handleReducedMotion() {
      updateAnimation();
    }

    void loadTheme();
    darkMode.addEventListener("change", loadTheme);
    reducedMotion.addEventListener("change", handleReducedMotion);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      generation += 1;
      cancelReturnBounce();
      animationWorker.terminate();
      URL.revokeObjectURL(workerUrl);
      revokeFrames();
      icon.remove();
      staticIcons.forEach((link, index) => { link.media = staticIconMedia[index]; });
      darkMode.removeEventListener("change", loadTheme);
      reducedMotion.removeEventListener("change", handleReducedMotion);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
    }
  }, []);

  return null;
}
