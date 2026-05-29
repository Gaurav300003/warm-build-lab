import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { Field, TextInput, TextArea, Select } from "@/components/site/Field";
import { FormSuccess } from "@/components/site/FormSuccess";
import { Users, Projector, Snowflake, Mic, ParkingCircle, Utensils } from "lucide-react";
import bhawan from "@/assets/bhawan.jpg";
import { formDataToFields } from "@/lib/whatsapp";
import { submitAndNotify } from "@/lib/submissions";

export const Route = createFileRoute("/bhawan")({
  head: () => ({
    meta: [
      { title: "AESA Bhawan — Book Halls in Ahmednagar" },
      { name: "description", content: "Book AESA Bhawan in Ahmednagar — main hall, conference room or open area for meetings, seminars, weddings and functions." },
      { property: "og:title", content: "AESA Bhawan — Booking" },
      { property: "og:description", content: "Modern halls for meetings, seminars, weddings and functions in Ahmednagar." },
      { property: "og:image", content: "/og-bhawan.jpg" },
    ],
    links: [{ rel: "canonical", href: "/bhawan" }],
  }),
  component: BhawanPage,
});

function BhawanPage() {
  const [done, setDone] = useState(false);
  return (
    <div>
      <PageHero eyebrow="AESA Bhawan" title="Ahmednagar's venue for the design community." description="A modern hall on Station Road for AGMs, seminars, weddings, exhibitions and city-wide professional events." />

      <Section>
        <div className="grid lg:grid-cols-2 gap-8">
          <img src={bhawan} alt="AESA Bhawan main hall" width={1600} height={900} className="rounded-2xl object-cover w-full aspect-video border border-border" loading="lazy" />
          <div>
            <div className="eyebrow mb-3">Amenities</div>
            <div className="grid grid-cols-2 gap-3">
              {([
                { Icon: Users, t: "300-seat capacity" },
                { Icon: Projector, t: "HD projector & screen" },
                { Icon: Mic, t: "PA system" },
                { Icon: Snowflake, t: "Fully air-conditioned" },
                { Icon: ParkingCircle, t: "On-site parking" },
                { Icon: Utensils, t: "Catering pantry" },
              ]).map(({ Icon, t }) => (
                <div key={t} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                  <Icon className="h-5 w-5 text-brand" />
                  <div className="text-sm font-medium text-ink">{t}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                ["Main Hall", "₹15,000", "₹10,000"],
                ["Conf. Room", "₹5,000", "₹3,500"],
                ["Open Area", "₹8,000", "₹5,500"],
              ].map(([name, np, mp]) => (
                <div key={name} className="rounded-xl border border-border bg-card p-4">
                  <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{name}</div>
                  <div className="font-display text-lg font-bold text-ink mt-1">{np}</div>
                  <div className="text-[11px] text-muted-foreground">Member: <span className="text-brand font-semibold">{mp}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section eyebrow="Booking" title="Request a date">
        <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
          {done ? (
            <FormSuccess message="Booking request sent. The AESA admin will confirm or decline on WhatsApp / phone shortly." />
          ) : (
            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const fd = new FormData(form);
              await submitAndNotify(
                "bhawan_bookings",
                {
                  applicant: fd.get("name"),
                  phone: fd.get("phone"),
                  email: fd.get("email") || null,
                  purpose: fd.get("purpose"),
                  booking_date: fd.get("date"),
                  hall: fd.get("hall"),
                  start_time: fd.get("start"),
                  end_time: fd.get("end"),
                  attendees: Number(fd.get("attendees") || 0),
                  is_member: fd.get("member") === "Yes",
                  member_id: fd.get("memberId") || null,
                  notes: fd.get("notes") || null,
                },
                "New Bhawan Booking Request — AESA",
                formDataToFields(form, {
                  name: "Applicant", phone: "Mobile", email: "Email", purpose: "Event",
                  date: "Date", hall: "Hall", start: "Start", end: "End",
                  attendees: "Attendees", member: "Member?", memberId: "Member ID", notes: "Notes",
                }),
              );
              setDone(true);
            }} className="grid sm:grid-cols-2 gap-4">
              <Field label="Applicant Name" required><TextInput required name="name" /></Field>
              <Field label="Mobile Number" required><TextInput required name="phone" type="tel" placeholder="+91" /></Field>
              <Field label="Email Address"><TextInput name="email" type="email" /></Field>
              <Field label="Event / Purpose" required><TextInput required name="purpose" placeholder="e.g. Wedding reception, AGM" /></Field>
              <Field label="Booking Date" required><TextInput required name="date" type="date" /></Field>
              <Field label="Hall / Area" required>
                <Select required name="hall" defaultValue="">
                  <option value="" disabled>Choose…</option>
                  <option>Main Hall</option>
                  <option>Conference Room</option>
                  <option>Open Area</option>
                  <option>Full Venue</option>
                </Select>
              </Field>
              <Field label="Start Time" required><TextInput required name="start" type="time" /></Field>
              <Field label="End Time" required><TextInput required name="end" type="time" /></Field>
              <Field label="Expected Attendees" required><TextInput required name="attendees" type="number" min={1} /></Field>
              <Field label="AESA Member?">
                <Select name="member" defaultValue="No"><option>No</option><option>Yes</option></Select>
              </Field>
              <Field label="Member ID (if applicable)"><TextInput name="memberId" /></Field>
              <Field label="Additional Notes" full><TextArea name="notes" rows={3} /></Field>
              <div className="sm:col-span-2">
                <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-md bg-ink px-6 py-3 text-sm font-semibold text-background hover:opacity-90">
                  Send Booking Request →
                </button>
              </div>
            </form>
          )}
        </div>
      </Section>
    </div>
  );
}