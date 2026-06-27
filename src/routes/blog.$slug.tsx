import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Cta } from "@/components/site/Cta";
import { Faq } from "@/components/site/Faq";

import img1 from "@/assets/blog-1-robot-eyes.webp.asset.json";
import img2 from "@/assets/blog-2-cpu.webp.asset.json";
import img3 from "@/assets/blog-3-camera.webp.asset.json";
import img4 from "@/assets/blog-4-airpods.webp.asset.json";
import img5 from "@/assets/blog-5-off-button.webp.asset.json";
import img6 from "@/assets/blog-6-pen-tool.webp.asset.json";

type Post = {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  hero: string;
  gallery: [string, string];
  intro: string;
  sections: {
    heading: string;
    paragraphs?: string[];
    subHeading?: string;
    bullets?: string[];
  }[];
  closing: { heading: string; paragraphs: string[]; bullets?: string[] };
};

const BASE_POST: Post = {
    slug: "how-to-create-content-that-actually-converts",
    title: "How to create counter that actually converts",
    date: "March 2, 2026",
    readTime: "9 min read",
    hero: img1.url,
    gallery: [img2.url, img3.url],
    intro:
      "In today's saturated market, simply having a great product isn't enough. To truly stand out, brands need to connect emotionally with their audience—and visual storytelling is one of the most powerful ways to do that. Visual storytelling combines compelling imagery, design elements, and narratives to communicate your brand's values, mission, and personality in an instantly relatable way. When done right, it builds trust, fosters loyalty, and inspires action by making your brand memorable and meaningful.",
    sections: [
      {
        heading: "Why Visual Storytelling Matters :",
        paragraphs: [
          "Visual storytelling taps into the brain's natural preference for processing images over text. It creates an immersive experience where audiences not only see but feel your brand's essence. By weaving stories through visuals, brands can convey complex ideas quickly and effectively, breaking down barriers of language or cultural differences. This method transforms passive viewers into engaged participants, encouraging deeper connections and lasting impressions.",
          "Crafting a powerful visual story requires more than just pretty pictures. It involves intentional choices about color palettes, typography, imagery style, and sequencing to create a cohesive narrative flow. Consistency across these elements strengthens brand recognition and reinforces the story's core message. Authenticity is also crucial—audiences respond best when visuals reflect genuine values and real experiences rather than polished but impersonal marketing.",
        ],
        bullets: [
          "Use colors that evoke your brand's personality and mood.",
          "Choose imagery that aligns with your audience's aspirations and lifestyle.",
          "Maintain consistent style and tone to build trust and familiarity.",
        ],
      },
      {
        heading: "How to Implement Visual Storytelling in Your Brand Strategy",
        paragraphs: [
          "Integrating visual storytelling into your brand strategy starts with understanding your audience's desires, challenges, and dreams. From there, design content that speaks directly to their experience—whether through social media posts, videos, website graphics, or packaging. Experiment with formats like infographics, animations, or behind-the-scenes glimpses to keep stories fresh and engaging. Monitor feedback and adjust visuals based on what resonates most, creating a dynamic dialogue that evolves with.",
          "Emotions are the gateway to memory and decision-making. When your brand's visual story evokes feelings—whether it's joy, nostalgia, trust, or excitement—it becomes more than just an advertisement; it becomes an experience. Visual elements like facial expressions, color psychology, and dynamic movement can all trigger emotional responses that help your audience relate to your brand on a deeper level. This emotional connection not only influences purchase decisions but also turns customers into passionate advocates.",
          "To ensure your visual storytelling efforts are effective, it's important to measure their impact through key performance indicators (KPIs). Engagement metrics such as likes, shares, comments, and time spent on content indicate how well your visuals resonate with your audience. Additionally, tracking conversion rates, brand recall, and customer feedback provides insight into how storytelling influences behavior and perception. Using these analytics, brands can continually optimize their visual narratives for greater influence and ROI.",
        ],
        subHeading: "For example:",
        bullets: [
          "Track social media engagement to gauge audience reaction and reach.",
          "Use A/B testing to compare different visual approaches and messaging.",
          "Collect qualitative feedback through surveys or focus groups for deeper insights.",
        ],
      },
    ],
    closing: {
      heading: "Leveraging Technology for Enhanced Storytelling",
      paragraphs: [
        "Advancements in technology have opened new doors for brands to tell richer, more immersive stories. Tools like augmented reality (AR), virtual reality (VR), and interactive web design enable audiences to participate actively in brand narratives. These experiences create memorable moments that differentiate your brand in crowded markets. Incorporating these cutting-edge formats alongside traditional visuals ensures your storytelling stays fresh, innovative, and captivating.",
      ],
      bullets: [
        "Explore AR filters or VR experiences to create interactive brand moments.",
        "Use animation and motion graphics to add dynamism and capture attention.",
        "Implement responsive design for seamless storytelling across devices.",
      ],
    },
};

function stub(slug: string, title: string, hero: string, gallery: [string, string]): Post {
  return { ...BASE_POST, slug, title, hero, gallery };
}

const POSTS: Record<string, Post> = {
  [BASE_POST.slug]: BASE_POST,
  "where-creativity-meets-strategy": stub("where-creativity-meets-strategy", "Where Creativity Meets Strategy", img2.url, [img3.url, img4.url]),
  "explore-the-future-of-digital-design": stub("explore-the-future-of-digital-design", "Explore the Future of Digital Design", img3.url, [img4.url, img5.url]),
  "innovative-thinking-for-digital-success": stub("innovative-thinking-for-digital-success", "Innovative Thinking for Digital Success", img4.url, [img5.url, img6.url]),
  "creative-tips-for-modern-designers": stub("creative-tips-for-modern-designers", "Creative Tips for Modern Designers", img5.url, [img6.url, img1.url]),
  "your-source-for-design-inspiration": stub("your-source-for-design-inspiration", "Your Source for Design Inspiration", img6.url, [img1.url, img2.url]),
};

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = POSTS[params.slug];
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    const title = post ? `${post.title} — Airnova` : "Blog — Airnova";
    const description = post?.intro.slice(0, 155) ?? "Airnova blog article.";
    const url = `https://airnova-template.lovable.app/blog/${post?.slug ?? ""}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        ...(post ? [{ property: "og:image", content: post.hero }, { name: "twitter:image", content: post.hero }] : []),
      ],
      links: post ? [{ rel: "canonical", href: url }] : [],
      scripts: post
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: post.title,
                description,
                image: post.hero,
                datePublished: new Date(post.date).toISOString(),
                author: { "@type": "Organization", name: "Airnova" },
                publisher: {
                  "@type": "Organization",
                  name: "Airnova",
                  url: "https://airnova-template.lovable.app",
                },
                mainEntityOfPage: { "@type": "WebPage", "@id": url },
              }),
            },
          ]
        : [],
    };
  },
  component: BlogDetailsPage,
});

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="flex w-full flex-col gap-4 text-[16px] font-medium leading-[1.5] tracking-[-0.075em] text-[#616161]">
      {items.map((b) => (
        <li key={b} className="ml-6 list-disc">
          {b}
        </li>
      ))}
    </ul>
  );
}

function BlogDetailsPage() {
  const { post } = Route.useLoaderData() as { post: Post };
  return (
    <main className="min-h-screen overflow-x-clip bg-white font-sans text-foreground antialiased">
      <Nav />
      <section className="bg-white py-16 lg:py-28">
        <div className="container-x flex flex-col items-center gap-16 lg:gap-20">
          {/* Header */}
          <div className="flex w-full flex-col items-center gap-12 lg:gap-[72px]">
            <div className="flex w-full flex-col gap-12">
              <div className="flex w-full flex-col items-start gap-4">
                <div className="flex items-center gap-6 text-[18px] font-medium leading-[1.5] tracking-[-0.075em] text-[#616161] sm:text-[20px]">
                  <span>{post.date}</span>
                  <span className="flex items-center gap-2"><span className="inline-block size-1.5 rounded-full bg-[#616161]" />{post.readTime}</span>
                </div>
                <h1 className="max-w-[800px] text-[clamp(40px,7vw,80px)] font-semibold leading-[1.1] tracking-[-0.065em] text-black">
                  {post.title}
                </h1>
              </div>
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[20px] bg-[#f5f5f5] lg:aspect-auto lg:h-[700px]">
                <img src={post.hero} alt={post.title} className="absolute inset-0 size-full object-cover" />
              </div>
            </div>
            <p className="w-full max-w-[800px] text-[16px] font-medium leading-[1.5] tracking-[-0.075em] text-[#616161]">
              {post.intro}
            </p>
          </div>

          {/* Sections */}
          {post.sections.map((s) => (
            <div key={s.heading} className="flex w-full max-w-[800px] flex-col gap-8">
              <h2 className="text-[clamp(28px,4.5vw,48px)] font-semibold leading-[1.2] tracking-[-0.065em] text-[#111418]">
                {s.heading}
              </h2>
              {s.paragraphs?.map((p, i) => (
                <p key={i} className="text-[16px] font-medium leading-[1.5] tracking-[-0.075em] text-[#616161]">
                  {p}
                </p>
              ))}
              {s.subHeading && (
                <h3 className="text-[clamp(28px,4.5vw,48px)] font-semibold leading-[1.2] tracking-[-0.065em] text-[#111418]">
                  {s.subHeading}
                </h3>
              )}
              {s.bullets && <Bullets items={s.bullets} />}
            </div>
          ))}

          {/* Gallery */}
          <div className="flex w-full flex-col gap-2 sm:flex-row">
            {post.gallery.map((src, i) => (
              <div key={i} className="relative aspect-[8/5] w-full overflow-hidden rounded-[10px] bg-[#f5f5f5] sm:aspect-auto sm:h-[700px] sm:flex-1">
                <img src={src} alt="" className="absolute inset-0 size-full object-cover" />
              </div>
            ))}
          </div>

          {/* Closing */}
          <div className="flex w-full max-w-[800px] flex-col gap-8">
            <h2 className="text-[clamp(28px,3.5vw,40px)] font-semibold leading-[1.2] tracking-[-0.065em] text-[#111418]">
              {post.closing.heading}
            </h2>
            {post.closing.paragraphs.map((p, i) => (
              <p key={i} className="text-[16px] font-medium leading-[1.5] tracking-[-0.075em] text-[#616161]">
                {p}
              </p>
            ))}
            {post.closing.bullets && <Bullets items={post.closing.bullets} />}
          </div>

          {/* Back button */}
          <Link
            to="/blog"
            className="inline-flex h-12 w-full max-w-[800px] items-center justify-start self-center rounded-full bg-transparent text-[16px] font-medium leading-[1.5] tracking-[-0.075em] text-[#070606] transition-transform hover:-translate-x-0.5"
          >
            <span className="inline-flex h-12 items-center justify-center rounded-full bg-[#070606] px-6 py-4 text-white shadow-[0_4px_2px_rgba(0,0,0,0.16)]">Back to Blog</span>
          </Link>
        </div>
      </section>
      <Faq />
      <Cta />
      <Footer />
    </main>
  );
}