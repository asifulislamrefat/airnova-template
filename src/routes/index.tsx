import { createFileRoute, Link } from "@tanstack/react-router";
import { PROJECTS } from "@/lib/projects";
import { useEffect, useRef, useState, lazy, Suspense, type CSSProperties } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  Plus,
  Minus,
  ChevronDown,
  Star,
  Play,
  Sparkles,
  Palette,
  Lightbulb,
  PenTool,
  Gift,
  AppWindow,
} from "lucide-react";
import { X, Save } from "lucide-react";
import hero1 from "@/assets/hero-1.webp.asset.json";
import hero2 from "@/assets/hero-2.webp.asset.json";
import hero3 from "@/assets/hero-3.webp.asset.json";
// Vite turns the woff2 into a hashed URL string at build time. Lets us preload
// the exact file the @font-face block in src/fonts.css will request.
import interLatinWoff2 from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url";
import loraLatin500Italic from "@fontsource/lora/files/lora-latin-500-italic.woff2?url";
import benefits1 from "@/assets/benefits-1.webp.asset.json";
import showreelThumb from "@/assets/showreel-thumb.webp.asset.json";
import project1 from "@/assets/project-1.webp.asset.json";
import project2 from "@/assets/project-2.webp.asset.json";
import project3 from "@/assets/project-3.webp.asset.json";
import project4 from "@/assets/project-4.webp.asset.json";
import michaelAvatar from "@/assets/michael.png.asset.json";
import airnova1 from "@/assets/airnova-1.png.asset.json";
import solutionThumb from "@/assets/solution-thumb.webp.asset.json";
import avatar10 from "@/assets/avatar-10.png.asset.json";
import avatar11 from "@/assets/avatar-11.png.asset.json";
import avatar12 from "@/assets/avatar-12.png.asset.json";
import avatar13 from "@/assets/avatar-13.png.asset.json";
import brandLogo1 from "@/assets/brand-logo-1.png.asset.json";
import brandLogo2 from "@/assets/brand-logo-2.png.asset.json";
import brandLogo3 from "@/assets/brand-logo-3.png.asset.json";
import brandLogo4 from "@/assets/brand-logo-4.png.asset.json";
import brandLogo5 from "@/assets/brand-logo-5.png.asset.json";
import brandLogo6 from "@/assets/brand-logo-6.png.asset.json";
import { serif, BrandMark, Logo, Pill } from "@/components/site/shared";
import { Nav } from "@/components/site/Nav";
import { Cta } from "@/components/site/Cta";

// Below-the-fold sections — lazy-loaded to keep the main bundle lean.
// Suspense streams SSR markup; the client chunks load after hydration.
const Footer = lazy(() => import("@/components/site/Footer").then((m) => ({ default: m.Footer })));
const Testimonials = lazy(() =>
  import("@/components/site/Testimonials").then((m) => ({ default: m.Testimonials })),
);
const Faq = lazy(() => import("@/components/site/HomeFaq"));
// Showreel video player only mounts when the user clicks Play.
const CustomVideoPlayer = lazy(() => import("@/components/site/CustomVideoPlayer"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Airnova — Creative designer & digital experience" },
      {
        name: "description",
        content:
          "Airnova is a creative design studio crafting modern, user-focused brand identities, websites and digital products that help businesses stand out.",
      },
      { property: "og:title", content: "Airnova — Creative designer & digital experience" },
      {
        property: "og:description",
        content:
          "Modern, user-focused brand identities, websites and digital products by Airnova.",
      },
      { property: "og:url", content: "https://airnova-template.lovable.app/" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: `https://airnova-template.lovable.app${hero1.url}` },
      { name: "twitter:image", content: `https://airnova-template.lovable.app${hero1.url}` },
      { name: "twitter:title", content: "Airnova — Creative designer & digital experience" },
      { name: "twitter:description", content: "Modern, user-focused brand identities, websites and digital products by Airnova." },
    ],
    links: [
      { rel: "preload", as: "image", href: hero1.url, fetchpriority: "high" },
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: interLatinWoff2,
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: loraLatin500Italic,
        crossOrigin: "anonymous",
      },
      { rel: "canonical", href: "https://airnova-template.lovable.app/" },
    ],
  }),
  component: Index,
});

/* ---------- Shared bits ---------- */

function FigmaPlusIcon({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  return (
    <span
      className={`grid size-6 shrink-0 place-items-center rounded-full ${dark ? "bg-[#070606]" : "bg-white"} ${className}`}
      aria-hidden="true"
    >
      <Plus className={`size-[14px] ${dark ? "text-white" : "text-[#070606]"}`} strokeWidth={2} />
    </span>
  );
}

/* ---------- Sections ---------- */

const heroImages = [hero1.url, hero2.url, hero3.url];
const brandLogos: { url: string; name: string }[] = [
  { url: brandLogo2.url, name: "Mercura" },
  { url: brandLogo3.url, name: "Nimbus" },
  { url: brandLogo4.url, name: "Vertex" },
  { url: brandLogo1.url, name: "Stellar" },
  { url: brandLogo5.url, name: "Lumen" },
  { url: brandLogo6.url, name: "Orbit" },
];

function LogoMarquee() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const offsetRef = useRef(0);
  const halfRef = useRef(0);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    // Half = width of one full set of logos (we render the set twice for seamless loop)
    halfRef.current = track.scrollWidth / 2;

    const SPEED = halfRef.current / 20; // px per second → ~20s per loop
    let last = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!pausedRef.current && !draggingRef.current) {
        offsetRef.current -= SPEED * dt;
      }
      // Normalize within [-half, 0] for seamless wrap in both directions
      const half = halfRef.current;
      if (half > 0) {
        while (offsetRef.current <= -half) offsetRef.current += half;
        while (offsetRef.current > 0) offsetRef.current -= half;
      }
      track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    offsetRef.current = dragStartOffsetRef.current + (e.clientX - dragStartXRef.current);
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    try {
      (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  return (
    <div
      className="w-full max-w-[671px] cursor-grab overflow-hidden rounded-[12.336px] active:cursor-grabbing"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div
        ref={trackRef}
        className="flex w-max items-start gap-[3px] sm:gap-[5px] will-change-transform select-none"
      >
        {[...brandLogos, ...brandLogos].map((logo, i) => (
          <div
            key={i}
            className="relative flex size-[98px] sm:size-[164px] shrink-0 flex-col items-center justify-center overflow-hidden rounded-[12.336px] bg-surface"
          >
            <img
              src={logo.url}
              alt={`${logo.name} client logo`}
              draggable={false}
              className="max-h-[30px] w-auto max-w-[60px] sm:max-h-[50px] sm:max-w-[100px] object-contain"
              loading="lazy"
              decoding="async"
            />
            <span
              className="absolute font-semibold tracking-[-0.055em]"
              style={{
                color: "#282828",
                fontSize: "8px",
                lineHeight: 1.4,
                left: "50%",
                bottom: "10px",
                transform: "translateX(-50%)",
              }}
            >
              /2027
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Hero() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [cycleKey, setCycleKey] = useState(0);

  useEffect(() => {
    const DURATION = 5000;
    const SWITCH_AT = 0.8;
    let start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      setProgress(p);
      if (p >= SWITCH_AT) {
        setActive((i) => (i + 1) % heroImages.length);
        setProgress(0);
        start = performance.now();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cycleKey]);

  return (
    <section className="bg-surface pt-8 pb-20">
      <div className="container-x flex flex-col items-stretch gap-8 lg:flex-row lg:items-start">
        {/* Left card — 735 × 750 */}
        <div className="flex w-full shrink-0 flex-col items-center justify-between gap-6 overflow-hidden rounded-[20px] bg-background p-4 sm:gap-10 sm:p-8 md:px-[30px] lg:h-[750px] lg:w-[735px] lg:gap-0 lg:px-8">
          {/* Text container — 671 × 457 */}
          <div className="flex w-full max-w-[671px] flex-col justify-center gap-3 sm:gap-4 lg:h-[457px]">
            {/* Rating */}
            <div className="flex items-center gap-2 sm:gap-[17px]">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-[11px] sm:size-[26px] fill-foreground text-foreground"
                    strokeWidth={0}
                  />
                ))}
              </div>
              <span className="text-[12px] sm:text-[16px] font-medium leading-[1.2] sm:leading-[1.5] tracking-[-0.0075em] text-foreground">
                Rated 4.9/5
              </span>
            </div>

            {/* Quote */}
            <div className="flex flex-col gap-4 sm:gap-8">
              <div className="flex flex-col gap-2 sm:gap-4">
                <h1
                  className="w-full max-w-[660px] font-semibold tracking-[-0.065em] text-black"
                  style={{ fontSize: "clamp(32px, 7vw, 80px)", lineHeight: 1.2 }}
                >
                  Creative{" "}
                  <span className={`${serif} text-black/40`}>designer &amp;</span>
                  <br />
                  <span className={`${serif} text-black/40`}>digital</span>{" "}
                  experience.
                </h1>
                <p
                  className="w-full max-w-[535px] text-[10px] sm:text-[16px] font-medium leading-[1.5] tracking-[-0.0075em]"
                  style={{ color: "#515151" }}
                >
                  I create modern and visually compelling digital experiences that
                  help brands stand out. From user-focused UI/UX design to clean
                  and responsive web interfaces my goal is to transform.
                </p>
              </div>

              <div className="flex items-center gap-3 sm:gap-6">
                <a
                  href="#contact"
                  data-hover-lift
                  className="inline-flex h-7 items-center justify-center rounded-full px-3.5 text-[9px] sm:h-12 sm:px-6 sm:text-[16px] font-medium tracking-[-0.0075em] text-white shadow-[0_4px_2px_rgba(0,0,0,0.16)]"
                  style={{ background: "#070606" }}
                >
                  Get in touch
                </a>
                <a
                  href="#services"
                  className="inline-flex items-center gap-1 sm:gap-2 text-[9px] sm:text-[16px] font-medium tracking-[-0.0075em] text-black underline decoration-from-font underline-offset-[3px]"
                >
                  What we do
                  <ArrowRight className="size-3.5 sm:size-6 lg:hidden" strokeWidth={1.75} />
                  <ArrowUpRight className="hidden lg:inline size-6" strokeWidth={1.75} />
                </a>
              </div>
            </div>
          </div>

          {/* Logo strip — Mercury marquee loop */}
          <LogoMarquee />
        </div>

        {/* Right image slider — same on all viewports, stacks below on mobile/tablet */}
        <div className="relative min-w-0 w-full flex-1 overflow-hidden rounded-[20px] aspect-[513/375] lg:aspect-auto lg:h-[750px] lg:max-w-[513px]">
          {heroImages.map((src, i) => {
            const isFirst = i === 0;
            // The first image is the LCP candidate — render it without any
            // opacity transition so Chrome records the paint immediately.
            // Subsequent slides fade in/out via the carousel.
            return (
              <img
                key={src}
                src={src}
                alt={isFirst ? "Creative designer portrait — Airnova studio" : ""}
                aria-hidden={isFirst ? undefined : true}
                width={513}
                height={750}
                loading={isFirst ? "eager" : "lazy"}
                decoding={isFirst ? "sync" : "async"}
                fetchPriority={isFirst ? "high" : "low"}
                className={
                  isFirst
                    ? `absolute inset-0 size-full object-cover object-top ${
                        active === 0 ? "opacity-100" : "opacity-0 transition-opacity duration-700"
                      }`
                    : `absolute inset-0 size-full object-cover object-top transition-opacity duration-700 ${
                        i === active ? "opacity-100" : "opacity-0"
                      }`
                }
              />
            );
          })}

          {/* Progress bar — 3 segments, 142 wide, ~30px from bottom */}
          <div className="absolute bottom-[18px] left-1/2 flex w-[83px] -translate-x-1/2 items-center gap-[4.7px] sm:bottom-[30px] sm:w-[142px] sm:gap-2">
            {heroImages.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => {
                  setActive(i);
                  setProgress(0);
                  setCycleKey((k) => k + 1);
                }}
                className="relative h-[3.4px] sm:h-[5.775px] cursor-pointer overflow-hidden rounded-full p-0 transition-all duration-500"
                style={{
                  flex: i === active ? "47 0 0%" : "27 0 0%",
                  background: "rgba(255,255,255,0.25)",
                  backdropFilter: i === active ? "blur(16px)" : undefined,
                }}
              >
                {i === active && (
                  <span
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      width: `${Math.min(progress / 0.8, 1) * 100}%`,
                      background: "rgba(255,255,255,0.95)",
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  return (
    <section className="bg-white py-16 lg:py-28">
      <div className="container-x flex flex-col items-stretch gap-12 lg:flex-row lg:items-start lg:gap-16">
        <div className="flex flex-1 flex-col gap-8 self-stretch">
          <div className="relative h-[399px] w-full overflow-hidden rounded-[20px]">
            <img
              src={benefits1.url}
              alt="Editorial portrait"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover"
            />
            <span className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-[20px] bg-white px-4 py-2">
              <Gift size={16} strokeWidth={1.25} className="text-[#FF2626]" />
              <span className="text-[14px] font-medium leading-[1.5] tracking-[-0.075em] text-[#070606]">
                February Sale
              </span>
            </span>
          </div>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-[14px]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M16.9017 6.12874C18 7.25748 18 9.07416 18 12.7075V14.2925C18 17.9258 18 19.7425 16.9017 20.8713C15.8033 22 14.0355 22 10.5 22C6.96447 22 5.1967 22 4.09835 20.8713C3 19.7425 3 17.9258 3 14.2925V12.7075C3 9.07416 3 7.25748 4.09835 6.12874C5.1967 5 6.96447 5 10.5 5C14.0355 5 15.8033 5 16.9017 6.12874Z" stroke="#070606" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7.5 5.5V10.3693C7.5 11.3046 7.5 11.7722 7.78982 11.9396C8.35105 12.2638 9.4038 11.1823 9.90375 10.8567C10.1937 10.6678 10.3387 10.5734 10.5 10.5734C10.6613 10.5734 10.8063 10.6678 11.0962 10.8567C11.5962 11.1823 12.6489 12.2638 13.2102 11.9396C13.5 11.7722 13.5 11.3046 13.5 10.3693V5.5" stroke="#070606" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 2H11C15.714 2 18.0711 2 19.5355 3.46447C21 4.92893 21 7.28595 21 12V18" stroke="#070606" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="text-[20px] font-medium leading-[1.5] tracking-[-0.075em] text-black">
                  <span className="text-[#FF2626]">ESR</span> - 2029
                </p>
              </div>
              <p className="text-[16px] font-medium leading-[1.5] tracking-[-0.075em] text-[#515151]">
                An engaging user experience ensures that visitors can interact with your website
                easily and enjoyably. With intuitive navigation
              </p>
            </div>
            <div className="flex flex-col gap-8">
              <h2 className="whitespace-nowrap text-[32px] font-semibold leading-[1.2] tracking-[-0.065em] text-[#070606]">
                Engaging User Experience
              </h2>
              <a
                href="#contact"
                data-hover-lift
                className="inline-flex h-12 w-[271px] items-center justify-center gap-[10px] rounded-[80px] bg-[#070606] px-6 py-4 text-[16px] font-medium leading-[1.5] tracking-[-0.075em] text-white shadow-[0_4px_2px_rgba(0,0,0,0.16)]"
              >
                <span className="flex-1">Join Now!</span>
                <ArrowUpRight className="size-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col items-start justify-between gap-12 self-stretch lg:w-[649px]">
          <div className="flex w-full flex-col gap-12">
            <h2 className="w-full max-w-[611px] font-semibold leading-[1.2] tracking-[-0.065em] text-black" style={{ fontSize: "clamp(32px, 6.5vw, 72px)" }}>
              Explore our{" "}
              <span className={`${serif} italic text-black/40`}>flexible of</span> activity.
            </h2>
            <div className="flex flex-wrap items-start gap-x-8 gap-y-3">
              {["High-quality visual elements", "Flexible Design System"].map((t) => (
                <span key={t} className="inline-flex items-center gap-3">
                  <span className="grid size-8 place-items-center rounded-2xl border-[0.5px] border-black/10 bg-surface">
                    <Check className="size-[15px] text-[#070606]" />
                  </span>
                  <span className="text-[18px] font-medium leading-[1.5] tracking-[-0.075em] text-[#070606]">
                    {t}
                  </span>
                </span>
              ))}
            </div>
          </div>

          <BenefitsAccordion />
        </div>
      </div>
    </section>
  );
}

function BenefitsAccordion() {
  const accordionItems = [
    {
      title: "Responsive",
      accent: "for All Devices",
      desc: "Your website will look and perform perfectly on every device including desktops tablets and smartphones. The design adapts smoothly to different screen sizes",
    },
    { title: "Conversion-Focused", accent: "Design", desc: "Crafted with conversion in mind — every section, button, and flow is designed to turn visitors into customers." },
    { title: "Brand Identity", accent: "Design", desc: "A cohesive visual identity built from logos, color, and type that reflects your brand at every touchpoint." },
  ];
  const [open, setOpen] = useState(0);
  return (
    <div className="flex flex-col gap-8">
      {accordionItems.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.title}
            className={`rounded-[20px] transition-[background-color,padding,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isOpen
                ? "border border-transparent bg-surface p-3 sm:p-6"
                : "border-b border-black/[0.28] pt-0 pb-6 px-0 rounded-none"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              data-no-hover-fx
              className="flex w-full cursor-pointer items-center gap-6 text-left sm:gap-16"
            >
              <span className="flex-1 text-[22px] font-semibold leading-[1.3] tracking-[-0.075em] text-[#070606] sm:text-[28px] sm:leading-[1.5]">
                {item.title}{" "}
                <span className={`${serif} italic text-black/40`}>{item.accent}</span>
              </span>
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-2xl border border-black/10 transition-colors duration-300 ${
                  isOpen ? "bg-white" : "bg-surface"
                }`}
              >
                <ChevronDown
                  className={`size-4 text-black transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </span>
            </button>
            <div
              className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isOpen ? "mt-4 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
              }`}
            >
              <p className="overflow-hidden text-[16px] font-medium leading-[1.5] tracking-[-0.075em] text-[#515151]">
                {item.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Services() {
  const stroke = "#FF2626";
  const items = [
    {
      title: "Brand Identity Design",
      desc: "Designing logos color schemes and visuals that reflect your brand.",
      icon: (
        <svg viewBox="0 0 56 56" fill="none" className="size-14">
          <path d="M23.3342 17.5001C23.3342 15.531 23.1395 13.2583 25.0842 12.1356C25.8962 11.6667 26.9865 11.6667 29.1675 11.6667H31.5008C33.6816 11.6667 34.7719 11.6667 35.5842 12.1356C37.5285 13.2583 37.3342 15.531 37.3342 17.5001C37.3342 19.4691 37.5285 21.7418 35.5842 22.8645C34.7719 23.3334 33.6816 23.3334 31.5008 23.3334H29.1675C26.9865 23.3334 25.8962 23.3334 25.0842 22.8645C23.1395 21.7418 23.3342 19.4691 23.3342 17.5001Z" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9.33415 38.5001C9.33415 36.531 9.13963 34.2583 11.0842 33.1357C11.8963 32.6667 12.9867 32.6667 15.1675 32.6667H31.5009C33.6816 32.6667 34.772 32.6667 35.5842 33.1357C37.5286 34.2583 37.3342 36.531 37.3342 38.5001C37.3342 40.4692 37.5286 42.7418 35.5842 43.8644C34.772 44.3334 33.6816 44.3334 31.5009 44.3334H15.1675C12.9867 44.3334 11.8963 44.3334 11.0842 43.8644C9.13963 42.7418 9.33415 40.4692 9.33415 38.5001Z" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M46.6666 4.66672V51.3334" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: "Creative Consulting",
      desc: "Providing guidance to improve design strategy and digital presence.",
      icon: (
        <svg viewBox="0 0 56 56" fill="none" className="size-14">
          <path d="M11.6667 39.6667H4.66667M44.3333 39.6667H51.3333" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18.6721 16.3333C18.6721 14.3643 18.4775 12.0916 20.4221 10.9689C21.2342 10.5 22.3246 10.5 24.5054 10.5H31.5054C33.6861 10.5 34.7765 10.5 35.5887 10.9689C37.5333 12.0916 37.3387 14.3643 37.3387 16.3333C37.3387 18.3024 37.5333 20.5751 35.5887 21.6978C34.7765 22.1667 33.6861 22.1667 31.5054 22.1667H24.5054C22.3246 22.1667 21.2342 22.1667 20.4221 21.6978C18.4775 20.5751 18.6721 18.3024 18.6721 16.3333Z" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11.6721 39.6667C11.6721 37.6976 11.4775 35.4249 13.4221 34.3023C14.2342 33.8333 15.3246 33.8333 17.5054 33.8333H38.5054C40.6861 33.8333 41.7765 33.8333 42.5887 34.3023C44.5333 35.4249 44.3387 37.6976 44.3387 39.6667C44.3387 41.6358 44.5333 43.9084 42.5887 45.031C41.7765 45.5 40.6861 45.5 38.5054 45.5H17.5054C15.3246 45.5 14.2342 45.5 13.4221 45.031C11.4775 43.9084 11.6721 41.6358 11.6721 39.6667Z" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18.6667 16.3333H4.66667M37.3333 16.3333H51.3333" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: "Prototype & Wireframing",
      desc: "Building interactive prototypes to visualize your digital products.",
      icon: (
        <svg viewBox="0 0 56 56" fill="none" className="size-14">
          <path d="M16.3333 11.6667V4.66667M16.3333 44.3333V51.3333" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M39.6667 18.6721C41.6358 18.6721 43.9084 18.4775 45.031 20.4221C45.5 21.2342 45.5 22.3246 45.5 24.5054V31.5054C45.5 33.6861 45.5 34.7765 45.031 35.5887C43.9084 37.5333 41.6358 37.3387 39.6667 37.3387C37.6976 37.3387 35.4249 37.5333 34.3023 35.5887C33.8333 34.7765 33.8333 33.6861 33.8333 31.5054V24.5054C33.8333 22.3246 33.8333 21.2342 34.3023 20.4221C35.4249 18.4775 37.6976 18.6721 39.6667 18.6721Z" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16.3333 11.6721C18.3024 11.6721 20.5751 11.4775 21.6978 13.4221C22.1667 14.2342 22.1667 15.3246 22.1667 17.5054V38.5054C22.1667 40.6861 22.1667 41.7765 21.6978 42.5887C20.5751 44.5333 18.3024 44.3387 16.3333 44.3387C14.3643 44.3387 12.0916 44.5333 10.9689 42.5887C10.5 41.7765 10.5 40.6861 10.5 38.5054V17.5054C10.5 15.3246 10.5 14.2342 10.9689 13.4221C12.0916 11.4775 14.3643 11.6721 16.3333 11.6721Z" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M39.6667 18.6667V4.66667M39.6667 37.3333V51.3333" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isDesktop) {
      setProgress(0);
      return;
    }
    const el = scrollRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const total = rect.height - vh;
        if (total <= 0) return setProgress(0);
        const scrolled = Math.min(Math.max(-rect.top, 0), total);
        setProgress(scrolled / total);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isDesktop]);

  const smooth = (t: number) => t * t * (3 - 2 * t);
  const cardStyle = (i: number): CSSProperties | undefined => {
    if (!isDesktop) return undefined;
    const e = smooth(Math.min(1, Math.max(0, progress)));
    if (i === 1) {
      return {
        transform: "translate(-50%, -50%) scale(1)",
        zIndex: 3,
      };
    }
    const dir = i === 0 ? -1 : 1;
    const startY = i === 0 ? -16 : 16;
    const startScale = i === 0 ? 0.96 : 0.92;
    const x = dir * 108 * e;
    const y = startY * (1 - e);
    const s = startScale + (1 - startScale) * e;
    return {
      transform: `translate(calc(-50% + ${x}%), calc(-50% + ${y}px)) scale(${s})`,
      zIndex: i === 0 ? 2 : 1,
    };
  };

  return (
    <section id="services" className="bg-surface">
      <div ref={scrollRef} className="relative w-full lg:h-[220vh]">
        <div className="w-full py-16 lg:sticky lg:top-0 lg:flex lg:min-h-screen lg:items-center lg:py-20">
          <div className="container-x flex w-full flex-col items-center gap-12 sm:gap-16">
            <div className="flex flex-col items-center gap-2">
              <Pill variant="white">Our Services</Pill>
              <div className="flex flex-col items-center gap-4 text-center">
                <h2 className="w-full max-w-[864px] font-semibold leading-[1.2] tracking-[-0.065em] text-[#070606]" style={{ fontSize: "clamp(32px, 6vw, 72px)" }}>
                  Design solutions that make your{" "}
                  <span className={`${serif} italic text-black/40`}>brand stand</span>
                </h2>
                <p className="w-full max-w-[605px] text-[10px] sm:text-[16px] font-medium leading-[1.5] tracking-[-0.075em] text-[#515151]">
                  We create thoughtful and visually compelling design solutions that help your brand
                  stand out in a competitive digital world. By combining creativity with strategy our
                  designs
                </p>
              </div>
            </div>

            <div className="relative w-full">
              <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:block lg:h-[360px]">
                {items.map(({ icon, title, desc }, i) => (
                  <div
                    key={title}
                    style={cardStyle(i)}
                    className={`flex flex-col items-start gap-16 rounded-[20px] bg-white p-8 [&_svg.size-14]:size-12 sm:[&_svg.size-14]:size-14 ${i >= 2 ? "sm:col-span-2 lg:col-span-1" : ""} lg:absolute lg:left-1/2 lg:top-1/2 lg:w-[clamp(320px,28vw,420px)] lg:will-change-transform`}
                  >
                    {icon}
                    <div className="flex w-full flex-col gap-2">
                      <h3 className="text-[18px] sm:text-[28px] font-semibold leading-[1.2] tracking-[-0.065em] text-[#070606]">
                        {title}
                      </h3>
                      <p className="text-[16px] font-medium leading-[1.5] tracking-[-0.075em] text-[#515151]">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const projectImages = [
  project1.url,
  project2.url,
  project3.url,
  project4.url,
];

function Projects() {
  const items = PROJECTS.slice(0, 4).map((p) => ({
    slug: p.slug,
    title: p.name,
    tag: p.category,
  }));
  return (
    <section id="projects" className="bg-[#f5f5f5] p-[10px] lg:p-[30px]">
      <div className="relative w-full rounded-[20px] bg-white py-16 lg:py-28">
        <div className="container-x-inset">
          <div className="mx-auto flex max-w-[680px] flex-col items-center gap-4 text-center">
            <Pill>Our Project</Pill>
          <h2 className="text-[clamp(32px,5.5vw,72px)] font-semibold leading-[1.2] tracking-[-0.065em] text-black">
            A <span className={`${serif} italic text-black/50`}>showcase</span> of my latest design
          </h2>
            <p className="max-w-[605px] text-[10px] sm:text-[16px] font-medium leading-[1.5] tracking-[-0.075em] text-[#515151]">
              Explore a selection of our creative projects that showcase our passion for design and
              innovation. Each project reflects our commitment to delivering .
            </p>
          </div>
          <div className="mt-12 sm:mt-16 grid gap-6 lg:grid-cols-2 lg:gap-2">
          {items.map((p, i) => (
            <Link
              key={p.slug}
              to="/projects/$slug"
              params={{ slug: p.slug }}
              className="group flex flex-col gap-2"
            >
              <div className="overflow-hidden rounded-[20px] bg-black/5">
                <img
                  src={projectImages[i]}
                  alt={p.title}
                  loading="lazy"
                  decoding="async"
                  className="h-[375px] lg:h-[500px] w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center justify-between gap-3 rounded-[10px] bg-[#f5f5f5] px-2.5 py-2 sm:gap-8 sm:px-6 sm:py-3">
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <h3 className="text-[16px] font-semibold leading-[1.2] tracking-[-0.065em] text-black sm:text-[24px]">
                    {p.title}
                  </h3>
                  <p className="text-[10px] sm:text-base font-medium leading-[1.5] tracking-[-0.075em] text-[#515151]">
                    2026 — 32
                  </p>
                </div>
                <span className="shrink-0 text-right text-[10px] sm:text-[18px] font-medium leading-[1.5] tracking-[-0.075em] text-[#515151]">
                  {p.tag}
                </span>
              </div>
            </Link>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CountUp({ value, duration = 2000 }: { value: string; duration?: number }) {
  const match = value.match(/^([^\d-]*)(-?[\d.,]+)(.*)$/);
  const prefix = match?.[1] ?? "";
  const numStr = match?.[2] ?? "0";
  const suffix = match?.[3] ?? "";
  const target = parseFloat(numStr.replace(/,/g, "")) || 0;
  const hasK = /k/i.test(suffix);
  const cleanSuffix = hasK ? suffix.replace(/k/i, "") : suffix;
  const finalTarget = hasK ? target * 1000 : target;
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const tick = (now: number) => {
              const p = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - p, 3);
              setDisplay(finalTarget * eased);
              if (p < 1) requestAnimationFrame(tick);
              else setDisplay(finalTarget);
            };
            requestAnimationFrame(tick);
            io.disconnect();
          }
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [finalTarget, duration]);

  const formatted = hasK
    ? display >= 1000
      ? (display / 1000).toFixed(display >= 10000 ? 0 : 1).replace(/\.0$/, "") + "k"
      : Math.round(display).toString()
    : Number.isInteger(target)
      ? Math.round(display).toString()
      : display.toFixed(1);

  return (
    <span ref={ref}>
      {prefix}
      {formatted}
      {hasK ? "" : cleanSuffix}
    </span>
  );
}

function Stats() {
  const stats = [
    { v: "100+", l: "Creative professionals" },
    { v: "50k", l: "Projects Completed" },
    { v: "99%", l: "Client Satisfaction" },
    { v: "15+", l: "Design Experience" },
  ];
  // In-block video: mount once after first play; crossfade thumbnail <-> video.
  const [videoMounted, setVideoMounted] = useState(false);
  const [thumbVisible, setThumbVisible] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [playSignal, setPlaySignal] = useState(0);
  const leaveTimer = useRef<number | null>(null);

  const handlePlay = () => {
    if (leaveTimer.current) {
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    setVideoMounted(true);
    setThumbVisible(false);
    setPlaySignal((s) => s + 1);
  };

  const handleMouseLeave = () => {
    if (!videoMounted || videoPlaying) return;
    if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
    leaveTimer.current = window.setTimeout(() => setThumbVisible(true), 200);
  };
  const handleMouseEnter = () => {
    if (leaveTimer.current) {
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  };
  return (
    <section id="studio" className="bg-[#f5f5f5] py-16 lg:py-[112px]">
      <div className="container-x flex flex-col gap-8">
        <div className="flex flex-col items-center gap-[10px]">
          <Pill variant="white">About us</Pill>
          <p className="max-w-[1075px] text-center text-[clamp(24px,3vw,40px)] font-semibold leading-[1.3] tracking-[-0.065em] text-black">
            We are a creative design team dedicated to crafting modern and meaningful digital experiences.{" "}
            <span className="text-black/50">
              Our focus is on combining creativity strategy and user-centered design to deliver visually
              compelling and highly functional solutions.
            </span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="flex flex-1 flex-col gap-16 rounded-[20px] bg-white p-6">
              <div className="flex flex-col gap-8">
                <div className="text-[48px] font-semibold leading-[1.2] tracking-[-0.065em] text-black">
                  <CountUp value={s.v} />
                </div>
              <div className="w-full border-t border-dashed border-black/15" />
              </div>
              <div className="text-base font-medium leading-[1.5] tracking-[-0.075em] text-[#515151]">
                {s.l}
              </div>
            </div>
          ))}
        </div>

        <div
          className="relative aspect-[1280/700] w-full overflow-hidden rounded-[20px] bg-black"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Video layer (mounts once on first play, stays in DOM) */}
          {videoMounted && (
            <div
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                thumbVisible ? "pointer-events-none opacity-0" : "opacity-100"
              }`}
            >
              <CustomVideoPlayer
                youtubeId="c-rV8AcXlQE"
                fill
                playSignal={playSignal}
                onPlayingChange={setVideoPlaying}
              />
            </div>
          )}

          {/* Thumbnail + play layer */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              thumbVisible ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <img
              src={showreelThumb.url}
              alt="Showreel"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/40 to-transparent">
              <button
                onClick={handlePlay}
                aria-label="Play showreel"
                data-no-hover-fx
                data-smooth-hover
                className="flex cursor-pointer items-center gap-3 sm:gap-6"
              >
                <span className="grid size-[64px] sm:size-[140px] place-items-center rounded-full bg-white text-foreground shadow-2xl">
                  <Play className="size-5 sm:size-10 fill-foreground" />
                </span>
                <span className="w-[140px] sm:w-[180px] text-left text-[18px] sm:text-[32px] font-bold leading-[1.4] tracking-[-0.065em] text-white">
                  Watch the Experience
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Solution() {
  return <SolutionInner />;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

function loadYouTubeAPI(): Promise<any> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return;
    if (window.YT && window.YT.Player) return resolve(window.YT);
    const existing = document.getElementById("youtube-iframe-api");
    if (!existing) {
      const tag = document.createElement("script");
      tag.id = "youtube-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(window.YT);
    };
  });
}

function CustomVideoPlayer({
  youtubeId,
  fill = false,
  onPlayingChange,
  playSignal,
}: {
  youtubeId: string;
  fill?: boolean;
  onPlayingChange?: (playing: boolean) => void;
  playSignal?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    let tick: number | undefined;
    loadYouTubeAPI().then((YT) => {
      if (cancelled || !mountRef.current) return;
      playerRef.current = new YT.Player(mountRef.current, {
        videoId: youtubeId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          playsinline: 1,
          disablekb: 1,
          fs: 0,
        },
        events: {
          onReady: (e: any) => {
            setReady(true);
            setDuration(e.target.getDuration());
            setVolume(e.target.getVolume() / 100);
            setMuted(e.target.isMuted());
          },
          onStateChange: (e: any) => {
            // 1 playing, 2 paused, 0 ended
            if (e.data === 1) {
              setPlaying(true);
              onPlayingChange?.(true);
            } else if (e.data === 2 || e.data === 0) {
              setPlaying(false);
              onPlayingChange?.(false);
            }
            if (!duration) setDuration(e.target.getDuration());
          },
        },
      });
    });
    tick = window.setInterval(() => {
      const p = playerRef.current;
      if (p && typeof p.getCurrentTime === "function") {
        setTime(p.getCurrentTime() || 0);
        const d = p.getDuration?.() || 0;
        if (d && d !== duration) setDuration(d);
      }
    }, 250);
    return () => {
      cancelled = true;
      if (tick) window.clearInterval(tick);
      try {
        playerRef.current?.destroy?.();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youtubeId]);

  const togglePlay = () => {
    const p = playerRef.current;
    if (!p) return;
    if (playing) p.pauseVideo();
    else p.playVideo();
  };

  useEffect(() => {
    if (playSignal === undefined) return;
    const p = playerRef.current;
    if (p && typeof p.playVideo === "function") p.playVideo();
  }, [playSignal]);

  const toggleMute = () => {
    const p = playerRef.current;
    if (!p) return;
    if (p.isMuted()) {
      p.unMute();
      setMuted(false);
    } else {
      p.mute();
      setMuted(true);
    }
  };

  const onVolume = (val: number) => {
    const p = playerRef.current;
    if (!p) return;
    p.setVolume(Math.round(val * 100));
    setVolume(val);
    if (val === 0) {
      p.mute();
      setMuted(true);
    } else if (p.isMuted()) {
      p.unMute();
      setMuted(false);
    }
  };

  const onSeek = (val: number) => {
    const p = playerRef.current;
    if (!p || !duration) return;
    const t = (val / 100) * duration;
    p.seekTo(t, true);
    setTime(t);
  };

  const toggleFullscreen = () => {
    const w = wrapRef.current;
    if (!w) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else w.requestFullscreen?.();
  };

  const nudgeControls = () => {
    setShowControls(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      if (playing) setShowControls(false);
    }, 2500);
  };

  const fmt = (s: number) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const progress = duration ? (time / duration) * 100 : 0;

  return (
    <div
      ref={wrapRef}
      onMouseMove={nudgeControls}
      onMouseLeave={() => playing && setShowControls(false)}
      className={`group relative overflow-hidden bg-black ${fill ? "size-full" : "rounded-2xl shadow-2xl"}`}
      style={fill ? undefined : { aspectRatio: "16 / 9" }}
    >
      <div ref={mountRef} className="absolute inset-0 size-full" />
      {/* Click shield over iframe to capture play/pause taps */}
      <button
        type="button"
        aria-label={playing ? "Pause" : "Play"}
        onClick={togglePlay}
        className="absolute inset-0 size-full cursor-pointer bg-transparent"
      />

      {/* Center play overlay when paused */}
      {ready && !playing && (
        <button
          type="button"
          aria-label="Play"
          onClick={togglePlay}
          className="absolute inset-0 grid place-items-center bg-black/30"
        >
          <span className="grid size-20 place-items-center rounded-full bg-white shadow-2xl">
            <Play className="size-7 fill-[#070606] text-[#070606]" />
          </span>
        </button>
      )}

      {/* Bottom control bar */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 transition-opacity duration-300 ${
          showControls || !playing ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Scrubber */}
        <div className="pointer-events-auto relative mb-3 h-1 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="absolute inset-y-0 left-0 bg-white"
            style={{ width: `${progress}%` }}
          />
          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={progress}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            aria-label="Seek"
            className="absolute inset-0 size-full cursor-pointer appearance-none bg-transparent opacity-0"
          />
        </div>

        <div className="pointer-events-auto flex items-center gap-4 text-white">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Pause" : "Play"}
            className="grid size-10 place-items-center rounded-full bg-white text-[#070606] transition hover:scale-105"
          >
            {playing ? (
              <Pause className="size-4 fill-[#070606]" />
            ) : (
              <Play className="size-4 fill-[#070606]" />
            )}
          </button>

          <span className="font-mono text-xs tabular-nums tracking-tight text-white/80">
            {fmt(time)} <span className="text-white/70">/ {fmt(duration)}</span>
          </span>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? "Unmute" : "Mute"}
                className="grid size-9 place-items-center rounded-full text-white hover:bg-white/10"
              >
                {muted || volume === 0 ? (
                  <VolumeX className="size-4" />
                ) : (
                  <Volume2 className="size-4" />
                )}
              </button>
              <div className="relative h-1 w-20 overflow-hidden rounded-full bg-white/20">
                <div
                  className="absolute inset-y-0 left-0 bg-white"
                  style={{ width: `${(muted ? 0 : volume) * 100}%` }}
                />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={muted ? 0 : volume}
                  onChange={(e) => onVolume(parseFloat(e.target.value))}
                  aria-label="Volume"
                  className="absolute inset-0 size-full cursor-pointer appearance-none bg-transparent opacity-0"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label="Fullscreen"
              className="grid size-9 place-items-center rounded-full text-white hover:bg-white/10"
            >
              <Maximize className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SolutionInner() {
  const [lightboxMounted, setLightboxMounted] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const openLightbox = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setLightboxMounted(true);
    requestAnimationFrame(() => setLightboxOpen(true));
  };
  const closeLightbox = () => {
    setLightboxOpen(false);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setLightboxMounted(false), 450);
  };
  useEffect(() => {
    if (!lightboxMounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxMounted]);

  return (
    <section className="bg-white py-16 lg:py-28">
      <div className="container-x flex flex-col items-center gap-12 sm:gap-16">
        <h2 className="max-w-[873px] text-center text-[clamp(32px,4.5vw,56px)] font-semibold leading-[1.2] tracking-[-0.065em] text-black">
          Crafting unique strategies that turn visions into powerful results
        </h2>

        <div className="flex w-full flex-col gap-2 lg:flex-row lg:items-start">
          {/* Left card — dark */}
          <div className="flex h-[333px] flex-none xl:h-[500px] xl:flex-1 flex-col justify-between rounded-[20px] bg-[#070606] p-8">
            <div className="flex items-start justify-between">
              <div className="h-[100px] w-[150px] overflow-hidden rounded-[20px]">
                <img
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=400&q=80"
                  alt="Market research"
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover"
                />
              </div>
              <FigmaPlusIcon />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-[20px] font-semibold leading-[1.5] tracking-[-0.075em] text-white">
                Market research
              </h3>
              <p className="text-base font-medium leading-[1.5] tracking-[-0.075em] text-white/[0.62]">
                We work closely to turn your goals into digital experiences that combine strategy
                design and technology.
              </p>
            </div>
          </div>

          {/* Center image with overlay */}
          <div className="relative flex h-[500px] w-full shrink-0 flex-col justify-between overflow-hidden rounded-[20px] p-8 lg:w-[532px]">
            <img
              src={solutionThumb.url}
              alt="Our strategy meets bold creativity"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative flex justify-end">
              <FigmaPlusIcon />
            </div>
            <div className="relative flex flex-col gap-6">
              <button
                type="button"
                onClick={openLightbox}
                aria-label="Play video"
                className="grid size-14 cursor-pointer place-items-center rounded-full bg-white shadow-lg transition-transform duration-300 ease-out hover:scale-105"
              >
                <Play className="size-4 fill-[#070606] text-[#070606]" />
              </button>
              <p className="max-w-[281px] text-[32px] font-semibold leading-[1.2] tracking-[-0.065em] text-white">
                Our strategy meets bold creativity
              </p>
            </div>
          </div>

          {/* Right card — light */}
          <div className="flex h-[333px] flex-none xl:h-[500px] xl:flex-1 flex-col justify-between rounded-[20px] bg-[#f5f5f5] p-8">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-2">
                <p className="text-[56px] font-semibold leading-[1.2] tracking-[-0.065em] text-[#070606]">
                  <CountUp value="100%" />
                </p>
                <p className="text-[20px] font-medium leading-[1.5] tracking-[-0.075em] text-[#070606]">
                  Satisfied client
                </p>
                <p className="text-base font-medium leading-[1.5] tracking-[-0.075em] text-[#515151]">
                  A seamless process with a polished fast and easy-to-manage result
                </p>
              </div>
              <FigmaPlusIcon dark />
            </div>
            <div className="flex -space-x-5">
              {[avatar10.url, avatar11.url, avatar12.url, avatar13.url].map((src) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="size-14 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {lightboxMounted && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Strategy video"
          onClick={closeLightbox}
          className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-500 ease-out sm:p-8 ${
            lightboxOpen ? "bg-black/80 backdrop-blur-sm opacity-100" : "bg-black/0 opacity-0"
          }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-[1280px] overflow-hidden rounded-[20px] bg-black shadow-2xl transition-all duration-500 ease-out ${
              lightboxOpen ? "scale-100 opacity-100" : "scale-[0.96] opacity-0"
            }`}
            style={{ aspectRatio: "16 / 9" }}
          >
            <CustomVideoPlayer youtubeId="c-rV8AcXlQE" fill />
          </div>
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Close video"
            className={`fixed right-5 top-5 z-[101] grid size-12 cursor-pointer place-items-center rounded-full bg-white/10 text-white backdrop-blur transition-all duration-500 ease-out hover:bg-white/20 ${
              lightboxOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            <X className="size-5" />
          </button>
        </div>
      )}
    </section>
  );
}

/* ---------- Testimonials Slider (Aeline) ---------- */

const sliderTestimonials = [
  {
    quote:
      "They brought clarity to complex problems, breaking down barriers and delivering innovative solutions.",
    name: "John Doe",
    company: "Tech Innovations",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80",
  },
  {
    quote:
      "Their insight resolved difficult hurdles, opening new paths and creating highly effective strategies.",
    name: "Amelia Chen",
    company: "Northwind Labs",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=80",
  },
  {
    quote:
      "We found focus for tricky requirements, cutting through noise and providing truly advanced responses.",
    name: "Marcus Wright",
    company: "Helix Studio",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80",
  },
  {
    quote:
      "They gave simple paths to hard puzzles, removing all delays while building fresh, brilliant projects.",
    name: "Priya Patel",
    company: "Lumen Co.",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=900&q=80",
  },
  {
    quote:
      "Sharp thinking, fast turnarounds and a genuine sense of craft on every single deliverable.",
    name: "Diego Alvarez",
    company: "Atlas Group",
    image:
      "https://images.unsplash.com/photo-1542178243-bc20204b769f?auto=format&fit=crop&w=900&q=80",
  },
];

function TriangleArrow({ direction, onClick, disabled }: { direction: "left" | "right"; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      aria-label={direction === "left" ? "Previous testimonial" : "Next testimonial"}
      onClick={onClick}
      disabled={disabled}
      className="group grid size-12 place-items-center rounded-full border border-black/15 bg-white text-[#070606] transition hover:bg-[#070606] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`size-4 ${direction === "left" ? "-rotate-90" : "rotate-90"}`}
      >
        <path d="M12 2L3 21h18L12 2z" />
      </svg>
    </button>
  );
}

function TestimonialsSlider() {
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(3);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      setPerView(w < 640 ? 1 : w < 1024 ? 2 : 3);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const maxIndex = Math.max(0, sliderTestimonials.length - perView);
  const safeIndex = Math.min(index, maxIndex);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(maxIndex, i + 1));

  return (
    <section
      className="bg-white py-28"
      aria-roledescription="carousel"
      aria-label="Client testimonials"
    >
      <div className="container-x flex flex-col gap-12">
        <div className="flex flex-col gap-6">
          <Pill>Testimonials</Pill>
          <h2 className="text-[clamp(36px,4.5vw,56px)] font-semibold leading-[1.2] tracking-[-0.05em] text-[#070606]">
            What they <span className={`${serif} text-[#070606]/50`}>say about</span> us?
          </h2>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-base font-medium leading-[1.5] tracking-[-0.075em] text-[#515151]">
              Here&rsquo;s what they shared about their experience working with our team.
            </p>
            <div className="hidden gap-3 sm:flex" role="group" aria-label="Carousel navigation">
              <TriangleArrow direction="left" onClick={prev} disabled={safeIndex === 0} />
              <TriangleArrow direction="right" onClick={next} disabled={safeIndex >= maxIndex} />
            </div>
          </div>
        </div>

        <div
          className="overflow-hidden"
          ref={(el) => {
            if (!el || visible) return;
            const io = new IntersectionObserver(
              (entries) => {
                entries.forEach((e) => {
                  if (e.isIntersecting) {
                    setVisible(true);
                    io.disconnect();
                  }
                });
              },
              { threshold: 0.15 },
            );
            io.observe(el);
          }}
        >
          <div
            className="flex transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translateX(-${safeIndex * (100 / perView)}%)` }}
          >
            {sliderTestimonials.map((t, i) => (
              <div
                key={t.name + i}
                className="shrink-0 px-2"
                style={{ width: `${100 / perView}%` }}
              >
                <article
                  className="relative h-[460px] overflow-hidden rounded-2xl bg-[#0a0a0a] text-white shadow-[0_20px_60px_-30px_rgba(0,0,0,0.4)] transition-[opacity,transform] duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "scale(1)" : "scale(0.92)",
                    transitionDelay: `${i * 90}ms`,
                  }}
                >
                  <img
                    src={t.image}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 size-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />
                  <div className="relative flex h-full flex-col justify-end gap-6 p-7">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 32 32"
                      fill="currentColor"
                      className="size-8 text-white"
                      aria-hidden="true"
                    >
                      <path d="M3.33398 6.66797H14.6673V16.868L8.69132 25.3346H5.06065L8.61532 17.3346H3.33398V6.66797ZM17.334 6.66797H28.6673V16.868L22.6913 25.3346H19.0607L22.6153 17.3346H17.334V6.66797Z" />
                    </svg>
                    <p className="text-lg font-medium leading-[1.4] tracking-[-0.03em]">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <p className="text-right text-sm text-white/70">
                      — {t.name}, {t.company}
                    </p>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-3 sm:hidden" role="group" aria-label="Carousel navigation">
          <TriangleArrow direction="left" onClick={prev} disabled={safeIndex === 0} />
          <TriangleArrow direction="right" onClick={next} disabled={safeIndex >= maxIndex} />
        </div>
      </div>
    </section>
  );
}

/* ---------- Fanned Testimonial Cards (Hirekit) ---------- */

const fannedItems = [
  {
    name: "Mark Tressler",
    role: "COO, FinTech Global",
    title: "A true partner in growth.",
    quote:
      "We launched our Mexico City operations in 30 days – no local entity needed. Their payroll and benefits infrastructure saved us $280K in setup costs, and their talent retention rate is 40% higher than industry average.",
    avatar: "https://i.pravatar.cc/160?img=14",
    rotation: -8,
    variant: "light" as const,
  },
  {
    name: "Jake Miller",
    role: "VP, NorthBridge",
    title: "They simplified everything.",
    quote:
      "In less than six weeks, they streamlined our entire onboarding workflow across three countries. We cut our administrative load by 55% and reduced compliance errors to virtually zero. The transparency and execution speed are unmatched.",
    avatar: "https://i.pravatar.cc/160?img=33",
    rotation: -3,
    variant: "dark" as const,
  },
  {
    name: "Chloe Adams",
    role: "CFO, Horizon Labs",
    title: "A team that delivers.",
    quote:
      "Their end-to-end HR and payroll support let us expand to Latin America without distraction. We saved $190K in annual overhead, and our hiring cycle went from 28 days to just 9. It's the kind of operational lift that changes your whole roadmap.",
    avatar: "https://i.pravatar.cc/160?img=45",
    rotation: 3,
    variant: "light" as const,
  },
  {
    name: "Ryan Parker",
    role: "CEO, FinTech Global",
    title: "Clear impact from day one.",
    quote:
      "Their ecosystem flagged inefficiencies in our multi-country payouts and fixed them in a week. That alone reduced our monthly burn by 12%. Add their reporting tools, and we now make decisions in hours, not weeks. Truly game-changing.",
    avatar: "https://i.pravatar.cc/160?img=68",
    rotation: 8,
    variant: "dark" as const,
  },
];

function FannedTestimonials() {
  const [visible, setVisible] = useState(false);
  return (
    <section
      className="overflow-hidden bg-[#070606] py-28 text-white"
      aria-label="Client testimonials"
    >
      <div
        ref={(el) => {
          if (!el || visible) return;
          const io = new IntersectionObserver(
            (entries) => {
              entries.forEach((e) => {
                if (e.isIntersecting) {
                  setVisible(true);
                  io.disconnect();
                }
              });
            },
            { threshold: 0.15 },
          );
          io.observe(el);
        }}
        className="container-x flex flex-col items-center gap-16"
      >
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="inline-flex items-center gap-[10px] rounded-lg bg-white/[0.06] px-[14px] py-2">
            <BrandMark size={24} dark={false} />
            <span className="text-sm font-medium leading-[1.5] tracking-[-0.04em] text-white">
              Testimonials
            </span>
          </div>
          <h2 className={`max-w-[820px] text-[clamp(40px,5vw,72px)] font-normal leading-[1.05] tracking-[-0.03em] ${serif}`}>
            Industry-leading results with Airnova
          </h2>
          <p className="max-w-xl text-base text-white/75">
            The LatAm talent partner top performers choose
          </p>
        </div>

        <ul
          role="list"
          className="flex w-full flex-col items-center gap-6 lg:flex-row lg:justify-center lg:gap-[-40px]"
          style={{ perspective: "1200px" }}
        >
          {fannedItems.map((t, i) => (
            <li
              key={t.name}
              className="group relative w-full max-w-[340px] lg:max-w-none lg:w-[300px] lg:[&:not(:first-child)]:-ml-10"
              style={{ zIndex: i + 1 }}
            >
              <article
                className={`flex h-full flex-col gap-5 rounded-2xl p-6 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none group-hover:!rotate-0 group-hover:!translate-y-[-12px] group-hover:z-50 ${
                  t.variant === "dark"
                    ? "bg-[#141414] text-white ring-1 ring-white/10"
                    : "bg-white text-[#070606]"
                }`}
                style={{
                  transform: visible
                    ? `rotate(${t.rotation}deg) translateY(0)`
                    : `rotate(${t.rotation}deg) translateY(327px)`,
                  opacity: visible ? 1 : 0,
                  transitionProperty: "transform, opacity, box-shadow",
                  transitionDelay: `${i * 120}ms`,
                }}
              >
                <header className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    loading="lazy"
                    className="size-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-base font-semibold tracking-[-0.02em]">{t.name}</div>
                    <div className={`text-xs ${t.variant === "dark" ? "text-white/75" : "text-[#515151]"}`}>
                      {t.role}
                    </div>
                  </div>
                </header>
                <h3 className="text-xl font-semibold leading-[1.25] tracking-[-0.02em]">
                  {t.title}
                </h3>
                <p className={`text-sm leading-[1.55] ${t.variant === "dark" ? "text-white/80" : "text-[#515151]"}`}>
                  &ldquo;{t.quote}&rdquo;
                </p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const faqs = [
  {
    q: "What services do you offer?",
    a: "We offer a range of creative services including UI/UX design, web design, brand identity design, and digital product design to help businesses build a strong online presence.",
  },
  { q: "What tools do you use for design?", a: "Figma, Adobe Creative Suite, and Framer for prototyping." },
  { q: "How long does a design project usually take?", a: "Most projects take between 4–8 weeks depending on scope." },
  { q: "Do you provide responsive design?", a: "Yes, every design we ship is fully responsive across all devices." },
  { q: "Can I request revisions during the project?", a: "Absolutely — revisions are part of our collaborative process." },
];

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="bg-white py-16 lg:py-28">
      <div className="container-x flex flex-col items-center gap-12 sm:gap-16">
        <div className="flex flex-col items-center gap-4">
        <div className="inline-flex items-center justify-center gap-[10px] rounded-lg bg-[#f5f5f5] px-[14px] py-2">
          <BrandMark size={24} />
          <span className="text-base font-medium leading-[1.5] tracking-[-0.075em] text-black">
            FAQ
          </span>
        </div>
        <h2 className="max-w-[650px] text-center text-[clamp(24px,4.5vw,56px)] font-semibold leading-[1.2] tracking-[-0.065em] text-[#070606]">
          Answers to{" "}
          <span className={`${serif} text-[#070606]/50`}>your most</span> common questions
        </h2>
        <p className="max-w-[617px] text-center text-[10px] sm:text-base font-medium leading-[1.5] tracking-[-0.075em] text-[#515151]">
          Find answers to some of the most common questions about our design services process and
          collaboration. This section helps you quickly understand how we work.
        </p>
      </div>

      <div className="flex w-full max-w-[900px] flex-col gap-3 bg-[#f5f5f5] p-4 sm:gap-6 sm:p-8">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <button
              key={f.q}
              onClick={() => setOpen(isOpen ? -1 : i)}
              data-no-hover-fx
              className="block w-full cursor-pointer rounded-[10px] bg-white px-6 py-4 text-left transition"
            >
              <div className="flex items-center justify-between gap-8 sm:gap-16">
                <span className="text-[clamp(12px,1.8vw,26px)] font-medium leading-[1.5] tracking-[-0.075em] text-black">
                  {f.q}
                </span>
                <span className="grid size-[22px] sm:size-[54px] shrink-0 place-items-center">
                  <span className="grid size-[16px] sm:size-[38px] place-items-center rounded-full bg-[#070606] text-white">
                    {isOpen ? <Minus className="size-3 sm:size-4" strokeWidth={2.5} /> : <Plus className="size-3 sm:size-4" strokeWidth={2.5} />}
                  </span>
                </span>
              </div>
              <div
                className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isOpen ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <p className="overflow-hidden text-[8px] sm:text-base font-medium leading-[1.5] tracking-[-0.075em] text-[#515151]">
                  {f.a}
                </p>
              </div>
            </button>
          );
        })}
      </div>
      </div>
    </section>
  );
}

function Index() {
  return (
    <main className="min-h-screen overflow-x-clip bg-background font-sans text-foreground antialiased">
      <Nav />
      <Hero />
      <Benefits />
      <Services />
      <Projects />
      <Stats />
      <Solution />
      <Testimonials />
      <Faq />
      <Cta />
      <Footer />
    </main>
  );
}
