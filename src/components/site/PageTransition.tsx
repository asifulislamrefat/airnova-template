import { useEffect, useRef } from "react";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);
if (!CustomEase.get("osmo")) {
  CustomEase.create("osmo", "0.625, 0.05, 0, 1");
}

const COLUMNS = 5;
const COVER_DURATION = 0.6;
const STAGGER = 0.06;
// Total time to fully cover the screen: duration + (COLUMNS-1)*stagger
const COVER_MS = (COVER_DURATION + (COLUMNS - 1) * STAGGER) * 1000;

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function PageTransition() {
  const router = useRouter();
  const location = useRouterState({ select: (s) => s.location.pathname });
  const columnsRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);
  const isFirstRender = useRef(true);

  // Intercept internal link clicks: cover, then navigate.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = (e.target as HTMLElement | null)?.closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      if (target.target && target.target !== "_self") return;
      if (target.hasAttribute("download")) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      const path = url.pathname + url.search + url.hash;
      if (url.pathname === window.location.pathname) return;
      if (isAnimatingRef.current) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      isAnimatingRef.current = true;

      const columns = columnsRef.current?.querySelectorAll<HTMLElement>("[data-transition-column]");
      if (!columns || prefersReducedMotion()) {
        router.navigate({ to: path });
        isAnimatingRef.current = false;
        return;
      }

      gsap.fromTo(
        columns,
        { yPercent: 0 },
        {
          yPercent: 100,
          duration: COVER_DURATION,
          stagger: { each: STAGGER, from: "end" },
          ease: "osmo",
          onComplete: () => {
            router.navigate({ to: path });
          },
        },
      );
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);

  // After route change, run reveal animation.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      // Make sure columns are off-screen on initial mount.
      const columns = columnsRef.current?.querySelectorAll<HTMLElement>("[data-transition-column]");
      if (columns) gsap.set(columns, { yPercent: -100 });
      return;
    }
    const columns = columnsRef.current?.querySelectorAll<HTMLElement>("[data-transition-column]");
    if (!columns) return;

    window.scrollTo(0, 0);

    if (prefersReducedMotion()) {
      gsap.set(columns, { yPercent: -100 });
      isAnimatingRef.current = false;
      return;
    }

    gsap.to(columns, {
      yPercent: 200,
      duration: COVER_DURATION,
      stagger: STAGGER,
      ease: "osmo",
      overwrite: "auto",
      onComplete: () => {
        // Reset columns above the viewport for the next transition.
        gsap.set(columns, { yPercent: -100 });
        isAnimatingRef.current = false;
      },
    });
  }, [location]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] overflow-clip"
    >
      <div ref={columnsRef} className="absolute inset-0 flex h-full w-full">
        {Array.from({ length: COLUMNS }).map((_, i) => (
          <div
            key={i}
            data-transition-column
            className="relative h-full w-full bg-[#676a6a]"
            style={{ transform: "translateY(-100%)" }}
          />
        ))}
      </div>
      <div className="absolute inset-0 flex h-full w-full opacity-10">
        {Array.from({ length: COLUMNS }).map((_, i) => (
          <div
            key={i}
            className={`h-full w-full ${i < COLUMNS - 1 ? "border-r border-white" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}

export const PAGE_TRANSITION_COVER_MS = COVER_MS;