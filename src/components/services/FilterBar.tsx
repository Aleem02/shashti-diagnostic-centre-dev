import { cn } from "@/lib/utils";
import { TEST_CATEGORIES } from "@/lib/seed-data";
import { Filter, Home, Building2, Star, Search } from "lucide-react";
import { useLanguage } from "@/lib/i18n.tsx";

interface FilterBarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  homeOnly: boolean;
  onHomeOnlyChange: (val: boolean) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function FilterBar({ activeCategory, onCategoryChange, homeOnly, onHomeOnlyChange, searchQuery, onSearchChange }: FilterBarProps) {
  const { t } = useLanguage();
  return (
    <section className="sticky top-16 z-30 border-y border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0 -mx-5 px-5 sm:mx-0 sm:px-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/5 text-primary border border-primary/10 mr-1">
              <Filter className="h-4 w-4" />
            </div>
            
            {TEST_CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => onCategoryChange(c)}
                className={cn(
                  "shrink-0 rounded-full px-5 py-2 text-xs font-sans font-bold uppercase tracking-widest transition-all border",
                  activeCategory === c 
                    ? "bg-primary text-primary-foreground border-primary shadow-glow scale-105" 
                    : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                )}
              >
                {t(c)}
              </button>
            ))}
          </div>

          <div className="flex-1 max-w-md mx-4">
            <div className="relative flex items-center group">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t("sv_search_placeholder")}
                className="w-full bg-card border border-border rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onHomeOnlyChange(!homeOnly)}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-all",
                homeOnly 
                  ? "bg-moss text-moss-foreground border-moss shadow-sm" 
                  : "bg-card text-muted-foreground border-border hover:border-moss/30"
              )}
            >
              <Home className="h-3.5 w-3.5" />
              {t("sv_home_only")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
