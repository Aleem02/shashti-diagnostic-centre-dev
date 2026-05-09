import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTests, fetchTestProfiles } from "@/lib/tests-service";
import { TEST_CATEGORIES, type MedicalTest, type TestProfile } from "@/lib/seed-data";
import { ServicesHero } from "@/components/services/ServicesHero";
import { FilterBar } from "@/components/services/FilterBar";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ServiceGridSkeleton } from "@/components/services/SkeletonLoading";
import { EmptyState } from "@/components/services/EmptyState";
import { Breadcrumbs } from "@/components/SEO";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { useLanguage } from "@/lib/i18n.tsx";

const testSearchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  home: z.string().optional(),
});

export const Route = createFileRoute("/services/")({
  validateSearch: (search) => testSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Diagnostic Catalogue — Shashti Diagnostic Center" },
      { name: "description", content: "Explore our premium diagnostic catalogue. Over 500+ tests including blood work, health packages, and home collection services." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { t } = useLanguage();
  const { q = "", category: urlCategory = "All", home = "false" } = Route.useSearch();
  const navigate = Route.useNavigate();
  const resultsRef = useRef<HTMLDivElement>(null);

  // TanStack Query for optimized fetching
  const { data: tests = [], isLoading: loadingTests } = useQuery({
    queryKey: ["tests"],
    queryFn: fetchTests,
  });

  const { data: profiles = [], isLoading: loadingProfiles } = useQuery({
    queryKey: ["profiles"],
    queryFn: fetchTestProfiles,
  });

  const isLoading = loadingTests || loadingProfiles;

  const setQuery = (newQuery: string) => {
    navigate({ search: (prev) => ({ ...prev, q: newQuery || undefined }), resetScroll: false });
  };

  const setCategory = (newCat: string) => {
    navigate({ 
      search: (prev) => ({ ...prev, category: newCat === "All" ? undefined : newCat }),
      resetScroll: false
    });
  };

  const setHomeOnly = (val: boolean) => {
    navigate({ 
      search: (prev) => ({ ...prev, home: val ? "true" : undefined }),
      resetScroll: false
    });
  };

  const resetFilters = () => {
    navigate({ search: {}, resetScroll: false });
  };

  // Advanced Filtering Logic
  const filteredItems = useMemo(() => {
    let items: (MedicalTest | TestProfile)[] = [];
    
    if (urlCategory === "All") {
      items = [...tests, ...profiles];
    } else if (urlCategory === "Test Profiles") {
      items = profiles;
    } else if (urlCategory === "Tests") {
      items = tests;
    } else {
      // Handle biological categories if they exist in data
      items = [...tests, ...profiles].filter(i => (i as any).category === urlCategory);
    }

    return items.filter((item) => {
      const matchesSearch = q === "" || 
        item.name.toLowerCase().includes(q.toLowerCase()) ||
        item.description.toLowerCase().includes(q.toLowerCase()) ||
        (item as any).category?.toLowerCase().includes(q.toLowerCase()) ||
        ("biomarkers" in item && item.biomarkers?.some(b => b.toLowerCase().includes(q.toLowerCase())));

      const matchesHome = home === "false" || item.availability === "Home" || item.availability === "Both";

      return matchesSearch && matchesHome;
    });
  }, [tests, profiles, urlCategory, q, home]);

  return (
    <div className="min-h-screen bg-background">
      <ServicesHero 
        totalTests={tests.length}
        totalProfiles={profiles.length}
        homeAvailable={true}
      />

      <FilterBar 
        activeCategory={urlCategory}
        onCategoryChange={setCategory}
        homeOnly={home === "true"}
        onHomeOnlyChange={setHomeOnly}
        searchQuery={q}
        onSearchChange={setQuery}
      />

      <main ref={resultsRef} className="mx-auto max-w-[1400px] px-5 sm:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col gap-1">
            <Breadcrumbs />
            <h2 className="font-display text-2xl font-bold mt-2">
              {urlCategory === "All" ? t("sv_all_catalogue") : t(urlCategory)}
              <span className="ml-3 text-sm font-sans font-medium text-muted-foreground uppercase tracking-wider">
                {filteredItems.length} {t("sv_results_count")}
              </span>
            </h2>
          </div>
        </div>

        {isLoading ? (
          <ServiceGridSkeleton />
        ) : filteredItems.length === 0 ? (
          <EmptyState onReset={resetFilters} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, i) => (
                <ServiceCard key={item.id} item={item} index={i} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
