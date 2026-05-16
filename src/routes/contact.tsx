import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Mail, MessageCircle, ArrowUpRight } from "lucide-react";
import { CONTACT_PHONE, CONTACT_LANDLINE, getWhatsAppLink } from "@/lib/contact";
import { useLanguage } from "@/lib/i18n.tsx";
import { Breadcrumbs } from "@/components/SEO";
import { cn } from "@/lib/utils";

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
  const { t } = useLanguage();
  const cards = [
    { num: "I", icon: MapPin, label: t("contact_visit"), lines: ["No:24/27, Laya complex,", "OLD M.A.T Lodge, Sp Kovil Street,", "Chidambaram, Tamil Nadu"], cta: { href: "https://www.google.com/maps/place/SHASHTI+DIAGNOSTIC+CENTER/@11.3951255,79.6933382,17z/data=!3m1!4b1!4m6!3m5!1s0x3a54c3da9b033d09:0xca3643b5dd6846b3!8m2!3d11.3951255!4d79.6959131!16s%2Fg%2F11vwfj6r7t", label: t("contact_get_directions") } },
    { num: "II", icon: Phone, label: t("contact_call"), lines: [CONTACT_PHONE, CONTACT_LANDLINE, t("contact_open_always")], cta: { href: `tel:${CONTACT_PHONE.replace(/\s/g, "")}`, label: t("contact_call_now") } },
    { num: "III", icon: Mail, label: t("contact_write"), lines: ["shashtidiagnostic.cdm@gmail.com", t("contact_email_respond")], cta: { href: "mailto:shashtidiagnostic.cdm@gmail.com", label: t("contact_send_email") } },
  ];

  return (
    <div>
      <section className="bg-gradient-warm">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-6 pb-16 lg:pt-10 lg:pb-20">
          <Breadcrumbs />
          <h1 className="font-display text-4xl sm:text-6xl lg:text-[5.5rem] leading-[0.95] tracking-[-0.035em]">
            {t("contact_title_1")}<br /><span className="serif-italic">{t("contact_title_2")}</span><span className="text-accent">.</span>
          </h1>
          <p className="mt-8 max-w-xl text-base text-muted-foreground leading-relaxed">
            {t("contact_desc")}
          </p>
        </div>
      </section>

      {/* Three columns */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 py-12 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
          {cards.map((c) => (
            <div key={c.label} className="group relative bg-card p-10 lg:p-12 flex flex-col rounded-3xl border border-border shadow-soft hover:shadow-elevated hover:border-primary/20 transition-all duration-500 overflow-hidden">
              {/* Background Accent Gradient */}
              <div className="absolute -top-24 -right-24 h-48 w-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
              
              <div className="flex items-start justify-between relative z-10">
                <div className="font-display text-5xl serif-italic text-accent/30 group-hover:text-accent transition-colors duration-500">{c.num}</div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/50 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-sm group-hover:shadow-glow group-hover:-translate-y-1">
                  <c.icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
              </div>

              <div className="mt-12 relative z-10">
                <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-4">{c.label}</div>
                <div className="font-display text-2xl lg:text-3xl leading-snug tracking-tight text-foreground/90">
                  {c.lines.map((l, i) => (
                    <div key={i} className={cn(i > 0 && "text-base lg:text-lg text-muted-foreground mt-1 font-sans font-normal tracking-normal")}>
                      {l}
                    </div>
                  ))}
                </div>
              </div>

              <a 
                href={c.cta.href} 
                target={c.cta.href.startsWith("http") ? "_blank" : undefined} 
                rel="noopener noreferrer" 
                className="group/btn mt-12 pt-8 border-t border-border inline-flex items-center gap-3 text-xs font-mono uppercase tracking-[0.2em] text-primary hover:text-accent transition-colors relative z-10"
              >
                <span className="relative overflow-hidden inline-block">
                  <span className="inline-block transition-transform duration-300 group-hover/btn:-translate-y-full">{c.cta.label}</span>
                  <span className="absolute left-0 top-0 inline-block translate-y-full transition-transform duration-300 group-hover/btn:translate-y-0 text-accent font-bold">{c.cta.label}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:rotate-45 group-hover/btn:scale-125" />
              </a>
            </div>
          ))}
        </div>

        {/* WhatsApp banner */}
        <div className="mt-12 bg-foreground text-background p-10 sm:p-14 lg:p-20">
          <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-background/55">{t("contact_whatsapp_fast")}</div>
              <h2 className="mt-5 font-display text-4xl lg:text-6xl leading-[0.98] tracking-tight">
                {t("contact_whatsapp_title_1") || "Or send us a"}<br /><span className="serif-italic text-accent">{t("contact_whatsapp_title_2") || "message"}</span>.
              </h2>
              <p className="mt-5 max-w-md text-background/65">{t("contact_whatsapp_reply")}</p>
            </div>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-accent text-accent-foreground px-8 py-4 text-xs font-mono uppercase tracking-wider hover:bg-background hover:text-foreground transition-colors cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" /> {t("contact_whatsapp_btn")} <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:rotate-45" />
            </a>
          </div>
        </div>

        {/* Map */}
        <div className="mt-12 border hairline">
          <div className="flex items-center justify-between border-b hairline px-5 py-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{t("contact_plate_location")}</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Chidambaram, T.N.</div>
          </div>
          <iframe
            title="Shashti Diagnostic Center location"
            src="https://www.google.com/maps?q=11.3951255,79.6959131&output=embed"
            width="100%"
            height="460"
            loading="lazy"
            className="block w-full"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}
