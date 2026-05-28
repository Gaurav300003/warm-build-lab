import { Link } from "@tanstack/react-router";
import { Facebook, Twitter, Youtube, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-ink text-background">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="grid h-9 w-9 place-items-center rounded-md bg-brand text-brand-foreground font-display font-bold">A</div>
            <div className="font-display text-lg font-bold">AESA Nagar</div>
          </div>
          <p className="text-sm text-background/65 leading-relaxed">
            Architects, Engineers & Surveyors Association — Ahmednagar. Building the city together since 1985.
          </p>
        </div>
        <div>
          <h4 className="text-background text-sm font-mono uppercase tracking-widest mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-background/70">
            <li><Link to="/about" className="hover:text-brand">About AESA</Link></li>
            <li><Link to="/membership" className="hover:text-brand">Membership</Link></li>
            <li><Link to="/bhawan" className="hover:text-brand">AESA Bhawan</Link></li>
            <li><Link to="/committees" className="hover:text-brand">Committees</Link></li>
            <li><Link to="/useful-links" className="hover:text-brand">Useful Links</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-background text-sm font-mono uppercase tracking-widest mb-4">Services</h4>
          <ul className="space-y-2 text-sm text-background/70">
            <li><Link to="/business-card" className="hover:text-brand">Digital Business Card</Link></li>
            <li><Link to="/advertise" className="hover:text-brand">Advertise with AESA</Link></li>
            <li><Link to="/members" className="hover:text-brand">Members Directory</Link></li>
            <li><Link to="/land-records" className="hover:text-brand">Land Record Help</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-background text-sm font-mono uppercase tracking-widest mb-4">Contact</h4>
          <p className="text-sm text-background/70 leading-relaxed">
            AESA Bhawan, Station Road<br/>Ahmednagar, Maharashtra 414001<br/>
            <a href="tel:+919876543210" className="hover:text-brand">+91 98765 43210</a>
          </p>
          <div className="mt-4 flex gap-2">
            {[Facebook, Twitter, Youtube, MessageCircle].map((Icon, i) => (
              <a key={i} href="#" aria-label="social" className="grid h-9 w-9 place-items-center rounded-md border border-background/15 hover:bg-brand hover:border-brand transition-colors">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-background/10">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-5 flex flex-col md:flex-row gap-2 items-center justify-between text-xs text-background/55">
          <div>© {new Date().getFullYear()} AESA Nagar. All rights reserved.</div>
          <div className="font-mono tracking-widest uppercase">Ahmednagar · Maharashtra · India</div>
        </div>
      </div>
    </footer>
  );
}