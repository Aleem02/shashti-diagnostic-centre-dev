import { MessageCircle } from "lucide-react";
import { getWhatsAppLink } from "@/lib/contact";

export function WhatsAppButton() {
  return (
    <a
      href={getWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="group fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-foreground bg-background px-4 py-3 text-xs font-mono uppercase tracking-wider text-foreground shadow-elevated hover:bg-foreground hover:text-background transition-colors"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-moss opacity-75 animate-ping" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-moss" />
      </span>
      <MessageCircle className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">Chat · WhatsApp</span>
    </a>
  );
}
