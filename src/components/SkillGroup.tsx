import { Tag } from "./Tag";
import type { SkillGroupData } from "@/data/profile";

export function SkillGroup({ group }: { group: SkillGroupData }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-5">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-subtle">
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
