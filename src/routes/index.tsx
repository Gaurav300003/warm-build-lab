import { createFileRoute, Link } from "@tanstack/react-router";
import { HeroCarousel } from "@/components/site/HeroCarousel";
import { ServiceSearch } from "@/components/site/ServiceSearch";
import { Section } from "@/components/site/Section";
import { Calendar, ArrowUpRight, MapPin, Users } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AESA Nagar — Architects, Engineers & Surveyors Association" },
      { name: "description", content: "Official home of AESA Nagar — Ahmednagar's community of architects, engineers and surveyors. Membership, AESA Bhawan booking, service directory and more." },
      { property: "og:title", content: "AESA Nagar" },
      { property: "og:description", content: "Membership, AESA Bhawan booking, and a verified directory of Ahmednagar's built-environment professionals." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div>
      <section className="border-b border-border bg-gradient-to-br from-secondary via-background to-[oklch(0.96_0.02_155)]">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 pt-12 lg:pt-20 pb-10">
          <div className="grid lg:grid-cols-[1fr_320px] gap-8">
            <div>
              <div className="eyebrow flex items-center gap-3 mb-5">
                <span>Est. 1985 · Ahmednagar</span>
                <span className="h-px w-10 bg-brand" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] max-w-3xl">
                Building Ahmednagar, <em className="not-italic text-brand">together</em>.
              </h1>
              <p className="mt-5 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed">
                The Architects, Engineers & Surveyors Association — a 400-strong professional community shaping the city's homes, schools, hospitals and public spaces for four decades.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/membership" className="inline-flex items-center gap-1.5 rounded-md bg-ink px-5 py-3 text-sm font-semibold text-background hover:opacity-90">
                  Apply for Membership <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link to="/business-card" className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-5 py-3 text-sm font-semibold text-ink hover:border-ink">
                  Get a ₹1,500 Digital Card
                </Link>
              </div>
              <div className="mt-10">
                <HeroCarousel />
              </div>
            </div>

            <aside className="space-y-3">
              <div className="eyebrow">Our Sponsors</div>
              {[
                { name: "Ultratech Cement", tag: "Building Materials" },
                { name: "Tata Steel", tag: "Steel Partner" },
                { name: "Asian Paints", tag: "Finishes" },
                { name: "Kohler India", tag: "Sanitaryware" },
                { name: "Birla White", tag: "Wall Care" },
              ].map((s) => (
                <a key={s.name} href="#" className="group block rounded-xl border border-border bg-card p-4 hover:border-brand transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-display font-semibold text-ink">{s.name}</div>
                      <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mt-0.5">{s.tag}</div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-brand" />
                  </div>
                </a>
              ))}
              <Link to="/advertise" className="block rounded-xl border border-dashed border-brand/40 bg-brand/5 p-4 text-center text-sm font-semibold text-brand hover:bg-brand/10">
                + Advertise with AESA
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-ink text-background">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { k: "400+", v: "Active members" },
            { k: "40 yrs", v: "Serving Ahmednagar" },
            { k: "12", v: "BOD committees" },
            { k: "1", v: "AESA Bhawan" },
          ].map((s) => (
            <div key={s.v}>
              <div className="font-display text-3xl md:text-4xl font-bold text-brand">{s.k}</div>
              <div className="mt-1 text-xs font-mono uppercase tracking-widest text-background/60">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      <Section
        eyebrow="Find a Service Provider"
        title="Verified professionals, contractors & suppliers"
        description="Search the AESA member directory by name or category. Connect via call or WhatsApp instantly."
      >
        <ServiceSearch />
      </Section>

      <section className="bg-secondary border-y border-border">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-14 lg:py-20 grid lg:grid-cols-[1fr_1.4fr] gap-10">
          <div>
            <div className="eyebrow flex items-center gap-3 mb-3">
              <span>Notice Board</span>
              <span className="h-px w-8 bg-brand" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">What's happening at AESA</h2>
            <p className="mt-4 text-muted-foreground">
              Upcoming events, announcements, training sessions and BOD updates. Pinned by the AESA secretariat.
            </p>
          </div>
          <ul className="space-y-3">
            {[
              { date: "12 Jun", title: "Annual General Meeting 2026", tag: "Members only", icon: Users },
              { date: "22 Jun", title: "Workshop — New MahaRERA filing rules", tag: "Open", icon: Calendar },
              { date: "05 Jul", title: "Site visit: Kedgaon layout walk-through", tag: "Limited seats", icon: MapPin },
              { date: "18 Jul", title: "BOD elections — nomination window opens", tag: "Important", icon: Calendar },
            ].map((n) => (
              <li key={n.title} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                <div className="grid h-14 w-14 place-items-center rounded-md bg-ink text-background">
                  <n.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-mono uppercase tracking-widest text-brand">{n.date} · {n.tag}</div>
                  <div className="font-display font-semibold text-ink mt-0.5">{n.title}</div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Section eyebrow="Digital Business Card" title={<>A mini-website for your business — <em className="not-italic text-brand">₹1,500/year</em>.</>}>
        <div className="grid lg:grid-cols-3 gap-5">
          {[
            { title: "Fill the form", body: "Business name, services, photos, phone — fill once.", n: "01" },
            { title: "We build it", body: "Your card auto-generates at aesanagar.org/biz/your-name.", n: "02" },
            { title: "Share anywhere", body: "Shareable link + QR code. Put it on Instagram, WhatsApp, business cards.", n: "03" },
          ].map((s) => (
            <div key={s.n} className="rounded-xl border border-border bg-card p-6">
              <div className="font-mono text-xs uppercase tracking-widest text-brand">{s.n}</div>
              <div className="mt-2 font-display text-xl font-bold text-ink">{s.title}</div>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link to="/business-card" className="inline-flex items-center gap-1.5 rounded-md bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground hover:opacity-90">
            Get Your Digital Card →
          </Link>
        </div>
      </Section>
    </div>
  );
}