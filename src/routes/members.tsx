import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { ServiceSearch } from "@/components/site/ServiceSearch";

export const Route = createFileRoute("/members")({
  head: () => ({
    meta: [
      { title: "Members Directory — AESA Nagar" },
      { name: "description", content: "Browse approved AESA Nagar members — architects, engineers and surveyors practising in Ahmednagar." },
      { property: "og:title", content: "AESA Members Directory" },
      { property: "og:description", content: "Find a verified professional in Ahmednagar." },
    ],
    links: [{ rel: "canonical", href: "/members" }],
  }),
  component: MembersPage,
});

function MembersPage() {
  return (
    <div>
      <PageHero eyebrow="Directory" title="Verified AESA members" description="Approved members appear here automatically. Search by name or filter by profession to connect via call or WhatsApp." />
      <Section>
        <ServiceSearch />
      </Section>
    </div>
  );
}