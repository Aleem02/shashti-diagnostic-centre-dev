import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { fetchTests } from "@/lib/tests-service";
import { TEST_CATEGORIES, type MedicalTest } from "@/lib/seed-data";
import { Search, Loader2, FileText, ArrowUpRight, Home, Building2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { getWhatsAppLink } from "@/lib/contact";
import { motion, AnimatePresence } from "framer-motion";

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
          <h1 className="font-display text-4xl sm:text-6xl lg:text-[5.5rem] leading-[0.95] tracking-[-0.035em]">
            The<br /><span className="serif-italic">Catalogue</span><span className="text-accent">.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-base text-muted-foreground leading-relaxed">
            A curated index of every diagnostic procedure offered at Shashti — with transparent timelines and availability for your reference.
          </p>
          <div className="mt-4 font-sans text-sm font-medium text-foreground tracking-wide uppercase">
            பரிசோதனைகளின் பட்டியல் மற்றும் விவரங்கள்.
          </div>
          <div className="mt-8 flex flex-wrap gap-6 border-t hairline pt-8">
            <div className="flex items-center gap-2.5">
              <div className="h-2 w-2 rounded-full bg-moss" />
              <span className="font-sans text-xs font-semibold uppercase tracking-wide text-foreground/70">Home Collection Available</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="font-sans text-xs font-semibold uppercase tracking-wide text-foreground/70">In-Lab Only</span>
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
                placeholder="Search the catalogue…"
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
                Home only
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
            No entries match your inquiry.
          </div>
        ) : (
          <div className="border-t hairline overflow-hidden">
            <AnimatePresence mode="popLayout">
              {filtered.map((t, i) => (
                <motion.article 
                  key={t.id} 
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
                  <div className="font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-accent">{t.category}</div>
                  <h3 className="mt-2 font-display text-2xl lg:text-3xl leading-tight tracking-tight">
                    {t.name}
                  </h3>
                </div>
                <div className="col-span-12 sm:col-span-6 lg:col-span-4 text-[15px] text-foreground/80 leading-relaxed sm:pt-1">
                  {t.description}
                </div>
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-2 lg:items-end lg:text-right">
                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    {t.availability === "Home" || t.availability === "Both" ? (
                      <span className="inline-flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-wider border border-moss/30 bg-moss/5 px-2.5 py-1 text-moss">
                        <Home className="h-3 w-3" /> Home Collection
                      </span>
                    ) : null}
                    {t.availability === "Lab" || t.availability === "Both" ? (
                      <span className="inline-flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-wider border border-primary/30 bg-primary/5 px-2.5 py-1 text-primary">
                        <Building2 className="h-3 w-3" /> In-Lab Only
                      </span>
                    ) : null}
                    {t.price && (
                      <span className="inline-flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-wider border border-accent/30 bg-accent/5 px-2.5 py-1 text-accent">
                        {t.discountPrice ? (
                          <>
                            <span className="line-through opacity-50 mr-1.5">₹{t.price}</span>
                            <span className="font-bold">₹{t.discountPrice}</span>
                          </>
                        ) : (
                          `₹${t.price}`
                        )}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-wider rounded-none px-2.5 py-1 bg-foreground text-background">
                      <Clock className="h-3 w-3" /> Report: {t.duration}
                    </span>
                    <a 
                      href={getWhatsAppLink(`Hello Shashti Diagnostic Center, I would like to book the ${t.name} test.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-sans text-[11px] font-bold uppercase tracking-wider rounded-none px-3 py-1 bg-accent text-accent-foreground hover:bg-foreground hover:text-background transition-colors"
                    >
                      Book Now
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
