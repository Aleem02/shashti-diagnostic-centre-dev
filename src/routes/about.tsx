import { createFileRoute } from '@tanstack/react-router'
import { MapPin, ShieldCheck, Clock, Users } from "lucide-react";
import { useLanguage } from "@/lib/i18n.tsx";
import { Breadcrumbs } from "@/components/SEO";
import { Certifications } from "@/components/Certifications";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Shashti Diagnostic Center, Chidambaram" },
      { name: "description", content: "The principles, people and practice behind Shashti — a precision diagnostic center in Chidambaram." },
      { property: "og:title", content: "About — Shashti Diagnostic" },
      { property: "og:description", content: "Diagnostics held to a higher standard. Our story, our principles." },
    ],
  }),
  component: AboutPage,
});

const services = ["Allergy Panels", "Hematology", "Cardiology · ECG", "Neurology · EEG", "Endocrinology", "Lipid Profile", "Diabetes Screening", "Liver & Kidney", "Vitamin Profiles", "Wellness Suites"];

function AboutPage() {
  const { t, language } = useLanguage();
  const trustPillars = [
    { num: "I", icon: ShieldCheck, title: t("pillar_1_title") || "No hidden charges", desc: t("pillar_1_desc") || "Transparent pricing — what you see is what you pay. Always." },
    { num: "II", icon: Clock, title: t("pillar_2_title") || "Reports on time", desc: t("pillar_2_desc") || "Same-day or next-day delivery, every single instance." },
    { num: "III", icon: Users, title: t("pillar_3_title") || "Certified pathology", desc: t("pillar_3_desc") || "Trained technicians and pathologist-reviewed reports." },
  ];
  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-warm">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-6 pb-16 lg:pt-10 lg:pb-20">
          <h1 className="font-display text-4xl sm:text-6xl lg:text-[5.5rem] leading-[0.95] tracking-[-0.035em] max-w-5xl">
            {t("about_title_1")}<br /><span className="serif-italic">{t("about_title_2")}</span><br />{t("about_title_3")}<span className="text-accent">.</span>
          </h1>
          <div className="mt-10 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            No:24/27 · Laya complex · OLD M.A.T Lodge · Sp Kovil Street · Chidambaram
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 py-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{t("about_manifesto_tag")}</div>
          </div>
          <div className="lg:col-span-9">
            <p className={cn(
              "font-display leading-[1.15] text-foreground/90 max-w-4xl tracking-tight",
              language === "ta" ? "text-2xl lg:text-4xl" : "text-3xl lg:text-5xl"
            )}>
              {t("about_manifesto_text")}
            </p>
          </div>
        </div>
      </section>

      {/* Services list */}
      <section className="border-y hairline bg-secondary/40 py-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{t("about_offerings_tag")}</div>
            <h2 className="mt-4 font-display text-4xl lg:text-5xl leading-[1.05]">{t("about_offerings_title_1")}<br /><span className="serif-italic">{t("about_offerings_title_2")}</span>.</h2>
            <p className="mt-5 text-muted-foreground max-w-sm">{t("about_offerings_desc")}</p>
          </div>
          <div className="lg:col-span-8">
            <div className="border-t hairline">
              {services.map((s, i) => (
                <div key={s} className="flex items-center justify-between border-b hairline py-5">
                  <div className="flex items-baseline gap-5">
                    <span className="font-mono text-[10px] text-muted-foreground">{(i + 1).toString().padStart(2, "0")}</span>
                    <span className="font-display text-xl lg:text-2xl">{s}</span>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-accent">●</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <Certifications />

      {/* Trust pillars */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 py-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{t("about_pillars_tag")}</div>
            <h2 className="mt-4 font-display text-4xl lg:text-5xl leading-[1.05]">{t("about_pillars_title_1")}<br /><span className="serif-italic">{t("about_pillars_title_2")}</span>.</h2>
          </div>
          <div className="lg:col-span-9 grid gap-px bg-border md:grid-cols-3">
            {trustPillars.map((pillar) => (
              <div key={pillar.title} className="bg-background p-8 lg:p-10">
                <div className="flex items-center justify-between">
                  <span className="font-display text-3xl serif-italic text-accent">{pillar.num}</span>
                  <pillar.icon className="h-5 w-5 text-foreground/50" strokeWidth={1.5} />
                </div>
                <h3 className="mt-8 font-display text-2xl leading-tight">{pillar.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
