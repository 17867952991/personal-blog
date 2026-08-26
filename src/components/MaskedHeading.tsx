import { gsap } from "gsap";
import { type CSSProperties, type ElementType, useCallback, useEffect, useId, useMemo, useRef } from "react";
import "./MaskedHeading.css";

type MaskedHeadingProps = {
  text: string;
  src: string;
  mediaType?: "image" | "video";
  poster?: string;
  tag?: ElementType;
  fillScale?: number;
  parallax?: number;
  drift?: number;
  reveal?: "rise" | "wipe" | "fade" | "none";
  duration?: number;
  align?: "left" | "center" | "right";
  className?: string;
  style?: CSSProperties;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function MaskedHeading({
  text,
  src,
  mediaType = "image",
  poster = "",
  tag: Tag = "h1",
  fillScale = 1.28,
  parallax = 16,
  drift = 8,
  reveal = "rise",
  duration = 1.05,
  align = "center",
  className = "",
  style
}: MaskedHeadingProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const mediaRef = useRef<HTMLSpanElement | null>(null);
  const revealRef = useRef<HTMLSpanElement | null>(null);
  const wordRef = useRef<HTMLSpanElement | null>(null);
  const glyphRef = useRef<SVGTextElement | null>(null);
  const offset = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const clipId = `masked-heading-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  const syncGlyph = useCallback(() => {
    const root = rootRef.current;
    const measure = measureRef.current;
    const word = wordRef.current;
    const glyph = glyphRef.current;
    if (!root || !measure || !word || !glyph) return;

    const computed = window.getComputedStyle(measure);
    glyph.setAttribute("x", String(word.offsetLeft));
    glyph.setAttribute("y", String(word.offsetTop + word.offsetHeight * 0.8));
    glyph.style.fontFamily = computed.fontFamily;
    glyph.style.fontSize = computed.fontSize;
    glyph.style.fontWeight = computed.fontWeight;
    glyph.style.letterSpacing = computed.letterSpacing;
  }, []);

  const placeMedia = useCallback(() => {
    const root = rootRef.current;
    const media = mediaRef.current;
    if (!root || !media) return;

    const maxX = ((fillScale - 1) / 2) * root.clientWidth;
    const maxY = ((fillScale - 1) / 2) * root.clientHeight;
    const current = offset.current;
    media.style.transform = `translate3d(${clamp(current.x, -maxX, maxX).toFixed(2)}px, ${clamp(current.y, -maxY, maxY).toFixed(2)}px, 0) scale(${fillScale})`;
  }, [fillScale]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    syncGlyph();
    const observer = new ResizeObserver(() => {
      syncGlyph();
      placeMedia();
    });
    observer.observe(root);
    document.fonts?.ready?.then(syncGlyph).catch(() => undefined);

    let frame = 0;
    let previous = performance.now();
    let clock = 0;
    const animateMedia = (now: number) => {
      const delta = Math.min(0.05, (now - previous) / 1000);
      previous = now;
      clock += delta;
      const current = offset.current;
      const ease = 1 - Math.exp(-delta / 0.18);
      current.x += (current.targetX + Math.sin(clock * 0.21) * drift - current.x) * ease;
      current.y += (current.targetY + Math.cos(clock * 0.17) * drift * 0.6 - current.y) * ease;
      placeMedia();
      frame = window.requestAnimationFrame(animateMedia);
    };
    const handlePointerMove = (event: PointerEvent) => {
      const bounds = root.getBoundingClientRect();
      offset.current.targetX = clamp(((event.clientX - bounds.left) / (bounds.width || 1)) * 2 - 1, -1, 1) * -parallax;
      offset.current.targetY = clamp(((event.clientY - bounds.top) / (bounds.height || 1)) * 2 - 1, -1, 1) * -parallax;
    };
    const resetPointer = () => {
      offset.current.targetX = 0;
      offset.current.targetY = 0;
    };

    root.addEventListener("pointermove", handlePointerMove);
    root.addEventListener("pointerleave", resetPointer);
    frame = window.requestAnimationFrame(animateMedia);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      root.removeEventListener("pointermove", handlePointerMove);
      root.removeEventListener("pointerleave", resetPointer);
    };
  }, [drift, parallax, placeMedia, syncGlyph]);

  useEffect(() => {
    const layer = revealRef.current;
    const glyph = glyphRef.current;
    const reduceMotion = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!layer || !glyph || reveal === "none" || reduceMotion) return;

    if (reveal === "wipe") {
      const tween = gsap.fromTo(layer, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration, ease: "power3.inOut" });
      return () => {
        tween.kill();
      };
    }

    if (reveal === "fade") {
      const tween = gsap.fromTo(layer, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration, ease: "power3.out" });
      return () => {
        tween.kill();
      };
    }

    const tween = gsap.fromTo(glyph, { y: "1.05em" }, { y: 0, duration, ease: "power4.out" });
    return () => {
        tween.kill();
      };
  }, [duration, reveal]);

  return (
    <Tag
      aria-label={text}
      className={`masked-heading ${className}`.trim()}
      data-testid="masked-heading"
      ref={rootRef}
      style={{ textAlign: align, ...style }}
    >
      <span className="masked-heading__measure" ref={measureRef}>
        <span className="masked-heading__word" ref={wordRef}>{words.join(" ")}</span>
      </span>
      <svg aria-hidden="true" className="masked-heading__defs" focusable="false">
        <defs>
          <clipPath clipPathUnits="userSpaceOnUse" id={clipId}>
            <text ref={glyphRef}>{words.join(" ")}</text>
          </clipPath>
        </defs>
      </svg>
      <span className="masked-heading__reveal" ref={revealRef}>
        <span className="masked-heading__clip" style={{ clipPath: `url(#${clipId})` }}>
          <span className="masked-heading__media" ref={mediaRef}>
            {mediaType === "video" ? (
              <video autoPlay className="masked-heading__source" loop muted playsInline poster={poster} src={src} />
            ) : (
              <img alt="" className="masked-heading__source" draggable={false} src={src} />
            )}
          </span>
        </span>
      </span>
    </Tag>
  );
}
