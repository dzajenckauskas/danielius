import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep crawlers out of the API routes. /api/doodles/preview issues a
      // redirect and /api/resume streams a PDF attachment — neither is a real
      // page, so left crawlable they show up in Search Console as noise
      // ("Page with redirect" / an indexed PDF endpoint) rather than content.
      disallow: "/api/",
    },
    sitemap: "https://zajenckauskas.lt/sitemap.xml",
    host: "https://zajenckauskas.lt",
  };
}
