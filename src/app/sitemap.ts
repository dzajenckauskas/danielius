import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";

const baseUrl = "https://zajenckauskas.lt";

export default function sitemap(): MetadataRoute.Sitemap {
  const projectPages: MetadataRoute.Sitemap = projects.map(({ slug }) => ({
    url: `${baseUrl}/projects/${slug}`,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [
    { url: baseUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/projects`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/experience`, changeFrequency: "yearly", priority: 0.8 },
    ...projectPages,
  ];
}
