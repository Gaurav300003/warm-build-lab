import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { Field, TextInput } from "@/components/site/Field";

export const Route = createFileRoute("/admin_/login")({
  head: () => ({ meta: [{ title: "Admin Login — AESA Nagar" }, { name: "robots", content: "noindex" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const fn = mode === "login"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
      const { error } = await fn;
      if (error) throw error;
      navigate({ to: "/admin" });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Authentication failed");
    } finally { setBusy(false); }
  }

  return (
    <div>
      <PageHero eyebrow="Admin" title={mode === "login" ? "Admin sign in" : "Create admin account"} description="Only AESA admins can access the dashboard. The first account created becomes the admin." />
      <Section>
        <div className="max-w-md mx-auto rounded-2xl border border-border bg-card p-6 lg:p-8">
          <form onSubmit={submit} className="space-y-4">
            <Field label="Email" required><TextInput required type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
            <Field label="Password" required><TextInput required type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
            {err && <div className="text-sm text-destructive">{err}</div>}
            <button disabled={busy} type="submit" className="w-full inline-flex items-center justify-center rounded-md bg-ink px-6 py-3 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-50">
              {busy ? "Please wait…" : mode === "login" ? "Sign in →" : "Create account →"}
            </button>
            <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")} className="block w-full text-center text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-ink">
              {mode === "login" ? "Need an account? Sign up" : "Have an account? Sign in"}
            </button>
            <Link to="/" className="block text-center text-xs text-muted-foreground hover:text-ink">← Back to site</Link>
          </form>
        </div>
      </Section>
    </div>
  );
}