import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { Field, TextInput, Select } from "@/components/site/Field";
import { FormSuccess } from "@/components/site/FormSuccess";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/advertise")({
  head: () => ({
    meta: [
      { title: "Advertise with AESA — Reach Ahmednagar's builders" },
      { name: "description", content: "Banner, tile and sponsor ad packages on aesanagar.org — reach 400+ architects, engineers and surveyors and the city's construction audience." },
      { property: "og:title", content: "Advertise with AESA" },
      { property: "og:description", content: "Sponsor packages to reach Ahmednagar's construction community." },
    ],
    links: [{ rel: "canonical", href: "/advertise" }],
  }),
  component: AdvertisePage,
});

const PACKAGES = [
  { name: "Homepage Carousel Slide", price: "₹12,000 / month", desc: "A full-bleed slide in the homepage hero carousel.", bullets: ["Up to 8 active slides", "Image + headline + CTA", "Click-through to your URL"] },
  { name: "Homepage Tile", price: "₹4,000 / month", desc: "Sidebar advertiser tile, visible on every home visit.", bullets: ["Logo + tagline", "Always above the fold", "Click-through link"] },
  { name: "Service Provider Sponsor", price: "₹2,500 / month", desc: "Featured placement at the top of the service directory.", bullets: ["Top of search results", "Highlighted badge", "Phone + WhatsApp CTAs"] },
  { name: "Notice Board Sponsor", price: "₹3,000 / month", desc: "Your brand alongside upcoming events on the home page.", bullets: ["Visible to 4,000+ monthly visitors", "Logo + line of copy"] },
];

function AdvertisePage() {
  const [done, setDone] = useState(false);
  return (
    <div>
      <PageHero eyebrow="Advertise" title={<>Reach Ahmednagar's <em className="not-italic text-brand">builders & buyers</em>.</>} description="Place your brand in front of 400+ practising architects, engineers and surveyors — and the homeowners and developers they advise every day." />

      <Section eyebrow="Packages" title="Choose your placement">
        <div className="grid md:grid-cols-2 gap-5">
          {PACKAGES.map((p) => (
            <div key={p.name} className="rounded-2xl border border-border bg-card p-6">
              <div className="font-display text-xl font-bold text-ink">{p.name}</div>
              <div className="mt-1 font-mono text-sm text-brand">{p.price}</div>
              <p className="mt-3 text-sm text-muted-foreground">{p.desc}</p>
              <ul className="mt-4 space-y-2">
                {p.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-ink">
                    <CheckCircle2 className="h-4 w-4 text-brand flex-shrink-0 mt-0.5" /> {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Enquire" title="Tell us what you need">
        <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
          {done ? (
            <FormSuccess message="Thanks — the AESA admin received your enquiry on WhatsApp and will reach out to discuss." />
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setDone(true); }} className="grid sm:grid-cols-2 gap-4">
              <Field label="Your Name" required><TextInput required /></Field>
              <Field label="Company / Brand" required><TextInput required /></Field>
              <Field label="Phone" required><TextInput required type="tel" placeholder="+91" /></Field>
              <Field label="Email" required><TextInput required type="email" /></Field>
              <Field label="Package" required>
                <Select required defaultValue="">
                  <option value="" disabled>Choose package…</option>
                  {PACKAGES.map((p) => <option key={p.name}>{p.name}</option>)}
                </Select>
              </Field>
              <Field label="Banner / Logo Upload">
                <TextInput type="file" accept=".png,.jpg,.jpeg,.pdf" className="!py-2" />
              </Field>
              <div className="sm:col-span-2">
                <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-md bg-ink px-6 py-3 text-sm font-semibold text-background hover:opacity-90">
                  Send Enquiry →
                </button>
              </div>
            </form>
          )}
        </div>
      </Section>
    </div>
  );
}