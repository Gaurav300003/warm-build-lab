import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { Field, TextInput, TextArea, Select } from "@/components/site/Field";
import { FormSuccess } from "@/components/site/FormSuccess";
import { CheckCircle2 } from "lucide-react";
import { sendToWhatsApp, formDataToFields } from "@/lib/whatsapp";

export const Route = createFileRoute("/membership")({
  head: () => ({
    meta: [
      { title: "Membership — AESA Nagar" },
      { name: "description", content: "Apply for AESA Nagar membership. Eligibility, required documents and the application form for architects, engineers and surveyors in Ahmednagar." },
      { property: "og:title", content: "AESA Nagar Membership" },
      { property: "og:description", content: "Join 400+ architects, engineers and surveyors in Ahmednagar." },
    ],
    links: [{ rel: "canonical", href: "/membership" }],
  }),
  component: MembershipPage,
});

function MembershipPage() {
  const [done, setDone] = useState(false);
  return (
    <div>
      <PageHero eyebrow="Membership" title="Apply to join AESA Nagar" description="Architects, engineers, surveyors and allied professionals practising in or around Ahmednagar are welcome to apply." />

      <Section eyebrow="Eligibility" title="Who can join">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8">
          <div className="space-y-3">
            {[
              "Registered Architect with the Council of Architecture (CoA)",
              "Registered Civil / Structural / RCC Engineer",
              "Licensed Land Surveyor or Town Planner",
              "Allied built-environment professional practising in Ahmednagar district",
            ].map((e) => (
              <div key={e} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                <CheckCircle2 className="h-5 w-5 text-brand flex-shrink-0 mt-0.5" />
                <div className="text-sm text-ink">{e}</div>
              </div>
            ))}
          </div>
          <aside className="rounded-2xl border border-border bg-secondary p-6">
            <div className="eyebrow mb-3">Required Documents</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Professional licence / CoA registration (PDF/JPG)</li>
              <li>• Photo ID proof (Aadhaar / PAN)</li>
              <li>• Recent passport-size photograph</li>
              <li>• Office / practice address proof</li>
            </ul>
            <div className="mt-5 rounded-lg bg-card border border-border p-4">
              <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Annual fee</div>
              <div className="font-display text-2xl font-bold text-ink">₹1,500</div>
              <div className="text-xs text-muted-foreground mt-1">Payable on approval, via UPI / bank transfer / cash.</div>
            </div>
          </aside>
        </div>
      </Section>

      <Section eyebrow="Application" title="Membership form" description="Submit the form below. The AESA admin reviews documents and approves typically within 5 working days.">
        <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
          {done ? (
            <FormSuccess message="Your membership request has been submitted. The AESA admin will review your documents and contact you on WhatsApp once approved." />
          ) : (
            <form onSubmit={(e) => {
              e.preventDefault();
              sendToWhatsApp("New Membership Application — AESA Nagar", formDataToFields(e.currentTarget, {
                name: "Name", phone: "Mobile", email: "Email", category: "Profession",
                licence: "Licence No.", website: "Website / LinkedIn", address: "Office Address",
                document: "Document", photo: "Profile Photo",
              }));
              setDone(true);
            }} className="grid sm:grid-cols-2 gap-4">
              <Field label="Full Name" required><TextInput required name="name" /></Field>
              <Field label="Mobile Number" required><TextInput required name="phone" type="tel" placeholder="+91" /></Field>
              <Field label="Email Address" required><TextInput required name="email" type="email" /></Field>
              <Field label="Profession / Category" required>
                <Select required name="category" defaultValue="">
                  <option value="" disabled>Choose…</option>
                  <option>Architect</option>
                  <option>RCC / Structural Engineer</option>
                  <option>Civil Engineer</option>
                  <option>Land Surveyor</option>
                  <option>Town Planner</option>
                  <option>Other</option>
                </Select>
              </Field>
              <Field label="Registration / Licence No." required><TextInput required name="licence" /></Field>
              <Field label="Website / LinkedIn"><TextInput name="website" type="url" placeholder="https://" /></Field>
              <Field label="Office Address" required full><TextArea required name="address" rows={3} /></Field>
              <Field label="Document Upload (Licence / ID)" required>
                <TextInput required name="document" type="file" accept=".pdf,.jpg,.jpeg,.png" className="!py-2" />
              </Field>
              <Field label="Profile Photo">
                <TextInput name="photo" type="file" accept=".jpg,.jpeg,.png" className="!py-2" />
              </Field>
              <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-md bg-ink px-6 py-3 text-sm font-semibold text-background hover:opacity-90">
                  Submit Application →
                </button>
                <p className="text-xs text-muted-foreground">
                  Admin gets a WhatsApp alert instantly. You'll be notified once your application is approved.
                </p>
              </div>
            </form>
          )}
        </div>
      </Section>
    </div>
  );
}