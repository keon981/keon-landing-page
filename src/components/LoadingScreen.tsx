export function LoadingScreen() {
  return (
    <div
      role="status"
      aria-label="loading"
      className="fixed inset-0 z-50 flex items-center justify-center bg-main"
    >
      <div className="relative">
        <div className="rotate-2 border-4 border-border bg-surface p-8 font-mono text-5xl font-heading text-foreground shadow-[8px_8px_0_0_var(--border)] sm:text-6xl">
          LOADING
        </div>
        <div className="absolute -top-6 -right-6 size-14 animate-spin-slow rounded-full border-4 border-border bg-accent shadow-shadow" />
        <div className="absolute -bottom-6 -left-6 size-10 animate-pulse rounded-base border-4 border-border bg-highlight shadow-shadow" />
        <div className="absolute -top-14 -left-14 size-16 rotate-45 border-4 border-border bg-highlight shadow-[6px_6px_0_0_var(--border)]" />
        <div className="mt-8 flex justify-center gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="size-4 animate-bounce rounded-full bg-foreground"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
