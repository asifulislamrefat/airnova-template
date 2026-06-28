import { createFileRoute, Link } from "@tanstack/react-router";

import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Cta } from "@/components/site/Cta";
import { Faq } from "@/components/site/Faq";
import { Pill, serif } from "@/components/site/shared";
import { Testimonials } from "@/components/site/Testimonials";

import iconBrand from "@/assets/services/icon-brand.svg";
import iconConsulting from "@/assets/services/icon-consulting.svg";
import iconPrototype from "@/assets/services/icon-prototype.svg";
import iconEcommerce from "@/assets/services/icon-ecommerce.svg";
import iconDashboard from "@/assets/services/icon-dashboard.svg";
import iconGraphic from "@/assets/services/icon-graphic.svg";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Services — Airnova" },
      {
        name: "description",
        content:
          "Brand identity, web and product design services that help your brand stand out in a competitive digital world.",
      },
      { property: "og:title", content: "Services — Airnova" },
      {
        property: "og:description",
        content:
          "Design solutions that make your brand stand — identity, consulting, prototyping, e-commerce, dashboards and graphics.",
      },
      { property: "og:url", content: "https://airnova-template.lovable.app/services" },
    ],
    links: [{ rel: "canonical", href: "https://airnova-template.lovable.app/services" }],
  }),
  component: ServicesPage,
});

type Service = {
  title: string;
  description: string;
  icon: string;
  slug: string;
};

const SERVICES: Service[] = [
  {
    title: "Brand Identity Design",
    description: "Designing logos, color schemes and visuals that reflect your brand.",
    icon: iconBrand,
    slug: "brand-identity-design",
  },
  {
    title: "Creative Consulting",
    description: "Providing guidance to improve design strategy and digital presence.",
    icon: iconConsulting,
    slug: "creative-consulting",
  },
  {
    title: "Prototype & Wireframing",
    description: "Building interactive prototypes to visualize your digital products.",
    icon: iconPrototype,
    slug: "prototype-wireframing",
  },
  {
    title: "E-commerce Design",
    description: "Designing online stores with a focus on usability, branding and conversions.",
    icon: iconEcommerce,
    slug: "e-commerce-design",
  },
  {
    title: "Dashboard & SaaS Design",
    description: "Building clean and efficient interfaces for dashboards and SaaS products.",
    icon: iconDashboard,
    slug: "dashboard-saas-design",
  },
  {
    title: "Graphic Design",
    description: "Developing creative graphics, banners and promotional visuals.",
    icon: iconGraphic,
    slug: "graphic-design",
  },
];

function ServicesHero() {
  return (
    <section className="bg-[#f5f5f5] py-16 lg:py-28">
      <div className="container-x flex flex-col items-center gap-12 lg:gap-16">
        <div className="flex flex-col items-center gap-2">
          <Pill variant="white">Our Services</Pill>
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="max-w-[864px] text-[clamp(40px,7vw,80px)] font-semibold leading-[1.2] tracking-[-0.065em] text-[#070606]">
              Design solutions that make your{" "}
              <span className={`${serif} text-black/40`}>brand stand</span>
            </h1>
            <p className="max-w-[605px] text-[16px] font-medium leading-[1.5] tracking-[-0.075em] text-[#515151]">
              We create thoughtful and visually compelling design solutions that help your brand
              stand out in a competitive digital world. By combining creativity with strategy, our
              designs deliver experiences that drive real results.
            </p>
          </div>
        </div>

        <h2 className="sr-only">What we offer</h2>
        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ title, description, icon, slug }) => (
            <Link
              key={title}
              to="/services/$slug"
              params={{ slug }}
              data-hover-lift
              className="flex flex-col items-start gap-12 rounded-[20px] bg-white p-8 transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] lg:gap-16"
            >
              <img src={icon} alt="" aria-hidden="true" className="size-14" />
              <div className="flex flex-col gap-2">
                <h3 className="text-[clamp(22px,2.2vw,28px)] font-semibold leading-[1.2] tracking-[-0.065em] text-[#070606]">
                  {title}
                </h3>
                <p className="text-[16px] font-medium leading-[1.5] tracking-[-0.075em] text-[#515151]">
                  {description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-white font-sans text-foreground antialiased">
      <Nav />
      <ServicesHero />
      <Faq />
      <Testimonials />
      <Cta />
      <Footer />
    </main>
  );
}