import { supabase } from "@/integrations/supabase/client";
import { sendToWhatsApp, type WAField } from "./whatsapp";

type AnyRecord = Record<string, unknown>;

type TableName = "contact_messages" | "membership_applications" | "bhawan_bookings" | "ad_enquiries";

// Set VITE_PHP_API_URL (e.g. http://localhost:8000 or https://aesanagar.org/php-backend)
// to store submissions in the PHP + MySQL backend instead of Lovable Cloud.
const PHP_API = (import.meta.env['VITE_PHP_API_URL'] as string | undefined)?.replace(/\/$/, "");

const PHP_FORM: Record<TableName, string> = {
  contact_messages: "contact",
  membership_applications: "membership",
  bhawan_bookings: "bhawan",
  ad_enquiries: "advertise",
};

async function saveToPhp(table: TableName, payload: AnyRecord): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${PHP_API}/api/submit.php?form=${PHP_FORM[table]}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (!res.ok || !json?.ok) return { ok: false, error: json?.error ?? `HTTP ${res.status}` };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Network error" };
  }
}

export async function submitAndNotify(
  table: TableName,
  payload: AnyRecord,
  waTitle: string,
  waFields: WAField[],
): Promise<{ ok: boolean; error?: string }> {
  // Best-effort save. We still open WhatsApp even if the save fails
  // so the user is never blocked from contacting the admin.
  let result: { ok: boolean; error?: string };
  if (PHP_API) {
    result = await saveToPhp(table, payload);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from(table) as any).insert(payload);
    result = error ? { ok: false, error: error.message } : { ok: true };
  }
  sendToWhatsApp(waTitle, waFields);
  if (!result.ok) console.error(`[${table}] save failed`, result.error);
  return result;
}
