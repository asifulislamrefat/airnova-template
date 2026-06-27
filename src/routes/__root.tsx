import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Cta } from "@/components/site/Cta";
import notFoundIllustration from "@/assets/404-illustration.svg.asset.json";

function NotFoundComponent() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main className="px-5 pt-12 pb-16 md:px-10 md:pt-20 md:pb-24">
        <div className="mx-auto flex max-w-[900px] flex-col items-center text-center">
          <h1 className="text-[44px] font-semibold leading-[1.1] tracking-[-0.06em] text-black md:text-[72px]">
            Page Not Found
          </h1>
          <p className="mt-4 max-w-[440px] text-[15px] font-medium leading-[1.5] tracking-[-0.04em] text-[#515151] md:text-base">
            Sorry, the page you are looking for doesn't exist or has been moved. Try searching our site
          </p>
          <Link
            to="/"
            className="group mt-7 inline-flex items-center gap-3 rounded-full bg-black px-6 py-3 text-sm font-medium tracking-[-0.04em] text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-black/90"
          >
            Back to Home
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:translate-x-0.5">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
          <img
            src={notFoundIllustration.url}
            alt="404 error"
            className="mt-10 w-full max-w-[720px]"
          />
        </div>
      </main>
      <Cta />
      <Footer />
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Airnova — Creative Design Studio" },
      { name: "description", content: "Airnova is a creative design studio crafting brand identities, websites, and digital products for ambitious teams." },
      { name: "author", content: "Airnova" },
      { property: "og:site_name", content: "Airnova" },
      { property: "og:title", content: "Airnova — Creative Design Studio" },
      { property: "og:description", content: "Airnova is a creative design studio crafting brand identities, websites, and digital products for ambitious teams." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Airnova — Creative Design Studio" },
      { name: "twitter:description", content: "Airnova is a creative design studio crafting brand identities, websites, and digital products for ambitious teams." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/75afe86f-4497-417b-a784-eae5cb537aff/id-preview-e89db76d--6f28d1d2-1d99-4e9d-ba11-0e398e612d98.lovable.app-1782216794429.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/75afe86f-4497-417b-a784-eae5cb537aff/id-preview-e89db76d--6f28d1d2-1d99-4e9d-ba11-0e398e612d98.lovable.app-1782216794429.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      // Preload the primary body font (Inter 400 + 600, latin subset) directly
      // from gstatic. Combined with `font-display: swap` in the Google Fonts
      // CSS this keeps text painting on the system fallback (no LCP delay) and
      // swaps to Inter once the woff2 is ready (no layout shift because Inter
      // and the system-ui fallback have close metrics; CLS stays < 0.01).
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: "https://fonts.gstatic.com/s/inter/v19/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: "https://fonts.gstatic.com/s/inter/v19/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIa0ZL7.woff2",
        crossOrigin: "anonymous",
      },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg", media: "(prefers-color-scheme: light)" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon-dark.svg", media: "(prefers-color-scheme: dark)" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "48x48", href: "/favicon-48x48.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon-dark.png", media: "(prefers-color-scheme: dark)" },
      { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#070606" },
      { rel: "alternate", type: "application/rss+xml", href: "/rss.xml", title: "Airnova Blog RSS" },
      // Google Fonts: load non-render-blocking. Preload the stylesheet, then a
      // tiny inline script (below) swaps it in as a real stylesheet on load.
      // Saves ~750ms on mobile LCP (Lighthouse render-blocking insight).
      {
        rel: "preload",
        as: "style",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:ital,wght@1,500;1,600;1,700&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:ital,wght@1,500;1,600;1,700&display=swap",
        media: "print",
      },
    ],
    scripts: [
      {
        children:
          "document.querySelectorAll('link[rel=\"stylesheet\"][media=\"print\"]').forEach(function(l){l.media='all'});",
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://airnova-template.lovable.app/#organization",
              name: "Airnova",
              url: "https://airnova-template.lovable.app",
              description:
                "Airnova is a creative design studio crafting brand identities, websites, and digital products for ambitious teams.",
            },
            {
              "@type": "WebSite",
              "@id": "https://airnova-template.lovable.app/#website",
              url: "https://airnova-template.lovable.app",
              name: "Airnova",
              publisher: { "@id": "https://airnova-template.lovable.app/#organization" },
              inLanguage: "en",
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <div className="progressive-blur" aria-hidden="true">
        <div className="progressive-blur__layer is--1" />
        <div className="progressive-blur__layer is--2" />
        <div className="progressive-blur__layer is--3" />
        <div className="progressive-blur__layer is--4" />
        <div className="progressive-blur__layer is--5" />
      </div>
    </QueryClientProvider>
  );
}
