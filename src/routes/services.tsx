import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { fetchTests } from "@/lib/tests-service";
import { TEST_CATEGORIES, type MedicalTest } from "@/lib/seed-data";
import { Search, Loader2, FileText, ArrowUpRight, Home, Building2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { getWhatsAppLink } from "@/lib/contact";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n.tsx";
import { Breadcrumbs } from "@/components/SEO";

import { z } from "zod";

const testSearchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
});

export const Route = createFileRoute("/services")({
  validateSearch: (search) => testSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Services & Catalogue — Shashti Diagnostic Center" },
      { name: "description", content: "Browse our complete diagnostic catalogue: hematology, endocrinology, cardiology, neurology, allergy and wellness panels with sample reports." },
      { property: "og:title", content: "Catalogue — Shashti Diagnostic" },
      { property: "og:description", content: "A precise menu of diagnostics, with home collection across Chidambaram." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { t, language } = useLanguage();
  const { q = "", category: urlCategory = "All" } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [tests, setTests] = useState<MedicalTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [homeOnly, setHomeOnly] = useState(false);

  const setQuery = (newQuery: string) => {
    navigate({ search: (prev) => ({ ...prev, q: newQuery || undefined }) });
  };

  const setCategory = (newCat: string) => {
    navigate({ 
      search: (prev) => ({ 
        ...prev, 
        category: newCat === "All" ? undefined : newCat,
        q: newCat === "All" ? undefined : prev.q 
      }) 
    });
  };

  useEffect(() => {
    fetchTests().then((t) => { setTests(t); setLoading(false); });
  }, []);

  const filtered = useMemo(() => {
    return tests.filter((t) => {
      if (urlCategory !== "All" && t.category !== urlCategory) return false;
      if (homeOnly && t.availability === "Lab") return false;
      if (q && !t.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [tests, urlCategory, homeOnly, q]);

  return (
    <div className="relative">
      {/* Header */}
      <section className="bg-gradient-warm">

        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-6 pb-16 lg:pt-10 lg:pb-24">
          <Breadcrumbs />
          <h1 className="font-display text-4xl sm:text-6xl lg:text-[5.5rem] leading-[0.95] tracking-[-0.035em]">
            {language === "en" ? "The" : ""}<br /><span className="serif-italic">{t("services_tag")}</span><span className="text-accent">.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-base text-muted-foreground leading-relaxed">
            {t("services_desc")}
          </p>
          <div className="mt-4 font-sans text-sm font-medium text-foreground tracking-wide uppercase">
            {t("services_subtitle")}
          </div>
          <div className="mt-8 flex flex-wrap gap-6 border-t hairline pt-8">
            <div className="flex items-center gap-2.5">
              <div className="h-2 w-2 rounded-full bg-moss" />
              <span className="font-sans text-xs font-semibold uppercase tracking-wide text-foreground/70">{t("services_home_avail")}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="font-sans text-xs font-semibold uppercase tracking-wide text-foreground/70">{t("services_lab_only")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <section className="sticky top-16 z-30 border-y hairline bg-background/90 backdrop-blur-xl">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("services_search_placeholder")}
                className="w-full rounded-full border hairline bg-background pl-10 pr-4 py-2.5 text-sm font-display italic placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
              />
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {TEST_CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-[12px] font-sans font-medium uppercase tracking-wider border transition-colors",
                    urlCategory === c ? "bg-foreground text-background border-foreground" : "border-foreground/15 text-foreground/70 hover:border-foreground/50"
                  )}
                >
                  {c}
                </button>
              ))}
              <label className="ml-2 inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-foreground/70 cursor-pointer select-none">
                <input type="checkbox" checked={homeOnly} onChange={(e) => setHomeOnly(e.target.checked)} className="h-3.5 w-3.5 accent-foreground" />
                {t("services_home_only")}
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial list */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 py-12 lg:py-16">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="border hairline py-20 text-center font-display italic text-2xl text-muted-foreground">
            {t("services_no_match")}
          </div>
        ) : (
          <div className="border-t hairline overflow-hidden">
            <AnimatePresence mode="popLayout">
              {filtered.map((testItem, i) => (
                <motion.article 
                  key={testItem.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
                  className="group grid grid-cols-12 items-start gap-4 border-b hairline py-8 transition-colors hover:bg-secondary/40"
                >
                <div className="col-span-2 sm:col-span-1 font-mono text-xs text-muted-foreground pt-1">
                  {(i + 1).toString().padStart(2, "0")}
                </div>
                <div className="col-span-10 sm:col-span-5 lg:col-span-4">
                  <div className="font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-accent">{testItem.category}</div>
                  <h3 className="mt-2 font-display text-2xl lg:text-3xl leading-tight tracking-tight">
                    {testItem.name}
                  </h3>
                </div>
                <div className="col-span-12 sm:col-span-6 lg:col-span-4 text-[15px] text-foreground/80 leading-relaxed sm:pt-1">
                  {testItem.description}
                </div>
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-3 lg:items-end lg:text-right">
                  {/* Availability Row */}
                  <div className="flex flex-wrap gap-1.5 lg:justify-end">
                    {testItem.availability === "Home" || testItem.availability === "Both" ? (
                      <span className="inline-flex items-center gap-1.5 font-sans text-[10px] font-bold uppercase tracking-wider border border-moss/20 bg-moss/5 px-2.5 py-1.5 text-moss">
                        <Home className="h-3 w-3" /> {t("service_home")}
                      </span>
                    ) : null}
                    {testItem.availability === "Lab" || testItem.availability === "Both" ? (
                      <span className="inline-flex items-center gap-1.5 font-sans text-[10px] font-bold uppercase tracking-wider border border-primary/20 bg-primary/5 px-2.5 py-1.5 text-primary">
                        <Building2 className="h-3 w-3" /> {t("services_lab_only")}
                      </span>
                    ) : null}
                  </div>

                  {/* Info & Action Row */}
                  <div className="flex flex-wrap items-stretch gap-1 lg:justify-end">
                    <div className="flex items-center gap-2 border border-foreground/15 bg-secondary/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-foreground/80">
                      <Clock className="h-3 w-3" />
                      <span className="font-bold">{testItem.duration}</span>
                    </div>

                    {testItem.price && !testItem.hidePrice && (
                      <div className="flex items-center border border-foreground/15 bg-secondary/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-foreground/80">
                        {testItem.discountPrice ? (
                          <div className="flex items-center gap-2">
                            <span className="line-through opacity-40">₹{testItem.price}</span>
                            <span className="font-bold text-accent">₹{testItem.discountPrice}</span>
                          </div>
                        ) : (
                          <span className="font-bold">₹{testItem.price}</span>
                        )}
                      </div>
                    )}

                    <a 
                      href={getWhatsAppLink(`Hello Shashti Diagnostic Center, I would like to book the ${testItem.name} test.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-foreground px-4 py-1.5 font-sans text-[10px] font-bold uppercase tracking-widest text-background hover:bg-accent transition-colors cursor-pointer"
                    >
                      {t("services_book_now")} <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>
                </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
}
