import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — AESA Nagar" },
      { name: "description", content: "Four decades of architects, engineers and surveyors building Ahmednagar. Read the AESA story, vision, legacy and philosophy." },
      { property: "og:title", content: "About AESA Nagar" },
      { property: "og:description", content: "Four decades shaping Ahmednagar's built environment." },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div>
      <PageHero
        eyebrow="About AESA"
        title={<>Four decades of <em className="not-italic text-brand">building together</em>.</>}
        description="Founded in 1985, AESA Nagar brings together Ahmednagar's architects, structural engineers, land surveyors and allied professionals into a single trusted community."
      />

      <Section eyebrow="Our Story" title="A profession-led civic association">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-5 text-muted-foreground leading-relaxed">
            <p>
              AESA was founded by 27 practising architects and engineers in 1985, around a shared concern: Ahmednagar was growing fast, and the city's built environment needed advocates who understood both design and the public good.
            </p>
            <p>
              Today, AESA represents more than 400 active members across architecture, RCC engineering, town planning and land surveying. We host workshops on new regulations, run a public service-provider directory, advocate for sound urban policy, and operate AESA Bhawan as a venue for the city's professional and cultural life.
            </p>
            <p>
              The association is run by an elected Board of Directors, supported by sub-committees for membership, events, the Bhawan and the website. All boards are listed publicly on the <Link to="/committees" className="underline text-ink hover:text-brand">Committees</Link> page.
            </p>
          </div>
          <aside className="rounded-xl border border-border bg-card p-6 space-y-4 h-fit">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Founded</div>
              <div className="font-display text-2xl font-bold text-ink">1985</div>
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Active members</div>
              <div className="font-display text-2xl font-bold text-ink">400+</div>
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Registered office</div>
              <div className="font-display text-base font-semibold text-ink mt-1">AESA Bhawan, Station Road, Ahmednagar</div>
            </div>
          </aside>
        </div>
      </Section>

      <Section eyebrow="Vision" title="What we are building toward">
        <p className="max-w-3xl text-xl md:text-2xl font-display font-medium text-ink leading-snug">
          A safer, better-designed Ahmednagar — where every home, school and public building is the work of a competent, accountable professional, and where the city's growth respects its people, water and heritage.
        </p>
      </Section>

      <Section eyebrow="Legacy" title="Milestones">
        <ol className="grid md:grid-cols-2 gap-4">
          {[
            ["1985", "AESA founded by 27 practising professionals"],
            ["1992", "First city-wide Architects' & Engineers' Convention hosted"],
            ["2001", "Public service-provider directory launched"],
            ["2010", "AESA Bhawan land acquired on Station Road"],
            ["2015", "Bhawan phase-1 inaugurated; first AGM held in-house"],
            ["2024", "Membership crosses 400; digital programme begins"],
          ].map(([y, t]) => (
            <li key={y} className="rounded-xl border border-border bg-card p-5 flex gap-4">
              <div className="font-display text-2xl font-bold text-brand">{y}</div>
              <div className="text-sm text-muted-foreground self-center">{t}</div>
            </li>
          ))}
        </ol>
      </Section>

      <Section eyebrow="Philosophy" title="What we stand for">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            ["Competence", "We back qualified, registered practice — and the continuing education that keeps it sharp."],
            ["Public good", "Buildings serve people first. Our advocacy puts safety, accessibility and the environment ahead of expediency."],
            ["Community", "A profession is stronger when its members know each other. We invest in that bond."],
          ].map(([t, b]) => (
            <div key={t} className="rounded-xl border border-border bg-card p-6">
              <div className="font-display text-xl font-bold text-ink">{t}</div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}