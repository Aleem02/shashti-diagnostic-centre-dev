import { Search, FlaskConical, Package, Home } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface ServicesHeroProps {
  totalTests: number;
  totalProfiles: number;
  homeAvailable: boolean;
}

export function ServicesHero({ totalTests, totalProfiles, homeAvailable }: ServicesHeroProps) {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-warm pt-16 pb-20 lg:pt-24 lg:pb-32">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 relative z-10">
        <div className="max-w-3xl">
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-foreground">
            {t("sv_hero_title_1")} <br />
            <span className="serif-italic text-primary">{t("sv_hero_title_2")}</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
            {t("sv_hero_desc")}
          </p>


          {/* Stats */}
          <div className="mt-12 flex flex-wrap gap-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FlaskConical className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-display font-bold leading-none">{totalTests}+</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mt-1">{t("sv_total_tests")}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-display font-bold leading-none">{totalProfiles}+</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mt-1">{t("sv_total_profiles")}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-moss/10 text-moss">
                <Home className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-display font-bold leading-none">Available</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mt-1">{t("services_home_avail")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
