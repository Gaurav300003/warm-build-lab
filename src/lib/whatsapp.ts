// WhatsApp integration via wa.me link redirect.
// Update ADMIN_WHATSAPP to the AESA admin's number (digits only, with country code, no +).
export const ADMIN_WHATSAPP = "919876543210";

export type WAField = [label: string, value: string | number | undefined | null];

export function buildWhatsAppMessage(title: string, fields: WAField[]): string {
  const lines = [`*${title}*`, "", ...fields
    .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "")
    .map(([k, v]) => `*${k}:* ${v}`)];
  return lines.join("\n");
}

export function waLink(message: string, phone: string = ADMIN_WHATSAPP): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function sendToWhatsApp(title: string, fields: WAField[], phone?: string) {
  const url = waLink(buildWhatsAppMessage(title, fields), phone);
  window.open(url, "_blank", "noopener,noreferrer");
}

export function formDataToFields(form: HTMLFormElement, labels: Record<string, string>): WAField[] {
  const fd = new FormData(form);
  return Object.entries(labels).map(([name, label]) => {
    const v = fd.get(name);
    return [label, typeof v === "string" ? v : v instanceof File ? v.name : ""] as WAField;
  });
}