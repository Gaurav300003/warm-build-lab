import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";

export const Route = createFileRoute("/committees")({
  head: () => ({
    meta: [
      { title: "Committees & Past BOD — AESA Nagar" },
      { name: "description", content: "Current Board of Directors, past BODs and the AESA website committee." },
      { property: "og:title", content: "AESA Committees" },
      { property: "og:description", content: "Current Board, past Boards and committees." },
    ],
    links: [{ rel: "canonical", href: "/committees" }],
  }),
  component: CommitteesPage,
});

const CURRENT = [
  { name: "Ar. R. K. Joshi", role: "President" },
  { name: "Er. S. P. Patil", role: "Vice President" },
  { name: "Ar. M. A. Deshmukh", role: "Secretary" },
  { name: "Er. V. N. Kulkarni", role: "Treasurer" },
  { name: "Ar. P. R. Sharma", role: "Joint Secretary" },
  { name: "Er. K. D. More", role: "Member" },
  { name: "Ar. S. T. Bhosale", role: "Member" },
];

const PAST = [
  { years: "2021–2023", pres: "Ar. A. B. Naik", sec: "Er. R. M. Pawar" },
  { years: "2019–2021", pres: "Er. V. K. Joshi", sec: "Ar. M. R. Karnik" },
  { years: "2017–2019", pres: "Ar. N. P. Deshpande", sec: "Er. S. H. Bhide" },
  { years: "2015–2017", pres: "Er. P. M. Gokhale", sec: "Ar. K. S. Modak" },
  { years: "2013–2015", pres: "Ar. R. V. Thakkar", sec: "Er. A. P. Kale" },
];

const WEB = [
  { name: "Ar. P. R. Sharma", role: "Chair" },
  { name: "Er. K. D. More", role: "Tech Lead" },
  { name: "Ar. S. T. Bhosale", role: "Content" },
];

function CommitteesPage() {
  return (
    <div>
      <PageHero eyebrow="Committees" title="Who runs AESA" description="The association is led by an elected Board of Directors and supported by working sub-committees." />

      <Section eyebrow="Current BOD" title="2024–2026 Board">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CURRENT.map((m) => (
            <div key={m.name} className="rounded-xl border border-border bg-card p-5">
              <div className="text-[11px] font-mono uppercase tracking-widest text-brand">{m.role}</div>
              <div className="mt-1 font-display text-lg font-bold text-ink">{m.name}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Past Boards" title="Year-wise listing">
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left">
              <tr>
                <th className="px-4 py-3 font-mono uppercase tracking-widest text-xs text-muted-foreground">Years</th>
                <th className="px-4 py-3 font-mono uppercase tracking-widest text-xs text-muted-foreground">President</th>
                <th className="px-4 py-3 font-mono uppercase tracking-widest text-xs text-muted-foreground">Secretary</th>
              </tr>
            </thead>
            <tbody>
              {PAST.map((p) => (
                <tr key={p.years} className="border-t border-border">
                  <td className="px-4 py-3 font-display font-semibold text-ink">{p.years}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.pres}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.sec}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section eyebrow="Website Committee" title="The team behind aesanagar.org">
        <div className="grid sm:grid-cols-3 gap-4">
          {WEB.map((m) => (
            <div key={m.name} className="rounded-xl border border-border bg-card p-5">
              <div className="text-[11px] font-mono uppercase tracking-widest text-brand">{m.role}</div>
              <div className="mt-1 font-display text-lg font-bold text-ink">{m.name}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}