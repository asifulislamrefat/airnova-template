import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { POSTS } from "./blog.$slug";

const BASE_URL = "https://airnova-template.lovable.app";

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const Route = createFileRoute("/rss.xml")({
  server: {
    handlers: {
      GET: async () => {
        const items = Object.values(POSTS)
          .map((p) => {
            const url = `${BASE_URL}/blog/${p.slug}`;
            const pubDate = new Date(p.date).toUTCString();
            return [
              `    <item>`,
              `      <title>${escapeXml(p.title)}</title>`,
              `      <link>${url}</link>`,
              `      <guid isPermaLink="true">${url}</guid>`,
              `      <pubDate>${pubDate}</pubDate>`,
              `      <description>${escapeXml(p.intro)}</description>`,
              `    </item>`,
            ].join("\n");
          })
          .join("\n");

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">`,
          `  <channel>`,
          `    <title>Airnova Blog</title>`,
          `    <link>${BASE_URL}/blog</link>`,
          `    <description>Articles from Airnova — a creative design studio.</description>`,
          `    <language>en</language>`,
          `    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />`,
          items,
          `  </channel>`,
          `</rss>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});