import type { Metadata } from "next";
import { ProjectsExplorer } from "@/components/ProjectsExplorer";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected digital products and web platforms developed by Danielius Zajenčkauskas.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Selected projects",
    description: "Selected digital products and web platforms developed by Danielius Zajenčkauskas.",
    url: "/projects",
  },
};

export default function ProjectsPage() {
  return (
    <div className="projects-page mx-auto max-w-6xl px-5 py-14 sm:py-20">
      <span aria-hidden className="project-page-blob project-page-blob-one parallax-blob" />
      <span aria-hidden className="project-page-blob project-page-blob-two parallax-blob" />
      <ProjectsExplorer />
    </div>
  );
}
