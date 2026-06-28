import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { Minus, Plus, Star } from "lucide-react";

import { BrandMark, Pill, serif } from "@/components/site/shared";
import { Nav } from "@/components/site/Nav";
import { Cta } from "@/components/site/Cta";
import { Footer } from "@/components/site/Footer";

import avatar10 from "@/assets/avatar-10.png.asset.json";
import avatar11 from "@/assets/avatar-11.png.asset.json";
import avatar12 from "@/assets/avatar-12.png.asset.json";
import avatar13 from "@/assets/avatar-13.png.asset.json";
import aboutLogoCircle from "@/assets/about-logo-circle.svg.asset.json";
import aboutLogoLuyu from "@/assets/about-logo-luyu.svg.asset.json";
import aboutLogoLoqo from "@/assets/about-logo-loqo.svg.asset.json";
import aboutLogoInfinity from "@/assets/about-logo-infinity.svg.asset.json";
import aboutLogoIpsum from "@/assets/about-logo-ipsum.svg.asset.json";
import aboutLogoN7 from "@/assets/about-logo-n7.png.asset.json";
import heroPortrait from "@/assets/about-hero-portrait.webp.asset.json";
import resultsPortrait from "@/assets/about-results-portrait.webp.asset.json";
import creativePortrait from "@/assets/about-creative-portrait.webp.asset.json";
import team1Asset from "@/assets/team-1.webp.asset.json";
import team2Asset from "@/assets/team-2.webp.asset.json";
import team3Asset from "@/assets/team-3.webp.asset.json";
import team4Asset from "@/assets/team-4.webp.asset.json";

const HERO_PORTRAIT = heroPortrait.url;
const RESULTS_IMG = resultsPortrait.url;
const CREATIVE_IMG = creativePortrait.url;
const TEAM_1 = team1Asset.url;
const TEAM_2 = team2Asset.url;
const TEAM_3 = team3Asset.url;
const TEAM_4 = team4Asset.url;

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Airnova" },
      {
        name: "description",
        content:
          "We're strategists, creators and growth experts who believe social media should drive real business results. Meet the team behind Airnova.",
      },
      { property: "og:title", content: "About — Airnova" },
      {
        property: "og:description",
        content:
          "Meet the strategists and creators behind Airnova — a studio designing brands that inspire and endure.",
      },
      { property: "og:image", content: HERO_PORTRAIT },
      { name: "twitter:image", content: HERO_PORTRAIT },
      { property: "og:url", content: "https://airnova-template.lovable.app/about" },
    ],
    links: [{ rel: "canonical", href: "https://airnova-template.lovable.app/about" }],
  }),
  component: AboutPage,
});

/* ---------- Hero ---------- */

function AboutHero() {
  const avatars = [avatar10.url, avatar11.url, avatar12.url, avatar13.url];
  return (
    <section className="overflow-clip bg-white py-14 lg:h-[900px] lg:py-0">
      <div className="container-x lg:pt-14">
        <div className="flex flex-col items-start gap-12 lg:flex-row lg:justify-between lg:gap-0">
          <div className="flex flex-col gap-12 lg:w-[48%] lg:shrink-0 lg:pt-20 xl:w-[623px]">
            <div className="flex flex-col items-start gap-4">
              <Pill>About Us</Pill>
              <h1 className="text-[clamp(40px,8vw,80px)] font-semibold leading-[1.1] tracking-[-0.065em] text-black">
                Designing brands that{" "}
                <span className={`${serif} text-black/50`}>inspire and</span> endure
              </h1>
              <p className="max-w-[600px] text-base lg:text-[20px] font-medium leading-[1.5] tracking-[-0.075em] text-[#515151]">
                We're strategists, creators and growth experts who believe social media should drive
                real business results — not just look pretty. Every brand deserves a social
                presence that actually works.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center">
                {avatars.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className={`size-[57px] rounded-[10px] border border-white object-cover ${
                      i < avatars.length - 1 ? "-mr-5" : ""
                    }`}
                  />
                ))}
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-5 fill-[#FF2626] text-[#FF2626]" />
                  ))}
                </div>
                <p className="text-base font-semibold leading-[1.4] tracking-[-0.05em] text-black">
                  Trusted by <span className="text-black/40">clients worldwide</span>
                </p>
              </div>
            </div>
          </div>

          {/* Portrait + floating award pills */}
          <div className="relative w-full lg:h-[1049.563px] lg:w-[47%] lg:shrink-0 xl:w-[600px]">
            <div className="aspect-[600/700] w-full overflow-hidden rounded-[20px] lg:aspect-auto lg:h-full">
              <img
                src={HERO_PORTRAIT}
                alt="Airnova founder portrait"
                className="w-full object-contain object-[center_bottom]"
              />
            </div>
            <AwardPill
              floatIndex={0}
              className="left-4 top-[48%] w-[236px] lg:left-[56%] lg:top-[440px] xl:left-[336px]"
            >
              Best Design Award 2026
            </AwardPill>
            <AwardPill
              floatIndex={1}
              className="right-4 top-[60%] w-[201px] lg:left-[9.333%] lg:right-auto lg:top-[563.409px] xl:left-[56px]"
            >
              15+ Years in Design
            </AwardPill>
            <AwardPill
              floatIndex={2}
              className="left-4 bottom-8 w-[250px] lg:left-[53.667%] lg:top-[676px] lg:bottom-auto xl:left-[322px]"
            >
              Global Startup Award 2027
            </AwardPill>
          </div>
        </div>
      </div>
    </section>
  );
}

function AwardPill({
  children,
  className = "",
  floatIndex = 0,
}: {
  children: ReactNode;
  className?: string;
  floatIndex?: number;
}) {
  const durations = [5.2, 6.4, 7.1];
  const delays = [0, 0.8, 1.6];
  return (
    <div
      className={`animate-award-float absolute inline-flex h-11 items-center justify-center rounded-[80px] bg-white/10 px-6 py-2.5 backdrop-blur-[10.4px] ${className}`}
      style={{
        animationDuration: `${durations[floatIndex % durations.length]}s`,
        animationDelay: `${delays[floatIndex % delays.length]}s`,
      }}
    >
      <ul className="list-disc whitespace-nowrap pl-6 text-sm font-medium leading-[1.5] tracking-[-0.075em] text-white lg:text-base">
        <li>{children}</li>
      </ul>
    </div>
  );
}

/* ---------- Logo grid ---------- */

type LogoItem = { src: string; w: number; h: number };

function LogoGrid() {
  const logos: LogoItem[] = [
    { src: aboutLogoCircle.url, w: 120, h: 120 },
    { src: aboutLogoLuyu.url, w: 180, h: 72 },
    { src: aboutLogoLoqo.url, w: 180, h: 40.909 },
    { src: aboutLogoInfinity.url, w: 140, h: 53.846 },
    { src: aboutLogoIpsum.url, w: 150, h: 35.503 },
    { src: aboutLogoN7.url, w: 120, h: 77.288 },
  ];
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  // Reveal thresholds spread across the section's scroll progress.
  const revealRange = 0.95;
  const thresholds = logos.map(
    (_, i) => ((i + 0.6) / logos.length) * revealRange,
  );

  const [revealed, setRevealed] = useState<boolean[]>(() =>
    logos.map(() => false),
  );
  const lastProgress = useRef(0);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const goingDown = p >= lastProgress.current;
    lastProgress.current = p;
    setRevealed((prev) => {
      let changed = false;
      const next = prev.map((wasRevealed, i) => {
        const t = thresholds[i];
        if (goingDown && !wasRevealed && p >= t) {
          changed = true;
          return true;
        }
        if (!goingDown && wasRevealed && p < t) {
          changed = true;
          return false;
        }
        return wasRevealed;
      });
      return changed ? next : prev;
    });
  });

  // ~50vh of scroll per logo keeps the sticky stage long enough to reveal
  // every tile without leaving a long empty tail before the next section.
  const scrollVh = logos.length * 50;
  return (
    <section
      ref={containerRef}
      className="relative bg-[#f5f5f5]"
      style={{ height: `${scrollVh}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center justify-center py-10 lg:py-16">
        <div className="container-x grid grid-cols-2 gap-2 lg:grid-cols-3">
          {logos.map((logo, i) => (
            <LogoTile key={i} logo={logo} revealed={revealed[i]} />
          ))}
        </div>
      </div>
    </section>
  );
}

function LogoTile({ logo, revealed }: { logo: LogoItem; revealed: boolean }) {
  return (
    <div className="relative flex h-[200px] items-center justify-center overflow-clip rounded-[30px] bg-white p-8 md:h-[280px] md:p-12 lg:h-[400px] lg:p-20">
      <motion.img
        src={logo.src}
        alt=""
        className="max-h-[60%] max-w-[60%] object-contain"
        initial={false}
        animate={{
          opacity: revealed ? 1 : 0,
          y: revealed ? 0 : 40,
          scale: revealed ? 1 : 0.85,
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ aspectRatio: `${logo.w} / ${logo.h}` }}
      />
      <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-base font-semibold leading-[1.4] tracking-[-0.055em] text-[#282828]">
        /2027
      </span>
    </div>
  );
}

/* ---------- Results sections ---------- */

function CountUpStat({ value }: { value: string }) {
  const match = value.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  const prefix = match?.[1] ?? "";
  const target = match ? parseFloat(match[2]) : 0;
  const suffix = match?.[3] ?? "";
  const decimals = match?.[2].includes(".") ? match[2].split(".")[1].length : 0;

  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) =>
    decimals
      ? v.toFixed(decimals)
      : Math.round(v).toLocaleString(),
  );
  const [display, setDisplay] = useState(decimals ? (0).toFixed(decimals) : "0");

  useEffect(() => {
    const unsub = rounded.on("change", setDisplay);
    return () => unsub();
  }, [rounded]);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, target, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [inView, mv, target]);

  return (
    <p
      ref={ref}
      className="text-[clamp(32px,5vw,48px)] font-semibold leading-[1.2] tracking-[-0.065em] text-[#070606] tabular-nums"
    >
      {prefix}
      {display}
      {suffix}
    </p>
  );
}

function ResultsBlock({
  reverse = false,
  image,
  badge,
  heading,
  italic,
  trailing,
  description,
  stats,
}: {
  reverse?: boolean;
  image: string;
  badge: string;
  heading: string;
  italic: string;
  trailing?: string;
  description: string;
  stats: { value: string; title: string; sub: string }[];
}) {
  const textCol = (
    <div className="flex flex-col justify-between gap-16 lg:gap-[120px]">
      <div className="flex flex-col items-start gap-8">
        <Pill variant="white">{badge}</Pill>
        <div className="flex flex-col gap-4">
          <h2 className="text-[clamp(36px,6vw,72px)] font-semibold leading-[1.2] tracking-[-0.065em] text-[#070606]">
            {heading} <span className={`${serif} text-[#070606]/50`}>{italic}</span>
            {trailing ? ` ${trailing}` : ""}
          </h2>
          <p className="max-w-[600px] text-base font-medium leading-[1.5] tracking-[-0.075em] text-[#515151]">
            {description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {stats.map((s) => (
          <div
            key={s.title}
            className="flex flex-col justify-between gap-8 rounded-[20px] bg-white p-6 lg:p-8"
          >
            <CountUpStat value={s.value} />
            <div className="flex flex-col gap-2">
              <p className="text-[20px] font-medium leading-[1.5] tracking-[-0.075em] text-[#070606]">
                {s.title}
              </p>
              <p className="text-base font-medium leading-[1.5] tracking-[-0.075em] text-[#515151]">
                {s.sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const imgCol = (
    <div className="overflow-hidden rounded-[20px] lg:h-[671px]">
      <img src={image} alt="" className="h-full min-h-[420px] w-full object-cover lg:min-h-[671px]" />
    </div>
  );

  return (
    <section className={`bg-[#f5f5f5] py-16 ${reverse ? "lg:pb-28 lg:pt-14" : "lg:py-28"}`}>
      <div
        className={`container-x grid items-stretch gap-10 lg:gap-16 ${
          reverse ? "lg:grid-cols-[598fr_618fr]" : "lg:grid-cols-[618fr_598fr]"
        }`}
      >
        <div className={`contents ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
          {imgCol}
          {textCol}
        </div>
      </div>
    </section>
  );
}

/* ---------- How it works ---------- */

function IconResearch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 21H10C6.22876 21 4.34315 21 3.17157 19.8284C2 18.6569 2 16.7712 2 13V10C2 6.22876 2 4.34315 3.17157 3.17157C4.34315 2 6.22876 2 10 2H12C15.7712 2 17.6569 2 18.8284 3.17157C20 4.34315 20 6.22876 20 10V10.5" />
      <path d="M17.4069 14.4036C17.6192 13.8655 18.3808 13.8655 18.5931 14.4036L18.6298 14.4969C19.1482 15.8113 20.1887 16.8518 21.5031 17.3702L21.5964 17.4069C22.1345 17.6192 22.1345 18.3808 21.5964 18.5931L21.5031 18.6298C20.1887 19.1482 19.1482 20.1887 18.6298 21.5031L18.5931 21.5964C18.3808 22.1345 17.6192 22.1345 17.4069 21.5964L17.3702 21.5031C16.8518 20.1887 15.8113 19.1482 14.4969 18.6298L14.4036 18.5931C13.8655 18.3808 13.8655 17.6192 14.4036 17.4069L14.4969 17.3702C15.8113 16.8518 16.8518 15.8113 17.3702 14.4969L17.4069 14.4036Z" />
      <path d="M7 7H15M7 11.5H15M7 16H11" />
    </svg>
  );
}

function IconStrategy({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 8C15.6501 8.06476 16.0876 8.21113 16.4142 8.54192C17 9.13523 17 10.0902 17 12C17 13.9098 17 14.8648 16.4142 15.4581C16.0876 15.7889 15.6501 15.9352 15 16M9 16C8.34994 15.9352 7.91238 15.7889 7.58579 15.4581C7 14.8648 7 13.9098 7 12C7 10.0902 7 9.13523 7.58579 8.54192C7.91238 8.21113 8.34994 8.06476 9 8" />
      <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" />
    </svg>
  );
}

function IconDesign({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.5}>
      <path d="M12 8C16.4183 8 20 6.65685 20 5C20 3.34315 16.4183 2 12 2C7.58172 2 4 3.34315 4 5C4 6.65685 7.58172 8 12 8Z" />
      <path d="M20 12C20 13.6569 16.4183 15 12 15C7.58172 15 4 13.6569 4 12" />
      <path d="M20 5V19C20 20.6569 16.4183 22 12 22C7.58172 22 4 20.6569 4 19V5" />
      <path d="M8 8V10" />
      <path d="M8 15V17" />
    </svg>
  );
}

const STEPS = [
  {
    n: "01",
    Icon: IconDesign,
    title: "Research & Discovery",
    body: "We start by understanding your brand goals and target audience to ensure the design aligns perfectly.",
  },
  {
    n: "02",
    Icon: IconStrategy,
    title: "Strategy & Planning",
    body: "We create a clear roadmap and design strategy that defines the structure, flow and objectives of the project.",
  },
  {
    n: "03",
    Icon: IconResearch,
    title: "Design & Prototyping",
    body: "Our team crafts visually appealing and user-friendly designs, building interactive prototypes.",
  },
];

function HowItWorks() {
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
    <section className="bg-white">
      <div ref={scrollRef} className="relative w-full lg:h-[220vh]">
        <div className="w-full px-[10px] py-16 lg:sticky lg:top-0 lg:flex lg:min-h-screen lg:items-center lg:px-[30px] lg:py-20">
          <div className="container-x-inset flex w-full flex-col items-center gap-16">
            <div className="flex flex-col items-center gap-6">
              <Pill>How it works</Pill>
              <h2 className="max-w-[650px] text-center text-[clamp(32px,5vw,56px)] font-semibold leading-[1.2] tracking-[-0.065em] text-black">
                How We Turn Ideas Into{" "}
                <span className={`${serif} text-black/50`}>creative</span> Results
              </h2>
            </div>

            <div className="relative w-full">
              <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:block lg:h-[360px]">
                {STEPS.map((s, i) => (
                  <div
                    key={s.n}
                    style={cardStyle(i)}
                    className={`flex flex-col gap-12 rounded-[20px] bg-[#f5f5f5] p-6 ${i >= 2 ? "sm:col-span-2 lg:col-span-1" : ""} lg:absolute lg:left-1/2 lg:top-1/2 lg:w-[clamp(320px,28vw,420px)] lg:will-change-transform`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="grid size-14 place-items-center rounded-[11px] bg-[#070606]">
                        <s.Icon className="size-6 text-white" />
                      </div>
                      <p className="text-[20px] font-medium leading-[1.5] tracking-[-0.075em] text-black">
                        {s.n}
                      </p>
                    </div>
                    <div className="flex flex-col gap-4">
                      <h3 className="text-[24px] font-semibold leading-[1.2] tracking-[-0.065em] text-black">
                        {s.title}
                      </h3>
                      <p className="text-base font-medium leading-[1.5] tracking-[-0.075em] text-[#515151]">
                        {s.body}
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

/* ---------- Team ---------- */

const TEAM = [
  { name: "Sophia Bennett", role: "Product Designer", img: TEAM_1 },
  { name: "Liam Anderson", role: "Frontend Developer", img: TEAM_2 },
  { name: "Noah Mitchel", role: "Webflow Developer", img: TEAM_3 },
  { name: "Olivia Parker", role: "Creative Director", img: TEAM_4 },
];

function Team() {
  return (
    <section className="overflow-clip bg-[#f5f5f5] px-[10px] py-16 lg:px-[30px] lg:py-28">
      <div className="container-x-inset flex flex-col items-center gap-16">
        <div className="flex flex-col items-center gap-4 text-center">
          <Pill variant="white">Our Team</Pill>
          <h2 className="max-w-[560px] text-[clamp(32px,5vw,56px)] font-semibold leading-[1.2] tracking-[-0.065em] text-[#070606]">
            Meet the <span className={`${serif} text-[#070606]/50`}>team behind</span> your success.
          </h2>
          <p className="max-w-[560px] text-base font-medium leading-[1.5] tracking-[-0.075em] text-[#515151]">
            Our team is made up of passionate designers and creative thinkers who are dedicated to
            delivering exceptional digital experiences.
          </p>
        </div>
        <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {TEAM.map((m) => (
            <div key={m.name} className="flex flex-col gap-2 lg:gap-4">
              <div className="overflow-hidden rounded-[20px] border-[5px] border-white">
                <img
                  src={m.img}
                  alt={m.name}
                  className="h-[400px] w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[24px] font-semibold leading-[1.2] tracking-[-0.065em] text-black">
                  {m.name}
                </p>
                <p className="text-base font-medium leading-[1.5] tracking-[-0.075em] text-[#515151]">
                  {m.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ (matches Home) ---------- */

const FAQS = [
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
          <Pill>FAQ</Pill>
          <h2 className="max-w-[650px] text-center text-[clamp(28px,4.5vw,56px)] font-semibold leading-[1.2] tracking-[-0.065em] text-[#070606]">
            Answers to <span className={`${serif} text-[#070606]/50`}>your most</span> common
            questions
          </h2>
          <p className="max-w-[617px] text-center text-base font-medium leading-[1.5] tracking-[-0.075em] text-[#515151]">
            Find answers to some of the most common questions about our design services, process
            and collaboration. This section helps you quickly understand how we work.
          </p>
        </div>
        <div className="flex w-full max-w-[900px] flex-col gap-3 bg-[#f5f5f5] p-4 sm:gap-6 sm:p-8">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <button
                key={f.q}
                onClick={() => setOpen(isOpen ? -1 : i)}
                data-no-hover-fx
                className="block w-full cursor-pointer rounded-[10px] bg-white px-6 py-4 text-left transition"
              >
                <div className="flex items-center justify-between gap-8 sm:gap-16">
                  <span className="text-[clamp(16px,1.8vw,26px)] font-medium leading-[1.5] tracking-[-0.075em] text-black">
                    {f.q}
                  </span>
                  <span className="grid size-[38px] sm:size-[54px] shrink-0 place-items-center">
                    <span className="grid size-[28px] sm:size-[38px] place-items-center rounded-full bg-[#070606] text-white">
                      {isOpen ? (
                        <Minus className="size-4" strokeWidth={2.5} />
                      ) : (
                        <Plus className="size-4" strokeWidth={2.5} />
                      )}
                    </span>
                  </span>
                </div>
                <div
                  className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isOpen ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <p className="overflow-hidden text-base font-medium leading-[1.5] tracking-[-0.075em] text-[#515151]">
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

/* ---------- Page ---------- */

function AboutPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-background font-sans text-foreground antialiased">
      <Nav />
      <AboutHero />
      <LogoGrid />
      <ResultsBlock
        image={RESULTS_IMG}
        badge="Client results"
        heading="Delivering"
        italic="results"
        trailing="That Matter"
        description="We focus on creating design solutions that deliver meaningful and measurable results for our clients. By combining creativity with strategic thinking we help brands improve their digital presence and engage."
        stats={[
          { value: "400+", title: "Client Views", sub: "In the first 30 Day" },
          { value: "230%", title: "Engagement", sub: "Compared to Previous month" },
        ]}
      />
      <ResultsBlock
        reverse
        image={CREATIVE_IMG}
        badge="Client results"
        heading="Real Results from Our"
        italic="creative work"
        description="Our creative work is focused on delivering real value and measurable impact for our clients. Through thoughtful design, strategic thinking and attention to detail we help brands improve their digital presence."
        stats={[
          { value: "99%", title: "Client satisfaction", sub: "In the first 30 Day" },
          { value: "15+", title: "Experience", sub: "Years in Design" },
        ]}
      />
      <HowItWorks />
      <Team />
      <Faq />
      <Cta />
      <Footer />
    </main>
  );
}