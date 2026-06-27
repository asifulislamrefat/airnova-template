import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Cta } from "@/components/site/Cta";
import { BrandMark, Pill, serif } from "@/components/site/shared";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Airnova" },
      {
        name: "description",
        content:
          "Flexible pricing plans designed for startups, growing brands and businesses that need a steady flow of creative work.",
      },
      { property: "og:title", content: "Pricing — Airnova" },
      {
        property: "og:description",
        content:
          "Choose a monthly or annual plan and get consistent, high-quality design support from the Airnova team.",
      },
      { property: "og:url", content: "https://airnova-template.lovable.app/pricing" },
    ],
    links: [{ rel: "canonical", href: "https://airnova-template.lovable.app/pricing" }],
  }),
  component: PricingPage,
});

type Plan = {
  name: string;
  monthly: number;
  annual: number;
  description: string;
  features: string[];
  popular?: boolean;
  tone: "light" | "dark";
};

const PLANS: Plan[] = [
  {
    name: "Basic",
    monthly: 2000,
    annual: 1400,
    description: "For startups & small businesses needing consistent designs.",
    features: [
      "10 design requests/month",
      "Social Media & Marketing Assets",
      "Conceptual sketches and mood boards",
      "2 Revisions per request",
      "5-day turnaround per request",
    ],
    tone: "light",
  },
  {
    name: "Premium",
    monthly: 4500,
    annual: 3150,
    description: "For growing brands that need a steady flow of creative assets.",
    features: [
      "Unlimited design requests",
      "Web & UI/UX Design",
      "Motion Graphics & Animations",
      "Priority Support",
      "3-day turnaround per request",
    ],
    popular: true,
    tone: "dark",
  },
];

function BillingToggle({
  value,
  onChange,
}: {
  value: "monthly" | "annual";
  onChange: (v: "monthly" | "annual") => void;
}) {
  return (
    <div className="relative flex items-center rounded-full bg-white p-1 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
      <button
        type="button"
        onClick={() => onChange("monthly")}
        className="relative z-10 flex h-10 cursor-pointer items-center rounded-full px-6 text-base font-semibold tracking-[-0.055em]"
      >
        <span
          className={`transition-colors duration-300 ${
            value === "monthly" ? "text-white" : "text-black/60 hover:text-black"
          }`}
        >
          Monthly
        </span>
        {value === "monthly" && (
          <motion.span
            layoutId="billing-pill"
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            className="absolute inset-0 -z-10 rounded-full bg-[#282828]"
          />
        )}
      </button>
      <button
        type="button"
        onClick={() => onChange("annual")}
        className="relative z-10 flex h-10 cursor-pointer items-center gap-3 rounded-full pl-[18px] pr-1.5 text-base font-semibold tracking-[-0.055em]"
      >
        <span
          className={`transition-colors duration-300 ${
            value === "annual" ? "text-white" : "text-black/60 hover:text-black"
          }`}
        >
          Annual
        </span>
        <span className="inline-flex items-center justify-center rounded-full bg-[#f24700] px-[9px] py-1.5 text-[12px] font-semibold leading-none tracking-[-0.055em] text-white">
          SAVE 30%
        </span>
        {value === "annual" && (
          <motion.span
            layoutId="billing-pill"
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            className="absolute inset-0 -z-10 rounded-full bg-[#282828]"
          />
        )}
      </button>
    </div>
  );
}

function AnimatedPrice({ value }: { value: number }) {
  const mv = useMotionValue(value);
  const spring = useSpring(mv, { stiffness: 90, damping: 20, mass: 0.6 });
  const rounded = useTransform(spring, (latest) => `$${Math.round(latest)}`);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    mv.set(value);
  }, [value, mv]);

  useEffect(() => {
    return rounded.on("change", (v) => {
      if (ref.current) ref.current.textContent = v;
    });
  }, [rounded]);

  return <span ref={ref}>{`$${value}`}</span>;
}

function PricingCard({ plan, billing }: { plan: Plan; billing: "monthly" | "annual" }) {
  const dark = plan.tone === "dark";
  const price = billing === "monthly" ? plan.monthly : plan.annual;
  return (
    <div
      className={`flex flex-1 flex-col gap-12 rounded-lg p-8 lg:p-10 ${
        dark ? "bg-[#111418] text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-12">
          <div className="flex items-center justify-between">
            <h3
              className={`text-[32px] font-semibold leading-[1.2] tracking-[-0.065em] ${
                dark ? "text-white" : "text-black"
              }`}
            >
              {plan.name}
            </h3>
            {plan.popular && (
              <div className="flex h-14 items-center gap-2 rounded-full border border-[#eaeaea] bg-white py-1.5 pl-1.5 pr-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111418]">
                  <BrandMark size={20} dark={true} />
                </span>
                <span className="text-base font-semibold tracking-[-0.055em] text-[#111418]">
                  Most popular
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <p
              className={`leading-[1.2] tracking-[-0.065em] ${
                dark ? "text-white" : "text-[#111418]"
              }`}
            >
              <span className="inline-block text-[56px] font-semibold tabular-nums sm:text-[72px]">
                <AnimatedPrice value={price} />
              </span>
              <motion.span
                key={billing}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="ml-2 inline-block text-base font-medium tracking-[-0.075em]"
              >
                / {billing === "monthly" ? "monthly" : "annual"}
              </motion.span>
            </p>
            <p
              className={`max-w-[440px] text-base font-medium leading-[1.5] tracking-[-0.075em] ${
                dark ? "text-white/85" : "text-[#424242]"
              }`}
            >
              {plan.description}
            </p>
          </div>
        </div>
        <a
          href="#contact"
          data-hover-lift
          className={`inline-flex h-12 w-[271px] max-w-full items-center justify-between rounded-[80px] px-6 text-base font-medium leading-[1.5] tracking-[-0.075em] shadow-[0_4px_2px_rgba(0,0,0,0.16)] ${
            dark ? "bg-white text-[#070606]" : "bg-[#070606] text-white"
          }`}
        >
          <span>Choose This Plan</span>
          <ArrowRight className="h-5 w-5" />
        </a>
      </div>
      <div className="flex flex-col gap-8">
        <p
          className={`text-[18px] font-medium leading-[1.5] tracking-[-0.075em] ${
            dark ? "text-white" : "text-[#111418]"
          }`}
        >
          What's Included:
        </p>
        <ul className="flex flex-col gap-4">
          {plan.features.map((f) => (
            <li key={f} className="flex items-center gap-4">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#f24700]" />
              <span
                className={`text-base font-medium leading-[1.5] tracking-[-0.075em] ${
                  dark ? "text-white" : "text-[#424242]"
                }`}
              >
                {f}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  return (
    <main className="min-h-screen overflow-x-clip bg-background font-sans text-foreground antialiased">
      <Nav />
      <section className="bg-surface py-16 lg:py-28">
        <div className="container-x flex flex-col items-center gap-12 lg:gap-16">
          <div className="flex flex-col items-center gap-6 text-center">
            <Pill variant="white">Pricing</Pill>
            <h1 className="max-w-[700px] text-[clamp(40px,8vw,80px)] font-semibold leading-[1.1] tracking-[-0.065em] text-black">
              Flexible Plans <span className={`${serif} text-black/50`}>designed</span>
            </h1>
            <BillingToggle value={billing} onChange={setBilling} />
          </div>

          <h2 className="sr-only">Pricing plans</h2>
          <div className="flex w-full flex-col gap-6 lg:flex-row">
            {PLANS.map((plan) => (
              <PricingCard key={plan.name} plan={plan} billing={billing} />
            ))}
          </div>
        </div>
      </section>
      <Cta />
      <Footer />
    </main>
  );
}