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
  const [progress, setProgress] = useState(0);
  const [reduceMotion] = useState(prefersReducedMotion);

  useEffect(() => {
    const minimumTimer = window.setTimeout(() => setMinimumElapsed(true), MINIMUM_DURATION);
    const progressTimer = window.setInterval(() => {
      setProgress((current) => Math.min(current + 2, 96));
    }, 50);

    return () => {
      window.clearTimeout(minimumTimer);
      window.clearInterval(progressTimer);
    };
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

    setProgress(100);
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
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[22rem] w-[52rem] max-w-[140vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(130,95,209,0.35),rgba(55,136,158,0.14)_40%,transparent_72%)] blur-3xl"
        data-testid="loading-orb"
      />
      {!reduceMotion ? (
        <Strands
          className="absolute left-1/2 top-1/2 h-[21rem] w-[58rem] max-w-[150vw] -translate-x-1/2 -translate-y-1/2 opacity-95"
          colors={STRAND_COLORS}
          count={3}
          speed={0.48}
          amplitude={1.05}
          waviness={1.1}
          thickness={0.72}
          glow={2.4}
        />
      ) : null}
      <div
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-4"
        data-testid="loading-content"
      >
        <span className="h-px w-16 bg-gradient-to-r from-transparent via-[#D3A84C] to-transparent" />
        <p className="font-mono text-xs font-semibold tracking-[0.38em] text-white/90 sm:text-sm">
          LOADING······
        </p>
        <div
          aria-label="加载进度"
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={progress}
          className="h-1 w-40 overflow-hidden rounded-full bg-white/15 sm:w-52"
          role="progressbar"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#D3A84C] via-[#9B7BFF] to-[#4AA7B8] transition-[width] duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="h-px w-16 bg-gradient-to-r from-transparent via-[#4AA7B8] to-transparent" />
      </div>
    </section>
  );
}
