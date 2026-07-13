import { Tag } from "./Tag";
import type { TimelineEntry } from "@/data/profile";

export function TimelineItem({ entry }: { entry: TimelineEntry }) {
  return (
    <article className="timeline-item group relative pl-8">
      {/* dot + connecting line */}
      <span className="timeline-dot absolute left-0 top-1.5 h-3 w-3 -translate-x-[5px] rounded-full border-2 border-ink bg-bg transition-[transform,background-color,box-shadow] duration-300 group-hover:scale-125 group-hover:bg-ink group-hover:shadow-[0_0_0_6px_color-mix(in_srgb,var(--ink)_12%,transparent)]" />
      <div className="absolute left-0 top-4 h-full w-px bg-border" aria-hidden />

      <div className="pb-8">
        <p className="text-xs font-medium uppercase tracking-wider text-subtle">
          {entry.period}
        </p>
        <h3 className="mt-1 text-lg font-semibold text-text">{entry.title}</h3>
        {entry.org && (
          <p className="text-sm font-medium text-accent">{entry.org}</p>
        )}
        {entry.description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            {entry.description}
          </p>
        )}
        {entry.tags && entry.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {entry.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
