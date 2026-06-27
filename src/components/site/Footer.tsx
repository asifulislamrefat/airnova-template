import { Link } from "@tanstack/react-router";
import { Logo, serif } from "./shared";

// Map footer link labels to internal routes. Add an entry when a new page route is created.
const ROUTE_MAP: Record<string, string> = {
  "About Us": "/about",
  "Projects": "/projects",
  "Pricing": "/pricing",
  "Blog": "/blog",
  "Blog Details": "/blog",
  "Book a call": "/contact",
};

export function Footer() {
  const cols = [
    { title: "Pages", links: ["Home", "About Us", "Services", "Projects", "Blog"] },
    { title: "Pages", links: ["Blog Details", "Projects Details", "Services Details", "Pricing"] },
    { title: "Information", links: ["Book a call", "Instagram", "LinkedIn", "Twitter"] },
    { title: "Inner Pages", links: ["404", "Licenses", "Changelog", "Style Guide"] },
  ];
  return (
    <footer className="relative overflow-hidden bg-foreground px-5 pb-8 pt-16 text-background sm:px-10 lg:h-[757px] lg:px-20 lg:pt-28">
      <div className="relative z-10 mx-auto w-full max-w-[1280px]">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div className="flex flex-col gap-6">
            <Logo light />
            <p className="max-w-sm text-[28px] font-semibold leading-[1.2] tracking-[-0.03em]">
              Social media that <span className={`${serif} text-background/50`}>drives<br />real</span> results
            </p>
            <p className="text-base text-background/80">Built for creators businesses and brands.</p>
          </div>

          <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
            {cols.map((c, i) => (
              <div key={i} className="flex flex-col gap-5">
                <div className="text-2xl font-semibold tracking-[-0.02em]">{c.title}</div>
                <ul className="space-y-3 text-base text-background/85">
                  {c.links.map((l) => (
                    <li key={l}>
                      {ROUTE_MAP[l] ? (
                        <Link
                          to={ROUTE_MAP[l]}
                          className="inline-block transition-all duration-300 ease-out hover:translate-x-1 hover:text-background"
                        >
                          {l}
                        </Link>
                      ) : (
                        <a
                          href="#"
                          className="inline-block transition-all duration-300 ease-out hover:translate-x-1 hover:text-background"
                        >
                          {l}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider + credit row sits above the giant wordmark */}
        <div className="mt-12 lg:mt-16">
          <div className="h-px w-full bg-white/10" />
          <div className="mt-4 text-center text-base font-medium tracking-[-0.02em] text-background">
            Design & Developed By Airdute — License | Powered By Webflow
          </div>
        </div>
      </div>

      {/* Giant wordmark anchored to the bottom edge */}
      <div
        className={`${serif} pointer-events-none mt-8 select-none text-center font-semibold leading-[0.85] tracking-[-0.075em] text-background lg:absolute lg:left-1/2 lg:bottom-0 lg:mt-0 lg:-translate-x-1/2 lg:whitespace-nowrap`}
        style={{ fontSize: "clamp(120px, 22vw, 302px)" }}
      >
        Airnova
      </div>
    </footer>
  );
}