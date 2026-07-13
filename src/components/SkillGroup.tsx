import { Tag } from "./Tag";
import type { SkillGroupData } from "@/data/profile";

export function SkillGroup({ group }: { group: SkillGroupData }) {
  return (
    <div className="group h-full rounded-2xl border border-border bg-surface/55 p-5 transition-[transform,border-color,box-shadow,background-color] duration-300 hover:-translate-y-1 hover:border-ink/35 hover:bg-surface hover:shadow-[0_18px_50px_-28px_var(--ink)]">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-subtle transition-colors group-hover:text-ink">
        {group.label}
      </h3>
      <div className="flex flex-wrap gap-2">
        {group.items.map((item) => (
          <Tag key={item}>{item}</Tag>
        ))}
      </div>
    </div>
  );
}
