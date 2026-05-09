import { Link } from "@tanstack/react-router";
import { type MedicalTest, type TestProfile } from "@/lib/seed-data";
import { Clock, Home, Building2, ChevronRight, Activity, FlaskConical, Package } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import { useLanguage } from "@/lib/i18n.tsx";

interface ServiceCardProps {
  item: MedicalTest | TestProfile;
  index: number;
}

export function ServiceCard({ item, index }: ServiceCardProps) {
  const { t } = useLanguage();
  const isProfile = !("category" in item) || item.category === "Test Profiles"; // Adjust logic based on how you mark profiles
  // Actually since I updated interfaces:
  const isPackage = "includedTests" in item;
  
  const displayCategory = "category" in item ? item.category : "Health Package";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated hover:border-primary/20 transition-all"
    >
      {/* Card Content */}
      <div className="flex-1 p-6 flex flex-col">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2.5 py-0.5 rounded-full bg-secondary/50 text-[9px] font-bold uppercase tracking-widest text-primary border border-primary/10">
            {displayCategory}
          </span>
          {isPackage && (
            <span className="px-2.5 py-0.5 rounded-full bg-accent/20 text-[9px] font-bold uppercase tracking-widest text-accent-foreground">
              Package
            </span>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-display text-xl font-bold leading-tight group-hover:text-primary transition-colors">
            {item.name}
          </h3>
          
          <p className="mt-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Biomarkers / Included Tests Preview */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {isPackage ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-secondary text-[10px] font-bold uppercase tracking-wider text-secondary-foreground">
                <Activity className="h-3 w-3" />
                {item.includedTests?.length || 0} Tests Included
              </span>
            ) : (
              (item as any).biomarkers?.slice(0, 3).map((b: string) => (
                <span key={b} className="px-2 py-1 rounded bg-secondary text-[10px] font-medium text-secondary-foreground border border-border/50">
                  {b}
                </span>
              ))
            )}
            {!isPackage && ((item as any).biomarkers?.length || 0) > 3 && (
              <span className="px-2 py-1 text-[10px] font-medium text-muted-foreground">
                +{(item as any).biomarkers?.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Footer Meta Info */}
        <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {item.duration}
              </div>
              <div className="flex items-center gap-1.5">
                {item.availability === "Home" || item.availability === "Both" ? (
                  <div className="h-5 w-5 rounded-full bg-moss/10 flex items-center justify-center text-moss" title="Home Collection Available">
                    <Home className="h-3 w-3" />
                  </div>
                ) : null}
                {item.availability === "Lab" || item.availability === "Both" ? (
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary" title="In-Lab Only">
                    <Building2 className="h-3 w-3" />
                  </div>
                ) : null}
              </div>
            </div>
            
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-baseline gap-2">
                {item.price && !item.hidePrice && (
                  <>
                    <span className="text-lg font-display font-bold text-foreground">₹{item.discountPrice || item.price}</span>
                    {item.discountPrice && (
                      <span className="text-xs text-muted-foreground line-through opacity-60">₹{item.price}</span>
                    )}
                  </>
                )}
              </div>
              
              {item.price && item.discountPrice && (
                <div className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm uppercase tracking-tighter">
                  {Math.round(((item.price - item.discountPrice) / item.price) * 100)}% {t("discount_off")}
                </div>
              )}
            </div>
          </div>

          <Link
            to={`/services/${item.slug || item.id}` as any}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow group-hover:scale-110 transition-transform"
          >
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
