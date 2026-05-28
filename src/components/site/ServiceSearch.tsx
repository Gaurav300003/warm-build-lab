import { useMemo, useState } from "react";
import { Search, Phone, MessageCircle } from "lucide-react";

type Provider = {
  name: string;
  category: string;
  phone: string;
  type: "Professional" | "Contractor" | "Supplier";
};

const ALL: Provider[] = [
  { name: "R. K. Joshi & Associates", category: "Architect", phone: "+919876543201", type: "Professional" },
  { name: "Patil Structural Consultants", category: "RCC Engineer", phone: "+919876543202", type: "Professional" },
  { name: "Deshmukh Surveyors", category: "Land Surveyor", phone: "+919876543203", type: "Professional" },
  { name: "Sharma Construction Co.", category: "Civil Contractor", phone: "+919876543204", type: "Contractor" },
  { name: "Mahavir Builders", category: "General Contractor", phone: "+919876543205", type: "Contractor" },
  { name: "Sai Painters", category: "Painter", phone: "+919876543206", type: "Contractor" },
  { name: "Ahmednagar Cement Depot", category: "Cement Supplier", phone: "+919876543207", type: "Supplier" },
  { name: "Bharat Steel Traders", category: "Steel Supplier", phone: "+919876543208", type: "Supplier" },
  { name: "Modern Tiles & Marbles", category: "Tiles Supplier", phone: "+919876543209", type: "Supplier" },
];

const TABS: Provider["type"][] = ["Professional", "Contractor", "Supplier"];

export function ServiceSearch() {
  const [tab, setTab] = useState<Provider["type"]>("Professional");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return ALL.filter((p) => p.type === tab)
      .filter((p) => !cat || p.category === cat)
      .filter((p) => {
        const t = q.trim().toLowerCase();
        if (!t) return true;
        return p.name.toLowerCase().includes(t) || p.category.toLowerCase().includes(t);
      });
  }, [tab, q, cat]);

  const categories = useMemo(
    () => Array.from(new Set(ALL.filter((p) => p.type === tab).map((p) => p.category))),
    [tab],
  );

  return (
    <div className="rounded-2xl border border-border bg-card p-5 lg:p-7">
      <div className="flex flex-wrap gap-1 rounded-lg bg-secondary p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setCat(null);
            }}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
              tab === t ? "bg-card text-ink shadow-sm" : "text-muted-foreground hover:text-ink"
            }`}
          >
            {t === "Professional" ? "Professionals" : t === "Contractor" ? "Contractors" : "Material Suppliers"}
          </button>
        ))}
      </div>

      <div className="mt-5 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${tab.toLowerCase()}s by name or category…`}
          className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setCat(null)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium border ${
            !cat ? "bg-ink text-background border-ink" : "border-border text-muted-foreground hover:border-ink"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(cat === c ? null : c)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium border ${
              cat === c ? "bg-ink text-background border-ink" : "border-border text-muted-foreground hover:border-ink"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {filtered.map((p) => (
          <div key={p.name} className="group rounded-xl border border-border bg-background p-4 hover:border-brand transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-display font-semibold text-ink">{p.name}</div>
                <div className="mt-1 inline-block rounded-full bg-secondary px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  {p.category}
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <a
                href={`tel:${p.phone}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs font-semibold hover:border-ink"
              >
                <Phone className="h-3.5 w-3.5" /> Call
              </a>
              <a
                href={`https://wa.me/${p.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-whatsapp px-3 py-2 text-xs font-semibold text-whatsapp-foreground hover:opacity-90"
              >
                <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
              </a>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="sm:col-span-2 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No matches. Try a different search.
          </div>
        )}
      </div>
    </div>
  );
}