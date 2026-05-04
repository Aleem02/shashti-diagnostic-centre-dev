import { createFileRoute } from "@tanstack/react-router";
import { MapPin, ShieldCheck, Clock, Users } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Shashti Diagnostic Center, Chidambaram" },
      { name: "description", content: "The principles, people and practice behind Shashti — a precision diagnostic center in Chidambaram since 2014." },
      { property: "og:title", content: "About — Shashti Diagnostic" },
      { property: "og:description", content: "Diagnostics held to a higher standard. Our story, our principles." },
    ],
  }),
  component: AboutPage,
});

const services = ["Allergy Panels", "Hematology", "Cardiology · ECG", "Neurology · EEG", "Endocrinology", "Lipid Profile", "Diabetes Screening", "Liver & Kidney", "Vitamin Profiles", "Wellness Suites"];

const trust = [
  { num: "I", icon: ShieldCheck, title: "No hidden charges", desc: "Transparent pricing — what you see is what you pay. Always." },
  { num: "II", icon: Clock, title: "Reports on time", desc: "Same-day or next-day delivery, every single instance." },
  { num: "III", icon: Users, title: "Certified pathology", desc: "Trained technicians and pathologist-reviewed reports." },
];

function AboutPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-warm">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-6 pb-16 lg:pt-10 lg:pb-20">
          <h1 className="font-display text-4xl sm:text-6xl lg:text-[5.5rem] leading-[0.95] tracking-[-0.035em] max-w-5xl">
            A diagnostic<br /><span className="serif-italic">partner you can</span><br />trust<span className="text-accent">.</span>
          </h1>
          <div className="mt-10 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            Laya Complex · S.P Kovil Street · Chidambaram
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 py-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">A · Manifesto</div>
          </div>
          <div className="lg:col-span-9">
            <p className="font-display text-3xl lg:text-5xl leading-[1.15] text-foreground/90 max-w-4xl tracking-tight">
              Shashti is a modern, full-service medical laboratory in Chidambaram. We pair <span className="serif-italic text-accent">advanced equipment</span> with <span className="serif-italic">skilled hands</span> and <span className="serif-italic">patient-first care</span> to deliver diagnostics worth your trust — anytime, day or night.
            </p>
          </div>
        </div>
      </section>

      {/* Services list */}
      <section className="border-y hairline bg-secondary/40 py-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">B · Offerings</div>
            <h2 className="mt-4 font-display text-4xl lg:text-5xl leading-[1.05]">What we<br /><span className="serif-italic">practice</span>.</h2>
            <p className="mt-5 text-muted-foreground max-w-sm">A comprehensive menu of diagnostics under one roof — supporting physicians and families across the region.</p>
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

      {/* Trust pillars */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 py-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">C · Pillars</div>
            <h2 className="mt-4 font-display text-4xl lg:text-5xl leading-[1.05]">Why patients<br /><span className="serif-italic">return</span>.</h2>
          </div>
          <div className="lg:col-span-9 grid gap-px bg-border md:grid-cols-3">
            {trust.map((t) => (
              <div key={t.title} className="bg-background p-8 lg:p-10">
                <div className="flex items-center justify-between">
                  <span className="font-display text-3xl serif-italic text-accent">{t.num}</span>
                  <t.icon className="h-5 w-5 text-foreground/50" strokeWidth={1.5} />
                </div>
                <h3 className="mt-8 font-display text-2xl leading-tight">{t.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
