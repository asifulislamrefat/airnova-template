import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Cta } from "@/components/site/Cta";
import { Faq } from "@/components/site/Faq";
import { Pill, serif } from "@/components/site/shared";
import { PROJECTS } from "@/lib/projects";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — Airnova" },
      {
        name: "description",
        content:
          "A showcase of Airnova's latest design work — brand identities, websites and digital products built for ambitious teams.",
      },
      { property: "og:title", content: "Projects — Airnova" },
      {
        property: "og:description",
        content:
          "Explore a selection of creative projects that reflect our passion for design and innovation.",
      },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-background font-sans text-foreground antialiased">
      <Nav />
      <section className="bg-white py-16 lg:py-28">
        <div className="container-x flex flex-col items-center gap-12 lg:gap-16">
          <div className="flex flex-col items-center gap-4 text-center">
            <Pill>Our Project</Pill>
            <h1 className="max-w-[700px] text-[clamp(40px,8vw,80px)] font-semibold leading-[1.1] tracking-[-0.065em] text-black">
              A <span className={`${serif} text-black/50`}>Showcase</span> of Our Creative Design Projects
            </h1>
            <p className="max-w-[605px] text-base font-medium leading-[1.5] tracking-[-0.075em] text-[#515151]">
              Explore a selection of our creative projects that showcase our passion for design and
              innovation. Each project reflects our commitment to delivering work that matters.
            </p>
          </div>

          <h2 className="sr-only">Selected projects</h2>
          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
            {PROJECTS.map((p) => (
              <Link
                key={p.slug}
                to="/projects/$slug"
                params={{ slug: p.slug }}
                className="group flex flex-col gap-2"
              >
                <div className="overflow-hidden rounded-[20px] bg-black/5">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-[375px] lg:h-[500px] w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 rounded-[10px] bg-[#f5f5f5] px-2.5 py-2 sm:gap-8 sm:px-6 sm:py-3">
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <h3 className="text-[16px] font-semibold leading-[1.2] tracking-[-0.065em] text-black sm:text-[24px]">
                      {p.name}
                    </h3>
                    <p className="text-[10px] sm:text-base font-medium leading-[1.5] tracking-[-0.075em] text-[#515151]">
                      {p.year}
                    </p>
                  </div>
                  <span className="shrink-0 text-right text-[10px] sm:text-[18px] font-medium leading-[1.5] tracking-[-0.075em] text-[#515151]">
                    {p.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Faq />
      <Cta />
      <Footer />
    </main>
  );
}