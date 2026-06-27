import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, type MotionValue } from "framer-motion";

import { Pill, serif } from "@/components/site/shared";
import { Nav } from "@/components/site/Nav";
import { Cta } from "@/components/site/Cta";
import { Footer } from "@/components/site/Footer";

import studioSpace from "@/assets/studio-space.webp.asset.json";
import studioFlatlay from "@/assets/studio-flatlay.webp.asset.json";
import studioCraft from "@/assets/studio-craft.webp.asset.json";
import team1 from "@/assets/team-1.webp.asset.json";
import team2 from "@/assets/team-2.webp.asset.json";
import team3 from "@/assets/team-3.webp.asset.json";
import team4 from "@/assets/team-4.webp.asset.json";

const HERO_IMG = studioSpace.url;

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Studio — Airnova" },
      {
        name: "description",
        content:
          "Step inside Airnova — a small, deliberate studio crafting brand identities, motion and digital systems for ambitious teams.",
      },
      { property: "og:title", content: "Studio — Airnova" },
      {
        property: "og:description",
        content:
          "A look inside the rooms, rituals and people behind Airnova's design practice.",
      },
      { property: "og:image", content: HERO_IMG },
      { name: "twitter:image", content: HERO_IMG },
      { property: "og:url", content: "https://airnova-template.lovable.app/studio" },
    ],
    links: [{ rel: "canonical", href: "https://airnova-template.lovable.app/studio" }],
  }),
  component: StudioPage,
});

/* ---------- Hero ---------- */

function StudioHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#070606] px-[5%] pb-20 pt-16 lg:px-0 lg:pb-32 lg:pt-24"
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-12 lg:w-[calc(100%_-_160px)] lg:gap-20">
        <div className="flex flex-col items-start gap-6">
          <Pill variant="white">The Studio</Pill>
          <h1 className="max-w-[1100px] text-[clamp(48px,9vw,140px)] font-semibold leading-[0.95] tracking-[-0.075em] text-white">
            A small room{" "}
            <span className={`${serif} text-white/50`}>with loud</span> ideas
          </h1>
          <p className="max-w-[640px] text-base lg:text-[20px] font-medium leading-[1.5] tracking-[-0.075em] text-white/75">
            Airnova is twelve designers, writers and engineers in one quiet
            studio — building brand systems, motion and product surfaces for
            teams that refuse to sound like everyone else.
          </p>
        </div>

        <motion.div
          className="relative aspect-[16/10] w-full overflow-hidden rounded-[20px] bg-white lg:h-[640px] lg:aspect-auto"
          style={{ y }}
        >
          <motion.img
            src={HERO_IMG}
            alt="Inside the Airnova studio"
            width={1280}
            height={896}
            className="absolute inset-0 size-full object-cover"
            style={{ scale }}
          />
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Manifesto / sticky reveal ---------- */

const MANIFESTO = [
  "We design slowly.",
  "We argue about kerning.",
  "We chase tension over polish.",
  "We build for people, not portfolios.",
];

function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={ref}
      className="relative bg-[#f5f5f5]"
      style={{ height: `${MANIFESTO.length * 70}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center px-[5%] lg:px-0">
        <div className="mx-auto w-full max-w-[1280px] lg:w-[calc(100%_-_160px)]">
          <div className="relative z-10 mb-10">
            <Pill variant="white">Manifesto</Pill>
          </div>
          <div className="relative flex flex-col gap-2">
            {MANIFESTO.map((line, i) => (
              <ManifestoLine
                key={i}
                index={i}
                total={MANIFESTO.length}
                progress={scrollYProgress}
              >
                {line}
              </ManifestoLine>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ManifestoLine({
  index,
  total,
  progress,
  children,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  children: string;
}) {
  const step = 1 / total;
  const start = index * step;
  const opacity = useTransform(
    progress,
    [start, start + step * 0.35, start + step * 0.85, start + step],
    [0.12, 1, 1, 0.18],
  );
  const y = useTransform(progress, [start, start + step * 0.5], [40, 0]);

  return (
    <motion.p
      style={{ opacity, y }}
      className="text-[clamp(40px,7vw,96px)] font-semibold leading-[1.05] tracking-[-0.075em] text-[#070606]"
    >
      {index % 2 === 1 ? (
        <span className={`${serif} text-[#070606]/70`}>{children}</span>
      ) : (
        children
      )}
    </motion.p>
  );
}

/* ---------- Horizontal gallery ---------- */

const GALLERY = [
  { src: studioSpace.url, label: "The Room — Brooklyn, NY" },
  { src: studioFlatlay.url, label: "Identity Studies — 2026" },
  { src: studioCraft.url, label: "Mark-making, by hand" },
  { src: studioSpace.url, label: "Quiet hours, 7am" },
];

function HorizontalGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const [distance, setDistance] = useState(0);
  const [vh, setVh] = useState(220);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const d = Math.max(0, track.scrollWidth - window.innerWidth);
      setDistance(d);
      setVh(Math.max(180, (d / window.innerHeight) * 100 + 120));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  return (
    <section
      ref={ref}
      className="relative bg-[#070606]"
      style={{ height: `${vh}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mb-8 px-[5%] lg:px-20">
          <Pill variant="white">Inside</Pill>
          <h2 className="mt-6 max-w-[800px] text-[clamp(34px,5vw,64px)] font-semibold leading-[1.1] tracking-[-0.065em] text-white">
            Four corners,{" "}
            <span className={`${serif} text-white/50`}>one obsession</span>
          </h2>
        </div>
        <motion.div ref={trackRef} style={{ x }} className="flex gap-6 px-[5%] lg:gap-10 lg:px-20">
          {GALLERY.map((g, i) => (
            <div
              key={i}
              className="relative h-[60vh] w-[78vw] shrink-0 overflow-hidden rounded-[20px] bg-white sm:w-[60vw] lg:h-[520px] lg:w-[640px]"
            >
              <img
                src={g.src}
                alt={g.label}
                loading="lazy"
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-linear-to-t from-black/70 to-transparent p-6 lg:p-8">
                <p className="text-base font-medium leading-[1.4] tracking-[-0.05em] text-white">
                  {g.label}
                </p>
                <p className="text-base font-semibold leading-[1.4] tracking-[-0.05em] text-white/75">
                  0{i + 1} / 0{GALLERY.length}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Rituals ---------- */

const RITUALS = [
  {
    time: "07:00",
    title: "Slow Mornings",
    body: "Espresso, a stack of reference books, no Slack until 9. Ideas need silence before they need feedback.",
  },
  {
    time: "10:30",
    title: "Wall Walks",
    body: "We print everything. The whole studio steps back from their screens and reviews work pinned to the wall.",
  },
  {
    time: "14:00",
    title: "Kill Your Darlings",
    body: "Each project gets a brutally honest internal critique. The best ideas survive being argued with.",
  },
  {
    time: "18:30",
    title: "Close The Book",
    body: "Tools down, notebooks closed. Tomorrow's clarity is built on tonight's rest.",
  },
];

function Rituals() {
  return (
    <section className="bg-[#f5f5f5] px-[5%] py-20 lg:px-0 lg:py-32">
      <div className="mx-auto w-full max-w-[1280px] lg:w-[calc(100%_-_160px)]">
        <div className="mb-16 flex flex-col items-start gap-6 lg:mb-24">
          <Pill variant="white">Rituals</Pill>
          <h2 className="max-w-[900px] text-[clamp(36px,6vw,72px)] font-semibold leading-[1.1] tracking-[-0.065em] text-[#070606]">
            A day in the{" "}
            <span className={`${serif} text-[#070606]/50`}>studio</span>
          </h2>
        </div>
        <ol className="flex flex-col gap-4 lg:gap-6">
          {RITUALS.map((r, i) => (
            <RitualRow key={r.title} ritual={r} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function RitualRow({
  ritual,
  index,
}: {
  ritual: (typeof RITUALS)[number];
  index: number;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group grid grid-cols-1 gap-4 rounded-[20px] bg-white p-6 transition-colors hover:bg-[#070606] lg:grid-cols-[120px_minmax(260px,auto)_1fr] lg:items-center lg:gap-12 lg:p-10"
    >
      <span className="text-[20px] font-semibold leading-[1.2] tracking-[-0.065em] text-[#070606]/70 group-hover:text-white/70">
        {ritual.time}
      </span>
      <h3 className="whitespace-nowrap text-[clamp(22px,2.2vw,28px)] font-semibold leading-[1.15] tracking-[-0.065em] text-[#070606] group-hover:text-white">
        {ritual.title}
      </h3>
      <p className="max-w-[640px] text-base font-medium leading-[1.5] tracking-[-0.075em] text-[#515151] group-hover:text-white/70">
        {ritual.body}
      </p>
    </motion.li>
  );
}

/* ---------- Disciplines marquee ---------- */

const DISCIPLINES = [
  "Brand Identity",
  "Editorial",
  "Motion",
  "Product Design",
  "Naming",
  "Type Design",
  "Packaging",
  "Sound",
  "Web Engineering",
  "Art Direction",
];

function DisciplinesMarquee() {
  const row = [...DISCIPLINES, ...DISCIPLINES];
  return (
    <section className="overflow-hidden bg-[#070606] py-20 lg:py-28">
      <div className="relative">
        <motion.div
          className="flex w-max items-center gap-12 whitespace-nowrap pr-12"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, ease: "linear", repeat: Infinity }}
        >
          {row.map((d, i) => (
            <span
              key={i}
              className="flex items-center gap-12 text-[clamp(48px,9vw,128px)] font-semibold leading-none tracking-[-0.075em] text-white"
            >
              {d}
              <span className="text-white/75">/</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- People ---------- */

const PEOPLE = [
  { name: "Lena Mori", role: "Founder, Creative Director", img: team1.url },
  { name: "Jonas Reyes", role: "Design Director", img: team2.url },
  { name: "Ada Whitfield", role: "Brand Lead", img: team3.url },
  { name: "Saul Hartmann", role: "Motion & Web", img: team4.url },
];

function People() {
  return (
    <section className="bg-white px-[5%] py-20 lg:px-0 lg:py-32">
      <div className="mx-auto w-full max-w-[1280px] lg:w-[calc(100%_-_160px)]">
        <div className="mb-12 flex flex-col items-start gap-6 lg:mb-20">
          <Pill>People</Pill>
          <h2 className="max-w-[900px] text-[clamp(36px,6vw,72px)] font-semibold leading-[1.1] tracking-[-0.065em] text-[#070606]">
            The twelve{" "}
            <span className={`${serif} text-[#070606]/50`}>behind the work</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {PEOPLE.map((p, i) => (
            <PersonCard key={p.name} person={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PersonCard({
  person,
  index,
}: {
  person: (typeof PEOPLE)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col gap-4"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[20px] bg-[#f5f5f5]">
        <img
          src={person.img}
          alt={person.name}
          loading="lazy"
          className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-[20px] font-semibold leading-[1.3] tracking-[-0.065em] text-[#070606]">
          {person.name}
        </p>
        <p className="text-base font-medium leading-[1.5] tracking-[-0.075em] text-[#515151]">
          {person.role}
        </p>
      </div>
    </motion.div>
  );
}

/* ---------- Page ---------- */

function StudioPage() {
  return (
    <main className="bg-white">
      <Nav />
      <StudioHero />
      <Manifesto />
      <HorizontalGallery />
      <Rituals />
      <DisciplinesMarquee />
      <People />
      <Cta />
      <Footer />
    </main>
  );
}
