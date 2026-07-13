export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-sm text-muted transition-[color,border-color,transform,background-color] duration-200 hover:-translate-y-0.5 hover:border-ink/50 hover:bg-surface-2 hover:text-ink-strong">
      {children}
    </span>
  );
}
