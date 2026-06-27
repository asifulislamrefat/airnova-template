import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Cta } from "@/components/site/Cta";
import { Faq } from "@/components/site/Faq";
import { AUTHOR, getProject } from "@/lib/projects";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.project;
    if (!p) return { meta: [{ title: "Project — Airnova" }] };
    const url = `https://airnova-template.lovable.app/projects/${p.slug}`;
    return {
      meta: [
        { title: `${p.name} — Airnova` },
        { name: "description", content: p.summary.slice(0, 160) },
        { property: "og:title", content: `${p.name} — Airnova` },
        { property: "og:description", content: p.summary.slice(0, 160) },
        { property: "og:image", content: p.image },
        { name: "twitter:image", content: p.image },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  notFoundComponent: () => (
    <main className="grid min-h-screen place-items-center bg-background px-6 text-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-semibold tracking-[-0.05em]">Project not found</h1>
        <Link
          to="/projects"
          className="inline-flex h-12 items-center rounded-[80px] bg-[#070606] px-6 text-base font-medium text-white"
        >
          Back to Projects
        </Link>
      </div>
    </main>
  ),
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { project: p } = Route.useLoaderData();
  return (
    <main className="min-h-screen overflow-x-clip bg-background font-sans text-foreground antialiased">
      <Nav />
      <section className="bg-white pt-10 pb-16 lg:pt-16 lg:pb-28">
        <div className="container-x flex flex-col gap-10 lg:gap-16">
          {/* Header */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              {p.tags.map((t: string) => (
                <span
                  key={t}
                  className="inline-flex h-8 items-center rounded-[80px] border border-black/20 bg-[#f5f5f5] px-4 text-base font-medium leading-[1.5] tracking-[-0.075em] text-black"
                >
                  {t}
                </span>
              ))}
            </div>
            <h1 className="text-[clamp(40px,8vw,80px)] font-semibold leading-[1.1] tracking-[-0.065em] text-black">
              {p.name}
            </h1>
            <div className="overflow-hidden rounded-[20px]">
              <img
                src={p.image}
                alt={p.name}
                className="aspect-[16/10] w-full object-cover lg:aspect-auto lg:h-[700px]"
              />
            </div>
          </div>

          {/* Intro + author + summary */}
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">
            <div className="flex shrink-0 flex-col gap-8 lg:w-[370px]">
              <p className="text-base font-medium leading-[1.5] tracking-[-0.075em] text-[#616161]">
                {p.intro}
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={AUTHOR.avatar}
                  alt={AUTHOR.name}
                  className="size-14 rounded-full object-cover"
                />
                <div className="flex flex-col gap-1">
                  <p className="text-[20px] font-semibold leading-[1.4] tracking-[-0.055em] text-black">
                    {AUTHOR.name}
                  </p>
                  <p className="text-base font-medium leading-[1.4] tracking-[-0.055em] text-[#616161]">
                    {AUTHOR.role}
                  </p>
                </div>
              </div>
            </div>
            <p className="flex-1 text-[clamp(22px,2.4vw,32px)] font-semibold leading-[1.2] tracking-[-0.065em] text-[#282828]">
              {p.summary}
            </p>
          </div>

          {/* Secondary image */}
          <div className="overflow-hidden rounded-[10px]">
            <img
              src={p.secondaryImage}
              alt=""
              className="aspect-[16/10] w-full object-cover lg:aspect-auto lg:h-[700px]"
            />
          </div>

          {/* Creative challenges */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-14">
            <p className="shrink-0 text-[20px] font-medium leading-[1.5] tracking-[-0.075em] text-[#616161] lg:w-[260px]">
              Creative challenges
            </p>
            <div className="flex max-w-[900px] flex-1 flex-col gap-6">
              <p className="text-[clamp(22px,2.4vw,32px)] font-semibold leading-[1.2] tracking-[-0.065em] text-[#282828]">
                {p.challengeHeadline1}
              </p>
              <p className="text-[clamp(22px,2.4vw,32px)] font-semibold leading-[1.2] tracking-[-0.065em] text-[#282828]">
                {p.challengeHeadline2}
              </p>
              <p className="text-base font-medium leading-[1.5] tracking-[-0.075em] text-[#616161]">
                {p.challengeBody}
              </p>
            </div>
          </div>

          {/* Image pair */}
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="overflow-hidden rounded-[10px]">
              <img
                src={p.tertiaryImage}
                alt=""
                className="aspect-[4/5] w-full object-cover lg:aspect-auto lg:h-[700px]"
              />
            </div>
            <div className="overflow-hidden rounded-[10px]">
              <img
                src={p.quaternaryImage}
                alt=""
                className="aspect-[4/5] w-full object-cover lg:aspect-auto lg:h-[700px]"
              />
            </div>
          </div>

          {/* User experience focus + back button */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:justify-between lg:gap-14">
            <div className="flex shrink-0 flex-col justify-between gap-10 lg:w-[260px] lg:self-stretch">
              <p className="text-[20px] font-medium leading-[1.5] tracking-[-0.075em] text-[#616161]">
                User experience focus
              </p>
              <Link
                to="/projects"
                data-hover-lift
                className="hidden h-12 w-fit items-center justify-center rounded-[80px] bg-[#070606] px-6 text-base font-medium leading-[1.5] tracking-[-0.075em] text-white shadow-[0_4px_2px_rgba(0,0,0,0.16)] lg:inline-flex"
              >
                Back to Projects
              </Link>
            </div>
            <div className="flex max-w-[900px] flex-1 flex-col gap-6">
              <p className="text-[clamp(22px,2.4vw,32px)] font-semibold leading-[1.2] tracking-[-0.065em] text-[#282828]">
                {p.uxHeadline1}
              </p>
              <p className="text-[clamp(22px,2.4vw,32px)] font-semibold leading-[1.2] tracking-[-0.065em] text-[#282828]">
                {p.uxHeadline2}
              </p>
              <p className="text-base font-medium leading-[1.5] tracking-[-0.075em] text-[#616161]">
                {p.uxBody1}
              </p>
              <p className="text-base font-medium leading-[1.5] tracking-[-0.075em] text-[#616161]">
                {p.uxBody2}
              </p>
              <Link
                to="/projects"
                data-hover-lift
                className="mt-2 inline-flex h-12 w-fit items-center justify-center rounded-[80px] bg-[#070606] px-6 text-base font-medium leading-[1.5] tracking-[-0.075em] text-white shadow-[0_4px_2px_rgba(0,0,0,0.16)] lg:hidden"
              >
                Back to Projects
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Faq />
      <Cta />
      <Footer />
    </main>
  );
}