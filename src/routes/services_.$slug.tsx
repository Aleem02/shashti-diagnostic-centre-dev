import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchServiceBySlug, fetchTests } from "@/lib/tests-service";
import { Clock, Home, Building2, ShieldCheck, ArrowLeft, Calendar, Share2, Info, Activity, Package, CheckCircle2, FlaskConical } from "lucide-react";
import { getWhatsAppLink } from "@/lib/contact";
import { Breadcrumbs } from "@/components/SEO";
import { ServiceCard } from "@/components/services/ServiceCard";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n.tsx";

import { JsonLd } from "@/components/SEO";

export const Route = createFileRoute("/services_/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.charAt(0).toUpperCase() + params.slug.slice(1).replace(/-/g, ' ')} — Shashti Diagnostic` },
      { name: "description", content: `Book ${params.slug.replace(/-/g, ' ')} in Chidambaram. 24/7 diagnostic services, home collection available, and accurate NABL standard reports.` },
      { property: "og:title", content: `${params.slug.replace(/-/g, ' ')} | Shashti Diagnostic Center` },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ServiceDetailPage,
});

function ServiceDetailPage() {
  const { t } = useLanguage();
  const { slug } = Route.useParams();
  
  const { data: item, isLoading, error } = useQuery({
    queryKey: ["service", slug],
    queryFn: () => fetchServiceBySlug(slug),
  });

  const { data: allTests = [] } = useQuery({
    queryKey: ["tests"],
    queryFn: fetchTests,
    enabled: !!item,
  });

  const relatedServices = allTests
    .filter(t => t.slug !== slug && t.category === (item as any)?.category)
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-display text-4xl font-bold">Service not found</h1>
        <p className="mt-4 text-muted-foreground">The diagnostic service you are looking for does not exist or has been moved.</p>
        <button onClick={() => window.history.back()} className="mt-8 flex items-center gap-2 text-primary font-bold">
          <ArrowLeft className="h-4 w-4" /> Go Back
        </button>
      </div>
    );
  }

  const isPackage = "includedTests" in item;

  // Advanced Medical SEO Schema
  const testSchema = {
    "@context": "https://schema.org",
    "@type": isPackage ? "DiagnosticProcedure" : "MedicalTest",
    "name": item.name,
    "description": item.description,
    "provider": {
      "@type": "MedicalBusiness",
      "name": "Shashti Diagnostic Center",
      "url": "https://shashtidiagnostic.in"
    },
    "offers": {
      "@type": "Offer",
      "price": item.discountPrice || item.price,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <JsonLd data={testSchema} />
      {/* Dynamic Header */}
      <div className="relative h-[40vh] lg:h-[50vh] overflow-hidden bg-ink">
        <img 
          src={item.image || "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1600&q=80"} 
          alt={item.name} 
          className="w-full h-full object-cover opacity-30 grayscale brightness-75" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-ink/40 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end px-5 sm:px-8 pb-12">
          <div className="mx-auto max-w-[1400px] w-full">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 font-bold text-sm uppercase tracking-widest transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Catalogue
            </button>
            {isPackage && (
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="px-4 py-1 rounded-full bg-accent text-[10px] font-bold uppercase tracking-widest text-accent-foreground">
                  Multi-Test Bundle
                </span>
              </div>
            )}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-primary-foreground leading-tight tracking-tight max-w-4xl">
              {item.name}
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-primary">
                <Info className="h-5 w-5" />
                <h2 className="font-display text-2xl font-bold">About this Service</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {item.description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="p-5 rounded-2xl border border-border bg-card/50 flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">Turnaround Time</div>
                    <div className="font-display text-xl font-bold">{item.duration}</div>
                  </div>
                </div>
                
                <div className="p-5 rounded-2xl border border-border bg-card/50 flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-moss/10 flex items-center justify-center text-moss shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">Quality Assurance</div>
                    <div className="font-display text-xl font-bold">NABL Standard</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Biomarkers / Included Tests Section */}
            <section className="p-8 rounded-3xl border border-border bg-card shadow-soft">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  {isPackage ? <Package className="h-5 w-5" /> : <Activity className="h-5 w-5" />}
                </div>
                <h2 className="font-display text-2xl font-bold">
                  {isPackage ? "Tests Included in this Package" : "Key Biomarkers Tested"}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {isPackage ? (
                  item.includedTests?.map((test, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-background hover:border-primary/20 transition-colors">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span className="font-medium">{test}</span>
                    </div>
                  ))
                ) : (
                  (item as any).biomarkers?.map((marker: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-background hover:border-primary/20 transition-colors">
                      <Activity className="h-4 w-4 text-accent" />
                      <span className="font-medium">{marker}</span>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Preparation Section */}
            {(item.requirements?.length || 0) > 0 && (
              <section className="space-y-6">
                <h2 className="font-display text-2xl font-bold">Preparation & Requirements</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {item.requirements?.map((req, i) => (
                    <li key={i} className="flex gap-4 p-4 rounded-2xl bg-secondary/20 border border-secondary/10 items-center">
                      {(item.requirements?.length || 0) > 1 && (
                        <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-xs font-bold shrink-0 text-secondary-foreground">
                          {i + 1}
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                        {req}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Sidebar / CTA */}
          <aside className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="p-8 rounded-3xl bg-ink text-ink-foreground shadow-elevated">
              {item.price && !item.hidePrice && (
                <div className="flex flex-col gap-2 mb-6">
                  <div className="flex items-baseline gap-3">
                    <div className="text-3xl font-display font-bold text-white">₹{item.discountPrice || item.price}</div>
                    {item.discountPrice && (
                      <div className="text-lg text-white/40 line-through">₹{item.price}</div>
                    )}
                  </div>
                  {item.discountPrice && (
                    <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-widest">
                      {t("discount_save")} {Math.round(((item.price - item.discountPrice) / item.price) * 100)}%
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between text-sm py-3 border-b border-white/10">
                  <span className="text-white/60">Sample Collection</span>
                  <span className="flex items-center gap-2 font-bold">
                    {item.availability === "Both" ? (
                      <>Home & Lab <Home className="h-4 w-4 text-moss" /></>
                    ) : item.availability === "Home" ? (
                      <>Home Collection <Home className="h-4 w-4 text-moss" /></>
                    ) : (
                      <>Lab Visit <Building2 className="h-4 w-4 text-primary" /></>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm py-3">
                  <span className="text-white/60">Reporting</span>
                  <span className="font-bold">Digital & Printed</span>
                </div>
              </div>

              <a 
                href={getWhatsAppLink(`I'd like to book ${item.name}`)}
                target="_blank"
                rel="noreferrer"
                className="block w-full py-4 rounded-2xl bg-accent text-accent-foreground font-display font-bold text-center hover:scale-[1.02] active:scale-[0.98] transition-all shadow-glow"
              >
                Book This Service
              </a>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/40 uppercase tracking-widest font-bold">
                <ShieldCheck className="h-4 w-4" /> Secure Booking
              </div>
            </div>

            <div className="p-8 rounded-3xl border border-border bg-card">
              <h3 className="font-display text-xl font-bold mb-4">Related Services</h3>
              <div className="space-y-4">
                {relatedServices.map(s => (
                  <Link key={s.id} to={`/services/${s.slug || s.id}` as any} className="flex items-center gap-4 group">
                    <div className="h-12 w-12 rounded-xl bg-secondary overflow-hidden shrink-0">
                      {s.image ? <img src={s.image} className="w-full h-full object-cover" /> : <FlaskConical className="m-auto text-muted-foreground/30 mt-3" />}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="font-bold text-sm truncate group-hover:text-primary transition-colors">{s.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">₹{s.discountPrice || s.price}</div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link to="/services" className="block w-full text-center mt-6 text-sm font-bold text-primary hover:underline">
                View All Services
              </Link>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
