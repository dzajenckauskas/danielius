import type { Metadata } from "next";
import { ExperienceExplorer } from "@/components/ExperienceExplorer";

export const metadata: Metadata = {
  title: "Experience",
  description: "Work history and education of Danielius Zajenckauskas.",
};

export default function ExperiencePage() {
  return (
    <div className="experience-page mx-auto max-w-6xl px-5 py-14 sm:py-20">
      <span aria-hidden className="section-blob section-blob-career parallax-blob" />
      <span aria-hidden className="section-blob section-blob-education parallax-blob" />
      <ExperienceExplorer />
    </div>
  );
}
