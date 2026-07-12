export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-sm text-muted transition-colors duration-200 hover:border-accent hover:text-accent">
      {children}
    </span>
  );
}
