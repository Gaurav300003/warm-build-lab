import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { Field, TextInput, TextArea, Select } from "@/components/site/Field";
import { FormSuccess } from "@/components/site/FormSuccess";
import { QrCode, Share2, ShieldCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/business-card")({
  head: () => ({
    meta: [
      { title: "Digital Business Card — ₹1,500/yr — AESA Nagar" },
      { name: "description", content: "A hosted mini-website for your business — shareable link, QR code, AESA-verified badge. ₹1,500 per year." },
      { property: "og:title", content: "AESA Digital Business Card — ₹1,500/yr" },
      { property: "og:description", content: "A clean mini-website for contractors, architects and suppliers. Hosted on aesanagar.org." },
    ],
    links: [{ rel: "canonical", href: "/business-card" }],
  }),
  component: BizCardPage,
});

function BizCardPage() {
  const [done, setDone] = useState(false);
  return (
    <div>
      <PageHero
        eyebrow="Digital Business Card · ₹1,500 / year"
        title={<>Your own <em className="not-italic text-brand">mini-website</em>, in a day.</>}
        description="Fill one form. We host a clean, shareable card at aesanagar.org/biz/your-name with a QR code, call & WhatsApp buttons, your services and an AESA-verified badge."
      />

      <Section eyebrow="Pricing" title="Pick a plan">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { name: "Digital Card", price: "₹1,500", per: "/ year", desc: "Hosted page · QR · shareable link", featured: true },
            { name: "Featured Listing", price: "₹2,500", per: "/ year", desc: "Card + highlighted in Service Provider Search" },
            { name: "Full Ad + Card", price: "₹4,000", per: "/ year", desc: "Card + homepage tile + featured listing" },
          ].map((p) => (
            <div key={p.name} className={`relative rounded-2xl border bg-card p-6 ${p.featured ? "border-brand shadow-[0_10px_40px_-20px_oklch(0.52_0.13_155/0.5)]" : "border-border"}`}>
              {p.featured && <div className="absolute -top-3 left-6 rounded-full bg-brand px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-brand-foreground">Most Popular</div>}
              <div className="font-display text-lg font-bold text-ink">{p.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <div className="font-display text-4xl font-extrabold text-ink">{p.price}</div>
                <div className="text-sm text-muted-foreground">{p.per}</div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="What's included" title="Every card comes with">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { Icon: Share2, t: "Shareable URL", d: "aesanagar.org/biz/your-name" },
            { Icon: QrCode, t: "Downloadable QR", d: "Print on cards, hoardings, vehicles" },
            { Icon: ShieldCheck, t: "AESA Verified badge", d: "Trust signal for your clients" },
            { Icon: Sparkles, t: "1 free update / year", d: "WhatsApp the admin with changes" },
          ].map(({ Icon, t, d }) => (
            <div key={t} className="rounded-xl border border-border bg-card p-5">
              <Icon className="h-5 w-5 text-brand" />
              <div className="mt-3 font-display font-bold text-ink">{t}</div>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Sign up" title="Fill your business details">
        <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
          {done ? (
            <FormSuccess message="Request received. The AESA admin will WhatsApp you to confirm payment, then your card will go live within 24 hours." />
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setDone(true); }} className="grid sm:grid-cols-2 gap-4">
              <Field label="Business / Owner Name" required><TextInput required /></Field>
              <Field label="Business Category" required>
                <Select required defaultValue="">
                  <option value="" disabled>Choose…</option>
                  <option>Architect</option><option>Contractor</option><option>Supplier</option><option>Engineer</option><option>Other</option>
                </Select>
              </Field>
              <Field label="Phone Number" required><TextInput required type="tel" placeholder="+91" /></Field>
              <Field label="WhatsApp Number"><TextInput type="tel" placeholder="Defaults to phone" /></Field>
              <Field label="Email Address"><TextInput type="email" /></Field>
              <Field label="Years of Experience"><TextInput type="number" min={0} /></Field>
              <Field label="Full Address" required full><TextArea required rows={2} /></Field>
              <Field label="Short Description (max 200 chars)" full><TextArea rows={2} maxLength={200} placeholder="e.g. We provide RCC consulting and site supervision in Ahmednagar." /></Field>
              <Field label="Services Offered (comma-separated)" full><TextInput placeholder="Design, Estimation, Site Visit" /></Field>
              <Field label="Business Logo / Photo">
                <TextInput type="file" accept=".jpg,.jpeg,.png" className="!py-2" />
              </Field>
              <Field label="Website / Social Link"><TextInput type="url" placeholder="https://" /></Field>
              <Field label="Google Maps Link" full><TextInput type="url" placeholder="Paste from Google Maps" /></Field>
              <div className="sm:col-span-2">
                <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground hover:opacity-90">
                  Request My Digital Card →
                </button>
                <p className="mt-3 text-xs text-muted-foreground">
                  ₹1,500/year. Pay via UPI / bank transfer / cash after admin confirms.
                </p>
              </div>
            </form>
          )}
        </div>
      </Section>
    </div>
  );
}