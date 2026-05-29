import { CheckCircle2, MessageCircle } from "lucide-react";

export function FormSuccess({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-brand/30 bg-brand/5 p-6">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="h-6 w-6 text-brand flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-display font-bold text-lg text-ink">Ready to send on WhatsApp</div>
          <p className="mt-1 text-sm text-muted-foreground">{message}</p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-whatsapp">
            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp opened — tap Send to deliver
          </div>
        </div>
      </div>
    </div>
  );
}