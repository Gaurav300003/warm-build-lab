import { supabase } from "@/integrations/supabase/client";
import { sendToWhatsApp, type WAField } from "./whatsapp";

type AnyRecord = Record<string, unknown>;

export async function submitAndNotify(
  table: "contact_messages" | "membership_applications" | "bhawan_bookings" | "ad_enquiries",
  payload: AnyRecord,
  waTitle: string,
  waFields: WAField[],
): Promise<{ ok: boolean; error?: string }> {
  // Best-effort DB insert. We still open WhatsApp even if DB write fails
  // so the user is never blocked from contacting the admin.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from(table) as any).insert(payload);
  sendToWhatsApp(waTitle, waFields);
  if (error) {
    console.error(`[${table}] insert failed`, error);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}