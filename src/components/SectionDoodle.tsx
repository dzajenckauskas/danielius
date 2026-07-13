type DoodleType =
  | "pencil"
  | "code"
  | "speech"
  | "bike"
  | "career"
  | "education"
  | "contact";

const drawings: Record<DoodleType, React.ReactNode> = {
  pencil: (
    <><path d="m12 55 7-2 32-32-5-5-32 32-2 7Z" /><path d="m42 20 5 5M11 60c19 3 36 1 52-5" /></>
  ),
  code: (
    <><path d="m27 17-14 15 14 15M55 17l14 15-14 15M45 10 35 54" /><path d="M10 61c20-5 41-5 62 0" /></>
  ),
  speech: (
    <><path d="M9 14h42v28H27L16 51l3-9H9V14Z" /><path d="M38 48h32v20H55l-8 7 2-7H38M17 26h26M17 33h17" /></>
  ),
  bike: (
    <><circle cx="18" cy="55" r="12" /><circle cx="62" cy="55" r="12" /><path d="m18 55 15-25 12 25H18Zm15-25h13M45 55l11-31M51 24h10M33 30l-5-8h-7" /></>
  ),
  career: (
    <><path d="M8 65c8-25 22-38 41-34 18 4 24-10 25-23" /><path d="m67 15 7-7 6 8" /><circle cx="14" cy="53" r="3" /><circle cx="48" cy="31" r="3" /></>
  ),
  education: (
    <><path d="m8 31 31-16 32 16-32 16L8 31Z" /><path d="M20 39v17c12 8 25 8 38 0V39M71 31v23" /><circle cx="71" cy="58" r="3" /></>
  ),
  contact: (
    <><path d="M8 17 72 8 49 67 34 39 8 17Z" /><path d="M34 39 72 8M34 39l-2 18 10-11" /><path d="M8 73c19 3 37 1 54-6" /></>
  ),
};

export function SectionDoodle({ type, className = "" }: { type: DoodleType; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 80 80" className={`section-doodle ${className}`} fill="none">
      {drawings[type]}
    </svg>
  );
}
