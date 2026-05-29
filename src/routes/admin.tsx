import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Section } from "@/components/site/Section";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — AESA Nagar" }, { name: "robots", content: "noindex" }] }),
  component: AdminDashboard,
});

const TABS = [
  { key: "contact_messages", label: "Contact" },
  { key: "membership_applications", label: "Membership" },
  { key: "bhawan_bookings", label: "Bhawan" },
  { key: "ad_enquiries", label: "Ads" },
] as const;
type TabKey = typeof TABS[number]["key"];

function AdminDashboard() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState<TabKey>("contact_messages");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate({ to: "/admin/login" }); return; }
      setEmail(user.email ?? null);
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      setIsAdmin(!!data);
      setReady(true);
    })();
  }, [navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from(tab) as any).select("*").order("created_at", { ascending: false }).limit(200)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(({ data }: { data: any[] | null }) => { setRows(data ?? []); setLoading(false); });
  }, [tab, isAdmin]);

  async function logout() { await supabase.auth.signOut(); navigate({ to: "/admin/login" }); }

  if (!ready) return <Section><div className="text-center text-sm text-muted-foreground">Loading…</div></Section>;

  if (!isAdmin) {
    return (
      <Section eyebrow="Admin" title="Access denied">
        <p className="text-sm text-muted-foreground">Signed in as <span className="font-mono">{email}</span>, but this account is not an admin. Ask an existing admin to grant you access.</p>
        <button onClick={logout} className="mt-4 rounded-md border border-border px-4 py-2 text-sm font-semibold">Sign out</button>
      </Section>
    );
  }

  const cols = rows[0] ? Object.keys(rows[0]).filter((k) => k !== "id") : [];

  return (
    <Section eyebrow="Admin Dashboard" title="Submissions">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div className="flex gap-1 flex-wrap">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`rounded-md px-3 py-2 text-sm font-semibold border ${tab === t.key ? "bg-ink text-background border-ink" : "border-border bg-card text-ink hover:border-ink"}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="font-mono">{email}</span>
          <Link to="/" className="hover:text-ink">Site →</Link>
          <button onClick={logout} className="rounded-md border border-border px-3 py-1.5 hover:border-ink">Sign out</button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No submissions yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left">
              <tr>{cols.map((c) => <th key={c} className="px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{c}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id ?? i} className="border-t border-border align-top">
                  {cols.map((c) => (
                    <td key={c} className="px-3 py-2 text-ink max-w-[260px] break-words">
                      {r[c] === null || r[c] === undefined ? <span className="text-muted-foreground">—</span> : String(r[c])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Showing latest 200 records.</p>
    </Section>
  );
}