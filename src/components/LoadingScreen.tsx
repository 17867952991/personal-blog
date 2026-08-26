import { useEffect, useState } from "react";
import { Strands } from "./Strands";

const MINIMUM_DURATION = 2500;
const EXIT_DURATION = 500;
const STRAND_COLORS = ["#D3A84C", "#9B7BFF", "#4AA7B8"];

type LoadingPhase = "loading" | "exiting" | "done";

function prefersReducedMotion() {
  return typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function LoadingScreen() {
  const [phase, setPhase] = useState<LoadingPhase>("loading");
  const [minimumElapsed, setMinimumElapsed] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(() => document.readyState === "complete");
  const [reduceMotion] = useState(prefersReducedMotion);

  useEffect(() => {
    const minimumTimer = window.setTimeout(() => setMinimumElapsed(true), MINIMUM_DURATION);

    return () => window.clearTimeout(minimumTimer);
  }, []);

  useEffect(() => {
    if (pageLoaded) return;

    const completeLoading = () => setPageLoaded(true);
    window.addEventListener("load", completeLoading, { once: true });

    return () => {
      window.removeEventListener("load", completeLoading);
    };
  }, [pageLoaded]);

  useEffect(() => {
    if (!pageLoaded || !minimumElapsed) return;

    setPhase("exiting");
    const exitTimer = window.setTimeout(() => setPhase("done"), EXIT_DURATION);

    return () => window.clearTimeout(exitTimer);
  }, [minimumElapsed, pageLoaded]);

  if (phase === "done") return null;

  return (
    <section
      aria-live="polite"
      className={`fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[#090812] transition-all duration-500 ${
        phase === "exiting" ? "pointer-events-none scale-[1.03] opacity-0" : "opacity-100"
      }`}
      data-state={phase}
      data-testid="loading-screen"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(100,72,158,0.22),transparent_48%)]" />
      {!reduceMotion ? (
        <Strands
          className="absolute inset-0 opacity-95"
          colors={STRAND_COLORS}
          count={3}
          speed={0.48}
          amplitude={1.05}
          waviness={1.1}
          thickness={0.72}
          glow={2.4}
        />
      ) : null}
      <div className="relative flex flex-col items-center gap-4">
        <span className="h-px w-16 bg-gradient-to-r from-transparent via-[#D3A84C] to-transparent" />
        <p className="font-mono text-xs font-semibold tracking-[0.38em] text-white/90 sm:text-sm">
          LOADING······
        </p>
        <span className="h-px w-16 bg-gradient-to-r from-transparent via-[#4AA7B8] to-transparent" />
      </div>
    </section>
  );
}
