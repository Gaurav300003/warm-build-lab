import type { ReactNode } from "react";

export function Section({
  eyebrow,
  title,
  description,
  children,
  className = "",
}: {
  eyebrow?: string;
  title?: ReactNode;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`mx-auto max-w-7xl px-5 lg:px-8 py-14 lg:py-20 ${className}`}>
      {(eyebrow || title) && (
        <div className="mb-10 max-w-3xl">
          {eyebrow && (
            <div className="eyebrow flex items-center gap-3 mb-3">
              <span>{eyebrow}</span>
              <span className="h-px w-8 bg-brand" />
            </div>
          )}
          {title && <h2 className="font-display text-3xl md:text-4xl font-bold">{title}</h2>}
          {description && <p className="mt-3 text-muted-foreground">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}