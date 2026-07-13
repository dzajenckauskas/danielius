import type { SkillGroupData } from "@/data/profile";

export function SkillGroup({ group, index }: { group: SkillGroupData; index: number }) {
  return (
    <div className="skill-group-card">
      <div className="skill-card-meta">
        <span>{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="skill-card-content">
        <small>Skill group</small>
        <h3>{group.label}</h3>
        <div className="skill-chip-list">
          {group.items.map((item) => (
            <span className="skill-chip" key={item}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
