import { useQuery } from "@tanstack/react-query";
import { fetchTestProfiles } from "@/lib/tests-service";
import { ServiceCard } from "./services/ServiceCard";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Package } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n.tsx";

export function FeaturedPackages() {
  const { t } = useLanguage();
  const { data: allProfiles = [], isLoading } = useQuery({
    queryKey: ["test_profiles"],
    queryFn: fetchTestProfiles,
  });

  const featuredPackages = allProfiles
    .filter((s) => s.featured)
    .slice(0, 7); // Fetch 7 to check if we need "View All"

  const displayPackages = featuredPackages.slice(0, 6);
  const hasMore = featuredPackages.length > 6;

  if (isLoading) return null;
  if (displayPackages.length === 0) return null;

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-3">
              <Package className="h-4 w-4" />
              <span>{t("pkg_tag")}</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              {t("pkg_title_1")} <span className="serif-italic text-primary">{t("pkg_title_2")}</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              {t("pkg_desc")}
            </p>
          </div>
          
          <Link 
            to="/services" 
            search={{ category: "Test Profiles" }}
            className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
          >
            {t("pkg_explore")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayPackages.map((pkg, i) => (
            <ServiceCard key={pkg.id} item={pkg} index={i} />
          ))}
        </div>

        {hasMore && (
          <div className="mt-16 text-center">
            <Link
              to="/services"
              search={{ category: "Test Profiles" }}
              className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-primary text-primary-foreground font-display font-bold hover:scale-105 active:scale-95 transition-all shadow-glow"
            >
              {t("pkg_view_all")}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
