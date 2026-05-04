import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Plus } from "lucide-react";
import heroImage from "@/assets/hero-editorial.jpg";
import { TESTIMONIALS } from "@/lib/seed-data";
import { CONTACT_PHONE } from "@/lib/contact";
import { motion } from "framer-motion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shashti Diagnostic Center — Precision Diagnostics in Chidambaram" },
      { name: "description", content: "An editorial-grade diagnostic atelier in Chidambaram. 24/7 lab and home sample collection, same-day reports, certified pathology." },
      { property: "og:title", content: "Shashti Diagnostic Center" },
      { property: "og:description", content: "Precision diagnostics. Quiet luxury in healthcare. Open 24/7." },
    ],
  }),
  component: HomePage,
});

const tickerItems = ["Open 24 Hours", "Same-Day Reports", "Doorstep Collection", "NABL-Standard Process", "Pathologist Reviewed", "Since 2014"];

const services = [
  { num: "01", name: "Hematology", italic: "Blood", desc: "CBC, ESR, peripheral smear & coagulation panels." },
  { num: "02", name: "Endocrinology", italic: "Hormones", desc: "Thyroid (T3/T4/TSH), insulin, cortisol & reproductive panels." },
  { num: "03", name: "Cardiology", italic: "Heart", desc: "12-lead ECG, lipid profile and cardiac risk markers." },
  { num: "04", name: "Neurology", italic: "Brain", desc: "EEG and neurological screening with specialist review." },
  { num: "05", name: "Immunology", italic: "Allergy", desc: "Comprehensive food, dust and environmental allergen panels." },
  { num: "06", name: "Wellness", italic: "Holistic", desc: "Curated annual checkups for individuals and families." },
];

const stats = [
  { v: "10K+", l: "Reports delivered" },
  { v: "11", l: "Years in practice" },
  { v: "24/7", l: "Always open" },
  { v: "98%", l: "Reports on time" },
];

function HomePage() {
  return (
    <div className="relative">
      {/* ── HERO ───────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-warm">

        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-6 pb-20 lg:pt-10 lg:pb-32">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 lg:items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
              className="lg:col-span-7 flex flex-col justify-center"
            >
              <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                A Diagnostic Gallery · Est. 2014
              </div>
                <h1 className="mt-6 font-display text-[40px] sm:text-6xl lg:text-[5.5rem] leading-[0.95] tracking-[-0.03em] text-foreground text-balance">
                  Precision,<br />
                  <span className="serif-italic font-light">delivered with</span><br />
                  <span className="relative inline-block">
                    quiet care
                    <svg className="absolute -bottom-2 left-0 w-full" height="14" viewBox="0 0 300 14" fill="none">
                      <path d="M2 8 Q 75 2, 150 7 T 298 6" stroke="oklch(0.78 0.12 55)" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </span><span className="text-accent">.</span>
                </h1>
                <div className="mt-4 font-sans text-sm font-medium text-foreground tracking-wide">
                  துல்லியமான பரிசோதனை, கனிவான கவனிப்பு.
                </div>
              <p className="mt-8 max-w-lg text-[15px] sm:text-base text-muted-foreground leading-relaxed">
                Shashti is a modern diagnostic center where laboratory rigour meets the calm of a private clinic. Reports you can trust — at the lab, at your door, or at 3 a.m.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link to="/services" className="group inline-flex items-center gap-3 rounded-full bg-foreground px-7 py-3.5 text-xs font-mono uppercase tracking-wider text-background hover:bg-accent hover:text-accent-foreground transition-colors">
                  Explore Services <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-foreground/25 px-7 py-3.5 text-xs font-mono uppercase tracking-wider text-foreground hover:border-foreground transition-colors">
                  Book Home Collection
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: 0.2 }}
              className="lg:col-span-5 relative mt-12 lg:mt-0"
            >
              <div className="relative">
                <div className="absolute -top-3 -left-3 h-3 w-3 border-l border-t border-foreground/30" />
                <div className="absolute -top-3 -right-3 h-3 w-3 border-r border-t border-foreground/30" />
                <div className="absolute -bottom-3 -left-3 h-3 w-3 border-l border-b border-foreground/30" />
                <div className="absolute -bottom-3 -right-3 h-3 w-3 border-r border-b border-foreground/30" />
                <img
                  src={heroImage}
                  alt="Editorial still life of a vintage microscope on warm linen"
                  width={1080}
                  height={1600}
                  className="w-full h-[520px] sm:h-[640px] object-cover grayscale-0"
                />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-background/85 backdrop-blur-sm border hairline px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em]">
                  <span>Plate N° 001</span>
                  <span className="text-accent">●</span>
                  <span>Hematology Suite</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Ticker */}
        <div className="border-y hairline bg-foreground text-background overflow-hidden">
          <div className="flex animate-ticker whitespace-nowrap py-3.5">
            {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((t, i) => (
              <span key={i} className="flex items-center gap-6 px-6 font-mono text-[11px] uppercase tracking-[0.25em]">
                {t} <Plus className="h-3 w-3 text-accent" strokeWidth={1.5} />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── ETHOS / STATS ──────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-4"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">§ 02 · About</div>
            <h2 className="mt-5 font-display text-4xl lg:text-5xl leading-[1.05] tracking-tight">
              Diagnostics held<br /><span className="serif-italic">to a higher</span><br />standard.
            </h2>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-8"
          >
            <p className="font-display text-2xl lg:text-3xl leading-snug text-foreground/85 max-w-2xl">
              We believe a medical report should be <span className="serif-italic text-accent">unambiguous</span>, the experience <span className="serif-italic">unhurried</span>, and the science <span className="serif-italic">unimpeachable</span>. Every sample is processed by trained technicians and reviewed by certified pathologists.
            </p>
            <div className="mt-12 grid grid-cols-2 gap-px bg-border md:grid-cols-4">
              {stats.map((s) => (
                <div key={s.l} className="bg-background p-6">
                  <div className="font-display text-4xl lg:text-5xl tracking-tight">{s.v}</div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SERVICES INDEX ─────────────────────────────── */}
      <section className="bg-foreground text-background py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-background/55">§ 03 · The Index</div>
              <h2 className="mt-5 font-display text-4xl lg:text-6xl leading-[1] tracking-tight">
                A complete<br /><span className="serif-italic text-accent">menu of care</span>.
              </h2>
              <div className="mt-2 font-sans text-xs font-medium text-background/80 tracking-wide uppercase">
                அனைத்து வகையான மருத்துவ பரிசோதனைகளும் ஒரே இடத்தில்.
              </div>
            </div>
            <Link to="/services" className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-background/80 hover:text-accent">
              View full catalogue <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:rotate-45" />
            </Link>
          </motion.div>

          <div className="mt-16 border-t border-background/15">
            {services.map((s) => (
              <Link
                key={s.num}
                to="/services"
                className="group grid grid-cols-12 items-baseline gap-4 border-b border-background/15 py-7 transition-colors hover:bg-background/5"
              >
                <div className="col-span-2 font-mono text-xs text-background/45">{s.num}</div>
                <div className="col-span-10 sm:col-span-4 font-display text-3xl lg:text-4xl tracking-tight">
                  {s.name}<span className="serif-italic text-background/60 ml-3 hidden lg:inline">{s.italic}</span>
                </div>
                <div className="col-span-12 sm:col-span-5 text-sm text-background/65 leading-relaxed">{s.desc}</div>
                <div className="col-span-12 sm:col-span-1 flex justify-end">
                  <ArrowUpRight className="h-5 w-5 text-background/45 transition-all group-hover:text-accent group-hover:rotate-45" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">§ 04 · Voices</div>
            <h2 className="mt-5 font-display text-4xl lg:text-5xl leading-[1.05]">
              Words<br /><span className="serif-italic">from those</span><br />we&rsquo;ve served.
            </h2>
          </div>
          <div className="lg:col-span-9 grid gap-px bg-border sm:grid-cols-2">
            {TESTIMONIALS.map((t, i) => (
              <figure key={t.name} className="bg-background p-8 lg:p-10">
                <div className="font-display text-5xl leading-none text-accent">&ldquo;</div>
                <blockquote className="mt-2 font-display text-xl lg:text-2xl leading-snug text-foreground/90">
                  {t.text}
                </blockquote>
                <figcaption className="mt-8 flex items-center justify-between border-t hairline pt-5">
                  <div>
                    <div className="font-mono text-xs uppercase tracking-wider">{t.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{t.role}</div>
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground">N° 0{i + 1}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 pb-24">
        <div className="relative overflow-hidden rounded-sm border hairline bg-gradient-warm p-10 sm:p-16 lg:p-24">
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, oklch(0.30 0.055 195) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          <div className="relative grid gap-10 lg:grid-cols-2 lg:items-end">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">§ 05 · An Invitation</div>
              <h2 className="mt-5 font-display text-4xl sm:text-5xl lg:text-7xl leading-[0.98] tracking-tight">
                Let us begin<br /><span className="serif-italic">with a single</span><br />sample<span className="text-accent">.</span>
              </h2>
              <div className="mt-4 font-sans text-sm font-medium text-accent-foreground tracking-wide italic">
                ஒருமுறை எங்களை அணுகுங்கள், எங்கள் சேவையை நீங்களே உணர்வீர்கள்.
              </div>
            </div>
            <div className="lg:text-right">
              <p className="text-muted-foreground max-w-md lg:ml-auto">
                Walk in, call, or schedule a doorstep collection. Our pathology suite is open 24 hours, every day of the year.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 lg:justify-end">
                <Link to="/contact" className="group inline-flex items-center gap-3 rounded-full bg-foreground px-7 py-3.5 text-xs font-mono uppercase tracking-wider text-background hover:bg-accent hover:text-accent-foreground transition-colors">
                  Schedule a visit <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
                </Link>
                <a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 rounded-full border border-foreground/25 px-7 py-3.5 text-xs font-mono uppercase tracking-wider hover:border-foreground transition-colors">
                  {CONTACT_PHONE}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
