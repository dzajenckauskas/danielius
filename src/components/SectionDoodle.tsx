type DoodleType =
  | "pencil"
  | "code"
  | "speech"
  | "system"
  | "nodes"
  | "document"
  | "career"
  | "education"
  | "contact";

const drawings: Record<DoodleType, React.ReactNode> = {
  pencil: (
    <>
      <path d="m15 57 5-13L52 12l13 13-32 32-14 5-4-5Z" />
      <path d="m20 44 13 13M47 17l13 13M19 62c14 2 30 0 47-7" />
    </>
  ),
  code: (
    <><path d="m27 17-14 15 14 15M55 17l14 15-14 15M45 10 35 54" /><path d="M10 61c20-5 41-5 62 0" /></>
  ),
  speech: (
    <><path d="M9 14h42v28H27L16 51l3-9H9V14Z" /><path d="M38 48h32v20H55l-8 7 2-7H38M17 26h26M17 33h17" /></>
  ),
  system: (
    <><path d="M12 18h43v28H12zM23 29h43v28H23zM34 40h34v25H34z" /><path d="M18 25h9M29 36h9M40 47h8" /></>
  ),
  nodes: (
    <><circle cx="16" cy="19" r="6" /><circle cx="63" cy="27" r="7" /><circle cx="27" cy="62" r="8" /><path d="m22 21 34 5M19 25l6 29M33 58l24-25" /><path d="M9 73c18-4 37-3 57 2" /></>
  ),
  document: (
    <><path d="M18 9h32l13 14v48H18zM50 9v15h13" /><path d="M28 36h24M28 46h20M28 56h25" /></>
  ),
  career: (
    <><path d="M8 65c8-25 22-38 41-34 18 4 24-10 25-23" /><path d="m67 15 7-7 6 8" /><circle cx="14" cy="53" r="3" /><circle cx="48" cy="31" r="3" /></>
  ),
  education: (
    <><path d="m8 31 31-16 32 16-32 16L8 31Z" /><path d="M20 39v17c12 8 25 8 38 0V39M71 31v23" /><circle cx="71" cy="58" r="3" /></>
  ),
  contact: (
    <>
      <path d="m9 22 61-12-22 57-15-27L9 22Z" />
      <path d="M33 40 70 10M33 40l-1 18 11-10" />
      <path d="M8 71c18 4 37 2 56-5" />
    </>
  ),
};

export function SectionDoodle({ type, className = "" }: { type: DoodleType; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 80 80" className={`section-doodle ${className}`} fill="none">
      {drawings[type]}
    </svg>
  );
}
