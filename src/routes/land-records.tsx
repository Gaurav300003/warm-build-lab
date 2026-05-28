import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { Download, MapPin } from "lucide-react";

export const Route = createFileRoute("/land-records")({
  head: () => ({
    meta: [
      { title: "Land Record Help — Layouts in Ahmednagar" },
      { name: "description", content: "Layout maps and survey records for Kedgaon, Savedi and Nalegaon areas in Ahmednagar." },
      { property: "og:title", content: "Land Record Help — AESA Nagar" },
      { property: "og:description", content: "Layout maps and downloadable records for Ahmednagar." },
    ],
    links: [{ rel: "canonical", href: "/land-records" }],
  }),
  component: LandPage,
});

const AREAS = [
  { name: "Kedgaon", plots: "1,240 plots", note: "Approved layout · 2018 revision" },
  { name: "Savedi", plots: "860 plots", note: "Approved layout · 2020 revision" },
  { name: "Nalegaon", plots: "640 plots", note: "Approved layout · 2016 revision" },
];

function LandPage() {
  return (
    <div>
      <PageHero eyebrow="Land Records" title="Layout maps & survey help" description="Reference layouts and downloadable records for major Ahmednagar areas, curated by AESA's surveyor committee." />
      <Section>
        <div className="grid md:grid-cols-3 gap-5">
          {AREAS.map((a) => (
            <div key={a.name} className="rounded-2xl border border-border bg-card p-6">
              <MapPin className="h-5 w-5 text-brand" />
              <div className="mt-3 font-display text-xl font-bold text-ink">{a.name}</div>
              <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mt-1">{a.plots}</div>
              <p className="mt-3 text-sm text-muted-foreground">{a.note}</p>
              <button className="mt-5 inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-4 py-2 text-xs font-semibold hover:border-ink">
                <Download className="h-3.5 w-3.5" /> Layout PDF
              </button>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}