"use client";

import { useCallback, type RefObject } from "react";
import { drawAction, type DrawingAction } from "@/lib/doodle-canvas";
import { getArtworkBounds } from "@/lib/doodle-export";
import { normalizeStrokes, PORTRAIT_IMAGE_ASPECT } from "@/lib/doodle-strokes";

const PORTRAIT_SELECTOR = "[data-doodle-portrait]";
const PHOTO_EXPORT_QUALITY = 0.88;

export function useDoodleExport(actionsRef: RefObject<DrawingAction[]>) {
  const exportArtwork = useCallback(() => {
    const actions = actionsRef.current;
    const bounds = getArtworkBounds(actions);
    if (!bounds) return "";

    const scale = Math.min(1, 1600 / bounds.width, 2400 / bounds.height);
    const output = document.createElement("canvas");
    output.width = Math.max(1, Math.round(bounds.width * scale));
    output.height = Math.max(1, Math.round(bounds.height * scale));
    const context = output.getContext("2d");
    if (!context) return "";
    context.scale(scale, scale);
    context.translate(40 - bounds.minX, 40 - bounds.minY);
    actions.forEach((action) => drawAction(context, action));
    return output.toDataURL("image/png");
  }, [actionsRef]);

  const exportStrokes = useCallback(() => {
    const frame = document.querySelector<HTMLElement>(PORTRAIT_SELECTOR);
    if (!frame || !actionsRef.current.length) return [];
    const rect = frame.getBoundingClientRect();
    return normalizeStrokes(actionsRef.current, {
      pageLeft: rect.left + window.scrollX,
      pageTop: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height,
    });
  }, [actionsRef]);

  const exportPortraitComposite = useCallback(async () => {
    const frame = document.querySelector<HTMLElement>(PORTRAIT_SELECTOR);
    const image = frame?.querySelector<HTMLImageElement>("img");
    if (!frame || !image) return "";
    if (!image.complete) await image.decode();

    const rect = frame.getBoundingClientRect();
    const scale = Math.min(3, Math.max(2, window.devicePixelRatio || 1));
    const output = document.createElement("canvas");
    output.width = Math.max(1, Math.round(rect.width * scale));
    output.height = Math.max(1, Math.round(rect.height * scale));
    const context = output.getContext("2d");
    if (!context || !image.naturalWidth || !image.naturalHeight) return "";

    context.scale(scale, scale);
    const imageScale = Math.max(rect.width / image.naturalWidth, rect.height / image.naturalHeight);
    const imageWidth = image.naturalWidth * imageScale;
    const imageHeight = image.naturalHeight * imageScale;
    const imageX = (rect.width - imageWidth) * 0.5;
    const imageY = (rect.height - imageHeight) * 0.38;
    context.drawImage(image, imageX, imageY, imageWidth, imageHeight);
    context.save();
    context.beginPath();
    context.rect(0, 0, rect.width, rect.height);
    context.clip();
    context.translate(-(rect.left + window.scrollX), -(rect.top + window.scrollY));
    actionsRef.current.forEach((action) => drawAction(context, action));
    context.restore();

    context.save();
    context.fillStyle = "#3d5b57";
    context.font = `300 ${Math.max(11, Math.round(rect.width * 0.02))}px 'Geist Mono', monospace`;
    context.textAlign = "right";
    context.textBaseline = "middle";
    context.fillText("zajenckauskas.lt ↗", rect.width - rect.width * 0.035, rect.height - rect.width * 0.045);
    context.restore();

    return output.toDataURL("image/jpeg", PHOTO_EXPORT_QUALITY);
  }, [actionsRef]);

  const exportPortraitCard = useCallback(async (composite: string) => {
    if (!composite) return "";
    await document.fonts.ready;
    const portrait = new window.Image();
    portrait.src = composite;
    await portrait.decode();

    const aspect = portrait.naturalWidth && portrait.naturalHeight
      ? portrait.naturalWidth / portrait.naturalHeight
      : PORTRAIT_IMAGE_ASPECT;
    const output = document.createElement("canvas");
    output.width = 1000;
    output.height = Math.round(1000 / aspect);
    const context = output.getContext("2d");
    if (!context) return "";
    const width = output.width;
    const height = output.height;
    const blobRgba = (color: string, alpha: number) => {
      const hex = Number.parseInt(color.slice(1), 16);
      return `rgba(${(hex >> 16) & 255}, ${(hex >> 8) & 255}, ${hex & 255}, ${alpha})`;
    };
    const drawSoftBlob = (
      x: number,
      y: number,
      blobWidth: number,
      blobHeight: number,
      color: string,
      blur: number,
      alpha: number,
      rotation = 0,
      core = 0,
    ) => {
      const halfWidth = blobWidth / 2;
      const halfHeight = blobHeight / 2;
      const radius = halfWidth * (1.06 + blur / 260);
      context.save();
      context.translate(x + halfWidth, y + halfHeight);
      context.rotate(rotation);
      context.scale(1, halfHeight / halfWidth);
      const gradient = context.createRadialGradient(0, 0, 0, 0, 0, radius);
      gradient.addColorStop(0, blobRgba(color, alpha));
      gradient.addColorStop(core, blobRgba(color, alpha));
      gradient.addColorStop(core + (1 - core) * 0.55, blobRgba(color, alpha * 0.5));
      gradient.addColorStop(1, blobRgba(color, 0));
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(0, 0, radius, 0, Math.PI * 2);
      context.fill();
      context.restore();
    };

    context.fillStyle = "#faf9f6";
    context.fillRect(0, 0, width, height);
    context.drawImage(portrait, 0, 0, width, height);
    drawSoftBlob(-0.19 * width, 0.29 * height, 0.50 * width, 0.52 * height, "#b59bd7", 2, 0.66, 0.16, 0.6);
    drawSoftBlob(-0.02 * width, 0.82 * height, 0.5 * width, 0.26 * height, "#8fbccc", 40, 0.26, -0.13);
    drawSoftBlob(0.84 * width, 0.06 * height, 0.26 * width, 0.17 * height, "#d891aa", 14, 0.42, -0.3);

    const ochreWidth = 0.11 * width;
    const ochreHeight = 0.1 * height;
    const ochreX = 0.29 * width - 15;
    const ochreY = 0.92 * height + 20;
    context.save();
    context.translate(ochreX + ochreWidth / 2, ochreY + ochreHeight / 2);
    context.rotate(0.2);
    context.globalAlpha = 0.85;
    context.fillStyle = "#d2ae6c";
    context.beginPath();
    context.roundRect(-ochreWidth / 2, -ochreHeight / 2, ochreWidth, ochreHeight, [
      ochreWidth * 0.5,
      ochreWidth * 0.3,
      ochreWidth * 0.5,
      ochreWidth * 0.3,
    ]);
    context.fill();
    context.restore();

    context.save();
    context.strokeStyle = "#8a938f";
    context.globalAlpha = 0.55;
    context.lineWidth = Math.max(1.2, width * 0.0018);
    context.setLineDash([width * 0.016, width * 0.016]);
    context.beginPath();
    context.moveTo(width * 0.52, height * 0.015);
    context.lineTo(width * 0.505, height * 0.985);
    context.stroke();
    context.restore();

    return output.toDataURL("image/jpeg", PHOTO_EXPORT_QUALITY);
  }, []);

  return { exportArtwork, exportStrokes, exportPortraitComposite, exportPortraitCard };
}
