import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Mail, MessageCircle, ArrowUpRight } from "lucide-react";
import { CONTACT_PHONE, getWhatsAppLink } from "@/lib/contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Visit — Shashti Diagnostic Center, Chidambaram" },
      { name: "description", content: "Visit, call or message Shashti Diagnostic Center. Open 24/7 with home sample collection across Chidambaram." },
      { property: "og:title", content: "Visit — Shashti Diagnostic" },
      { property: "og:description", content: "Open 24/7. Walk in, call, or schedule home sample collection." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const cards = [
    { num: "I", icon: MapPin, label: "Visit", lines: ["Laya Complex,", "S.P Kovil Street,", "Chidambaram, Tamil Nadu"], cta: { href: "https://www.google.com/maps?q=Chidambaram,Tamil+Nadu", label: "Get directions" } },
    { num: "II", icon: Phone, label: "Call", lines: [CONTACT_PHONE, "Open 24 / 7 · 365"], cta: { href: `tel:${CONTACT_PHONE.replace(/\s/g, "")}`, label: "Call now" } },
    { num: "III", icon: Mail, label: "Write", lines: ["info@shashtidiagnostic.in", "We respond within the hour"], cta: { href: "mailto:info@shashtidiagnostic.in", label: "Send email" } },
  ];

  return (
    <div>
      <section className="bg-gradient-warm">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-6 pb-16 lg:pt-10 lg:pb-20">
          <h1 className="font-display text-4xl sm:text-6xl lg:text-[5.5rem] leading-[0.95] tracking-[-0.035em]">
            Come<br /><span className="serif-italic">find us</span><span className="text-accent">.</span>
          </h1>
          <p className="mt-8 max-w-xl text-base text-muted-foreground leading-relaxed">
            Walk in any hour of the day or night. Or schedule a doorstep collection — we&rsquo;ll be there within the hour.
          </p>
        </div>
      </section>

      {/* Three columns */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 py-12 lg:py-16">
        <div className="grid gap-px bg-border lg:grid-cols-3">
          {cards.map((c) => (
            <div key={c.label} className="bg-background p-8 lg:p-10 flex flex-col">
              <div className="flex items-start justify-between">
                <span className="font-display text-4xl serif-italic text-accent">{c.num}</span>
                <c.icon className="h-5 w-5 text-foreground/50" strokeWidth={1.5} />
              </div>
              <div className="mt-10 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{c.label}</div>
              <div className="mt-3 font-display text-xl lg:text-2xl leading-snug">
                {c.lines.map((l) => <div key={l}>{l}</div>)}
              </div>
              <a href={c.cta.href} target={c.cta.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="group mt-auto pt-10 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider hover:text-accent transition-colors">
                {c.cta.label} <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:rotate-45" />
              </a>
            </div>
          ))}
        </div>

        {/* WhatsApp banner */}
        <div className="mt-12 bg-foreground text-background p-10 sm:p-14 lg:p-20">
          <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-background/55">Fastest channel</div>
              <h2 className="mt-5 font-display text-4xl lg:text-6xl leading-[0.98] tracking-tight">
                Or send us a<br /><span className="serif-italic text-accent">message</span>.
              </h2>
              <p className="mt-5 max-w-md text-background/65">A real human will reply, day or night, usually within minutes.</p>
            </div>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-accent text-accent-foreground px-8 py-4 text-xs font-mono uppercase tracking-wider hover:bg-background hover:text-foreground transition-colors"
            >
              <MessageCircle className="h-4 w-4" /> Chat on WhatsApp <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:rotate-45" />
            </a>
          </div>
        </div>

        {/* Map */}
        <div className="mt-12 border hairline">
          <div className="flex items-center justify-between border-b hairline px-5 py-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Plate · Location</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Chidambaram, T.N.</div>
          </div>
          <iframe
            title="Shashti Diagnostic Center location"
            src="https://www.google.com/maps?q=Chidambaram,Tamil+Nadu&output=embed"
            width="100%"
            height="460"
            loading="lazy"
            className="block w-full grayscale"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}
