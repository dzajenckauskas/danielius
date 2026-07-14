"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowRight, ExternalLink, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { Reveal } from "./Reveal";
import { profile } from "@/data/profile";

function NameLine({ children, offset = 0 }: { children: string; offset?: number }) {
  const animationOrder = [7, 18, 2, 13, 21, 5, 16, 0, 11, 19, 4, 15, 9, 22, 1, 17, 6, 12, 20, 3, 14, 8, 10];
  const animationTypes = ["hop", "tilt", "nudge", "squash"] as const;

  return (
    <span className="hero-name-line" aria-hidden="true">
      {Array.from(children).map((letter, index) => {
        const globalIndex = index + offset;
        const order = animationOrder.indexOf(globalIndex);
        const animationType = animationTypes[(globalIndex * 7 + 3) % animationTypes.length];

        return (
          <span
            className="hero-letter-shell"
            style={{
              animationDelay: `${0.12 + globalIndex * 0.035}s`,
              "--letter-order": order,
              "--letter-delay": `${1.8 + order * 0.5}s`,
            } as React.CSSProperties}
            key={`${letter}-${index}`}
          >
            <span className={`hero-letter hero-letter-${animationType}`}>{letter}</span>
          </span>
        );
      })}
    </span>
  );
}

export function Hero() {
  type ResizeDirection = "top" | "right" | "bottom" | "left" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  const portraitCompositionRef = useRef<HTMLDivElement>(null);
  const resizeStartRef = useRef<{
    pointerX: number;
    pointerY: number;
    width: number;
    height: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
    offsetX: number;
    offsetY: number;
    direction: ResizeDirection;
  } | null>(null);
  const [portraitSize, setPortraitSize] = useState<{
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const [portraitResizeEnabled, setPortraitResizeEnabled] = useState(false);

  useEffect(() => {
    const handleResizeMode = (event: Event) => {
      setPortraitResizeEnabled((event as CustomEvent<{ enabled: boolean }>).detail.enabled);
    };
    window.addEventListener("portrait-resize-mode", handleResizeMode);
    return () => window.removeEventListener("portrait-resize-mode", handleResizeMode);
  }, []);

  const startPortraitResize = (event: React.PointerEvent<HTMLButtonElement>, direction: ResizeDirection) => {
    const composition = portraitCompositionRef.current;
    if (!composition) return;
    const frame = composition.querySelector<HTMLElement>("[data-doodle-portrait]");
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    resizeStartRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      width: rect.width,
      height: rect.height,
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom,
      offsetX: portraitSize?.offsetX ?? 0,
      offsetY: portraitSize?.offsetY ?? 0,
      direction,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const resizePortrait = (event: React.PointerEvent<HTMLButtonElement>) => {
    const start = resizeStartRef.current;
    const composition = portraitCompositionRef.current;
    if (!start || !composition) return;
    const deltaX = event.clientX - start.pointerX;
    const deltaY = event.clientY - start.pointerY;
    const resizingLeft = start.direction.includes("left");
    const resizingRight = start.direction.includes("right");
    const resizingTop = start.direction.includes("top");
    const resizingBottom = start.direction.includes("bottom");
    const maxWidth = resizingLeft
      ? Math.max(260, start.right - 20)
      : resizingRight
        ? Math.max(260, window.innerWidth - start.left - 20)
        : start.width;
    const availableHeight = resizingTop
      ? start.bottom - 20
      : resizingBottom
        ? window.innerHeight - start.top - 20
        : start.height;
    const maxHeight = Math.max(start.height, availableHeight, 340);
    const nextWidth = Math.min(
      maxWidth,
      Math.max(260, start.width + (resizingLeft ? -deltaX : resizingRight ? deltaX : 0)),
    );
    const nextHeight = Math.min(
      maxHeight,
      Math.max(340, start.height + (resizingTop ? -deltaY : resizingBottom ? deltaY : 0)),
    );
    setPortraitSize({
      width: nextWidth,
      height: nextHeight,
      offsetX: resizingLeft
        ? start.offsetX + start.width - nextWidth
        : start.offsetX,
      offsetY: resizingTop
        ? start.offsetY + start.height - nextHeight
        : start.offsetY,
    });
  };

  const finishPortraitResize = () => {
    resizeStartRef.current = null;
  };

  return (
    <section className="hero-editorial">
      <div className="hero-editorial-layout">
        <div className="hero-intro">
          <Reveal>
            <p className="eyebrow">Front-end systems · Product engineering</p>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="sr-only">{profile.name}</h1>
            <div className="hero-name" aria-hidden="true" data-thread-anchor data-thread-x="310">
              <NameLine>DANIELIUS</NameLine>
              <NameLine offset={9}>ZAJENČKAUSKAS</NameLine>
            </div>
          </Reveal>

          <Reveal delay={0.13}>
            <p className="hero-intro-copy">{profile.tagline}</p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="hero-actions">
              <Link href="/projects" className="primary-button group">
                Explore selected work
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="/api/resume"
                target="_blank"
                rel="noreferrer noopener"
                className="secondary-button"
              >
                <ExternalLink className="h-4 w-4" />
                View CV
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.26}>
            <div className="hero-intro-footer">
              <span className="hero-availability-dot" aria-hidden="true" />
              <span>{profile.availability}</span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="hero-portrait-wrap">
          <div className="hero-portrait-stage" data-thread-anchor data-thread-x="490">
            <div
              ref={portraitCompositionRef}
              className="hero-photo-composition"
              data-doodle-control-anchor
              style={portraitSize ? {
                "--hero-portrait-user-width": `${portraitSize.width}px`,
                "--hero-portrait-user-height": `${portraitSize.height}px`,
                "--hero-portrait-user-x": `${portraitSize.offsetX}px`,
                "--hero-portrait-user-y": `${portraitSize.offsetY}px`,
              } as React.CSSProperties : undefined}
            >
              <span aria-hidden className="hero-photo-blob hero-photo-blob-back" />
              <span aria-hidden className="hero-photo-blob hero-photo-blob-side" />
              <span aria-hidden className="hero-photo-blob hero-photo-blob-back-accent" />
              <div className="hero-portrait-frame" data-doodle-portrait>
                <Image
                  src="/avatar.png"
                  // src="/avatar.jpg"
                  alt={profile.name}
                  width={720}
                  height={820}
                  priority
                  sizes="(max-width: 900px) 100vw, 44vw"
                  style={{ filter: "var(--photo-filter)" }}
                />
              </div>
              {portraitResizeEnabled && (
                <div className="hero-portrait-resize-edges" aria-label="Portrait resize controls">
                  {(["top", "right", "bottom", "left", "top-left", "top-right", "bottom-left", "bottom-right"] as ResizeDirection[]).map((direction) => (
                    <button
                      key={direction}
                      type="button"
                      className={`hero-portrait-resize-edge is-${direction}`}
                      aria-label={`Resize portrait from ${direction.replace("-", " ")}`}
                      onPointerDown={(event) => startPortraitResize(event, direction)}
                      onPointerMove={resizePortrait}
                      onPointerUp={finishPortraitResize}
                      onPointerCancel={finishPortraitResize}
                      onDoubleClick={() => setPortraitSize(null)}
                    />
                  ))}
                </div>
              )}
              <span aria-hidden className="hero-photo-blob hero-photo-blob-front-accent" />
            </div>

            <div className="hero-portrait-footer">
              <div className="hero-portrait-caption">
                <p><MapPin aria-hidden="true" />{profile.location.toUpperCase()}</p>
              </div>
              <div className="hero-socials" aria-label="Profile links">
                <a href={profile.github} target="_blank" rel="noreferrer noopener" aria-label="GitHub">
                  <Github aria-hidden="true" />
                </a>
                <a href={profile.linkedin} target="_blank" rel="noreferrer noopener" aria-label="LinkedIn">
                  <Linkedin aria-hidden="true" />
                </a>
                <a href={`mailto:${profile.email}`} aria-label="Email">
                  <Mail aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <a className="hero-scroll-cue" href="#selected-work">
        Scroll through the work
        <ArrowDownRight aria-hidden="true" />
      </a>
    </section>
  );
}
