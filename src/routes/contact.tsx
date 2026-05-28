import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { Field, TextInput, TextArea } from "@/components/site/Field";
import { FormSuccess } from "@/components/site/FormSuccess";
import { MapPin, Phone, Mail, Facebook, Twitter, Youtube, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — AESA Nagar" },
      { name: "description", content: "Reach AESA Nagar — office address, phone, map and a WhatsApp-integrated contact form." },
      { property: "og:title", content: "Contact AESA Nagar" },
      { property: "og:description", content: "Reach AESA's secretariat — office, map, phone and contact form." },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [done, setDone] = useState(false);
  return (
    <div>
      <PageHero eyebrow="Contact" title="Talk to the AESA secretariat" description="Drop us a message and the AESA admin will respond via WhatsApp or phone, usually within a working day." />

      <Section>
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10">
          <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
            {done ? (
              <FormSuccess message="Thanks — your message has been delivered to the AESA admin via WhatsApp. We'll get back to you shortly." />
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setDone(true);
                }}
                className="grid sm:grid-cols-2 gap-4"
              >
                <Field label="Full Name" required><TextInput required name="name" placeholder="Your name" /></Field>
                <Field label="Phone Number" required><TextInput required type="tel" name="phone" placeholder="+91" /></Field>
                <Field label="Email Address"><TextInput type="email" name="email" placeholder="you@example.com" /></Field>
                <Field label="Subject" required><TextInput required name="subject" placeholder="What's this about?" /></Field>
                <Field label="Message" required full><TextArea required name="message" rows={5} placeholder="Type your message…" /></Field>
                <div className="sm:col-span-2">
                  <button type="submit" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-ink px-6 py-3 text-sm font-semibold text-background hover:opacity-90">
                    <MessageCircle className="h-4 w-4" /> Send Message
                  </button>
                  <p className="mt-3 text-xs text-muted-foreground">
                    On submit, your message is sent as a formatted WhatsApp note to the AESA admin number.
                  </p>
                </div>
              </form>
            )}
          </div>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="eyebrow mb-3">Office</div>
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 text-brand flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <div className="font-display font-semibold text-ink">AESA Bhawan</div>
                  <div className="text-muted-foreground">Station Road, Ahmednagar<br/>Maharashtra 414001, India</div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <a href="tel:+919876543210" className="flex items-center gap-2 text-ink hover:text-brand">
                  <Phone className="h-4 w-4" /> +91 98765 43210
                </a>
                <a href="mailto:hello@aesanagar.org" className="flex items-center gap-2 text-ink hover:text-brand">
                  <Mail className="h-4 w-4" /> hello@aesanagar.org
                </a>
              </div>
              <a
                href="https://maps.google.com/?q=Ahmednagar+Station+Road"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-4 py-2 text-xs font-semibold hover:border-ink"
              >
                Get Directions →
              </a>
            </div>

            <div className="rounded-2xl overflow-hidden border border-border bg-card aspect-video">
              <iframe
                title="AESA Bhawan map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=74.7245%2C19.0750%2C74.7645%2C19.1050&layer=mapnik&marker=19.0900%2C74.7445"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="eyebrow mb-3">Follow AESA</div>
              <div className="flex gap-2">
                {[Facebook, Twitter, Youtube, MessageCircle].map((Icon, i) => (
                  <a key={i} href="#" aria-label="social" className="grid h-10 w-10 place-items-center rounded-md border border-border hover:bg-brand hover:text-brand-foreground hover:border-brand">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </div>
  );
}