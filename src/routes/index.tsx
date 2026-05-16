import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Plus, Shield, Microscope, Activity, Clock, Zap, Home, UserCheck } from "lucide-react";
import heroImage from "@/assets/hero-lab-new.png";
import { TESTIMONIALS } from "@/lib/seed-data";
import { CONTACT_PHONE } from "@/lib/contact";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n.tsx";
import card24h from "@/assets/card-24h.png";
import cardReports from "@/assets/card-reports.png";
import cardCollection from "@/assets/card-collection.png";
import cardPathologist from "@/assets/card-pathologist.png";
import { FeaturedPackages } from "@/components/FeaturedPackages";
import { Certifications } from "@/components/Certifications";
import logo from "@/assets/logo.png";
import badge24h from "@/assets/24h-service-badge.png";
import imgBiochemistry from "@/assets/biochemistry.png";
import imgImmunology from "@/assets/immunology.png";
import imgCardiology from "@/assets/cardiology.png";
import imgEndocrinology from "@/assets/endocrinology.png";
import imgNephrology from "@/assets/nephrology.png";
import imgMicrobiology from "@/assets/microbiology.png";
import imgMolecularBiology from "@/assets/molecular_biology.png";
import imgAbroadPackages from "@/assets/abroad_packages.png";
import imgPreEmployment from "@/assets/pre_employment.png";
import imgPathology from "@/assets/pathology.png";
import imgHistopathology from "@/assets/histopathology.png";
import imgEEG from "@/assets/eeg.png";
import imgECG from "@/assets/ecg.png";
import { cn } from "@/lib/utils";

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

const tickerItems = ["Open 24 Hours", "Same-Day Reports", "Doorstep Collection", "NABL-Standard Process", "Pathologist Reviewed", "Precision Diagnostics"];

const services = [
  { num: "01", name: "Bio Chemistry", desc: "Comprehensive liver, kidney, and blood sugar metabolic testing.", img: imgBiochemistry },
  { num: "02", name: "Immunology", desc: "Advanced autoimmune, allergy, and serological diagnostics.", img: imgImmunology },
  { num: "03", name: "Cardiology", desc: "Complete cardiac risk profiles and cardiovascular health markers.", img: imgCardiology },
  { num: "04", name: "Endocrinology", desc: "Precise thyroid, reproductive, and stress hormone panels.", img: imgEndocrinology },
  { num: "05", name: "Nephrology", desc: "Detailed renal function, electrolytes, and urine analysis.", img: imgNephrology },
  { num: "06", name: "Microbiology", desc: "Accurate bacterial, viral, and fungal culture testing.", img: imgMicrobiology },
  { num: "07", name: "Molecular Biology", desc: "State-of-the-art PCR, DNA, and RNA based diagnostics.", img: imgMolecularBiology },
  { num: "08", name: "Abroad Packages", desc: "Standardized health checkups for visa and immigration requirements.", img: imgAbroadPackages },
  { num: "09", name: "Pre Employment", desc: "Thorough occupational health and fitness assessments.", img: imgPreEmployment },
  { num: "10", name: "Pathology", desc: "Expert clinical and anatomical pathology diagnostic services.", img: imgPathology },
  { num: "11", name: "Histopathology", desc: "Microscopic examination of tissue biopsies by specialists.", img: imgHistopathology },
  { num: "12", name: "EEG", desc: "Electroencephalogram for comprehensive neurological assessment.", img: imgEEG },
  { num: "13", name: "ECG", desc: "Electrocardiogram for real-time heart rhythm monitoring.", img: imgECG },
];

const stats = [
  { v: "10K+", l: "Reports delivered" },
  { v: "11", l: "Years in practice" },
  { v: "24/7", l: "Always open" },
  { v: "98%", l: "Reports on time" },
];

const serviceCards = [
  { img: card24h, titleKey: "card_24h_title", descKey: "card_24h_desc", icon: Clock, color: "oklch(0.65 0.12 210)" },
  { img: cardReports, titleKey: "card_reports_title", descKey: "card_reports_desc", icon: Zap, color: "oklch(0.78 0.12 55)" },
  { img: cardCollection, titleKey: "card_collection_title", descKey: "card_collection_desc", icon: Home, color: "oklch(0.55 0.15 155)" },
  { img: cardPathologist, titleKey: "card_pathologist_title", descKey: "card_pathologist_desc", icon: UserCheck, color: "oklch(0.45 0.12 195)" },
];

function HomePage() {
  const { t, language } = useLanguage();

  const tickerItems = [
    language === "ta" ? "24 மணிநேர சேவை" : "24 Hours Open",
    language === "ta" ? "ஒரே நாளில் அறிக்கை" : "Same-Day Reports",
    language === "ta" ? "வீட்டிற்கே வந்து சேகரிப்பு" : "Doorstep Collection",
    language === "ta" ? "நிபுணர்களின் பரிசோதனை" : "Pathologist Reviewed",
  ];

  const statsList = [
    { v: "10K+", l: t("stat_reports") },
    { v: "Gold", l: t("stat_years") },
    { v: "24/7", l: t("stat_open") },
    { v: "98%", l: t("stat_ontime") },
  ];

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
              <div className="flex items-center gap-4 sm:gap-8 mb-10">
                <img src={logo} alt="Shashti Logo" className="h-14 sm:h-24 w-auto object-contain shrink-0" />
                <div className="border-l border-border pl-4 sm:pl-8 py-1">
                  <img
                    src={badge24h}
                    alt="24 Hour Service"
                    className="h-12 sm:h-20 w-auto object-contain animate-pulse-slow drop-shadow-sm mix-blend-multiply"
                  />
                </div>
              </div>
              <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                {t("hero_tag")}
              </div>
              <h1 className="mt-6 font-display text-[40px] sm:text-6xl lg:text-[5.5rem] leading-[0.95] tracking-[-0.03em] text-foreground text-balance">
                {t("hero_title_1")}<br />
                <span className="serif-italic font-light">{t("hero_title_2")}</span><br />
                <span className="relative inline-block">
                  {t("hero_title_3")}
                  <svg className="absolute -bottom-2 left-0 w-full" height="14" viewBox="0 0 300 14" fill="none">
                    <path d="M2 8 Q 75 2, 150 7 T 298 6" stroke="oklch(0.78 0.12 55)" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span><span className="text-accent">.</span>
              </h1>
              <div className="mt-4 font-sans text-sm font-medium text-foreground tracking-wide">
                {t("hero_subtitle")}
              </div>
              <p className="mt-8 max-w-lg text-[15px] sm:text-base text-muted-foreground leading-relaxed">
                {t("hero_desc")}
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link to="/services" className="group inline-flex items-center gap-3 rounded-full bg-foreground px-7 py-4 text-xs font-mono uppercase tracking-wider text-background hover:bg-accent hover:text-accent-foreground transition-all duration-300 shadow-soft hover:shadow-glow cursor-pointer">
                  {t("cta_explore")} <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
                </Link>
                <Link to="/reports" className="group inline-flex items-center gap-3 rounded-full border-2 border-primary/20 bg-primary/5 px-7 py-4 text-xs font-mono uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 cursor-pointer">
                  <Activity className="h-4 w-4" />
                  {t("cta_download_report")}
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-foreground/25 px-7 py-4 text-xs font-mono uppercase tracking-wider text-foreground hover:border-foreground transition-colors cursor-pointer">
                  {t("cta_book_home")}
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
                  alt="Modern Laboratory Diagnostics"
                  width={1080}
                  height={1600}
                  className="w-full h-[520px] sm:h-[640px] object-cover rounded-sm"
                />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-background/85 backdrop-blur-sm border hairline px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em]">
                  <span>Plate N° 001</span>
                  <span className="text-accent">●</span>
                  <span>Advanced Diagnostics</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Ticker */}
        <div className="border-y hairline bg-foreground text-background overflow-hidden">
          <div className="flex animate-ticker whitespace-nowrap py-3.5">
            {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((t_item, i) => (
              <span key={i} className="flex items-center gap-6 px-6 font-mono text-[11px] uppercase tracking-[0.25em]">
                {t_item} <Plus className="h-3 w-3 text-accent" strokeWidth={1.5} />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PACKAGES ────────────────────────── */}
      <FeaturedPackages />

      {/* ── ETHOS / STATS ──────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 py-24 lg:py-32">
        <div className="grid gap-12 lg:gap-20 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{t("ethos_tag")}</div>
            <h2 className={cn(
              "mt-5 font-display leading-[1.05] tracking-tight",
              language === "ta" ? "text-3xl lg:text-4xl" : "text-4xl lg:text-5xl"
            )}>
              {t("ethos_title_1")}<br /><span className="serif-italic">{t("ethos_title_2")}</span><br />{t("ethos_title_3")}
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <p className={cn(
              "font-display leading-snug text-foreground/85 max-w-2xl",
              language === "ta" ? "text-xl lg:text-2xl" : "text-2xl lg:text-3xl"
            )}>
              {t("ethos_desc")}
            </p>
            <div className="mt-12 grid grid-cols-2 gap-px bg-border md:grid-cols-4">
              {statsList.map((s) => (
                <div key={s.l} className="bg-background p-6">
                  <div className={cn(
                    "font-display text-4xl lg:text-5xl tracking-tight",
                    s.v === "24/7" && "text-red-500 font-bold"
                  )}>{s.v}</div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SERVICE TICKER CARDS ──────────────────────── */}
      <section className="bg-muted/20 py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Core Strengths</div>
            <h2 className="font-display text-4xl lg:text-5xl leading-tight">Elevating the standard of <span className="serif-italic">diagnostic care</span>.</h2>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {serviceCards.map((card, i) => (
              <motion.div
                key={card.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15, ease: [0.21, 1, 0.36, 1] }}
                whileHover={{ y: -12 }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-background shadow-soft transition-all duration-500 hover:shadow-elevated"
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src={card.img}
                    alt={t(card.titleKey)}
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:brightness-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute bottom-4 left-4 transform translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                </div>

                <div className="flex-1 p-6 relative">
                  {/* Decorative index */}
                  <div className="absolute top-6 right-6 font-mono text-[10px] text-muted-foreground/30">0{i + 1}</div>

                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted/30 mb-4 transition-colors duration-500 group-hover:bg-accent/10">
                    <card.icon className="h-5 w-5 text-muted-foreground transition-colors duration-500 group-hover:text-accent" />
                  </div>

                  <h3 className="font-display text-2xl tracking-tight text-foreground mb-3 group-hover:text-accent transition-colors duration-500">
                    {t(card.titleKey)}
                  </h3>
                  <p className="text-[14px] text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-500">
                    {t(card.descKey)}
                  </p>

                  <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60">Verified Standard</span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 transition-all duration-500 group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                </div>

                {/* Accent glow on hover */}
                <div
                  className="absolute bottom-0 left-0 h-1 w-0 bg-accent transition-all duration-700 group-hover:w-full"
                  style={{ backgroundColor: card.color }}
                />
              </motion.div>
            ))}
          </div>
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
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-background/55">{t("index_tag")}</div>
              <h2 className="mt-5 font-display text-4xl lg:text-6xl leading-[1] tracking-tight">
                {t("index_title_1")}<br /><span className="serif-italic text-accent">{t("index_title_2")}</span>.
              </h2>
              <div className="mt-2 font-sans text-xs font-medium text-background/80 tracking-wide uppercase">
                {t("index_subtitle")}
              </div>
            </div>
            <Link to="/services" className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-background/80 hover:text-accent cursor-pointer">
              {t("index_view_all")} <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:rotate-45" />
            </Link>
          </motion.div>

          <div className="mt-16 border-t border-background/15">
            {services.map((s) => (
              <Link
                key={s.num}
                to="/services"
                className="group grid grid-cols-12 items-center gap-6 border-b border-background/15 py-8 transition-all duration-500 hover:bg-background/5 cursor-pointer"
              >
                <div className="col-span-1 font-mono text-xs text-background/45 transition-colors group-hover:text-accent">{s.num}</div>
                
                <div className="col-span-11 lg:col-span-11 grid grid-cols-12 items-center gap-6">
                  {/* Service Image - Always Visible */}
                  <div className="col-span-3 sm:col-span-2 lg:col-span-1 aspect-square overflow-hidden rounded-xl border border-background/10">
                    <img 
                      src={s.img} 
                      alt={s.name} 
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    />
                  </div>

                  <div className="col-span-9 sm:col-span-5 lg:col-span-4 font-display text-2xl lg:text-3xl tracking-tight transition-transform duration-500 group-hover:translate-x-2">
                    {s.name}
                  </div>

                  <div className="col-span-12 sm:col-span-4 lg:col-span-6 text-sm text-background/65 leading-relaxed lg:pr-12">{s.desc}</div>
                  
                  <div className="col-span-12 sm:col-span-1 lg:col-span-1 flex justify-end">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-background/20 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-500">
                      <ArrowUpRight className="h-5 w-5 transition-transform group-hover:rotate-45" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACCREDITATIONS ─────────────────────────────── */}
      <Certifications />

      {/* ── TESTIMONIALS ───────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{t("voices_tag")}</div>
            <h2 className="mt-5 font-display text-4xl lg:text-5xl leading-[1.05]">
              {t("voices_title_1")}<br /><span className="serif-italic">{t("voices_title_2")}</span><br />{t("voices_title_3")}
            </h2>
          </div>
          <div className="lg:col-span-9 grid gap-px bg-border sm:grid-cols-2">
            {TESTIMONIALS.map((testimonial, i) => (
              <figure key={testimonial.name} className="bg-background p-8 lg:p-10">
                <div className="font-display text-5xl leading-none text-accent">&ldquo;</div>
                <blockquote className="mt-2 font-display text-xl lg:text-2xl leading-snug text-foreground/90">
                  {testimonial.text}
                </blockquote>
                <figcaption className="mt-8 flex items-center justify-between border-t hairline pt-5">
                  <div>
                    <div className="font-mono text-xs uppercase tracking-wider">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{testimonial.role}</div>
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
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{t("invite_tag")}</div>
              <h2 className="mt-5 font-display text-4xl sm:text-5xl lg:text-7xl leading-[0.98] tracking-tight">
                {t("invite_title_1")}<br /><span className="serif-italic">{t("invite_title_2")}</span><br />{t("invite_title_3")}<span className="text-accent">.</span>
              </h2>
              <div className="mt-4 font-sans text-sm font-medium text-accent-foreground tracking-wide italic">
                {t("invite_subtitle")}
              </div>
            </div>
            <div className="lg:text-right">
              <p className="text-muted-foreground max-w-md lg:ml-auto">
                {t("invite_desc")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3 lg:justify-end">
                <Link to="/contact" className="group inline-flex items-center gap-3 rounded-full bg-foreground px-7 py-3.5 text-xs font-mono uppercase tracking-wider text-background hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                  {t("cta_schedule")} <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
                </Link>
                <a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 rounded-full border border-foreground/25 px-7 py-3.5 text-xs font-mono uppercase tracking-wider hover:border-foreground transition-colors cursor-pointer">
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
