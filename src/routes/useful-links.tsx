import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/useful-links")({
  head: () => ({
    meta: [
      { title: "Useful Links — Government & Professional Portals" },
      { name: "description", content: "A curated list of government, municipal and professional body portals useful to AESA members." },
      { property: "og:title", content: "Useful Links — AESA Nagar" },
      { property: "og:description", content: "Government, municipal and professional portals for built-environment work." },
    ],
    links: [{ rel: "canonical", href: "/useful-links" }],
  }),
  component: LinksPage,
});

const LINKS = [
  { name: "MahaRERA", desc: "Maharashtra Real Estate Regulatory Authority — project & agent registration.", url: "https://maharera.maharashtra.gov.in" },
  { name: "7/12 Extract — Mahabhulekh", desc: "Online satbara utara — Maharashtra land records.", url: "https://bhulekh.mahabhumi.gov.in" },
  { name: "Ahmednagar Municipal Corporation", desc: "Building permissions, property tax and city services.", url: "https://ahmednagarcorporation.com" },
  { name: "Town Planning Maharashtra", desc: "Development plans, regional plans and DCPR.", url: "https://dtp.maharashtra.gov.in" },
  { name: "Council of Architecture", desc: "National regulatory body for architects in India.", url: "https://www.coa.gov.in" },
  { name: "Institution of Engineers (India)", desc: "Professional body for engineers — IEI membership.", url: "https://www.ieindia.org" },
  { name: "PWD Maharashtra", desc: "Public Works Department — schedule of rates, tenders.", url: "https://mahapwd.gov.in" },
  { name: "MCGM Building Permission", desc: "Reference DCR for high-density development.", url: "https://portal.mcgm.gov.in" },
];

function LinksPage() {
  return (
    <div>
      <PageHero eyebrow="Resources" title="Useful links for professionals" description="Government portals, regulatory bodies and city services AESA members reach for most often." />
      <Section>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LINKS.map((l) => (
            <a key={l.name} href={l.url} target="_blank" rel="noreferrer" className="group rounded-xl border border-border bg-card p-5 hover:border-brand transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="font-display text-base font-bold text-ink">{l.name}</div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-brand" />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{l.desc}</p>
            </a>
          ))}
        </div>
      </Section>
    </div>
  );
}