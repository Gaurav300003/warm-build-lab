import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/membership", label: "Membership" },
  { to: "/bhawan", label: "AESA Bhawan" },
  { to: "/committees", label: "Committees" },
  { to: "/advertise", label: "Advertise" },
  { to: "/business-card", label: "Biz Card" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <div className="grid h-9 w-9 place-items-center rounded-md bg-brand text-brand-foreground font-display font-bold">A</div>
          <div className="leading-tight">
            <div className="font-display text-base font-bold text-ink">AESA Nagar</div>
            <div className="text-[10px] tracking-widest text-muted-foreground uppercase font-mono">Ahmednagar</div>
          </div>
        </Link>
        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-ink"
              activeProps={{ className: "rounded-md px-3 py-2 text-sm font-semibold text-ink bg-secondary" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <button
          aria-label="Menu"
          className="lg:hidden grid h-10 w-10 place-items-center rounded-md border border-border"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <nav className="lg:hidden border-t border-border bg-background px-3 py-3">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="block rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary"
              activeProps={{ className: "block rounded-md px-3 py-2.5 text-sm font-semibold text-ink bg-secondary" }}
              activeOptions={{ exact: n.to === "/" }}
              onClick={() => setOpen(false)}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}