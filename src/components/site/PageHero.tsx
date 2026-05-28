import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-border bg-gradient-to-br from-secondary via-background to-[oklch(0.96_0.02_155)]">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-24">
        <div className="eyebrow flex items-center gap-3 mb-5">
          <span>{eyebrow}</span>
          <span className="h-px w-10 bg-brand" />
        </div>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold max-w-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-6 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}